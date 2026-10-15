# Walkthrough: Arquitectura Spiffo-OS (MVP Funcional)

## Resumen de la Implementación
Se ha completado con éxito la transformación de la aplicación hacia la arquitectura **Spiffo-OS**, cumpliendo con los ajustes clave acordados:
* Onboarding interactivo por intenciones.
* Navbar limpio con 4 menús desplegables.
* Rutas modulares por niveles con checklists de acciones tácticas.
* Vista de botín contextualizada bajo una plantilla estandarizada.
* Persistencia centralizada en `localStorage` (sin cuentas obligatorias, tolerancia a fallos y cero pérdida de datos).

---

## Componentes y Archivos Creados
1. [`app/lib/progressStorage.js`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/lib/progressStorage.js):
   * Centraliza lectura, escritura y reinicio de progreso bajo un único objeto versionado (`spiffo_os_player_data`).
2. [`app/data/onboardingOptions.js`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/data/onboardingOptions.js):
   * Estructura del flujo de dos pasos: *"¿Cómo quieres jugar?"* y *"¿Qué te llama más?"* para novatos.
3. [`app/data/routesDatabase.js`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/data/routesDatabase.js):
   * 3 Rutas completas disponibles:
     * **Supervivencia Básica (Primeros Días):** Niveles 1, 2 y 3.
     * **Primer Vehículo / Nómada:** Camión Niveles 1, 2 y 3.
     * **Agricultura y Granja Autosuficiente (B42):** Niveles 1, 2 y 3.
   * Rutas preparadas como `coming_soon` (Carpintería, Combate, Roleplay).
4. [`app/data/lootDatabase.js`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/data/lootDatabase.js):
   * Fichas de botín estandarizadas con qué buscar, dónde buscar, riesgo, cuándo ir, qué llevar y tips tácticos para *Hospitales*, *Vehículos/Gasolineras*, *Herramientas/Ferreterías* y *Comida/Supermercados*.
5. [`app/components/Navbar.jsx`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/components/Navbar.jsx):
   * Cabecera limpia con 4 menús desplegables (`Modo de juego`, `Profesiones`, `Habilidades`, `Loot y mapas`), logo Spiffo de retorno y HUD de XP global.
6. [`app/components/OnboardingWizard.jsx`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/components/OnboardingWizard.jsx):
   * Pantalla de inicio con tarjetas grandes tácticas para seleccionar estilo u objetivo.
7. [`app/components/RouteView.jsx`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/components/RouteView.jsx):
   * Navegación por pestañas de nivel libre (sin bloquear consulta), barra de progreso, checklist con XP y recompensa de conocimiento.
8. [`app/components/LootView.jsx`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/components/LootView.jsx):
   * Vista de tarjetas de botín con enlace directo a la ruta relacionada.
9. [`app/page.jsx`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/page.jsx):
   * Orquestador reactivo limpio sin duplicación de estado.

---

## Verificación de Compilación
* Comando ejecutado: `npm run build`
* Resultado: **Exit Code 0** (Compilación estática optimizada sin errores).
* Repositorio remoto: Actualizado en rama `main` en GitHub (`f85e243`).

---

## Integración de Métricas y Analítica (GA4 & Microsoft Clarity)
* **Archivo modificado**: [`app/layout.js`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/layout.js)
* **Google Analytics 4**:
  - Measurement ID: `G-KRWBJ9ER2C`
  - Inyectado vía `next/script` con estrategia `afterInteractive`.
* **Microsoft Clarity**:
  - Project ID: `yuppdlr6rl`
  - Inyectado vía `next/script` con estrategia `afterInteractive` para mapas de calor y grabaciones de sesión.
* **Validación**:
  - `npm run build` exitoso con Turbopack (Exit Code 0).
  - Confirmado en el head del layout raíz.

---

## Migración Cloudflare D1 & Rediseño Minimalista de Servidores
* **Vinculación D1 Real**:
  - Conectado con la cuenta `devimeo03@gmail.com` (`Account ID: 216412448f9fbc402b01b33d58e67559`).
  - Base de datos D1: `spiffo-servers-db` (`fe48dd49-cb2a-4d9a-9176-2046cce536c7` / `69c97405-6803-4bc4-b9eb-c892e301d9ab`).
  - Migración ejecutada: `ALTER TABLE servers ADD COLUMN gallery_images TEXT;`.
  - Índices creados: `idx_servers_owner` y `idx_chat_server_ref`.
  - Mock data depurada: 0 servidores ficticios en base de datos.
* **Rediseño Minimalista de Tarjetas**:
  - Eliminados los botones de ventana falsa (`_ [] X`) y el badge voluminoso `TOP #1 / VAN #2`.
  - Estructura limpia: Topbar sutil con rango militar (#1, #2, #3), código de frecuencia Knox, estado de radio y badges de modo/región/loot.
  - Avatar táctico compacto, VU-meter de ocupación, descripción resumida y clúster de acciones directas (Copiar IP, Votar, Editar, Dossier).
* **Verificación de Terminal**:
  - `npm run build` ejecutado exitosamente con **Exit Code 0**.
  - `GET /api/servers` responde HTTP 200 con `source: cloudflare_d1` y `data: []`.

---

## Radar Táctico de Loot (Build 42) & Menú Hamburguesa Móvil
* **Sonar Táctico Interactivo ([`LootView.jsx`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/components/LootView.jsx))**:
  - Pantalla circular de sonar militar con retícula SVG concéntrica (r=20, 60, 100, 140) y ejes cartesianos.
  - Haz de barrido giratorio animado (`conic-gradient` con `@keyframes radarSweep 4s linear infinite`).
  - Nodo central del superviviente (con ping animado) y blips interactivos según el radio de alcance (Armería, Ferretería, Farmacia, Spiffo Food, Fossoil Gas).
  - Al hacer clic en un blip del sonar, la pantalla hace scroll automático suave hacia la tarjeta y la resalta con una animación de pulso.
* **Selectores de Escala y Telemetría DEFCON**:
  - Pips de radio: `500 M`, `1.5 KM` y `5.0 KM` que recalibran la escala del sonar y filtran los alijos en rango.
  - Cinta de alerta DEFCON-1 (`AMENAZA ACTIVA // KNOX DENSITY`) con pulso luminoso y estado `RADAR ACTIVO`.
  - Cajas de telemetría HUD: Objetivos detectados, ruido ambiental (38 dB) y sensores activos.
* **Filtros de Rareza y Tarjetas de Alijo**:
  - Chips de categoría: `TODO`, `MILITAR (ORO)`, `ÉPICO (PÚRPURA / B42 CRAFT)`, `MÉDICO (CIAN)`, `HERRAMIENTAS` y `ALIMENTOS`.
  - Tarjetas con resplandor superior por rareza, métrica de densidad de peligro de zeds (`PELIGRO EXTREMO // 140+ ZEDS`), captura de reconocimiento con scanlines y chips de botín detectado por escáner.
  - Acciones tácticas: `RASTREAR RUTA` (fija el objetivo en el toast GPS flotante), `ALERTA HORDA` (conmuta alarma visual y sonora), `GUARDAR EN GPS` y enlace a ruta de supervivencia.
  - Dock flotante con toast activo de rumbo (`RADAR GPS FIJADO`) y botón flotante para registrar nuevas balizas de campo.
* **Navegación Móvil Hamburguesa ([`PillNav.jsx`](file:///c:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/components/PillNav.jsx))**:
  - Botón hamburguesa táctico visible en pantallas móviles (`< 860px`).
  - Drawer lateral deslizable con backdrop difuminado y bloqueo de scroll de fondo.
  - Acceso directo a todas las vistas: Mecánicas Activas (con acordeón de rutas), Meta-Eventos, Servidores, Radar de Loot, Radio 91.5 y Asistente.
  - Acceso directo a Ficha de Superviviente, Terminal SSE Logs y autenticación.
* **Validación**:
  - `npm run build` ejecutado exitosamente con **Exit Code 0**.

