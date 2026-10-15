// Base de datos táctica de Loot, Alijos y Puntos de Interés de Knox-OS (Build 42)
// Estructura enriquecida con telemetría de sonar, coordenadas relativas, tiers de rareza y mecánicas de incursión.

export const lootDatabase = [
  {
    id: 'card-armory',
    tier: 'militar',
    tierLabel: 'TIER: MILITAR // PROTOTIPO',
    tierColor: '#f59e0b',
    glowColor: '#ffb95f',
    category: 'Militar',
    icon: 'shield',
    title: 'Armería Policial & West Point Gun Shop',
    sector: 'SECTOR 03: WEST POINT',
    freq: '142.80',
    distanceMeters: 320,
    distanceDisplay: '320m Noroeste • Interior Fortificado',
    radarPos: { top: '22%', left: '26%' },
    radarLabel: 'ARMERÍA // 320m',
    hazardLevel: 'PELIGRO EXTREMO // 140+ ZEDS',
    hazardNote: 'VENTILACIÓN SELLADA',
    respawnTimer: '48h 00m',
    isCritical: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYU8nYm1zwP_W3DIOz7R5ZcrRr8iQLHGR-BTaxQZ_JIZmZpRfO-SyI3x-7pyJ4_l1frh8TSYcfTYokwJZOiLsr9pVi8X-5kU7dv1RFm9gDJM9TlXs3hlPtRIMtSJjz5R8nNBefxmAVLVTyGBMJb6iCD937tQ4EnZQW5Cv7XWesBSBBLPVEzIYPHoZ0RwocqI-jFG23n-9xrMk92abcSkHX4j1-bakg9HKeg1bRw6jCcLtpHwSPSFhF',
    imageTag: 'VERJAS DE ACERO REFORZADAS',
    scanItems: [
      'Fusil M16A1',
      'Munición 5.56mm (x8 Cajas)',
      'Chaleco Antibalas Grado III',
      'Escopeta Remington 870',
      'Cajas de Cartuchos 12G'
    ],
    riskLevel: 'Extremo',
    whenToGo: 'Con vehículo rápido, hacha pesada o maza para rejas y munición suficiente',
    whatToLookFor: [
      'Armamento militar y policial de alto calibre (M16, Escopetas, Rifles)',
      'Cajas selladas de munición 5.56, 9mm y 12G',
      'Accesorios de armas (miras telescópicas, silenciadores, correas)',
      'Chalecos antibalas de grado militar y fundas de cinto'
    ],
    whereToFind: [
      'West Point Gun Shop (avenida noreste junto a la armería)',
      'Estación de Policía de Rosewood (armería trasera fortificada)',
      'Puesto militar de control Knox Checkpoint',
      'Comisaría de Muldraugh'
    ],
    recommendedGear: [
      'Maza de demolición (Sledgehammer) para abrir rejas metálicas',
      'Botas tácticas y ropa con máxima resistencia a mordeduras',
      'Silbato o bomba sonora lejana antes de aproximarse',
      'Bolsas de lona de alta capacidad'
    ],
    tacticalTips: [
      'Las ventanas y puertas tienen rejas de acero irrompibles con hacha normal; necesitas almádena o forzar el tejado.',
      'Disparar un arma aquí atraerá a los zeds de todo West Point. Si no tienes silenciador, mantén el combate cuerpo a cuerpo.',
      'Asegura un perímetro de escape despejado hacia el bosque antes de forzar el acceso.'
    ],
    relatedRoutes: ['survival-basics', 'first-vehicle']
  },
  {
    id: 'card-hardware',
    tier: 'epico',
    tierLabel: 'TIER: ÉPICO // ARTESANÍA B42',
    tierColor: '#a855f7',
    glowColor: '#c084fc',
    category: 'Herramientas',
    icon: 'construction',
    title: 'Almacén de Herramientas & Ferretería B42',
    sector: 'SECTOR 03: WEST POINT',
    freq: '142.80',
    distanceMeters: 680,
    distanceDisplay: '680m Este • Área Comercial Sur',
    radarPos: { top: '32%', left: '78%' },
    radarLabel: 'FERRETERÍA // 680m',
    hazardLevel: 'PELIGRO MEDIO // 25 ZEDS',
    hazardNote: 'MECÁNICAS FORJA B42',
    respawnTimer: '14h 22m',
    isCritical: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB352qz6TJ52NMN4VJGS5AHm3yEoMyt1XGQllGwwiwtfoPtZ2X4-6qEUByV9uGCVwmkoQOb9PTK5neDm41QG6KfrKpQnaMtGMYNcDSVNa5RHh2M19O4DXsH0bh-8FLPIkwSf-wKP-ar6xLjl08ULdZpoYLIPpkVDfKrdVE20YpaqK9LzU3RWhAjTR6ZAIJ-a4WQ3ypr3dzj9w7jLY-2MY6pxZlNKClEn_YPqERVn7blgxaqJfjGxcUa',
    imageTag: 'MECÁNICAS FORJA B42 DETECTADAS',
    scanItems: [
      'Yunque de Herrería Medieval B42',
      'Maza de 5kg (Demolición)',
      'Alambre reforzado x12',
      'Cajas de Clavos (x5)',
      'Tenazas de Herrero'
    ],
    riskLevel: 'Medio - Alto',
    whenToGo: 'Semana 1 para asegurar madera, agricultura y herrería B42',
    whatToLookFor: [
      'Yunque de piedra/hierro y tenazas de forja B42',
      'Sierra de mano y cajas de clavos (Nails)',
      'Hacha de tala y pala de jardinería',
      'Llave de tubo de fontanero (Pipe Wrench)',
      'Maza pesada (Sledgehammer) y palanca (Crowbar)'
    ],
    whereToFind: [
      'Ferreterías (Hardware Stores) en West Point y Riverside',
      'Gran almacén de herramientas al norte de Muldraugh',
      'Cajas de herramientas en garajes residenciales',
      'Zombis obreros vistiendo chaleco reflectante'
    ],
    recommendedGear: [
      'Mochila grande para tolerar peso de herramientas metálicas',
      'Arma resistente (ej. bate de béisbol o palanca)',
      'Botas reforzadas de protección',
      'Vehículo con maletero espacioso'
    ],
    tacticalTips: [
      'Las herramientas de metal pesan mucho; traslada tu botín por tandas o acércalo en el maletero de un coche.',
      'Los almacenes suelen tener cajas apiladas; sube con cautela por si hay zombis atrapados arriba.',
      'En la B42 el yunque y las tenazas permiten reparar y forjar armas medievales y armaduras de placas.'
    ],
    relatedRoutes: ['farming-b42', 'first-vehicle']
  },
  {
    id: 'card-clinic',
    tier: 'medico',
    tierLabel: 'TIER: RARO // SUMINISTROS MÉDICOS',
    tierColor: '#00a6e0',
    glowColor: '#7bd0ff',
    category: 'Médico',
    icon: 'local_hospital',
    title: 'Clínica & Farmacia Cortman',
    sector: 'SECTOR 03: WEST POINT',
    freq: '142.80',
    distanceMeters: 1100,
    distanceDisplay: '1.1km Sur • Zona Residencial',
    radarPos: { top: '78%', left: '42%' },
    radarLabel: 'FARMACIA // 1.1km',
    hazardLevel: 'PELIGRO BAJO // ZONA SEMI-DESPEJADA',
    hazardNote: 'RIESGO INFECCIÓN: 0%',
    respawnTimer: '72h 10m',
    isCritical: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYU8nYm1zwP_W3DIOz7R5ZcrRr8iQLHGR-BTaxQZ_JIZmZpRfO-SyI3x-7pyJ4_l1frh8TSYcfTYokwJZOiLsr9pVi8X-5kU7dv1RFm9gDJM9TlXs3hlPtRIMtSJjz5R8nNBefxmAVLVTyGBMJb6iCD937tQ4EnZQW5Cv7XWesBSBBLPVEzIYPHoZ0RwocqI-jFG23n-9xrMk92abcSkHX4j1-bakg9HKeg1bRw6jCcLtpHwSPSFhF',
    imageTag: 'FARMACIA CON SUMINISTROS SELLADOS',
    scanItems: [
      'Antibióticos (x3 Blíster)',
      'Suturas Quirúrgicas',
      'Desinfectante Médico',
      'Kit de Trauma y Torniquetes',
      'Betabloqueantes y Analgésicos'
    ],
    riskLevel: 'Bajo - Medio',
    whenToGo: 'Primera semana o ante heridas graves (fracturas / mordeduras / laceraciones)',
    whatToLookFor: [
      'Vendas esterilizadas y apósitos adhesivos',
      'Analgésicos (Painkillers) y Betabloqueantes (contra pánico)',
      'Antibióticos (infecciones) y Desinfectante',
      'Aguja e hilo de sutura médica (Suture needle)',
      'Férulas para fracturas y pinzas médicas'
    ],
    whereToFind: [
      'Hospital General de Cortman (Muldraugh)',
      'Clínicas médicas en avenidas principales de Rosewood y West Point',
      'Farmacias (Pharmacies) en centros urbanos',
      'Botiquines colgados en baños de casas residenciales'
    ],
    recommendedGear: [
      'Mochila con al menos 15 de capacidad',
      'Arma cuerpo a cuerpo ligera para pasillos estrechos',
      'Vendas de reserva ya equipadas',
      'Botella de agua y comida ligera'
    ],
    tacticalTips: [
      'Entra siempre por puertas traseras o ventanas laterales, nunca por la puerta de cristal principal.',
      'Los hospitales suelen tener salas ciegas sin salida; revisa las esquinas antes de entrar a farmear.',
      'Si solo necesitas vendas urgentes, rasga ropa limpia de armarios antes de arriesgarte en un hospital.'
    ],
    relatedRoutes: ['survival-basics']
  },
  {
    id: 'card-groceries',
    tier: 'alimentos',
    tierLabel: 'TIER: VITAL // PROVISIONES DE COMIDA',
    tierColor: '#f97316',
    glowColor: '#fed7aa',
    category: 'Alimentos',
    icon: 'restaurant',
    title: 'Supermercado Spiffo & Almacén de Comida',
    sector: 'SECTOR 03: WEST POINT',
    freq: '142.80',
    distanceMeters: 450,
    distanceDisplay: '450m Suroeste • Bulevar Central',
    radarPos: { top: '65%', left: '20%' },
    radarLabel: 'SPIFFO FOOD // 450m',
    hazardLevel: 'PELIGRO MEDIO-ALTO // 45 ZEDS',
    hazardNote: 'GENERADOR APAGADO',
    respawnTimer: '24h 00m',
    isCritical: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYU8nYm1zwP_W3DIOz7R5ZcrRr8iQLHGR-BTaxQZ_JIZmZpRfO-SyI3x-7pyJ4_l1frh8TSYcfTYokwJZOiLsr9pVi8X-5kU7dv1RFm9gDJM9TlXs3hlPtRIMtSJjz5R8nNBefxmAVLVTyGBMJb6iCD937tQ4EnZQW5Cv7XWesBSBBLPVEzIYPHoZ0RwocqI-jFG23n-9xrMk92abcSkHX4j1-bakg9HKeg1bRw6jCcLtpHwSPSFhF',
    imageTag: 'FRIGORÍFICOS CON ALIMENTOS FRESCOS',
    scanItems: [
      'Carne y Verduras Frescas',
      'Comida enlatada (Atún, Judías x12)',
      'Abrelatas de bolsillo',
      'Semillas de Patata y Repollo',
      'Frascos de Conserva y Vinagre'
    ],
    riskLevel: 'Medio',
    whenToGo: 'Días 1 a 5 para comida fresca; cualquier momento para enlatados',
    whatToLookFor: [
      'Carnes y verduras frescas (antes de que la energía eléctrica caiga)',
      'Comida enlatada (Atún, Judías, Sopa, Carne en conserva)',
      'Abrelatas manual (imprescindible en la mochila)',
      'Frascos de cristal para conservas, vinagre y azúcar',
      'Paquetes sellados de semillas de cultivo'
    ],
    whereToFind: [
      'Supermercados Gigis y Spiffo Markets en avenidas principales',
      'Tiendas de ultramarinos de barrio',
      'Neveras y despensas de cocinas residenciales',
      'Almacenes de importación de alimentos en muelles'
    ],
    recommendedGear: [
      'Bolsas de plástico o mochilas para reparto rápido',
      'Abrelatas ya equipado',
      'Cuchillo de cocina para preparar ensaladas o guisos en ruta'
    ],
    tacticalTips: [
      'Durante los primeros días come toda la comida fresca posible para subir peso; guarda las latas para el invierno.',
      'Los frigoríficos de los supermercados pitan y atraen zombis si la alarma está conectada; comprueba el perímetro.',
      'La comida podrida no se tira: guárdala para la compostera y conviértela en abono fértil para tu huerto.'
    ],
    relatedRoutes: ['survival-basics', 'farming-b42']
  },
  {
    id: 'card-gasstation',
    tier: 'herramientas',
    tierLabel: 'TIER: LOGÍSTICA // COMBUSTIBLE & TALLER',
    tierColor: '#10b981',
    glowColor: '#4edea3',
    category: 'Vehículos',
    icon: 'local_gas_station',
    title: 'Gasolinera Fossoil & Taller Mecánico',
    sector: 'SECTOR 03: WEST POINT',
    freq: '142.80',
    distanceMeters: 1400,
    distanceDisplay: '1.4km Noroeste • Carretera Interestatal',
    radarPos: { top: '15%', left: '48%' },
    radarLabel: 'FOSSOIL GAS // 1.4km',
    hazardLevel: 'PELIGRO ELEVADO // ALARMA VEHICULAR',
    hazardNote: 'SURTIDORES CON RESERVA',
    respawnTimer: '96h 00m',
    isCritical: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB352qz6TJ52NMN4VJGS5AHm3yEoMyt1XGQllGwwiwtfoPtZ2X4-6qEUByV9uGCVwmkoQOb9PTK5neDm41QG6KfrKpQnaMtGMYNcDSVNa5RHh2M19O4DXsH0bh-8FLPIkwSf-wKP-ar6xLjl08ULdZpoYLIPpkVDfKrdVE20YpaqK9LzU3RWhAjTR6ZAIJ-a4WQ3ypr3dzj9w7jLY-2MY6pxZlNKClEn_YPqERVn7blgxaqJfjGxcUa',
    imageTag: 'SURTIDORES MANUALES OPERATIVOS',
    scanItems: [
      'Latas de Gasolina (Gas Cans x4)',
      'Bomba de aire para neumáticos',
      'Gato hidráulico (Jack)',
      'Batería pesada cargada',
      'Llave inglesa de mecánico'
    ],
    riskLevel: 'Medio',
    whenToGo: 'Días 1 a 4 (imprescindible antes del corte de luz general)',
    whatToLookFor: [
      'Latas de gasolina vacías o llenas (Gas Cans)',
      'Bomba de aire manual para neumáticos (Tire Pump)',
      'Gato hidráulico (Jack) y Llave de cruceta (Lug Wrench)',
      'Baterías de coche con carga y cargadores de batería',
      'Piezas de repuesto (frenos, amortiguadores, neumáticos pesados)'
    ],
    whereToFind: [
      'Gasolineras de autopista (Fossoil / Gas-2-Go)',
      'Talleres mecánicos y desguaces automotrices',
      'Cobertizos traseros y garajes de casas suburbanas',
      'Guanteras y maleteros de vehículos abandonados en calles'
    ],
    recommendedGear: [
      'Destornillador en la riñonera',
      'Lata de combustible vacía',
      'Arma a dos manos para despejar la playa de surtidores',
      'Cuerda de remolque si planeas mover otro auto'
    ],
    tacticalTips: [
      'Apunta la ubicación de las gasolineras en tu mapa; cuando la luz se corte necesitarás un generador para hacer funcionar las bombas.',
      'Al saquear coches en parkings, no fuerces las ventanillas si están cerradas a menos que tengas cinta o repuesto.',
      'Revisa el suelo alrededor de los coches: las llaves suelen caer al pavimento tras abatir al dueño zombi.'
    ],
    relatedRoutes: ['first-vehicle']
  }
];
