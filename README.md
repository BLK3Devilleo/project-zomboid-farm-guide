# KnoxOS HUD · Plataforma Táctica de Supervivencia para Project Zomboid Build 42

**KnoxOS HUD** es un sistema operativo táctico y diegético ambientado en julio de 1993, diseñado para ofrecer asistencia integral a supervivientes, comunidades y administradores en **Project Zomboid Build 42**. Combina una interfaz retro CRT de baja luminancia con utilidades en tiempo real, telemetría y sincronización distribuida.

---

## 🎯 Propuesta de Valor

KnoxOS no es solo un compendio informativo: es un **HUD operativo** para la Build 42 que unifica el aprendizaje gamificado de mecánicas complejas (agricultura, ganadería, metalistería), la alerta temprana ante meta-eventos mundiales, el descubrimiento y monitoreo de servidores comunitarios y la comunicación radial interactiva entre supervivientes.

---

## 🧭 Módulos Principales

### 1. Guía Gamificada de Supervivencia B42 (con Sistema de XP)
- **Mecánicas Activas**: Protocolos detallados de agricultura, ganadería (vacas, cerdos, ovejas), metalistería y forja adaptados a las físicas y balances de la Build 42.
- **Rutas Tácticas y Progresión**: Guías paso a paso categorizadas por niveles de experiencia (XP) y lista de rutinas operativas con persistencia local (`localStorage`).

### 2. Radar de Meta-Eventos y Acústica de Hordas
- **Simulador de Meta-Eventos**: Registro de perturbaciones acústicas (disparos lejanos, sirenas, manadas de perros, helicóptero de rescate/observación).
- **Cálculo de Propagación de Sonido**: Radio de atracción en tiles y comportamiento de dispersión de hordas zombis.

### 3. Directorio y Ranking de Servidores Dedicados
- **Directorio Comunitario**: Explorador de servidores dedicados filtrables por latencia, región, idioma y modo de juego (PvP, PvE, Rol estricto).
- **Ranking y Votación**: Sistema de reputación con backend relacional en el Edge, permitiendo a la comunidad valorar y registrar servidores verificados.

### 4. Radio Comunitaria (Frecuencia 91.5 MHz)
- **Chat Táctico en Vivo**: Canal diegético para supervivientes con transmisiones automáticas de emergencia y chat grupal en tiempo real.
- **Filtros de Radiofrecuencia**: Transmisión simulada con estética militar y modulación retro.

### 5. Catálogo Táctico de Botín e Incursiones (Radar de Loot)
- **Base de Datos de Equipamiento**: Desglose de herramientas críticas, armas, suministros médicos y contenedores militares.
- **Zonas de Peligro & Incursión**: Rutas recomendadas de saqueo, mapas de calor de riesgo y puntos de extracción seguros en el Condado de Knox.

---

## 🛠️ Pila Tecnológica e Infraestructura

- **Frontend & Server Engine**: [Next.js 16](https://nextjs.org/) con arquitectura App Router y compilador **Turbopack**.
- **Estilos & Diseño**: Tailwind CSS con estética diegética de terminal militar de 1993, CRT scanlines y componentes reactivos.
- **Base de Datos Edge**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (motor SQLite serverless distribuido a baja latencia).
- **Autenticación**: Google Identity Services (Google OAuth) con validación de tokens JWT en servidor y sesiones seguras en cookies HTTP-only.
- **Telemetría & Streaming**:
  - **SSE (Server-Sent Events)** para streaming de telemetría y logs tácticos en vivo.
  - **Microsoft Clarity** & **Google Analytics (GA4)** para análisis de experiencia y estabilidad de usuario.

---

## 📂 Estructura del Repositorio

- `app/` — Código fuente de la aplicación Next.js:
  - `app/api/` — Endpoints REST y SSE (`/api/servers`, `/api/chat`, `/api/logs/stream`, `/api/auth`).
  - `app/components/` — Componentes diegéticos de la interfaz (HUD, Radar, ServerList, LiveRadioChat, Modales de autenticación y tácticos).
  - `app/data/` — Bases de datos estáticas de meta-eventos, rutas de supervivencia, loot y zonas de peligro.
  - `app/lib/` — Clientes de base de datos (Cloudflare D1 / Supabase), rate limiting y utilidades de sesión.
- `docs/` — Documentación complementaria e informes técnicos descargables en PDF, Word y Markdown.
- `public/` — Recursos gráficos, iconos y assets diegéticos.

---

## 🚀 Instalación y Puesta en Marcha

### Requisitos Previos
- Node.js versión 20.9 o superior (compatible con Next.js 16).
- Gestor de paquetes `npm` (v9 o superior).

### Pasos

1. Clonar o descomprimir el proyecto y situarse en la raíz:
   ```bash
   cd project-zomboid-farm-guide
   ```

2. Instalar las dependencias de forma limpia y determinista:
   ```bash
   npm ci
   ```

3. Iniciar el entorno de desarrollo local con Turbopack:
   ```bash
   npm run dev
   ```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Compilación para Producción

Para validar la compilación y generar el bundle optimizado para despliegue:
```bash
npm run build
npm run start
```

---

## 📌 Compatibilidad y Referencia

Basado en las mecánicas y datos oficiales de **Project Zomboid Build 42 (Unstable & Stable releases)**. Las constantes de crecimiento agrícola, tasas de forrajeo, acústica de sonido y comportamiento animal reflejan los balances más recientes del motor de juego.
