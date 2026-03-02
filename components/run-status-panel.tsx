import type { PublishListItem, RunListItem } from "@/types/workflow";

function formatDate(value?: string | null) {
  if (!value) {
    return "Pending";
  }

  return new Date(value).toLocaleString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function statusTone(status: string) {
  if (status === "completed" || status === "published") {
    return "#2f6b3b";
  }

  if (status === "failed") {
    return "#8e2f23";
  }

  return "#8a6a1f";
}

export function RunStatusPanel({
  pageId,
  runs,
  publishes
}: {
  pageId: string;
  runs: RunListItem[];
  publishes: PublishListItem[];
}) {
  return (
    <section
      style={{
        marginTop: 28,
        display: "grid",
        gap: 18,
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
      }}
    >
      <article
        style={{
          gridColumn: "1 / -1",
          background: "#fff5df",
          border: "1px solid #e2c98e",
          borderRadius: 18,
          padding: 18
        }}
      >
        <strong style={{ display: "block", marginBottom: 6 }}>Metrics status</strong>
        <p style={{ margin: 0, color: "#6f5730", lineHeight: 1.5 }}>
          Facebook publishing is live. Metrics storage is live too, but comments and reactions still depend on Meta
          engagement permissions and may remain zero until that access is fully enabled.
        </p>
      </article>

      <article
        style={{
          background: "rgba(255, 250, 240, 0.92)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 20
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 24 }}>Recent Runs</h2>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>{pageId}</span>
        </div>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {runs.length === 0 ? (
            <p style={{ margin: 0, color: "var(--muted)" }}>No runs recorded yet.</p>
          ) : (
            runs.map((run) => (
              <div
                key={run.runId}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 14,
                  background: "#fffdf7"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <strong style={{ fontSize: 14 }}>{run.workflowName}</strong>
                  <span style={{ color: statusTone(run.status), textTransform: "uppercase", fontSize: 12 }}>
                    {run.status}
                  </span>
                </div>
                <p style={{ margin: "8px 0 4px", color: "var(--muted)", fontSize: 13 }}>
                  Started {formatDate(run.startedAt)}
                </p>
                <p style={{ margin: "0 0 4px", color: "var(--muted)", fontSize: 13 }}>
                  Content {run.contentType || "n/a"} · Tone {run.tone || "n/a"}
                </p>
                {run.errorMessage ? (
                  <p style={{ margin: "8px 0 0", color: "#8e2f23", fontSize: 13 }}>{run.errorMessage}</p>
                ) : null}
              </div>
            ))
          )}
        </div>
      </article>

      <article
        style={{
          background: "rgba(255, 250, 240, 0.92)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 20
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 24 }}>Recent Publishes</h2>
          <a href="/config" style={{ color: "var(--accent)", textDecoration: "none", fontSize: 13 }}>
            Edit config
          </a>
        </div>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {publishes.length === 0 ? (
            <p style={{ margin: 0, color: "var(--muted)" }}>No published posts yet.</p>
          ) : (
            publishes.map((post) => (
              <div
                key={post.postId}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 14,
                  background: "#fffdf7"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <strong style={{ fontSize: 14 }}>{post.publishMode.toUpperCase()}</strong>
                  <span style={{ color: statusTone(post.status), textTransform: "uppercase", fontSize: 12 }}>
                    {post.status}
                  </span>
                </div>
                <p style={{ margin: "8px 0 4px", color: "var(--muted)", fontSize: 13 }}>
                  Published {formatDate(post.publishedAt)}
                </p>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>FB Post ID: {post.fbPostId}</p>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
