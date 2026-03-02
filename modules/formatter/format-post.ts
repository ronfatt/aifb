import type { DraftPayload } from "@/types/workflow";

export function formatPost(draft: DraftPayload) {
  return [...draft.hook, "", draft.body, "", draft.ctaQuestion, "", draft.tags.join(" ")].join("\n");
}
