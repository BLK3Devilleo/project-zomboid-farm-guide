import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET_STRING = process.env.AUTH_JWT_SECRET || 'spiffo-apocalypse-security-key-2026-super-secret-salt';
const secretKey = new TextEncoder().encode(JWT_SECRET_STRING);

export const COOKIE_SESSION_NAME = 'spiffo_session_token';

/**
 * Crea un token de sesión firmado para el usuario.
 */
export async function createSessionToken(userPayload) {
  return await new SignJWT({
    id: userPayload.id,
    email: userPayload.email,
    name: userPayload.name,
    picture: userPayload.picture,
    role: userPayload.role || 'usuario',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Valida un token de sesión y extrae el usuario.
 */
export async function verifySessionToken(token) {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Extrae la sesión actual a partir de la cookie de la petición Next.js.
 */
export async function getSessionUser(request) {
  const token = request.cookies.get(COOKIE_SESSION_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

/**
 * Comprueba si un rol cumple con el nivel mínimo requerido (RLS en capa de API)
 * Jerarquía: super_admin (4) > admin (3) > moderador (2) > usuario (1)
 */
export const ROLE_HIERARCHY = {
  super_admin: 4,
  admin: 3,
  moderador: 2,
  usuario: 1,
};

export function hasRequiredRole(userRole, requiredRole) {
  const userRank = ROLE_HIERARCHY[userRole] || 0;
  const targetRank = ROLE_HIERARCHY[requiredRole] || 0;
  return userRank >= targetRank;
}
