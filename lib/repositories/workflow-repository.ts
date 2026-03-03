import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  DraftPayload,
  LatestPublishedSummary,
  MetricSnapshot,
  PublishListItem,
  PublishResult,
  QaResult,
  RunListItem,
  RunStatus,
  StoryContext
} from "@/types/workflow";

interface CreateRunInput {
  runId: string;
  pageId: string;
  workflowName: string;
  status: RunStatus;
  meta?: Record<string, unknown>;
}

interface CreateDraftInput {
  runId: string;
  pageId: string;
  draft: DraftPayload;
  qa: QaResult;
  formattedText?: string;
  contentHash: string;
  reviewStatus?: string;
}

interface CreatePostInput {
  draftId?: string;
  pageId: string;
  contentHash: string;
  publish: PublishResult;
  publishedAt: string;
}

export async function createRunRecord(input: CreateRunInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("runs")
    .insert({
      run_id: input.runId,
      page_id: input.pageId,
      workflow_name: input.workflowName,
      status: input.status,
      meta: input.meta ?? {}
    })
    .select("id, run_id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function completeRunRecord(runId: string, status: RunStatus, errorMessage?: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { error } = await supabase
    .from("runs")
    .update({
      status,
      completed_at: new Date().toISOString(),
      error_message: errorMessage ?? null
    })
    .eq("run_id", runId);

  if (error) {
    throw error;
  }

  return true;
}

export async function getRecentFormattedTexts(pageId: string, limit = 30) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("drafts")
    .select("formatted_text")
    .eq("page_id", pageId)
    .not("formatted_text", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []).flatMap((row) => (row.formatted_text ? [row.formatted_text] : []));
}

export async function getLatestStoryContext(pageId: string): Promise<StoryContext | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("drafts")
    .select("draft_json, published_at, created_at, qa_status")
    .eq("page_id", pageId)
    .eq("qa_status", "PASS")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const draft = (data?.draft_json as DraftPayload | null) ?? null;
  if (!draft) {
    return null;
  }

  return {
    seriesTitle: draft.seriesTitle,
    nextEpisodeNumber: typeof draft.episodeNumber === "number" ? draft.episodeNumber + 1 : 1,
    previousEpisodeSummary: draft.storySummary ?? draft.body.slice(0, 240),
    unresolvedThread: draft.nextEpisodeHook,
    characters: draft.characters ?? []
  };
}

export async function createDraftRecord(input: CreateDraftInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("drafts")
    .insert({
      run_id: input.runId,
      page_id: input.pageId,
      draft_json: input.draft,
      qa_result_json: input.qa,
      formatted_text: input.formattedText ?? null,
      content_hash: input.contentHash,
      qa_status: input.qa.status,
      review_status: input.reviewStatus ?? "PASS_AUTO"
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function markDraftPublished(draftId: string, publishedAt: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { error } = await supabase
    .from("drafts")
    .update({
      published_at: publishedAt
    })
    .eq("id", draftId);

  if (error) {
    throw error;
  }

  return true;
}

export async function createPostRecord(input: CreatePostInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !input.publish.fbPostId) {
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      draft_id: input.draftId ?? null,
      page_id: input.pageId,
      fb_post_id: input.publish.fbPostId,
      publish_mode: input.publish.mode ?? "live",
      content_hash: input.contentHash,
      status: input.publish.success ? "published" : "failed",
      published_at: input.publishedAt
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createMetricSnapshotRecord(postId: string, snapshot: MetricSnapshot) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { error } = await supabase.from("post_metrics_snapshots").insert({
    post_id: postId,
    snapshot_at: snapshot.snapshotAt,
    likes: snapshot.likes,
    comments: snapshot.comments,
    shares: snapshot.shares,
    reach: snapshot.reach,
    engagement_rate: snapshot.engagementRate
  });

  if (error) {
    throw error;
  }

  const metricDate = snapshot.snapshotAt.slice(0, 10);
  const { error: upsertError } = await supabase.from("metrics_daily").upsert(
    {
      post_id: postId,
      metric_date: metricDate,
      likes: snapshot.likes,
      comments: snapshot.comments,
      shares: snapshot.shares,
      reach: snapshot.reach,
      engagement_rate: snapshot.engagementRate
    },
    { onConflict: "post_id,metric_date" }
  );

  if (upsertError) {
    throw upsertError;
  }

  return true;
}

export async function getRecentPublishedPosts(pageId: string, limit = 20) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("id, fb_post_id, publish_mode")
    .eq("page_id", pageId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    fbPostId: row.fb_post_id as string,
    publishMode: (row.publish_mode as "live" | "mock") ?? "live"
  }));
}

export async function getRecentRuns(pageId: string, limit = 10): Promise<RunListItem[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("runs")
    .select("run_id, page_id, workflow_name, status, started_at, completed_at, error_message, meta")
    .eq("page_id", pageId)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => {
    const meta = (row.meta as Record<string, unknown> | null) ?? {};

    return {
      runId: row.run_id as string,
      pageId: row.page_id as string,
      workflowName: row.workflow_name as string,
      status: row.status as RunStatus,
      startedAt: row.started_at as string,
      completedAt: (row.completed_at as string | null) ?? null,
      errorMessage: (row.error_message as string | null) ?? null,
      contentType: typeof meta.contentType === "string" ? meta.contentType : undefined,
      tone: typeof meta.tone === "string" ? meta.tone : undefined
    };
  });
}

export async function getRecentPublishes(pageId: string, limit = 10): Promise<PublishListItem[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("id, fb_post_id, page_id, status, publish_mode, published_at")
    .eq("page_id", pageId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    postId: row.id as string,
    fbPostId: row.fb_post_id as string,
    pageId: row.page_id as string,
    status: row.status as string,
    publishMode: (row.publish_mode as "live" | "mock") ?? "live",
    publishedAt: row.published_at as string
  }));
}

export async function getLatestPublishedSummary(pageId: string): Promise<LatestPublishedSummary | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("id, fb_post_id, publish_mode, published_at, drafts(formatted_text)")
    .eq("page_id", pageId)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const draftRelation = data.drafts as { formatted_text?: string | null } | { formatted_text?: string | null }[] | null;
  const formattedText = Array.isArray(draftRelation)
    ? (draftRelation[0]?.formatted_text ?? null)
    : (draftRelation?.formatted_text ?? null);

  return {
    postId: data.id as string,
    fbPostId: data.fb_post_id as string,
    publishedAt: data.published_at as string,
    publishMode: (data.publish_mode as "live" | "mock") ?? "live",
    formattedText
  };
}
