import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getPreparationStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { getPrepAnalytics } = await import("./prep.server");
    return getPrepAnalytics(context.supabase as any, context.userId);
  });
