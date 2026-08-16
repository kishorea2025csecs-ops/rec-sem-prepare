-- Set search_path to prevent search_path injection attacks (Warn 1)
ALTER FUNCTION public.enforce_profile_immutability() SET search_path = public;

-- Revoke execute from public/authenticated (Warn 2 & 3)
-- The function is called by a trigger, which runs with the owner's privileges (security definer)
-- Users don't need to be able to execute it directly via RPC.
REVOKE EXECUTE ON FUNCTION public.enforce_profile_immutability() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_profile_immutability() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_profile_immutability() FROM anon;

-- Explicitly grant to service_role just in case
GRANT EXECUTE ON FUNCTION public.enforce_profile_immutability() TO service_role;
