// Opciones del Wizard de Onboarding de Spiffo-OS

export const ONBOARDING_FLOW = {
  step1: {
    question: '¿Qué mecánica de supervivencia necesitas dominar?',
    subtitle: 'Elige un sistema fundamental del juego. Te guiaremos con equipo exacto, ubicaciones de saqueo y pasos interactivos.',
    options: [
      {
        id: 'hotwire',
        title: 'Puentear coches (Hotwiring)',
        badge: 'Imprescindible',
        icon: '⚡',
        desc: 'Arranca cualquier vehículo sin llaves ni profesión de ladrón subiendo Electricidad Nv. 1 y Mecánica Nv. 2.',
        routeId: 'hotwiring-vehicles',
      },
      {
        id: 'explore',
        title: 'Sigilo y primeros 3 días',
        badge: 'Principiantes',
        icon: '🎒',
        desc: 'Movimiento agachado [C], tapar ventanas con sábanas, televisión educativa y primeros auxilios.',
        routeId: 'survival-basics',
      },
      {
        id: 'vehicles',
        title: 'Mecánica y conducción vehicular',
        icon: '🚐',
        desc: 'Sifón de gasolina, cambio de ruedas, batería y cómo no destrozar el motor explorando Kentucky.',
        routeId: 'first-vehicle',
      },
      {
        id: 'farm',
        title: 'Agricultura y reservas de agua',
        icon: '🌱',
        desc: 'Recolectores de lluvia, siembra, plagas, abono y cómo sobrevivir al corte inminente de suministros.',
        routeId: 'farming-b42',
      },
      {
        id: 'build',
        title: 'Carpintería y fortificación de bases',
        icon: '🔨',
        desc: 'Barricadas con tablas y clavos, muebles seguros, escaleras de evacuación y colectores pluviales.',
        routeId: 'carpentry-bases',
      },
      {
        id: 'combat',
        title: 'Combate cuerpo a cuerpo y hordas',
        icon: '⚔️',
        desc: 'Control del espacio, pisotones a la cabeza, empujones tácticos y manejo de pánico y fatiga.',
        routeId: 'combat-basics',
      },
    ],
  },
  step2_newbie: {
    question: '¿Cuál es tu prioridad inmediata al reaparecer?',
    subtitle: 'Configuraremos tu ruta táctica según la urgencia que tengas ahora mismo en Kentucky.',
    options: [
      {
        id: 'hotwire',
        title: 'Puentear un coche para huir',
        badge: 'Recomendado',
        icon: '⚡',
        desc: 'Aprender el truco de desmontar faros y radios para conseguir vehículo en menos de 24 horas in-game.',
        routeId: 'hotwiring-vehicles',
      },
      {
        id: 'explore',
        title: 'Asegurar una casa y no morir al salir',
        icon: '🎒',
        desc: 'Tapar ventanas, conseguir agua limpia y equipar un arma básica sin hacer ruido.',
        routeId: 'survival-basics',
      },
      {
        id: 'vehicles',
        title: 'Aprender mecánica y gasolina',
        icon: '🚐',
        desc: 'Reparar neumáticos, cargar baterías y saquear gasolineras con bidones.',
        routeId: 'first-vehicle',
      },
      {
        id: 'farm',
        title: 'Asegurar agua y comida a largo plazo',
        icon: '🌱',
        desc: 'Construir colectores de lluvia antes del corte y plantar las primeras semillas.',
        routeId: 'farming-b42',
      },
      {
        id: 'fight',
        title: 'Aprender a defenderme sin que me muerdan',
        icon: '⚔️',
        desc: 'Manejo de distancia, derribar zombis y rematarlos en el suelo sin gastar estamina.',
        routeId: 'combat-basics',
      },
    ],
  },
};
