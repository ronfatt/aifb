import { ConfigForm } from "@/components/config-form";
import { getPrimaryPageConfig } from "@/lib/repositories/config-repository";

export default async function ConfigPage() {
  const config = await getPrimaryPageConfig();

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 80px" }}>
      <section
        style={{
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: 28,
          boxShadow: "0 12px 40px rgba(45, 33, 20, 0.08)"
        }}
      >
        <p style={{ color: "var(--accent)", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Admin Config
        </p>
        <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(2rem, 4vw, 3.4rem)", lineHeight: 0.96 }}>
          Page control surface
        </h1>
        <p style={{ maxWidth: 720, color: "var(--muted)", lineHeight: 1.6 }}>
          Edit the publishing profile, content constraints, and generation defaults before connecting live Facebook
          publishing.
        </p>
        <div style={{ marginTop: 24 }}>
          <ConfigForm initialConfig={config} />
        </div>
      </section>
    </main>
  );
}
