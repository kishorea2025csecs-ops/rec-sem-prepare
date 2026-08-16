# Plan: Organization-Only Google Authentication

Add secure Google Sign-In restricted to Rajalakshmi Engineering College accounts (`@rajalakshmi.edu.in`) using Lovable Cloud (Supabase).

## User Review Required

> [!IMPORTANT]
> The `@rajalakshmi.edu.in` domain restriction is enforced both on the Google sign-in request (via the `hd` parameter) and via a database trigger/policy to prevent unauthorized account creation.

## Proposed Changes

### Database & Security
- Add a trigger to the `auth.users` table (via `public` schema proxy if needed, though standard practice is a profile-level check) to reject signups from non-REC domains.
- Create a `profiles` table to store verified names, emails, and profile pictures.
- Enable RLS on all user-specific data to ensure students only see their own progress.

### Authentication Flow
- **Login Page**: Create `/auth/login` with REC branding and a "Continue with Google" button.
- **Callback Handler**: Create `/auth/callback` to handle the OAuth return, verify the domain, and manage sessions.
- **Organization Restriction**: Pass `hd: "rajalakshmi.edu.in"` to Google OAuth to filter accounts in the UI.
- **Server-side Guard**: Implement a shared layout or middleware to protect `/dashboard`.

### UI/UX Updates
- **Landing Page**: Update "Go to Dashboard" links to point to the new login flow.
- **Dashboard Header**: Replace "My Account" placeholder with real student name, profile picture, and a dropdown for Profile, Settings, and Logout.
- **Logout**: Implement session termination and redirect to login.

## Technical Details

### Auth Files
- `src/routes/auth.login.tsx`: Professional REC login page.
- `src/routes/auth.callback.tsx`: Server-side domain verification and session setup.
- `src/lib/auth.server.ts`: Helper for domain validation.

### Security Implementation
```sql
-- Migration to enforce domain restriction
CREATE OR REPLACE FUNCTION public.check_user_domain()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@rajalakshmi.edu.in' THEN
    RAISE EXCEPTION 'Access restricted to @rajalakshmi.edu.in accounts.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```
*(Note: Since Lovable Cloud restricts direct triggers on `auth` schema, we will implement this logic in the profile creation trigger and use RLS to deny access to anyone without a valid REC profile.)*
