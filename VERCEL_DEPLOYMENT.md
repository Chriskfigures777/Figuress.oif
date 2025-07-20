# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo)

## Manual Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
vercel
```

## Configuration

The project is configured with:

- **Build Command**: `npm run build:vercel`
- **Output Directory**: `build`
- **Dev Command**: `npm run dev`
- **Node.js Version**: 20.x

## Environment Variables

If you need to add environment variables:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add your variables

## API Routes

The project includes Vercel serverless functions:

- `/api/airtable/contact` - Contact form submission

## Features

✅ React SPA with client-side routing  
✅ Serverless API functions  
✅ Automatic HTTPS  
✅ Global CDN  
✅ Automatic deployments  
✅ Environment variable support  
✅ Security headers configured

## Build Output

```
build/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
└── favicon.ico
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use Vercel dev for testing serverless functions
npx vercel dev
```

## Troubleshooting

### Build Issues

- Ensure all dependencies are in `package.json`
- Check that build command completes successfully locally
- Verify Node.js version compatibility

### API Issues

- Check function logs in Vercel dashboard
- Ensure environment variables are set
- Verify API route paths match Vercel function structure

### Routing Issues

- SPA routing is configured in `vercel.json`
- All routes fallback to `index.html`
- API routes are properly prefixed with `/api`
