'use client';

import React, { useState } from 'react';

export default function AddServerModal({
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    port: '16261',
    region: 'LATAM',
    mode: 'PvE',
    loot_tier: 'Normal',
    max_players: '32',
    description: '',
    discord_url: '',
    tagsString: 'Comunidad, Novatos, Eventos',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.ip.trim()) {
      setErrorMsg('El nombre y la dirección IP son campos obligatorios.');
      return;
    }

    setIsSubmitting(true);

    const tags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      name: formData.name.trim(),
      ip: formData.ip.trim(),
      port: parseInt(formData.port) || 16261,
      region: formData.region,
      mode: formData.mode,
      loot_tier: formData.loot_tier,
      max_players: parseInt(formData.max_players) || 32,
      description: formData.description.trim(),
      discord_url: formData.discord_url.trim(),
      tags,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrorMsg('Error al guardar el servidor. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="server-modal-backdrop" onClick={onClose}>
      <div
        className="server-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 580 }}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
              REGISTRO PÚBLICO DE COMUNIDAD
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: '4px 0 0', letterSpacing: '-0.02em' }}>
              Enlistar Mi Servidor Dedicado
            </h2>
          </div>
          <button onClick={onClose} className="server-modal-close-btn">
            ✕
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '10px 14px', borderRadius: 12, fontSize: 12 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Nombre */}
          <div>
            <label className="form-label">Nombre del Servidor *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ej: Knox County Survivors | 24/7"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* IP y Puerto */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
            <div>
              <label className="form-label">Dirección IP o Dominio *</label>
              <input
                type="text"
                name="ip"
                required
                placeholder="Ej: 142.44.215.89"
                value={formData.ip}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Puerto</label>
              <input
                type="number"
                name="port"
                placeholder="16261"
                value={formData.port}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Región, Modo y Loot */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
            <div>
              <label className="form-label">Región</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="form-input"
              >
                <option value="LATAM">LATAM</option>
                <option value="España">España / Europa</option>
                <option value="NA">Norteamérica</option>
                <option value="Global">Global</option>
              </select>
            </div>

            <div>
              <label className="form-label">Modo de Juego</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="form-input"
              >
                <option value="PvE">PvE (Pacífico)</option>
                <option value="PvP">PvP (Combate)</option>
                <option value="Roleplay">Roleplay (RP)</option>
                <option value="Hardcore">Hardcore</option>
              </select>
            </div>

            <div>
              <label className="form-label">Cantidad de Loot</label>
              <select
                name="loot_tier"
                value={formData.loot_tier}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Escaso">Escaso (Realista)</option>
                <option value="Normal">Normal</option>
                <option value="Abundante">Abundante</option>
              </select>
            </div>
          </div>

          {/* Discord y Slots */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
            <div>
              <label className="form-label">Enlace a Discord</label>
              <input
                type="url"
                name="discord_url"
                placeholder="https://discord.gg/tu-comunidad"
                value={formData.discord_url}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Slots Máximos</label>
              <input
                type="number"
                name="max_players"
                value={formData.max_players}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="form-label">Descripción y Enfoque</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Explica de qué trata tu servidor, si tienen mods, si hay reinicios programados o eventos..."
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="form-label">Etiquetas (separadas por comas)</label>
            <input
              type="text"
              name="tagsString"
              placeholder="Ej: Sprinters, Facciones, Sin Mods, B42 Ready"
              value={formData.tagsString}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Botón de Enviar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-tactical"
            >
              {isSubmitting ? 'Guardando...' : '🚀 Publicar en el Ranking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
