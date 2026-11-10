# Biblioteca visual oficial de NYX

Esta carpeta contiene los recursos gráficos compartidos por la web, NYX Studio y los futuros módulos.

## Organización

- `character/`: imágenes completas de NYX, poses y variantes.
- `expressions/`: emociones y expresiones faciales.
- `logos/`: logotipo horizontal, símbolo e isotipo.
- `icons/`: iconografía propia de la marca.
- `backgrounds/`: fondos y escenarios del universo NYX.
- `illustrations/`: ilustraciones de secciones, tutoriales y estados vacíos.
- `studio/`: recursos visuales exclusivos de NYX Studio.

## Convenciones

- Nombres en minúsculas, separados con guiones: `nyx-saludando.webp`.
- Usar SVG para logos e iconos vectoriales; WebP/AVIF para ilustraciones rasterizadas; PNG cuando se necesite transparencia y no haya alternativa adecuada.
- Mantener la transparencia en imágenes del personaje que deban superponerse a distintos fondos.
- No subir archivos fuente pesados de Blender ni exportaciones gigantes a esta carpeta; almacenar las fuentes editables por separado y publicar versiones optimizadas.
- Evitar duplicados y conservar la identidad visual oficial.
- Verificar permisos de uso de cada recurso antes de incorporarlo.
- Referenciar desde componentes usando rutas absolutas: `/assets/nyx/character/nyx-principal.webp`.
- No usar archivos inexistentes: hasta importar las imágenes aprobadas, `NyxCharacter` mantiene su ilustración SVG como respaldo.

## Pendiente

Las imágenes oficiales aún no se han importado. Es necesario recopilar y confirmar los archivos originales (personaje, poses, logos, fondos) antes de sustituir los gráficos provisionales.

## Renders del modelo 3D — 10 de noviembre de 2026

`character/nyx-3d-idle.webp` y `character/nyx-3d-wave.webp` son renders de
Blender del modelo 3D real de NYX (rig v2), con fondo transparente. Se generan
con `tools/blender/render_poster.py` y se recortan a 640×1040.

- `nyx-3d-idle.webp`: respaldo del hero. Se pinta con el HTML y da paso al
  modelo en vivo cuando WebGL está listo; es lo único que ven quienes tienen
  `prefers-reduced-motion` o un navegador sin WebGL.
- `nyx-3d-wave.webp`: ilustra la sección de Casa Nodo.

La landing ya no usa ilustraciones 2D del personaje: todo lo que se ve de NYX
sale del mismo modelo 3D. Las rutas se registran en `src/content/nyx-assets.ts`
y pasan por `withBase` para funcionar bajo `/NYX` en GitHub Pages.
