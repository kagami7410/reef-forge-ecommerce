# Google OAuth Setup Guide

Follow these steps to fix the "OAuth client was not found" error.

## Step 1: Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

**If you don't have OpenSSL**, you can use this online generator:
- Go to https://generate-secret.vercel.app/32
- Copy the generated secret

Copy the output and replace `generate-this-secret-see-instructions-below` in `.env.local`

## Step 2: Create Google OAuth Credentials

### 2.1 Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

### 2.2 Create a New Project (or select existing)
1. Click the project dropdown at the top
2. Click "New Project"
3. Name it (e.g., "E-Commerce App")
4. Click "Create"
5. Wait for the project to be created, then select it

### 2.3 Enable Google+ API
1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and click **Enable**

### 2.4 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have a Google Workspace)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: Your app name (e.g., "E-Shop")
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click **Save and Continue**
6. Click **Save and Continue** again (skip scopes for now)
7. Click **Save and Continue** on test users
8. Click **Back to Dashboard**

### 2.5 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** at the top
3. Select **OAuth client ID**
4. For **Application type**, select **Web application**
5. **Name**: Give it a name (e.g., "E-Shop Web Client")
6. Under **Authorized JavaScript origins**, click **+ Add URI**:
   - Add: `http://localhost:3000`
7. Under **Authorized redirect URIs**, click **+ Add URI**:
   - Add: `http://localhost:3000/api/auth/callback/google`
8. Click **Create**

### 2.6 Copy Your Credentials
After creating, you'll see a popup with:
- **Client ID**: Copy this
- **Client Secret**: Copy this

If you closed the popup:
1. Go to **Credentials** page
2. Click on your OAuth 2.0 Client name
3. You'll see the Client ID and Client Secret

## Step 3: Update .env.local

Open `.env.local` and replace the placeholder values:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-from-step-1

GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here

# Leave Supabase empty for now
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Step 4: Restart Your Dev Server

**IMPORTANT**: You MUST restart the development server after updating environment variables.

1. Stop the current server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

## Step 5: Test Login

1. Go to http://localhost:3000/signin
2. Click "Continue with Google"
3. You should see the Google sign-in screen
4. Sign in with your Google account
5. You may need to confirm permissions
6. You should be redirected back to your app, now signed in!

## Troubleshooting

### "The OAuth client was not found"
- Make sure you've added the correct redirect URI: `http://localhost:3000/api/auth/callback/google`
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct in `.env.local`
- Restart your dev server

### "Redirect URI mismatch"
- In Google Cloud Console, verify the redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- No trailing slash, no extra characters

### "Access blocked: This app's request is invalid"
- Make sure you completed the OAuth consent screen setup
- Check that Google+ API is enabled

### Still not working?
1. Double-check all values in `.env.local`
2. Make sure there are no extra spaces
3. Restart your dev server again
4. Try in an incognito/private browser window

## For Production Deployment

When you deploy to production (e.g., Vercel), you'll need to:

1. Update `NEXTAUTH_URL` to your production domain
2. Add your production domain to **Authorized JavaScript origins**
3. Add `https://yourdomain.com/api/auth/callback/google` to **Authorized redirect URIs**
4. Set all environment variables in your hosting platform

## Security Notes

- Never commit `.env.local` to git (it's already in .gitignore)
- Never share your NEXTAUTH_SECRET or GOOGLE_CLIENT_SECRET
- Regenerate secrets if they're ever exposed
