// Cliente de Autenticación para el Frontend

export const ROLE_LABELS = {
  super_admin: { label: 'Super Admin', badge: '👑 SUPER ADMIN', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  admin: { label: 'Admin', badge: '🛡️ ADMIN', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
  moderador: { label: 'Moderador', badge: '⚔️ MODERADOR', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  usuario: { label: 'Superviviente', badge: '🎒 SUPERVIVIENTE', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
};

/**
 * Obtener sesión activa actual desde la API
 */
export async function getActiveSession() {
  try {
    const res = await fetch('/api/auth/me', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.user) {
        return data.user;
      }
    }
  } catch (err) {
    console.warn('Error verificando sesión activa:', err);
  }
  return null;
}

/**
 * Enviar credencial de Google para autenticarse
 */
export async function loginWithGoogleCredential(credential) {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Fallo al autenticar con Google');
  }

  return data.user;
}

/**
 * Cerrar sesión
 */
export async function logoutUser() {
  try {
    await fetch('/api/auth/me', { method: 'POST' });
  } catch (err) {
    console.warn('Error al cerrar sesión:', err);
  }
}
