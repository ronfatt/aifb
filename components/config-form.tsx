"use client";

import { useState, useTransition } from "react";
import type { PageConfig, StorySlotConfig } from "@/types/config";

function toTextareaValue(values: string[]) {
  return values.join("\n");
}

function fromTextareaValue(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ConfigForm({ initialConfig }: { initialConfig: PageConfig }) {
  const [config, setConfig] = useState<PageConfig>(initialConfig);
  const [status, setStatus] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof PageConfig>(key: K, value: PageConfig[K]) {
    setConfig((current) => ({
      ...current,
      [key]: value
    }));
  }

  function updateStorySlot(index: number, patch: Partial<StorySlotConfig>) {
    setConfig((current) => ({
      ...current,
      storySlots: current.storySlots.map((slot, slotIndex) => (slotIndex === index ? { ...slot, ...patch } : slot))
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    startTransition(async () => {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(config)
      });

      const result = (await response.json()) as { ok: boolean; config?: PageConfig; error?: string };
      if (!response.ok || !result.ok || !result.config) {
        setStatus(result.error || "Failed to save config");
        return;
      }

      setConfig(result.config);
      setStatus("Saved");
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
      <section style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Page ID</span>
          <input value={config.pageId} onChange={(event) => updateField("pageId", event.target.value)} />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Page Name</span>
          <input value={config.pageName} onChange={(event) => updateField("pageName", event.target.value)} />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Posts Per Day</span>
          <input
            type="number"
            min={1}
            max={3}
            value={config.publishFrequencyPerDay}
            onChange={(event) => updateField("publishFrequencyPerDay", Number(event.target.value))}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Tone</span>
          <input value={config.tone} onChange={(event) => updateField("tone", event.target.value)} />
          <small style={{ color: "var(--muted)" }}>
            Suggested: <code>dramatic-serial-realistic</code>
          </small>
        </label>
      </section>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 16px",
          border: "1px solid var(--border)",
          borderRadius: 16,
          background: "#fffdf7"
        }}
      >
        <input
          type="checkbox"
          checked={config.dryRun}
          onChange={(event) => updateField("dryRun", event.target.checked)}
        />
        <span>Generate but do not publish to Facebook</span>
      </label>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 16px",
          border: "1px solid var(--border)",
          borderRadius: 16,
          background: "#fffdf7"
        }}
      >
        <input
          type="checkbox"
          checked={config.imageGenerationEnabled}
          onChange={(event) => updateField("imageGenerationEnabled", event.target.checked)}
        />
        <span>Generate AI image for each post</span>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Image Style</span>
        <input value={config.imageStyle} onChange={(event) => updateField("imageStyle", event.target.value)} />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Content Types</span>
        <textarea
          rows={4}
          value={toTextareaValue(config.contentTypes)}
          onChange={(event) => updateField("contentTypes", fromTextareaValue(event.target.value))}
        />
        <small style={{ color: "var(--muted)" }}>
          One per line. Suggested: <code>story_serial</code>, <code>story_long</code>
        </small>
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Target Emotions</span>
        <textarea
          rows={4}
          value={toTextareaValue(config.targetEmotions)}
          onChange={(event) => updateField("targetEmotions", fromTextareaValue(event.target.value))}
        />
        <small style={{ color: "var(--muted)" }}>
          Suggested: <code>suspense</code>, <code>heartbreak</code>, <code>anger_to_hope</code>
        </small>
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Constraints</span>
        <textarea
          rows={6}
          value={toTextareaValue(config.constraints)}
          onChange={(event) => updateField("constraints", fromTextareaValue(event.target.value))}
        />
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span>CTA Styles</span>
        <textarea
          rows={4}
          value={toTextareaValue(config.ctaStyles)}
          onChange={(event) => updateField("ctaStyles", fromTextareaValue(event.target.value))}
        />
        <small style={{ color: "var(--muted)" }}>
          Suggested: <code>what-happens-next</code>, <code>what-would-you-do</code>, <code>team-choice</code>
        </small>
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Hook Patterns</span>
        <textarea
          rows={4}
          value={toTextareaValue(config.hookPatterns)}
          onChange={(event) => updateField("hookPatterns", fromTextareaValue(event.target.value))}
        />
        <small style={{ color: "var(--muted)" }}>
          Suggested: <code>cliffhanger</code>, <code>secret-reveal</code>, <code>family-conflict</code>
        </small>
      </label>

      <section style={{ display: "grid", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24 }}>Story Slots</h2>
          <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
            Schedule: <code>story-a</code> runs at 11am and 9pm, <code>story-b</code> runs at 4pm Malaysia time.
          </p>
        </div>

        {config.storySlots.map((slot, index) => (
          <section
            key={slot.key}
            style={{
              display: "grid",
              gap: 12,
              padding: 16,
              border: "1px solid var(--border)",
              borderRadius: 18,
              background: "#fffdf7"
            }}
          >
            <div>
              <strong>{slot.label}</strong>
              <div style={{ color: "var(--muted)", marginTop: 4 }}>
                Slot key: <code>{slot.key}</code>
              </div>
            </div>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Series Title</span>
              <input value={slot.seriesTitle} onChange={(event) => updateStorySlot(index, { seriesTitle: event.target.value })} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Tone</span>
              <input value={slot.tone} onChange={(event) => updateStorySlot(index, { tone: event.target.value })} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Target Emotion</span>
              <input
                value={slot.targetEmotion}
                onChange={(event) => updateStorySlot(index, { targetEmotion: event.target.value })}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Content Type</span>
              <input
                value={slot.contentType}
                onChange={(event) => updateStorySlot(index, { contentType: event.target.value })}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Characters</span>
              <textarea
                rows={3}
                value={toTextareaValue(slot.characters)}
                onChange={(event) => updateStorySlot(index, { characters: fromTextareaValue(event.target.value) })}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Image Style Override</span>
              <input
                value={slot.imageStyle ?? ""}
                onChange={(event) => updateStorySlot(index, { imageStyle: event.target.value })}
              />
            </label>
          </section>
        ))}
      </section>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            border: 0,
            borderRadius: 999,
            padding: "12px 18px",
            background: "var(--accent)",
            color: "#fff7ef",
            cursor: "pointer"
          }}
        >
          {isPending ? "Saving..." : "Save Config"}
        </button>
        <span style={{ color: "var(--muted)" }}>{status}</span>
      </div>
    </form>
  );
}
