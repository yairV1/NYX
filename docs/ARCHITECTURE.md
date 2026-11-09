# NYX web — Arquitectura, decisiones y pendientes

> Acompaña a [`NYX-CREATIVE-LAB-BRIEF.md`](./NYX-CREATIVE-LAB-BRIEF.md). Describe la primera versión de la web oficial implementada en la rama `feature/nyx-official-creative-lab`.

## 1. Punto de partida

El repositorio era la plantilla intacta de `create-next-app`: Next.js 16.3.7 (App Router, Turbopack), React 19.2, Tailwind CSS 4, TypeScript estricto y ESLint 9. No había componentes, contenido ni activos propios. Antes de programar se consultó la documentación local de Next 16 (`node_modules/next/dist/docs/`: fuentes, metadata/viewport, lazy loading), tal como exige `AGENTS.md`.

## 2. Estructura

```
src/
├─ app/
│  ├─ layout.tsx        Fuentes (Inter + Space Grotesk), metadata, viewport, lang="es"
│  ├─ page.tsx          Composición de la página (Server Component)
│  └─ globals.css       Tokens NYX (@theme), utilidades de marca, escena y movimiento
├─ content/
│  └─ site.ts           TODO el texto y los estados; única fuente de contenido
└─ components/
   ├─ layout/           SiteHeader (cliente), SiteFooter
   ├─ hero/             Hero, CreativeLabScene, PointerParallax (cliente)
   ├─ nyx/              NyxCharacter, NyxIllustration, types (contrato del renderer)
   ├─ sections/         About, Story, Ecosystem, StudioPreview, Roadmap, ClosingCta
   └─ ui/               Section, ButtonLink, StatusBadge, NyxLogo
```

## 3. Decisiones técnicas

| Decisión | Motivo |
|---|---|
| **Una sola página con anclas** (`#inicio`, `#historia`, `#ecosistema`, `#studio`) | El contenido real actual no justifica rutas separadas. Cuando una sección crezca (p. ej. Studio) se promueve a ruta sin tocar el resto. |
| **Contenido separado en `src/content/site.ts`** | El texto se edita sin tocar componentes y la regla «no inventar» se audita en un solo archivo. Cada pieza del ecosistema lleva un `status` tipado. |
| **Server Components por defecto; sólo 2 Client Components** (`SiteHeader`, `PointerParallax`) | Mínimo JavaScript en cliente. La página se prerenderiza como estática. |
| **Sin dependencias nuevas** | Animaciones con CSS, escena con CSS/SVG. No se añadió librería de animación ni de 3D: el MVP no las necesita y se mantienen el peso y la superficie de mantenimiento al mínimo. |
| **Tokens en `@theme` de Tailwind 4** | La paleta del brief (`void`, `nebula`, `violet`, `signal`, `starlight`) queda disponible como utilidades (`bg-void`, `text-signal`…). Se añadieron dos derivados para cumplir contraste AA en texto: `violet-soft` (#B9A2FF) y `mist` (#B4BBD6), porque `violet` puro sobre `void` no alcanza 4.5:1 en texto pequeño. |
| **Tipografía con `next/font`** | Space Grotesk (titulares) + Inter (texto), autoalojadas, `display: swap`, con fallback del sistema. |
| **Revelado al hacer scroll con CSS scroll-driven animations** (`animation-timeline: view()`) | Cero JavaScript y mejora progresiva real: en navegadores sin soporte el contenido simplemente está visible. Nunca hay contenido oculto esperando a un script. |
| **Entrada del hero con `animation … both` escalonada** | Sólo anima `opacity`/`transform`; los botones son clicables desde el primer frame. |
| **Paralaje con variables CSS** (`--px`, `--py`) | `PointerParallax` escribe dos variables con `requestAnimationFrame`; no provoca renders de React. Sólo se activa con puntero fino y sin `prefers-reduced-motion`. |
| **Todo el movimiento dentro de `@media (prefers-reduced-motion: no-preference)`** | Con reduced motion no se ejecuta ninguna animación ni scroll suave. |
| **Se eliminaron los SVG de la plantilla en `public/`** | No se usaban. |
| **Script `typecheck`** (`tsc --noEmit`) | Verificación de tipos independiente del build. |

## 4. Honestidad del contenido

- **Historia**: marcada como «Texto provisional». No contiene hitos ni biografía; sólo hechos tomados del brief (aspecto del personaje, estado de la web).
- **Ecosistema**: cada pieza muestra su estado como texto visible (no sólo color).
- **Studio**: maqueta estática con la etiqueta «Concepto» y un aviso explícito. No hay campos ni botones reales, para no sugerir que el editor funciona.
- **CTA «Explorar NYX Studio»**: lleva a la sección informativa `#studio`, no a un producto.
- **Comunidad**: fuera de la navegación principal; aparece en el pie como «Próximamente» y en el roadmap como «En definición».
- **Sin estadísticas**, testimonios, fechas ni enlaces externos.

## 5. Integración del personaje 3D (preparada, no implementada)

La escena y el personaje están desacoplados:

```
Hero
└─ CreativeLabScene            escena ambiental (CSS/SVG), decorativa
   └─ [data-nyx-stage]         punto de montaje
      └─ NyxCharacter          decide QUÉ renderer usar
         └─ NyxIllustration    hoy: SVG provisional (server-rendered)
```

- `components/nyx/types.ts` define `NyxRendererProps`, el contrato que debe cumplir cualquier renderer.
- Para integrar el modelo sólo hay que cambiar `NyxCharacter`; la escena, el hero y el layout no se tocan.

Plan recomendado cuando exista el GLB autorizado:

1. Crear `components/nyx/NyxModel3D.tsx` (`"use client"`) y cargarlo con `next/dynamic` y `ssr: false` desde un Client Component (requisito de Next 16).
2. Mantener `NyxIllustration` como **fallback y póster**: se muestra mientras carga, si no hay WebGL, con `prefers-reduced-motion` o con ahorro de datos.
3. Montar el canvas sólo cuando la escena entre en el viewport y pausar el bucle cuando salga o la pestaña esté oculta.
4. Añadir `three` (y, si se quiere, React Three Fiber) **en ese momento**, no antes.
5. Servir el GLB desde `public/models/` con compresión (Draco/Meshopt) y texturas optimizadas.
6. Reutilizar las variables `--px`/`--py` existentes para la mirada del personaje.

> Nota: en el equipo existe un proyecto local del personaje (rig, exportación GLB y un controlador web). No se ha copiado nada de él a este repositorio; su uso aquí requiere decisión y autorización expresas.

## 6. Accesibilidad

- HTML semántico: `header`, `nav` etiquetadas, `main`, `section` con `aria-labelledby`, jerarquía h1 → h2 → h3, `footer`.
- Enlace «Saltar al contenido».
- Menú móvil como *disclosure* (`aria-expanded`, `aria-controls`), se cierra con Escape y al navegar.
- Sección activa con `aria-current="location"`.
- Foco visible de alto contraste en todos los elementos interactivos; en móvil, objetivos táctiles ≥ 44 px (menú, CTA y enlaces del pie).
- Decoración con `aria-hidden`; el personaje y la maqueta de Studio tienen descripción textual.
- Estados comunicados con texto, no sólo con color.

## 7. Verificación

Resultados reales en esta rama (Node 24.19, npm):

| Comando | Resultado |
|---|---|
| `npm run typecheck` | Sin errores |
| `npm run lint` | Sin errores ni avisos |
| `npm run build` | Correcto. Rutas `/` y `/_not-found` prerenderizadas como estáticas |

Revisión visual manual en navegador a 360, 768 y 1440 px: sin desbordamiento horizontal; menú móvil abre/cierra (incluido Escape); composición apilada en móvil con los CTA visibles sin hacer scroll.

**No verificado todavía:** 390 y 1024 px de forma explícita, lectores de pantalla reales, auditoría Lighthouse/axe, Safari y Firefox.

## 8. Pendientes y límites del prototipo

**Requieren decisión del autor**

- [ ] Texto real de **Historia** (y poner `story.provisional = false`).
- [ ] Confirmar los **estados** de NYX AI, NYX Studio y NYX Labs y sus descripciones.
- [ ] **Ilustración del personaje**: el SVG actual es un marcador provisional dibujado desde la descripción del brief, no un activo oficial. Sustituir por arte oficial autorizado o por el modelo 3D.
- [ ] **Logotipo** oficial (el actual es una marca tipográfica provisional) y favicon (sigue el de la plantilla).
- [ ] Dominio definitivo → `metadataBase`, Open Graph, `sitemap` y `robots`.
- [ ] Enlaces externos reales (redes, contacto, repositorio) si procede.

**Técnicos**

- [ ] Integración del personaje 3D (sección 5).
- [ ] Pruebas automatizadas (no hay ninguna): al menos un smoke test y una auditoría axe.
- [ ] Auditoría Lighthouse y prueba en Safari/Firefox (en Firefox el revelado por scroll no se anima; el contenido se muestra directamente).
- [ ] Atrapar el foco / cerrar al pulsar fuera en el menú móvil si se convierte en un panel a pantalla completa.
- [ ] Añadir Prettier al proyecto para formato consistente.
- [ ] Demo acotada de Studio cuando haya algo real que mostrar.
