'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTacticalModal } from '../hooks/useTacticalModal';
import {
  ShieldAdminIcon,
  CrownIcon,
  CloseCrossIcon,
  SearchIcon,
  RefreshIcon,
  UserIcon,
} from './icons/KnoxIcons';

const ROLE_OPTIONS = [
  { value: 'usuario', label: 'Superviviente', color: '#10b981' },
  { value: 'moderador', label: 'Moderador', color: '#a855f7' },
  { value: 'admin', label: 'Admin', color: '#06b6d4' },
  { value: 'super_admin', label: 'Super Admin', color: '#f59e0b' },
];

export default function AdminPanelModal({ isOpen, onClose, currentUser }) {
  const { modalContainerProps } = useTacticalModal(isOpen, onClose);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const fetchUsers = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users || []);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Fallo al obtener usuarios' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Error de red al consultar API de administración.' });
    } finally {
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    if (!isSuperAdmin) {
      setStatusMsg({ type: 'error', text: 'Solo el Super Administrador puede reasignar roles.' });
      return;
    }

    setUpdatingUserId(userId);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: `Rol actualizado con éxito a ${newRole}.` });
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Error al cambiar rol' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Error de conexión al actualizar rol.' });
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(3, 7, 12, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        {...modalContainerProps}
        className="pz-mission-panel"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: '#0c1218',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 0 35px rgba(6, 182, 212, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <span className="pz-corner-tick pz-corner-tl" />
        <span className="pz-corner-tick pz-corner-tr" />
        <span className="pz-corner-tick pz-corner-bl" />
        <span className="pz-corner-tick pz-corner-br" />

        {/* Cabecera Militar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(6, 182, 212, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(6, 182, 212, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAdminIcon size={22} color="#06b6d4" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.12em', color: '#06b6d4', fontFamily: 'monospace' }}>
                CENTRO DE MANDO TÁCTICO · AUDITORÍA DE OPERADORES
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                SECTOR CLOUDFLARE D1 · NIVEL DE ACCESO: {currentUser?.role?.toUpperCase() || 'DESCONOCIDO'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={fetchUsers}
              disabled={loading}
              title="Refrescar lista"
              style={{
                background: 'transparent',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#06b6d4',
                padding: '6px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            >
              <RefreshIcon size={14} className={loading ? 'animate-spin' : ''} />
              ACTUALIZAR
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
                padding: '6px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Cerrar modal"
            >
              <CloseCrossIcon size={16} />
            </button>
          </div>
        </div>

        {/* Barra de Filtro y Estado */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <SearchIcon size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar operador por indicativo, correo o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: '13px',
                padding: '8px 12px 8px 34px',
                borderRadius: '3px',
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
            REGISTROS: {filteredUsers.length}
          </div>
        </div>

        {statusMsg && (
          <div
            style={{
              padding: '8px 20px',
              fontSize: '12px',
              fontFamily: 'monospace',
              backgroundColor: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: statusMsg.type === 'error' ? '#f87171' : '#34d399',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Lista de Usuarios */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loading && users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#06b6d4', fontFamily: 'monospace', fontSize: '13px' }}>
              INTERROGANDO REGISTROS DE SEGURIDAD EN D1...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontFamily: 'monospace', fontSize: '13px' }}>
              NO SE ENCONTRARON OPERADORES QUE COINCIDAN CON EL FILTRO.
            </div>
          ) : (
            filteredUsers.map((u) => {
              const roleMeta = ROLE_OPTIONS.find((r) => r.value === u.role) || ROLE_OPTIONS[0];
              const isUpdating = updatingUserId === u.id;

              return (
                <div
                  key={u.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '4px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {u.picture ? (
                      <img
                        src={u.picture}
                        alt={u.name || 'Operador'}
                        style={{ width: '36px', height: '36px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(6, 182, 212, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                        }}
                      >
                        <UserIcon size={20} color="#06b6d4" />
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {u.name || 'Superviviente Desconocido'}
                        {u.role === 'super_admin' && <CrownIcon size={14} color="#f59e0b" />}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                        {u.email} · ID: {String(u.id).substring(0, 8)}...
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isSuperAdmin ? (
                      <select
                        value={u.role || 'usuario'}
                        disabled={isUpdating}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        style={{
                          backgroundColor: '#070a0d',
                          border: `1px solid ${roleMeta.color}`,
                          color: roleMeta.color,
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          padding: '6px 8px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          borderRadius: '3px',
                          border: `1px solid ${roleMeta.color}`,
                          color: roleMeta.color,
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {roleMeta.label.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pie de Página Táctico */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#64748b',
            fontFamily: 'monospace',
          }}
        >
          <span>AUTENTICACIÓN GOOGLE & CLOUDFLARE D1 STRICT RBAC</span>
          <span>PRESIONE [ESC] PARA SALIR</span>
        </div>
      </div>
    </div>
  );
}
