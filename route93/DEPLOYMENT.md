# Route93 - Vercel Deployment Guide

This guide will walk you through deploying your Route93 e-commerce application to Vercel.

## 📋 Prerequisites

- [Vercel account](https://vercel.com/signup)
- [GitHub account](https://github.com) (for automatic deployments)
- Production database (PostgreSQL recommended)
- Stripe account with live API keys

## 🚀 Quick Deploy

### Step 1: Database Setup

1. **Create a PostgreSQL database** (recommended providers):
   - [Supabase](https://supabase.com) (Free tier available)
   - [Railway](https://railway.app) (Simple setup)
   - [PlanetScale](https://planetscale.com) (MySQL alternative)
   - [Heroku Postgres](https://www.heroku.com/postgres)

2. **Get your database URL** in this format:
   ```
   postgresql://username:password@host:port/database
   ```

### Step 2: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git remote add origin https://github.com/yourusername/route93.git
   git push -u origin main
   ```

### Step 3: Deploy to Vercel

1. **Connect GitHub to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: **Other**
   - Build Command: `yarn rw deploy vercel`
   - Output Directory: `web/dist`
   - Install Command: `yarn install --frozen-lockfile`

3. **Set Environment Variables** in Vercel Dashboard:

#### Required Variables:
```bash
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-super-secret-session-key-make-it-long-and-random
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
REDWOOD_ENV_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
```

#### Optional Variables:
```bash
REDWOOD_API_URL=https://your-domain.vercel.app/api
REDWOOD_WEB_URL=https://your-domain.vercel.app
```

### Step 4: Database Migration

After deployment, run database migrations:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Run migrations**:
   ```bash
   vercel env pull .env.local
   yarn rw prisma migrate deploy
   yarn rw prisma db seed
   ```

## 🔧 Advanced Configuration

### Custom Domain

1. Go to your Vercel project dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### Environment Variables by Environment

Set different variables for preview vs production:
- Use Vercel's branch-based environment variables
- Production: `main` branch
- Preview: all other branches

### Performance Optimizations

The following optimizations are already configured:

1. **Static File Caching**: Automatic via Vercel
2. **API Route Optimization**: Node.js 18.x runtime
3. **Database Connection Pooling**: Configure in your database provider
4. **Image Optimization**: Consider using Vercel's Image Optimization

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules yarn.lock
   yarn install
   yarn rw build
   ```

2. **Database Connection Issues**:
   - Verify DATABASE_URL format
   - Check database server allows external connections
   - Ensure SSL is configured if required

3. **Stripe Issues**:
   - Verify you're using live keys (not test keys)
   - Check webhook endpoints if using Stripe webhooks

4. **Environment Variables Not Working**:
   - Ensure variables are set in Vercel dashboard
   - Redeploy after adding new environment variables
   - Check variable names match exactly (case-sensitive)

### Logs and Debugging

1. **View build logs**: Vercel Dashboard → Project → Deployments
2. **View function logs**: Vercel Dashboard → Functions tab
3. **Local debugging**:
   ```bash
   vercel dev
   ```

## 📊 Monitoring and Analytics

### Recommended Services

1. **Error Monitoring**: [Sentry](https://sentry.io)
2. **Analytics**: [Google Analytics](https://analytics.google.com)
3. **Performance**: [Vercel Analytics](https://vercel.com/analytics)
4. **Uptime**: [Uptime Robot](https://uptimerobot.com)

### Health Checks

Add these endpoints to monitor your application:
- `/api/health` - API health check
- `/api/db-health` - Database connectivity check

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use environment variables only
3. **Database**: Enable SSL connections
4. **Session Secret**: Use a strong, random string
5. **CORS**: Configure properly for your domain
6. **Rate Limiting**: Consider implementing for API endpoints

## 📈 Scaling Considerations

1. **Database**: Monitor connection limits
2. **Functions**: Vercel has execution time limits (10s for hobby, 15s for pro)
3. **File Storage**: Consider AWS S3 for user uploads
4. **CDN**: Vercel provides global CDN automatically

## 🚀 Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Sample data seeded (optional)
- [ ] Stripe webhooks configured (if using)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Error monitoring setup
- [ ] Analytics configured
- [ ] Backup strategy in place

## 📞 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [RedwoodJS Deployment Guide](https://redwoodjs.com/docs/deploy/vercel)
3. Review build logs in Vercel dashboard
4. Test locally with `vercel dev`

## 🎉 You're Live!

Your Route93 e-commerce store is now live on Vercel! 🛒✨

Remember to:
- Test all functionality in production
- Set up monitoring and alerts
- Configure backups
- Plan for scaling as your business grows

Happy selling! 🚀
