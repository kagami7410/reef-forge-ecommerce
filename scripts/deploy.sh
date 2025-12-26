#!/bin/bash

#######################################################
# Production Deployment Script for Reef Forge E-Commerce
# This script automates the deployment process
#######################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
APP_NAME="reef-forge-ecommerce"

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    print_info "Checking dependencies..."

    # Check for required tools
    command -v node >/dev/null 2>&1 || { print_error "Node.js is not installed. Aborting."; exit 1; }
    command -v npm >/dev/null 2>&1 || { print_error "npm is not installed. Aborting."; exit 1; }
    command -v git >/dev/null 2>&1 || { print_error "git is not installed. Aborting."; exit 1; }

    print_info "All dependencies are installed."
}

check_environment_variables() {
    print_info "Checking environment variables..."

    required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        "STRIPE_SECRET_KEY"
        "STRIPE_WEBHOOK_SECRET"
        "NEXT_PUBLIC_SITE_URL"
    )

    missing_vars=()

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        printf '%s\n' "${missing_vars[@]}"
        exit 1
    fi

    print_info "All required environment variables are set."
}

run_tests() {
    print_info "Running tests..."

    # Type check
    print_info "Running TypeScript type check..."
    npx tsc --noEmit

    # Linting
    print_info "Running ESLint..."
    npm run lint

    print_info "All tests passed."
}

build_application() {
    print_info "Building Next.js application..."

    # Clean previous build
    rm -rf .next

    # Build
    npm run build

    if [ $? -eq 0 ]; then
        print_info "Build completed successfully."
    else
        print_error "Build failed."
        exit 1
    fi
}

deploy_to_vercel() {
    print_info "Deploying to Vercel ($ENVIRONMENT)..."

    if [ "$ENVIRONMENT" == "production" ]; then
        vercel --prod
    else
        vercel
    fi

    print_info "Deployment completed."
}

post_deployment_checks() {
    print_info "Running post-deployment checks..."

    # Wait for deployment to be ready
    sleep 30

    # Health check
    SITE_URL=${NEXT_PUBLIC_SITE_URL:-https://yourdomain.com}

    print_info "Checking health endpoint..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/health")

    if [ "$response" == "200" ]; then
        print_info "Health check passed (HTTP $response)."
    else
        print_warning "Health check returned HTTP $response."
    fi

    # Check homepage
    print_info "Checking homepage..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")

    if [ "$response" == "200" ]; then
        print_info "Homepage is accessible (HTTP $response)."
    else
        print_warning "Homepage returned HTTP $response."
    fi
}

# Main deployment flow
main() {
    print_info "====================================="
    print_info "Starting deployment to $ENVIRONMENT"
    print_info "====================================="

    check_dependencies
    check_environment_variables

    # Install dependencies
    print_info "Installing dependencies..."
    npm ci

    run_tests
    build_application

    # Ask for confirmation before deploying to production
    if [ "$ENVIRONMENT" == "production" ]; then
        read -p "Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            print_warning "Deployment cancelled."
            exit 0
        fi
    fi

    deploy_to_vercel
    post_deployment_checks

    print_info "====================================="
    print_info "Deployment completed successfully!"
    print_info "====================================="
}

# Run main function
main
