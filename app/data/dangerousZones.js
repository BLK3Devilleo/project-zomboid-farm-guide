export const DANGEROUS_ZONES_DATABASE = [
  // ==========================================
  // 1. MULDRAUGH (El corredor comercial y logístico)
  // ==========================================
  {
    id: 'muldraugh-dixie-highway',
    map: 'Muldraugh',
    name: 'El Boulevard de la Muerte (Dixie Highway - Zona Comercial)',
    tier: 'S+',
    threatLevel: 'Extrema / Letal (Miles de zombis en migración continua)',
    icon: '⛽',
    bannerColor: '#dc2626',
    coordinates: '10620 x 9980 (Carretera Principal de Muldraugh)',
    description: 'La arteria comercial que atraviesa Muldraugh de norte a sur. Alberga gasolineras, supermercados, moteles y naves de suministros. Su densidad zombi es descomunal debido a la migración horizontal de ambos lados del bosque y los constantes ruidos del tráfico periférico.',
    lootHighlights: [
      'Combustible infinito en tanques soterrados de gasolineras',
      'Ferretería central con hachas, almádenas y clavos',
      'Miles de latas y comida imperecedera en el supermercado Spiffo y Food Market',
      'Baterías y recambios mecánicos pesados en talleres y aparcamientos'
    ],
    recommendedGear: [
      'Vehículo blindado con barra de choque frontal',
      'Escopeta JS-2000 con +200 cartuchos (solo si pretendes despejar la vía con ruido)',
      'Betabloqueantes y Vitaminas para evitar fatiga/pánico extremo',
      'Cócteles Molotov o bombas de fuego caseras para limpiezas masivas'
    ],
    tactics: [
      'NUNCA vayas a pie sin tener un vehículo de escape encarado en dirección sur.',
      'Usa las sirenas de una patrulla policial o ambulancia colocada en el descampado para agrupar las hordas antes de saquear las tiendas.',
      'Los moteles del bulevar son trampas mortales de cuartos ciegos; abre cada puerta con empujón y paso atrás.'
    ]
  },
  {
    id: 'muldraugh-large-warehouse',
    map: 'Muldraugh',
    name: 'Gran Almacén Industrial del Norte (Large Warehouse)',
    tier: 'A',
    threatLevel: 'Alta / Crítica en interiores ciegos',
    icon: '📦',
    bannerColor: '#ea580c',
    coordinates: '10600 x 9340 (Extremo Norte de Muldraugh)',
    description: 'El santo grial para cualquier constructor y agricultor en early/mid-game. Dos plantas repletas de cajones industriales apilados hasta el techo y azotea accesible para recolectores de agua de lluvia.',
    lootHighlights: [
      'Almádenas (Sledgehammer), hachas de bombero y palas de nieve',
      'Sacos de tierra, semillas selladas, regaderas y fertilizante',
      'Generadores eléctricos y latas de gasolina de repuesto',
      'Varillas de soldadura, alambre y planchas de acero para metalurgia'
    ],
    recommendedGear: [
      'Palanca o hacha para abrir puertas atrancadas en silencio',
      'Linterna de ángulo con pilas de recambio para pasillos entre cajas',
      'Mochila grande o camión con remolque para cargar cajas y sacos'
    ],
    tactics: [
      'La primera planta tiene esquinas oscuras donde los zombis acechan en silencio; haz "whisper" (Q agachado) en cada pasillo.',
      'Asegura la escalera a la segunda planta inmediatamente colocando una puerta o barricada temporal.',
      'Es una de las mejores bases seguras del juego una vez que destruyes la escalera y pones cuerdas de escape hacia la azotea.'
    ]
  },
  {
    id: 'muldraugh-sunstar-motel-railyard',
    map: 'Muldraugh',
    name: 'Depósito Ferroviario & Estación de Maniobras (Rail Yard)',
    tier: 'B+',
    threatLevel: 'Alta (Espacio abierto sin coberturas y hordas circundantes)',
    icon: '🚆',
    bannerColor: '#d97706',
    coordinates: '11500 x 9850 (Sureste de Muldraugh)',
    description: 'Extenso complejo industrial ferroviario con hangares de mantenimiento de trenes, depósitos de maquinaria pesada y oficinas de logística.',
    lootHighlights: [
      'Piedras de afilar, herramientas industriales y tanques de propano',
      'Piezas de camiones y baterías de alta capacidad',
      'Ropa de trabajo pesada de alta protección contra mordeduras (monos de mecánico, petos reforzados)',
      'Cajas de tornillos, remaches y tuberías metálicas'
    ],
    recommendedGear: [
      'Armas cuerpo a cuerpo de dos manos con buen rango (lanzas con cuchillo o bate con pinchos)',
      'Zapatillas deportivas ligeras para no acumular fatiga corriendo por los raíles',
      'Botiquín completo con vendas estériles y desinfectante'
    ],
    tactics: [
      'La visibilidad en las vías es muy amplia: los zombis te detectarán a gran distancia. Llévalos en tren hacia las naves laterales.',
      'Cuidado con saltar vallas altas alrededor de las vías; comprueba el otro lado o podrías caer en medio de un grupo atrapado.'
    ]
  },

  // ==========================================
  // 2. WEST POINT (La capital de las hordas densas)
  // ==========================================
  {
    id: 'westpoint-gun-store',
    map: 'West Point',
    name: 'Armería de West Point (American Tire & Gun Shop)',
    tier: 'S+',
    threatLevel: 'Extrema / Letal (Entrada blindada y decenas de zombis en el perímetro)',
    icon: '🎯',
    bannerColor: '#dc2626',
    coordinates: '12065 x 6765 (Carretera Noreste hacia Louisville)',
    description: 'La armería más famosa de Knox Country. Sus ventanas y mostrador están fortificados con rejas de hierro indestructibles que solo ceden ante una almádena o fuego controlado.',
    lootHighlights: [
      'Arsenal masivo: M16, escopetas JS-2000, rifles M14/M700 y pistolas D-E',
      'Miles de cajas de munición de todos los calibres (12g, 5.56mm, .308, 9mm)',
      'Fundas de extracción rápida, chalecos antibalas militares y accesorios tácticos',
      'Kits de limpieza de armas y cajas de seguridad con cargadores dobles'
    ],
    recommendedGear: [
      'ALMÁDENA (Sledgehammer) OBLIGATORIA para derribar las rejas de seguridad',
      'Silenciadores (si usas mods de armas) o arsenal cuerpo a cuerpo para no alertar a la autopista',
      'Camión furgoneta grande para acarrear el peso de la munición'
    ],
    tactics: [
      'Si no tienes almádena, puedes intentar prender fuego a una pared lateral con cuidado extremo de no quemar los armarios de munición.',
      'El sonido de un disparo aquí atraerá a toda la periferia de West Point y el bosque adyacente en menos de 90 segundos.',
      'Limpia primero el American Tire contiguo para conseguir repuestos de motor y ruedas todoterreno.'
    ]
  },
  {
    id: 'westpoint-downtown-strip',
    map: 'West Point',
    name: 'Centro Comercial Urbano (Downtown & Supermercado Gigigante)',
    tier: 'S',
    threatLevel: 'Extrema (La mayor densidad de zombis por metro cuadrado de West Point)',
    icon: '🏬',
    bannerColor: '#dc2626',
    coordinates: '11920 x 6870 (Corazón urbano de West Point)',
    description: 'El núcleo de West Point concentra farmacia, librería Twiggy, banco, comisaría, ferretería, panadería y un enorme supermercado en un radio de dos manzanas.',
    lootHighlights: [
      'Libros de habilidad (Vol. 1 al 5 de todas las profesiones) en la librería',
      'Medicamentos críticos (antibióticos, pastillas para dormir, betabloqueantes) en la farmacia',
      'Herramientas avanzadas en la ferretería del centro',
      'Comida fresca en las cámaras frigoríficas y estantes repletos'
    ],
    recommendedGear: [
      'Escopeta con 300+ balas o katana para cortes múltiples',
      'Botas militares para pisoteo rápido de cabezas',
      'Varios botes de agua de 1L para combatir deshidratación por combate prolongado'
    ],
    tactics: [
      'Avanza manzana a manzana limpiando hacia atrás. Si te rodeas en las avenidas transversales estás muerto.',
      'Usa el río al norte como barrera natural para que los zombis no te flanqueen por la espalda.',
      'Aprovecha los pisos superiores de los apartamentos para descansar solo si sellas la entrada inferior con barricadas.'
    ]
  },
  {
    id: 'westpoint-police-station',
    map: 'West Point',
    name: 'Comisaría Central de Policía de West Point',
    tier: 'A+',
    threatLevel: 'Muy Alta (Armero cerrado y pasillos estrechos)',
    icon: '🛡️',
    bannerColor: '#ea580c',
    coordinates: '11900 x 6940 (Avenida Central)',
    description: 'Estación de policía de dos plantas con un armero de alta seguridad y aparcamiento de vehículos de emergencia.',
    lootHighlights: [
      'Armas de servicio policial: escopetas, pistolas M9, cargadores y chalecos',
      'Radios militares Walkie-Talkie de banda táctica para comunicación de emergencia',
      'Patrullas de policía con sirenas operativas y depósitos llenos en el patio',
      'Botiquines médicos de primeros auxilios y chalecos de alta visibilidad'
    ],
    recommendedGear: [
      'Almádena o desarmador/palanca para forzar la puerta de seguridad del armero',
      'Arma secundaria rápida para combates en celdas y oficinas estrechas'
    ],
    tactics: [
      'Los zombis policías suelen llevar fundas con armas y porras tácticas de alta durabilidad.',
      'No enciendas las sirenas de los coches en el parking a menos que quieras evacuar el centro urbano entero hacia ti.'
    ]
  },

  // ==========================================
  // 3. RIVERSIDE (La joya del río Ohio)
  // ==========================================
  {
    id: 'riverside-country-club',
    map: 'Riverside',
    name: 'Club de Campo & Mansiones del Sur (Riverside Country Club)',
    tier: 'A+',
    threatLevel: 'Muy Alta (Grandes salones abiertos y hordas en los campos de golf)',
    icon: '⛳',
    bannerColor: '#ea580c',
    coordinates: '5800 x 6300 (Al sur de Riverside)',
    description: 'Lujoso resort de ocio de la élite de Kentucky con campo de golf, piscinas cubiertas, restaurantes de lujo y vestuarios privados.',
    lootHighlights: [
      'Palos de golf (una de las mejores armas contundentes a dos manos por bajo peso y buen crítico)',
      'Cocinas industriales de nivel gourmet repletas de conservas, condimentos y sartenes de alta gama',
      'Ropa de abrigo de alta resistencia térmica (chaquetas de cuero, impermeables de marca)',
      'Botiquín médico de club deportivo con férulas, vendas y desinfectantes'
    ],
    recommendedGear: [
      'Coche en buen estado para recorrer las interminables praderas de golf',
      'Armas de buena durabilidad; los salones interiores suelen albergar 80-120 zombis atrapados'
    ],
    tactics: [
      'El campo abierto permite dar círculos con el coche tocando el claxon para formar una bola de horda compacta y luego pasar de largo.',
      'Cuidado con la iluminación: al caer la noche el interior de las canchas es completamente negro y con acústica engañosa.'
    ]
  },
  {
    id: 'riverside-giga-mart-strip',
    map: 'Riverside',
    name: 'Galería Comercial Ribereña & GigaMart',
    tier: 'A',
    threatLevel: 'Alta (Frente fluvial con densidad constante de caminantes)',
    icon: '🛒',
    bannerColor: '#ea580c',
    coordinates: '6540 x 5380 (Paseo Fluvial de Riverside)',
    description: 'El mayor complejo comercial de Riverside, ubicado justo en el paseo fluvial. Incluye GigaMart, farmacia, tienda de ropa elegante, ferretería y gasolinera cercana.',
    lootHighlights: [
      'Tonelaadas de alimentos frescos y enlatados para subsistir el primer invierno',
      'Ferretería con clavos, alambre, sierras y pegamento para madera',
      'Farmacia con antibióticos y analgésicos',
      'Agua potable infinita al estar a 30 metros de la orilla del río Ohio'
    ],
    recommendedGear: [
      'Carretilla o camioneta grande aparcada de culata en la bahía de carga trasera',
      'Armas cortas contundentes para limpiar pasillos entre estanterías'
    ],
    tactics: [
      'Limpia primero el muelle y la orilla para asegurarte de que no te lleguen hordas por la espalda.',
      'Usa las puertas traseras de servicio del GigaMart para cargar provisiones sin exponerte a la avenida principal.'
    ]
  },
  {
    id: 'riverside-post-office-school',
    map: 'Riverside',
    name: 'Escuela de Riverside & Oficina de Correos',
    tier: 'B+',
    threatLevel: 'Media-Alta (Muchos zombis adolescentes rápidos y biblioteca laberíntica)',
    icon: '📚',
    bannerColor: '#d97706',
    coordinates: '6400 x 5450 (Centro Cívico)',
    description: 'La combinación de la oficina postal y la enorme escuela pública ofrece la mayor concentración de conocimiento y mochilas de toda la región oeste.',
    lootHighlights: [
      'Biblioteca escolar completa con libros de habilidad de cocina, carpintería, mecánica y pesca',
      'Mochilas escolares y petates en las taquillas de los pasillos',
      'Revistas de recetas (incluyendo Generadores, Trampas y Forja B42)',
      'Herramientas de bricolaje en el taller vocacional de la escuela'
    ],
    recommendedGear: [
      'Armas silenciosas para no resonar por los largos pasillos de azulejo',
      'Bolsas vacías listas para expoliar libros'
    ],
    tactics: [
      'Entra por las ventanas laterales de la biblioteca para acceder directamente a las estanterías sin alertar al gimnasio o cafetería.',
      'Comprueba cada taquilla escolar: es un spawn común de cintas de embalar, tijeras y pegamento.'
    ]
  },

  // ==========================================
  // 4. ROSEWOOD (La prisión militarizada y los juzgados)
  // ==========================================
  {
    id: 'rosewood-kentucky-state-prison',
    map: 'Rosewood',
    name: 'Penitenciaría Estatal de Kentucky (Rosewood State Prison)',
    tier: 'S+',
    threatLevel: 'Extrema / Letal (La instalación cerrada más peligrosa de la zona rural)',
    icon: '⛓️',
    bannerColor: '#dc2626',
    coordinates: '7700 x 11880 (Noroeste de Rosewood)',
    description: 'Una prisión estatal de máxima seguridad rodeada de alambradas, torres de vigilancia, patios amurallados y un enorme complejo de celdas y oficinas de guardias.',
    lootHighlights: [
      'Armería del pabellón de guardias con escopetas antidisturbios, munición y porras',
      'Ropa de protección balística y chalecos antibalas militares',
      'Enfermería de la prisión con camillas, vendas quirúrgicas y desinfectantes médicos',
      'Cafetería y almacén de víveres con capacidad para cientos de reclusos'
    ],
    recommendedGear: [
      'Mínimo 500 cartuchos de escopeta y armas de fuego con puntería 4+',
      'Almádena para abrir puertas de celdas de máxima seguridad',
      'Múltiples botiquines y betabloqueantes para pánico máximo persistente'
    ],
    tactics: [
      'NO entres directamente al pabellón principal. Despeja primero el edificio exterior de visitas y el armero frontal.',
      'Las puertas metálicas retienen a cientos de zombis en celdas; un solo golpe puede derrumbar la puerta y provocar una avalancha mortal.',
      'Si no buscas combate suicida, saquea solo el edificio de acceso y las torres perimetrales.'
    ]
  },
  {
    id: 'rosewood-fire-police-hub',
    map: 'Rosewood',
    name: 'Estación de Bomberos & Comisaría de Rosewood',
    tier: 'A',
    threatLevel: 'Alta (Punto caliente clásico de inicio de partida)',
    icon: '🚒',
    bannerColor: '#ea580c',
    coordinates: '8150 x 11650 (Sur de la Avenida Principal)',
    description: 'Ubicadas una al lado de la otra, la estación de bomberos de dos plantas y la comisaría forman el mejor combo de equipamiento defensivo y armas en el sur.',
    lootHighlights: [
      'Hachas de bombero (Wood Axe y Fire Axe), la mejor arma contundente y herramienta de tala',
      'Trajes ignífugos de bombero completos (chaquetón y pantalón) con máxima protección contra rasguños',
      'Armero de policía con pistolas 9mm, escopetas y munición',
      'Camión de bomberos con depósito de agua y sirena potente'
    ],
    recommendedGear: [
      'Arma cuerpo a cuerpo ligera para despejar el garaje de bomberos',
      'Llave inglesa o ganzúas para abrir los armarios metálicos'
    ],
    tactics: [
      'La estación de bomberos es una de las bases más populares del juego: tiene cocina, camas arriba, garaje cerrado y un patio trasero vallado.',
      'Asegura la planta alta de inmediato; a veces los zombis duermen en los dormitorios del segundo piso.'
    ]
  },
  {
    id: 'rosewood-drive-in-theatre',
    map: 'Rosewood',
    name: 'Autocine Abandonado & Gasolinera Periférica',
    tier: 'B+',
    threatLevel: 'Media-Alta (Amplio campo abierto con hordas migratorias)',
    icon: '🎬',
    bannerColor: '#d97706',
    coordinates: '7300 x 12100 (Sudoeste profundo de Rosewood)',
    description: 'Un enorme autocine con aparcamiento para cientos de coches, cabinas de proyección, bar de comida rápida y gasolinera anexa.',
    lootHighlights: [
      'Decenas de vehículos en estado variado para desguazar o reparar (motores, baterías)',
      'Máquinas de palomitas, refrescos y comida chatarra de alta densidad calórica',
      'Surtidores de gasolina lejos del bullicio urbano del centro'
    ],
    recommendedGear: [
      'Kit completo de mecánica: gato hidráulico, llave de cruz y destornillador',
      'Latas de gasolina vacías para ordeñar los depósitos de los coches aparcados'
    ],
    tactics: [
      'Usa las filas de coches como obstáculos para marear y despistar a las hordas que te persigan.',
      'Ideal para subir habilidad de mecánica al desmontar piezas de 30 vehículos seguidos.'
    ]
  },

  // ==========================================
  // 5. LOUISVILLE (La metrópolis apocalíptica)
  // ==========================================
  {
    id: 'louisville-military-checkpoint',
    map: 'Louisville',
    name: 'Punto de Control Militar de la Zona de Exclusión (Checkpoint)',
    tier: 'S+',
    threatLevel: 'Extrema / Letal (Alambradas militares y oleadas de zombis con blindaje)',
    icon: '🪖',
    bannerColor: '#dc2626',
    coordinates: '12550 x 4250 (Entrada Sur de Louisville)',
    description: 'La gran línea de contención erigida por el ejército de EE.UU. antes de la caída de la ciudad. Consta de carpas médicas, barracones, torres con focos y almacenes de armamento pesado.',
    lootHighlights: [
      'Arsenal militar élite: rifles M16, cargadores de 30 balas, silenciadores y visores 8x',
      'Cajas militares llenas de munición 5.56mm y .308',
      'Mochilas militares de asalto (Military Backpack, capacidad 28 con reducción 87%)',
      'Tiendas médicas con bisturís, suturas, antibióticos y desinfectantes en masa'
    ],
    recommendedGear: [
      'Armamento pesado de largo alcance o escopeta con 400+ cartuchos',
      'Camión pesado para llevar los cajones militares enteros',
      'Cizalla o soplete para abrir puertas de alambre de espino'
    ],
    tactics: [
      'Los zombis militares llevan cascos y chalecos antibalas: dispararles al torso hace poco daño, apunta a la cabeza o usa armas contundentes.',
      'Aprovecha las barricadas de hormigón para disparar sin que te rodeen.',
      'Recoge todas las mochilas militares: son el mejor contenedor portátil de todo el juego.'
    ]
  },
  {
    id: 'louisville-grand-ohio-mall',
    map: 'Louisville',
    name: 'El Gran Centro Comercial de Louisville (Grand Ohio Mall)',
    tier: 'S+',
    threatLevel: 'Absoluta / Pesadilla (+5,000 zombis dentro y en el parking)',
    icon: '🏢',
    bannerColor: '#dc2626',
    coordinates: '13300 x 1400 (Noreste de Louisville)',
    description: 'El centro comercial más grande del juego. Tres plantas colosales con más de 80 tiendas, cines, armerías, joyerías, supermercados, ferreterías y restaurantes.',
    lootHighlights: [
      'Cualquier objeto existente en el juego: armería privada, ferretería gigante, farmacia de 3 pisos',
      'Generadores eléctricos de repuesto en los pasillos de servicio y muelles de descarga',
      'Ropa de todas las profesiones y equipo de protección',
      'Comida para abastecer a un clan entero durante años'
    ],
    recommendedGear: [
      'Operación cooperativa o personaje endgame con todas las habilidades al máximo',
      'Múltiples cócteles Molotov y vehículos con sirenas para limpiar el parking antes de entrar',
      'Mascarilla de gas / pañuelo para la toxicidad del aire por descomposición de cadáveres'
    ],
    tactics: [
      'NUNCA entres corriendo por la puerta principal. El eco de los cristales rotos activará a miles de zombis en cascada.',
      'Entra por las escaleras de incendios de la azotea o por los muelles de carga traseros.',
      'Si se produce una estampida en los pasillos interiores de 3 plantas, corre hacia las salidas de emergencia laterales.'
    ]
  },
  {
    id: 'louisville-st-peregrin-hospital',
    map: 'Louisville',
    name: 'Hospital General San Peregrino (St. Peregrin Hospital)',
    tier: 'S',
    threatLevel: 'Extrema (Laberinto vertical de salas de aislamiento y quirófanos)',
    icon: '🏥',
    bannerColor: '#dc2626',
    coordinates: '12800 x 2800 (Centro Hospitalario de Louisville)',
    description: 'El hospital más avanzado de Kentucky. Siete plantas repletas de quirófanos, laboratorios de investigación biológica y almacenes farmacéuticos de alta seguridad.',
    lootHighlights: [
      'El mayor alijo de suministros médicos del juego: morfina, kits de transfusión, antibióticos',
      'Batas y monos biopeligrosos con alta resistencia térmica y desgarros',
      'Ambulancias equipadas con sirenas y material de reanimación en el helipuerto y parking',
      'Equipos de esterilización y material quirúrgico para heridas profundas y fracturas'
    ],
    recommendedGear: [
      'Linterna de cabeza para tener ambas manos libres en las escaleras sin luz',
      'Armas con buen retroceso (escopeta o bate) para frenar cargas en pasillos de 2 metros',
      'Desinfectante y vendas listas en el bolsillo rápido'
    ],
    tactics: [
      'No tomes los ascensores (inertes sin luz). Cada rellano de escaleras puede tener 20-30 zombis médicos esperando en la penumbra.',
      'Marca con tiza o aerosol las puertas de los pisos revisados para no desorientarte en las 7 plantas.'
    ]
  }
];
