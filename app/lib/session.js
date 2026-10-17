import { SignJWT, jwtVerify } from 'jose';

/**
 * Obtiene la clave secreta para la firma y verificación de tokens JWT.
 * Falla de forma inmediata y fatal si AUTH_JWT_SECRET no está configurado en las variables de entorno,
 * impidiendo el uso de secretos inseguros o hardcodeados en el repositorio.
 */
function getSecretKey() {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret || typeof secret !== 'string' || secret.trim() === '') {
    throw new Error(
      'FATAL SEC_ERROR: process.env.AUTH_JWT_SECRET no está definido o es inválido. ' +
      'Se prohíbe el uso de claves de respaldo estáticas por seguridad criptográfica.'
    );
  }
  return new TextEncoder().encode(secret.trim());
}

export const COOKIE_SESSION_NAME = 'spiffo_session_token';

/**
 * Crea un token de sesión firmado para el usuario.
 */
export async function createSessionToken(userPayload) {
  const secretKey = getSecretKey();
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
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (err) {
    if (err?.message?.startsWith('FATAL SEC_ERROR')) {
      throw err;
    }
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
