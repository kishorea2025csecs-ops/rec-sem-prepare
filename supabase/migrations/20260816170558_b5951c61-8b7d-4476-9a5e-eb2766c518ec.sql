-- First, drop the insecure update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a more restrictive update policy that prevents changing 'id' and 'email'
-- Note: 'created_at' is usually not updated by users, but we'll focus on the identity fields.
-- We use a WITH CHECK clause to ensure the final state of the row is valid.
-- However, standard RLS doesn't easily compare OLD and NEW values without a trigger.
-- A common pattern to prevent column updates in RLS is to check that the UID matches
-- AND ensure sensitive columns are not being changed by restricting the update to specific columns
-- OR using a trigger for fine-grained control.

-- Since standard Supabase RLS 'UPDATE' policy applies to the whole row, 
-- we will use a trigger to enforce that specific columns remain unchanged.

CREATE OR REPLACE FUNCTION public.enforce_profile_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Prevent changing identity/verified fields
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Changing profile ID is not allowed.';
  END IF;
  
  IF NEW.email <> OLD.email THEN
    RAISE EXCEPTION 'Changing verified email is not allowed.';
  END IF;

  IF NEW.created_at <> OLD.created_at THEN
    NEW.created_at := OLD.created_at;
  END IF;

  -- Automatically update the updated_at timestamp
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$;

-- Drop trigger if exists to avoid errors on retry
DROP TRIGGER IF EXISTS before_profile_update ON public.profiles;

CREATE TRIGGER before_profile_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_immutability();

-- Re-enable the update policy (the trigger handles the column restrictions)
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Ensure service_role can still manage everything
GRANT ALL ON public.profiles TO service_role;
