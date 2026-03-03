import type { DraftPayload } from "@/types/workflow";

export function formatPost(draft: DraftPayload) {
  const storyHeader =
    draft.seriesTitle && draft.episodeLabel ? [`${draft.seriesTitle} | ${draft.episodeLabel}`, ""] : [];

  const teaser = draft.nextEpisodeHook ? ["", `Bersambung: ${draft.nextEpisodeHook}`] : [];

  return [...storyHeader, ...draft.hook, "", draft.body, ...teaser, "", draft.ctaQuestion, "", draft.tags.join(" ")].join(
    "\n"
  );
}
