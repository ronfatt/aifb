import {
  buildGraphUrl,
  classifyMetaError,
  getMetaPageToken,
  MetaApiError,
  shouldRetryMetaError
} from "@/lib/meta";
import { withRetry } from "@/lib/retry";
import type { PublishPayload, PublishResult } from "@/types/workflow";

export async function publishPost(payload: PublishPayload): Promise<PublishResult> {
  const pageToken = getMetaPageToken();
  if (!pageToken) {
    return {
      success: true,
      fbPostId: `mock_${payload.pageId}_${Date.now()}`,
      error: "META_PAGE_ACCESS_TOKEN not configured; returned mock publish result",
      mode: "mock",
      attempts: 0
    };
  }

  let attempts = 0;

  try {
    const json = await withRetry(
      async (attempt) => {
        attempts = attempt;

        let attachedMediaFbid: string | undefined;

        if (payload.image) {
          const photoForm = new FormData();
          photoForm.set("published", "false");
          photoForm.set("access_token", pageToken);
          photoForm.set(
            "source",
            new Blob([Buffer.from(payload.image.bytes)], {
              type: payload.image.mimeType
            }),
            payload.image.filename
          );

          const photoResponse = await fetch(buildGraphUrl(`/${payload.pageId}/photos`), {
            method: "POST",
            body: photoForm
          });
          const photoJson = (await photoResponse.json()) as {
            id?: string;
            error?: { message?: string; code?: number; error_subcode?: number };
          };

          if (!photoResponse.ok || !photoJson.id) {
            throw new MetaApiError({
              message: photoJson.error?.message || `Meta photo upload failed with status ${photoResponse.status}`,
              status: photoResponse.status,
              code: photoJson.error?.code,
              subcode: photoJson.error?.error_subcode,
              errorType: classifyMetaError(photoResponse.status, photoJson),
              payload: photoJson as Record<string, unknown>
            });
          }

          attachedMediaFbid = photoJson.id;
        }

        const body = new URLSearchParams();
        body.set("message", payload.message);
        body.set("access_token", pageToken);

        if (payload.link) {
          body.set("link", payload.link);
        }

        if (attachedMediaFbid) {
          body.set("attached_media[0]", JSON.stringify({ media_fbid: attachedMediaFbid }));
        }

        const response = await fetch(buildGraphUrl(`/${payload.pageId}/feed`), {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: body.toString()
        });

        const json = (await response.json()) as { id?: string; error?: { message?: string; code?: number; error_subcode?: number } };
        if (!response.ok || !json.id) {
          throw new MetaApiError({
            message: json.error?.message || `Meta publish failed with status ${response.status}`,
            status: response.status,
            code: json.error?.code,
            subcode: json.error?.error_subcode,
            errorType: classifyMetaError(response.status, json),
            payload: json as Record<string, unknown>
          });
        }

        return json;
      },
      {
        retries: 3,
        baseDelayMs: 600,
        shouldRetry: shouldRetryMetaError
      }
    );

    return {
      success: true,
      fbPostId: json.id,
      mode: "live",
      attempts,
      rawResponse: json as Record<string, unknown>
    };
  } catch (error) {
    if (error instanceof MetaApiError) {
      return {
        success: false,
        error: error.message,
        mode: "live",
        attempts,
        errorType: error.errorType,
        rawResponse: error.payload
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown publish failure",
      mode: "live",
      attempts,
      errorType: "unknown"
    };
  }
}
