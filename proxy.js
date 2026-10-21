import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for verifying JWT in Edge proxy
function getSecretKey() {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret.trim());
}

// In-memory sliding window rate limiter for edge per-IP protection
const ipRequests = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 240; // 240 requests per minute per IP (generous for SPA telemetry)

function isRateLimited(ip) {
  const now = Date.now();
  const record = ipRequests.get(ip);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    ipRequests.set(ip, { count: 1, startTime: now });
    return false;
  }
  record.count += 1;
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

// Clean up old rate limit entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequests.entries()) {
      if (now - data.startTime > RATE_LIMIT_WINDOW_MS) {
        ipRequests.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Per-IP Edge Rate Limiting (Solo para endpoints /api/*, excluyendo stream de logs)
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1';

  if (pathname.startsWith('/api') && pathname !== '/api/logs/stream' && isRateLimited(ip)) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: 'ALERTA PERIMETRAL: Límite de peticiones por minuto excedido. Espera un momento antes de reintentar.',
      }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
    );
  }

  // 2. Strict Anti-CSRF Defense compatible con Proxies Inversos (Dokploy / Traefik)
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    const forwardedHost = request.headers.get('x-forwarded-host');

    // Omitir verificación para login inicial con Google OAuth
    if (origin && pathname !== '/api/auth/google') {
      try {
        const originHost = new URL(origin).host;
        const trustedHosts = [
          host,
          forwardedHost,
          'pzguia.filocentraldemando.site',
          'localhost:3000',
          '127.0.0.1:3000',
        ].filter(Boolean);

        const isMatch = trustedHosts.some((h) => h === originHost || originHost.endsWith(h));
        if (!isMatch) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              error: 'VIOLACIÓN DE SEGURIDAD CSRF: Origen no autorizado para mutación.',
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch (e) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Cabecera Origin malformada.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // 3. Edge RBAC Gatekeeper for Protected API Routes
  const sessionCookie = request.cookies.get('spiffo_session_token')?.value;

  // 3.1 Admin routes gatekeeper (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    if (!sessionCookie) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Acceso no autorizado. Sesión de administrador requerida.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const secret = getSecretKey();
      if (!secret) throw new Error('AUTH_JWT_SECRET no configurado');
      const { payload } = await jwtVerify(sessionCookie, secret);
      const role = payload?.role;
      if (!['moderador', 'admin', 'super_admin'].includes(role)) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Acceso denegado. Privilegios insuficientes.' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (err) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Token de sesión inválido o expirado.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 3.2 User routes gatekeeper (/api/user/* y /api/upload)
  if (pathname.startsWith('/api/user') || pathname === '/api/upload') {
    if (!sessionCookie) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Sesión requerida para esta operación.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 4. Inyección de Cabeceras Militares de Ciberseguridad (Permite SSE, Chunks y Navegación SPA)
  const response = NextResponse.next();

  // Content-Security-Policy optimizada para Next.js 16 y SSE en vivo
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://www.googletagmanager.com https://www.google-analytics.com https://scripts.clarity.ms https://*.clarity.ms;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https: wss: data: blob:;
    worker-src 'self' blob:;
    frame-src 'self' https://accounts.google.com;
    frame-ancestors 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - spiffo/ (static game assets)
     * - assets/ (vector icons and audio)
     */
    '/((?!_next/static|_next/image|favicon.ico|spiffo/|assets/).*)',
  ],
};
