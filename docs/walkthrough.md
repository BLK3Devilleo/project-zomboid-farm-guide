# Walkthrough: Sistema de Metalurgia B42 y Zonas de Peligro & Loot

## Estado Final
Se ha integrado con éxito en la aplicación de Project Zomboid (Build 42):
1. **Módulo de Metalurgia & Forja (Build 42)** con soporte para herramientas de soldadura, hornos primitivos/industriales de arcilla, yunques, defensas blindadas y revistas técnicas Vol. 1-4.
2. **Módulo de Zonas de Máximo Riesgo & Botín Legendario (Top 3 por Mapa)** cubriendo Muldraugh, West Point, Riverside, Rosewood y Louisville con densidad zombi, niveles de amenaza (Tiers S+, S, A+, A, B+), equipo obligatorio y rutas tácticas de incursion/evacuación.

---

## Características Implementadas

### 1. Base de Datos de Metalurgia & Forja ([`app/data/metalworking.js`](file:///C:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/data/metalworking.js))
* **Herramientas de Taller:** Soplete de propano, máscara de soldador, electrodos consumibles y llave grifa para fontanería.
* **Forja & Fundición B42:** Horno primitivo de arcilla, yunque de forja, fuelle de cuero para flujo de aire y moldes cocidos de arcilla para clavos y piezas.
* **Defensas & Barricadas:** Rejas de barras transparentes para ventanas, láminas ciegas de metal y vallas altas de reja de acero perimetrales.
* **Manuales Técnicos:** The Metalwork Magazine Vol. 1 al 4 con recetas desbloqueadas y mejores ubicaciones para encontrarlas.

### 2. Base de Datos de Zonas de Peligro ([`app/data/dangerousZones.js`](file:///C:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/data/dangerousZones.js))
Top 3 zonas más peligrosas y looteables de cada una de las 5 ciudades:
* **Muldraugh:** Dixie Highway Commercial Strip (S+), Large North Warehouse (A), Depósito Ferroviario / Rail Yard (B+).
* **West Point:** Gun Store & Armería Blindada (S+), Downtown Strip & Giga-Supermercado (S), Comisaría de Policía Central (A+).
* **Riverside:** Country Club & Mansiones del Sur (A+), GigaMart Fluvial & Galería (A), Escuela Pública & Correos (B+).
* **Rosewood:** Penitenciaría Estatal de Kentucky / Prisión (S+), Estación de Bomberos & Comisaría (A), Autocine Abandonado & Desguace (B+).
* **Louisville:** Punto de Control Militar de la Zona de Exclusión (S+), Grand Ohio Mall (+5.000 zombis) (S+), Hospital General San Peregrino (S).

### 3. Vistas HUD e Interfaz Interactiva ([`app/page.jsx`](file:///C:/Users/LARM2/OneDrive/Escritorio/juegos/project%20zomboid%20guia%20app/project-zomboid-farm-guide/app/page.jsx))
* Selector modular de 4 pestañas:
  * 🗺️ **Misiones:** Ruta de progresión 1-20 y retos tácticos.
  * 🛠️ **Herramientas:** Arsenal de herramientas con filtros de categoría.
  * ⚒️ **Metalurgia (B42):** Manual de forja, fundición y defensas.
  * ☠️ **Zonas de Peligro:** Filtro por ciudades de Knox Country, niveles de amenaza y planes de incursión.
* Modales dinámicos con fichas completas, recetas, requisitos de combustible, equipamiento táctico sugerido y tácticas de escape.

---

## Verificación y Calidad
1. **Compilación de Producción:**
   * Ejecutado `npm run build` con Next.js 16.4.0 (Turbopack).
   * Generación de páginas estáticas exitosa (3/3 páginas estáticas generadas).
   * **Exit Code: 0**.
2. **Control de Versiones:**
   * Cambios preparados y estructurados de forma atómica siguiendo Conventional Commits en inglés.
