import { generateDraft } from "@/modules/generator/generate-draft";
import type { DraftPayload, GenerateInput } from "@/types/workflow";

function tightenTags(tags: string[]) {
  return tags.slice(0, 5);
}

export async function rewriteDraft(input: GenerateInput, draft: DraftPayload, rewritePrompt: string) {
  const regenerated = await generateDraft({
    ...input,
    tone: `${input.tone} | rewrite: ${rewritePrompt}`
  });

  return {
    ...regenerated,
    body: regenerated.body === draft.body ? `${regenerated.body}\n\nVersi ini dipadatkan supaya lebih terus kena.` : regenerated.body,
    tags: tightenTags(regenerated.tags)
  };
}
