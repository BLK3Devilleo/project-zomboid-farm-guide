'use client';

import React from 'react';

/**
 * Pack de Iconos Tácticos KnoxOS (1993 Military Diegetic HUD)
 * Reemplazo 100% de emojis por vectores SVG limpios, accesibles y estilizables.
 */

export function KnoxIcon({ name, size = 18, color = 'currentColor', strokeWidth = 1.8, className = '', style = {}, 'aria-label': ariaLabel, ...props }) {
  const iconProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: `knox-icon knox-icon-${name} ${className}`.trim(),
    style: { display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style },
    role: ariaLabel ? 'img' : 'presentation',
    'aria-label': ariaLabel,
    'aria-hidden': !ariaLabel,
    ...props,
  };

  switch (name) {
    // 1. Navegación y Rutas
    case 'route':
    case 'sprout':
      return (
        <svg {...iconProps}>
          <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9-4 0-7.3 2.6-8.5 6.3" />
          <path d="M3.5 12.3A9 9 0 0 0 12 21" />
          <path d="M12 3v18" />
          <circle cx="12" cy="7" r="2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="12" cy="15" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case 'radar':
    case 'server':
      return (
        <svg {...iconProps}>
          <path d="M12 20a8 8 0 1 0-8-8" />
          <path d="M12 16a4 4 0 1 0-4-4" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <path d="M12 12 4 4" />
          <path d="M21 21l-3-3" />
          <rect x="2" y="19" width="6" height="3" rx="1" />
        </svg>
      );

    case 'backpack':
    case 'loot':
      return (
        <svg {...iconProps}>
          <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9z" />
          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <path d="M8 14h8" />
          <path d="M12 11v6" />
          <path d="M4 12h2" />
          <path d="M18 12h2" />
        </svg>
      );

    case 'hazard':
    case 'alert':
    case 'events':
      return (
        <svg {...iconProps}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );

    case 'radio':
    case 'antenna':
      return (
        <svg {...iconProps}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <line x1="6" y1="7" x2="14" y2="2" />
          <circle cx="8.5" cy="13.5" r="2.5" />
          <line x1="14" y1="11" x2="18" y2="11" />
          <line x1="14" y1="14" x2="18" y2="14" />
          <line x1="14" y1="17" x2="17" y2="17" />
        </svg>
      );

    case 'shield':
    case 'admin':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4" />
          <circle cx="12" cy="15" r="1" fill="currentColor" />
        </svg>
      );

    case 'terminal':
    case 'logs':
      return (
        <svg {...iconProps}>
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );

    case 'key':
    case 'login':
    case 'auth':
      return (
        <svg {...iconProps}>
          <circle cx="7.5" cy="15.5" r="5.5" />
          <path d="m21 2-9.6 9.6" />
          <path d="m15.5 7.5 3 3L22 7l-2-2" />
        </svg>
      );

    case 'rank':
    case 'chevron':
    case 'xp':
      return (
        <svg {...iconProps}>
          <polyline points="7 14 12 9 17 14" />
          <polyline points="7 19 12 14 17 19" />
          <circle cx="12" cy="4" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'mic':
    case 'transmit':
      return (
        <svg {...iconProps}>
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      );

    case 'signal':
    case 'live':
      return (
        <svg {...iconProps}>
          <path d="M2 20h.01" />
          <path d="M7 20v-4" />
          <path d="M12 20v-8" />
          <path d="M17 20V8" />
          <path d="M22 4v16" />
        </svg>
      );

    case 'cloud':
    case 'cloud-check':
      return (
        <svg {...iconProps}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <polyline points="10 14 12 16 16 12" />
        </svg>
      );

    case 'chat':
    case 'comments':
      return (
        <svg {...iconProps}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="8" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="12" y2="14" />
        </svg>
      );

    // 2. Botín y Categorías
    case 'crosshair':
    case 'weapons':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="8" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );

    case 'ammo':
      return (
        <svg {...iconProps}>
          <rect x="6" y="8" width="4" height="13" rx="1" />
          <path d="M6 8l2-4 2 4" />
          <rect x="14" y="8" width="4" height="13" rx="1" />
          <path d="M14 8l2-4 2 4" />
        </svg>
      );

    case 'medical':
    case 'health':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );

    case 'wrench':
    case 'tools':
      return (
        <svg {...iconProps}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );

    case 'car':
    case 'vehicles':
      return (
        <svg {...iconProps}>
          <path d="M5 17h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2-3H8L6 7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="16.5" cy="17.5" r="2.5" />
        </svg>
      );

    // 3. Meta-Eventos
    case 'helicopter':
      return (
        <svg {...iconProps}>
          <line x1="4" y1="3" x2="20" y2="3" />
          <line x1="12" y1="3" x2="12" y2="6" />
          <path d="M8 6h7a4 4 0 0 1 4 4v3a2 2 0 0 1-2 2H9l-5 3v-5l2-1V9a3 3 0 0 1 2-3z" />
          <line x1="5" y1="20" x2="19" y2="20" />
          <line x1="8" y1="17" x2="8" y2="20" />
          <line x1="16" y1="17" x2="16" y2="20" />
        </svg>
      );

    case 'gunshot':
      return (
        <svg {...iconProps}>
          <path d="m3 11 18-5v12L3 13v-2z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          <path d="M22 7l-2 2" />
          <path d="M22 17l-2-2" />
          <path d="M20 12h3" />
        </svg>
      );

    case 'siren':
      return (
        <svg {...iconProps}>
          <path d="M8 16V9a4 4 0 1 1 8 0v7" />
          <path d="M5 20h14a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1z" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="4.5" y1="5.5" x2="6.5" y2="7.5" />
          <line x1="19.5" y1="5.5" x2="17.5" y2="7.5" />
        </svg>
      );

    case 'dog':
      return (
        <svg {...iconProps}>
          <path d="M10 5.5 8 3H4l2 4.5V14h3v-3.5" />
          <path d="M9 10h7a3 3 0 0 1 3 3v6h-2v-4h-2v4h-2v-5H9" />
          <circle cx="6.5" cy="6.5" r="0.75" fill="currentColor" />
        </svg>
      );

    // 4. Utilitarios de UI
    case 'close':
    case 'cross':
      return (
        <svg {...iconProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );

    case 'user':
    case 'profile':
      return (
        <svg {...iconProps}>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case 'logout':
      return (
        <svg {...iconProps}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );

    case 'crown':
      return (
        <svg {...iconProps}>
          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
          <path d="M3 20h18" />
        </svg>
      );

    case 'check':
      return (
        <svg {...iconProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );

    case 'search':
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );

    case 'refresh':
      return (
        <svg {...iconProps}>
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
      );

    case 'heart':
    case 'vote':
      return (
        <svg {...iconProps}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );

    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}

// Exportaciones nombradas directas para máxima legibilidad y tipado
export const RouteIcon = (props) => <KnoxIcon name="route" {...props} />;
export const RadarServerIcon = (props) => <KnoxIcon name="radar" {...props} />;
export const BackpackIcon = (props) => <KnoxIcon name="backpack" {...props} />;
export const HazardIcon = (props) => <KnoxIcon name="hazard" {...props} />;
export const RadioAntennaIcon = (props) => <KnoxIcon name="radio" {...props} />;
export const ShieldAdminIcon = (props) => <KnoxIcon name="shield" {...props} />;
export const TerminalLogsIcon = (props) => <KnoxIcon name="terminal" {...props} />;
export const KeyAccessIcon = (props) => <KnoxIcon name="key" {...props} />;
export const RankChevronIcon = (props) => <KnoxIcon name="rank" {...props} />;
export const MicTransceiverIcon = (props) => <KnoxIcon name="mic" {...props} />;
export const SignalPulseIcon = (props) => <KnoxIcon name="signal" {...props} />;
export const CloudCheckIcon = (props) => <KnoxIcon name="cloud-check" {...props} />;
export const CrosshairIcon = (props) => <KnoxIcon name="crosshair" {...props} />;
export const AmmoIcon = (props) => <KnoxIcon name="ammo" {...props} />;
export const MedicalCrossIcon = (props) => <KnoxIcon name="medical" {...props} />;
export const WrenchIcon = (props) => <KnoxIcon name="wrench" {...props} />;
export const CarIcon = (props) => <KnoxIcon name="car" {...props} />;
export const HelicopterIcon = (props) => <KnoxIcon name="helicopter" {...props} />;
export const GunshotIcon = (props) => <KnoxIcon name="gunshot" {...props} />;
export const SirenIcon = (props) => <KnoxIcon name="siren" {...props} />;
export const DogBarkIcon = (props) => <KnoxIcon name="dog" {...props} />;
export const CloseCrossIcon = (props) => <KnoxIcon name="close" {...props} />;
export const UserIcon = (props) => <KnoxIcon name="user" {...props} />;
export const LogoutIcon = (props) => <KnoxIcon name="logout" {...props} />;
export const CrownIcon = (props) => <KnoxIcon name="crown" {...props} />;
export const CheckIcon = (props) => <KnoxIcon name="check" {...props} />;
export const SearchIcon = (props) => <KnoxIcon name="search" {...props} />;
export const RefreshIcon = (props) => <KnoxIcon name="refresh" {...props} />;
export const VoteIcon = (props) => <KnoxIcon name="vote" {...props} />;
export const ChatIcon = (props) => <KnoxIcon name="chat" {...props} />;
export const UserProfileIcon = (props) => <KnoxIcon name="user" {...props} />;

export default KnoxIcon;
