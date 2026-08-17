import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getPrepAnalytics } from "./prep.server";

export const getPreparationStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const stats = await getPrepAnalytics(context.userId);
    return stats;
  });
