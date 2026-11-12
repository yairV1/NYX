# Continuar NYX sin perder avances

**Fecha:** 12 de noviembre de 2026 · **Rama de entrega:** `main`.

Este archivo es el punto de entrada para la próxima sesión. La publicación debe
hacerse solo con el candidato final validado, no con los intentos intermedios.

## Lo que quedó implementado

- Logo y favicon basados en la identidad aprobada (entrega anterior).
- Casa Nodo y landing con el personaje más cerca y con mayor presencia.
- Acabado de tejido del hoodie y mochila; herrajes y cordones con remates metálicos.
- Mochila con borde, cierre, tirador y señal cian, unidos a la armadura existente.
- Sección de identidad con retrato, saludo y espalda del modelo real.
- Composiciones propias para NYX AI, Studio y Labs; accesos a las secciones reales.
- Estilos nuevos encapsulados en módulos CSS, responsive y movimiento reducido.
- Generadores reproducibles de modelo, renders, imágenes web y validación.

## Estado del modelo

- Fuente final local: `artifacts/design-refinement/nyx-polished-v2.blend`.
- Exportación final local: `artifacts/design-refinement/nyx-polished-v2.glb`.
- Modelo servido: `public/assets/nyx/models/nyx-v2-refined.glb`.
- Conserva Nyx_rig v2 antropomórfico, sin audífonos fijos, 89 huesos y 17 acciones.
- No usar `nyx-polished.blend` sin el sufijo `-v2`: fue un candidato descartado.
  Su conversión de curvas aplicaba modificadores a otros objetos seleccionados.
  El script final deselecciona todo antes de convertir y comprueba la armadura.
- El original externo y la fuente de fase 4 se mantienen intactos.

## Lo que sigue, por prioridad

1. **Modelo:** retopología/LOD móvil de 30–60 mil triángulos conservando rayas, UVs,
   párpados y silueta. El actual todavía ronda los 100 mil; no reducir a ciegas.
2. **Expresividad:** mejorar `Thinking` (mano en barbilla), apertura de dedos al
   saludar y mirada dirigida. Revalidar ropa, mochila, párpados y transiciones.
3. **Acabado artístico:** revisar las proporciones del rostro y la silueta dentro
   de la identidad antropomórfica aprobada. No sustituir el personaje por un robot.
4. **Casa Nodo:** puntos interactivos con propósito y equivalentes de teclado;
   continuar enriqueciendo el mobiliario sin saturar el primer plano.
5. **Rendimiento:** medir móvil físico y Safari/Firefox; los controles de esta
   entrega se comprueban con Chromium y tamaños de pantalla emulados.
6. **Producto:** NYX AI sigue siendo una visión, sin backend conectado. Studio
   sí tiene un lienzo local exportable; capas/undo y generación real quedan pendientes.

## Cómo retomar

1. Leer `AGENTS.md`, `CLAUDE.md`, `docs/CONTINUIDAD.md` y
   `docs/design-refinement/README.md`.
2. Ejecutar `git status --short --branch` y revisar `git log -5 --oneline`.
3. No sobrescribir cambios ajenos. Hay cuatro imágenes `nyx-welcome*` y
   `creative-lab.webp` preexistentes y sin seguimiento; no son parte de esta entrega.
4. Iniciar `npm run dev -- --port 3110` y abrir `http://localhost:3110`.
5. Para comprobar interacción: `NYX_TEST_URL=http://localhost:3110 npm run test:e2e`.
6. Revisar las capturas y reportes de `docs/design-refinement/evidence`.

## Acuerdo de continuidad

El usuario autoriza guardar avances verificados y subirlos a `main`. En cada
punto de entrega: actualizar este README con cambios, comprobaciones, límites y
siguiente paso; hacer commit y push; comprobar GitHub Pages. No esperar a agotar
el contexto. No publicar un candidato conocido como defectuoso para ahorrar tiempo.
No se puede deducir el saldo de tokens de la cuenta desde este repositorio.

## Comprobaciones de este punto de entrega

Lint, TypeScript, build normal y build de GitHub Pages: correctos. Suite de
navegador: **7/7 pruebas**, incluyendo las tres anchuras, Studio/PNG, controles de
Casa Nodo, movimiento reducido y recuperación WebGL. GLB reimportado: una armadura,
89 huesos, 17 acciones, cero triángulos degenerados. Ver los reportes en
`docs/design-refinement/evidence`; no extrapolar estas pruebas a móviles físicos.
