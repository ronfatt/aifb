import type { DraftPayload, QaResult } from "@/types/workflow";

const blockedTerms = ["racist", "kafir", "bodoh", "bunuh"];

export async function runQa(draft: DraftPayload, recentTexts: string[] = [], attempt = 1): Promise<QaResult> {
  const notes: string[] = [];
  const joinedText = `${draft.hook.join(" ")} ${draft.body} ${draft.ctaQuestion}`.toLowerCase();

  if (blockedTerms.some((term) => joinedText.includes(term))) {
    return {
      status: "HARD_FAIL",
      notes: ["Blocked term detected"],
      similarityScore: 0,
      attempt
    };
  }

  const duplicateMatch = recentTexts.find((text) => text.toLowerCase() === joinedText);
  if (duplicateMatch) {
    return {
      status: "SOFT_FAIL",
      notes: ["Exact duplicate with recent post"],
      rewritePrompt: "Regenerate with a new hook, different CTA, and a different anecdotal frame.",
      similarityScore: 1,
      attempt
    };
  }

  if (draft.hook.length === 0 || draft.ctaQuestion.trim().length < 10) {
    notes.push("Weak hook or CTA structure");
  }

  if (draft.tags.length > 8) {
    notes.push("Too many hashtags");
  }

  return {
    status: notes.length > 0 ? "SOFT_FAIL" : "PASS",
    notes,
    rewritePrompt: notes.length > 0 ? "Tighten hook and strengthen the final question." : undefined,
    similarityScore: 0.12,
    attempt
  };
}
