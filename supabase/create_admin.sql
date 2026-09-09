-- ==============================================================================
-- HIDHAB KAIZEN - RUN THIS IN SUPABASE SQL EDITOR:
-- URL: https://supabase.com/dashboard/project/ayaihdxudfqaoqomykko/sql/new
-- ==============================================================================

-- 1. Confirm the admin account so you can log in right away without checking email inbox:
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'hidhab.kaizen.store@gmail.com';

-- 2. Populate the public.admin_users table so it is no longer empty:
INSERT INTO public.admin_users (id, email, role)
SELECT id, email, 'owner'
FROM auth.users
WHERE email = 'hidhab.kaizen.store@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'owner';

-- 3. Automatic Trigger: Whenever any admin is added in Authentication > Users, 
--    they are automatically added to the public.admin_users table:
CREATE OR REPLACE FUNCTION public.handle_new_admin_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, role)
  VALUES (new.id, new.email, 'owner')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();
