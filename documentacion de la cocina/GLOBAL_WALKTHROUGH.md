# GLOBAL WALKTHROUGH - CHEF MASTER v4.0

## KnoxOS Tactical HUD - Project Zomboid Build 42

Este documento detalla la reestructuración completa realizada en la aplicación bajo el protocolo Chef Master v4.0.

---

### 1. Reestructuración del Navbar (`PillNav.jsx`)
Se erradicó el menú desplegable huérfano de "Mecánicas Activas" y se separaron conceptual y físicamente las Guías de Juego del Foro Comunitario. El navbar cuenta con una arquitectura plana, limpia y minimalista de exactamente 6 secciones + control de autenticación:

1. **SERVIDORES** (`servers`): Directorio y ranking de servidores dedicados de Project Zomboid con telemetría en tiempo real sobre Cloudflare D1.
2. **GUÍA DE JUEGO** (`guide`): Centro unificado de manuales tácticos y rutas maestras (Primeros Días, Mecánica de Vehículos, Carpintería, Fontanería, Generadores) con chips de requisitos, pasos y misiones interactivas con ganancia de XP.
3. **FORO** (`forum`): Tablón de debate y aprendizaje social estilo Reddit/Discourse con hilos de la comunidad, réplicas anidadas y filtros temáticos.
4. **LOOT POINTS** (`loot`): Escáner predictivo de tipologías de zonas y POIs según la arquitectura del condado (Rosewood, West Point, Muldraugh, Riverside, March Ridge, Louisville). Permite analizar probabilidades relativas por tipo de contenedor sin prometer botín garantizado ni distancias falsas fijas.
5. **RADIO (CHAT)** (`radio`): Transmisor de frecuencia 91.5 MHz para comunicación en vivo entre supervivientes.
6. **MISIONES** (`missions`): Registro militar de hitos completados, cálculo de nivel de supervivencia y barra de XP.
7. **ACCEDER / PERFIL** (`auth`): Modal táctico de inicio de sesión con Google OAuth y panel de gestión de servidor propio / perfil de usuario.

---

### 2. Cero Emojis (Adopción Total de `KnoxIcons.jsx`)
- Se escanearon y eliminaron todos los caracteres emoji de los componentes de la interfaz de usuario, bases de datos y scripts de backend.
- Se implementó y utilizó el pack vectorial diegético `KnoxIcons.jsx` (formato SVG inline militar 1993, accesibles, tematizables por color y tamaño), incluyendo el nuevo `ChatIcon`.
- Total de emojis detectados en la auditoría final: **0**.

---

### 3. Cartel de Anuncios de Eventos (`ServerList.jsx`)
- Se implementó un cartel militar desplegable en la cabecera de la lista de servidores.
- Muestra avisos globales y locales del apocalipsis:
  - *Corte Mundial de Suministros (Agua y Red Eléctrica)*
  - *Pase Aéreo del Helicóptero Militar (Días 6-9)*
  - *Purga Nocturna de Sprinters (Frecuencia 91.5 MHz)*
  - *Airdrop de Suministros Militares de Emergencia*
- Cada evento cuenta con insignia de estado (*EN CURSO* / *PROGRAMADO*), temporizador y protocolo táctico recomendado.

---

### 4. Guía de Juego Unificada con Misiones de XP (`GameGuideView.jsx`)
- **Arquitectura de Manuales Tácticos**:
  - Fusiona las rutas de aprendizaje maestro y las guías sueltas bajo un formato editorial uniforme (`gameGuidesDatabase.js`).
  - Chips de equipo/requisitos necesarios (`.pz-gear-chip`) antes de iniciar cada tarea.
  - Pasos estructurados, alertas de riesgo crítico y resumen táctico.
- **Misiones Tácticas con Ganancia de XP**:
  - Cada manual contiene misiones prácticas (+20 a +60 XP) enlazadas en tiempo real al motor de progresión militar `useKnoxProgress`.
  - El usuario puede marcar objetivos como completados directamente desde la guía y ver reflejada su subida de nivel.
- **Debate Oficial al Pie**:
  - Cada guía incluye una sección de preguntas y respuestas oficial al final del manual para resolver dudas puntuales.

---

### 5. Foro Comunitario Estilo Reddit (`CommunityForumView.jsx` y `CommentThreadItem.jsx`)
- **Independencia Total**: Espacio exclusivo para debate, reportes de combate y dudas de la comunidad.
- **Caso Real Insignia (Facebook PZ Community)**:
  - Hilo verídico incorporado: novato con 60h acorralado por 2 zombis al girar el personaje.
  - Árbol de réplicas anidadas con las respuestas de veteranos:
    - Dago Hinojos Luna: técnica de señuelo con vehículo y claxon en la estación de bomberos.
    - Madian Peña: caminar en vez de correr, pisar zombis en el suelo, uso de vallas y modo agachado.
    - Gabriel Cuello: empujar con `[Espacio]`, derribar y pisar la cabeza.
    - Benjamin Quiroz: gestión de estamina y fatiga.
    - Miguel Arce: paciencia y ritmo táctico (no jugar como Left 4 Dead).
- **Líneas Conectoras de Conversación (`Threadlines`)**:
  - Línea vertical reactiva al cursor `.pz-threadline` que visualiza la jerarquía de respuestas.
  - Colapso/expansión de ramas completas (`[-]` / `[+ X respuestas]`).
  - Límite de profundidad controlado (máx 3 niveles) para evitar fatiga visual o deformación en móviles.
- **Selector de Densidad**:
  - Alternancia entre Vista Tarjetas Editorial (grid equilibrado) y Vista Compacta (tabla de 1 línea por hilo).

---

### 6. Verificación de Terminal y Compilación
- **Compilación de Producción (`next build`)**: Exit Code 0 (Turbopack, sin errores de compilación ni dependencias faltantes).
- **TypeScript & Linting**: 0 errores.
- **Auditoría de Emojis**: 0 emojis detectados en `./app`.
- **Servidor de Desarrollo**: Operativo en `http://localhost:3001` (HTTP 200 OK, respuesta verificada).
