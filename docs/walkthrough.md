# Walkthrough: Modularización, Erradicación de Emojis y Persistencia Cloud (KnoxOS HUD)

## Resumen Ejecutivo
Se ha culminado la reestructuración arquitectónica y de diseño de la plataforma **KnoxOS HUD Build 42**, cumpliendo con los tres mandatos requeridos:
1. **Persistencia 100% en la Nube (Cloud-First)**: Eliminación de la dependencia de almacenamiento local exclusivo; el progreso (XP global, hitos completados de rutas y ruta activa) se sincroniza y almacena canónicamente en Cloudflare D1 vía `/api/user/profile`.
2. **Pack de Iconos Tácticos 1993 y Erradicación Total de Emojis**: Diseño y despliegue de 22+ iconos vectoriales SVG tácticos estilo militar en `public/assets/icons/` y encapsulados en el componente de diseño `app/components/icons/KnoxIcons.jsx`. Cero emojis en componentes de interfaz (0 emojis en `app/components/*.jsx`, `app/page.jsx` y `app/layout.js`).
3. **Modularización Integral del Frontend**: Descomposición del monolito `app/page.jsx` mediante Hooks personalizados (`useKnoxProgress`, `useAuthSession`, `useKnoxAudio`, `useTacticalModal`), servicio de almacenamiento modular `storageService.js` (con corrección de error en `publicUrl`), y componente administrativo dedicado `AdminPanelModal.jsx` con RBAC estricto.

---

## 1. Cambios Realizados y Justificación Técnica

### 1.1 Pack de Iconos Tácticos Vectoriales (`KnoxIcons.jsx` & `assets/icons/`)
- **Problema previo**: Se utilizaban emojis de colores genéricos de sistema operativo (`📦`, `📍`, `🎒`, `💡`, `🧭`, `🚨`, `⭐`, `🟢`, `📡`, etc.) que rompían la inmersión diegética militar de 1993 y el contraste en pantallas tácticas.
- **Solución implementada**:
  - Se generaron 22 ficheros vectoriales SVG optimizados en `public/assets/icons/`:
    `route.svg`, `radar-server.svg`, `backpack.svg`, `hazard.svg`, `radio-antenna.svg`, `shield-admin.svg`, `terminal-logs.svg`, `key-access.svg`, `rank-chevron.svg`, `mic-transceiver.svg`, `cloud-check.svg`, `crosshair.svg`, `ammo.svg`, `medical-cross.svg`, `wrench.svg`, `car.svg`, `helicopter.svg`, `gunshot.svg`, `siren.svg`, `dog-bark.svg`, `close-cross.svg`, `user-profile.svg`.
  - Componente universal `KnoxIcons.jsx` con exportaciones nombradas (`RouteIcon`, `RadarServerIcon`, `BackpackIcon`, `HazardIcon`, `RadioAntennaIcon`, `ShieldAdminIcon`, `SignalPulseIcon`, `CloudCheckIcon`, `CrosshairIcon`, `AmmoIcon`, `MedicalCrossIcon`, `WrenchIcon`, `SirenIcon`, `CloseCrossIcon`, `UserIcon`, `VoteIcon`, etc.).
  - Reemplazo y limpieza en: `PillNav.jsx`, `LootView.jsx`, `ServerList.jsx`, `RouteView.jsx`, `AddServerModal.jsx`, `ServerDetailModal.jsx`, `ProfileModal.jsx`, `AuthModal.jsx`, `MetaEventsView.jsx`, `LiveRadioChat.jsx`, `TacticalLogModal.jsx`, `AdminPanelModal.jsx`.

### 1.2 Persistencia 100% en la Nube (Cloudflare D1)
- **Problema previo**: El progreso del jugador (XP acumulado, tareas de supervivencia completadas) residía únicamente en el `localStorage` del navegador y se perdía al cambiar de dispositivo.
- **Solución implementada**:
  - `app/api/user/profile/route.js`: Ampliado para validar y persistir en Cloudflare D1 los campos `xp`, `completed_milestones` (JSON array) y `active_route`.
  - `app/lib/validations.js`: Actualizado `UpdateProfileSchema` con tipos Zod estrictos para `xp` (número no negativo), `completed_milestones` (array de strings) y `active_route` (slug de ruta).
  - `app/hooks/useKnoxProgress.js`: Hook reactivo que descarga el perfil de Cloudflare D1 al iniciar sesión con Google y envía actualizaciones diferidas (*debounced* 600ms) para garantizar rendimiento sin sobrecargar la red. Mantiene caché local transparente como fallback de renderizado offline.

### 1.3 Almacenamiento Modular (`storageService.js`) y Reparación de Uploads
- **Problema previo**: En `app/api/upload/route.js:103`, la variable `publicUrl` causaba un fallo de ejecución en tiempo de subida (`ReferenceError: publicUrl is not defined`).
- **Solución implementada**:
  - Creado `app/lib/storage/storageService.js`: Adaptador modular para Cloudflare R2 con fallback a Cloudflare Images/Data URI y validación de tipos MIME y tamaño (máx 5MB).
  - Corregido `app/api/upload/route.js`: Emplea `storageService.uploadFile()` y expone la URL pública canonizada `storageResult.url`.

### 1.4 Panel de Administración Táctico y RBAC (`AdminPanelModal.jsx`)
- **Problema previo**: No existía una interfaz en la aplicación para que moderadores o administradores gestionaran roles de usuarios sobre el endpoint `/api/admin/users`.
- **Solución implementada**:
  - Creado `app/components/AdminPanelModal.jsx` accesible exclusivamente por usuarios con rol `moderador`, `admin` o `super_admin`.
  - Permite listar usuarios de la base de datos Cloudflare D1, filtrar por texto/rol y cambiar privilegios en tiempo real consumiendo `PUT /api/admin/users`.
  - Botón "ADMIN" añadido en `PillNav.jsx` que se muestra únicamente si `isStaff === true`.

### 1.5 Modularización de `app/page.jsx`
- **Problema previo**: Archivo monolítico de más de 307 líneas con síntesis de audio inline, llamadas directas a almacenamiento y lógica dispersa.
- **Solución implementada**:
  - Reducido a ~190 líneas limpias y declarativas.
  - Consumo de Hooks especializados:
    - `useKnoxAudio`: Generación de sonido diegético procedural (Web Audio API) con métodos `playClick()`, `playSuccess()`, `playAlert()`, `playStatic()`.
    - `useAuthSession`: Sesión activa, login Google, logout y verificación de roles RBAC (`isStaff`, `isAdmin`, `isSuperAdmin`).
    - `useKnoxProgress`: Sincronización en la nube, cálculo de XP y avance por niveles.
    - `useTacticalModal`: Gestión de tecla Escape, bloqueo de scroll en fondo y accesibilidad WAI-ARIA en modales.

---

## 2. Verificación de Compilación y Calidad

| Comando | Resultado | Estado |
| :--- | :--- | :--- |
| `npm run check` (`next build`) | **Exit Code 0** (Compilado en 1410ms, todas las rutas estáticas y dinámicas verificadas) | **PASS** |
| `npm audit` | **0 vulnerabilidades** | **PASS** |
| Verificación de emojis | **0 emojis** en `app/components/*.jsx`, `app/page.jsx` y `app/layout.js` | **PASS** |
| Verificación HTTP Local (Port 3001) | `HTTP Status: 200 OK`, HTML 13KB, `Contains Knox-OS: true` | **PASS** |

---

## 3. Instrucciones de Prueba

1. **Abrir la aplicación**:
   Navegar a `http://localhost:3001`.
2. **Comprobar la ausencia de emojis**:
   - Observar el Navbar flotante (`PillNav`): Los accesos a Rutas, Radar, Botín, Alertas y Radio muestran iconos vectoriales tácticos monócromos.
   - Navegar a la pestaña **Radar de Servidores**: Las tarjetas, insignias de región, nivel de botín, VU-meters y filtros usan iconos SVG.
   - Navegar a la pestaña **Radar de Botín**: Las categorías, botones de acción (*Rastrear Ruta*, *Alerta Horda*, *En GPS*) y el formulario flotante de baliza muestran el pack de iconos SVG.
   - Navegar a la **Ruta de Supervivencia**: La telemetría de cabecera y el checklist de objetivos muestran iconos SVG accesibles.
3. **Comprobar persistencia Cloud de Progreso**:
   - Marcar uno o varios objetivos en la ruta activa (ej. *Buscar contenedor de basura*).
   - El XP se incrementa con feedback acústico.
   - Al tener sesión iniciada, el progreso se envía mediante PUT a `/api/user/profile` y queda grabado en Cloudflare D1.
4. **Comprobar el Panel de Administración (Staff)**:
   - Iniciar sesión con un usuario con rol de `moderador` o `admin`.
   - Se activará el botón **[ADMIN]** en el Navbar.
   - Al pulsar se abrirá el `AdminPanelModal` mostrando la lista de supervivientes y permitiendo alternar roles con feedback en tiempo real.

---

## 4. Almacenamiento Multimedia Cloudflare R2 (Persistencia Permanente)

### 4.1 Problema detectado
- Las imágenes subidas por los usuarios se almacenaban únicamente en el sistema de archivos local (`public/uploads`) dentro del contenedor Docker.
- Cada despliegue en Dokploy o reinicio del contenedor eliminaba físicamente las imágenes del disco, dejando enlaces rotos (404) en la base de datos Cloudflare D1.

### 4.2 Solución implementada
1. **Cliente S3 para Cloudflare R2**:
   - Integrado `@aws-sdk/client-s3` en `app/lib/storage/storageService.js`.
   - Subida binaria con `PutObjectCommand` directamente al bucket `pzguiaimagenes` a través del endpoint `https://216412448f9fbc402b01b33d58e67559.r2.cloudflarestorage.com`.
   - Generación de URLs públicas canónicas bajo `https://pub-73cf5761b1284ebd8f90a8557c6b2b54.r2.dev`.
2. **Volumen persistente Docker**:
   - Configurado volumen `pz_uploads:/app/public/uploads` en `docker-compose.yml` para garantizar que incluso el modo de respaldo local nunca pierda archivos ante reinicios.
3. **Resiliencia en Frontend**:
   - Añadido `onError` y mapa de estado `failedImages` en `ServerDetailModal.jsx` para sustituir automáticamente imágenes 404 antiguas por el fallback táctico oficial de Spiffo sin romper la interfaz.

---

## 5. Auditoría de Persistencia D1, Erradicación de LocalStorage y Bucles de Telemetría (Loops)

### 5.1 Causa Raíz Diagnosticada de la Pérdida del Servidor Registrado
- **Colisión de Variables en Dokploy**: El commit `5691350` introdujo expansiones explícitas `${CLOUDFLARE_...}` dentro del bloque `environment:` de `docker-compose.yml`. En Dokploy, al no existir un archivo `.env` en la raíz del runner, Docker Compose evaluó dichas expresiones como cadenas vacías `""`, sobreescribiendo y anulando las variables inyectadas por el panel.
- **Sobreescritura Silenciosa en Cliente**: Al fallar la autenticación de Cloudflare D1 en el contenedor, `/api/servers` devolvía `{ success: true, source: 'fallback', data: [] }`. En el cliente, `supabaseClient.js` trataba el array vacío como válido y sobreescribía la clave local de caché (`spiffo_servers_directory_v2`), haciendo desaparecer el servidor de la pantalla.

### 5.2 Erradicación Total de `localStorage` y Migración Relacional D1
1. **Docker Compose Desacoplado**: Se eliminaron los `${...}` vacíos de `docker-compose.yml`. Dokploy ahora inyecta las variables de entorno de Cloudflare de forma limpia y directa al contenedor de Next.js.
2. **Cero LocalStorage en Servidores y Eventos**:
   - `app/lib/supabaseClient.js`: Se purgó por completo el uso de `localStorage` (`spiffo_servers_directory_v2`). Todas las lecturas y mutaciones (`fetchServersList`, `createServerEntry`, `upvoteServerEntry`, `updateServerEntry`, `deleteServerEntry`) consumen directamente Cloudflare D1.
   - `app/api/servers/route.js`: Ya no enmascara fallos devolviendo `[]` cuando D1 es inaccesible; ahora responde con HTTP 500 informando el error de enlace para activar los bucles de reintento.
3. **Modelo Relacional para Eventos de Servidores (`server_events`)**:
   - Creado `app/api/events/route.js` con migración D1 automática:
     ```sql
     CREATE TABLE IF NOT EXISTS server_events (
       id TEXT PRIMARY KEY,
       server_id TEXT NOT NULL,
       creator_id TEXT NOT NULL,
       title TEXT NOT NULL,
       description TEXT NOT NULL,
       event_date TEXT NOT NULL,
       event_type TEXT DEFAULT 'pvp',
       status TEXT DEFAULT 'active',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
     );
     ```
   - Control de cuotas de negocio: Máximo 2 eventos activos simultáneos por anfitrión.
   - `app/lib/eventsClient.js` purgado al 100% de `localStorage`.
4. **Foro Comunitario Persistente (`forum_threads`)**:
   - Creado `app/api/forum/route.js` con tabla D1 para almacenar hilos tácticos, autor, takeaways, etiquetas y árbol de comentarios con soporte para votos en tiempo real.
   - Conectado `app/components/CommunityForumView.jsx` con persistencia en D1.

### 5.3 Bucles Tácticos Implementados (Loops)
- **Loop A (Sincronización Periódica de Telemetría)**: Bucle de sondeo automático cada 45 segundos en `ServerList.jsx` que revalida silenciosamente el radar de servidores y recuentos de jugadores en vivo sin recargar la página.
- **Loop B (Reintento con Backoff Exponencial)**: Ante un fallo de enlace o timeout de D1, el sistema entra en modo de recuperación militar diegética con 3 reintentos automáticos espaciados (2s, 4s, 8s), mostrando un banner CRT de advertencia (`ALERTA RADAR // INTERFERENCIA DE ENLACE CON CLOUDFLARE D1`) y un botón de reintento manual.
- **Loop C (Mutaciones Optimistas con Reversión)**: Los votos en servidores y foros actualizan la UI de inmediato y se revierten automáticamente con aviso al operador si la API de Cloudflare D1 rechaza la solicitud.

