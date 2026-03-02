import type { LatestPublishedSummary, PublishListItem, RunListItem } from "@/types/workflow";

const modules = [
  "Orchestrator",
  "Generator",
  "Content QA",
  "Formatter",
  "Publisher",
  "Collector",
  "Optimizer"
];

export function Dashboard({
  pageId,
  runs,
  publishes,
  latestPublished
}: {
  pageId: string;
  runs: RunListItem[];
  publishes: PublishListItem[];
  latestPublished: LatestPublishedSummary | null;
}) {
  return (
    <main
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "48px 24px 72px"
      }}
    >
      <section
        style={{
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 12px 40px rgba(45, 33, 20, 0.08)"
        }}
      >
        <p style={{ color: "var(--accent)", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          AI FB MVP
        </p>
        <h1 style={{ margin: "12px 0 8px", fontSize: "clamp(2.4rem, 5vw, 4.4rem)", lineHeight: 0.95 }}>
          Automated Facebook Page pipeline
        </h1>
        <p style={{ maxWidth: 720, color: "var(--muted)", fontSize: 18, lineHeight: 1.6 }}>
          Structured Malay content generation, QA, publishing, metrics collection, and prompt optimization in a single
          Next.js codebase.
        </p>
      </section>

      <section style={{ marginTop: 28, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {modules.map((item) => (
          <article
            key={item}
            style={{
              background: "rgba(255, 250, 240, 0.86)",
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 20
            }}
          >
            <h2 style={{ margin: 0, fontSize: 22 }}>{item}</h2>
          </article>
        ))}
      </section>

      <section
        style={{
          marginTop: 24,
          background: "rgba(255, 250, 240, 0.92)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 20
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 24 }}>Latest Published</h2>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>{pageId}</span>
        </div>
        {latestPublished ? (
          <div style={{ marginTop: 14 }}>
            <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: 13 }}>
              {latestPublished.publishMode.toUpperCase()} · {new Date(latestPublished.publishedAt).toLocaleString("en-MY")}
            </p>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              {latestPublished.formattedText
                ? `${latestPublished.formattedText.slice(0, 280)}${latestPublished.formattedText.length > 280 ? "..." : ""}`
                : "No formatted text available."}
            </p>
            <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: 13 }}>
              FB Post ID: {latestPublished.fbPostId}
            </p>
          </div>
        ) : (
          <p style={{ margin: "14px 0 0", color: "var(--muted)" }}>No published summary yet.</p>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <a
          href="/config"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 18px",
            borderRadius: 999,
            background: "var(--accent)",
            color: "#fff7ef",
            textDecoration: "none"
          }}
        >
          Open Config
        </a>
      </section>

      <section style={{ marginTop: 16 }}>
        <a
          href="/api/runs"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            color: "var(--ink)",
            textDecoration: "none",
            background: "rgba(255,250,240,0.72)"
          }}
        >
          View Runs API
        </a>
      </section>
    </main>
  );
}
