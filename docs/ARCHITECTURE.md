# Arquitectura actual de NYX

Actualizado el 11 de noviembre de 2026. Describe el código de esta rama, no una promesa de funcionalidades futuras.

## Alcance real

- `/`: web editorial, Casa Nodo en tiempo real, explicación de NYX AI, ecosistema, primer lienzo funcional de Studio e historia/roadmap.
- `/casa-nodo`: explorador del mismo entorno 3D con encuadres, luz, ambientes y reacciones del personaje.
- Studio permite editar texto, elegir una paleta/formato y exportar una imagen PNG. Guarda un borrador local si el almacenamiento del navegador lo permite.
- NYX AI sigue siendo una visión ilustrativa. No hay modelo de IA conectado, API de conversación, cuentas, base de datos ni generación remota. El lienzo no es el editor completo anunciado a futuro.

## Stack y separación

Next.js App Router + React + TypeScript + Tailwind CSS. Las páginas y secciones editoriales son Server Components; los límites interactivos usan `use client`. La configuración conserva la exportación estática para GitHub Pages.

```text
app/page.tsx                         Composición editorial del inicio
├── hero/Hero.tsx                    Mensaje y navegación al universo
│   └── HeroStage.tsx                Carga diferida, póster, pausa y reacciones
│       └── CasaNodoScene.tsx        Canvas compartido (vista hero)
├── sections/*                      Presentación y estados reales del producto
└── studio/StudioCanvas.tsx          Editor local y exportación Canvas 2D

app/casa-nodo/page.tsx
└── CasaNodoPreview.tsx              Controles accesibles y estados de la visita
    └── CasaNodoScene.tsx            Canvas compartido (vista exploración)
        ├── world/NodoRoom.tsx       Entorno procedural y texturas Canvas propias
        ├── NyxModel.tsx             GLB, esqueleto clonado y AnimationMixer
        └── CameraRig               Tres encuadres y controles orbitales

lib/nyx/clips.ts                     Contrato GLB y tipos de peticiones
lib/nyx/useNyxReactions.ts           Controlador único de reacciones
lib/nyx/useSceneActivity.ts          Visibilidad, pestaña activa, movimiento reducido
world/SceneBoundary.tsx             Contención de errores y restauración del póster
content/nyx-assets.ts                Rutas públicas y prefijo de GitHub Pages
content/site.ts                     Texto editorial compartido y estados tipados
```

La geometría, materiales y animaciones del personaje siguen en el GLB de fase 4. La habitación es geometría declarativa de R3F; no se presenta como un nuevo archivo Blender. No se han cambiado el rig, los pesos, los párpados ni la malla del personaje en esta iteración.

## Contratos 3D

- Asset: `public/assets/nyx/models/nyx-v2-refined.glb`, 3.037.988 bytes, 99.448 triángulos, una armadura de 89 huesos y 17 clips según la auditoría de fase 4.
- `Idle_Secondary` es el ciclo base. Las otras 16 acciones se reproducen una vez. Cada petición tiene un identificador monotónico y el mixer vuelve al reposo mediante fundido.
- Las acciones terminadas o interrumpidas se detienen; los eventos y temporizadores se retiran al desmontar.
- Los clics con desplazamiento superior a 5 píxeles no activan una reacción después de arrastrar la cámara.
- El cambio de encuadre modifica cámara/target; no vuelve a descargar el GLB ni remonta la escena.
- Medianoche, Aurora y Concentración son ambientes de luz. No se afirma que Concentración añada audífonos al modelo.
- El movimiento del núcleo es una rotación procedural. No se utiliza Rapier ni se simula física de ropa.

## Carga, accesibilidad y degradación

El Canvas se importa dinámicamente desde componentes cliente con `ssr: false`. Un observador de intersección difiere la carga y suspende el render fuera del viewport. También se suspende en pestañas ocultas.

La portada con movimiento reducido muestra primero un póster real de la habitación; la entrada al 3D es voluntaria. En el explorador el personaje y el núcleo se quedan quietos con movimiento reducido, salvo una reacción solicitada por el visitante. Los encuadres son instantáneos en ese modo. Existe pausa manual en ambas vistas.

En anchos de hasta 1023 px el render usa DPR 1 y omite sombras dinámicas; en escritorio DPR hasta 1,5 y un mapa de sombras de 1024 px. Esto reduce coste de píxeles y pases, pero **no es un LOD de geometría**: el personaje conserva sus 99.448 triángulos. La reducción a 30–60 mil requiere una variante de asset validada por separado.

El póster permanece durante la carga. Un error del árbol o una pérdida del contexto WebGL vuelve a mostrarlo, incluso después de una carga exitosa. Casa Nodo ofrece reintento. La portada conserva sus enlaces sin WebGL. Los encuadres, ambientes, pausa y reacciones tienen controles HTML accesibles por teclado.

## Studio local

`StudioCanvas` tiene un único borrador tipado y validado al restaurarlo. No interpreta HTML y limita la longitud del texto. El dibujo Canvas 2D es el mismo usado en la previsualización y el PNG exportado (1600×1000 o 1600×1600). Los recursos son del mismo origen. Un fallo de `localStorage` no bloquea el editor. No se requieren credenciales, servicios ni facturación.

## Recursos y despliegue

No se incorporaron imágenes de galerías ni texturas externas. Cielo, ciudad y terminal se dibujan de forma determinista con Canvas. `casa-nodo-after-hours.webp` es una captura del entorno real del navegador, no un concepto generado por IA. Las fuentes Inter y Orbitron se sirven mediante `next/font`.

Para GitHub Pages, el workflow establece **ambas** variables `GITHUB_PAGES=true` y `NEXT_PUBLIC_GITHUB_PAGES=true`. La primera configura `output: export` y `basePath`; la segunda prefija recursos públicos mediante `withBase`. No deben configurarse por separado. Los enlaces internos usan `next/link`.

## Verificación y límites

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
npm audit
```

Las pruebas de navegador cubren composición en 390/768/1440 px, menú móvil, edición/persistencia/exportación PNG, controles de Casa Nodo, retorno al reposo, movimiento reducido y pérdida de WebGL. Los resultados de la iteración y las capturas se registran en `docs/phase-5/README.md`.

No se ha certificado rendimiento en teléfonos físicos ni compatibilidad completa de Safari/Firefox. El siguiente crecimiento arquitectónico debe responder a una primera función de IA concreta: separar proveedor, secretos, límites de uso y persistencia cuando exista ese alcance. No añadir un backend sólo para decorar una demo estática.
