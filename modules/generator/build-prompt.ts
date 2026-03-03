import type { GenerateInput } from "@/types/workflow";

export function buildSystemPrompt() {
  return [
    "You generate Malay Facebook Page posts as strict JSON only.",
    "Write in natural colloquial Malay used in Malaysia.",
    "Default to short-serial fiction energy: dramatic, human, scene-based, and addictive to continue reading.",
    "Every post should feel like one episode from a viral Facebook novel or mini drama, not a motivational essay.",
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
    "- The hook should be 1-3 short lines and must create immediate curiosity, tension, or shock.",
    "- The body should read like a compact short story episode with named or clearly defined characters, setting, conflict, escalation, and one emotional turning point.",
    "- Avoid abstract preaching. Use scenes, dialogue fragments, secrets, betrayal, family pressure, money problems, hidden past, or relationship conflict when appropriate.",
    "- Make readers want the next episode. End the body with a soft cliffhanger or unresolved emotional consequence.",
    "- The CTA should invite comments about what the reader thinks happens next or what the character should do next, not generic likes.",
    "- Keep hashtags concise and relevant.",
    "- Write in paragraph rhythm suitable for Facebook: short paragraphs, easy to scan, strong story flow.",
    "- Prefer drama-serial energy over rant energy unless the input explicitly asks for rant."
  ].join("\n");
}
