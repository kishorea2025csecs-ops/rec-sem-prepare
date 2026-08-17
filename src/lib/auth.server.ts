import { type MiddlewareContext } from "@tanstack/react-start";
import { type requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AuthContext = Awaited<ReturnType<typeof requireSupabaseAuth['_types']['server']>>;

export async function handleGetSessionInfo({ context }: { context: AuthContext }) {
  const { claims } = context;
  const email = claims.email as string;
  const isVerifiedRec = email?.endsWith("@rajalakshmi.edu.in");

  return {
    userId: context.userId,
    email: email,
    isVerifiedRec: isVerifiedRec,
  };
}
