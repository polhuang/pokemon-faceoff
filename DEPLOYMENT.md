# Deployment Guide

## Quick Start - Deploy to Vercel

### 1. Deploy to Vercel
```bash
# If you haven't already, install Vercel CLI
npm i -g vercel

# Deploy the project
vercel --prod
```

### 2. Add Vercel Postgres Database

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to the "Storage" tab
4. Click "Create" and select "Postgres"
5. Follow the setup wizard

This will automatically create all necessary environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 3. Redeploy

After adding the database, trigger a new deployment:
```bash
vercel --prod
```

Your Pokemon Faceoff app is now live with persistent vote storage!

## Alternative: Manual Setup

### Using Vercel Dashboard

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Deploy

2. **Add Database**:
   - In project dashboard → Storage → Create → Postgres
   - Environment variables are automatically configured

3. **Verify Deployment**:
   - Visit your deployed URL
   - Test voting functionality
   - Check that votes persist after page reload

## Troubleshooting

### Database Connection Issues
- Ensure all POSTGRES_* environment variables are set
- Check Vercel function logs for connection errors
- Verify the database is active in Vercel dashboard

### Build Errors
- Check that all dependencies are installed
- Verify TypeScript compilation passes locally
- Review Vercel function logs for runtime errors

### Vote Data Not Persisting
- Confirm database environment variables are correct
- Check API routes are working at `/api/pokemon`, `/api/vote`, `/api/results`
- Verify database tables were created successfully

## Features After Deployment

✅ **Persistent Votes**: All votes stored in Postgres database
✅ **Real-time Rankings**: Results update immediately after votes
✅ **Server-side Rendering**: Fast page loads with SSR
✅ **Auto-scaling**: Handles traffic spikes automatically
✅ **Zero Downtime**: Votes persist across deployments