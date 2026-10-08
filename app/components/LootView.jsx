'use client';

import { lootDatabase } from '../data/lootDatabase';

export default function LootView({ selectedCategory = 'all', onSelectRoute }) {
  const filteredLoot = selectedCategory === 'all'
    ? lootDatabase
    : lootDatabase.filter((l) => l.id === selectedCategory);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '36px 20px 80px' }}>
      {/* CABECERA 2026 */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            Radar de Incursiones & Puntos de Interés
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', margin: '8px 0 4px', letterSpacing: '-0.02em' }}>
            Botín y Saqueo Táctico de Kentucky
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
            Qué buscar, cuándo ir, qué llevar y rutas de escape seguras para evitar morir acorralado.
          </p>
        </div>
      </div>

      {/* GRID DE FICHAS DE BOTÍN 2026 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredLoot.map((item) => (
          <div
            key={item.id}
            className="glass-panel"
            style={{
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>{item.icon}</span>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {item.title}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>{item.category}</span>
                </div>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: item.riskLevel.includes('Alto') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: item.riskLevel.includes('Alto') ? '#f87171' : '#fbbf24',
                  border: '1px solid',
                  borderColor: item.riskLevel.includes('Alto') ? '#ef4444' : '#f59e0b',
                }}
              >
                Riesgo: {item.riskLevel}
              </span>
            </div>

            {/* Cuándo ir */}
            <div style={{ backgroundColor: 'rgba(9, 13, 24, 0.7)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <strong style={{ color: '#10b981' }}>⏱️ Cuándo Ir:</strong> {item.whenToGo}
            </div>

            {/* Qué buscar */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                💎 Qué Buscar (Prioritario):
              </span>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
                {item.whatToLookFor.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Dónde buscar */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                📍 Dónde Buscar en el Mapa:
              </span>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
                {item.whereToFind.map((loc, i) => (
                  <li key={i}>{loc}</li>
                ))}
              </ul>
            </div>

            {/* Qué llevar */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                🎒 Qué Llevar Antes de Entrar:
              </span>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
                {item.recommendedGear.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>

            {/* Tips tácticos */}
            <div style={{ backgroundColor: 'rgba(120, 53, 15, 0.2)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '12px 14px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                💡 Tips y Señales de Peligro:
              </span>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: '#fde68a', margin: 0, lineHeight: '1.4' }}>
                {item.tacticalTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Enlace a rutas relacionadas */}
            {item.relatedRoutes && item.relatedRoutes.length > 0 && onSelectRoute && (
              <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => onSelectRoute(item.relatedRoutes[0])}
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#34d399',
                    cursor: 'pointer',
                  }}
                >
                  Ver Ruta de Supervivencia asociada →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
