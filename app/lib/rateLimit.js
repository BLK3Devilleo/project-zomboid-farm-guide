/**
 * Rate Limiter Modular KnoxOS (Sliding Window Counter)
 * Arquitectura desacoplada mediante adaptador de almacén (Store Adapter).
 * Protege contra saturación, fuerza bruta y peticiones maliciosas.
 */

export class MemoryRateLimitStore {
  constructor(cleanupIntervalMs = 5 * 60 * 1000) {
    this.map = new Map();

    if (typeof setInterval !== 'undefined') {
      this.timer = setInterval(() => this.cleanup(), cleanupIntervalMs);
      if (this.timer.unref) this.timer.unref();
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.map.entries()) {
      if (record.resetAt < now) {
        this.map.delete(key);
      }
    }
  }

  get(key) {
    return this.map.get(key);
  }

  set(key, record) {
    this.map.set(key, record);
  }

  delete(key) {
    this.map.delete(key);
  }
}

export class RateLimiter {
  constructor(store = new MemoryRateLimitStore()) {
    this.store = store;
  }

  check(key, limit = 60, windowMs = 60 * 1000) {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.resetAt < now) {
      this.store.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return {
        allowed: true,
        remaining: limit - 1,
        resetInSeconds: Math.ceil(windowMs / 1000),
      };
    }

    if (record.count >= limit) {
      const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        resetInSeconds,
      };
    }

    record.count += 1;
    const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      allowed: true,
      remaining: limit - record.count,
      resetInSeconds,
    };
  }
}

// Instancia singleton por defecto
export const defaultRateLimiter = new RateLimiter();

/**
 * Función estándar de verificación de rate limit compatible con todo el proyecto.
 */
export function checkRateLimit(key, limit = 60, windowMs = 60 * 1000) {
  return defaultRateLimiter.check(key, limit, windowMs);
}

/**
 * Extrae la IP del cliente a partir de los encabezados de Next.js
 */
export function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }
  return '127.0.0.1';
}
