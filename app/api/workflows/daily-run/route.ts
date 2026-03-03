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
  const summary = await runDailyWorkflow({
    pageId: config.pageId,
    contentType: config.contentTypes[0] || "story_long",
    tone: config.tone,
    targetEmotion: config.targetEmotions[0] || "anger_to_hope",
    lengthWords: 900,
    constraints: config.constraints,
    language: config.language,
    dryRun: config.dryRun,
    imageGenerationEnabled: config.imageGenerationEnabled,
    imageStyle: config.imageStyle
  });

  return NextResponse.json({
    ok: true,
    summary
  });
}

export async function GET(request: Request) {
  return handleDailyRun(request);
}

export async function POST(request: Request) {
  return handleDailyRun(request);
}
