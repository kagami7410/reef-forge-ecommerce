# Production Deployment Checklist - Reef Forge E-Commerce

This is a comprehensive, actionable checklist for deploying the Reef Forge e-commerce application to production. Follow each step sequentially to ensure a smooth deployment.

## Legend
- ☐ Not started
- ⏳ In progress
- ✅ Completed
- ⚠️ Blocked/Issue

---

## Phase 1: Infrastructure Setup (Week 1)

### Hosting Platform (Vercel)
- [ ] Create Vercel account at https://vercel.com
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Link GitHub repository to Vercel
- [ ] Configure project settings in Vercel dashboard
- [ ] Upgrade to Pro plan ($20/month) for production features

### Domain & DNS
- [ ] Register domain name (Namecheap, Google Domains, etc.)
- [ ] Add custom domain in Vercel dashboard
- [ ] Update DNS records:
  - [ ] A record pointing to Vercel IP
  - [ ] CNAME for www subdomain
  - [ ] TXT record for domain verification
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify SSL certificate is active (automatic via Vercel)

### Database (Supabase)
- [ ] Verify Supabase project is on Pro plan ($25/month)
- [ ] Run `supabase-schema.sql` in SQL Editor
- [ ] Run `supabase-address-migration.sql` in SQL Editor
- [ ] Run production indexes from deployment plan
- [ ] Enable Point-in-Time Recovery (PITR)
- [ ] Configure daily automatic backups
- [ ] Test database connection from local environment
- [ ] Enable connection pooling (PgBouncer)
- [ ] Review and verify Row Level Security (RLS) policies
- [ ] Set up read-only user for analytics (optional)

### Payment Gateway (Stripe)
- [ ] Complete Stripe business verification
- [ ] Activate Stripe live mode
- [ ] Get production API keys:
  - [ ] Publishable key (pk_live_...)
  - [ ] Secret key (sk_live_...)
- [ ] Create webhook endpoint in Stripe dashboard
  - URL: `https://yourdomain.com/api/webhooks/stripe`
  - Events: checkout.session.completed, checkout.session.expired, payment_intent.succeeded, payment_intent.payment_failed
- [ ] Save webhook signing secret (whsec_...)
- [ ] Enable 3D Secure (SCA compliance)
- [ ] Configure Stripe Radar for fraud detection
- [ ] Set up email receipts in Stripe settings
- [ ] Configure tax calculations (if needed)
- [ ] Test payment in Stripe test mode

### CDN & Image Storage (Cloudinary)
- [ ] Verify Cloudinary account configuration
- [ ] Upgrade to paid plan if needed (based on usage)
- [ ] Enable automatic image optimization
- [ ] Configure responsive image transformations
- [ ] Test image loading from production URL
- [ ] Set up CDN caching policies
- [ ] Configure WebP/AVIF format conversion

---

## Phase 2: Code Preparation (Week 1-2)

### Environment Variables
- [ ] Create `.env.production` file (do NOT commit)
- [ ] Add all environment variables to Vercel:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - [ ] STRIPE_SECRET_KEY
  - [ ] STRIPE_WEBHOOK_SECRET
  - [ ] NEXT_PUBLIC_SITE_URL
  - [ ] GOOGLE_CLIENT_ID (if using OAuth)
  - [ ] GOOGLE_CLIENT_SECRET (if using OAuth)
  - [ ] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- [ ] Verify all variables are set in Vercel production environment
- [ ] Test environment variable access in deployment preview

### Code Updates
- [ ] Update `next.config.js` with production settings (from deployment plan)
- [ ] Create health check endpoint: `app/api/health/route.ts`
- [ ] Add rate limiting middleware: `middleware.ts`
- [ ] Update image domains in next.config.js
- [ ] Add security headers configuration
- [ ] Enable ISR (Incremental Static Regeneration) for product pages
- [ ] Implement error boundaries in key components
- [ ] Add structured logging (optional)

### Dependencies
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update critical dependencies to latest stable versions
- [ ] Remove unused dependencies
- [ ] Test application with updated dependencies
- [ ] Commit and push dependency updates

### Build Testing
- [ ] Run `npm run build` locally
- [ ] Verify build completes without errors
- [ ] Test production build locally: `npm start`
- [ ] Check bundle size and optimize if needed
- [ ] Verify all pages render correctly

---

## Phase 3: CI/CD Pipeline (Week 2)

### GitHub Actions
- [ ] Copy `.github/workflows/production.yml` to repository
- [ ] Add GitHub Secrets:
  - [ ] VERCEL_TOKEN
  - [ ] VERCEL_ORG_ID
  - [ ] VERCEL_PROJECT_ID
  - [ ] All environment variables from Vercel
- [ ] Create test pull request to verify workflow
- [ ] Verify preview deployment works
- [ ] Test automated security scanning
- [ ] Verify build artifacts are created

### Deployment Configuration
- [ ] Review and update `vercel.json`
- [ ] Configure caching headers
- [ ] Set up redirects (www to non-www, etc.)
- [ ] Configure rewrites if needed
- [ ] Test deployment from GitHub push

---

## Phase 4: Security Hardening (Week 2)

### Authentication & Authorization
- [ ] Verify Supabase RLS policies are restrictive
- [ ] Test user authentication flow
- [ ] Configure Google OAuth in production:
  - [ ] Add production redirect URI to Google Console
  - [ ] Verify OAuth consent screen
  - [ ] Test OAuth login flow
- [ ] Implement session timeout
- [ ] Add CSRF protection (built into Next.js)

### API Security
- [ ] Implement rate limiting (Upstash Redis recommended)
- [ ] Add authentication to all protected API routes
- [ ] Verify Stripe webhook signature validation
- [ ] Add request logging for API routes
- [ ] Configure CORS policies
- [ ] Test API routes with invalid/malicious inputs

### Application Security
- [ ] Enable Content Security Policy (CSP)
- [ ] Configure security headers in next.config.js
- [ ] Remove console.log statements from production code
- [ ] Implement error handling (don't expose stack traces)
- [ ] Add input validation on all forms
- [ ] Sanitize user inputs
- [ ] Enable HTTPS enforcement

### Secrets Management
- [ ] Verify no secrets in source code
- [ ] Run secret scanning tool (TruffleHog in CI/CD)
- [ ] Rotate all API keys and secrets
- [ ] Enable 2FA on all service accounts:
  - [ ] GitHub
  - [ ] Vercel
  - [ ] Supabase
  - [ ] Stripe
  - [ ] Cloudinary
  - [ ] Domain registrar

---

## Phase 5: Monitoring & Observability (Week 2)

### Error Tracking (Sentry)
- [ ] Create Sentry account at sentry.io
- [ ] Install Sentry SDK: `npm install @sentry/nextjs`
- [ ] Run Sentry setup wizard: `npx @sentry/wizard@latest -i nextjs`
- [ ] Configure Sentry DSN in environment variables
- [ ] Test error reporting
- [ ] Set up error alerts (email, Slack)
- [ ] Configure error sampling rate

### Uptime Monitoring
- [ ] Sign up for Better Uptime (or similar)
- [ ] Create monitor for homepage: `https://yourdomain.com`
- [ ] Create monitor for health endpoint: `https://yourdomain.com/api/health`
- [ ] Create monitor for API: `https://yourdomain.com/products`
- [ ] Configure alert channels (email, SMS, Slack)
- [ ] Set monitoring interval (1-5 minutes)
- [ ] Test alert delivery

### Application Monitoring
- [ ] Enable Vercel Analytics in dashboard
- [ ] Review Core Web Vitals metrics
- [ ] Set up custom analytics (optional - Google Analytics)
- [ ] Configure performance budgets
- [ ] Monitor API response times

### Logging
- [ ] Configure log aggregation (Logtail, Axiom, or Vercel logs)
- [ ] Set up structured logging
- [ ] Configure log retention policies
- [ ] Create log-based alerts for critical errors
- [ ] Test log search and filtering

---

## Phase 6: Testing (Week 2-3)

### Functional Testing
- [ ] Test complete user registration flow
- [ ] Test Google OAuth login
- [ ] Test product browsing and search
- [ ] Test add to cart functionality
- [ ] Test checkout flow end-to-end
- [ ] Test Stripe payment processing (test mode first)
- [ ] Test order creation in database
- [ ] Test webhook delivery and processing
- [ ] Test order status updates
- [ ] Verify email notifications (if implemented)

### Payment Testing
- [ ] Test successful payment with test card
- [ ] Test failed payment scenarios
- [ ] Test payment with 3D Secure
- [ ] Test webhook retry logic
- [ ] Verify refund process in Stripe dashboard
- [ ] Test with different payment methods
- [ ] Verify payment reconciliation

### Performance Testing
- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Test page load times
- [ ] Test with slow 3G network
- [ ] Load test with 100 concurrent users (optional)
- [ ] Check database query performance
- [ ] Verify CDN caching is working
- [ ] Test image loading and optimization

### Browser Compatibility
- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Edge (latest)
- [ ] Test on mobile browsers (iOS Safari, Chrome)
- [ ] Test responsive design on various screen sizes

### Security Testing
- [ ] Run OWASP ZAP security scan
- [ ] Test for SQL injection vulnerabilities
- [ ] Test for XSS vulnerabilities
- [ ] Verify CSRF protection
- [ ] Test rate limiting
- [ ] Verify secure headers are present
- [ ] Test with security audit tools

### Accessibility Testing
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Test keyboard navigation
- [ ] Verify color contrast ratios (WCAG AA)
- [ ] Test with browser zoom (200%)
- [ ] Run axe DevTools accessibility scan
- [ ] Fix critical accessibility issues

---

## Phase 7: Pre-Launch (Week 3)

### Documentation
- [ ] Review and update README.md
- [ ] Document environment variables
- [ ] Create operational runbooks
- [ ] Document backup and restore procedures
- [ ] Create incident response plan
- [ ] Document rollback procedures
- [ ] Create user guides (if needed)

### Business Preparation
- [ ] Set up customer support email/system
- [ ] Prepare FAQ documentation
- [ ] Create return/refund policy
- [ ] Prepare terms of service
- [ ] Create privacy policy (GDPR compliance)
- [ ] Set up order notification system (future)
- [ ] Train support team

### Legal & Compliance
- [ ] Review GDPR compliance (if serving EU customers)
- [ ] Add cookie consent banner (if needed)
- [ ] Verify PCI-DSS compliance (handled by Stripe)
- [ ] Review terms of service
- [ ] Review privacy policy
- [ ] Add necessary legal disclaimers

### Final Checks
- [ ] Complete end-to-end smoke test
- [ ] Verify all environment variables are set
- [ ] Test disaster recovery procedures
- [ ] Review security checklist
- [ ] Verify monitoring and alerts are active
- [ ] Check SSL certificate expiry date
- [ ] Verify DNS is propagated
- [ ] Test from multiple geographic locations

---

## Phase 8: Production Deployment (Week 3)

### Pre-Deployment
- [ ] Notify stakeholders of deployment window
- [ ] Create deployment backup plan
- [ ] Prepare rollback procedure
- [ ] Schedule deployment (low-traffic time recommended)
- [ ] Final code review
- [ ] Merge all changes to main branch

### Deployment
- [ ] Trigger production deployment (automatic via Git push or manual via Vercel)
- [ ] Monitor deployment progress in Vercel dashboard
- [ ] Wait for build to complete (typically 5-10 minutes)
- [ ] Verify deployment success message

### Post-Deployment Verification
- [ ] Wait 2-3 minutes for edge network propagation
- [ ] Run health check: `curl https://yourdomain.com/api/health`
- [ ] Verify homepage loads: `https://yourdomain.com`
- [ ] Test product page: `https://yourdomain.com/products`
- [ ] Test user authentication
- [ ] Create test order (small amount in live mode)
- [ ] Verify order appears in Supabase
- [ ] Check webhook delivery in Stripe dashboard
- [ ] Verify payment processing
- [ ] Check error logs in Sentry
- [ ] Review performance metrics in Vercel Analytics

### Smoke Tests
- [ ] Homepage loads successfully
- [ ] Products page displays correctly
- [ ] Product detail page works
- [ ] User can sign in with Google
- [ ] Cart functionality works
- [ ] Checkout page loads
- [ ] Payment form renders (Stripe Elements)
- [ ] Order confirmation page works
- [ ] User dashboard shows orders

---

## Phase 9: Post-Launch Monitoring (Week 3-4)

### First 24 Hours
- [ ] Monitor error rates every 2 hours
- [ ] Check uptime monitoring dashboard
- [ ] Review application logs
- [ ] Monitor payment processing
- [ ] Check database performance
- [ ] Review user feedback
- [ ] Verify webhook delivery
- [ ] Monitor traffic patterns

### First Week
- [ ] Daily error log review
- [ ] Performance optimization based on metrics
- [ ] Address any critical issues
- [ ] Review and adjust monitoring thresholds
- [ ] Collect user feedback
- [ ] Monitor conversion rates
- [ ] Review payment success rates
- [ ] Check database storage and performance

### First Month
- [ ] Weekly performance review
- [ ] Cost analysis and optimization
- [ ] Review scaling needs
- [ ] Update documentation with lessons learned
- [ ] Plan next features/improvements
- [ ] Review security logs
- [ ] Analyze user behavior
- [ ] Optimize slow queries

---

## Rollback Procedure

If critical issues are detected post-deployment:

1. [ ] Immediately notify stakeholders
2. [ ] Assess severity and impact
3. [ ] Determine if rollback is necessary
4. [ ] Execute rollback in Vercel (redeploy previous version)
5. [ ] Verify rollback success
6. [ ] Notify users if needed
7. [ ] Investigate and fix issues
8. [ ] Prepare hotfix
9. [ ] Test hotfix thoroughly
10. [ ] Deploy hotfix when ready

---

## Ongoing Maintenance

### Daily
- [ ] Monitor error rates in Sentry
- [ ] Check uptime status
- [ ] Review order processing

### Weekly
- [ ] Review performance metrics
- [ ] Check security audit logs
- [ ] Update dependencies (security patches)
- [ ] Review user feedback

### Monthly
- [ ] Database backup verification
- [ ] Security vulnerability scan
- [ ] Performance optimization review
- [ ] Cost analysis and optimization
- [ ] Review and update documentation

### Quarterly
- [ ] Disaster recovery drill
- [ ] Full security audit
- [ ] Dependency major version updates
- [ ] Review and update monitoring strategy
- [ ] Team training and knowledge sharing

---

## Emergency Contacts

| Role | Name | Contact | Availability |
|------|------|---------|-------------|
| DevOps Lead | [Name] | [Email/Phone] | 24/7 |
| Backend Developer | [Name] | [Email/Phone] | Business hours |
| Frontend Developer | [Name] | [Email/Phone] | Business hours |
| Database Admin | [Name] | [Email/Phone] | On-call |
| Security Lead | [Name] | [Email/Phone] | On-call |

---

## Service Status Pages

Monitor these dashboards during deployment:

- Vercel Status: https://www.vercel-status.com
- Supabase Status: https://status.supabase.com
- Stripe Status: https://status.stripe.com
- Cloudinary Status: https://status.cloudinary.com

---

## Success Criteria

The deployment is successful when:

- [ ] All items in this checklist are completed
- [ ] Application is accessible via production URL
- [ ] All critical user flows are functional
- [ ] Error rate < 1%
- [ ] Response time < 2 seconds (average)
- [ ] Payment processing success rate > 95%
- [ ] Uptime > 99.9%
- [ ] No critical security vulnerabilities
- [ ] Monitoring and alerts are functioning
- [ ] Team is trained and ready for support

---

**Deployment Date**: _________________

**Deployed By**: _________________

**Sign-off**: _________________

**Notes**:
