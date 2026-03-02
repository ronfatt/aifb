import { env } from "@/lib/env";
import { buildSystemPrompt, buildUserPrompt } from "@/modules/generator/build-prompt";
import { draftPayloadSchema } from "@/modules/generator/schema";
import type { DraftPayload, GenerateInput } from "@/types/workflow";

interface OpenAIChatResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
}

function extractMessageText(response: OpenAIChatResponse) {
  const content = response.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item.text === "string" ? item.text : ""))
      .join("")
      .trim();
  }

  return "";
}

export async function generateDraftWithOpenAI(input: GenerateInput): Promise<DraftPayload> {
  if (!env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.9,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "fb_draft",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              hook: {
                type: "array",
                minItems: 1,
                maxItems: 3,
                items: { type: "string" }
              },
              body: { type: "string" },
              ctaQuestion: { type: "string" },
              tags: {
                type: "array",
                minItems: 1,
                maxItems: 8,
                items: { type: "string" }
              },
              sensitivityFlags: {
                type: "array",
                items: { type: "string" }
              },
              variants: {
                type: "array",
                maxItems: 2,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    label: { type: "string" },
                    hook: {
                      type: "array",
                      minItems: 1,
                      maxItems: 3,
                      items: { type: "string" }
                    },
                    body: { type: "string" },
                    ctaQuestion: { type: "string" },
                    tags: {
                      type: "array",
                      minItems: 1,
                      maxItems: 8,
                      items: { type: "string" }
                    }
                  },
                  required: ["label", "hook", "body", "ctaQuestion", "tags"]
                }
              }
            },
            required: ["hook", "body", "ctaQuestion", "tags", "sensitivityFlags", "variants"]
          }
        }
      },
      messages: [
        {
          role: "system",
          content: buildSystemPrompt()
        },
        {
          role: "user",
          content: buildUserPrompt(input)
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI generation failed with status ${response.status}: ${errorText}`);
  }

  const json = (await response.json()) as OpenAIChatResponse;
  const messageText = extractMessageText(json);
  if (!messageText) {
    throw new Error("OpenAI generation returned empty content");
  }
  const parsed = JSON.parse(messageText);

  return draftPayloadSchema.parse(parsed);
}
