import { defaultPageConfig } from "@/lib/default-page-config";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { PageConfig, StorySlotConfig } from "@/types/config";

function mapStorySlots(value: unknown): StorySlotConfig[] {
  if (!Array.isArray(value)) {
    return defaultPageConfig.storySlots;
  }

  return value
    .map((slot) => {
      const row = slot as Record<string, unknown>;
      return {
        key: String(row.key ?? ""),
        label: String(row.label ?? ""),
        seriesTitle: String(row.seriesTitle ?? row.series_title ?? ""),
        contentType: String(row.contentType ?? row.content_type ?? "story_serial"),
        tone: String(row.tone ?? defaultPageConfig.tone),
        targetEmotion: String(row.targetEmotion ?? row.target_emotion ?? defaultPageConfig.targetEmotions[0]),
        imageStyle: String(row.imageStyle ?? row.image_style ?? defaultPageConfig.imageStyle),
        characters: Array.isArray(row.characters) ? row.characters.map(String) : []
      };
    })
    .filter((slot) => slot.key && slot.label && slot.seriesTitle);
}

function mapRowToPageConfig(row: Record<string, unknown>): PageConfig {
  return {
    pageId: String(row.page_id ?? defaultPageConfig.pageId),
    pageName: String(row.page_name ?? defaultPageConfig.pageName),
    publishFrequencyPerDay: Number(row.publish_frequency_per_day ?? defaultPageConfig.publishFrequencyPerDay),
    dryRun: Boolean(row.dry_run ?? defaultPageConfig.dryRun),
    imageGenerationEnabled: Boolean(row.image_generation_enabled ?? defaultPageConfig.imageGenerationEnabled),
    imageStyle: String(row.image_style ?? defaultPageConfig.imageStyle),
    language: "ms-MY",
    tone: String(row.tone ?? defaultPageConfig.tone),
    contentTypes: Array.isArray(row.content_types) ? (row.content_types as string[]) : defaultPageConfig.contentTypes,
    targetEmotions: Array.isArray(row.target_emotions)
      ? (row.target_emotions as string[])
      : defaultPageConfig.targetEmotions,
    constraints: Array.isArray(row.constraints) ? (row.constraints as string[]) : defaultPageConfig.constraints,
    ctaStyles: Array.isArray(row.cta_styles) ? (row.cta_styles as string[]) : defaultPageConfig.ctaStyles,
    hookPatterns: Array.isArray(row.hook_patterns) ? (row.hook_patterns as string[]) : defaultPageConfig.hookPatterns,
    storySlots: mapStorySlots(row.story_slots)
  };
}

export async function getPageConfig(pageId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ...defaultPageConfig,
      pageId
    };
  }

  const { data, error } = await supabase.from("config").select("*").eq("page_id", pageId).maybeSingle();
  if (error) {
    throw error;
  }

  if (!data) {
    return {
      ...defaultPageConfig,
      pageId
    };
  }

  return mapRowToPageConfig(data);
}

export async function getPrimaryPageConfig() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return defaultPageConfig;
  }

  const { data, error } = await supabase
    .from("config")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return defaultPageConfig;
  }

  return mapRowToPageConfig(data);
}

export async function upsertPageConfig(config: PageConfig) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return config;
  }

  const payload = {
    page_id: config.pageId,
    page_name: config.pageName,
    publish_frequency_per_day: config.publishFrequencyPerDay,
    dry_run: config.dryRun,
    image_generation_enabled: config.imageGenerationEnabled,
    image_style: config.imageStyle,
    language: config.language,
    tone: config.tone,
    prompt_profile: {},
    constraints: config.constraints,
    content_types: config.contentTypes,
    target_emotions: config.targetEmotions,
    cta_styles: config.ctaStyles,
    hook_patterns: config.hookPatterns,
    story_slots: config.storySlots,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("config")
    .upsert(payload, { onConflict: "page_id" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapRowToPageConfig(data);
}
