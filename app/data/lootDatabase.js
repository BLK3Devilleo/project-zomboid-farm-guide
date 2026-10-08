// Base de datos de Loot y Puntos de Interés de Spiffo-OS
// Estructura pura y estandarizada con tipos de edificio y zonas generales verificadas.

export const lootDatabase = [
  {
    id: 'hospitals',
    category: 'Hospitales y Farmacias',
    icon: '🏥',
    title: 'Hospitales, Clínicas y Farmacias',
    riskLevel: 'Alto',
    whenToGo: 'Primera semana o ante heridas graves (fracturas / laceraciones)',
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
    id: 'vehicles',
    category: 'Vehículos y Gasolineras',
    icon: '⛽',
    title: 'Gasolineras, Talleres y Aparcamientos',
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
  },
  {
    id: 'tools',
    category: 'Herramientas y Ferreterías',
    icon: '🔨',
    title: 'Ferreterías y Almacenes Industriales',
    riskLevel: 'Medio - Alto',
    whenToGo: 'Semana 1 para asegurar madera, agricultura y fontanería',
    whatToLookFor: [
      'Martillo, Sierra de mano y Cajas de clavos (Nails)',
      'Paleta de jardinería (Trowel) y Pala grande (Shovel)',
      'Hacha de tala (Axe / Wood Axe)',
      'Llave de tubo de fontanero (Pipe Wrench)',
      'Mazo pesado de demolición (Sledgehammer) y Palanca'
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
      'Zapatos de protección o botas de obrero',
      'Agua suficiente para jornadas largas de carga'
    ],
    tacticalTips: [
      'Las herramientas de metal pesan mucho; traslada tu botín por tandas o acércalo en el maletero de un coche.',
      'Los almacenes de dos pisos suelen tener cajas apiladas; sube con cautela por si hay zombis atrapados arriba.',
      'Nunca dejes atrás una llave de tubo: es la única que permite conectar agua potable del techo a tu fregadero.'
    ],
    relatedRoutes: ['farming-b42', 'first-vehicle']
  },
  {
    id: 'groceries',
    category: 'Comida y Supermercados',
    icon: '🥫',
    title: 'Supermercados, Almacenes de Alimentos y Panaderías',
    riskLevel: 'Bajo - Medio',
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
  }
];
