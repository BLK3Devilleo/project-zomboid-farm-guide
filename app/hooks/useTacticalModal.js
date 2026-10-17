'use client';

import { useEffect, useCallback } from 'react';

/**
 * Hook Modular para Modales Tácticos KnoxOS
 * Garantiza accesibilidad WCAG 2.1 AA:
 * 1. Cierre inmediato al presionar la tecla Escape.
 * 2. Bloqueo de scroll en document.body para evitar scroll fantasma.
 * 3. Provee atributos accesibles (role="dialog", aria-modal="true").
 */
export function useTacticalModal(isOpen, onClose) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (onClose) onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    // Escuchar tecla Escape
    window.addEventListener('keydown', handleKeyDown);

    // Bloquear scroll de la página de fondo
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  const modalContainerProps = {
    role: 'dialog',
    'aria-modal': true,
  };

  return {
    modalContainerProps,
  };
}

export default useTacticalModal;
