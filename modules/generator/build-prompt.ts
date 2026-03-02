import type { GenerateInput } from "@/types/workflow";

export function buildSystemPrompt() {
  return [
    "You generate Malay Facebook Page posts as strict JSON only.",
    "Write in natural colloquial Malay used in Malaysia.",
    "Do not invent news, crimes, accusations, or identifiable real-person claims.",
    "Avoid religion, race, hate, medical advice, and political agitation unless explicitly allowed.",
    "Return short punchy hooks, a readable body, a conversation-driving CTA question, and 3-8 hashtags.",
    "The output must be emotionally strong but still human, not spammy or robotic."
  ].join(" ");
}

export function buildUserPrompt(input: GenerateInput) {
  return [
    `page_id: ${input.pageId}`,
    `content_type: ${input.contentType}`,
    `tone: ${input.tone}`,
    `target_emotion: ${input.targetEmotion}`,
    `target_length_words: ${input.lengthWords}`,
    `language: ${input.language}`,
    `constraints: ${input.constraints.join(" | ")}`,
    "",
    "Return JSON with this shape:",
    "{",
    '  "hook": ["line 1", "line 2"],',
    '  "body": "main body",',
    '  "ctaQuestion": "question",',
    '  "tags": ["#tag1", "#tag2"],',
    '  "sensitivityFlags": [],',
    '  "variants": [{"label":"B","hook":["..."],"body":"...","ctaQuestion":"...","tags":["#..."]}]',
    "}",
    "",
    "Requirements:",
    "- The hook should be 1-3 short lines.",
    "- The body should feel like a human Facebook post, not an essay.",
    "- The CTA should invite comments, not generic likes.",
    "- Keep hashtags concise and relevant."
  ].join("\n");
}
