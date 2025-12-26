import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge Middleware
 * Runs on Vercel Edge Network (or other edge runtimes)
 *
 * Use cases:
 * - Rate limiting
 * - Security headers
 * - Request logging
 * - Geolocation-based routing
 * - A/B testing
 */

// In-memory rate limiting (works in serverless/edge)
// For production with multiple instances, use Upstash Redis
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // 2. Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();

    const record = rateLimit.get(ip);

    if (record && record.resetTime > now) {
      if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          {
            error: 'Too many requests',
            message: 'You have exceeded the rate limit. Please try again later.',
            retryAfter: Math.ceil((record.resetTime - now) / 1000),
          },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString(),
              'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
              'X-RateLimit-Remaining': Math.max(0, RATE_LIMIT_MAX_REQUESTS - record.count).toString(),
              'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
            },
          }
        );
      }
      record.count++;
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    // Add rate limit headers to response
    const currentRecord = rateLimit.get(ip)!;
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    response.headers.set(
      'X-RateLimit-Remaining',
      Math.max(0, RATE_LIMIT_MAX_REQUESTS - currentRecord.count).toString()
    );
    response.headers.set('X-RateLimit-Reset', new Date(currentRecord.resetTime).toISOString());

    // Cleanup old entries (1% chance per request to avoid overhead)
    if (Math.random() < 0.01) {
      for (const [key, value] of Array.from(rateLimit.entries())) {
        if (value.resetTime < now) {
          rateLimit.delete(key);
        }
      }
    }
  }

  // 3. Redirect www to non-www (optional - configure based on preference)
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('host')?.startsWith('www.')
  ) {
    const hostname = request.headers.get('host')?.replace('www.', '');
    return NextResponse.redirect(
      `${request.nextUrl.protocol}//${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`,
      { status: 301 }
    );
  }

  // 4. Block requests from known malicious user agents (basic bot protection)
  const userAgent = request.headers.get('user-agent') || '';
  const maliciousPatterns = [
    'masscan',
    'nmap',
    'sqlmap',
    'nikto',
    'acunetix',
  ];

  if (maliciousPatterns.some(pattern => userAgent.toLowerCase().includes(pattern))) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  // 5. Add custom request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);

  return response;
}

// Configure which routes should be processed by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
