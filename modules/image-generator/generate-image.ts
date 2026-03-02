import { env } from "@/lib/env";
import type { DraftPayload, GenerateInput } from "@/types/workflow";

interface GeneratedImageAsset {
  bytes: Uint8Array;
  mimeType: string;
  filename: string;
}

function buildImagePrompt(input: GenerateInput, draft: DraftPayload) {
  return [
    "Create a single compelling Facebook post image.",
    "No text overlay, no watermark, no logos.",
    "Human, emotionally grounded, realistic but cinematic.",
    `Style: ${input.imageStyle || "cinematic human realism"}.`,
    `Tone: ${input.tone}.`,
    `Emotion arc: ${input.targetEmotion}.`,
    `Hook context: ${draft.hook.join(" ")}`,
    `Body summary: ${draft.body.slice(0, 280)}`
  ].join(" ");
}

export async function generatePostImage(input: GenerateInput, draft: DraftPayload): Promise<GeneratedImageAsset | null> {
  if (!input.imageGenerationEnabled) {
    return null;
  }

  if (!env.OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt: buildImagePrompt(input, draft),
      size: "1536x1024"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI image generation failed with status ${response.status}: ${errorText}`);
  }

  const json = (await response.json()) as {
    data?: Array<{
      b64_json?: string;
    }>;
  };

  const base64 = json.data?.[0]?.b64_json;
  if (!base64) {
    throw new Error("OpenAI image generation returned no image bytes");
  }

  const bytes = Uint8Array.from(Buffer.from(base64, "base64"));

  return {
    bytes,
    mimeType: "image/png",
    filename: `post-${Date.now()}.png`
  };
}
