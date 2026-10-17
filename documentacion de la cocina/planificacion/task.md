# TASK CHECKLIST - CHEF MASTER v4.0

## Estado General: COMPLETADO (Fase 5: Carrusel de Eventos por Owners & Modularización 100%)

### TAREAS FASE 5 (Carrusel Táctico de Servidores & Eventos Comunitarios):
- [x] T5.1 `[DATA-ARCHITECT]`: 
  - Extensión de `app/data/eventsDatabase.js` incorporando eventos de servidores reales de la comunidad, incluyendo el evento insignia de **Knox Doble PvP/PvE** (*MEGA EVENTO: LOOT X2 Y SUMINISTROS EN ROSEWOOD, Martes 17:00 UTC*), Noche de Purga y Airdrops militares.
  - Creación del cliente de eventos `app/lib/eventsClient.js` con soporte para:
    - Validación de propietario de servidor registrado.
    - Control de cuota estricta: **Máximo 2 eventos activos por dueño**.
    - Retiro/eliminación de eventos propios y de moderación admin.
- [x] T5.2 `[UI-CAROUSEL-ENGINEER]`:
  - Componente de carrusel deslizable horizontal `app/components/ServerEventsCarousel.jsx`:
    - Botones de navegación tácticos con flechas `<` y `>` (`ChevronLeftIcon` y `ChevronRightIcon`).
    - Scroll suave horizontal con detección reactiva de bordes para habilitar/deshabilitar controles.
    - Tarjetas de eventos con badge de urgencia/tipo, pill del servidor anfitrión, botón de copia rápida de IP con un clic y acción de borrado para el owner.
- [x] T5.3 `[MODAL-ENGINEER]`:
  - Componente modal diegético `app/components/PublishEventModal.jsx`:
    - Selector desplegable de servidores pertenecientes al usuario autenticado.
    - Configuración de tipo de evento (Loot Especial, Noche de Purga, Torneo PvP, Airdrop Militar, etc.).
    - Contador de cuota en vivo (`CUOTA: X / 2 ACTIVOS`) y bloqueo de emisión si se supera el límite.
- [x] T5.4 `[MODULARIZATION-ARCHITECT]`:
  - Extracción completa del bloque de misiones a su propio módulo independiente `app/components/MissionsView.jsx`.
  - Reducción de `app/page.jsx` de 326 a 256 líneas, logrando una arquitectura 100% desacoplada donde cada una de las 6 secciones principales (`servers`, `guide`, `forum`, `loot`, `radio`, `missions`) es un componente independiente.
  - Purga de los 4 archivos huérfanos legacy (`TipsCommunityView.jsx`, `tipsDatabase.js`, `RouteView.jsx`, `MetaEventsView.jsx`).
- [x] T5.5 `[STYLE-SYSTEM]`:
  - Incorporación en `app/globals.css` de clases para `.pz-carousel-wrapper`, `.pz-carousel-track`, `.pz-carousel-card`, `.pz-carousel-nav-btn` y `.pz-server-host-pill`.
  - Vectores SVG `ChevronLeftIcon` y `ChevronRightIcon` integrados en `app/components/icons/KnoxIcons.jsx`.
- [x] T5.6 `[QA-TERMINAL]`:
  - Compilación de producción con `next build` -> **Exit Code 0** (5.4s en Turbopack, 10/10 páginas estáticas).
  - Escaneo de emojis en `./app` -> **0 emojis detectados** (cumplimiento 100% Zero Emojis con `KnoxIcons.jsx`).
  - Servidor de desarrollo respondiendo en `http://localhost:3001` con **HTTP 200 OK**.
