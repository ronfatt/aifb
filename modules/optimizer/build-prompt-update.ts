import type { MetricSnapshot, PromptProfileUpdate } from "@/types/workflow";

export function buildPromptUpdate(pageId: string, metrics: MetricSnapshot[]): PromptProfileUpdate {
  const liveMetrics = metrics.filter((item) => item.sourceMode !== "mock");
  const ignoredMockCount = metrics.length - liveMetrics.length;
  const averageEngagement =
    liveMetrics.length === 0 ? 0 : liveMetrics.reduce((sum, item) => sum + item.engagementRate, 0) / liveMetrics.length;

  return {
    pageId,
    summary: `Average engagement rate: ${averageEngagement.toFixed(2)} from ${liveMetrics.length} live posts. Ignored ${ignoredMockCount} mock posts. Prioritize shorter hooks and stronger conflict.`,
    recommendedTone: "emotional-realistic",
    recommendedHooks: ["confessional opening", "hard truth in line 1", "contrast-based hook"],
    contentTypeWeights: {
      story_long: 0.5,
      short_rant: 0.3,
      listicle: 0.2
    }
  };
}
