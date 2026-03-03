import { z } from "zod";

export const draftVariantSchema = z.object({
  label: z.string(),
  hook: z.array(z.string()).min(1).max(3),
  body: z.string().min(40),
  ctaQuestion: z.string().min(8),
  tags: z.array(z.string()).min(1).max(8)
});

export const draftPayloadSchema = z.object({
  seriesTitle: z.string().min(2).optional(),
  episodeNumber: z.number().int().min(1).optional(),
  episodeLabel: z.string().min(2).optional(),
  hook: z.array(z.string()).min(1).max(3),
  body: z.string().min(80),
  ctaQuestion: z.string().min(8),
  tags: z.array(z.string()).min(1).max(8),
  sensitivityFlags: z.array(z.string()),
  variants: z.array(draftVariantSchema).max(2),
  storySummary: z.string().min(20).optional(),
  nextEpisodeHook: z.string().min(12).optional(),
  characters: z.array(z.string()).max(6).optional()
});

export type DraftPayloadSchema = z.infer<typeof draftPayloadSchema>;
