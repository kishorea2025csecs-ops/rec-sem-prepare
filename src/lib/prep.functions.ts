import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getPreparationStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { getPrepAnalytics } = await import("./prep.server");
    return getPrepAnalytics(context.supabase as any, context.userId);
  });

export const getQuestionBank = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z.object({ subject: z.string().optional(), unit: z.string().optional() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { handleGetQuestionBank } = await import("./prep.server");
    return handleGetQuestionBank(context.supabase as any, context.userId, {
      subject: data.subject || undefined,
      unit: data.unit || undefined
    });
  });

export const getImportantTopics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { handleGetTopics } = await import("./prep.server");
    return handleGetTopics(context.supabase as any, context.userId);
  });

export const updateTopicMastery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z.object({ topicId: z.string().uuid(), masteryScore: z.number().min(0).max(100) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { handleUpdateTopicMastery } = await import("./prep.server");
    return handleUpdateTopicMastery(context.supabase as any, context.userId, data);
  });
