import type { PageConfig } from "@/types/config";

export const defaultPageConfig: PageConfig = {
  pageId: "PAGE_A",
  pageName: "Malay Viral Stories",
  publishFrequencyPerDay: 1,
  dryRun: true,
  imageGenerationEnabled: true,
  imageStyle: "cinematic human realism, warm editorial lighting, facebook-friendly portrait poster",
  language: "ms-MY",
  tone: "dramatic-serial-realistic",
  contentTypes: ["story_serial", "story_long"],
  targetEmotions: ["suspense", "heartbreak", "anger_to_hope"],
  constraints: [
    "no real person accusation",
    "no hate",
    "no religious conflict",
    "no racial conflict",
    "no medical advice"
  ],
  ctaStyles: ["what-happens-next", "what-would-you-do", "team-choice"],
  hookPatterns: ["cliffhanger", "secret-reveal", "family-conflict"]
};
