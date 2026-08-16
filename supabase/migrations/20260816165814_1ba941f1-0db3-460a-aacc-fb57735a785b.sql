
-- Verify that the domain restriction is still strictly enforced in the trigger function.
-- Although earlier logs showed the code, let's ensure the current DB state matches the security requirement.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Strict domain check for Rajalakshmi Engineering College
  IF NEW.email NOT LIKE '%@rajalakshmi.edu.in' THEN
    RAISE EXCEPTION 'Access restricted. Please use your @rajalakshmi.edu.in email address.';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;
