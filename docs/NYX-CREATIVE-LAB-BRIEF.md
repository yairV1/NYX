# NYX — Creative Lab / Plan maestro de la web oficial

> Estado: propuesta de implementación. Rama de trabajo: `feature/nyx-official-creative-lab`. No modificar `main` directamente.

## Visión acordada
NYX es un ecosistema creativo y tecnológico impulsado por IA. NYX Studio combinará generación asistida con IA y edición visual intuitiva (como Figma, pero accesible). El estilo visual es inmersivo, futurista y elegante. La web pública debe presentar el personaje, la historia auténtica del proyecto, las capacidades existentes y las que están en desarrollo. No simular funcionalidades que aún no existen.

## Personaje
Referencia visual prioritaria aportada por el autor: `docs/references/nyx-identity.png`. Mantener cabeza grande, ojos redondos verde-amarillos, cuerpo compacto, patas felinas cortas y cola atigrada. El acabado 3D debe preservar estas proporciones. Evitar manos humanas y silueta humana alargada.

Gato atigrado gris/marrón de rayas oscuras, ojos verdes, nariz rosada, sudadera azul marino con huella blanca y cordones, mochila morada. Mantener identidad consistente; activos oficiales sólo si cuentan con autorización/licencia y calidad suficiente. Futuro modelo 3D: preparar integración sin imponerla en el MVP.

## Dirección visual
- Lema provisional: «Imagina. Crea. Transforma.»
- Concepto hero: **NYX Creative Lab**, un estudio futurista donde NYX recibe al visitante.
- Paleta: void #080B16; nebula #151B35; violet #7C3AED; signal #22D3EE; starlight #F5F7FF.
- Tipografía recomendada Space Grotesk / Inter con fallback adecuado; usar sistema tipográfico consistente.
- Pantalla de escritorio: texto aprox. 42 %, escena aprox. 58 %, márgenes fluidos; móvil con composición apilada y acciones visibles.
- Animación de entrada progresiva no bloqueante; movimiento ambiental sutil, respuesta a cursor no esencial, soporte prefers-reduced-motion.
- Navegación: Inicio, Historia, Ecosistema, Studio; Comunidad sólo si existe un producto real o se muestra honradamente «próximamente».
- CTA primario: «Explorar NYX Studio» (si no hay editor funcional debe llevar a demo o información, no a un producto falso). Secundario: «Conoce NYX».

## Secciones MVP
1. Hero Creative Lab con CTAs y personalidad del personaje.
2. ¿Qué es NYX? — descripción sencilla y clara.
3. Historia — evitar inventar hitos autobiográficos; usar texto editable o provisional claramente marcado.
4. Ecosistema — NYX AI, NYX Studio, NYX Labs; estado explícito por funcionalidad.
5. Studio — muestra estática o interactiva acotada del editor; no prometer generación real si no existe.
6. Roadmap y cierre/CTA; footer completo.

## Criterios de aceptación
- Integración en Next.js App Router / Tailwind existentes; inspeccionar el repositorio y la documentación local de Next 16 antes de programar.
- UI responsive (360, 390, 768, 1024, 1440 px), keyboard-friendly, semántica, contrastes accesibles.
- Respetar reduced motion; sin animaciones que bloqueen botones, scroll o lectura.
- Imágenes optimizadas y accesibles; sin imágenes externas de búsqueda usadas sin licencia.
- Ninguna estadística inventada de usuarios o funcionalidades reales.
- Ejecutar `npm run lint` y `npm run build`; documentar resultados reales.
- Conservar `AGENTS.md` y la configuración del proyecto.
- Documentar decisiones, pendientes y límites del prototipo.
- Trabajar en rama, publicar PR en borrador para revisión; no fusionar a main ni publicar a producción sin aprobación.

## Flujo de trabajo
- Especificación: UX/UI, criterios de aceptación y revisión de cambios en cada PR.
- Implementación: inspección técnica, desarrollo, pruebas, reporte y commits sobre la rama de feature.
- GitHub: fuente de verdad para tareas, código y revisiones. Este documento y los PR son el canal compartido.

## Dirección aprobada — Fase 2
Casa Nodo es el hogar principal. Se evoluciona Nyx_rig v2 antropomórfico; audífonos solo en concentración. Esta decisión posterior del autor gobierna la evolución 3D. Ver `docs/phase-2/README.md`.
