// Base de Datos Unificada de Guías de Juego y Manuales Tácticos con Misiones XP
// KnoxOS Build 42 Tactical Survival Manuals

export const gameGuidesDatabase = [
  {
    id: 'survival-basics',
    slug: 'supervivencia-basica',
    title: 'Supervivencia: Primeros Días en Kentucky',
    category: 'Supervivencia Temprana',
    tag: 'ESENCIAL',
    difficulty: 'Principiante',
    estimatedTime: 'Días 1 a 3 in-game',
    summary: 'Aprende a moverte en sigilo, asegurar tu primera casa refugio, gestionar el agua antes del corte y no alertar hordas.',
    requirements: [
      'Reloj digital con alarma',
      'Calzado deportivo (reduce ruido de pasos)',
      'Sábanas limpias x4 (para bloquear ventanas)',
      'Arma ligera de impacto (sartén, palanca o llave)',
    ],
    steps: [
      {
        step: 1,
        title: 'Sigilo y cierre de cortinas inmediato',
        desc: 'Nada más aparecer, presiona la tecla [C] para agacharte. Tapa todas las ventanas de la planta baja con sábanas o cortinas para que los zeds errantes no detecten movimiento interior.',
      },
      {
        step: 2,
        title: 'Almacenamiento de agua potable de emergencia',
        desc: 'Llena de inmediato ollas, cacerolas, teteras y botellas con agua del grifo antes de que ocurra el corte mundial de suministro.',
      },
      {
        step: 3,
        title: 'Sintonizar Life and Living TV',
        desc: 'Enciende el televisor a las 06:00, 12:00 y 18:00 en el canal educativo Life and Living para subir niveles gratuitos de cocina, carpintería y forrajeo.',
      },
      {
        step: 4,
        title: 'Control de combate de 1 a 2 zombis',
        desc: 'Atráelos de uno en uno con un susurro o paso corto. Empuja con [Espacio], derriba al zed y písale la cabeza con la bota para no romper tu arma.',
      },
    ],
    warnings: [
      'Nunca corras en áreas residenciales a menos que sea strictly necesario; caminar a paso normal es más rápido que los zombis normales y no agota tu resistencia.',
    ],
    missions: [
      { id: 'sb-curtains', label: 'Tapa todas las ventanas de tu casa inicial con sábanas limpias', xp: 25 },
      { id: 'sb-water', label: 'Llena 3 recipientes con agua potable antes del corte de suministro', xp: 20 },
      { id: 'sb-sneak', label: 'Desplázate 100 metros agachado con la tecla [C] sin alertar a ningún zombi', xp: 30 },
      { id: 'sb-stomp', label: 'Derriba a un zombi con [Espacio] y elimínalo pisándole la cabeza', xp: 35 },
    ],
    comments: [
      {
        id: 'gc-sb-1',
        author: { name: 'Operador_Miller', badge: '[SUPERVIVIENTE]', color: '#10b981' },
        content: 'El consejo de llenar ollas de agua desde el día 1 me salvó la vida en Muldraugh cuando el corte ocurrió en el día 5.',
        createdAt: 'Hace 1 día',
        upvotes: 19,
      },
    ],
  },
  {
    id: 'hotwiring-vehicles',
    slug: 'puentear-coches',
    title: 'Mecánica: Puentear Coches (Hotwiring Master)',
    category: 'Vehículos & Motores',
    tag: 'TÁCTICA B42',
    difficulty: 'Media',
    estimatedTime: 'Días 1 a 3',
    summary: 'Aprende a arrancar y robar cualquier vehículo sin llaves ni profesión de Ladrón subiendo Electricidad Nv. 1 y Mecánica Nv. 2.',
    requirements: [
      'Electricidad Nivel 1 (desmonta relojes y radios)',
      'Mecánica Nivel 2 (desmonta y monta faros y baterías)',
      'Destornillador básico en inventario',
    ],
    steps: [
      {
        step: 1,
        title: 'Entrenar Electricidad Nivel 1',
        desc: 'Lootear un destornillador en garajes o cocinas. Registra casas buscando relojes digitales, radios y walkie-talkies. Haz clic derecho y selecciona "Desmontar". Con unas 8 a 12 radios alcanzarás Nivel 1.',
      },
      {
        step: 2,
        title: 'Entrenar Mecánica Nivel 2',
        desc: 'Localiza cualquier coche estacionado seguro. Abre el capó con la tecla [V] o clic derecho en el motor. Desmonta y vuelve a montar faros delanteros, faros traseros y la batería (una vez por día in-game por vehículo).',
      },
      {
        step: 3,
        title: 'Puentear el vehículo desde el asiento del piloto',
        desc: 'Entra al asiento del conductor. Pulsa la tecla [V] para abrir el menú radial del vehículo y selecciona "Puentear vehículo" (icono de cables). Si falla, repite el intento hasta que los cables chispeen en verde.',
      },
    ],
    warnings: [
      'Puentear un coche causa ruido de chispas eléctricas y hace sonar una pequeña alerta si el coche tiene alarma activa. Ten despejado el perímetro antes de intentar el puente.',
    ],
    missions: [
      { id: 'hw-screwdriver', label: 'Localiza un destornillador en un garaje, cobertizo o ferretería', xp: 20 },
      { id: 'hw-elec1', label: 'Alcanza el Nivel 1 de Electricidad desmontando aparatos electrónicos', xp: 40 },
      { id: 'hw-mech2', label: 'Alcanza el Nivel 2 de Mecánica practicando con baterías y faros', xp: 50 },
      { id: 'hw-success', label: 'Arranca con éxito tu primer vehículo mediante el menú radial [V]', xp: 60 },
    ],
    comments: [
      {
        id: 'gc-hw-1',
        author: { name: 'Táctico_Reyes', badge: '[MECÁNICO]', color: '#38bdf8' },
        content: 'Desmontar faros delanteros da 1.5 XP cada uno sin riesgo de romperlos, ideal para farmear nivel 2 de mecánica.',
        createdAt: 'Hace 2 días',
        upvotes: 28,
      },
    ],
  },
  {
    id: 'carpentry-walls',
    slug: 'primeras-paredes',
    title: 'Carpintería: Primeras Paredes y Fortificación de Base',
    category: 'Construcción & Fortificación',
    tag: 'CONSTRUCCIÓN',
    difficulty: 'Básica',
    estimatedTime: 'Días 3 a 7',
    summary: 'Construye perímetros defensivos de madera, empalizadas y puertas reforzadas para aislar tu refugio contra hordas.',
    requirements: [
      'Martillo y Sierra de mano',
      'Caja de clavos (al menos 40 clavos)',
      'Tablones de madera x20 (tala árboles con hacha o sierra muebles)',
      'Carpintería Nivel 2 o superior',
    ],
    steps: [
      {
        step: 1,
        title: 'Recolección de madera y clavos',
        desc: 'Tala árboles cercanos con un hacha de mano o sierra árboles pequeños. Asierra los troncos en el suelo con tu sierra para obtener 3 tablas por cada tronco.',
      },
      {
        step: 2,
        title: 'Montaje del armazón de madera',
        desc: 'Abre el menú de construcción con clic derecho en el suelo -> Carpintería -> Paredes -> Armazón de madera. Cada armazón requiere 2 tablas y 2 clavos.',
      },
      {
        step: 3,
        title: 'Mejora a pared de madera sólida',
        desc: 'Sobre el armazón construido, haz clic derecho -> Carpintería -> Mejorar pared de madera. Requiere 2 tablas y 2 clavos adicionales.',
      },
      {
        step: 4,
        title: 'Barricadas exteriores con tablas',
        desc: 'Acércate a las ventanas exteriores y clava hasta 4 tablas por ventana. Cada tabla multiplica los puntos de impacto que los zeds deben asestar antes de quebrar el vidrio.',
      },
    ],
    warnings: [
      'El sonido de talar árboles y martillar viaja hasta 40 casillas. Trabaja de día y con buena visibilidad perimetral.',
    ],
    missions: [
      { id: 'cw-saw', label: 'Consigue un martillo y una sierra de carpintero', xp: 25 },
      { id: 'cw-planks', label: 'Asierra al menos 10 tablones a partir de troncos cortados', xp: 30 },
      { id: 'cw-frame', label: 'Construye tu primer armazón de pared de madera', xp: 35 },
      { id: 'cw-barricade', label: 'Coloca una barricada de 4 tablas en una ventana expuesta', xp: 40 },
    ],
    comments: [],
  },
  {
    id: 'roof-plumbing',
    slug: 'fontaneria-tejado',
    title: 'Fontanería de Agua Limpia: Colectores y Fregaderos',
    category: 'Recursos & Agua',
    tag: 'RECURSOS B42',
    difficulty: 'Avanzada',
    estimatedTime: 'Antes del Corte',
    summary: 'Sistema autónomo de agua potable conectando barriles de lluvia al piso superior de un fregadero.',
    requirements: [
      'Carpintería Nivel 4 a 7 (para recolectores de agua)',
      'Llave grifa (Pipe Wrench) para conectar tuberías',
      'Bolsas de basura x4 y tablones x4 para cada recolector',
    ],
    steps: [
      {
        step: 1,
        title: 'Montaje del recolector en el tejado',
        desc: 'Construye el recolector de agua de lluvia exactamente un piso arriba y en la misma celda o celdas adyacentes a donde se ubica el fregadero en el piso inferior.',
      },
      {
        step: 2,
        title: 'Aislamiento de habitación cerrada',
        desc: 'El fregadero debe estar dentro de una habitación 100% cerrada (4 paredes y techo) reconocida por el motor del juego como interior.',
      },
      {
        step: 3,
        title: 'Conexión con llave grifa',
        desc: 'Con la llave grifa en el inventario principal, haz clic derecho en el fregadero del piso inferior y selecciona "Conectar tubería al recolector".',
      },
      {
        step: 4,
        title: 'Filtrado automático',
        desc: 'Al canalizar el agua de lluvia a través del fregadero con tubería, el agua sale automáticamente 100% limpia y potable sin necesidad de hervirla.',
      },
    ],
    warnings: [
      'Beber agua directamente de un barril de lluvia sin hervir ni filtrar causará envenenamiento e infección mortal.',
    ],
    missions: [
      { id: 'rp-barrel', label: 'Fabrica un recolector de lluvia con tablas y bolsas de basura', xp: 45 },
      { id: 'rp-wrench', label: 'Encuentra una llave grifa (Pipe Wrench) en un almacén o ferretería', xp: 30 },
      { id: 'rp-plumb', label: 'Conecta con éxito la tubería de un recolector superior a un fregadero cerrado', xp: 60 },
    ],
    comments: [],
  },
  {
    id: 'generator-fuel',
    slug: 'generador-electricidad',
    title: 'Generadores Eléctricos y Combustible Seguro',
    category: 'Electricidad & Energía',
    tag: 'SUPERVIVENCIA',
    difficulty: 'Media',
    estimatedTime: 'Día 7 a 14',
    summary: 'Procedimiento de instalación eléctrica de emergencia tras el colapso de la red de Knox sin morir por intoxicación.',
    requirements: [
      'Revista "Cómo Usar Generadores" leída (O profesión Electricista)',
      'Generador portátil encontrado en cobertizos o garajes',
      'Bidón de gasolina de 5L lleno',
    ],
    steps: [
      {
        step: 1,
        title: 'Ubicación exterior obligatoria',
        desc: 'Coloca SIEMPRE el generador al aire libre (patio o balcón abierto). NUNCA dentro de casa ni en el garaje, o el humo tóxico matará a tu personaje en menos de 10 minutos.',
      },
      {
        step: 2,
        title: 'Carga de combustible y conexión',
        desc: 'Vierte gasolina con clic derecho -> Cargar combustible. Haz clic derecho -> Conectar generador para enlazar los electrodomésticos en un radio de 20 casillas.',
      },
      {
        step: 3,
        title: 'Mantenimiento preventivo',
        desc: 'Revisa el estado de la máquina periódicamente. Si su condición baja del 20%, el generador explotará provocando un incendio descontrolado. Repáralo con piezas electrónicas.',
      },
    ],
    warnings: [
      'El generador produce ruido constante que atrae zeds lentos del vecindario. Fortifica el perímetro donde lo ubiques.',
    ],
    missions: [
      { id: 'gf-magazine', label: 'Encuentra y lee la revista "Cómo usar generadores"', xp: 35 },
      { id: 'gf-generator', label: 'Transporta un generador portátil a la zona exterior de tu refugio', xp: 40 },
      { id: 'gf-fuel', label: 'Llena un bidón de gasolina en una estación y recarga el generador', xp: 35 },
      { id: 'gf-power', label: 'Conecta y enciende el generador restaurando luz y refrigeradores', xp: 50 },
    ],
    comments: [],
  },
];
