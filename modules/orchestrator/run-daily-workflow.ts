import {
  completeRunRecord,
  createDraftRecord,
  createPostRecord,
  createRunRecord,
  getRecentFormattedTexts,
  markDraftPublished
} from "@/lib/repositories/workflow-repository";
import { createRunId, hashContent } from "@/lib/utils";
import { formatPost } from "@/modules/formatter/format-post";
import { generateDraft } from "@/modules/generator/generate-draft";
import { generatePostImage } from "@/modules/image-generator/generate-image";
import { rewriteDraft } from "@/modules/generator/rewrite-draft";
import { publishPost } from "@/modules/publisher/publish-post";
import { runQa } from "@/modules/qa/run-qa";
import type { GenerateInput, QaResult, WorkflowRunSummary } from "@/types/workflow";

export async function runDailyWorkflow(input: GenerateInput): Promise<WorkflowRunSummary> {
  const runId = createRunId();
  await createRunRecord({
    runId,
    pageId: input.pageId,
    workflowName: "daily-run",
    status: "running",
    meta: {
      contentType: input.contentType,
      tone: input.tone
    }
  });

  const recentTexts = await getRecentFormattedTexts(input.pageId, 30);
  const originalDraft = await generateDraft(input);
  const qaAttempts: QaResult[] = [];
  let draft = originalDraft;
  let qa = await runQa(draft, recentTexts, 1);
  qaAttempts.push(qa);

  if (qa.status === "SOFT_FAIL" && qa.rewritePrompt) {
    draft = await rewriteDraft(input, draft, qa.rewritePrompt);
    qa = await runQa(draft, recentTexts, 2);
    qaAttempts.push(qa);
  }

  const contentHash = hashContent(JSON.stringify(draft));

  if (qa.status !== "PASS") {
    const draftRecord = await createDraftRecord({
      runId,
      pageId: input.pageId,
      draft,
      qa,
      contentHash,
      reviewStatus: qa.status === "SOFT_FAIL" ? "REWRITE" : "REJECT"
    });
    await completeRunRecord(runId, "failed", qa.notes.join("; ") || qa.status);

    return {
      runId,
      status: "failed",
      draft,
      originalDraft: draft === originalDraft ? undefined : originalDraft,
      qa,
      qaAttempts,
      persisted: {
        draftId: draftRecord?.id
      }
    };
  }

  const formattedText = formatPost(draft);
  const publishedAt = new Date().toISOString();
  const image = await generatePostImage(input, draft);
  const draftRecord = await createDraftRecord({
    runId,
    pageId: input.pageId,
    draft,
    qa,
    formattedText,
    contentHash
  });
  if (input.dryRun) {
    await completeRunRecord(runId, "completed");

    return {
      runId,
      status: "completed",
      draft,
      originalDraft: draft === originalDraft ? undefined : originalDraft,
      qa,
      qaAttempts,
      formattedText,
      imageGenerated: Boolean(image),
      publish: {
        success: true,
        mode: "mock",
        attempts: 0,
        error: "Dry run enabled: content generated and stored, but not published."
      },
      persisted: {
        draftId: draftRecord?.id
      }
    };
  }

  const publish = await publishPost({
    pageId: input.pageId,
    message: formattedText,
    image: image ?? undefined
  });
  const postRecord =
    publish.success && publish.fbPostId
      ? await createPostRecord({
          draftId: draftRecord?.id,
          pageId: input.pageId,
          contentHash,
          publish,
          publishedAt
        })
      : null;
  if (publish.success && draftRecord?.id) {
    await markDraftPublished(draftRecord.id, publishedAt);
  }
  await completeRunRecord(runId, publish.success ? "completed" : "failed", publish.error);

  return {
    runId,
    status: publish.success ? "completed" : "failed",
    draft,
    originalDraft: draft === originalDraft ? undefined : originalDraft,
    qa,
    qaAttempts,
    formattedText,
    imageGenerated: Boolean(image),
    publish,
    persisted: {
      draftId: draftRecord?.id,
      postId: postRecord?.id
    }
  };
}
