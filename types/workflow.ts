export type QaStatus = "PASS" | "SOFT_FAIL" | "HARD_FAIL";

export type RunStatus = "queued" | "running" | "completed" | "failed";

export interface GenerateInput {
  pageId: string;
  storySlot?: string;
  contentType: string;
  tone: string;
  targetEmotion: string;
  lengthWords: number;
  constraints: string[];
  language: "ms-MY";
  dryRun?: boolean;
  imageGenerationEnabled?: boolean;
  imageStyle?: string;
  storyContext?: StoryContext;
}

export interface StoryContext {
  seriesTitle?: string;
  nextEpisodeNumber: number;
  previousEpisodeSummary?: string;
  unresolvedThread?: string;
  characters?: string[];
}

export interface DraftVariant {
  label: string;
  hook: string[];
  body: string;
  ctaQuestion: string;
  tags: string[];
}

export interface DraftPayload {
  seriesTitle?: string;
  episodeNumber?: number;
  episodeLabel?: string;
  hook: string[];
  body: string;
  ctaQuestion: string;
  tags: string[];
  sensitivityFlags: string[];
  variants: DraftVariant[];
  storySummary?: string;
  nextEpisodeHook?: string;
  characters?: string[];
}

export interface QaResult {
  status: QaStatus;
  notes: string[];
  rewritePrompt?: string;
  similarityScore: number;
  attempt?: number;
}

export interface PublishPayload {
  pageId: string;
  message: string;
  link?: string;
  image?: {
    bytes: Uint8Array;
    mimeType: string;
    filename: string;
  };
}

export interface PublishResult {
  success: boolean;
  fbPostId?: string;
  error?: string;
  mode?: "live" | "mock";
  attempts?: number;
  errorType?: "auth" | "rate_limit" | "transient" | "validation" | "unknown";
  rawResponse?: Record<string, unknown>;
}

export interface MetricSnapshot {
  postId: string;
  snapshotAt: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagementRate: number;
  sourceMode?: "live" | "mock";
  fetchAttempts?: number;
  errorType?: "auth" | "rate_limit" | "transient" | "validation" | "unknown";
}

export interface PromptProfileUpdate {
  pageId: string;
  summary: string;
  recommendedTone?: string;
  recommendedHooks: string[];
  contentTypeWeights: Record<string, number>;
}

export interface WorkflowRunSummary {
  runId: string;
  status: RunStatus;
  draft?: DraftPayload;
  originalDraft?: DraftPayload;
  qa?: QaResult;
  qaAttempts?: QaResult[];
  formattedText?: string;
  imageGenerated?: boolean;
  publish?: PublishResult;
  persisted?: {
    draftId?: string;
    postId?: string;
  };
}

export interface RunListItem {
  runId: string;
  pageId: string;
  workflowName: string;
  status: RunStatus;
  startedAt: string;
  completedAt?: string | null;
  errorMessage?: string | null;
  contentType?: string;
  tone?: string;
}

export interface PublishListItem {
  postId: string;
  fbPostId: string;
  pageId: string;
  status: string;
  publishMode: "live" | "mock";
  publishedAt: string;
}

export interface LatestPublishedSummary {
  postId: string;
  fbPostId: string;
  publishedAt: string;
  publishMode: "live" | "mock";
  formattedText?: string | null;
}
