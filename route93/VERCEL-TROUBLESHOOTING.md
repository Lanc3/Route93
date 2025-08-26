# Vercel Deployment Troubleshooting Guide

This guide specifically addresses common Vercel deployment issues for Route93.

## 🚨 Common Error: "Couldn't find package.json file"

### Symptoms
```
error Couldn't find a package.json file in "/vercel/path0"
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
Error: Command "yarn rw deploy vercel" exited with 1
```

### Root Cause
This error occurs when Vercel's build environment can't properly locate the package.json file due to workspace/monorepo configuration issues.

### Solutions

#### Solution 1: Correct Vercel Settings (Recommended)

1. **In Vercel Dashboard → Project Settings → General**:
   - **Framework Preset**: Set to "Other" (NOT RedwoodJS)
   - **Root Directory**: Leave completely blank
   - **Build Command**: `yarn vercel-build`
   - **Output Directory**: `web/dist`
   - **Install Command**: `yarn install --frozen-lockfile`

2. **Redeploy** the project after making these changes.

#### Solution 2: Alternative Build Command

If Solution 1 doesn't work, try these build commands in order:

1. `yarn install --frozen-lockfile && yarn rw deploy vercel`
2. `npm run vercel-build`
3. `./scripts/vercel-build.sh` (if using bash script)

#### Solution 3: Clear Vercel Cache

1. Go to Vercel Dashboard → Project → Settings
2. Scroll to "General" section
3. Click "Clear Build Cache"
4. Redeploy

#### Solution 4: Check Repository Structure

Ensure your repository structure looks like this:
```
route93/
├── package.json          ← This must be at root
├── vercel.json           ← This must be at root
├── yarn.lock
├── api/
│   └── ...
├── web/
│   └── ...
└── scripts/
    └── ...
```

## 🔧 Step-by-Step Fix

### 1. Verify Local Build Works
```bash
cd route93
yarn install
yarn rw build
# Should complete without errors
```

### 2. Check Vercel Configuration
Ensure `vercel.json` contains:
```json
{
  "buildCommand": "yarn vercel-build",
  "outputDirectory": "web/dist",
  "installCommand": "yarn install --frozen-lockfile",
  "framework": null
}
```

### 3. Verify Package.json Scripts
Ensure `package.json` contains:
```json
{
  "scripts": {
    "vercel-build": "yarn rw deploy vercel"
  }
}
```

### 4. Update Vercel Settings
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → General
4. Update build settings as shown in Solution 1
5. Save changes

### 5. Force Redeploy
1. Make a small change to your code (add a comment)
2. Commit and push to trigger new deployment
3. Or manually redeploy from Vercel dashboard

## 🐛 Other Common Issues

### Node.js Version Mismatch
**Error**: `The engine "node" is incompatible with this module. Expected version "=20.x". Got "22.18.0"`

**Solution**: 
1. **Update `package.json`** to be more flexible:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

2. **Add `.nvmrc` file** to specify Node.js 20:
```
20
```

3. **Let Vercel auto-detect runtime** by removing functions section from `vercel.json`:
```json
{
  "buildCommand": "yarn vercel-build",
  "outputDirectory": "web/dist",
  "installCommand": "yarn install",
  "framework": null,
  "rewrites": [...]
}
```

**Alternative**: If you need explicit runtime control, use:
```json
{
  "functions": {
    "api/dist/functions/*.js": {
      "runtime": "@vercel/node@20.x"
    }
  }
}
```

### Function Runtime Error
**Error**: `Function Runtimes must have a valid version, for example 'now-php@1.0.0'`

**Solution**: Remove the `functions` section from `vercel.json` to let Vercel auto-detect:
```json
{
  "buildCommand": "yarn vercel-build",
  "outputDirectory": "web/dist", 
  "installCommand": "yarn install",
  "framework": null
}
```

### Yarn Version Issues
**Error**: Various yarn-related errors

**Solution**: Add to `package.json`:
```json
{
  "packageManager": "yarn@4.6.0"
}
```

### Environment Variables Missing
**Error**: Database connection errors or missing configuration

**Solution**: 
1. Set all required environment variables in Vercel dashboard
2. Ensure variable names match exactly (case-sensitive)
3. Redeploy after adding variables

### Build Timeout
**Error**: Build exceeds time limit

**Solution**:
1. Upgrade to Vercel Pro plan (longer build times)
2. Optimize build process
3. Remove unnecessary dependencies

### API Functions Not Working
**Error**: 500 errors on API routes

**Solution**: Ensure `vercel.json` includes:
```json
{
  "functions": {
    "api/dist/functions/*.js": {
      "runtime": "@vercel/node@18.x"
    }
  }
}
```

## 🎯 Quick Fixes Checklist

Try these in order:

- [ ] Set Framework Preset to "Other" (not RedwoodJS)
- [ ] Clear Root Directory setting (leave blank)
- [ ] Use build command: `yarn vercel-build`
- [ ] Clear Vercel build cache
- [ ] Ensure `vercel.json` is at repository root
- [ ] Verify `package.json` is at repository root
- [ ] Check Node.js version matches (20.x)
- [ ] Set all environment variables
- [ ] Force redeploy

## 🆘 Still Having Issues?

### 1. Check Build Logs
- Go to Vercel Dashboard → Deployments
- Click on failed deployment
- Review full build logs
- Look for specific error messages

### 2. Test Locally
```bash
# Test build locally
yarn install
yarn rw deploy vercel

# Test with exact Vercel command
yarn vercel-build
```

### 3. Compare Working Projects
- Check other successful RedwoodJS + Vercel deployments
- Compare `vercel.json` configurations
- Verify project structure

### 4. Contact Support
If all else fails:
- **Vercel Support**: Support from your Vercel dashboard
- **RedwoodJS Community**: [Discord](https://discord.gg/redwoodjs) or [Forum](https://community.redwoodjs.com)
- **GitHub Issues**: Check existing issues or create new one

## ✅ Success Indicators

Your deployment is working when:
- Build completes without errors
- Web app loads at your Vercel URL
- API endpoints respond (test `/api/health`)
- Database connections work
- All features function as expected

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [RedwoodJS Deployment Guide](https://redwoodjs.com/docs/deploy/vercel)
- [Vercel Build Configuration](https://vercel.com/docs/build-step)
- [RedwoodJS Community](https://community.redwoodjs.com)

---

**Remember**: Most package.json errors are due to incorrect Vercel settings. Start with Solution 1 above! 🎯
