// Base de datos de Herramientas de Project Zomboid (Nivel 1 al 20)
// Con detalles de aplicación, métodos de crafteo, nivel requerido y ubicaciones de obtención.

export const TOOLS_DATABASE = [
  // --- NIVEL 1-4: HERRAMIENTAS BÁSICAS DE ARRANQUE ---
  {
    id: 1,
    level: 1,
    name: 'Paleta de mano (Garden Trowel)',
    category: 'Agricultura',
    rarity: 'Común',
    icon: '/items/trowel.png',
    summary: 'Herramienta fundamental de mano para iniciar el cultivo sin sufrir heridas.',
    applications: [
      'Cavar surcos de cultivo individuales (Dig Furrow) en tierra, césped o tejados con sustrato.',
      'Tomar muestras de tierra para examinar o mover a sacos vacíos.',
      'Extracción rápida de raíces y hierbas invasoras en el huerto.',
      'Sirve como arma punzante de corto alcance en casos de emergencia extrema.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Cobertizos de patio y garajes residenciales en Muldraugh, Rosewood y Riverside.',
      'Almacenes de herramientas y viveros de jardinería.',
      'Estanterías de tiendas departamentales y ferreterías.'
    ],
    durabilityTip: 'Tiene buena durabilidad si solo se usa en tierra; no la desgastes combatiendo zombis.'
  },
  {
    id: 2,
    level: 2,
    name: 'Martillo de carpintero (Claw Hammer)',
    category: 'Carpintería',
    rarity: 'Común',
    icon: '/items/hammer.png',
    summary: 'La columna vertebral de la construcción y fortificación de bases.',
    applications: [
      'Construir barricadas en ventanas y puertas con tablas y clavos.',
      'Fabricar compostadores, cajas de almacenamiento, camas y colectores de lluvia.',
      'Desmontar muebles de madera existentes para obtener clavos y tablas gratis.',
      'Arma contundente a una mano rápida con probabilidad de derribo de zombis.'
    ],
    craftable: true,
    craftingRecipe: {
      skill: 'Carpintería Nivel 0 / Básico',
      materials: [
        '1x Rama de árbol o Rama tallada (Tree Branch)',
        '1x Piedra grande o Piedra redondeada (Stone)',
        '1x Trozo de tela rasgada o Cordel (Ripped Sheet / Twine)'
      ],
      output: 'Martillo de piedra (Stone Hammer) - Funciona igual para clavar y construir.'
    },
    whereToFind: [
      'Cajas de herramientas en garajes y maleteros de furgonetas de fontanero.',
      'Almacenes industriales (Warehouses).',
      'Zombis obreros de la construcción vistiendo chaleco reflectante.'
    ],
    durabilityTip: 'El martillo de carpintero es prácticamente indestructible en carpintería normal.'
  },
  {
    id: 3,
    level: 3,
    name: 'Pala de mano / Pala grande (Shovel)',
    category: 'Agricultura / Tierra',
    rarity: 'Común',
    icon: '/items/shovel.png',
    summary: 'Herramienta pesada para mover grandes volúmenes de tierra y arar a velocidad.',
    applications: [
      'Cavar surcos de cultivo de manera dos veces más veloz que la paleta.',
      'Llenar sacos de arena y sacos de tierra fértil (Take Dirt / Sand) para transportarla.',
      'Enterrar zombis caídos en fosas comunes (Grave Digging) para evitar enfermedades por fetidez.',
      'Arma a dos manos contundente con excelente alcance de empuje.'
    ],
    craftable: true,
    craftingRecipe: {
      skill: 'Supervivencia / Fabricación Básica',
      materials: [
        '1x Tablón o Rama larga de árbol (Plank / Sturdy Stick)',
        '1x Cuchillo para tallar (Hunting Knife o Stone Knife)',
        '1x Cordel o sábana rasgada'
      ],
      output: 'Pala de madera improvisada (Wooden Shovel).'
    },
    whereToFind: [
      'Cobertizos traseros, almacenes de jardinería y obras de construcción.',
      'Camionetas pickup de jardineros.',
      'Almacén grande al norte de Muldraugh.'
    ],
    durabilityTip: 'Equípala a dos manos para no sobrecargar el torso ni la espalda al transportar tierra.'
  },
  {
    id: 4,
    level: 4,
    name: 'Hacha de piedra / Hacha de tala (Stone Axe / Axe)',
    category: 'Tala y Supervivencia',
    rarity: 'Fabricable / Media',
    icon: '/items/StoneAxe.png',
    summary: 'Herramienta vital para abastecimiento continuo de madera, combustible y postes.',
    applications: [
      'Talar árboles para obtener troncos (Logs) que luego se convierten en tablas.',
      'Derribar puertas bloqueadas sin gastar ganzúas ni munición.',
      'Una de las mejores armas de filo del juego gracias al multiplicador de daño de hachas.'
    ],
    craftable: true,
    craftingRecipe: {
      skill: 'Supervivencia Nivel 0',
      materials: [
        '1x Rama de árbol (Tree Branch)',
        '1x Piedra afilada (Chipped Stone - conseguida forrajeando)',
        '1x Cordel, Ripped Sheet o Enredadera'
      ],
      output: 'Hacha de piedra (Stone Axe) 100% renovable sin pisar ciudades.'
    },
    whereToFind: [
      'Hachas industriales en estaciones de bomberos (Fire Station de Rosewood).',
      'Campamentos de leñadores y almacenes forestales.',
      'Zombis con hachas clavadas en la espalda.'
    ],
    durabilityTip: 'Si subes el nivel de Mantenimiento (Maintenance), las hachas te durarán el triple de talas.'
  },

  // --- NIVEL 5-8: PROVISIÓN Y GESTIÓN HÍDRICA ---
  {
    id: 5,
    level: 5,
    name: 'Regadera de jardín (Watering Can)',
    category: 'Agricultura / Riego',
    rarity: 'Común',
    icon: '/items/watering_can.png',
    summary: 'El contenedor de transporte de agua más ergonómico para huertos grandes.',
    applications: [
      'Almacenar hasta 40 unidades de agua en un solo viaje.',
      'Hidratar parcelas de hortalizas con calibración exacta de mililitros.',
      'Recoger agua de lluvia limpia de barriles recolectores sin derramar líquido.',
      'Extinguir pequeños fuegos accidentales de fogatas.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Centros de jardinería (Gardening Stores) en Riverside y Louisville.',
      'Garajes y cobertizos de suburbios residenciales.',
      'Invernaderos en granjas rurales al sur de Kentucky.'
    ],
    durabilityTip: 'No sufre desgaste por uso. Si no encuentras una, sustitúyela provisionalmente por cubos de pintura limpios o cacerolas.'
  },
  {
    id: 6,
    level: 6,
    name: 'Rastrillo de jardinería (Garden Rake)',
    category: 'Agricultura / Terreno',
    rarity: 'Poco común',
    icon: '/items/rake.png',
    summary: 'Limpieza de terrenos y acondicionamiento rápido de biomas para cultivo.',
    applications: [
      'Limpiar arbustos, maleza y hierba alta que bloquean la visión y atraen plagas.',
      'Nivelar áreas de cultivo antes de tirar semillas.',
      'Arma con alcance tipo lanza con empuje a distancia segura.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Almacenes agrícolas y tiendas de bricolaje.',
      'Cobertizos rurales en fincas ganaderas.',
      'Tiendas de suministros de huertos en West Point.'
    ],
    durabilityTip: 'Excelente para crear cortafuegos limpios alrededor de tu granja despejando la hierba seca.'
  },
  {
    id: 7,
    level: 7,
    name: 'Sierra de mano (Hand Saw / Garden Saw)',
    category: 'Carpintería',
    rarity: 'Común',
    icon: '/items/GardenSaw.png',
    summary: 'La herramienta que multiplica x3 tus materiales de construcción.',
    applications: [
      'Serrar troncos talados para convertirlos en 3 tablas de madera (Planks) por tronco.',
      'Serrar escopetas para acortar el cañón y aumentar el cono de dispersión.',
      'Fabricar mangos de herramientas y lanzas de madera afiladas.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Cajas de herramientas en garajes y cocheras.',
      'Ferreterías (Hardware Stores) en todas las ciudades principales.',
      'Zombis obreros y maleteros de camionetas de reparto.'
    ],
    durabilityTip: 'No la uses jamás como arma; es una herramienta crítica que no se puede craftear desde cero en early game.'
  },
  {
    id: 8,
    level: 8,
    name: 'Cuchillo de supervivencia / Caza (Hunting Knife)',
    category: 'Supervivencia / Procesado',
    rarity: 'Común',
    icon: '/items/HuntingKnife.png',
    summary: 'La navaja multiusos indispensable para forrajeo, corte y crafteo fino.',
    applications: [
      'Desollar y destazar conejos, aves, ciervos y pescado.',
      'Tallar ramas largas para crear lanzas de combate y palos afilados.',
      'Cortar ropa y sábanas para conseguir tiras de tela esterilizables.',
      'Ataque sigiloso letal de mandíbula por la espalda a zombis aislados.'
    ],
    craftable: true,
    craftingRecipe: {
      skill: 'Supervivencia Nivel 0',
      materials: [
        '1x Rama de árbol pequeña',
        '1x Piedra afilada (Chipped Stone)',
        '1x Trozo de tela o cordón'
      ],
      output: 'Cuchillo de piedra (Stone Knife).'
    },
    whereToFind: [
      'Cajones de cocina, tiendas de caza y armerías (Gun shops).',
      'Bolsillos de supervivientes caídos y mochilas de excursionista.',
      'Zombis clavados con cuchillos en el cuerpo.'
    ],
    durabilityTip: 'Lleva siempre una piedra de afilar o fabrica réplicas de piedra para reservar el de acero para carnicería.'
  },

  // --- NIVEL 9-12: MECÁNICA, CONTENEDORES Y RECOLECCIÓN ---
  {
    id: 9,
    level: 9,
    name: 'Destornillador (Screwdriver)',
    category: 'Mecánica / Eléctrica',
    rarity: 'Común',
    icon: '/items/Screwdriver.png',
    summary: 'La llave de paso para desmontar tecnología, radios y componentes de autos.',
    applications: [
      'Instalar y desinstalar baterías, faros, radios y frenos en vehículos.',
      'Desmontar televisores, radios y relojes para subir Electricidad y conseguir cables.',
      'Colocar cerraduras y manijas en puertas fabricadas artesanalmente.',
      'Arma punzante de ataque crítico rápido a corta distancia.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Cajas de herramientas, talleres mecánicos y gasolineras.',
      'Cajones de mesas de noche y escritorios domésticos.',
      'Guanteras de vehículos abandonados.'
    ],
    durabilityTip: 'Casi inmune al desgaste en tareas mecánicas y eléctricas; imprescindible en la riñonera.'
  },
  {
    id: 10,
    level: 10,
    name: 'Cubo de agua metálico / Plástico (Bucket)',
    category: 'Recolección / Hidráulica',
    rarity: 'Común',
    icon: '/items/bucket.png',
    summary: 'Contenedor de gran volumen para mezclas, yeso, agua y limpieza de ganado.',
    applications: [
      'Transportar hasta 25 unidades de agua desde ríos y pozos a los bebederos de animales.',
      'Mezclar yeso en polvo (Plaster) con agua para pintar y reforzar paredes de madera.',
      'Dejar al aire libre para que recoja lluvia de forma pasiva sin necesidad de barril.',
      'Limpiar sangre y vísceras con lejía para evitar estrés e infecciones en el refugio.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Almacenes de pintura y reformas domésticas.',
      'Zonas de lavado de granjas y fábricas.',
      'Cuartos de servicio y lavanderías industriales.'
    ],
    durabilityTip: 'Se puede vaciar y llenar ilimitadamente; ideal para colocar varios alineados antes de una tormenta.'
  },
  {
    id: 11,
    level: 11,
    name: 'Cizallas y Tijeras de Podar (Scissors / Garden Shears)',
    category: 'Agricultura / Ganadería',
    rarity: 'Poco común',
    icon: '/items/scissors.png',
    summary: 'Cuidado sanitario de plantas, esquilado y recolección limpia de semillas.',
    applications: [
      'Cortar ramas infectadas por moho o insectos antes de que arruinen el surco contiguo.',
      'Esquilar lana en ovejas vivas en la actualización B42 sin lastimar al animal.',
      'Cortar telas de algodón para fabricar vendas estériles de grado médico.',
      'Cosechar flores y hierbas medicinales sin aplastar las raíces regenerativas.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Salones de peluquería, escuelas y oficinas (tijeras clásicas).',
      'Centros de jardinería y floristerías (cizallas de podar).',
      'Granjas ganaderas en establos de ovejas.'
    ],
    durabilityTip: 'Mantén un par exclusivo en el botiquín médico y otro en el granero de animales.'
  },
  {
    id: 12,
    level: 12,
    name: 'Palanca de demolición (Crowbar)',
    category: 'Incursión / Mantenimiento',
    rarity: 'Poco común',
    icon: '/items/Crowbar.png',
    summary: 'La reina indiscutible del entrenamiento de Mantenimiento y apertura táctica.',
    applications: [
      'Retirar tablas de barricadas intactas para reutilizarlas en tu base.',
      'Levantar tablones del suelo y adoquines sin romperlos.',
      'El arma de combate con mayor durabilidad del juego: sube exponencialmente la habilidad de Mantenimiento.',
      'Abrir ventanas y puertas trabadas sin romper cristales ruidosos.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Almacenes industriales de Muldraugh y almacén de autopistas de West Point.',
      'Maleteros de coches patrulla de policía y camionetas de obras.',
      'Ferreterías.'
    ],
    durabilityTip: 'Una sola palanca en buen estado puede resistir más de 1.000 golpes a zombis antes de quebrarse.'
  },

  // --- NIVEL 13-16: FONTANERÍA, METALES Y PROTECCIÓN PESADA ---
  {
    id: 13,
    level: 13,
    name: 'Llave de tubo / Grifa (Pipe Wrench)',
    category: 'Fontanería',
    rarity: 'Poco común',
    icon: '/items/pipe_wrench.png',
    summary: 'La llave maestra para automatizar el agua infinita y purificada.',
    applications: [
      'Conectar grifos, lavabos y duchas a barriles de lluvia del piso superior (Plumb Sink).',
      'Desinstalar y reubicar fregaderos de casas saqueadas a tu refugio principal.',
      'Desconectar bañeras para usarlas como reservorios estáticos de agua potable.',
      'Arma contundente a una mano de gran contundencia de impacto.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Furgonetas de fontanería rotuladas en calles y garajes residenciales.',
      'Grandes almacenes de suministros industriales.',
      'Estanterías de fontanería en tiendas de mejoras del hogar.'
    ],
    durabilityTip: 'No se desgasta en operaciones de fontanería. Asegúrate de tener al menos una guardada bajo llave.'
  },
  {
    id: 14,
    level: 14,
    name: 'Horca de jardín (Garden Fork)',
    category: 'Agricultura / Forrajeo',
    rarity: 'Poco común',
    icon: '/items/GardenFork.png',
    summary: 'Mover paja, airear compost y defender perímetros con alcance de lanza.',
    applications: [
      'Airear la materia orgánica en la compostera para acelerar la descomposición un 20%.',
      'Transportar gavillas de paja seca para la cama del establo de vacas y gallinas.',
      'Cavar surcos en suelo blando sin doblarte la cintura.',
      'Arma tipo lanza con altísima probabilidad de golpe crítico de perforación.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Graneros y establos de la campiña de Kentucky.',
      'Centros de equitación y cooperativas agrarias.',
      'Cobertizos rústicos.'
    ],
    durabilityTip: 'Su punta de metal tiene buena resistencia, pero al usarse como lanza se desgasta más rápido; resérvala para tareas rurales.'
  },
  {
    id: 15,
    level: 15,
    name: 'Soplete de propano y Máscara de soldador (Blowtorch & Welder Mask)',
    category: 'Metalistería',
    rarity: 'Rara',
    icon: '/items/BlowTorch.png',
    summary: 'La tecnología para erigir defensas de acero indestructibles contra hordas.',
    applications: [
      'Soldar barras metálicas en ventanas y vallas de seguridad de alta durabilidad.',
      'Desmantelar coches destrozados que bloquean carreteras para obtener chatarra y láminas.',
      'Fabricar estanterías metálicas, cajas fuertes y puertas de reja de acero.',
      'Reparar el capó, maletero y chasis de tus vehículos.'
    ],
    craftable: false,
    craftingRecipe: {
      skill: 'Metalistería Nivel 1 a 6 + Revista "The Metalwork Magazine"',
      materials: [
        'Soplete de propano con carga',
        'Máscara de soldador equipada',
        'Electrodos de soldadura (Welding Rods)',
        'Láminas de metal y chatarra'
      ],
      output: 'Estructuras de metal de resistencia muy superior a la madera.'
    },
    whereToFind: [
      'Talleres mecánicos industriales y fábricas siderúrgicas.',
      'Estaciones de tren y desguaces de coches.',
      'Almacenes de gas propano.'
    ],
    durabilityTip: 'El soplete consume gas propano por uso; recárgalo conectándolo a bombonas de propano grandes que encuentres en barbacoas.'
  },
  {
    id: 16,
    level: 16,
    name: 'Mazo pesado de demolición (Sledgehammer)',
    category: 'Demolición / Táctica',
    rarity: 'Muy Rara (Santo Grial)',
    icon: '/items/Sledgehammer.png',
    summary: 'La única herramienta capaz de derribar paredes de ladrillo, escaleras y verjas.',
    applications: [
      'Demoler paredes existentes para expandir tu base o crear vías de escape interiores.',
      'Destruir escaleras hacia un segundo piso para crear un refugio 100% inmune a zombis (accesible solo con cuerdas de escape).',
      'Romper las verjas de seguridad reforzadas de armerías como la de West Point.',
      'Eliminar estructuras mal construidas en un solo golpe.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Eventos de obras viales en medio de carreteras (alrededor de camionetas con conos y alcantarillas).',
      'Almacenes de herramientas en polígonos industriales.',
      'Cajas de herramientas en garajes y maleteros de camionetas de construcción.'
    ],
    durabilityTip: 'Prácticamente irrompible. Es uno de los ítems más codiciados del juego; si encuentras uno, márcalo en el mapa de inmediato.'
  },

  // --- NIVEL 17-20: MAESTRÍA SUPREMA, B42 Y AUTOSUFICIENCIA ---
  {
    id: 17,
    level: 17,
    name: 'Pulverizador agrícola y Curas (Garden Spray Can)',
    category: 'Sanidad Vegetal',
    rarity: 'Poco común',
    icon: '/items/watering_can.png',
    summary: 'El dispensador de tratamientos químicos y orgánicos para salvar cosechas enteras.',
    applications: [
      'Fumigar contra pulgones (Aphids) usando la mezcla casera de Agua + Cigarrillos.',
      'Tratar el mildiu y hongos foliares con la solución de Agua + Leche en el pulverizador.',
      'Prevenir la pérdida de cosechas maduras cuando la humedad ambiental dispara las esporas.'
    ],
    craftable: true,
    craftingRecipe: {
      skill: 'Agricultura (Lectura de Guía de Jardinería previa)',
      materials: [
        '1x Bote pulverizador vacío (Garden Spray Can)',
        'Para pulgón: 50x Cigarrillos desmenuzados + Agua',
        'Para hongos: 1x Brik de leche fresca/podrida + Agua'
      ],
      output: 'Insecticida o Fungicida casero 100% efectivo.'
    },
    whereToFind: [
      'Tiendas de botánica y suministros agrícolas.',
      'Cobertizos traseros con maceteros.',
      'Casas rurales de granjeros.'
    ],
    durabilityTip: 'Límpialo tras usarlo para no confundir mezclas fungicidas con agua de riego.'
  },
  {
    id: 18,
    level: 18,
    name: 'Aguja de coser y Hilo quirúrgico (Needle & Thread)',
    category: 'Sastrería / Armadura',
    rarity: 'Común',
    icon: '/items/Needle.png',
    summary: 'La sastrería avanzada te convierte en un tanque inmune a mordeduras.',
    applications: [
      'Coser parches de cuero (Leather Patches) en chaquetas y pantalones para alcanzar 100% protección contra mordidas.',
      'Cerrar heridas profundas y laceraciones (Suture Needle) tras accidentes con cristales o ramas.',
      'Reparar agujeros en mochilas militares para restaurar su capacidad de carga completa.',
      'Fabricar sacos y filtros para sistemas de secado de semillas.'
    ],
    craftable: false,
    craftingRecipe: null,
    whereToFind: [
      'Costureros domésticos en dormitorios y armarios residenciales.',
      'Ambulancias, hospitales y clínicas médicas (agujas quirúrgicas).',
      'Tiendas de ropa y mercerías.'
    ],
    durabilityTip: 'Una sola aguja no se gasta nunca; el recurso que debes acumular como oro es el hilo (Thread).'
  },
  {
    id: 19,
    level: 19,
    name: 'Jaulas trampa y Cuerdas ganaderas (Cage Trap & Ropes)',
    category: 'Caza / Ganadería B42',
    rarity: 'Fabricable',
    icon: '/items/rope.png',
    summary: 'Captura de proteína viva, conejos, aves y manejo de rebaños sin disparar un tiro.',
    applications: [
      'Colocar trampas de jaula con zanahorias o repollos a más de 75 casillas de tu base para cazar conejos.',
      'Atar y guiar ganado ovino, vacuno y porcino en la Build 42 hasta los corrales seguros.',
      'Amarrar troncos de árboles en paquetes de 4 (Log Stacks) reduciendo su peso drásticamente para transportarlos.',
      'Fabricar cuerdas de escape en ventanas de pisos altos.'
    ],
    craftable: true,
    craftingRecipe: {
      skill: 'Trampeo Nivel 1 a 3 + Carpintería',
      materials: [
        'Cajas de trampa: 3x Tablas de madera + 4x Clavos + Sierra + Martillo',
        'Jaula de alambre: 1x Malla de alambre (Wire) + Alicates'
      ],
      output: 'Trampas pasivas de caza limpia y autosuficiente.'
    },
    whereToFind: [
      'Cuerdas en ferreterías, maleteros y almacenes forestales.',
      'Trampas en cabañas de cazadores en lo profundo del bosque.'
    ],
    durabilityTip: 'Revisa las trampas antes del amanecer para evitar que los animales capturados se pudran o atraigan depredadores.'
  },
  {
    id: 20,
    level: 20,
    name: 'Mortero y Maja / Piedra de molienda (Mortar & Pestle)',
    category: 'Alquimia / Medicina B42',
    rarity: 'Fabricable / Rara',
    icon: '/items/HandScythe.png',
    summary: 'La cúspide de la autosuficiencia: medicina herbal, tinturas y procesado de harina.',
    applications: [
      'Triturar hierbas silvestres (Black Sage, Ginseng, Plantain) para crear cataplasmas medicinales curativas.',
      'Moler granos de trigo cosechados en el huerto para fabricar harina y hornear pan infinito.',
      'Procesar cal viva y minerales para mezclas de forja en el nuevo árbol de artesanía de B42.',
      'Elaborar conservas y extractos antisépticos cuando los medicamentos de farmacia se agoten en el mundo.'
    ],
    craftable: true,
    craftingRecipe: {
      skill: 'Carpintería o Alfarería Nivel 2',
      materials: [
        'Opción madera: 1x Tablón de madera suave + 1x Cuchillo para tallar',
        'Opción piedra/barro: Arcilla moldeada cocida en horno rústico'
      ],
      output: 'Mortero y mano de molienda tradicional.'
    },
    whereToFind: [
      'Laboratorios médicos y farmacias en West Point y Louisville.',
      'Herboristerías y tiendas naturistas.',
      'Cabañas rurales aisladas de ancianos en el campo.'
    ],
    durabilityTip: 'Una herramienta eterna que te independiza al 100% del suministro farmacéutico moderno.'
  }
];
