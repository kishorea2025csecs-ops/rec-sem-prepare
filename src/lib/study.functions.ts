import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { analyseText, explainTopic } from "./study.server";

export const analyzeMaterial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z.object({ materialId: z.string().uuid(), useMcp: z.boolean().optional() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const email = (context.claims.email as string) ?? "";
    if (!email.endsWith("@rajalakshmi.edu.in")) {
      throw new Error("A verified @rajalakshmi.edu.in account is required.");
    }

    const supabase = context.supabase;
    const { data: material, error } = await supabase
      .from("study_materials")
      .select("*")
      .eq("id", data.materialId)
      .single();

    if (error || !material) throw new Error("Material not found");
    if (!material.extracted_text || material.extracted_text.trim().length < 80) {
      await supabase.from("study_materials").update({ status: "failed" }).eq("id", material.id);
      throw new Error("No readable text found in this PDF. Scanned images are not supported yet.");
    }

    await supabase.from("study_materials").update({ status: "analyzing" }).eq("id", material.id);

    try {
      const analysis = await analyseText(
        {
          text: material.extracted_text,
          kind: material.kind as "notes" | "pyq",
          subject: material.subject,
          unit: material.unit,
          title: material.title,
        },
        !!data.useMcp,
      );

      await supabase
        .from("study_materials")
        .update({ analysis, status: "ready" })
        .eq("id", material.id);

      return { analysis };
    } catch (e) {
      await supabase.from("study_materials").update({ status: "failed" }).eq("id", material.id);
      throw e;
    }
  });

export const getExplanation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        topic: z.string().min(2).max(300),
        subject: z.string().max(120).default("General"),
        level: z.enum(["quick", "exam", "revision"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const email = (context.claims.email as string) ?? "";
    if (!email.endsWith("@rajalakshmi.edu.in")) {
      throw new Error("A verified @rajalakshmi.edu.in account is required.");
    }
    const text = await explainTopic(data.topic, data.level, data.subject);
    return { text };
  });
