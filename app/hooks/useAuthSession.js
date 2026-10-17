'use client';

import { useState, useEffect, useCallback } from 'react';
import { getActiveSession, loginWithGoogleCredential, logoutUser } from '../lib/authClient';

/**
 * Hook Modular para Gestión de Sesión y Autenticación RBAC
 */
export function useAuthSession() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const user = await getActiveSession();
      setCurrentUser(user || null);
    } catch (err) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const handleLogin = useCallback(async (credential) => {
    const user = await loginWithGoogleCredential(credential);
    setCurrentUser(user);
    return user;
  }, []);

  const handleLogout = useCallback(async () => {
    await logoutUser();
    setCurrentUser(null);
  }, []);

  const updateProfileLocal = useCallback((updatedFields) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  }, []);

  // Helpers de Roles Tácticos (RBAC)
  const role = currentUser?.role || 'invitado';
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === 'admin' || isSuperAdmin;
  const isModerator = role === 'moderador' || isAdmin;
  const isStaff = isModerator; // Moderador, Admin o Super Admin tienen acceso a herramientas staff

  return {
    currentUser,
    loading,
    role,
    isSuperAdmin,
    isAdmin,
    isModerator,
    isStaff,
    login: handleLogin,
    logout: handleLogout,
    refreshSession,
    updateProfileLocal,
    setSessionUser: setCurrentUser,
  };
}

export default useAuthSession;
