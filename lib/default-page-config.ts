import type { PageConfig } from "@/types/config";

export const defaultPageConfig: PageConfig = {
  pageId: "PAGE_A",
  pageName: "Malay Viral Stories",
  publishFrequencyPerDay: 1,
  dryRun: true,
  imageGenerationEnabled: true,
  imageStyle: "cinematic human realism, warm editorial lighting, facebook-friendly portrait poster",
  language: "ms-MY",
  tone: "emotional-realistic",
  contentTypes: ["story_long", "short_rant"],
  targetEmotions: ["anger_to_hope", "relief", "validation"],
  constraints: [
    "no real person accusation",
    "no hate",
    "no religious conflict",
    "no racial conflict",
    "no medical advice"
  ],
  ctaStyles: ["question", "vote", "what-would-you-do"],
  hookPatterns: ["confessional", "hard-truth", "social-contrast"]
};
