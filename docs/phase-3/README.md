# Fase 3 — Biblioteca de animaciones, reacciones y optimización

> No hubo brief escrito para esta fase. El alcance lo eligió el autor: biblioteca
> de animaciones, interacción en Casa Nodo y optimización web. Este documento
> recoge lo hecho en la primera entrega y lo que queda.

## Qué cambió

| Aspecto | Fase 2 | Fase 3 |
|---|---|---|
| Clips en el GLB | 1 (`Idle_Secondary`) | 17 |
| Tamaño del GLB | 3 316 624 bytes | 2 486 736 bytes |
| Texturas | PNG 1024 px | WebP 1024 px (`EXT_texture_webp`) |
| Boca en las animaciones | sin conexión con los controles | `MouthOpen` y `Smile` siguen los controles |
| Casa Nodo | NYX en reposo | 16 reacciones por botón o tocando a NYX |
| Indicador de carga | ninguno | estado visible: cargando / reposo / reacción |

El GLB baja de 3 MB, que era el objetivo pendiente, aun con 16 clips más.
La geometría no cambia: 51 032 triángulos, un único skin `RIG_Nyx` de 89 joints,
0 caras degeneradas y 0 aristas de longitud cero tras reimportar.

## Inventario de acciones

El `.blend` contiene 29 acciones:

- **22 del rig actual `RIG_Nyx`**: 21 de la biblioteca v2 más `Idle_Secondary`.
- **7 de la armadura antigua `NyxRig`** (`Bailar`, `Caminar`, `Dormir`,
  `Pulgar arriba`, `Reposo`, `Saltar`, `Saludar`). Animan 25 huesos que no
  existen en `RIG_Nyx`. No se exportan ni se pueden reutilizar sin rehacerlas.

De las 22 actuales se exportan 17. Quedan fuera cinco:

| Acción | Motivo |
|---|---|
| `Idle` | Sustituida por `Idle_Secondary` (la misma con resortes de cola y orejas) |
| `Sit`, `ReturnToIdle`, `Sleeping` | Marcadas con deformación fuera de rango en la documentación del personaje |
| `WalkTest` | Ciclo en el sitio; la escena aún no tiene desplazamiento |

## Contrato de nombres

Se adopta la convención ya escrita en el proyecto del personaje
(`NYX_ANIMATIONS.md`): PascalCase en inglés y nombres antiguos conservados en el
GLB como alias. No se renombró nada en Blender. La web usa nombres canónicos y
los resuelve en `src/lib/nyx/clips.ts`.

| Canónico (web) | Clip en el GLB | Botón | Duración |
|---|---|---|---|
| `Idle_Secondary` | `Idle_Secondary` | — (bucle de reposo) | 4,0 s |
| `Wave` | `Wave` | Saludar | 3,0 s |
| `Point` | `Point` | Señalar | 2,5 s |
| `Talk` | `Talking` | Hablar | 1,3 s |
| `Idle_LookAround` | `LookAround` | Mirar alrededor | 4,4 s |
| `Blink` | `Blink` | Parpadear | 1,0 s |
| `Wink` | `Wink` | Guiñar | 2,0 s |
| `Happy` | `Happy` | Alegría | 3,0 s |
| `Celebrate` | `Celebrating` | Celebrar | 2,0 s |
| `Laugh` | `Laughing` | Reír | 2,0 s |
| `Curious` | `Curious` | Curiosidad | 3,0 s |
| `Think` | `Thinking` | Pensar | 2,0 s |
| `Surprise` | `Surprised` | Sorpresa | 2,0 s |
| `Confused` | `Confused` | Confusión | 2,0 s |
| `Sad` | `Sad` | Tristeza | 2,0 s |
| `Angry` | `Angry` | Enfado | 2,0 s |
| `Tired` | `Tired` | Cansancio | 2,0 s |

`Talk` es un nombre nuevo de esta web; el resto de alias coincide con los del
proyecto del personaje.

## Cambios en las herramientas de Blender

- `export_web.py`: `--action` se puede repetir (una animación glTF por acción),
  `--image-format WEBP`, `--only-lids` para un paquete de solo animaciones (no se
  usa todavía) y optimización del tamaño de animación activada.
- `refine_phase2.py`: las claves `MouthOpen` y `Smile` de labios y cavidad llevan
  drivers hacia `CTRL_mouth_open` y `CTRL_mouth.L/R`. Los rangos salen de la
  biblioteca: la escala llega a 15 y las comisuras suben 0,022.
- `render_face_review.py`: mueve la boca con los controles cuando hay drivers.

Límite conocido: `Smile` solo cubre la subida de comisuras. `Sad`, `Angry`,
`Confused` y `Thinking` las bajan, y ese gesto no se ve en la boca nueva.

Reproducir:

```bash
mkdir -p artifacts/phase-3
blender --background --python-exit-code 1 artifacts/phase-2/nyx-v2-casa-nodo.blend \
  --python tools/blender/refine_phase2.py -- --out artifacts/phase-3/nyx-v2-clips.blend

ACTIONS=""
for a in Idle_Secondary Wave Point Happy Curious LookAround Thinking Surprised \
         Confused Sad Angry Tired Laughing Wink Celebrating Talking Blink; do
  ACTIONS="$ACTIONS --action $a"
done
blender --background --python-exit-code 1 artifacts/phase-3/nyx-v2-clips.blend \
  --python tools/blender/export_web.py -- --out artifacts/phase-3/nyx.glb \
  --draco --texture-size 1024 --image-format WEBP $ACTIONS
```

## Casa Nodo

- `src/lib/nyx/clips.ts`: contrato de clips, etiquetas y grupos.
- `NyxModel.tsx`: reproduce el clip pedido una vez, con fundido desde el reposo y
  de vuelta; avisa al terminar. Tocar a NYX lanza `Wave`.
- `CasaNodoPreview.tsx`: botones agrupados en Acciones y Emociones, con
  `aria-pressed`, desactivados hasta que el modelo carga, y un estado con
  `role="status"`.
- Con `prefers-reduced-motion` NYX sigue en reposo y solo se mueve cuando el
  visitante elige una reacción; el lienzo vuelve a renderizar bajo demanda al
  terminar.

## Verificación

- `npm run lint`, `npm run typecheck`, `npm run build`: sin errores.
  `npm audit`: 0 vulnerabilidades.
- Validación de parpadeo en 9 etapas: pasa con el modelo regenerado
  (`evidence/blink-validation.json`).
- Escritorio (1440×900): `Saludar`, `Reír` y `Sorpresa` cambian el estado, se ve
  el brazo levantado y la boca abierta, y al terminar vuelve a «NYX está en
  reposo». Tocar a NYX lanza el saludo. Cero errores en consola.
- Móvil (390×844): sin desbordamiento horizontal, botones de 44 px de alto,
  `Celebrar` se reproduce.

No verificado:

- Los 16 clips uno por uno en el navegador; se probaron cuatro.
- `prefers-reduced-motion` en un navegador real (solo revisado en código).
- Dispositivo móvil real, Safari y Firefox.
- Tiempo de carga en producción ni en una red lenta.

Corrección posterior: la primera versión de este documento decía que NYX tardaba
entre 10 y 20 s en aparecer. Era un artefacto de la prueba (la página se medía en
una pestaña oculta, donde el navegador pausa el render). Con la pestaña visible,
en desarrollo y en local, el modelo aparece en menos de 1 s.

## Corrección del parpadeo en el navegador

El parpadeo se veía bien en Blender pero rompía la cara de NYX en la web: los
párpados atravesaban la cabeza. Los ocho pasos eran claves relativas encadenadas
(cada una respecto de la anterior). glTF no tiene claves encadenadas: exporta
cada paso respecto de la malla base y el navegador las suma. Con el ojo cerrado
los ocho pesos valían 1 y el párpado recorría 36 pasos en vez de 8.

- `refine_phase2.py`: cada paso es ahora una posición absoluta respecto de
  `Basis` y los drivers funden entre pasos vecinos, de modo que los pesos nunca
  suman más de 1.
- `check_glb_blink.py` (nuevo): reconstruye cada fotograma con la fórmula del
  navegador (`base + Σ peso·delta`) leyendo los pesos del propio GLB y mide
  cuánto se aleja el párpado de la esfera del ojo.

| | Antes | Después |
|---|---|---|
| Desviación máxima del párpado (radio del ojo 0,168) | 0,5004 | 0,0003 |
| Suma máxima de pesos | 8,00 | 1,00 |

Resultado en `evidence/glb-blink-check.json`. La validación anterior
(`validate_refinement.py`) solo comprobaba el `.blend`, por eso no lo detectó.

## Pendientes

- Decidir qué clips se quedan: 16 botones es un catálogo de prueba, no un diseño.
- Los clips «de emoción» terminan en pose y la web los devuelve al reposo; no
  hay expresiones mantenidas ni capa facial aditiva.
- Sin movimiento secundario (cola, orejas) fuera de `Idle_Secondary`.
- Sin mirada al cursor. El proyecto del personaje ya tiene un controlador con
  capa procedural (`NyxController`); valorar integrarlo en vez de reescribirlo.
- Corregir `Sit`, `ReturnToIdle` y `Sleeping` antes de exportarlos.
- Gesto de comisuras hacia abajo en la boca nueva.
- En pantallas táctiles la escena captura el gesto de desplazamiento, así que
  cuesta pasar de la escena a los botones. Es anterior a esta fase.
- Medir la carga en un build de producción y con red limitada.
- Siguen abiertos los pendientes artísticos de la Fase 2 (decimación, mejillas).
