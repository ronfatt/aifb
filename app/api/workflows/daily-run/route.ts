import { NextResponse } from "next/server";
import { getPrimaryPageConfig } from "@/lib/repositories/config-repository";
import { env } from "@/lib/env";
import { isAuthorizedCronRequest } from "@/lib/utils";
import { runDailyWorkflow } from "@/modules/orchestrator/run-daily-workflow";

async function handleDailyRun(request: Request) {
  const authorized = isAuthorizedCronRequest(request.headers.get("authorization"), env.CRON_SECRET);
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const config = await getPrimaryPageConfig();
  const { searchParams } = new URL(request.url);
  const slotKey = searchParams.get("slot") || "story-a";
  const slot = config.storySlots.find((item) => item.key === slotKey) ?? config.storySlots[0];

  if (!slot) {
    return NextResponse.json({ ok: false, error: "No story slot configured" }, { status: 400 });
  }

  const summary = await runDailyWorkflow({
    pageId: config.pageId,
    storySlot: slot.key,
    contentType: slot.contentType || config.contentTypes[0] || "story_long",
    tone: slot.tone || config.tone,
    targetEmotion: slot.targetEmotion || config.targetEmotions[0] || "anger_to_hope",
    lengthWords: 900,
    constraints: config.constraints,
    language: config.language,
    dryRun: config.dryRun,
    imageGenerationEnabled: config.imageGenerationEnabled,
    imageStyle: slot.imageStyle || config.imageStyle,
    storyContext: {
      nextEpisodeNumber: 1,
      seriesTitle: slot.seriesTitle,
      characters: slot.characters
    }
  });

  return NextResponse.json({
    ok: true,
    slot: slot.key,
    summary
  });
}

export async function GET(request: Request) {
  return handleDailyRun(request);
}

export async function POST(request: Request) {
  return handleDailyRun(request);
}
