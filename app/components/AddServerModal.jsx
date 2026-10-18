'use client';

import React, { useState, useRef } from 'react';
import { useTacticalModal } from '../hooks/useTacticalModal';
import {
  CloseCrossIcon,
  CloudCheckIcon,
  RadarServerIcon,
  HazardIcon,
  CheckIcon,
  ShieldAdminIcon,
  CrosshairIcon,
  RadioAntennaIcon,
  SignalPulseIcon,
} from './icons/KnoxIcons';

const PRESET_NAMES = [
  'Refugio Militar Knox B42',
  'Kentucky Reborn: Survival RP',
  'Zona Cero: Hordas & Blindados',
  'Louisville Last Stand',
  'Supervivientes de Rosewood PvE',
  'Apocalipsis Sprinters 100%',
];

const PRESET_TAGS = [
  'Sprinters',
  'Vanilla',
  'Brita Weapons',
  'No KDD',
  'Economía',
  'Vehículos',
  'Safezones',
  'Hordas B42',
  'Novatos',
  'Roleplay Serio',
];

const PRESET_BANNERS = [
  { label: 'Spiffo Táctico', url: '/spiffo/ferret_mascot.jpg' },
  { label: 'Vehículos & Convoy', url: '/spiffo/spiffo_vehicle.png' },
  { label: 'Granja & Agricultura', url: '/spiffo/spiffo_farming.png' },
  { label: 'Combate Militar', url: '/spiffo/spiffo_combat.png' },
];

export default function AddServerModal({ onClose, onSubmit, editingServer = null }) {
  const { modalContainerProps } = useTacticalModal(true, onClose);
  const isEditMode = Boolean(editingServer);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: editingServer?.name || '',
    ip: editingServer?.ip || '',
    port: String(editingServer?.port || '16261'),
    region: editingServer?.region || 'LATAM',
    mode: editingServer?.mode || 'PvE',
    loot_tier: editingServer?.loot_tier || 'Normal',
    max_players: String(editingServer?.max_players || '32'),
    description: editingServer?.description || '',
    discord_url: editingServer?.discord_url || '',
    banner_url: editingServer?.banner_url || '/spiffo/ferret_mascot.jpg',
    gallery_images: Array.isArray(editingServer?.gallery_images) ? editingServer.gallery_images : [],
    tags: Array.isArray(editingServer?.tags) && editingServer.tags.length > 0 ? editingServer.tags : ['Comunidad', 'B42 Ready'],
    schedule_type: editingServer?.schedule_type || '24/7',
    schedule_details: editingServer?.schedule_details || '',
    is_online: editingServer?.is_online !== undefined ? Boolean(editingServer.is_online) : true,
    platform: editingServer?.platform || 'PC',
    mods_count: editingServer?.mods_count || '',
    mods_list: editingServer?.mods_list || '',
  });

  const [customTagInput, setCustomTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);

  const bannerInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSuggestName = () => {
    const random = PRESET_NAMES[Math.floor(Math.random() * PRESET_NAMES.length)];
    setFormData((prev) => ({ ...prev, name: random }));
  };

  const toggleTag = (tag) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      };
    });
  };

  const handleAddCustomTag = (e) => {
    if (e) e.preventDefault();
    const clean = customTagInput.trim().replace(/^#/, '');
    if (!clean) return;
    if (!formData.tags.includes(clean)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, clean] }));
    }
    setCustomTagInput('');
  };

  // Subir archivo al endpoint /api/upload
  const uploadFile = async (file) => {
    const body = new FormData();
    body.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Error al subir la imagen.');
    }

    return json.url;
  };

  // Manejo de subida de banner
  const handleBannerUpload = async (file) => {
    if (!file) return;
    setErrorMsg('');
    setIsUploadingBanner(true);
    try {
      const url = await uploadFile(file);
      setFormData((prev) => ({ ...prev, banner_url: url }));
    } catch (err) {
      setErrorMsg(err.message || 'Error al subir la imagen de portada.');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Manejo de subida de galería
  const handleGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;
    setErrorMsg('');
    setIsUploadingGallery(true);
    try {
      const urls = [];
      for (const f of Array.from(files)) {
        const u = await uploadFile(f);
        urls.push(u);
      }
      setFormData((prev) => ({
        ...prev,
        gallery_images: [...prev.gallery_images, ...urls],
      }));
    } catch (err) {
      setErrorMsg(err.message || 'Error al subir capturas de la galería.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const removeGalleryImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== idx),
    }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setErrorMsg('Indica un nombre para el servidor o refugio.');
      return false;
    }
    if (!formData.ip.trim()) {
      setErrorMsg('Indica la dirección IP o Dominio de conexión.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    setErrorMsg('');
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

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
      banner_url: formData.banner_url || '/spiffo/ferret_mascot.jpg',
      gallery_images: formData.gallery_images || [],
      tags: formData.tags.length > 0 ? formData.tags : ['Comunidad'],
    };

    try {
      await onSubmit(payload, editingServer?.id);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error al procesar la frecuencia.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="server-modal-backdrop" onClick={onClose}>
      <div
        {...modalContainerProps}
        className="server-modal-card corner-reticle"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 720, width: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Retículas cantoneras */}
        <div className="pz-corner-tick tl" />
        <div className="pz-corner-tick tr" />
        <div className="pz-corner-tick bl" />
        <div className="pz-corner-tick br" />

        {/* Cabecera diegética */}
        <div className="pz-dossier-header" style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: isEditMode ? '#38bdf8' : '#10b981', fontSize: 14 }}>●</span>
            <div>
              <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: isEditMode ? '#38bdf8' : '#10b981', letterSpacing: '0.08em', fontFamily: 'monospace', display: 'block' }}>
                {isEditMode ? 'KNOX_NET // RECONFIGURACIÓN DE PARÁMETROS' : 'KNOX_NET // TRANSMISOR DE FRECUENCIA B42'}
              </span>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'monospace' }}>
                {isEditMode ? 'EDITAR FRECUENCIA MILITAR' : 'ENLISTAR REFUGIO O SERVIDOR'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' }}
            title="Cerrar [ESC]"
          >
            <CloseCrossIcon size={16} />
          </button>
        </div>

        {/* Barra de Pasos (Stepper) */}
        <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
          <div className="pz-stepper">
            <button
              onClick={() => setCurrentStep(1)}
              className={`pz-step-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'done' : ''}`}
            >
              <div className="pz-step-circle">{currentStep > 1 ? <CheckIcon size={12} color="currentColor" /> : '1'}</div>
              <span>1. Frecuencia</span>
            </button>
            <div className={`pz-step-connector ${currentStep > 1 ? 'done' : ''}`} />
            <button
              onClick={() => validateStep1() && setCurrentStep(2)}
              className={`pz-step-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'done' : ''}`}
            >
              <div className="pz-step-circle">{currentStep > 2 ? <CheckIcon size={12} color="currentColor" /> : '2'}</div>
              <span>2. Supervivencia</span>
            </button>
            <div className={`pz-step-connector ${currentStep > 2 ? 'done' : ''}`} />
            <button
              onClick={() => validateStep1() && setCurrentStep(3)}
              className={`pz-step-item ${currentStep === 3 ? 'active' : ''}`}
            >
              <div className="pz-step-circle">3</div>
              <span>3. Multimedia & Live</span>
            </button>
          </div>
        </div>

        {/* Alerta de Error */}
        {errorMsg && (
          <div
            style={{
              margin: '0 20px 10px',
              padding: '10px 14px',
              borderRadius: 4,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              fontSize: 12,
              fontFamily: 'monospace',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
            }}
          >
            <HazardIcon size={14} color="#f87171" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Cuerpo del formulario con Scroll */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
          {/* ===================== PASO 1 ===================== */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Nombre con sugerencias */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Nombre del Servidor / Frecuencia *
                  </label>
                  <button
                    type="button"
                    onClick={handleSuggestName}
                    style={{ fontSize: 11, color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}
                  >
                    Sugerir nombre
                  </button>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Kentucky Reborn: Survival RP"
                  className="pz-scanner-input"
                  autoFocus
                />
              </div>

              {/* IP / Host y Puerto en una fila */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Dirección IP o Host *</label>
                  <input
                    type="text"
                    name="ip"
                    value={formData.ip}
                    onChange={handleChange}
                    placeholder="142.44.215.89 o play.servidor.com"
                    className="pz-scanner-input"
                  />
                </div>
                <div>
                  <label className="form-label">Puerto</label>
                  <input
                    type="number"
                    name="port"
                    value={formData.port}
                    onChange={handleChange}
                    className="pz-scanner-input"
                  />
                </div>
              </div>

              {/* Selector de Región en pastillas */}
              <div>
                <label className="form-label">Región Geográfica</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { id: 'LATAM', label: 'LATAM' },
                    { id: 'España', label: 'España' },
                    { id: 'NA', label: 'Norteamérica' },
                    { id: 'GLOBAL', label: 'Global' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, region: r.id }))}
                      className={`pz-switch-tab ${formData.region === r.id ? 'active' : ''}`}
                      style={{ padding: '8px 16px', fontSize: 13 }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Plataforma */}
              <div>
                <label className="form-label">Plataforma Soportada</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { id: 'PC', label: 'PC (Steam)' },
                    { id: 'Android', label: 'Android (APK/Emulado)' },
                    { id: 'Crossplay', label: 'Multiplataforma (Crossplay)' },
                  ].map((plat) => (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, platform: plat.id }))}
                      className={`pz-switch-tab ${formData.platform === plat.id ? 'active' : ''}`}
                      style={{ padding: '7px 14px', fontSize: 12 }}
                    >
                      {plat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Horarios y Disponibilidad */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div>
                  <label className="form-label">Disponibilidad / Horarios</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, schedule_type: '24/7' }))}
                      className={`pz-switch-tab ${formData.schedule_type === '24/7' ? 'active' : ''}`}
                      style={{ flex: 1, padding: '7px 10px', fontSize: 12 }}
                    >
                      24/7 Operativo
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, schedule_type: 'custom' }))}
                      className={`pz-switch-tab ${formData.schedule_type === 'custom' ? 'active' : ''}`}
                      style={{ flex: 1, padding: '7px 10px', fontSize: 12 }}
                    >
                      Horario Específico
                    </button>
                  </div>
                  {formData.schedule_type === 'custom' && (
                    <input
                      type="text"
                      name="schedule_details"
                      value={formData.schedule_details}
                      onChange={handleChange}
                      placeholder="Ej: L-V 18:00 - 02:00 UTC / Fines de semana"
                      className="pz-scanner-input"
                      style={{ marginTop: 6, minHeight: 36, fontSize: 11 }}
                    />
                  )}
                </div>

                <div>
                  <label className="form-label">Estado de Transmisión</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, is_online: true }))}
                      className={`pz-switch-tab ${formData.is_online ? 'active' : ''}`}
                      style={{ flex: 1, padding: '7px 10px', fontSize: 12, color: formData.is_online ? '#04120c' : '#10b981' }}
                    >
                      ● Online / Activo
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, is_online: false }))}
                      className={`pz-switch-tab ${!formData.is_online ? 'active' : ''}`}
                      style={{ flex: 1, padding: '7px 10px', fontSize: 12, color: !formData.is_online ? '#04120c' : '#ef4444' }}
                    >
                      Mantenimiento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== PASO 2 ===================== */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Tarjetas de Modo de Supervivencia */}
              <div>
                <label className="form-label">Modo de Supervivencia</label>
                <div className="pz-mode-grid">
                  {[
                    { id: 'PvE', iconComponent: <ShieldAdminIcon size={20} color="#10b981" />, title: 'PvE', desc: 'Cooperativo pacífico, sin fuego amigo.' },
                    { id: 'PvP', iconComponent: <CrosshairIcon size={20} color="#ef4444" />, title: 'PvP', desc: 'Guerras de clanes y hostilidad abierta.' },
                    { id: 'Hardcore', iconComponent: <HazardIcon size={20} color="#f59e0b" />, title: 'Hardcore', desc: '100% Sprinters, botín escaso y permadeath.' },
                    { id: 'Roleplay', iconComponent: <RadioAntennaIcon size={20} color="#38bdf8" />, title: 'Roleplay', desc: 'Interpretación seria, oficios y economía.' },
                  ].map((m) => {
                    const isSelected = formData.mode === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setFormData((p) => ({ ...p, mode: m.id }))}
                        className={`pz-mode-card ${isSelected ? 'selected' : ''}`}
                      >
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                          {m.iconComponent}
                        </div>
                        <strong style={{ fontSize: 13, color: isSelected ? '#10b981' : '#ffffff' }}>
                          {m.title}
                        </strong>
                        <span style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.3 }}>
                          {m.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nivel de Botín y Capacidad */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div>
                  <label className="form-label">Nivel de Botín</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['Escaso', 'Normal', 'Abundante'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, loot_tier: tier }))}
                        className={`pz-switch-tab ${formData.loot_tier === tier ? 'active' : ''}`}
                        style={{ flex: 1, padding: '7px 10px', fontSize: 12 }}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">Capacidad Máxima (Slots)</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['16', '32', '64', '100'].map((slots) => (
                      <button
                        key={slots}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, max_players: slots }))}
                        className={`pz-switch-tab ${formData.max_players === slots ? 'active' : ''}`}
                        style={{ flex: 1, padding: '7px 8px', fontSize: 12 }}
                      >
                        {slots}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nube de Tags Clicables */}
              <div>
                <label className="form-label">Etiquetas Populares (Haz clic para activar/desactivar)</label>
                <div className="pz-tag-cloud">
                  {PRESET_TAGS.map((tag) => {
                    const isActive = formData.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`pz-tag-chip ${isActive ? 'active' : ''}`}
                      >
                        {isActive ? `[x] ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>

                {/* Creador de Tags Personalizados */}
                <div style={{ marginTop: 10 }}>
                  <label className="form-label" style={{ fontSize: 11, color: '#38bdf8' }}>
                    O escribe tus propios tags personalizados:
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Ej: NPCs, Metanfetamina, Convoy, MercadoNegro..."
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTag(e);
                        }
                      }}
                      className="pz-scanner-input"
                      style={{ minHeight: 36, fontSize: 12 }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      className="pz-btn-primary"
                      style={{ fontSize: 11, padding: '0 14px', whiteSpace: 'nowrap' }}
                    >
                      + Añadir Tag
                    </button>
                  </div>
                  {/* Lista de tags activos actualmente */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {formData.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: 3,
                          padding: '2px 8px',
                          fontSize: 11,
                          fontFamily: 'monospace',
                          color: '#38bdf8',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => toggleTag(t)}
                          style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0, fontSize: 10 }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Información de Mods (Opcional) */}
              <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: 14, borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <WrenchIcon size={14} color="#f59e0b" />
                  <span style={{ fontSize: 12, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                    Parches y Mods del Servidor (Opcional)
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>Cantidad de Mods</label>
                    <input
                      type="text"
                      name="mods_count"
                      value={formData.mods_count}
                      onChange={handleChange}
                      placeholder="Ej: Vanilla, 25 mods, 60+ mods..."
                      className="pz-scanner-input"
                      style={{ minHeight: 36, fontSize: 11 }}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 11 }}>Mods Destacados</label>
                    <input
                      type="text"
                      name="mods_list"
                      value={formData.mods_list}
                      onChange={handleChange}
                      placeholder="Ej: Brita Weapons, Hydrocraft, True Actions..."
                      className="pz-scanner-input"
                      style={{ minHeight: 36, fontSize: 11 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== PASO 3 ===================== */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Zona Dropzone de Portada */}
              <div>
                <label className="form-label">Imagen de Portada / Banner (Arrastra o haz clic)</label>
                <input
                  type="file"
                  ref={bannerInputRef}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  style={{ display: 'none' }}
                  onChange={(e) => handleBannerUpload(e.target.files?.[0])}
                />

                <div
                  className={`pz-dropzone ${isDraggingBanner ? 'drag-over' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingBanner(true);
                  }}
                  onDragLeave={() => setIsDraggingBanner(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingBanner(false);
                    handleBannerUpload(e.dataTransfer.files?.[0]);
                  }}
                  onClick={() => bannerInputRef.current?.click()}
                  style={{ minHeight: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                >
                  {isUploadingBanner ? (
                    <span style={{ color: '#10b981', fontFamily: 'monospace', fontSize: 13, fontWeight: 800 }}>
                      SUBIENDO IMAGEN A SERVIDOR...
                    </span>
                  ) : formData.banner_url ? (
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img
                        src={formData.banner_url}
                        alt="Portada"
                        style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(16, 185, 129, 0.4)' }}
                      />
                      <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CloudCheckIcon size={14} color="#34d399" />
                          <span>Imagen cargada con éxito</span>
                        </span>
                        <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {formData.banner_url}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          bannerInputRef.current?.click();
                        }}
                        className="pz-btn-secondary"
                        style={{ fontSize: 11, padding: '4px 8px' }}
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                        <RadarServerIcon size={24} color="#64748b" />
                      </div>
                      <strong style={{ fontSize: 13, color: '#f8fafc' }}>
                        Suelta tu imagen de portada aquí o haz clic para explorar
                      </strong>
                      <span style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginTop: 2 }}>
                        JPG, PNG, WEBP hasta 5MB (Genera URL pública automática)
                      </span>
                    </div>
                  )}
                </div>

                {/* Presets oficiales rápidos */}
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>
                    O elige un preset oficial:
                  </span>
                  {PRESET_BANNERS.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, banner_url: p.url }))}
                      style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        padding: '3px 8px',
                        borderRadius: 3,
                        background: formData.banner_url === p.url ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: formData.banner_url === p.url ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: formData.banner_url === p.url ? '#34d399' : '#cbd5e1',
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subida Múltiple de Galería de Base */}
              <div>
                <label className="form-label">Galería de Capturas de la Base (Opcional)</label>
                <input
                  type="file"
                  ref={galleryInputRef}
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => handleGalleryUpload(e.target.files)}
                />

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {formData.gallery_images.map((imgUrl, i) => (
                    <div key={i} style={{ position: 'relative', width: 64, height: 64 }}>
                      <img
                        src={imgUrl}
                        alt={`Captura ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.15)' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: '#ef4444',
                          color: '#ffffff',
                          fontSize: 11,
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 4,
                      border: '1.5px dashed rgba(255, 255, 255, 0.25)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#94a3b8',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      gap: 2,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>+</span>
                    <span>{isUploadingGallery ? '...' : 'Subir'}</span>
                  </button>
                </div>
              </div>

              {/* Discord / Comunidad y Descripción */}
              <div>
                <label className="form-label">Discord / Web de Comunidad</label>
                <input
                  type="text"
                  name="discord_url"
                  value={formData.discord_url}
                  onChange={handleChange}
                  placeholder="https://discord.gg/... o tu web"
                  className="pz-scanner-input"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="form-label" style={{ margin: 0 }}>Dossier Táctico / Descripción del Servidor</label>
                  <span style={{ fontSize: 10, color: '#10b981', fontFamily: 'monospace' }}>
                    Tip: Usa guiones '-' para listar mecánicas destacadas
                  </span>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder={`Explica lo que hace único a tu servidor...\nEjemplo:\n- NPC de misiones y comercio activo\n- Eventos de horda cada fin de semana\n- Spawn de vehículos customizado`}
                  className="pz-scanner-input"
                  style={{ width: '100%', resize: 'vertical', lineHeight: 1.5, fontFamily: 'inherit' }}
                />
              </div>

              {/* Live Card Preview */}
              <div className="pz-live-preview-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#10b981', fontFamily: 'monospace', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <SignalPulseIcon size={12} color="#10b981" />
                    <span>PREVISUALIZACIÓN EN VIVO DEL RANKING</span>
                  </span>
                  <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>
                    0 VOTOS
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img
                    src={formData.banner_url || '/spiffo/ferret_mascot.jpg'}
                    alt="Preview"
                    style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(16, 185, 129, 0.4)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: '#ffffff' }}>
                        {formData.name || 'Nombre de tu Servidor'}
                      </span>
                      <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontFamily: 'monospace', fontWeight: 800 }}>
                        {formData.mode}
                      </span>
                      <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>
                        {formData.region}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: '#38bdf8', fontFamily: 'monospace', display: 'block', marginTop: 2 }}>
                      {formData.ip || '127.0.0.1'}:{formData.port || '16261'} • 0/{formData.max_players} Online
                    </span>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {formData.description || 'Sin descripción especificada aún.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barra Inferior de Navegación del Asistente */}
        <div style={{ padding: '14px 20px', background: 'rgba(8, 12, 22, 0.95)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="pz-btn-secondary"
            >
              ← Anterior
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="pz-btn-secondary"
            >
              Cancelar
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="pz-btn-primary"
            >
              Siguiente Paso →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isUploadingBanner || isUploadingGallery}
              className="pz-btn-primary"
              style={{ minWidth: 160, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <CloudCheckIcon size={16} />
              <span>{isSubmitting ? 'Transmitiendo...' : isEditMode ? 'Guardar Cambios' : 'Publicar en el Ranking'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
