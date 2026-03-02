import { NextResponse } from "next/server";
import { defaultPageConfig } from "@/lib/default-page-config";
import { getPageConfig } from "@/lib/repositories/config-repository";
import { env } from "@/lib/env";
import {
  createMetricSnapshotRecord,
  getRecentPublishedPosts
} from "@/lib/repositories/workflow-repository";
import { isAuthorizedCronRequest } from "@/lib/utils";
import { buildPromptUpdate } from "@/modules/optimizer/build-prompt-update";
import { collectMetrics } from "@/modules/collector/collect-metrics";

async function handleCollectMetrics(request: Request) {
  const authorized = isAuthorizedCronRequest(request.headers.get("authorization"), env.CRON_SECRET);
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const config = await getPageConfig(defaultPageConfig.pageId);
  const posts = await getRecentPublishedPosts(config.pageId, 10);
  const livePosts = posts.filter((post) => post.publishMode === "live");
  const snapshots = await Promise.all(livePosts.map((post) => collectMetrics(post.id, post.fbPostId)));

  await Promise.all(livePosts.map((post, index) => createMetricSnapshotRecord(post.id, snapshots[index])));

  const promptUpdate = buildPromptUpdate(config.pageId, snapshots);

  return NextResponse.json({
    ok: true,
    consideredPosts: livePosts.length,
    ignoredMockPosts: posts.length - livePosts.length,
    snapshots,
    promptUpdate
  });
}

export async function GET(request: Request) {
  return handleCollectMetrics(request);
}

export async function POST(request: Request) {
  return handleCollectMetrics(request);
}
