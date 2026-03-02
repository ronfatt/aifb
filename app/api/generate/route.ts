import { NextResponse } from "next/server";
import { z } from "zod";
import { generateDraft } from "@/modules/generator/generate-draft";

const requestSchema = z.object({
  pageId: z.string(),
  contentType: z.string(),
  tone: z.string(),
  targetEmotion: z.string(),
  lengthWords: z.number().int().positive(),
  constraints: z.array(z.string()),
  language: z.literal("ms-MY")
});

export async function POST(request: Request) {
  const payload = requestSchema.parse(await request.json());
  const draft = await generateDraft(payload);

  return NextResponse.json({
    ok: true,
    draft
  });
}
