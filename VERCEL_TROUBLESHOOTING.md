# Vercel Deployment Troubleshooting

## ✅ Pre-Deployment Checklist

### 1. **Missing Build Script Error**

If you see "Missing build script" error:

```bash
# Make sure this command works locally
npm run build:client

# Verify package.json has build script
grep -A 5 "scripts" package.json
```

### 2. **Missing Public Directory Error**

If you see "Missing public directory" error:

- ✅ Our output directory is configured: `build`
- ✅ Build command is set: `npm run build:vercel`
- ✅ Verify build produces files: `ls build/` should show `index.html`

### 3. **Conflicting Configuration Files**

Remove any of these if they exist:

- `now.json` (use `vercel.json` instead)
- `.now/` directory (use `.vercel/` instead)
- `.nowignore` (use `.vercelignore` instead)

### 4. **Function Pattern Issues**

Our functions are configured for the `api/` directory:

```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

## 🚀 Deployment Steps

### Option 1: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Vercel will auto-detect the settings
4. Deploy!

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 🔧 Common Error Fixes

### Build Command Errors

```bash
# If build fails, test locally first
npm run build:client

# Check if all dependencies are installed
npm ci
```

### Function Errors

- Functions must be in `api/` directory
- Check function logs in Vercel dashboard
- Verify environment variables are set

### Routing Issues

- SPA routing configured with rewrites (not routes)
- API calls go to `/api/*`
- All other routes fallback to `/index.html`

### Environment Variables

Set these in Vercel dashboard if needed:

- Any API keys
- Database URLs
- Third-party service credentials

## 📁 Expected File Structure

```
project/
├── vercel.json          ✅ Vercel configuration
├── package.json         ✅ Build scripts
├── api/                 ✅ Serverless functions
│   └── airtable/
│       └── contact.js
├── build/              ✅ Build output (after npm run build:vercel)
│   ├── index.html
│   └── assets/
├── client/             ✅ Source code
└── .vercelignore       ✅ Ignore file
```

## 🐛 If Deployment Still Fails

1. **Check Vercel Dashboard Logs**

   - Go to your project in Vercel dashboard
   - Click on the failed deployment
   - Check "Build Logs" and "Function Logs"

2. **Test Locally**

   ```bash
   # Test build
   npm run build:vercel

   # Test with Vercel dev
   npx vercel dev
   ```

3. **Common Issues**

   - Node.js version mismatch (we use Node 20)
   - Missing dependencies in package.json
   - Build output directory issues
   - API function syntax errors

4. **Get Help**
   - Check error message against [Vercel Error List](https://vercel.com/docs/errors)
   - Contact Vercel support with deployment logs

## ✨ Success Indicators

When deployment succeeds, you should see:

- ✅ Build completed successfully
- ✅ Functions deployed
- ✅ Domain assigned
- ✅ Site accessible at vercel URL

Your Figures Solutions website will be live with:

- Client-side routing working
- Contact form API functional
- Chatbot working
- All assets properly cached
