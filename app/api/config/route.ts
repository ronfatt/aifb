import { NextResponse } from "next/server";
import { z } from "zod";
import { defaultPageConfig } from "@/lib/default-page-config";
import { getPageConfig, getPrimaryPageConfig, upsertPageConfig } from "@/lib/repositories/config-repository";

const storySlotSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  seriesTitle: z.string().min(1),
  contentType: z.string().min(1),
  tone: z.string().min(1),
  targetEmotion: z.string().min(1),
  imageStyle: z.string().min(1).optional(),
  characters: z.array(z.string().min(1)).min(1)
});

const pageConfigSchema = z.object({
  pageId: z.string().min(1),
  pageName: z.string().min(1),
  publishFrequencyPerDay: z.number().int().min(1).max(3),
  dryRun: z.boolean(),
  imageGenerationEnabled: z.boolean(),
  imageStyle: z.string().min(1),
  language: z.literal("ms-MY"),
  tone: z.string().min(1),
  contentTypes: z.array(z.string().min(1)).min(1),
  targetEmotions: z.array(z.string().min(1)).min(1),
  constraints: z.array(z.string().min(1)).min(1),
  ctaStyles: z.array(z.string().min(1)).min(1),
  hookPatterns: z.array(z.string().min(1)).min(1),
  storySlots: z.array(storySlotSchema).min(1)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");
  const config = pageId ? await getPageConfig(pageId) : await getPrimaryPageConfig();

  return NextResponse.json({
    ok: true,
    config
  });
}

export async function POST(request: Request) {
  const payload = pageConfigSchema.parse(await request.json());
  const config = await upsertPageConfig(payload);

  return NextResponse.json({
    ok: true,
    config
  });
}
