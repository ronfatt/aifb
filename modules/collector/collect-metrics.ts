import {
  buildGraphUrl,
  classifyMetaError,
  getMetaPageToken,
  MetaApiError,
  shouldRetryMetaError
} from "@/lib/meta";
import { withRetry } from "@/lib/retry";
import type { MetricSnapshot } from "@/types/workflow";

interface MetaErrorPayload {
  error?: {
    message?: string;
    code?: number;
    error_subcode?: number;
  };
}

async function fetchJsonWithMetaRetry<T extends MetaErrorPayload>(url: string) {
  let attempts = 0;

  try {
    const json = await withRetry(
      async (attempt) => {
        attempts = attempt;
        const response = await fetch(url);
        const payload = (await response.json()) as T;

        if (!response.ok) {
          throw new MetaApiError({
            message: payload.error?.message || `Meta request failed with status ${response.status}`,
            status: response.status,
            code: payload.error?.code,
            subcode: payload.error?.error_subcode,
            errorType: classifyMetaError(response.status, payload),
            payload: payload as Record<string, unknown>
          });
        }

        return payload;
      },
      {
        retries: 3,
        baseDelayMs: 600,
        shouldRetry: shouldRetryMetaError
      }
    );

    return { ok: true as const, json, attempts };
  } catch (error) {
    if (error instanceof MetaApiError) {
      return {
        ok: false as const,
        attempts,
        errorType: error.errorType
      };
    }

    return {
      ok: false as const,
      attempts,
      errorType: "unknown" as const
    };
  }
}

export async function collectMetrics(postId: string, fbPostId?: string): Promise<MetricSnapshot> {
  const snapshotAt = new Date().toISOString();
  const pageToken = getMetaPageToken();

  if (!pageToken || !fbPostId) {
    return {
      postId,
      snapshotAt,
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0,
      engagementRate: 0,
      sourceMode: "mock",
      fetchAttempts: 0
    };
  }

  const [postRequest, commentsRequest, reactionsRequest] = await Promise.all([
    fetchJsonWithMetaRetry<
      MetaErrorPayload & {
        id?: string;
        created_time?: string;
        permalink_url?: string;
        message?: string;
        shares?: { count?: number };
      }
    >(
      buildGraphUrl(
        `/${fbPostId}`,
        new URLSearchParams({
          fields: "id,created_time,permalink_url,message,shares",
          access_token: pageToken
        })
      )
    ),
    fetchJsonWithMetaRetry<MetaErrorPayload & { summary?: { total_count?: number } }>(
      buildGraphUrl(`/${fbPostId}/comments`, new URLSearchParams({ summary: "true", access_token: pageToken }))
    ),
    fetchJsonWithMetaRetry<MetaErrorPayload & { summary?: { total_count?: number } }>(
      buildGraphUrl(`/${fbPostId}/reactions`, new URLSearchParams({ summary: "true", access_token: pageToken }))
    )
  ]);

  const shares = postRequest.ok ? postRequest.json.shares?.count ?? 0 : 0;
  const comments = commentsRequest.ok ? commentsRequest.json.summary?.total_count ?? 0 : 0;
  const likes = reactionsRequest.ok ? reactionsRequest.json.summary?.total_count ?? 0 : 0;
  const fetchAttempts = Math.max(postRequest.attempts, commentsRequest.attempts, reactionsRequest.attempts);
  const errorType = [commentsRequest, reactionsRequest, postRequest].find((item) => !item.ok)?.errorType;

  return {
    postId,
    snapshotAt,
    likes,
    comments,
    shares,
    reach: 0,
    engagementRate: 0,
    sourceMode: "live",
    fetchAttempts,
    errorType
  };
}
