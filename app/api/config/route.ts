import { NextResponse } from "next/server";
import { z } from "zod";
import { defaultPageConfig } from "@/lib/default-page-config";
import { getPageConfig, upsertPageConfig } from "@/lib/repositories/config-repository";

const pageConfigSchema = z.object({
  pageId: z.string().min(1),
  pageName: z.string().min(1),
  publishFrequencyPerDay: z.number().int().min(1).max(2),
  dryRun: z.boolean(),
  imageGenerationEnabled: z.boolean(),
  imageStyle: z.string().min(1),
  language: z.literal("ms-MY"),
  tone: z.string().min(1),
  contentTypes: z.array(z.string().min(1)).min(1),
  targetEmotions: z.array(z.string().min(1)).min(1),
  constraints: z.array(z.string().min(1)).min(1),
  ctaStyles: z.array(z.string().min(1)).min(1),
  hookPatterns: z.array(z.string().min(1)).min(1)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId") || defaultPageConfig.pageId;
  const config = await getPageConfig(pageId);

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
