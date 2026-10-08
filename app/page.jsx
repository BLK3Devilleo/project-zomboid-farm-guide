'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { LEVELS } from './data/levels';
import { TOOLS_DATABASE } from './data/tools';
import { METALWORKING_DATABASE } from './data/metalworking';
import { DANGEROUS_ZONES_DATABASE } from './data/dangerousZones';
import { TV_SHOWS, ARCHETYPES, TOP_LOCATIONS_BY_CITY } from './data/campaign';

// Sonidos sintéticos con Web Audio API (cero dependencias externas)
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {}
}

const RANKS = [
  { min: 0, title: 'Iniciado de la Tierra', icon: '🌱' },
  { min: 5, title: 'Hortelano Táctico', icon: '🌾' },
  { min: 10, title: 'Maestro de Cosechas', icon: '🌽' },
  { min: 15, title: 'Capataz de Ganado', icon: '🐄' },
  { min: 20, title: 'Leyenda Autosuficiente B42', icon: '👑' },
];

export default function GamifiedFarmApp() {
  const [currentView, setCurrentView] = useState('missions'); // 'missions' | 'tools' | 'metalworking' | 'dangerousZones' | 'campaign' | 'radar'
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [activeLevel, setActiveLevel] = useState(null);
  const [activeToolDetail, setActiveToolDetail] = useState(null);
  const [activeMetalDetail, setActiveMetalDetail] = useState(null);
  const [activeZoneDetail, setActiveZoneDetail] = useState(null);
  const [xp, setXp] = useState(0);
  const [stars, setStars] = useState(0);
  const [completedLevels, setCompletedLevels] = useState({});
  const [equippedGear, setEquippedGear] = useState({});
  const [modalTab, setModalTab] = useState('mission'); // 'mission', 'gear', 'quiz'
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [toolSearch, setToolSearch] = useState('');
  const [toolCategoryFilter, setToolCategoryFilter] = useState('Todas');
  const [metalSearch, setMetalSearch] = useState('');
  const [metalCategoryFilter, setMetalCategoryFilter] = useState('Todas');
  const [zoneSearch, setZoneSearch] = useState('');
  const [zoneMapFilter, setZoneMapFilter] = useState('Todos');

  // ESTADOS DEL MÓDULO GAMER: RELOJ DIGITAL IN-GAME Y CAMPAÑA PERSONALIZADA
  const [gameDay, setGameDay] = useState(1);
  const [gameHour, setGameHour] = useState(8);
  const [gameMinute, setGameMinute] = useState(0);
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState('nomada');
  const [campaignActiveDay, setCampaignActiveDay] = useState(1);
  const [archetypeChecks, setArchetypeChecks] = useState({});
  const [selectedRadarCity, setSelectedRadarCity] = useState('rosewood');

  useEffect(() => {
    try {
      const savedLevel = localStorage.getItem('agroterra_game_unlocked');
      const savedXp = localStorage.getItem('agroterra_game_xp');
      const savedStars = localStorage.getItem('agroterra_game_stars');
      const savedCompleted = localStorage.getItem('agroterra_game_completed');
      const savedGameDay = localStorage.getItem('pz_game_day');
      const savedGameHour = localStorage.getItem('pz_game_hour');
      const savedArchetype = localStorage.getItem('pz_game_archetype');
      const savedChecks = localStorage.getItem('pz_archetype_checks');
      if (savedLevel) setUnlockedLevel(parseInt(savedLevel, 10));
      if (savedXp) setXp(parseInt(savedXp, 10));
      if (savedStars) setStars(parseInt(savedStars, 10));
      if (savedCompleted) setCompletedLevels(JSON.parse(savedCompleted));
      if (savedGameDay) setGameDay(parseInt(savedGameDay, 10));
      if (savedGameHour) setGameHour(parseInt(savedGameHour, 10));
      if (savedArchetype) setSelectedArchetypeId(savedArchetype);
      if (savedChecks) setArchetypeChecks(JSON.parse(savedChecks));
    } catch (e) {}
  }, []);

  // Timer simulado del reloj del juego (cuando está activo: 1 minuto real avanza horas del juego)
  useEffect(() => {
    if (!isClockRunning) return;
    const interval = setInterval(() => {
      setGameMinute((prevMin) => {
        if (prevMin + 10 >= 60) {
          setGameHour((prevH) => {
            if (prevH + 1 >= 24) {
              setGameDay((d) => d + 1);
              return 0;
            }
            return prevH + 1;
          });
          return 0;
        }
        return prevMin + 10;
      });
    }, 2500); // Cada 2.5 seg en la app = 10 min en PZ por defecto
    return () => clearInterval(interval);
  }, [isClockRunning]);

  const toggleArchetypeObjective = (objKey) => {
    playSound('click');
    const wasChecked = !!archetypeChecks[objKey];
    const newChecks = { ...archetypeChecks, [objKey]: !wasChecked };
    setArchetypeChecks(newChecks);
    if (!wasChecked) {
      playSound('success');
      const newXp = xp + 75;
      setXp(newXp);
      saveState(unlockedLevel, newXp, stars, completedLevels);
    }
    try {
      localStorage.setItem('pz_archetype_checks', JSON.stringify(newChecks));
    } catch (e) {}
  };

  const saveState = (newUnlocked, newXp, newStars, newCompleted) => {
    try {
      localStorage.setItem('agroterra_game_unlocked', newUnlocked.toString());
      localStorage.setItem('agroterra_game_xp', newXp.toString());
      localStorage.setItem('agroterra_game_stars', newStars.toString());
      localStorage.setItem('agroterra_game_completed', JSON.stringify(newCompleted));
    } catch (e) {}
  };

  const handleOpenNode = (level) => {
    if (level.number > unlockedLevel) {
      playSound('wrong');
      return;
    }
    playSound('click');
    setActiveLevel(level);
    setModalTab('mission');
    setSelectedQuizOption(null);
    setQuizResult(null);
  };

  const toggleEquipGear = (gearName) => {
    playSound('click');
    const key = `${activeLevel.id}_${gearName}`;
    const wasEquipped = !!equippedGear[key];
    const newEquipped = { ...equippedGear, [key]: !wasEquipped };
    setEquippedGear(newEquipped);
    if (!wasEquipped) {
      const newXp = xp + 50;
      setXp(newXp);
      saveState(unlockedLevel, newXp, stars, completedLevels);
    }
  };

  const handleAnswerQuiz = (optionIdx) => {
    if (quizResult === 'correct') return;
    setSelectedQuizOption(optionIdx);
  };

  const handleConfirmQuiz = () => {
    if (selectedQuizOption === null || !activeLevel) return;
    if (selectedQuizOption === activeLevel.quiz.correct) {
      playSound('success');
      setQuizResult('correct');
      const isAlreadyCompleted = !!completedLevels[activeLevel.id];
      const newCompleted = { ...completedLevels, [activeLevel.id]: true };
      const newUnlocked = Math.max(unlockedLevel, Math.min(20, activeLevel.number + 1));
      const xpBonus = isAlreadyCompleted ? 50 : 250;
      const starsBonus = isAlreadyCompleted ? 0 : 3;
      const newXp = xp + xpBonus;
      const newStars = stars + starsBonus;

      setCompletedLevels(newCompleted);
      setUnlockedLevel(newUnlocked);
      setXp(newXp);
      setStars(newStars);
      saveState(newUnlocked, newXp, newStars, newCompleted);
    } else {
      playSound('wrong');
      setQuizResult('wrong');
    }
  };

  const completedCount = Object.values(completedLevels).filter(Boolean).length;
  const currentRank = [...RANKS].reverse().find((r) => completedCount >= r.min) || RANKS[0];
  const nextLevelXp = unlockedLevel * 500;
  const xpPercent = Math.min(100, Math.floor((xp / (20 * 500)) * 100));

  // Filtrado de herramientas
  const categories = ['Todas', 'Agricultura', 'Carpintería', 'Supervivencia', 'Mecánica', 'Fontanería', 'Metalistería', 'Demolición'];
  const filteredTools = TOOLS_DATABASE.filter((tool) => {
    const matchesCategory =
      toolCategoryFilter === 'Todas' ||
      tool.category.toLowerCase().includes(toolCategoryFilter.toLowerCase());
    const matchesSearch =
      tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.summary.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.applications.some((app) => app.toLowerCase().includes(toolSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtrado de Metalurgia & Forja B42
  const metalCategoryMap = {
    'Todas': null,
    'Herramientas de Taller': 'tools',
    'Forja & Fundición B42': 'forge',
    'Defensas & Barricadas': 'defenses',
    'Manuales & Revistas': 'magazines',
  };
  const metalCategories = ['Todas', 'Herramientas de Taller', 'Forja & Fundición B42', 'Defensas & Barricadas', 'Manuales & Revistas'];
  const filteredMetalworking = (METALWORKING_DATABASE.items || []).filter((item) => {
    const matchesCat =
      metalCategoryFilter === 'Todas' ||
      item.category === metalCategoryMap[metalCategoryFilter];
    const matchesSearch =
      item.name.toLowerCase().includes(metalSearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(metalSearch.toLowerCase()) ||
      (item.usage && item.usage.some((u) => u.toLowerCase().includes(metalSearch.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  // Filtrado de Zonas Peligrosas
  const zoneMaps = ['Todos', 'Muldraugh', 'West Point', 'Riverside', 'Rosewood', 'Louisville'];
  const filteredZones = DANGEROUS_ZONES_DATABASE.filter((zone) => {
    const matchesMap =
      zoneMapFilter === 'Todos' ||
      zone.map.toLowerCase() === zoneMapFilter.toLowerCase();
    const matchesSearch =
      zone.name.toLowerCase().includes(zoneSearch.toLowerCase()) ||
      zone.description.toLowerCase().includes(zoneSearch.toLowerCase()) ||
      zone.lootHighlights.some((l) => l.toLowerCase().includes(zoneSearch.toLowerCase()));
    return matchesMap && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1120', color: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* HEADER / HUD SUPERIOR */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(51, 65, 85, 0.7)',
          padding: '12px 24px',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          {/* Perfil & Rango */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#1e293b',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)',
              }}
            >
              <Image src="/spiffo/spiffo_character.png" alt="Spiffo" width={32} height={32} style={{ objectFit: 'contain' }} />
              <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', fontSize: '10px' }}>{currentRank.icon}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>Superviviente B42</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  Nv. {unlockedLevel}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>{currentRank.title}</div>
            </div>
          </div>

          {/* SELECTOR DE MODO: 4 MÓDULOS DE GUÍA */}
          <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '4px', borderRadius: '12px', border: '1px solid #334155', gap: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { playSound('click'); setCurrentView('missions'); }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                backgroundColor: currentView === 'missions' ? '#10b981' : 'transparent',
                color: currentView === 'missions' ? '#0f172a' : '#94a3b8',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🗺️</span> Misiones
            </button>
            <button
              onClick={() => { playSound('click'); setCurrentView('tools'); }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                backgroundColor: currentView === 'tools' ? '#10b981' : 'transparent',
                color: currentView === 'tools' ? '#0f172a' : '#94a3b8',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🛠️</span> Herramientas
            </button>
            <button
              onClick={() => { playSound('click'); setCurrentView('metalworking'); }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                backgroundColor: currentView === 'metalworking' ? '#10b981' : 'transparent',
                color: currentView === 'metalworking' ? '#0f172a' : '#94a3b8',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>⚒️</span> Metalurgia (B42)
            </button>
            <button
              onClick={() => { playSound('click'); setCurrentView('dangerousZones'); }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                backgroundColor: currentView === 'dangerousZones' ? '#10b981' : 'transparent',
                color: currentView === 'dangerousZones' ? '#0f172a' : '#94a3b8',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>☠️</span> Zonas de Peligro
            </button>
            <button
              onClick={() => { playSound('click'); setCurrentView('campaign'); }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                backgroundColor: currentView === 'campaign' ? '#10b981' : 'transparent',
                color: currentView === 'campaign' ? '#0f172a' : '#38bdf8',
                border: currentView === 'campaign' ? 'none' : '1px solid rgba(56, 189, 248, 0.4)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>⚡</span> Campañas & Reloj
            </button>
            <button
              onClick={() => { playSound('click'); setCurrentView('radar'); }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                backgroundColor: currentView === 'radar' ? '#10b981' : 'transparent',
                color: currentView === 'radar' ? '#0f172a' : '#94a3b8',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🎯</span> Radar Top 3
            </button>
          </div>

          {/* Barra de XP y Recursos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Medidor XP */}
            <div style={{ width: '130px' }} className="hud-xp-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                <span>XP</span>
                <span style={{ color: '#38bdf8' }}>{xp} pts</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '99px', overflow: 'hidden', border: '1px solid #334155' }}>
                <div style={{ width: `${xpPercent}%`, height: '100%', backgroundColor: '#38bdf8', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Estrellas */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #334155', padding: '6px 10px', borderRadius: '10px' }}>
              <span style={{ fontSize: '15px' }}>⭐</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b' }}>{stars}</span>
            </div>

            {/* Misiones Completadas */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #334155', padding: '6px 10px', borderRadius: '10px' }}>
              <span style={{ fontSize: '14px' }}>🎯</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>{completedCount}/20</span>
            </div>
          </div>
        </div>
      </header>

      {/* VISTA 1: RUTA DE MISIONES DE 20 NODOS */}
      {currentView === 'missions' && (
        <main style={{ flex: 1, maxWidth: '680px', width: '100%', margin: '0 auto', padding: '40px 20px 80px', position: 'relative' }}>
          {/* Banner de Bienvenida */}
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Campaña de Supervivencia Agropecuaria
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
                Ruta de Maestría de 20 Nodos
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                Toca el nodo activo para abrir el briefing táctico, equipar las herramientas y resolver el reto.
              </p>
            </div>
            <div className="float-spiffo" style={{ width: '64px', height: '64px', flexShrink: 0 }}>
              <Image src="/spiffo/spiffo_farming.png" alt="Spiffo" width={64} height={64} style={{ objectFit: 'contain' }} />
            </div>
          </div>

          {/* Nodos del Mapa en Ruta Sinuosa */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
            {LEVELS.map((level, index) => {
              const isUnlocked = level.number <= unlockedLevel;
              const isCompleted = !!completedLevels[level.id];
              const isCurrent = level.number === unlockedLevel;
              const xOffsets = [0, 50, 90, 50, 0, -50, -90, -50];
              const offsetPx = xOffsets[index % xOffsets.length];

              return (
                <div
                  key={level.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transform: `translateX(${offsetPx}px)`,
                    transition: 'transform 0.3s ease',
                    position: 'relative',
                  }}
                >
                  <button
                    onClick={() => handleOpenNode(level)}
                    className={isCurrent ? 'pulse-glow' : ''}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#059669' : isCurrent ? '#10b981' : isUnlocked ? '#334155' : '#1e293b',
                      border: '4px solid',
                      borderColor: isCompleted ? '#34d399' : isCurrent ? '#6ee7b7' : isUnlocked ? '#64748b' : '#334155',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      opacity: isUnlocked ? 1 : 0.45,
                      boxShadow: isCurrent
                        ? '0 0 25px rgba(16, 185, 129, 0.6), 0 8px 16px rgba(0,0,0,0.4)'
                        : '0 4px 12px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      position: 'relative',
                    }}
                  >
                    {isUnlocked ? (
                      <div style={{ width: '38px', height: '38px', position: 'relative' }}>
                        <Image src={level.categoryIcon} alt="" width={38} height={38} style={{ objectFit: 'contain' }} />
                      </div>
                    ) : (
                      <span style={{ fontSize: '24px', filter: 'grayscale(1)' }}>🔒</span>
                    )}

                    <span
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        backgroundColor: '#0f172a',
                        color: isCompleted ? '#34d399' : '#f8fafc',
                        border: '2px solid',
                        borderColor: isCompleted ? '#34d399' : '#64748b',
                        borderRadius: '99px',
                        fontSize: '10px',
                        fontWeight: 900,
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {level.number}
                    </span>
                  </button>

                  <div
                    style={{
                      marginTop: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(51, 65, 85, 0.6)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isUnlocked ? '#f8fafc' : '#64748b',
                      maxWidth: '180px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {level.title}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* VISTA 2: ARSENAL DE HERRAMIENTAS (NIVEL 1 AL 20) */}
      {currentView === 'tools' && (
        <main style={{ flex: 1, maxWidth: '1080px', width: '100%', margin: '0 auto', padding: '32px 20px 80px' }}>
          {/* Cabecera del Arsenal */}
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Manual Técnico de Supervivencia B42
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
                Arsenal de Herramientas (Nivel 1 al 20)
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0, maxWidth: '640px' }}>
                Catálogo completo con aplicaciones prácticas, recetas de crafteo artesanal y mejores ubicaciones para lootear cada herramienta en Kentucky.
              </p>
            </div>

            {/* Buscador */}
            <div style={{ minWidth: '260px' }}>
              <input
                type="text"
                placeholder="Buscar herramienta o uso..."
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Filtros de Categoría */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { playSound('click'); setToolCategoryFilter(cat); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: '1px solid',
                  borderColor: toolCategoryFilter === cat ? '#10b981' : '#334155',
                  backgroundColor: toolCategoryFilter === cat ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: toolCategoryFilter === cat ? '#34d399' : '#94a3b8',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Herramientas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => { playSound('click'); setActiveToolDetail(tool); }}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid #334155',
                  borderRadius: '14px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.85)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)'; }}
              >
                {/* Header de la Tarjeta */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Image src={tool.icon} alt={tool.name} width={34} height={34} style={{ objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                        Nivel {tool.level} · {tool.category}
                      </span>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: tool.craftable ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: tool.craftable ? '#38bdf8' : '#fbbf24',
                          border: '1px solid',
                          borderColor: tool.craftable ? 'rgba(56, 189, 248, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        {tool.craftable ? 'Fabricable' : 'Looting'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: '3px 0 0', lineHeight: '1.2' }}>
                      {tool.name}
                    </h3>
                  </div>
                </div>

                {/* Resumen */}
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
                  {tool.summary}
                </p>

                {/* Footer Tarjeta */}
                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(51, 65, 85, 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {tool.applications.length} aplicaciones tácticas
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981' }}>
                    Ver ficha completa →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VISTA 3: GUÍA DE METALURGIA & FORJA BUILD 42 */}
      {currentView === 'metalworking' && (
        <main style={{ flex: 1, maxWidth: '1080px', width: '100%', margin: '0 auto', padding: '30px 20px 80px' }}>
          {/* Banner de Metalurgia B42 */}
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '28px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '38px', backgroundColor: 'rgba(234, 88, 12, 0.15)', border: '1px solid rgba(234, 88, 12, 0.3)', borderRadius: '14px', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ⚒️
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Sistema de Herrería y Forja Build 42
                </span>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f8fafc', margin: '2px 0 6px', letterSpacing: '-0.02em' }}>
                  Manual Completo de Metalurgia, Hornos & Blindaje
                </h1>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '780px', lineHeight: '1.5' }}>
                  Domina la fundición de metales, recarga de sopletes de propano, construcción de hornos de forja medieval/industrial, blindaje de ventanas con rejas de hierro y lectura de revistas técnicas en Project Zomboid B42.
                </p>
              </div>
            </div>

            {/* Buscador & Filtros de Categorías */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar herramientas, hornos, láminas, recetas de soldadura o revistas..."
                value={metalSearch}
                onChange={(e) => setMetalSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {metalCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { playSound('click'); setMetalCategoryFilter(cat); }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: metalCategoryFilter === cat ? '#f97316' : '#1e293b',
                      color: metalCategoryFilter === cat ? '#0f172a' : '#94a3b8',
                      border: '1px solid',
                      borderColor: metalCategoryFilter === cat ? '#f97316' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de Tarjetas de Metalurgia */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredMetalworking.map((item) => (
              <div
                key={item.id}
                onClick={() => { playSound('click'); setActiveMetalDetail(item); }}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.85)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon && item.icon.startsWith('/') ? (
                      <Image src={item.icon} alt={item.name} width={34} height={34} style={{ objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '24px' }}>{item.icon || '⚒️'}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#f97316', textTransform: 'uppercase' }}>
                        {item.category === 'tools' ? 'Taller' : item.category === 'forge' ? 'Forja B42' : item.category === 'defenses' ? 'Defensa' : 'Revista'}
                      </span>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(234, 88, 12, 0.15)',
                          color: '#fb923c',
                          border: '1px solid rgba(234, 88, 12, 0.3)',
                        }}
                      >
                        {item.rarity}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: '3px 0 0', lineHeight: '1.2' }}>
                      {item.name}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
                  {item.summary}
                </p>

                {/* Combustible / Requisitos */}
                <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', color: '#94a3b8' }}>
                  ⚡ <strong style={{ color: '#cbd5e1' }}>Consumo/Regla:</strong> {item.consumption}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(51, 65, 85, 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {item.usage ? item.usage.length : 0} usos tácticos
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#f97316' }}>
                    Ver ficha y usos →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VISTA 4: GUÍA DE TOP 3 ZONAS MÁS PELIGROSAS Y LOOTEABLES */}
      {currentView === 'dangerousZones' && (
        <main style={{ flex: 1, maxWidth: '1080px', width: '100%', margin: '0 auto', padding: '30px 20px 80px' }}>
          {/* Banner de Zonas de Peligro */}
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '28px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '38px', backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '14px', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ☠️
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Incursiones de Alto Riesgo & Recompensas Épicas
                </span>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f8fafc', margin: '2px 0 6px', letterSpacing: '-0.02em' }}>
                  Top 3 Zonas más Peligrosas y Looteables de Knox Country
                </h1>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '780px', lineHeight: '1.5' }}>
                  Informes tácticos de inteligencia para los 5 mapas principales: Muldraugh, West Point, Riverside, Rosewood y Louisville. Conoce las densidades zombi, armerías blindadas, hospitales, almacenes y rutas de evacuación.
                </p>
              </div>
            </div>

            {/* Buscador & Filtros de Ciudades / Mapas */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar por nombre de zona, armas, almádena, munición o botín militar..."
                value={zoneSearch}
                onChange={(e) => setZoneSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {zoneMaps.map((mapName) => (
                  <button
                    key={mapName}
                    onClick={() => { playSound('click'); setZoneMapFilter(mapName); }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: zoneMapFilter === mapName ? '#ef4444' : '#1e293b',
                      color: zoneMapFilter === mapName ? '#ffffff' : '#94a3b8',
                      border: '1px solid',
                      borderColor: zoneMapFilter === mapName ? '#ef4444' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {mapName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de Zonas Peligrosas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredZones.map((zone) => (
              <div
                key={zone.id}
                onClick={() => { playSound('click'); setActiveZoneDetail(zone); }}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderTop: `4px solid ${zone.bannerColor}`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = zone.bannerColor; e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.85)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.borderTopColor = zone.bannerColor; e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.6)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    {zone.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                        📍 {zone.map}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                        }}
                      >
                        Tier {zone.tier}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: '3px 0 0', lineHeight: '1.2' }}>
                      {zone.name}
                    </h3>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#f87171', fontWeight: 600 }}>
                  ⚠️ {zone.threatLevel}
                </div>

                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
                  {zone.description.length > 130 ? zone.description.slice(0, 130) + '...' : zone.description}
                </p>

                {/* Resumen de Botín Principal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase' }}>
                    💎 Botín Destacado:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {zone.lootHighlights.slice(0, 2).map((loot, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '10px',
                          padding: '3px 6px',
                          backgroundColor: 'rgba(15, 23, 42, 0.7)',
                          border: '1px solid #334155',
                          borderRadius: '4px',
                          color: '#94a3b8',
                        }}
                      >
                        {loot.length > 36 ? loot.slice(0, 36) + '...' : loot}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(51, 65, 85, 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {zone.coordinates}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444' }}>
                    Plan de Incursión →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* MODAL DETALLE DE HERRAMIENTA INDIVIDUAL */}
      {activeToolDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="pop-modal"
            style={{
              width: '100%',
              maxWidth: '620px',
              backgroundColor: '#1e293b',
              border: '2px solid #334155',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
          >
            {/* Cabecera del Detalle */}
            <div
              style={{
                backgroundColor: '#0f172a',
                borderBottom: '1px solid #334155',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src={activeToolDetail.icon} alt="" width={36} height={36} style={{ objectFit: 'contain' }} />
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Nivel {activeToolDetail.level} de 20 · {activeToolDetail.category}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {activeToolDetail.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => { playSound('click'); setActiveToolDetail(null); }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Contenido con scroll */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Resumen */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid #334155' }}>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                  {activeToolDetail.summary}
                </p>
              </div>

              {/* Aplicaciones Prácticas */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid #334155', padding: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  ⚙️ Aplicaciones y Usos en el Juego:
                </span>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
                  {activeToolDetail.applications.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>

              {/* Cómo Craftearla */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid #334155', padding: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  🔨 Maneras de Craftearla:
                </span>
                {activeToolDetail.craftable && activeToolDetail.craftingRecipe ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                    <div style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#f8fafc' }}>Requisito:</strong> {activeToolDetail.craftingRecipe.skill}
                    </div>
                    <div style={{ color: '#94a3b8' }}>
                      <strong style={{ color: '#f8fafc' }}>Materiales:</strong>
                      <ul style={{ paddingLeft: '18px', margin: '4px 0', color: '#cbd5e1' }}>
                        {activeToolDetail.craftingRecipe.materials.map((mat, idx) => (
                          <li key={idx}>{mat}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ color: '#34d399', fontWeight: 600 }}>
                      Resultado: {activeToolDetail.craftingRecipe.output}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                    ⚠️ <strong>No se puede fabricar con las manos en el juego base.</strong> Es una herramienta de precisión industrial que solo se puede obtener mediante saqueo e incursiones en el mapa.
                  </div>
                )}
              </div>

              {/* Dónde Encontrarla (Loot) */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid #334155', padding: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  📍 Dónde Conseguirla / Mejores Lugares de Loot:
                </span>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
                  {activeToolDetail.whereToFind.map((loc, i) => (
                    <li key={i}>{loc}</li>
                  ))}
                </ul>
              </div>

              {/* Consejo Pro de Durabilidad */}
              <div style={{ backgroundColor: 'rgba(120, 53, 15, 0.25)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '12px', padding: '12px 14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  💡 Regla de Mantenimiento Pro:
                </span>
                <p style={{ fontSize: '12px', color: '#fde68a', margin: 0, lineHeight: '1.4' }}>
                  {activeToolDetail.durabilityTip}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE METALURGIA & FORJA */}
      {activeMetalDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="pop-modal"
            style={{
              width: '100%',
              maxWidth: '660px',
              backgroundColor: '#1e293b',
              border: '2px solid #334155',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
          >
            {/* Header del Modal */}
            <div
              style={{
                backgroundColor: '#0f172a',
                borderBottom: '1px solid #334155',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeMetalDetail.icon && activeMetalDetail.icon.startsWith('/') ? (
                    <Image src={activeMetalDetail.icon} alt="" width={36} height={36} style={{ objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '26px' }}>{activeMetalDetail.icon || '⚒️'}</span>
                  )}
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#f97316', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {activeMetalDetail.category === 'tools' ? 'Herramienta de Taller' : activeMetalDetail.category === 'forge' ? 'Forja & Fundición B42' : activeMetalDetail.category === 'defenses' ? 'Defensas & Blindaje' : 'Revista & Manual'} · {activeMetalDetail.rarity}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {activeMetalDetail.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => { playSound('click'); setActiveMetalDetail(null); }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Contenido con scroll */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid #334155' }}>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                  {activeMetalDetail.summary}
                </p>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#f97316' }}>
                  ⚡ <strong>Consumo / Requisito:</strong> {activeMetalDetail.consumption}
                </div>
              </div>

              {/* Usos y Aplicaciones */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid #334155', padding: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f97316', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  ⚙️ Aplicaciones y Usos en Metalurgia & Forja:
                </span>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
                  {activeMetalDetail.usage && activeMetalDetail.usage.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>

              {/* Consejo Pro */}
              <div style={{ backgroundColor: 'rgba(120, 53, 15, 0.25)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '12px', padding: '12px 14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  💡 Regla de Supervivencia Pro:
                </span>
                <p style={{ fontSize: '12px', color: '#fde68a', margin: 0, lineHeight: '1.4' }}>
                  {activeMetalDetail.proTip}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE ZONAS PELIGROSAS & LOOT */}
      {activeZoneDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="pop-modal"
            style={{
              width: '100%',
              maxWidth: '680px',
              backgroundColor: '#1e293b',
              border: `2px solid ${activeZoneDetail.bannerColor}`,
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
          >
            {/* Header del Modal */}
            <div
              style={{
                backgroundColor: '#0f172a',
                borderBottom: '1px solid #334155',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                  {activeZoneDetail.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                      📍 {activeZoneDetail.map}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 900, backgroundColor: 'rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
                      Tier {activeZoneDetail.tier}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '2px 0 0' }}>
                    {activeZoneDetail.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => { playSound('click'); setActiveZoneDetail(null); }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Contenido con scroll */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Coordenadas & Nivel de Amenaza */}
              <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.4)', borderRadius: '12px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#f87171' }}>
                    ⚠️ Nivel de Amenaza: {activeZoneDetail.threatLevel}
                  </span>
                  <span style={{ fontSize: '11px', color: '#cbd5e1', backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '6px', border: '1px solid #334155' }}>
                    Coordenadas: {activeZoneDetail.coordinates}
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '12px 14px', borderRadius: '12px', border: '1px solid #334155' }}>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                  {activeZoneDetail.description}
                </p>
              </div>

              {/* Botín Legendario */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid #334155', padding: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  💎 Botín Legendario & Suministros Garantizados:
                </span>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
                  {activeZoneDetail.lootHighlights.map((loot, i) => (
                    <li key={i}>{loot}</li>
                  ))}
                </ul>
              </div>

              {/* Equipamiento Obligatorio */}
              <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid #334155', padding: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  🎒 Equipamiento Táctico Obligatorio:
                </span>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
                  {activeZoneDetail.recommendedGear.map((gear, i) => (
                    <li key={i}>{gear}</li>
                  ))}
                </ul>
              </div>

              {/* Tácticas & Ruta de Escape */}
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(51, 65, 85, 0.8)', borderRadius: '12px', padding: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  🎯 Estrategia de Incursión & Ruta de Escape:
                </span>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
                  {activeZoneDetail.tactics.map((tactic, i) => (
                    <li key={i}>{tactic}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 5: CAMPAÑAS Y RELOJ DIGITAL TÁCTICO IN-GAME */}
      {currentView === 'campaign' && (
        <main style={{ flex: 1, maxWidth: '1080px', width: '100%', margin: '0 auto', padding: '32px 20px 80px' }}>
          {/* PANEL DIGITAL RETO 1993: RELOJ COMPANION */}
          <div
            style={{
              backgroundColor: '#050b14',
              border: '2px solid #10b981',
              borderRadius: '18px',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.25), inset 0 0 15px rgba(0, 0, 0, 0.8)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Cabecera del Reloj */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: isClockRunning ? '#10b981' : '#f59e0b', display: 'inline-block', boxShadow: isClockRunning ? '0 0 10px #10b981' : '0 0 8px #f59e0b' }} />
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#34d399', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  RELOJ DE SINCRONIZACIÓN IN-GAME (KENTUCKY 1993)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { playSound('click'); setIsClockRunning(!isClockRunning); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 900,
                    backgroundColor: isClockRunning ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid',
                    borderColor: isClockRunning ? '#ef4444' : '#10b981',
                    color: isClockRunning ? '#f87171' : '#34d399',
                    cursor: 'pointer',
                  }}
                >
                  {isClockRunning ? '⏸️ PAUSAR TIMER' : '▶️ INICIAR TIMER IN-GAME'}
                </button>
              </div>
            </div>

            {/* Display LCD Digital */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#020617', padding: '16px 20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Tiempo del Reloj Digital del Personaje
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span className="lcd-display" style={{ fontSize: '32px', fontWeight: 900, color: '#34d399' }}>
                    DÍA {String(gameDay).padStart(2, '0')}
                  </span>
                  <span className="lcd-display" style={{ fontSize: '36px', fontWeight: 900, color: '#10b981' }}>
                    {String(gameHour).padStart(2, '0')}:{String(gameMinute).padStart(2, '0')}
                  </span>
                </div>

                {/* Ajustes rápidos */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { playSound('click'); setGameHour((h) => (h + 1) % 24); }}
                    style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', fontSize: '10px', color: '#cbd5e1', fontWeight: 700 }}
                  >
                    +1 Hora
                  </button>
                  <button
                    onClick={() => { playSound('click'); setGameHour((h) => (h > 0 ? h - 1 : 23)); }}
                    style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', fontSize: '10px', color: '#cbd5e1', fontWeight: 700 }}
                  >
                    -1 Hora
                  </button>
                  <button
                    onClick={() => { playSound('click'); setGameDay((d) => d + 1); }}
                    style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', fontSize: '10px', color: '#38bdf8', fontWeight: 700 }}
                  >
                    +1 Día
                  </button>
                  <button
                    onClick={() => { playSound('click'); setGameDay((d) => Math.max(1, d - 1)); }}
                    style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', fontSize: '10px', color: '#cbd5e1', fontWeight: 700 }}
                  >
                    -1 Día
                  </button>
                </div>
              </div>

              {/* Eventos Inminentes / Life & Living TV */}
              <div style={{ backgroundColor: '#020617', padding: '16px 20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📺</span> Emisiones de Televisión & Alertas Críticas
                </div>
                {gameDay <= 9 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {TV_SHOWS.map((show, idx) => {
                      const isUpcoming = gameHour < show.hour;
                      const isNow = gameHour === show.hour;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: isNow ? 'rgba(16, 185, 129, 0.2)' : isUpcoming ? 'rgba(30, 41, 59, 0.4)' : 'rgba(15, 23, 42, 0.2)',
                            border: '1px solid',
                            borderColor: isNow ? '#10b981' : isUpcoming ? '#334155' : 'transparent',
                            opacity: !isUpcoming && !isNow ? 0.4 : 1,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>{show.icon}</span>
                            <div>
                              <div style={{ fontSize: '11px', fontWeight: 800, color: isNow ? '#34d399' : '#f8fafc' }}>
                                {String(show.hour).padStart(2, '0')}:00 · {show.title}
                              </div>
                              <div style={{ fontSize: '9px', color: '#94a3b8' }}>{show.xpSkill} (+XP gratis)</div>
                            </div>
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: isNow ? '#34d399' : '#38bdf8' }}>
                            {isNow ? '¡EN EL AIRE!' : isUpcoming ? `En ${show.hour - gameHour}h` : 'Emitido'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', padding: '8px 0' }}>
                    Las transmisiones de Life and Living terminaron el Día 9. Usa libros y cintas VHS para seguir subiendo experiencia.
                  </div>
                )}

                {/* Advertencia del Helicóptero */}
                {gameDay >= 6 && gameDay <= 9 && (
                  <div className="pulse-alert" style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🚁</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#f87171' }}>
                      ¡ALERTA DE HELICÓPTERO ACTIVA! (Días 6 al 9): Si escuchas hélices, enciérrate en el piso superior.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SELECTOR DE ARQUETIPO DE SUPERVIVIENTE */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Panel de Campañas Personalizadas
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Elige tu Arquetipo de Juego
                </h3>
              </div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Cada arquetipo genera una guía y checklist diario único.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {ARCHETYPES.map((arch) => (
                <div
                  key={arch.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedArchetypeId(arch.id);
                    setCampaignActiveDay(1);
                    try { localStorage.setItem('pz_game_archetype', arch.id); } catch (e) {}
                  }}
                  style={{
                    backgroundColor: selectedArchetypeId === arch.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                    border: '2px solid',
                    borderColor: selectedArchetypeId === arch.id ? '#10b981' : '#334155',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{arch.icon}</span>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: 0 }}>{arch.title}</h4>
                      <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>{arch.subtitle}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
                    {arch.philosophy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* HOJA DE RUTA DIARIA Y CHECKLIST INTERACTIVO */}
          {(() => {
            const activeArch = ARCHETYPES.find((a) => a.id === selectedArchetypeId) || ARCHETYPES[0];
            const currentDayData = activeArch.daysPlan.find((d) => d.day === campaignActiveDay) || activeArch.daysPlan[0];

            return (
              <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', border: '1px solid #334155', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)' }}>
                {/* Selector de Días 1 al 7 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', position: 'relative' }}>
                      <Image src={activeArch.spiffoBanner} alt="" width={48} height={48} style={{ objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        {activeArch.title} · Hoja de Ruta
                      </h3>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        Rasgos recomendados: <strong style={{ color: '#38bdf8' }}>{activeArch.recommendedTraits.join(', ')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Selector de Días */}
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {activeArch.daysPlan.map((d) => (
                      <button
                        key={d.day}
                        onClick={() => { playSound('click'); setCampaignActiveDay(d.day); }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          backgroundColor: campaignActiveDay === d.day ? '#10b981' : '#1e293b',
                          color: campaignActiveDay === d.day ? '#0f172a' : '#94a3b8',
                          border: '1px solid',
                          borderColor: campaignActiveDay === d.day ? '#34d399' : '#334155',
                          cursor: 'pointer',
                        }}
                      >
                        D{d.day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Título del Día */}
                <div style={{ marginBottom: '18px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                    Día {currentDayData.day} de Supervivencia
                  </span>
                  <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: '2px 0 0' }}>
                    {currentDayData.title}
                  </h4>
                </div>

                {/* Lista de Objetivos con Checkbox Interactivo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {currentDayData.objectives.map((obj, idx) => {
                    const objKey = `${activeArch.id}_day${currentDayData.day}_obj${idx}`;
                    const isChecked = !!archetypeChecks[objKey];

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleArchetypeObjective(objKey)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                          border: '2px solid',
                          borderColor: isChecked ? '#10b981' : '#334155',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>{isChecked ? '✅' : '⬜'}</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: isChecked ? '#34d399' : '#f8fafc', textDecoration: isChecked ? 'line-through' : 'none', flex: 1 }}>
                          {obj}
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', backgroundColor: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>
                          +75 XP
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Consejo Táctico Pro */}
                <div style={{ backgroundColor: 'rgba(120, 53, 15, 0.25)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '12px', padding: '12px 16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    💡 Consejo de Supervivencia:
                  </span>
                  <p style={{ fontSize: '12px', color: '#fde68a', margin: 0, lineHeight: '1.4' }}>
                    {currentDayData.tip}
                  </p>
                </div>
              </div>
            );
          })()}
        </main>
      )}

      {/* VISTA 6: RADAR TOP 3 UBICACIONES POR CIUDAD */}
      {currentView === 'radar' && (
        <main style={{ flex: 1, maxWidth: '1080px', width: '100%', margin: '0 auto', padding: '32px 20px 80px' }}>
          {/* Cabecera */}
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Reconocimiento Táctico de Kentucky
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
                Radar de Ubicaciones Top 3
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                Las mejores bases estratégicas, armerías y almacenes con mayor índice de supervivencia en cada sector.
              </p>
            </div>

            {/* Selector de Ciudad */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.keys(TOP_LOCATIONS_BY_CITY).map((cityKey) => {
                const c = TOP_LOCATIONS_BY_CITY[cityKey];
                return (
                  <button
                    key={cityKey}
                    onClick={() => { playSound('click'); setSelectedRadarCity(cityKey); }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      backgroundColor: selectedRadarCity === cityKey ? '#10b981' : '#1e293b',
                      color: selectedRadarCity === cityKey ? '#0f172a' : '#94a3b8',
                      border: '1px solid',
                      borderColor: selectedRadarCity === cityKey ? '#34d399' : '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    {c.cityName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listado de Ubicaciones de la Ciudad Seleccionada */}
          {(() => {
            const city = TOP_LOCATIONS_BY_CITY[selectedRadarCity] || TOP_LOCATIONS_BY_CITY.rosewood;
            return (
              <div>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1' }}>
                    Sector: <strong style={{ color: '#ffffff' }}>{city.cityName}</strong> · Dificultad: <strong style={{ color: '#38bdf8' }}>{city.difficulty}</strong>
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                  {city.locations.map((loc, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid #334155',
                        borderRadius: '16px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                        <span style={{ fontSize: '28px' }}>{loc.icon}</span>
                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          {loc.badge}
                        </span>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                          {loc.type}
                        </span>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '2px 0 0' }}>
                          {loc.name}
                        </h4>
                      </div>

                      <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                        {loc.whyGood}
                      </p>

                      <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(51, 65, 85, 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Nivel de Peligro:</span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: loc.dangerLevel.includes('Alto') || loc.dangerLevel.includes('Extremo') ? '#f87171' : '#34d399' }}>
                          {loc.dangerLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </main>
      )}

      {/* MODAL DE MISIÓN / NODO ACTIVO */}
      {activeLevel && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="pop-modal"
            style={{
              width: '100%',
              maxWidth: '640px',
              backgroundColor: '#1e293b',
              border: '2px solid #334155',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
          >
            {/* Cabecera del Modal */}
            <div
              style={{
                backgroundColor: '#0f172a',
                borderBottom: '1px solid #334155',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src={activeLevel.categoryIcon} alt="" width={26} height={26} style={{ objectFit: 'contain' }} />
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Nodo {activeLevel.number} de 20 · Misión Operativa
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                    {activeLevel.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => { playSound('click'); setActiveLevel(null); }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#334155',
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Pestañas de la Misión */}
            <div style={{ display: 'flex', backgroundColor: '#0f172a', borderBottom: '1px solid #334155', fontSize: '12px', fontWeight: 700 }}>
              {[
                { id: 'mission', label: '📋 Briefing & Suelo' },
                { id: 'gear', label: '🎒 Kit de Herramientas (+50 XP)' },
                { id: 'quiz', label: '🎯 Reto de Campo (+250 XP)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { playSound('click'); setModalTab(tab.id); }}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    textAlign: 'center',
                    borderBottom: '2px solid',
                    borderColor: modalTab === tab.id ? '#10b981' : 'transparent',
                    color: modalTab === tab.id ? '#10b981' : '#94a3b8',
                    backgroundColor: modalTab === tab.id ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenido Dinámico */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* TAB 1: BRIEFING Y SUELO */}
              {modalTab === 'mission' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '14px', padding: '14px 16px' }}>
                    <div style={{ width: '56px', height: '56px', flexShrink: 0 }}>
                      <Image src={activeLevel.spiffoBanner} alt="" width={56} height={56} style={{ objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
                        {activeLevel.tagline}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                        Fase: <strong style={{ color: '#10b981' }}>{activeLevel.stage.toUpperCase()}</strong>
                      </p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid #334155', padding: '14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      📍 Dónde Conseguir las Herramientas:
                    </span>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>{activeLevel.whereToFind}</p>
                  </div>

                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid #334155', padding: '14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      🌱 Cómo Conseguir Buen Suelo:
                    </span>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>{activeLevel.howToGetSoil}</p>
                  </div>

                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid #334155', padding: '14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      ⚙️ Paso a Paso en el Juego:
                    </span>
                    <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {activeLevel.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>

                  <div style={{ backgroundColor: 'rgba(120, 53, 15, 0.25)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '12px', padding: '12px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                      ⚠️ Regla de Supervivencia Pro:
                    </span>
                    <p style={{ fontSize: '12px', color: '#fde68a', margin: 0, lineHeight: '1.4' }}>{activeLevel.proTip}</p>
                  </div>
                </>
              )}

              {/* TAB 2: KIT DE HERRAMIENTAS INTERACTIVO */}
              {modalTab === 'gear' && (
                <>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                    Toca cada herramienta para equiparla en tu inventario. ¡Cada una te suma <strong>+50 XP</strong>!
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                    {activeLevel.requiredGear.map((item, i) => {
                      const isEquipped = !!equippedGear[`${activeLevel.id}_${item.name}`];
                      return (
                        <div
                          key={i}
                          onClick={() => toggleEquipGear(item.name)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: isEquipped ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                            border: '2px solid',
                            borderColor: isEquipped ? '#10b981' : '#334155',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              backgroundColor: '#0f172a',
                              border: '1px solid #334155',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Image src={item.img} alt={item.name} width={28} height={28} style={{ objectFit: 'contain' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: isEquipped ? '#34d399' : '#f8fafc' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{item.desc}</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>{isEquipped ? '✅' : '➕'}</span>
                            {(() => {
                              const matchTool = TOOLS_DATABASE.find(
                                (t) => item.name.toLowerCase().includes(t.name.split(' ')[0].toLowerCase()) ||
                                       t.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
                              );
                              if (matchTool) {
                                return (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSound('click');
                                      setActiveToolDetail(matchTool);
                                    }}
                                    style={{
                                      fontSize: '9px',
                                      fontWeight: 800,
                                      padding: '3px 6px',
                                      borderRadius: '4px',
                                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                                      border: '1px solid rgba(56, 189, 248, 0.3)',
                                      color: '#38bdf8',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Ficha 🛠️
                                  </button>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* TAB 3: RETO DE CAMPO / QUIZ */}
              {modalTab === 'quiz' && (
                <>
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '14px', padding: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Pregunta de Evaluación Táctica:
                    </span>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: '1.4' }}>
                      {activeLevel.quiz.question}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeLevel.quiz.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => { playSound('click'); handleAnswerQuiz(idx); }}
                        style={{
                          textAlign: 'left',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: '2px solid',
                          borderColor:
                            selectedQuizOption === idx
                              ? '#10b981'
                              : 'rgba(51, 65, 85, 0.8)',
                          backgroundColor:
                            selectedQuizOption === idx
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(15, 23, 42, 0.5)',
                          color: '#f8fafc',
                          fontSize: '13px',
                          lineHeight: '1.4',
                          cursor: quizResult === 'correct' ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: selectedQuizOption === idx ? '#10b981' : '#334155',
                            color: selectedQuizOption === idx ? '#0f172a' : '#cbd5e1',
                            fontSize: '11px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>

                  {quizResult === 'correct' && (
                    <div style={{ backgroundColor: 'rgba(6, 95, 70, 0.3)', border: '1px solid #10b981', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>🎉</span>
                      <div>
                        <b style={{ color: '#34d399', fontSize: '13px', display: 'block' }}>¡MISIÓN CUMPLIDA! (+250 XP · +3 ⭐)</b>
                        <p style={{ color: '#a7f3d0', fontSize: '12px', margin: '2px 0 0' }}>{activeLevel.quiz.reward}</p>
                      </div>
                    </div>
                  )}

                  {quizResult === 'wrong' && (
                    <div style={{ backgroundColor: 'rgba(153, 27, 27, 0.25)', border: '1px solid #ef4444', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>⚠️</span>
                      <div>
                        <b style={{ color: '#f87171', fontSize: '13px', display: 'block' }}>Respuesta incorrecta</b>
                        <p style={{ color: '#fca5a5', fontSize: '12px', margin: '2px 0 0' }}>Revisa la pestaña de Briefing & Suelo y vuelve a intentarlo.</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleConfirmQuiz}
                    disabled={selectedQuizOption === null || quizResult === 'correct'}
                    style={{
                      marginTop: '6px',
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: quizResult === 'correct' ? '#059669' : selectedQuizOption !== null ? '#10b981' : '#334155',
                      color: selectedQuizOption !== null || quizResult === 'correct' ? '#ffffff' : '#64748b',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: selectedQuizOption !== null && quizResult !== 'correct' ? 'pointer' : 'default',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {quizResult === 'correct' ? 'Nodo Desbloqueado ✓' : 'Confirmar Respuesta'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
