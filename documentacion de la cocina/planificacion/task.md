# TASK CHECKLIST - CHEF MASTER v4.0

## Estado General: COMPLETADO (Fase 4: Separación Foro & Guías + Caso Real Facebook + Misiones de XP)

### TAREAS FASE 4 (Separación Estricta de Foro y Guías de Juego):
- [x] T4.1 `[DATA-ARCHITECT]`: 
  - Base de datos independiente para Foro Comunitario en `app/data/forumThreadsDatabase.js`.
  - Integrado caso insignia real de Facebook (`post-fb-combat`: *Me acorralan dos zeds y al girar me muerden...*) con 6 comentarios tácticos detallados y réplicas anidadas (Dago Hinojos sobre señuelo vehicular con claxon; Madian Peña y Gabriel Cuello sobre empujar con `[Espacio]`, derribar y pisar cabezas; Benjamin Quiroz sobre estamina y fatiga; Miguel Arce sobre paciencia y no jugar como L4D).
  - Base de datos independiente para Guías de Juego en `app/data/gameGuidesDatabase.js` con manuales estructurados (*Supervivencia: Primeros Días*, *Mecánica: Puentear Coches*, *Carpintería: Primeras Paredes*, *Fontanería de Tejado*, *Generadores Eléctricos*), requisitos en chips tácticos y misiones interactivas (+20 a +60 XP).
- [x] T4.2 `[UI-ENGINEER]`:
  - Componente independiente `app/components/CommunityForumView.jsx`: Foros estilo Reddit/Discourse con buscador, filtro por etiquetas, selector de densidad (Cards vs Compact), drawer/vista completa de hilos y debate con réplicas recursivas.
  - Componente independiente `app/components/GameGuideView.jsx`: Guías de Juego unificadas con selector de manuales, requisitos en chips tácticos, pasos detallados, advertencias de supervivencia y checklist de misiones interactivas con ganancia de XP en tiempo real conectadas al sistema militar de `useKnoxProgress`.
- [x] T4.3 `[NAVBAR-ORCHESTRATOR]`:
  - `app/components/PillNav.jsx` actualizado con 6 secciones limpias sin solapamiento:
    1. `servers` (Servidores)
    2. `guide` (Guía de Juego)
    3. `forum` (Foro)
    4. `loot` (Loot Points)
    5. `radio` (Radio Chat)
    6. `missions` (Misiones)
  - `app/page.jsx` orquestado limpiamente renderizando `GameGuideView` bajo la vista `guide` y `CommunityForumView` bajo la vista `forum`.
- [x] T4.4 `[STYLE-SYSTEM]`:
  - Adición de estilos en `app/globals.css` para chips tácticos (`.pz-gear-chip`), cajas de takeaway (`.pz-takeaway-box`), conectores de hilos (`.pz-threadline`), botones de réplica y tablas compactas.
- [x] T4.5 `[QA-TERMINAL]`:
  - Compilación de producción con `next build` -> **Exit Code 0** (Turbo engine, compilado exitosamente sin errores).
  - Escaneo de emojis en `./app` -> **0 emojis detectados** (cumplimiento 100% Zero Emojis con `KnoxIcons.jsx` y `ChatIcon`).
  - Servidor de desarrollo respondiendo en `http://localhost:3001` con **HTTP 200 OK**.
