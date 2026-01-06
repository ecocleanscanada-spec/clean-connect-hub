-- Update handle_new_user function to add server-side validation
-- Limits full_name to 100 characters and trims whitespace
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id, 
    new.email, 
    LEFT(TRIM(new.raw_user_meta_data ->> 'full_name'), 100)
  );
  RETURN new;
END;
$$;