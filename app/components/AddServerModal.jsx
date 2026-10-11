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
    banner_url: '',
    galleryString: '',
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

    const gallery_images = formData.galleryString
      ? formData.galleryString
          .split(/[\n,]/)
          .map((url) => url.trim())
          .filter((url) => url.startsWith('http://') || url.startsWith('https://'))
      : [];

    const payload = {
      name: formData.name.trim(),
      ip: formData.ip.trim(),
      port: parseInt(formData.port, 10) || 16261,
      region: formData.region,
      gamemode: formData.mode,
      loot_multiplier: formData.loot_tier,
      max_players: parseInt(formData.max_players, 10) || 32,
      description: formData.description.trim(),
      discord_url: formData.discord_url.trim(),
      banner_url: formData.banner_url.trim() || '/spiffo/spiffo_character.png',
      gallery_images,
      tags,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error al registrar el servidor en el índice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="server-modal-backdrop" onClick={onClose}>
      <div
        className="server-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640 }}
      >
        {/* Retículas cantoneras */}
        <div className="pz-corner-tick tl" />
        <div className="pz-corner-tick tr" />
        <div className="pz-corner-tick bl" />
        <div className="pz-corner-tick br" />

        {/* Cabecera CRT */}
        <div className="pz-dossier-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#10b981', fontSize: 12 }}>●</span>
            <div>
              <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.08em', fontFamily: 'monospace', display: 'block' }}>
                TERMINAL DE TRANSMISIÓN DE FRECUENCIA
              </span>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace' }}>
                Enlistar Nuevo Servidor en Knox Net
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="server-modal-close-btn">
            ✕
          </button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '10px 14px', borderRadius: 4, fontSize: 12, marginBottom: 14, fontFamily: 'monospace' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Nombre */}
            <div>
              <label className="form-label">Nombre de la Frecuencia / Servidor *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ej: Knox County Survivors | 24/7 B42"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* IP y Puerto */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
              <div>
                <label className="form-label">Dirección IP o Host *</label>
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
                <label className="form-label">Modo de Supervivencia</label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="PvE">PvE (Cooperativo)</option>
                  <option value="PvP">PvP (Combate)</option>
                  <option value="Roleplay">Roleplay (RP Serio)</option>
                  <option value="Hardcore">Hardcore (Sprinters)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Nivel de Botín</label>
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
                <label className="form-label">Enlace a Discord Oficial</label>
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

            {/* Soporte Multimedia: Cloudflare R2 / Banner / Galería */}
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 4, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 12 }}>☁️</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#10b981', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                  Archivos Multimedia (Cloudflare R2 / Bucket URL)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label className="form-label">URL de Portada Principal</label>
                  <input
                    type="url"
                    name="banner_url"
                    placeholder="https://pub-r2.tudominio.com/banner.jpg"
                    value={formData.banner_url}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">URLs de Galería / Capturas de Base (separadas por comas)</label>
                  <input
                    type="text"
                    name="galleryString"
                    placeholder="https://r2.dominio.com/base1.jpg, https://r2.dominio.com/base2.jpg"
                    value={formData.galleryString}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace', display: 'block', marginTop: 3 }}>
                    * Compatible con almacenamiento de objetos Cloudflare R2 y servidores CDN.
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="form-label">Dossier / Descripción del Servidor</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe la ambientación, facciones, eventos, reinicios o características destacadas..."
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="form-label">Etiquetas Clave (separadas por comas)</label>
              <input
                type="text"
                name="tagsString"
                placeholder="Ej: Sprinters, Facciones, Sin Mods, B42 Ready"
                value={formData.tagsString}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ borderRadius: 3, padding: '8px 16px', fontFamily: 'monospace', fontSize: 11 }}
              >
                Abortar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-tactical"
                style={{ borderRadius: 3, padding: '8px 20px', fontFamily: 'monospace', fontSize: 12 }}
              >
                {isSubmitting ? 'Transmitiendo...' : '📡 Transmitir Frecuencia a Knox Net'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
