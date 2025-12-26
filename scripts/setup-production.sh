#!/bin/bash

#######################################################
# Production Environment Setup Script
# Prepares the application for first-time production deployment
#######################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_section() {
    echo ""
    echo "========================================="
    echo "$1"
    echo "========================================="
}

# Check if .env.production exists
check_env_file() {
    if [ -f ".env.production" ]; then
        print_warning ".env.production already exists. Backing up to .env.production.backup"
        cp .env.production .env.production.backup
    fi
}

# Create production environment file
create_env_file() {
    print_section "Creating Production Environment File"

    cat > .env.production << 'EOF'
# Production Environment Variables
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

# Node Environment
NODE_ENV=production

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Optional: Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Optional: Sentry (for error tracking)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
EOF

    print_info "Created .env.production file. Please update with your actual values."
}

# Update package.json scripts
update_package_json() {
    print_section "Checking package.json scripts"

    # Check if production-related scripts exist
    if ! grep -q "\"build:production\"" package.json; then
        print_info "Adding production build script to package.json"
        # This is informational - manual update recommended
        print_warning "Please add the following scripts to package.json manually:"
        echo '  "build:production": "NODE_ENV=production next build"'
        echo '  "start:production": "NODE_ENV=production next start"'
    fi
}

# Database setup instructions
database_setup() {
    print_section "Database Setup Instructions"

    print_info "Run the following SQL scripts in your Supabase SQL Editor:"
    echo ""
    echo "1. supabase-schema.sql - Create tables and policies"
    echo "2. supabase-address-migration.sql - Add address fields"
    echo "3. Production indexes (from PRODUCTION_DEPLOYMENT_PLAN.md)"
    echo ""
    print_warning "Have you completed the database setup? (yes/no)"
    read -p "> " db_confirm
}

# Stripe setup instructions
stripe_setup() {
    print_section "Stripe Configuration"

    print_info "Stripe setup checklist:"
    echo ""
    echo "☐ 1. Activate live mode in Stripe dashboard"
    echo "☐ 2. Get live API keys (pk_live_... and sk_live_...)"
    echo "☐ 3. Create webhook endpoint: https://yourdomain.com/api/webhooks/stripe"
    echo "☐ 4. Configure webhook events:"
    echo "     - checkout.session.completed"
    echo "     - checkout.session.expired"
    echo "     - payment_intent.succeeded"
    echo "     - payment_intent.payment_failed"
    echo "☐ 5. Copy webhook signing secret (whsec_...)"
    echo "☐ 6. Enable 3D Secure authentication"
    echo "☐ 7. Configure Stripe Radar for fraud detection"
    echo ""
}

# Vercel setup instructions
vercel_setup() {
    print_section "Vercel Deployment Setup"

    print_info "Vercel setup steps:"
    echo ""
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Login: vercel login"
    echo "3. Link project: vercel link"
    echo "4. Add environment variables:"
    echo "   vercel env add NEXT_PUBLIC_SUPABASE_URL production"
    echo "   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production"
    echo "   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production"
    echo "   vercel env add STRIPE_SECRET_KEY production"
    echo "   vercel env add STRIPE_WEBHOOK_SECRET production"
    echo "   vercel env add NEXT_PUBLIC_SITE_URL production"
    echo ""
    echo "5. Configure custom domain in Vercel dashboard"
    echo "6. Verify SSL certificate is active"
    echo ""
}

# Security checklist
security_checklist() {
    print_section "Security Checklist"

    print_info "Complete the following security tasks:"
    echo ""
    echo "☐ 1. Enable 2FA on all service accounts (Vercel, Supabase, Stripe)"
    echo "☐ 2. Review and restrict Supabase RLS policies"
    echo "☐ 3. Rotate all API keys and secrets"
    echo "☐ 4. Configure CORS policies"
    echo "☐ 5. Set up rate limiting (Upstash Redis recommended)"
    echo "☐ 6. Enable security headers in next.config.js"
    echo "☐ 7. Set up Sentry for error tracking"
    echo "☐ 8. Configure monitoring and alerts"
    echo "☐ 9. Review and update .gitignore to exclude sensitive files"
    echo "☐ 10. Set up backup and disaster recovery procedures"
    echo ""
}

# Monitoring setup
monitoring_setup() {
    print_section "Monitoring Setup"

    print_info "Recommended monitoring tools:"
    echo ""
    echo "1. Error Tracking: Sentry (sentry.io)"
    echo "   - npm install @sentry/nextjs"
    echo "   - npx @sentry/wizard@latest -i nextjs"
    echo ""
    echo "2. Uptime Monitoring: Better Uptime (betteruptime.com)"
    echo "   - Monitor: https://yourdomain.com/api/health"
    echo "   - Monitor: https://yourdomain.com"
    echo ""
    echo "3. Analytics: Vercel Analytics (built-in)"
    echo "   - Enable in Vercel dashboard"
    echo ""
    echo "4. Performance: Lighthouse CI"
    echo "   - Already configured in GitHub Actions"
    echo ""
}

# Pre-deployment checklist
pre_deployment_checklist() {
    print_section "Pre-Deployment Checklist"

    checklist=(
        "All environment variables configured in Vercel"
        "Database migrations applied in Supabase"
        "Stripe webhook endpoint configured"
        "Custom domain configured and DNS updated"
        "SSL certificate verified"
        "GitHub repository linked to Vercel"
        "Security headers configured"
        "Error tracking (Sentry) set up"
        "Uptime monitoring configured"
        "Backup procedures documented"
        "Team members have necessary access"
        "Incident response plan in place"
    )

    print_info "Review the following checklist:"
    echo ""
    for item in "${checklist[@]}"; do
        echo "☐ $item"
    done
    echo ""
}

# Create necessary directories
create_directories() {
    print_section "Creating Required Directories"

    directories=(
        ".github/workflows"
        "scripts"
        "terraform"
    )

    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_info "Created directory: $dir"
        fi
    done
}

# Main setup flow
main() {
    print_info "====================================="
    print_info "Production Setup Wizard"
    print_info "====================================="

    create_directories
    check_env_file
    create_env_file
    update_package_json
    database_setup
    stripe_setup
    vercel_setup
    security_checklist
    monitoring_setup
    pre_deployment_checklist

    print_section "Setup Complete!"

    print_info "Next steps:"
    echo ""
    echo "1. Update .env.production with your actual credentials"
    echo "2. Complete all items in the checklists above"
    echo "3. Review PRODUCTION_DEPLOYMENT_PLAN.md for detailed instructions"
    echo "4. Run 'npm run build' to test the production build locally"
    echo "5. Deploy to Vercel: vercel --prod"
    echo ""
    print_warning "Remember: Never commit .env.production to version control!"
}

# Run main function
main
