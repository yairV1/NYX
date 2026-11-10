# NYX web — Sistema visual

> Rediseño de la landing (rama `feature/nyx-landing-redesign`). Sustituye a la
> dirección visual descrita en `ARCHITECTURE.md`, que documenta la primera versión.

## Por qué se rehízo

La landing anterior no se leía como un solo sistema: el hero era una ilustración
2D muy saturada sobre un fondo recargado y el resto eran tarjetas planas con otra
tipografía y otro ritmo. Además mostraba un NYX dibujado distinto del NYX 3D que
el proyecto ya tiene, y no seguía la hoja de identidad del autor.

## Tres decisiones

1. **El protagonista es el modelo 3D real, en vivo.** El hero carga el mismo GLB
   de Casa Nodo: NYX respira, parpadea, gira hacia el cursor y reacciona. Es la
   demostración de tecnología 3D del sitio, no una imagen que la sugiere.
2. **La identidad sale de la hoja del autor** (`docs/references/nyx-identity.png`):
   Orbitron para títulos, Inter para texto, y la paleta violeta `#7C3AED`,
   índigo `#6366F1`, cian `#06B6D4`, esmeralda `#10B981` sobre azul noche `#0F172A`.
3. **Un único lenguaje de interfaz.** Toda la página usa las mismas cuatro piezas,
   definidas en `src/app/globals.css`:

| Pieza | Clase | Uso |
|---|---|---|
| Etiqueta técnica | `label-tech` | Microtexto en Orbitron: índices, estados, rótulos |
| Panel de cristal | `panel` | Única superficie para tarjetas y ventanas |
| Esquinas de visor | `hud-corners` | Marca los paneles principales de cada sección |
| Línea luminosa | `rule-glow` | Separadores y la guía del roadmap |

Cada sección abre igual: número, rótulo, línea y título en mayúsculas
(`components/ui/Section.tsx`).

## Hero en vivo

`components/hero/HeroStage.tsx` aplica mejora progresiva en tres niveles:

1. **Siempre**: un render de Blender del modelo (`nyx-3d-idle.webp`), servido con
   el HTML.
2. **Con WebGL y sin `prefers-reduced-motion`**: `HeroNyxCanvas.tsx` monta el
   modelo en vivo cuando el hero entra en pantalla y funde el render.
3. **Fuera de pantalla**: el bucle de render se pausa.

No hay controles de órbita en el hero para no secuestrar el scroll; el lienzo
usa `touch-action: pan-y`. La cámara libre está en `/casa-nodo`.

Las cifras del hero (triángulos, huesos, animaciones, peso) son las del informe
de exportación del GLB publicado. Si el modelo cambia, hay que actualizarlas en
`src/content/site.ts`.

## Contenido

- Sección nueva **Casa Nodo**, la única pieza con estado «Prototipo disponible»,
  con enlace al prototipo real.
- El roadmap marca «NYX en 3D» como prototipo disponible y añade NYX AI.
- NYX AI y Studio siguen rotulados como concepto, sin campos ni botones reales.
- No se añadieron estadísticas de uso, testimonios ni fechas.

## GitHub Pages

El sitio se publica bajo `/NYX`. Next no antepone el basePath a las rutas de
`public/`, así que todo recurso pasa por `withBase` (`src/content/nyx-assets.ts`).
Esto corrige además Casa Nodo, que pedía el GLB y el decodificador Draco sin el
prefijo y por tanto no podía cargarlos en la versión publicada.

## Verificación

- `npm run lint`, `npm run typecheck`, `npm run build`: sin errores.
- Build de GitHub Pages (`GITHUB_PAGES=true NEXT_PUBLIC_GITHUB_PAGES=true`):
  correcto. Servido en local bajo `/NYX`, la landing y Casa Nodo cargan el GLB,
  Draco y las imágenes con 200; el modelo aparece en menos de 1 s.
- Navegador a 1440, 1024 y 390 px: sin desbordamiento horizontal, sin errores en
  consola, reacciones funcionando.

No verificado: `prefers-reduced-motion` y ausencia de WebGL en un navegador real,
móvil real, Safari y Firefox, lectores de pantalla, Lighthouse, red lenta.

## Pendientes

- Orbitron es ancha: los títulos largos ocupan más líneas. Revisar si alguno
  conviene acortarlo.
- El logotipo sigue siendo provisional; la hoja de identidad define uno propio.
- El modelo y `three` suman peso a la portada (GLB de 2,5 MB). Se cargan después
  del primer pintado, pero conviene medirlo con red limitada.
- Las imágenes 2D anteriores (`nyx-welcome*.webp`, `creative-lab.webp`) ya no se
  usan y no se han añadido al repositorio.
- `ARCHITECTURE.md` describe la primera versión y necesita actualizarse.
