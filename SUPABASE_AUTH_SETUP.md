# Supabase Authentication Setup Guide

This guide will help you set up Google OAuth authentication using Supabase Auth.

## Overview

The application now uses Supabase Authentication for user management. Key benefits:
- Native integration with Supabase RLS (Row Level Security)
- No need for service role key in most operations
- Automatic user session management
- Built-in OAuth provider support

## Step 1: Update Environment Variables

Your `.env.local` should have these Supabase variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site URL for auth redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note:** You no longer need `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, or `GOOGLE_CLIENT_SECRET` in your `.env.local` file. These can be removed.

## Step 2: Configure Google OAuth in Supabase

### 2.1 Create Google OAuth Credentials

1. Go to https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **+ Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add these URIs:

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
https://your-project.supabase.co/auth/v1/callback
http://localhost:3000
```

7. Click **Create** and copy your **Client ID** and **Client Secret**

### 2.2 Configure Google Provider in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** and click the toggle to enable it
5. Enter your Google OAuth credentials:
   - **Client ID**: Paste your Google Client ID
   - **Client Secret**: Paste your Google Client Secret
6. Click **Save**

### 2.3 Configure Redirect URLs in Supabase

1. Still in **Authentication** section, go to **URL Configuration**
2. Add your site URL to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   ```
3. For production, add:
   ```
   https://yourdomain.com/auth/callback
   ```
4. Click **Save**

## Step 3: Update Supabase Database Schema

Run this SQL in your Supabase SQL Editor to update RLS policies:

```sql
-- Update RLS policies to use Supabase auth.uid()

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

-- Create new policies using auth.uid()
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own orders"
  ON orders
  FOR UPDATE
  USING (user_id = auth.uid()::text);
```

**Important:** The `user_id` column in your orders table will now store Supabase auth user IDs (UUID format) instead of NextAuth user IDs.

## Step 4: Test Authentication

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test the sign-in flow:**
   - Go to http://localhost:3000/signin
   - Click "Continue with Google"
   - You should be redirected to Google for authentication
   - After signing in with Google, you'll be redirected back to your app
   - You should see your name/email in the header

3. **Verify session persistence:**
   - Refresh the page - you should stay signed in
   - Close and reopen the browser - you should stay signed in

4. **Test protected routes:**
   - Add items to cart
   - Click "Proceed to Checkout" - should work if signed in
   - Go to `/orders` - should show your orders if signed in

5. **Test sign-out:**
   - Click "Sign Out" in the header
   - You should be signed out and redirected appropriately

## How It Works

### Client-Side Authentication

The app uses a custom `AuthContext` that wraps Supabase auth:

```tsx
const { user, session, loading, signInWithGoogle, signOut } = useAuth();
```

- `user`: Current user object from Supabase
- `session`: Current session object
- `loading`: Loading state during initial auth check
- `signInWithGoogle()`: Triggers Google OAuth flow
- `signOut()`: Signs out the user

### Server-Side Authentication

API routes use the server-side Supabase client:

```typescript
import { createServerSupabaseClient } from '@/lib/supabase-server';

const supabase = await createServerSupabaseClient();
const { data: { user } } = await supabase.auth.getUser();
```

### Row Level Security (RLS)

With Supabase Auth, RLS policies automatically enforce data access:

- Users can only view their own orders
- Users can only create orders for themselves
- No need for service role key bypass in most operations

## Troubleshooting

### "User not authenticated" errors

- Check that you're signed in
- Check browser console for auth errors
- Verify redirect URLs are configured correctly in Supabase
- Make sure `NEXT_PUBLIC_SITE_URL` matches your actual URL

### Google OAuth not working

- Verify Google OAuth credentials are correct in Supabase dashboard
- Check that redirect URIs in Google Console match: `https://your-project.supabase.co/auth/v1/callback`
- Make sure Google OAuth provider is enabled in Supabase
- Check browser console for error messages

### "Failed to create order" errors

- Run the RLS policy update SQL from Step 3
- Verify you're signed in with Supabase (check `user` in console)
- Check browser network tab for API error responses

### Sign-in redirects to wrong page

- Verify `NEXT_PUBLIC_SITE_URL` in `.env.local`
- Check redirect URLs in Supabase dashboard
- Restart dev server after changing env variables

## Production Deployment

When deploying to production:

1. **Update Google OAuth redirect URIs:**
   - Add `https://your-project.supabase.co/auth/v1/callback`
   - Add `https://yourdomain.com/auth/callback`

2. **Update Supabase redirect URLs:**
   - Add your production domain: `https://yourdomain.com/auth/callback`

3. **Update environment variables:**
   - Set `NEXT_PUBLIC_SITE_URL` to your production URL
   - All Supabase env variables should remain the same

4. **Test thoroughly:**
   - Test sign-in flow
   - Test checkout and orders
   - Test sign-out

## Security Notes

- ✅ Supabase auth tokens are stored securely in HTTP-only cookies
- ✅ RLS policies protect your data automatically
- ✅ Service role key is only used for webhook operations
- ✅ Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code
- ✅ Google OAuth happens through Supabase's secure proxy

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
