import { Dashboard } from "@/components/dashboard";
import { RunStatusPanel } from "@/components/run-status-panel";
import { defaultPageConfig } from "@/lib/default-page-config";
import { getPageConfig } from "@/lib/repositories/config-repository";
import {
  getLatestPublishedSummary,
  getRecentPublishes,
  getRecentRuns
} from "@/lib/repositories/workflow-repository";

export default async function HomePage() {
  const config = await getPageConfig(defaultPageConfig.pageId);
  const [runs, publishes, latestPublished] = await Promise.all([
    getRecentRuns(config.pageId, 6),
    getRecentPublishes(config.pageId, 6),
    getLatestPublishedSummary(config.pageId)
  ]);

  return (
    <>
      <Dashboard pageId={config.pageId} runs={runs} publishes={publishes} latestPublished={latestPublished} />
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 72px" }}>
        <RunStatusPanel pageId={config.pageId} runs={runs} publishes={publishes} />
      </div>
    </>
  );
}
