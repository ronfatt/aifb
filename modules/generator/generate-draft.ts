import { env } from "@/lib/env";
import { generateDraftWithMock } from "@/modules/generator/providers/mock-provider";
import { generateDraftWithOpenAI } from "@/modules/generator/providers/openai-provider";
import { draftPayloadSchema } from "@/modules/generator/schema";
import type { DraftPayload, GenerateInput } from "@/types/workflow";

export async function generateDraft(input: GenerateInput): Promise<DraftPayload> {
  const provider = env.LLM_PROVIDER ?? (env.OPENAI_API_KEY ? "openai" : "mock");
  let draft: DraftPayload;

  if (provider === "openai") {
    try {
      draft = await generateDraftWithOpenAI(input);
    } catch (error) {
      console.error("OpenAI generation failed, falling back to mock draft.", error);
      draft = await generateDraftWithMock();
    }
  } else {
    draft = await generateDraftWithMock();
  }

  return draftPayloadSchema.parse(draft);
}
