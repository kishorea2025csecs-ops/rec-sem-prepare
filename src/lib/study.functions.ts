import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const analyzeMaterial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z.object({ materialId: z.string().uuid(), useMcp: z.boolean().optional() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { handleAnalyzeMaterial } = await import("./study.server");
    return handleAnalyzeMaterial(context.supabase as any, data, context);
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
    const { handleGetExplanation } = await import("./study.server");
    return handleGetExplanation(data, context);
  });
