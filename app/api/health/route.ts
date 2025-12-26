import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

/**
 * Health Check Endpoint
 *
 * This endpoint is used for:
 * - Load balancer health checks
 * - Uptime monitoring
 * - Container orchestration readiness probes
 * - CI/CD deployment verification
 *
 * Returns HTTP 200 if all services are operational
 * Returns HTTP 503 if any critical service is down
 */
export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

  try {
    // 1. Check database connection
    try {
      const dbStart = Date.now();
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase
        .from('orders')
        .select('count')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is acceptable
        throw new Error(`Database error: ${error.message}`);
      }

      checks.database = {
        status: 'up',
        latency: Date.now() - dbStart,
      };
    } catch (error) {
      checks.database = {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // 2. Check Stripe API (optional - can be disabled if too slow)
    // Note: Commented out by default to avoid rate limits
    // Uncomment if you need to verify Stripe connectivity
    /*
    try {
      const stripeStart = Date.now();
      // Basic Stripe API check - just verify we can reach the API
      // This doesn't count against your Stripe quota
      checks.stripe = {
        status: 'up',
        latency: Date.now() - stripeStart,
      };
    } catch (error) {
      checks.stripe = {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
    */

    // 3. Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    ];

    const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

    if (missingEnvVars.length > 0) {
      checks.environment = {
        status: 'down',
        error: `Missing environment variables: ${missingEnvVars.join(', ')}`,
      };
    } else {
      checks.environment = {
        status: 'up',
      };
    }

    // Determine overall health status
    const allHealthy = Object.values(checks).every(check => check.status === 'up');
    const responseTime = Date.now() - startTime;

    const response = {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime,
      checks,
      version: process.env.APP_VERSION || 'unknown',
      environment: process.env.NODE_ENV,
    };

    // Return 503 Service Unavailable if any critical service is down
    if (!allHealthy) {
      return NextResponse.json(response, { status: 503 });
    }

    // Return 200 OK if everything is healthy
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });

  } catch (error) {
    // Catch-all for unexpected errors
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        checks,
      },
      { status: 503 }
    );
  }
}

/**
 * HEAD request support for lightweight health checks
 * Some load balancers prefer HEAD requests
 */
export async function HEAD() {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('orders').select('count').limit(1);

    if (error && error.code !== 'PGRST116') {
      return new NextResponse(null, { status: 503 });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
