# Route93 Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All features are complete and tested
- [ ] Code is committed to Git
- [ ] Database schema uses PostgreSQL (`provider = "postgresql"`)
- [ ] All environment variables are documented
- [ ] Build passes locally (`yarn rw build`)
- [ ] Health checks are working (`/api/health`, `/api/db-health`)

### Database Setup
- [ ] Production PostgreSQL database is created
- [ ] Database URL is ready
- [ ] Database allows external connections
- [ ] SSL is configured if required
- [ ] Connection limits are appropriate for expected traffic

### Stripe Configuration
- [ ] Stripe account is set up
- [ ] Live API keys are available (not test keys)
- [ ] Webhook endpoints are configured (if using)
- [ ] Payment methods are tested

### Environment Variables
Required variables for production:
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SESSION_SECRET` - Strong random string (32+ characters)
- [ ] `STRIPE_SECRET_KEY` - Live Stripe secret key (starts with `sk_live_`)
- [ ] `REDWOOD_ENV_STRIPE_PUBLISHABLE_KEY` - Live Stripe publishable key (starts with `pk_live_`)

Optional but recommended:
- [ ] `REDWOOD_API_URL` - Your API URL (auto-detected by Vercel)
- [ ] `REDWOOD_WEB_URL` - Your web URL (auto-detected by Vercel)

## 🚀 Deployment Steps

### 1. GitHub Setup
- [ ] Repository is pushed to GitHub
- [ ] Main branch contains latest code
- [ ] Repository is public or accessible to Vercel

### 2. Vercel Configuration
- [ ] Vercel account is created
- [ ] GitHub is connected to Vercel
- [ ] Repository is imported to Vercel
- [ ] Build settings are configured:
  - Framework Preset: **Other**
  - Build Command: `yarn rw deploy vercel`
  - Output Directory: `web/dist`
  - Install Command: `yarn install --frozen-lockfile`

### 3. Environment Variables
- [ ] All required environment variables are set in Vercel dashboard
- [ ] Variables are set for the correct environment (Production)
- [ ] Sensitive values are properly secured
- [ ] Test deployment with preview branch first

### 4. Database Migration
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Pull environment variables: `vercel env pull .env.local`
- [ ] Run migrations: `yarn rw prisma migrate deploy`
- [ ] Seed database: `yarn rw prisma db seed`

### 5. Custom Domain (Optional)
- [ ] Domain is purchased and accessible
- [ ] Domain is added in Vercel dashboard
- [ ] DNS records are updated
- [ ] SSL certificate is active

## ✅ Post-Deployment Verification

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] Product pages display properly
- [ ] Search functionality works
- [ ] User registration/login works
- [ ] Shopping cart functions properly
- [ ] Checkout process completes successfully
- [ ] Payment processing works with test cards
- [ ] Admin dashboard is accessible
- [ ] All admin functions work properly

### Health Checks
- [ ] `/api/health` returns 200 OK
- [ ] `/api/db-health` returns 200 OK
- [ ] Database connection is stable
- [ ] All GraphQL queries work

### Performance Tests
- [ ] Page load times are acceptable
- [ ] API response times are reasonable
- [ ] Images load properly
- [ ] Mobile responsiveness works

### Security Verification
- [ ] HTTPS is enforced
- [ ] Admin routes require authentication
- [ ] User data is properly protected
- [ ] Payment data is secure
- [ ] No sensitive data in client-side code

## 🔧 Troubleshooting

### Common Issues and Solutions

**Build Failures:**
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Ensure environment variables are set
- Try building locally first

**Database Connection Issues:**
- Verify DATABASE_URL format
- Check database server allows external connections
- Ensure SSL configuration is correct
- Test connection with database client

**Stripe Payment Issues:**
- Verify live API keys are used
- Check webhook endpoints
- Test with Stripe test cards
- Review Stripe dashboard for errors

**Performance Issues:**
- Enable Vercel Analytics
- Check function execution times
- Monitor database query performance
- Optimize images and assets

## 📊 Monitoring Setup

### Recommended Monitoring
- [ ] Set up error monitoring (Sentry, Bugsnag)
- [ ] Configure uptime monitoring (Uptime Robot)
- [ ] Enable Vercel Analytics
- [ ] Set up database monitoring
- [ ] Configure alert notifications

### Health Check Endpoints
- [ ] `/api/health` - Basic application health
- [ ] `/api/db-health` - Database connectivity and table checks

## 🎯 Success Criteria

Your deployment is successful when:
- [ ] All tests in this checklist pass
- [ ] Application is accessible via custom domain (if configured)
- [ ] All features work as expected
- [ ] Performance meets requirements
- [ ] Security measures are in place
- [ ] Monitoring is active

## 📞 Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **RedwoodJS Deployment Guide**: https://redwoodjs.com/docs/deploy/vercel
- **Stripe Documentation**: https://stripe.com/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

## 🎉 Congratulations!

Once all items are checked off, your Route93 e-commerce store is live and ready for customers!

Remember to:
- Monitor application health regularly
- Keep dependencies updated
- Back up your database
- Plan for scaling as your business grows

**Happy selling! 🛒✨**
