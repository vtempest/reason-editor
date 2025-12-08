# Deployment Guide

This guide explains how to deploy the Reason Editor to Vercel with Turso database.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Turso](https://turso.tech) account
3. The Vercel CLI (optional): `npm i -g vercel`

## Step 1: Set up Turso Database

### Install Turso CLI

```bash
# macOS or Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
irm get.tur.so/install.ps1 | iex
```

### Create and Configure Database

```bash
# Sign up or login
turso auth signup
# or
turso auth login

# Create a new database
turso db create reason-editor

# Get the database URL
turso db show reason-editor --url

# Create an auth token
turso db tokens create reason-editor
```

Save these values for the next step:
- Database URL (e.g., `libsql://reason-editor-yourusername.turso.io`)
- Auth Token (the long string from the tokens create command)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your Git repository
3. Configure the project:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variables:
   - `TURSO_DATABASE_URL`: Your Turso database URL
   - `TURSO_AUTH_TOKEN`: Your Turso auth token
   - `NEXT_PUBLIC_APP_URL`: Your production domain (e.g., `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_API_URL`: Your API URL (e.g., `https://your-app.vercel.app`)
5. Click **Deploy**

### Option B: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# Add environment variables
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_API_URL

# Deploy to production
vercel --prod
```

## Step 3: Initialize Database Schema

After deploying, the database schema will be automatically initialized on first API request.

To manually verify or initialize:

```bash
# Using the Turso CLI
turso db shell reason-editor

# Run the following SQL to check tables
.tables

# You should see: documents, google_docs_sync, research_quotes
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `TURSO_DATABASE_URL` | Your Turso database URL | `libsql://reason-editor.turso.io` |
| `TURSO_AUTH_TOKEN` | Your Turso authentication token | `eyJhbGc...` |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://your-app.vercel.app` |
| `GOOGLE_CLIENT_ID` | (Optional) Google OAuth client ID | |
| `GOOGLE_CLIENT_SECRET` | (Optional) Google OAuth secret | |
| `NEXTAUTH_URL` | (Optional) NextAuth URL | Same as APP_URL |
| `NEXTAUTH_SECRET` | (Optional) NextAuth secret | Random string |

## Local Development with Turso

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Turso credentials to `.env.local`

3. Start the development servers:
   ```bash
   # Frontend (Vite)
   npm run dev

   # Backend API (Next.js)
   npm run api
   ```

## Using SQLite Locally (Alternative)

If you prefer to use SQLite locally and Turso in production:

1. Keep using `lib/services/documentService.ts` for local development
2. Switch to `lib/services/documentServiceTurso.ts` in production

Update your API routes to conditionally use the appropriate service:

```typescript
// In your API routes
const DocumentService = process.env.TURSO_DATABASE_URL 
  ? require('@/lib/services/documentServiceTurso').DocumentService
  : require('@/lib/services/documentService').DocumentService;
```

## Troubleshooting

### Database Connection Errors

- Verify your `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are correct
- Check that the Turso database is active: `turso db show reason-editor`

### CORS Errors

- Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
- Verify the `next.config.mjs` CORS configuration includes your domain

### Build Failures

- Ensure all dependencies are in `package.json`
- Check that `@libsql/client` is installed
- Verify Node.js version compatibility (18.x or higher)

## Database Migrations

When updating the schema:

1. Update `lib/db/turso.ts` with new tables/columns
2. Deploy to Vercel
3. The schema will auto-update on next initialization

For production databases with data, consider:
- Using Turso's schema diff tools
- Writing migration scripts
- Testing in a staging database first

## Monitoring

- **Turso Dashboard**: Monitor database usage at [turso.tech](https://turso.tech)
- **Vercel Analytics**: View deployment and API logs in Vercel dashboard
- **Error Tracking**: Consider adding Sentry or similar for error monitoring

## Scaling

Turso provides:
- **Automatic scaling**: Handles traffic spikes automatically
- **Edge replication**: Replicate data to multiple regions
- **Embedded replicas**: Optional local-first architecture

To enable replication:
```bash
turso db replicate reason-editor <region>
```

## Security

- Rotate auth tokens periodically: `turso db tokens create reason-editor`
- Use environment variables for all secrets
- Enable HTTPS only in production
- Consider adding authentication via NextAuth

## Support

- Turso: [discord.gg/turso](https://discord.gg/turso)
- Vercel: [vercel.com/support](https://vercel.com/support)
- This project: Open an issue on GitHub
