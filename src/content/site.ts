/**
 * Contenido editable de la web oficial de NYX.
 *
 * Regla del proyecto: aquí no se inventan funcionalidades, cifras ni historia.
 * Todo lo que todavía no existe lleva un `status` explícito y los textos
 * provisionales se marcan con `provisional: true` para que la UI lo muestre.
 */

export type Status =
  | "in-progress" // se está construyendo ahora
  | "in-development" // en desarrollo, sin versión pública
  | "defining" // alcance todavía por definir
  | "planned" // previsto, sin empezar
  | "ready"; // preparado, pendiente de integrar

export const STATUS_LABEL: Record<Status, string> = {
  "in-progress": "En curso",
  "in-development": "En desarrollo",
  defining: "En definición",
  planned: "Planeado",
  ready: "Preparado",
};

export const site = {
  name: "NYX",
  tagline: "Imagina. Crea. Transforma.",
  description:
    "NYX es un ecosistema creativo y tecnológico impulsado por IA. Conoce al personaje, el proyecto y lo que estamos construyendo.",
} as const;

export const navItems = [
  { id: "inicio", label: "Inicio" },
  { id: "historia", label: "Historia" },
  { id: "ecosistema", label: "Ecosistema" },
  { id: "studio", label: "Studio" },
] as const;

export type SectionId = (typeof navItems)[number]["id"];

export const hero = {
  eyebrow: "NYX Creative Lab",
  titleWords: ["Imagina.", "Crea.", "Transforma."],
  lead: "Un ecosistema creativo y tecnológico impulsado por IA. Pasa al laboratorio: NYX te recibe.",
  primaryCta: { label: "Explorar NYX Studio", href: "#studio" },
  secondaryCta: { label: "Conoce NYX", href: "#que-es-nyx" },
  note: "Primera versión del sitio · en construcción",
  characterAlt:
    "NYX: un gato atigrado gris de rayas oscuras y ojos verdes, con sudadera azul marino con una huella blanca y mochila morada.",
} as const;

export const about = {
  eyebrow: "¿Qué es NYX?",
  title: "Un lugar para dar forma a las ideas",
  body: [
    "NYX es un ecosistema creativo y tecnológico impulsado por inteligencia artificial. Tiene un personaje con identidad propia y un conjunto de herramientas que se están construyendo a su alrededor.",
    "Esta web presenta el proyecto tal como es hoy: lo que ya existe, lo que está en desarrollo y lo que todavía se está definiendo.",
  ],
  pillars: [
    {
      title: "Imagina",
      text: "Todo empieza con una idea. NYX quiere ser el sitio donde empezar a darle forma.",
    },
    {
      title: "Crea",
      text: "Herramientas pensadas para ser intuitivas, con la IA como asistente y no como obstáculo.",
    },
    {
      title: "Transforma",
      text: "Iterar, editar y llevar lo creado un paso más allá, a tu ritmo.",
    },
  ],
} as const;

export const story = {
  eyebrow: "Historia",
  title: "La historia de NYX se está escribiendo",
  provisional: true,
  provisionalLabel: "Texto provisional",
  body: "Este espacio contará la historia real del proyecto, escrita por quien lo creó. Hasta que ese texto exista preferimos dejar el lugar señalado antes que inventar hitos.",
  factsTitle: "Lo que sí podemos decir hoy",
  facts: [
    "NYX es un gato atigrado gris de rayas oscuras, ojos verdes y nariz rosada.",
    "Viste una sudadera azul marino con una huella blanca y lleva una mochila morada.",
    "La web oficial está en su primera versión y crecerá junto con el proyecto.",
  ],
} as const;

export const ecosystem = {
  eyebrow: "Ecosistema",
  title: "Tres piezas, un mismo universo",
  lead: "Cada pieza indica su estado real. Ninguna está disponible al público todavía.",
  items: [
    {
      id: "nyx-ai",
      name: "NYX AI",
      status: "defining" as Status,
      text: "La capa de inteligencia artificial que impulsará el ecosistema. Su alcance aún se está definiendo.",
    },
    {
      id: "nyx-studio",
      name: "NYX Studio",
      status: "in-development" as Status,
      text: "Combinará generación asistida con IA y edición visual intuitiva: la idea de un editor de diseño, pero accesible. Aún no hay una versión utilizable.",
    },
    {
      id: "nyx-labs",
      name: "NYX Labs",
      status: "defining" as Status,
      text: "El espacio para experimentos y prototipos del ecosistema. Todavía sin contenido público.",
    },
  ],
} as const;

export const studio = {
  eyebrow: "NYX Studio",
  title: "Crear con IA, editar con las manos",
  body: "NYX Studio unirá dos formas de trabajar: describir lo que imaginas y ajustar el resultado directamente sobre el lienzo, sin curva de aprendizaje.",
  status: "in-development" as Status,
  disclaimer:
    "Maqueta conceptual. NYX Studio todavía no está disponible y esta imagen no representa un producto en funcionamiento.",
  mockAlt:
    "Maqueta conceptual de la interfaz de NYX Studio: una barra de herramientas, un lienzo con una composición y un panel de propiedades.",
  principles: [
    "Generación asistida con IA como punto de partida.",
    "Edición visual directa sobre el lienzo.",
    "Pensado para personas sin experiencia en diseño.",
  ],
} as const;

export const roadmap = {
  eyebrow: "Roadmap",
  title: "Lo que viene",
  note: "Orden orientativo. Sin fechas comprometidas.",
  steps: [
    {
      title: "Web oficial",
      status: "in-progress" as Status,
      text: "Primera versión del sitio con el Creative Lab como bienvenida.",
    },
    {
      title: "NYX en 3D",
      status: "ready" as Status,
      text: "La escena del hero ya reserva el espacio para el personaje 3D. Falta integrar el modelo.",
    },
    {
      title: "Demo de NYX Studio",
      status: "planned" as Status,
      text: "Una demostración acotada del editor cuando exista algo real que mostrar.",
    },
    {
      title: "Comunidad",
      status: "defining" as Status,
      text: "Un espacio para quienes sigan el proyecto. Por definir.",
    },
  ],
} as const;

export const closing = {
  title: "El laboratorio acaba de abrir",
  text: "NYX está empezando. Vuelve pronto para ver cómo crece.",
  cta: { label: "Volver al inicio", href: "#inicio" },
} as const;
