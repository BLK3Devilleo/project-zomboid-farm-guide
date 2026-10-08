// Base de datos de niveles con rutas a texturas e iconos oficiales de Project Zomboid

export const LEVELS = [
  // FASE 1: PREPARACIÓN DEL TERRENO Y AGUA
  {
    id: 1,
    stage: 'fase1',
    number: 1,
    title: 'El Suelo Perfecto y Cómo Cavar',
    tagline: 'Preparar la tierra sin lastimarte las manos',
    categoryIcon: '/spiffo/category_farming.png',
    spiffoBanner: '/spiffo/spiffo_farming.png',
    requiredGear: [
      { name: 'Paleta de mano (Trowel)', img: '/items/trowel.png', desc: 'Indispensable para arar sin cortarte las manos.' },
      { name: 'Pala grande (Shovel)', img: '/items/shovel.png', desc: 'Cava más rápido y toma tierra en sacos.' },
      { name: 'Saco vacío (Sandbag / Sack)', img: '/items/sandbag.png', desc: 'Para transportar tierra fértil a tu base o tejado.' },
      { name: 'Rastrillo (Rake)', img: '/items/rake.png', desc: 'Limpia maleza y prepara el terreno.' }
    ],
    whereToFind: 'Cobertizos de jardín, almacenes de herramientas (warehouses) y garajes residenciales.',
    howToGetSoil: 'Busca manchas de tierra oscura y húmeda en zonas boscosas o césped natural lejos del asfalto. Con una pala y sacos vacíos, haz clic derecho en el suelo y selecciona "Tomar tierra". Podrás vaciarla en tejados seguros o patios fortificados donde los zombis no pisen tus cultivos.',
    steps: [
      'Equipa la paleta o pala en ambas manos.',
      'Haz clic derecho en la tierra y selecciona "Jardinería" -> "Cavar surco" (Dig Furrow).',
      'Cava líneas de surcos separadas por al menos 1 casilla de espacio entre ellas para evitar que las plagas se contagien si una planta enferma.'
    ],
    proTip: '¡Nunca caves con las manos desnudas! Te provocarás cortes profundos en las manos que te impedirán usar armas o herramientas durante días.',
    quiz: {
      question: '¿Por qué se deben dejar casillas vacías de espacio entre hileras de cultivos?',
      options: [
        'Para evitar que las plagas u hongos pasen de una planta a otra y destruyan todo el huerto.',
        'Porque las plantas se pelean entre sí por la noche.',
        'Para que los zombis puedan caminar cómodamente.'
      ],
      correct: 0,
      reward: '¡Desbloqueado! Ahora sabes cómo planificar un huerto seguro contra plagas.'
    }
  },
  {
    id: 2,
    stage: 'fase1',
    number: 2,
    title: 'La Fábrica de Abono (Compost)',
    tagline: 'Crear súper tierra con comida podrida',
    categoryIcon: '/spiffo/category_cleaning.png',
    spiffoBanner: '/spiffo/spiffo_cleaning.png',
    requiredGear: [
      { name: 'Martillo (Hammer)', img: '/items/hammer.png', desc: 'Herramienta básica de carpintería.' },
      { name: 'Clavos (Nails x4)', img: '/items/nails.png', desc: 'Para unir las tablas de la compostera.' },
      { name: 'Tablas de madera (Planks x5)', img: '/items/plank.png', desc: 'Estructura del cajón de compost.' },
      { name: 'Saco de abono (Compost Bag)', img: '/items/compost_bag.png', desc: 'Para retirar el abono listo.' }
    ],
    whereToFind: 'Tablas talando árboles con hacha o desmontando muebles; clavos en cajas en garajes y ferreterías.',
    howToGetSoil: 'El compostador (Composter) transforma basura biológica en fertilizante puro. Cuando el medidor llegue al 100%, usa un saco vacío en el compostador para recoger "Tierra compostada" rica en nitrógeno que acelera el crecimiento de tus plantas.',
    steps: [
      'Alcanza nivel 2 de Carpintería y lee el manual si no tienes la receta.',
      'Construye el Compostador en una esquina protegida de tu huerto.',
      'Mete toda la comida fresca que se haya echado a perder. En unas 2 a 3 semanas del juego tendrás abono de máxima calidad.'
    ],
    proTip: 'No metas carnes ni pescados podridos en el compostador en la vida real porque atraen ratas y moscas; en el juego usa restos vegetales para máxima eficiencia.',
    quiz: {
      question: '¿Qué herramienta necesitas para retirar el abono listo de la compostera?',
      options: [
        'Un saco vacío (Sack / Sandbag).',
        'Una sartén de cocina.',
        'Una linterna.'
      ],
      correct: 0,
      reward: '¡Abono dominado! Tus cosechas crecerán hasta un 25% más rápido con este fertilizante.'
    }
  },
  {
    id: 3,
    stage: 'fase1',
    number: 3,
    title: 'Agua Infinita: Colectores y Riego',
    tagline: 'Sobrevivir al corte de agua del grifo',
    categoryIcon: '/spiffo/category_weather.png',
    spiffoBanner: '/spiffo/spiffo_weather.png',
    requiredGear: [
      { name: 'Bolsas de basura (Garbage Bags x4)', img: '/items/garbage_bag.png', desc: 'Impermeabilizan el barril recolector.' },
      { name: 'Regadera de jardín (Watering Can)', img: '/items/watering_can.png', desc: 'Capacidad de 40 unidades de agua para regar rápido.' },
      { name: 'Cubo de agua (Bucket)', img: '/items/bucket.png', desc: 'Gran depósito portátil para trasladar agua.' },
      { name: 'Tablas y Clavos', img: '/items/plank.png', desc: 'Estructura del barril de lluvia.' }
    ],
    whereToFind: 'Bolsas de basura en botes y contenedores; regaderas en cobertizos y floristerías.',
    howToGetSoil: 'El agua del grifo se corta entre el día 1 y 30. Si no tienes colectores de lluvia antes del corte, tendrás que acarrear cubos pesados desde lagos o ríos peligrosos. Construye varios barriles directamente al lado de tus bancales de siembra.',
    steps: [
      'Sube nivel de carpintería para desbloquear el Barril Colector de Lluvia.',
      'Construye 2 o 3 barriles al aire libre, sin techos por encima.',
      'Usa la regadera para hidratar cada casilla de cultivo hasta que el nivel de agua esté en su rango óptimo.'
    ],
    proTip: 'El agua de lluvia sin hervir es peligrosa para que la beba tu personaje, pero para las plantas es perfecta y contiene minerales naturales.',
    quiz: {
      question: '¿Qué recipiente es el más eficiente y cómodo para regar muchas casillas de huerto?',
      options: [
        'La regadera de jardinería (Watering Can) por su gran capacidad.',
        'Un vaso de cristal pequeño.',
        'Una cuchara de sopa.'
      ],
      correct: 0,
      reward: '¡Sistema hídrico listo! Tus plantas nunca pasarán sed tras el corte de suministros.'
    }
  },
  {
    id: 4,
    stage: 'fase1',
    number: 4,
    title: 'El Paquete de Semillas y la Siembra',
    tagline: 'Cómo abrir paquetes y sembrar la primera semilla',
    categoryIcon: '/spiffo/category_farming.png',
    spiffoBanner: '/spiffo/spiffo_farming.png',
    requiredGear: [
      { name: 'Semillas (Seeds Packet)', img: '/items/seeds.png', desc: 'Patata, Zanahoria, Tomate, Repollo, etc.' },
      { name: 'Tijeras o cuchillo', img: '/items/scissors.png', desc: 'Para abrir el paquete sellado de semillas.' },
      { name: 'Paleta de mano (Trowel)', img: '/items/trowel.png', desc: 'Para cavar el surco receptor.' }
    ],
    whereToFind: 'Estanterías de tiendas agrícolas, floristerías, armarios de garaje y cobertizos.',
    howToGetSoil: 'Un paquete cerrado no se puede sembrar directamente. Tienes que hacer clic derecho sobre el paquete en tu inventario y darle a "Abrir paquete de semillas" para obtener las semillas sueltas.',
    steps: [
      'Abre el paquete de semillas en tu inventario.',
      'Haz clic derecho sobre un surco de tierra ya cavado.',
      'Selecciona "Sembrar" (Sow Seeds) y elige la variedad deseada.',
      'Inmediatamente después de sembrar, riega el surco con la regadera.'
    ],
    proTip: 'Cada casilla de siembra suele consumir entre 2 y 4 semillas. No gastes todas tus semillas en una sola tanda; guarda siempre una reserva de emergencia.',
    quiz: {
      question: '¿Qué paso obligatorio debes hacer con un paquete de semillas nuevo antes de poder sembrarlo en la tierra?',
      options: [
        'Hacer clic derecho y abrir el paquete para sacar las semillas sueltas.',
        'Tirarlo al fuego para calentarlo.',
        'Enterrar el paquete entero cerrado bajo una roca.'
      ],
      correct: 0,
      reward: '¡Sembrado exitoso! Tus primeros brotes aparecerán en pocos días.'
    }
  },
  {
    id: 5,
    stage: 'fase1',
    number: 5,
    title: 'El Medidor de Hidratación de la Planta',
    tagline: 'Cuánta agua necesita cada tipo de verdura',
    categoryIcon: '/spiffo/category_farming.png',
    spiffoBanner: '/spiffo/spiffo_foraging.png',
    requiredGear: [
      { name: 'Regadera con agua', img: '/items/watering_can.png', desc: 'Para calibrar los niveles de hidratación.' },
      { name: 'Paleta de mano', img: '/items/trowel.png', desc: 'Para comprobar la textura del sustrato.' }
    ],
    whereToFind: 'La ficha se consulta en cualquier momento haciendo clic derecho sobre el cultivo -> "Información de la planta".',
    howToGetSoil: 'No todas las plantas beben igual: las patatas son resistentes y toleran menos agua; las zanahorias mueren si llueve demasiado; las coles beben enormes cantidades de agua para crecer rápido.',
    steps: [
      'Abre la ficha de la planta todos los días temprano en la mañana.',
      'Observa la barra de agua: si baja de 65, añade agua de inmediato.',
      'Si un cultivo requiere poca agua y la temporada es muy lluviosa, protégelo construyendo un techo alto sobre los surcos.'
    ],
    proTip: 'A mayor nivel de habilidad en Agricultura de tu personaje, más detallada y precisa será la información de salud y agua que verás en la ficha.',
    quiz: {
      question: '¿Qué pasa si un cultivo como la zanahoria recibe un exceso brutal de agua constante?',
      options: [
        'Se ahoga y empieza a perder puntos de salud hasta morir por pudrición de raíz.',
        'Se convierte en un árbol gigante.',
        'Produce zanahorias doradas instantáneamente.'
      ],
      correct: 0,
      reward: '¡Control de riego dominado! Ya sabes balancear la sed de cada cultivo.'
    }
  },

  // FASE 2: CULTIVOS Y COSECHA
  {
    id: 6,
    stage: 'fase2',
    number: 6,
    title: 'La Patata: El Cultivo Supremo de Supervivencia',
    tagline: 'Calorías seguras que no se pudren rápido',
    categoryIcon: '/spiffo/category_food_and_water.png',
    spiffoBanner: '/spiffo/spiffo_food.png',
    requiredGear: [
      { name: 'Patata (Potato)', img: '/items/potato.png', desc: 'El tubérculo más duradero de la despensa.' },
      { name: 'Semillas de Patata', img: '/items/seeds.png', desc: 'Para plantar en surcos arados.' },
      { name: 'Paleta y Regadera', img: '/items/trowel.png', desc: 'Equipo de mantenimiento diario.' }
    ],
    whereToFind: 'Tiendas de ultramarinos y almacenes de jardinería.',
    howToGetSoil: 'La patata es la reina de Project Zomboid porque aguanta sequías moderadas y, una vez cosechada, tarda semanas en pudrirse en la despensa sin necesidad de nevera.',
    steps: [
      'Siembra patatas en bloques de 4 surcos aislados.',
      'Mantenlas entre 65 y 85 de agua.',
      'Tarda unos 26 a 30 días en madurar completamente: ten paciencia y no la arranques antes de tiempo.'
    ],
    proTip: 'Es el cultivo ideal para almacenar en almacenes antes de que llegue el frío invierno.',
    quiz: {
      question: '¿Cuál es la mayor ventaja de la patata frente a verduras como el rábano o repollo?',
      options: [
        'Tarda muchísimo más tiempo en descomponerse y pudrirse en la despensa.',
        'Se puede usar como munición de escopeta.',
        'Hace que corras el doble de rápido.'
      ],
      correct: 0,
      reward: '¡Patatas aseguradas! Tu reserva calórica para el invierno está en marcha.'
    }
  },
  {
    id: 7,
    stage: 'fase2',
    number: 7,
    title: 'El Repollo: Crecimiento Ulrarrápido',
    tagline: 'Comida de emergencia en menos de dos semanas',
    categoryIcon: '/spiffo/category_food_and_water.png',
    spiffoBanner: '/spiffo/spiffo_food.png',
    requiredGear: [
      { name: 'Repollo / Col (Cabbage)', img: '/items/cabbage.png', desc: 'Crecimiento récord de 12 a 14 días.' },
      { name: 'Semillas de Repollo', img: '/items/seeds.png', desc: 'Alta tasa de germinación.' },
      { name: 'Barril de lluvia lleno', img: '/items/watering_can.png', desc: 'Exige abundante agua constante.' }
    ],
    whereToFind: 'Cocinas de casas rurales y floristerías.',
    howToGetSoil: 'El repollo crece en solo 12 a 14 días si nunca le falta agua. Es perfecto cuando te estás quedando sin comida enlatada y necesitas verduras frescas urgentemente.',
    steps: [
      'Siembra repollos cuando necesites aporte de comida inmediato.',
      'Revisa su agua a diario: requiere niveles altos (alrededor de 85 a 100 de hidratación).',
      'Cosecha inmediatamente cuando madure, porque se pudre rápido una vez recolectado.'
    ],
    proTip: 'El repollo es excelente también como cebo en trampas de madera para cazar conejos salvajes.',
    quiz: {
      question: '¿Cuánto tarda aproximadamente en crecer un repollo con riego óptimo?',
      options: [
        'Alrededor de 12 a 14 días (el más rápido).',
        'Seis meses enteros.',
        'Dos horas del juego.'
      ],
      correct: 0,
      reward: '¡Velocidad de cosecha dominada! Salvaste a tu personaje de la inanición.'
    }
  },
  {
    id: 8,
    stage: 'fase2',
    number: 8,
    title: 'Zanahorias y Tomates: Vitaminas y Trampas',
    tagline: 'Diversificación de nutrientes y caza menor',
    categoryIcon: '/spiffo/category_farming.png',
    spiffoBanner: '/spiffo/spiffo_farming.png',
    requiredGear: [
      { name: 'Zanahoria (Carrot)', img: '/items/carrot.png', desc: 'Excelente cebo de conejos; sensible al exceso de agua.' },
      { name: 'Tomate (Tomato)', img: '/items/tomato.png', desc: 'Aporte de agua y saciedad para guisos.' },
      { name: 'Pulverizador de plantas', img: '/items/watering_can.png', desc: 'Para controlar plagas de insectos.' }
    ],
    whereToFind: 'Tiendas de semillas y huertos de granjas ya sembrados.',
    howToGetSoil: 'Las zanahorias necesitan drenaje perfecto: si llueve fuerte por días continuos, cúbrelas. Los tomates requieren sol continuo y soporte para que sus ramas cargadas de frutos no toquen el barro.',
    steps: [
      'Planta zanahorias en zonas protegidas de lluvias torrenciales.',
      'Usa las zanahorias cosechadas para armar trampas para animales silvestres.',
      'Cocina los tomates en cazuelas con carne para maximizar los puntos de reducción de hambre y tristeza.'
    ],
    proTip: 'Las zanahorias son el cebo favorito de los conejos en la Build 42; combinarlas con trampas te dará carne fresca continua.',
    quiz: {
      question: '¿Por qué la zanahoria es tan valiosa además de como alimento directo?',
      options: [
        'Porque es el cebo más efectivo para atrapar conejos en trampas de caza.',
        'Porque te permite ver en la oscuridad total sin linterna.',
        'Porque ahuyenta a los zombis por el olor.'
      ],
      correct: 0,
      reward: '¡Cadena trófica dominada! Ahora conectas agricultura con cacería.'
    }
  },
  {
    id: 9,
    stage: 'fase2',
    number: 9,
    title: 'Cosecha con Semillas: El Ciclo Infinito',
    tagline: 'Cómo no quedarte nunca sin semillas',
    categoryIcon: '/spiffo/category_foraging_mining.png',
    spiffoBanner: '/spiffo/spiffo_foraging.png',
    requiredGear: [
      { name: 'Semillas cosechadas', img: '/items/seeds.png', desc: 'El tesoro genético de tu huerto.' },
      { name: 'Sacos o cajas de madera', img: '/items/sandbag.png', desc: 'Almacenar reservas secas.' }
    ],
    whereToFind: 'El propio cultivo en su última fase biológica.',
    howToGetSoil: 'Cada planta tiene fases de crecimiento. Si la cosechas en "Lista para cosechar" obtienes solo verduras. Pero si esperas un par de días más, entrará en la fase "Cosecha con semillas" (Seed-bearing).',
    steps: [
      'Inspecciona la planta y espera a que indique "Floreciente con semillas".',
      'Cosecha la casilla: recibirás la verdura comestible MÁS entre 20 y 60 semillas nuevas.',
      'Guarda la mitad de las semillas en un armario seco para la próxima temporada.'
    ],
    proTip: 'Si cosechas todas tus plantas temprano para comer, te quedarás sin semillas en pocas semanas y tu huerto morirá para siempre.',
    quiz: {
      question: '¿Qué sucede si cosechas un cultivo en la fase "Floreciente con semillas"?',
      options: [
        'Obtienes comida para alimentarte y además decenas de semillas nuevas para volver a plantar.',
        'La verdura explota y te causa daño.',
        'No obtienes absolutamente nada.'
      ],
      correct: 0,
      reward: '¡Autosuficiencia de semillas alcanzada! Tu suministro de comida es eterno.'
    }
  },
  {
    id: 10,
    stage: 'fase2',
    number: 10,
    title: 'El Huerto en el Tejado Fortificado',
    tagline: 'Cero zombis pisoteando tus lechugas',
    categoryIcon: '/spiffo/category_combat.png',
    spiffoBanner: '/spiffo/spiffo_combat.png',
    requiredGear: [
      { name: 'Saco lleno de tierra (Dirt Bag)', img: '/items/sandbag.png', desc: 'Subir la tierra al tejado en sacos.' },
      { name: 'Pala (Shovel)', img: '/items/shovel.png', desc: 'Verter la tierra en las baldosas.' },
      { name: 'Cuerda de escape (Sheet Rope)', img: '/items/rope.png', desc: 'Acceso seguro al segundo piso.' }
    ],
    whereToFind: 'Tejados planos de estaciones de bomberos, almacenes comerciales o bases de 2 pisos construidas por ti.',
    howToGetSoil: 'En el suelo exterior, los zombis desorientados caminan sobre tus bancales y destruyen las plantas al pisotearlas. En el tejado, tus cultivos reciben lluvia y sol pero ningún infectado puede tocarlos jamás.',
    steps: [
      'Lleva sacos de tierra a una azotea o tejado plano.',
      'Haz clic derecho en el suelo del tejado -> "Verter tierra" (Pour Dirt).',
      'Cava surcos sobre la tierra vertida y monta tus colectores de lluvia al lado.'
    ],
    proTip: 'Asegúrate de que el suelo del tejado sea sólido y no una claraboya de cristal para no caerte al piso de abajo con el peso.',
    quiz: {
      question: '¿Cuál es la mayor ventaja táctica de cultivar en el tejado de un edificio?',
      options: [
        'Los zombis no pueden llegar a pie a pisotear o destruir tus plantas.',
        'Las plantas crecen el triple de rápido por estar más cerca de las nubes.',
        'No necesitas regar nunca.'
      ],
      correct: 0,
      reward: '¡Huerto fortificado operativo! Tu base es ahora una fortaleza verde.'
    }
  },

  // FASE 3: GANADERÍA B42
  {
    id: 11,
    stage: 'fase3',
    number: 11,
    title: 'El Gallinero y las Aves de Postura',
    tagline: 'Huevos diarios, nidos y seguridad nocturna',
    categoryIcon: '/spiffo/category_ranching.png',
    spiffoBanner: '/spiffo/spiffo_ranching.png',
    requiredGear: [
      { name: 'Tablas de madera (Planks)', img: '/items/plank.png', desc: 'Para construir el gallinero (Hutch).' },
      { name: 'Clavos y Martillo', img: '/items/hammer.png', desc: 'Fijar nidos y puertas.' },
      { name: 'Cuerda (Rope)', img: '/items/rope.png', desc: 'Para atar y trasladar gallinas vivas.' },
      { name: 'Cubo con grano y agua', img: '/items/bucket.png', desc: 'Alimentación en comedero.' }
    ],
    whereToFind: 'Granjas en zonas rurales de Knox Country; cuerdas en ferreterías y almacenes.',
    howToGetSoil: 'Las gallinas son la fuente de proteína más rápida y fácil de mantener. Producen huevos todos los días mientras tengan grano, agua limpia y duerman sin miedo.',
    steps: [
      'Construye o repara un gallinero de madera con vallas alrededor.',
      'Llena el comedero con granos o verduras frescas y el bebedero con agua.',
      'CIERRA la puertecilla del gallinero al anochecer y ÁBRELA por la mañana para que no sufran de claustrofobia y estrés.'
    ],
    proTip: 'Para tener polluelos necesitas un gallo en el grupo; si solo tienes gallinas pondrán huevos para cocinar pero nunca nacerán crías.',
    quiz: {
      question: '¿Por qué es indispensable cerrar el gallinero cada noche?',
      options: [
        'Para evitar que depredadores o zombis ataquen a las gallinas mientras duermen a oscuras.',
        'Porque a las gallinas les da vergüenza dormir al aire libre.',
        'Para que los huevos no se congelen con el viento.'
      ],
      correct: 0,
      reward: '¡Gallinero seguro! Desayuno de huevos fritos asegurado todas las mañanas.'
    }
  },
  {
    id: 12,
    stage: 'fase3',
    number: 12,
    title: 'La Vaca Lechera y los Rumiantes',
    tagline: 'Ordeñar, pastura y el estómago rumiante',
    categoryIcon: '/spiffo/category_ranching.png',
    spiffoBanner: '/spiffo/spiffo_ranching.png',
    requiredGear: [
      { name: 'Cubo vacío (Bucket)', img: '/items/bucket.png', desc: 'Para recoger la leche fresca en el ordeño.' },
      { name: 'Cuerda resistente para ganado', img: '/items/rope.png', desc: 'Para mover animales grandes sin que se desboquen.' },
      { name: 'Hacha de mano (Hand Axe)', img: '/items/axe.png', desc: 'Para talar postes de cercado de madera.' }
    ],
    whereToFind: 'Granjas del sur y oeste del mapa de la Build 42.',
    howToGetSoil: 'Las vacas se alimentan de hierba natural y forraje seco. Su leche es el ingrediente clave para recetas de alto valor nutricional y felicidad.',
    steps: [
      'Construye un corral amplio con puerta grande.',
      'Asegúrate de que haya pasto verde en el suelo y agua constante en comederos largos.',
      'Acércate con el cubo y selecciona "Ordeñar" temprano por la mañana.'
    ],
    proTip: 'Si una vaca escucha disparos o zombis golpeando cerca, su medidor de estrés subirá y dejará de dar leche. La calma es sagrada para el ganado.',
    quiz: {
      question: '¿Qué le pasa a la producción de leche de una vaca si vive bajo estrés constante por ruidos de combate?',
      options: [
        'Baja drásticamente o se corta por completo hasta que el animal vuelva a estar calmado.',
        'Produce leche chocolatada.',
        'La vaca empieza a correr más rápido que un coche.'
      ],
      correct: 0,
      reward: '¡Ordeño maestro desbloqueado! Leche nutritiva para toda tu comunidad.'
    }
  },
  {
    id: 13,
    stage: 'fase3',
    number: 13,
    title: 'Ovejas: Lana y Abrigo para el Invierno',
    tagline: 'Esquilar y confeccionar ropa térmica',
    categoryIcon: '/spiffo/category_crafting.png',
    spiffoBanner: '/spiffo/spiffo_crafting.png',
    requiredGear: [
      { name: 'Tijeras de esquilar (Scissors / Shears)', img: '/items/scissors.png', desc: 'Para cortar el vellón sin dañar la piel.' },
      { name: 'Cuerda guía', img: '/items/rope.png', desc: 'Inmovilizar y tranquilizar a la oveja.' },
      { name: 'Comedero con forraje seco', img: '/items/bucket.png', desc: 'Alimentación suplementaria.' }
    ],
    whereToFind: 'Tijeras de esquilar en cobertizos agrícolas y corrales de granjas.',
    howToGetSoil: 'La lana de oveja es el material aislante térmico número 1 contra la hipotermia en el crudo invierno de Kentucky cuando la nieve cubre el mapa.',
    steps: [
      'Mantén a las ovejas bien alimentadas hasta que su lana crezca esponjosa.',
      'Equipa las tijeras de esquilar en la mano.',
      'Interactúa con la oveja y esquila el vellón de lana para llevarlo a tu taller de costura.'
    ],
    proTip: 'Nunca esquiles a tus ovejas en medio de una tormenta helada al aire libre: podrían enfermar por el choque térmico antes de que su lana vuelva a crecer.',
    quiz: {
      question: '¿Para qué sirve principalmente la lana cosechada de las ovejas en Project Zomboid?',
      options: [
        'Para tejer ropa abrigada y reparar prendas térmicas que protegen del frío mortal del invierno.',
        'Para hacer alfombras que frenan a los zombis.',
        'Para alimentar a las gallinas.'
      ],
      correct: 0,
      reward: '¡Lana asegurada! El invierno ya no será una amenaza de congelación.'
    }
  },
  {
    id: 14,
    stage: 'fase3',
    number: 14,
    title: 'Cerdos: Los Grandes Recicladores',
    tagline: 'Alimentación omnívora y cuidado del corral',
    categoryIcon: '/spiffo/category_ranching.png',
    spiffoBanner: '/spiffo/spiffo_ranching.png',
    requiredGear: [
      { name: 'Pala (Shovel)', img: '/items/shovel.png', desc: 'Limpieza periódica del suelo del corral.' },
      { name: 'Tablones gruesos reforzados', img: '/items/plank.png', desc: 'Vallas resistentes a embestidas.' },
      { name: 'Excedentes de patatas y verduras', img: '/items/potato.png', desc: 'Alimentación omnívora económica.' }
    ],
    whereToFind: 'Granjas y fincas en las zonas rurales.',
    howToGetSoil: 'Los cerdos comen casi cualquier residuo vegetal, patatas viejas o maíz que te sobre. Crecen rápido y son una gran fuente calórica si necesitas carne para ahumar.',
    steps: [
      'Construye vallas dobles o reforzadas porque los cerdos asustados pueden derribar empalizadas débiles.',
      'Aliméntalos con excedentes de tu huerto.',
      'Limpia su corral con regularidad para evitar la aparición de moscas y enfermedades.'
    ],
    proTip: 'Al igual que con otros animales, los chillidos de cerdos asustados viajan a decenas de casillas de distancia y atraen zombis errantes.',
    quiz: {
      question: '¿Por qué las vallas de los cerdos deben estar bien reforzadas?',
      options: [
        'Porque tienen mucha fuerza y si se estresan por ruidos o infectados pueden romper vallas frágiles.',
        'Porque aprenden a usar herramientas de carpintería.',
        'Porque saltan por encima de los árboles.'
      ],
      correct: 0,
      reward: '¡Cerdos bajo control! Tu granja aprovecha hasta el último grano de comida.'
    }
  },
  {
    id: 15,
    stage: 'fase3',
    number: 15,
    title: 'Pastoreo Rotativo y Control de Estrés',
    tagline: 'El arte de cuidar pastos y apaciguar al ganado',
    categoryIcon: '/spiffo/category_interactable.png',
    spiffoBanner: '/spiffo/spiffo_interactable.png',
    requiredGear: [
      { name: 'Cuerda y postes', img: '/items/rope.png', desc: 'Para guiar y atar animales a estacas.' },
      { name: 'Zanahorias de premio', img: '/items/carrot.png', desc: 'Golosinas para ganar confianza.' },
      { name: 'Hacha para empalizadas', img: '/items/axe.png', desc: 'Sectorizar el campo en potreros.' }
    ],
    whereToFind: 'Fabricación propia con madera y cuerdas.',
    howToGetSoil: 'Si dejas a los animales en el mismo trozo de tierra, se comen la hierba hasta las raíces y la zona se vuelve barro muerto. Divide el campo en 2 o 3 sectores y muévelos cada semana.',
    steps: [
      'Ata a los animales con cuerda y llévalos al potrero descansado con hierba fresca.',
      'Acarícialos e interactúa con ellos para subir su confianza con tu personaje.',
      'Elimina cualquier zombi en un radio de 50 metros alrededor del perímetro de los corrales.'
    ],
    proTip: 'El pastoreo rotativo permite que la hierba se regenere sola sin que tengas que gastar agua regando el césped de los animales.',
    quiz: {
      question: '¿Cómo ayudas a un animal que tiene su barra de estrés alta tras un susto?',
      options: [
        'Alejando el peligro, dándole comida favorita de premio y acariciándolo para ganar confianza.',
        'Gritándole y corriendo en círculos a su alrededor.',
        'Dejándolo sin comer durante 3 días.'
      ],
      correct: 0,
      reward: '¡Ganadero profesional! Tu manada vive feliz y productiva.'
    }
  },

  // FASE 4: AUTOSUFICIENCIA
  {
    id: 16,
    stage: 'fase4',
    number: 16,
    title: 'El Estiércol Curado: Abono Animal',
    tagline: 'Conectar animales y huerto en un círculo perfecto',
    categoryIcon: '/spiffo/category_cleaning.png',
    spiffoBanner: '/spiffo/spiffo_cleaning.png',
    requiredGear: [
      { name: 'Pala (Shovel)', img: '/items/shovel.png', desc: 'Para recoger el estiércol del corral.' },
      { name: 'Saco de arena/tierra (Sack)', img: '/items/sandbag.png', desc: 'Para almacenar y madurar el abono.' },
      { name: 'Rastrillo (Rake)', img: '/items/rake.png', desc: 'Incorporar el abono a la tierra arada.' }
    ],
    whereToFind: 'El suelo de los corrales de vacas, caballos y ovejas.',
    howToGetSoil: 'El estiércol animal fresco es demasiado fuerte y tiene amoníaco que quemaría las raíces tiernas. Déjalo reposar un tiempo mezclado con paja antes de aplicarlo al huerto.',
    steps: [
      'Recoge el estiércol del suelo del corral con la pala.',
      'Almacénalo en sacos para que cure y se enfríe.',
      'Aplícalo a tus surcos antes de la siembra para obtener verduras gigantes con defensas altas contra hongos.'
    ],
    proTip: 'Este fertilizante orgánico es el secreto para no depender nunca de químicos sintéticos encontrados en ferreterías.',
    quiz: {
      question: '¿Por qué no se debe poner estiércol recién salido del animal directo sobre las raíces tiernas?',
      options: [
        'Porque es muy fuerte y el amoníaco fresco puede quemar y secar las raíces jóvenes.',
        'Porque los zombis huelen el estiércol a 10 kilómetros.',
        'Porque hace que las verduras sepan a hierro.'
      ],
      correct: 0,
      reward: '¡Bucle orgánico cerrado! Tu granja produce su propio fertilizante de primera clase.'
    }
  },
  {
    id: 17,
    stage: 'fase4',
    number: 17,
    title: 'Apicultura y Polinización',
    tagline: 'Flores, miel y frutas con abejas aliadas',
    categoryIcon: '/spiffo/category_foraging_mining.png',
    spiffoBanner: '/spiffo/spiffo_foraging.png',
    requiredGear: [
      { name: 'Tablas de madera y Clavos', img: '/items/plank.png', desc: 'Estructura de las colmenas.' },
      { name: 'Tijeras para podar flores', img: '/items/scissors.png', desc: 'Multiplicar flora melífera.' },
      { name: 'Tarros de cristal con tapa', img: '/items/vinegar.png', desc: 'Para conservar miel pura.' }
    ],
    whereToFind: 'Zonas de campo con floración silvestre.',
    howToGetSoil: 'La miel no caduca nunca y es tanto un alimento calórico como un antiséptico natural para curar heridas y rasguños.',
    steps: [
      'Siembra flores de colores cerca de tus árboles frutales y huertos.',
      'Coloca colmenas protegidas del viento fuerte.',
      'Recolecta miel con cuidado en los meses cálidos de primavera y verano.'
    ],
    proTip: 'Las abejas polinizan las flores de los árboles frutales: sin polinizadores, muchos frutales darán un 80% menos de cosecha.',
    quiz: {
      question: '¿Qué propiedad legendaria tiene la miel pura almacenada en tarros de cristal?',
      options: [
        'No caduca nunca y sirve como alimento de emergencia y remedio antiséptico para heridas.',
        'Apaga incendios instantáneamente.',
        'Se puede usar como gasolina para vehículos.'
      ],
      correct: 0,
      reward: '¡Apicultor consagrado! Dulzura y salud infinita en tu refugio.'
    }
  },
  {
    id: 18,
    stage: 'fase4',
    number: 18,
    title: 'Conservas en Tarro: El Envasado Casero',
    tagline: 'Guardar verduras durante meses sin electricidad',
    categoryIcon: '/spiffo/category_food_and_water.png',
    spiffoBanner: '/spiffo/spiffo_food.png',
    requiredGear: [
      { name: 'Botella de Vinagre (Vinegar)', img: '/items/vinegar.png', desc: 'Ácido conservante contra bacterias.' },
      { name: 'Tomates y Verduras frescas', img: '/items/tomato.png', desc: 'Materia prima para encurtir.' },
      { name: 'Olla de agua hirviendo', img: '/items/bucket.png', desc: 'Esterilizar y sellar al vacío.' }
    ],
    whereToFind: 'Cocinas residenciales, despensas de restaurantes y supermercados.',
    howToGetSoil: 'Cuando la red eléctrica colapsa y los refrigeradores se apagan, las verduras frescas se pudren en pocos días. El envasado en tarros al baño maría conserva comida durante más de 6 meses.',
    steps: [
      'Corta las verduras cosechadas.',
      'Mézclalas con vinagre y azúcar en el tarro de cristal.',
      'Hierve el tarro en una olla grande con agua para expulsar el aire y sellar la tapa herméticamente.'
    ],
    proTip: 'Asegúrate de tener tapas de tarro en buen estado; una tapa doblada no sella y la comida se arruinará con moho.',
    quiz: {
      question: '¿Por qué el envasado en frascos con vinagre y hervor permite que la verdura dure meses sin nevera?',
      options: [
        'Porque el calor mata las bacterias y el sellado al vacío con vinagre impide que entren nuevos gérmenes.',
        'Porque el cristal absorbe la luz de la luna.',
        'Porque el vinagre congela la comida químicamente.'
      ],
      correct: 0,
      reward: '¡Despensa eterna! Tu sótano está repleto de comida para cualquier emergencia.'
    }
  },
  {
    id: 19,
    stage: 'fase4',
    number: 19,
    title: 'Riego Automatizado desde el Tejado',
    tagline: 'Conectar tuberías pluviales a grifos y huerto',
    categoryIcon: '/spiffo/category_crafting.png',
    spiffoBanner: '/spiffo/spiffo_crafting.png',
    requiredGear: [
      { name: 'Llave de fontanero (Pipe Wrench)', img: '/items/pipe_wrench.png', desc: 'Herramienta de conexión de tuberías.' },
      { name: 'Barril de lluvia en el piso superior', img: '/items/watering_can.png', desc: 'Suministro por gravedad.' },
      { name: 'Fregadero o pila de agua', img: '/items/bucket.png', desc: 'Punto de salida del agua purificada.' }
    ],
    whereToFind: 'Llaves de tubo en almacenes de fontanería, garajes y furgonetas de trabajo.',
    howToGetSoil: 'En Project Zomboid puedes conectar un barril de lluvia colocado en el techo al piso inferior con una llave inglesa. El agua pasa por el grifo de manera limpia y lista para usar.',
    steps: [
      'Coloca un colector de lluvia en el tejado, exactamente una casilla arriba y diagonal/directo al fregadero de abajo.',
      'Baja con la llave de tubo equipada.',
      'Haz clic derecho en el fregadero -> "Conectar tubería" (Plumb Sink).'
    ],
    proTip: 'El agua que sale del grifo conectado al barril ya sale PURIFICADA automáticamente por el filtro del grifo, lista para beber y cocinar.',
    quiz: {
      question: '¿Qué herramienta necesitas en la mano para conectar un barril colector de lluvia al sistema de tuberías?',
      options: [
        'Una llave inglesa o llave de tubo (Pipe Wrench).',
        'Un bate de béisbol.',
        'Un cuchillo de mantequilla.'
      ],
      correct: 0,
      reward: '¡Fontanería maestra! Agua corriente limpia sin depender del gobierno ni de la red.'
    }
  },
  {
    id: 20,
    stage: 'fase4',
    number: 20,
    title: 'El Maestro Supremo de la Granja Viva',
    tagline: 'La granja autosuficiente indestructible',
    categoryIcon: '/spiffo/category_multiplayer.png',
    spiffoBanner: '/spiffo/spiffo_farming.png',
    requiredGear: [
      { name: 'Kit completo de herramientas', img: '/items/trowel.png', desc: 'Palas, llaves, tijeras y hachas operativas.' },
      { name: 'Banco completo de semillas', img: '/items/seeds.png', desc: 'Patatas, repollo, tomates y zanahorias.' },
      { name: 'Corral seguro con ganado y aves', img: '/items/rope.png', desc: 'Proteínas, huevos, leche y abono diario.' }
    ],
    whereToFind: 'Construido con tu esfuerzo, inteligencia y paciencia en tu base fortificada.',
    howToGetSoil: 'Has aprendido todo: el suelo que no ahoga, el compost que alimenta, el agua que no falta, los cultivos que dan semillas, las gallinas que dan huevos y la calma que mantiene sano al ganado.',
    steps: [
      'Revisa tu perímetro de seguridad cada mañana.',
      'Atiende a tus animales con agua y comida limpia.',
      'Cosecha tus verduras maduras y pon a secar las semillas nuevas.',
      '¡Enseña a tus compañeros de supervivencia a vivir de la tierra!'
    ],
    proTip: 'Un verdadero superviviente no es el que más balas tiene, sino el que nunca pasa hambre ni sed en medio del apocalipsis.',
    quiz: {
      question: '¿Cuál es la clave definitiva que mantiene viva y eterna a una granja autosuficiente?',
      options: [
        'Que todo se recicla: los animales dan abono para el huerto, el huerto alimenta al ganado y tú cosechas comida infinita.',
        'Gastar todas las semillas en el primer mes.',
        'Tener las vallas abiertas para que los zombis pasen libremente.'
      ],
      correct: 0,
      reward: '¡ERES EL GRAN MAESTRO DE LA GRANJA VIVA! Has completado los 20 niveles de maestría.'
    }
  }
];
