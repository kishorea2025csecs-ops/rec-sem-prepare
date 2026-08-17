import { callMcpTool } from "./mcp.server";

export type Analysis = {
  summary: string;
  concepts: { name: string; detail: string }[];
  formulas: { name: string; expression: string }[];
  topics: { topic: string; priority: "high" | "medium" | "low"; marks: string; reason: string }[];
  questions: {
    question: string;
    marks: string;
    priority: "high" | "medium" | "low";
    source: string;
  }[];
  tamilQueries: string[];
};

const SYSTEM_PROMPT = `You are an exam-preparation analyst for Anna University / Rajalakshmi Engineering College engineering students.
You are given the raw text of a student's study material (unit notes) or a previous-year question paper (PYQ).
Analyse it honestly. NEVER claim a question will definitely appear in the exam. Use "high priority", "likely focus area" style wording.
Base everything strictly on the supplied text. If the text is too short or unreadable, say so in the summary and return small arrays.
Tamil search queries must be realistic YouTube search phrases mixing the English technical term with Tamil words.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "concepts", "formulas", "topics", "questions", "tamilQueries"],
  properties: {
    summary: { type: "string" },
    concepts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "detail"],
        properties: { name: { type: "string" }, detail: { type: "string" } },
      },
    },
    formulas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "expression"],
        properties: { name: { type: "string" }, expression: { type: "string" } },
      },
    },
    topics: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["topic", "priority", "marks", "reason"],
        properties: {
          topic: { type: "string" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
          marks: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "marks", "priority", "source"],
        properties: {
          question: { type: "string" },
          marks: { type: "string" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
          source: { type: "string" },
        },
      },
    },
    tamilQueries: { type: "array", items: { type: "string" } },
  },
} as const;

export async function analyseText(input: {
  text: string;
  kind: "notes" | "pyq";
  subject: string;
  unit: string;
  title: string;
}): Promise<Analysis> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Material type: ${input.kind === "pyq" ? "Previous-year question paper" : "Unit notes"}
Subject: ${input.subject}
Unit: ${input.unit}
Title: ${input.title}

TEXT:
${input.text.slice(0, 60000)}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "exam_analysis", strict: true, schema: SCHEMA },
      },
    }),
  });

  if (res.status === 429) throw new Error("AI rate limit reached. Please try again in a minute.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please top up to continue.");
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned an empty response");
  return JSON.parse(content) as Analysis;
}

export async function explainTopic(
  topic: string,
  level: "quick" | "exam" | "revision",
  subject: string,
) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");

  const styles = {
    quick: "a 3-4 sentence plain-English intuition, no jargon",
    exam: "a full 13-mark answer structure: definition, key points, derivation/steps, diagram description, and 6-8 keywords the examiner looks for",
    revision: "a 6-bullet last-minute revision sheet with only the facts worth memorising",
  } as const;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content:
            "You help Anna University engineering students. Be accurate and concise. Use markdown-free plain text with simple dashes for bullets.",
        },
        {
          role: "user",
          content: `Subject: ${subject}\nTopic: ${topic}\nGive me ${styles[level]}.`,
        },
      ],
    }),
  });

  if (res.status === 429) throw new Error("AI rate limit reached. Please try again in a minute.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please top up to continue.");
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);

  const json = await res.json();
  return (json?.choices?.[0]?.message?.content as string) ?? "";
}
