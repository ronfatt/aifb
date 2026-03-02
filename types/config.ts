export interface PageConfig {
  pageId: string;
  pageName: string;
  publishFrequencyPerDay: number;
  dryRun: boolean;
  imageGenerationEnabled: boolean;
  imageStyle: string;
  language: "ms-MY";
  tone: string;
  contentTypes: string[];
  targetEmotions: string[];
  constraints: string[];
  ctaStyles: string[];
  hookPatterns: string[];
}
