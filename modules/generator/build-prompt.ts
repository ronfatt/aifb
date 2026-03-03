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
    input.storyContext?.seriesTitle ? `series_title: ${input.storyContext.seriesTitle}` : "series_title: create a sticky new recurring story universe",
    `next_episode_number: ${input.storyContext?.nextEpisodeNumber ?? 1}`,
    `previous_episode_summary: ${input.storyContext?.previousEpisodeSummary ?? "none - this is the first episode"}`,
    `unresolved_thread: ${input.storyContext?.unresolvedThread ?? "introduce one strong unresolved emotional thread"}`,
    `main_characters: ${(input.storyContext?.characters ?? []).join(" | ") || "create 2-4 memorable recurring characters"}`,
    "",
    "Return JSON with this shape:",
    "{",
    '  "seriesTitle": "series title",',
    '  "episodeNumber": 1,',
    '  "episodeLabel": "Episod 1",',
    '  "hook": ["line 1", "line 2"],',
    '  "body": "main body",',
    '  "ctaQuestion": "question",',
    '  "tags": ["#tag1", "#tag2"],',
    '  "sensitivityFlags": [],',
    '  "storySummary": "1-2 sentence summary of this episode",',
    '  "nextEpisodeHook": "what should continue next",',
    '  "characters": ["name 1", "name 2"],',
    '  "variants": [{"label":"B","hook":["..."],"body":"...","ctaQuestion":"...","tags":["#..."]}]',
    "}",
    "",
    "Requirements:",
    "- This is a serialized story. If previous episode context exists, continue the SAME universe, SAME core characters, and SAME unresolved conflict.",
    "- Do not reset to a totally new story unless this is episode 1.",
    "- The hook should be 1-3 short lines and must create immediate curiosity, tension, or shock.",
    "- The body should read like a compact short story episode with named or clearly defined characters, setting, conflict, escalation, and one emotional turning point.",
    "- Avoid abstract preaching. Use scenes, dialogue fragments, secrets, betrayal, family pressure, money problems, hidden past, or relationship conflict when appropriate.",
    "- Make readers want the next episode. End the body with a soft cliffhanger or unresolved emotional consequence.",
    "- Mention or imply continuity from the previous episode when episode number is greater than 1.",
    "- The CTA should invite comments about what the reader thinks happens next or what the character should do next, not generic likes.",
    "- Keep hashtags concise and relevant.",
    "- Write in paragraph rhythm suitable for Facebook: short paragraphs, easy to scan, strong story flow.",
    "- Prefer drama-serial energy over rant energy unless the input explicitly asks for rant."
  ].join("\n");
}
