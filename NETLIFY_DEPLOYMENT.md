# Netlify Deployment Guide

This guide will help you deploy your website to Netlify.

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build for Production

```bash
npm run build:netlify
```

### 3. Test Locally with Netlify Dev (Optional)

```bash
# Install Netlify CLI globally if you haven't
npm install -g netlify-cli

# Start local Netlify development server
npm run netlify:dev
```

## Deployment Options

### Option A: Deploy via Netlify CLI

```bash
# Login to Netlify
netlify login

# Deploy to Netlify
netlify deploy --prod --dir=dist/spa
```

### Option B: Connect Git Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Netlify Dashboard](https://app.netlify.com/)
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   - **Build command:** `npm run build:netlify`
   - **Publish directory:** `dist/spa`
   - **Functions directory:** `netlify/functions`

## Build Configuration

The `netlify.toml` file is already configured with:

- ✅ Build command: `npm run build:netlify`
- ✅ Publish directory: `dist/spa`
- ✅ Functions directory: `netlify/functions`
- ✅ API redirects: `/api/*` → `/.netlify/functions/*`
- ✅ Performance headers and caching
- ✅ Security headers

## API Functions

Your Airtable API endpoint will work automatically:

- **Local development:** `http://localhost:8888/api/airtable/contact`
- **Production:** `https://yoursite.netlify.app/api/airtable/contact`

The API function is located at `netlify/functions/airtable/contact.ts` and includes:

- ✅ CORS headers
- ✅ Input validation
- ✅ Airtable integration
- ✅ Error handling

## Environment Variables (if needed)

If you want to move API keys to environment variables:

1. Go to your Netlify site dashboard
2. Go to Site Settings → Environment Variables
3. Add your variables
4. Update the function to use `process.env.VARIABLE_NAME`

## Troubleshooting

### Build Issues

- Make sure Node.js version is 18+ (configured in netlify.toml)
- Check that all dependencies are in package.json
- Verify build command runs locally: `npm run build:netlify`

### Function Issues

- Check Netlify function logs in the dashboard
- Test API endpoints locally with `netlify dev`
- Verify CORS headers are working

### Form Issues

- Ensure modal form points to correct API endpoint
- Check browser console for API errors
- Verify Airtable credentials are working

## Custom Domain (Optional)

To use your own domain:

1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Configure DNS records as shown in Netlify
4. Enable HTTPS (automatic with Netlify)

## Performance

The configuration includes:

- ✅ Asset caching (1 year for static files)
- ✅ Gzip compression (automatic)
- ✅ Image optimization (automatic)
- ✅ Edge functions for global performance

Your site should achieve excellent performance scores on all devices!
