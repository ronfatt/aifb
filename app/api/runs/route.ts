import { NextResponse } from "next/server";
import { defaultPageConfig } from "@/lib/default-page-config";
import { getPageConfig } from "@/lib/repositories/config-repository";
import { getRecentPublishes, getRecentRuns } from "@/lib/repositories/workflow-repository";

export async function GET() {
  const config = await getPageConfig(defaultPageConfig.pageId);
  const [runs, publishes] = await Promise.all([
    getRecentRuns(config.pageId, 8),
    getRecentPublishes(config.pageId, 8)
  ]);

  return NextResponse.json({
    ok: true,
    pageId: config.pageId,
    runs,
    publishes
  });
}
