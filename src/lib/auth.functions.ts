import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getSessionInfo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { claims } = context;
    const email = claims.email as string;
    const isVerifiedRec = email?.endsWith("@rajalakshmi.edu.in");

    return {
      userId: context.userId,
      email: email,
      isVerifiedRec: isVerifiedRec,
    };
  });
