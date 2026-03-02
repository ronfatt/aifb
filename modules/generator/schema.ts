import { z } from "zod";

export const draftVariantSchema = z.object({
  label: z.string(),
  hook: z.array(z.string()).min(1).max(3),
  body: z.string().min(40),
  ctaQuestion: z.string().min(8),
  tags: z.array(z.string()).min(1).max(8)
});

export const draftPayloadSchema = z.object({
  hook: z.array(z.string()).min(1).max(3),
  body: z.string().min(80),
  ctaQuestion: z.string().min(8),
  tags: z.array(z.string()).min(1).max(8),
  sensitivityFlags: z.array(z.string()),
  variants: z.array(draftVariantSchema).max(2)
});

export type DraftPayloadSchema = z.infer<typeof draftPayloadSchema>;
