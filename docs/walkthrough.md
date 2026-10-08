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

