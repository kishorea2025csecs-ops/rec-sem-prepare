export async function handleTranslate(texts: string[]): Promise<string[]> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content:
            "You translate UI text for an engineering exam-preparation website into Tamil. Keep technical terms, product names (NexLearn AI), acronyms (REC, PYQ, AI, PDF) and numbers as-is. Return only JSON.",
        },
        {
          role: "user",
          content:
            "Translate each string in the array to Tamil. Keep the same order and count.\n" +
            JSON.stringify(texts),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "translation",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["items"],
            properties: { items: { type: "array", items: { type: "string" } } },
          },
        },
      },
    }),
  });

  if (res.status === 429) throw new Error("AI rate limit reached. Please try again in a minute.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please top up to continue.");
  if (!res.ok) throw new Error(`Translation failed (${res.status})`);

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Translation returned an empty response");
  const parsed = JSON.parse(content) as { items?: string[] };
  const items = parsed.items ?? [];
  return texts.map((t, i) => items[i] ?? t);
}
