# Continuidad de NYX — leer antes de retomar

Actualizado el 11 de noviembre de 2026. Esta guía permite continuar sin depender del historial del chat.

## 1. Objetivo y decisiones del autor

NYX es la identidad digital de **YAIR // AI**. Debe sentirse futurista, amigable, creativo y propio; el objetivo es una experiencia inmersiva con un personaje vivo, no una colección de tarjetas tecnológicas genéricas.

- Hogar principal aprobado: **Casa Nodo**. Jardín de lo Posible y Distrito Umbral quedan para el futuro.
- Personaje aprobado: **Nyx_rig v2 antropomórfico**, gato atigrado, hoodie azul marino y mochila morada. Evolucionarlo, no sustituirlo ni rehacerlo sin motivo.
- Audífonos sólo en concentración, no permanentes. Actualmente el modo Concentración cambia la luz; todavía no equipa audífonos.
- Lema: «Tu compañero en el código y en la vida».
- Colores de marca: `#7C3AED`, `#6366F1`, `#06B6D4`, `#10B981`, `#E5E7EB`, `#0F172A`. La web utiliza derivados para texto y contraste.
- Inter en lectura y mensajes principales; Orbitron en marca y detalles tecnológicos.
- No simular una IA operativa ni anunciar un editor completo que todavía no existe.

El autor autorizó integrar esta entrega y esta documentación en `main`. Esta autorización corresponde a esta entrega; al retomar, comprueba rama, estado de Git y alcance de la nueva petición antes de publicar nuevos cambios.

## 2. Qué se hizo

### Base 3D anterior, ya integrada antes de esta entrega

Los commits `3043968`, `f99553d` y `4967ebf` contienen la primera portada con modelo en vivo y reparaciones de personaje. El merge `33c2b38` los incorporó a `main` antes del cierre de esta entrega.

Se documentaron correcciones del parpadeo, cuello del hoodie, dirección del brazo en Wave, intersecciones del cuerpo bajo la ropa y exportación del material. Ver [Fase 4](phase-4/README.md) para su evidencia; no atribuir estas modificaciones a la nueva habitación.

### Última evolución: Casa Nodo / After Hours

- Portada y explorador comparten la misma habitación R3F.
- Entorno nuevo: escritorio, monitor con terminal ilustrativa, teclado, lámpara, taza, silla, plantas, libros, ciudad nocturna y núcleo animado.
- Texturas de ciudad/terminal propias dibujadas mediante Canvas; póster del entorno capturado en navegador.
- Tres encuadres de cámara; tres ambientes de iluminación; controles de lámpara y pausa; reacciones del personaje.
- Reorganización visual de portada, presentación, Casa Nodo y Studio; huella como símbolo y favicon.
- Primer lienzo de Studio real: texto, paleta, formato, persistencia local y PNG. No utiliza IA ni envía textos a un servidor.
- Controlador de reacciones compartido. Temporizadores y acciones salientes se limpian; arrastrar no debe activar el saludo.
- Respaldo visual recuperable ante errores o pérdida de WebGL; soporte de movimiento reducido y pausa de render fuera de pantalla.
- Adaptación a móvil/tablet; DPR 1 y sombras dinámicas desactivadas hasta 1023 px.
- Suite de siete pruebas de navegador y workflow de calidad para PRs.

## 3. Estado técnico que no se debe confundir

| Elemento | Estado |
|---|---|
| App | Next.js App Router, React, TypeScript, Tailwind. Sitio exportable a estático. |
| 3D | Three.js, React Three Fiber y drei. No hay Rapier en esta implementación. |
| Modelo | `public/assets/nyx/models/nyx-v2-refined.glb`: 3.037.988 bytes, 99.448 triángulos, 89 huesos, 17 clips según evidencia de fase 4. |
| Rig | Una armadura exportada. La entrega visual no cambia malla, pesos, shape keys ni rig. |
| Reposo | `Idle_Secondary`; las otras 16 acciones son reacciones de una reproducción. |
| Habitación | Procedural en `NodoRoom.tsx`; no existe un nuevo `.blend` de esta habitación. |
| IA | Sin proveedor, backend, credenciales, límites de uso o conversaciones reales. |
| Studio | Un compositor local acotado. No es todavía un editor de capas ni generación asistida. |
| Rendimiento | Adaptaciones de render implementadas. Sin certificación en hardware móvil real; sin LOD geométrico. |

El objetivo anterior de 30–60 mil triángulos **sigue pendiente** para una variante ligera. No describir el modelo actual como si ya lo cumpliera.

## 4. Dónde tocar cada cosa

| Trabajo | Archivos de partida |
|---|---|
| Mensaje y composición de portada | `src/components/hero/Hero.tsx`, `HeroStage.tsx` |
| Entorno, mobiliario y materiales | `src/components/world/NodoRoom.tsx` |
| Cámara, iluminación y render | `src/components/casa-nodo/CasaNodoScene.tsx` |
| Controles del explorador | `src/components/casa-nodo/CasaNodoPreview.tsx` |
| GLB, mixer y transiciones | `src/components/casa-nodo/NyxModel.tsx` |
| Contrato de clips y controlador | `src/lib/nyx/clips.ts`, `useNyxReactions.ts` |
| Visibilidad y movimiento reducido | `src/lib/nyx/useSceneActivity.ts` |
| Editor local | `src/components/studio/StudioCanvas.tsx` |
| Recursos y prefijo `/NYX` | `src/content/nyx-assets.ts` |
| CSS e identidad | `src/app/globals.css`, `docs/DESIGN-SYSTEM.md` |
| Regresiones web | `tests/experience.spec.ts`, `playwright.config.ts` |
| Exportación y validación Blender | `tools/blender/`, `docs/phase-4/README.md` |

La fuente Blender registrada en fase 4 está fuera de este repositorio: `/home/yair/Proyectos/nyx/blender/source/Nyx_master.blend`. Comprueba su existencia antes de trabajar. Los derivados de `artifacts/` están ignorados por Git. Otro equipo necesitará esos archivos fuente; el README por sí solo no los transfiere. No sobrescribir el original.

## 5. Qué hacer después, en orden

### P1 — Primera tarea al retomar: medir y preparar una variante móvil

1. Leer el reporte del GLB y la cadena de exportación de fase 4; localizar la fuente Blender y los derivados disponibles.
2. Medir la escena actual: llamadas de dibujo, triángulos evaluados, texturas, memoria estimada y tiempos de fotograma. Registrar navegador, dispositivo, resolución y DPR.
3. Crear un candidato separado de 30–60 mil triángulos. Proteger silueta, UV/rayas, cara, articulaciones y shape keys; no aplicar una reducción global ciega.
4. Validar una importación limpia del GLB, armadura única, nombres de clips, parpadeo, boca, cuello, saludo y deformación en extremos. Comparar renders con las mismas cámaras.
5. Integrar el candidato como variante ligera con selección de calidad y alternativa al fallo. Conservar el asset actual hasta validar visualmente el reemplazo.

**Termina cuando:** existe un GLB ligero medido, los gestos no regresan y la web puede utilizarlo sin romper la variante actual. Si la fuente no está disponible, documentar el bloqueo y continuar con mediciones web; no inventar una retopología terminada.

### P2 — Personalidad y animaciones

- Revisar todas las acciones y sus transiciones completas, no sólo un fotograma.
- Mejorar `Thinking`: en la revisión anterior el puño quedaba cerca del hombro y el gesto se leía poco.
- Pulir parpadeo, sonrisa/apertura de boca y movimientos secundarios preservando el rig v2.
- Añadir mirada/cabeza reactiva con límites naturales; no confundir girar todo el modelo con seguimiento ocular.
- Explorar una acción corta de trabajar en el escritorio y una bienvenida contextual. Audífonos sólo si se implementa el accesorio y su estado explícito.

**Termina cuando:** las acciones se leen claramente, no hay intersecciones y los clips/transiciones se verifican en el GLB real dentro del navegador.

### P3 — Dar propósito a los objetos del hogar

- Convertir escritorio, núcleo y mochila en puntos de exploración con alternativas HTML accesibles.
- Hacer que el recorrido conecte con funciones reales: Studio, proyectos y explicación del futuro asistente.
- Pulir iluminación/materiales a partir de capturas comparables, manteniendo legibilidad y composición móvil.
- Conservar pausa, teclado, movimiento reducido y respaldo sin WebGL.

**Termina cuando:** cada interacción tiene una consecuencia útil y no depende exclusivamente de acertar un objeto 3D con el puntero.

### P4 — Una primera función real de NYX AI

Propuesta concreta: ayudar a convertir una idea de proyecto en un breve plan editable. Antes de implementar, acordar proveedor, alojamiento de servidor y presupuesto de uso.

- Las claves deben estar en servidor; GitHub Pages es estático y no protege secretos ni ejecuta rutas API.
- Definir el contrato de petición/respuesta, límites, tratamiento de errores y política de datos antes de conectar el proveedor.
- Mostrar estados reales de carga, error y servicio no disponible. No usar una respuesta predeterminada como si fuera inferencia real.
- Vincular la salida a una acción concreta del producto, por ejemplo crear un borrador de Studio.

**Termina cuando:** existe una función completa y verificable de extremo a extremo, con límites de uso y sin credenciales expuestas.

### P5 — Evolucionar Studio

- Separar el modelo del documento del motor de dibujo.
- Añadir deshacer/rehacer y exportación/importación de un proyecto versionado.
- Después añadir selección/movimiento de elementos y capas, con teclado y controles táctiles.
- Mantener coincidencia entre vista previa y exportación, manejo de errores y validación de archivos importados.

**Termina cuando:** un diseño se puede guardar, reabrir y editar sin pérdida, con pruebas de persistencia y exportación.

### Pendientes transversales

- Probar Safari, Firefox y teléfonos reales; ampliar breakpoints a 360/1024 px.
- Evaluar navegación por teclado, lectores de pantalla y contrastes de microtexto.
- Dividir los estilos por experiencia cuando la siguiente modificación lo justifique, evitando acumular reglas contradictorias.
- Mantener actualizados arquitectura, estados del producto y capturas.

## 6. Validación y publicación

Desde una instalación limpia:

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
npm audit
```

Para GitHub Pages:

```sh
GITHUB_PAGES=true NEXT_PUBLIC_GITHUB_PAGES=true npm run build
```

Las siete pruebas actuales cubren composición a 390/768/1440 px, menú móvil, borrador/exportación PNG, controles y retorno al idle, movimiento reducido y pérdida de WebGL. Ver [evidencia](phase-5/README.md). Los ensayos de navegador usan SwiftShader: no equivalen a un benchmark en teléfono físico.

Un push a `main` activa `.github/workflows/deploy-pages.yml`. Revisar Actions hasta conocer su resultado; no afirmar que el sitio está publicado basándose sólo en un push exitoso. El workflow de calidad se ejecuta en PRs y por activación manual.

No versionar `node_modules`, `out`, `.next`, trazas completas de pruebas, credenciales ni derivados Blender voluminosos. Las capturas seleccionadas sí están en `docs/phase-5/evidence`.

## 7. Mensaje listo para retomar

> Continúa NYX leyendo primero AGENTS.md, CLAUDE.md, README.md, docs/CONTINUIDAD.md y docs/ARCHITECTURE.md. Revisa Git y los archivos existentes antes de cambiar nada. Conserva Casa Nodo, Nyx_rig v2 antropomórfico, hoodie azul marino, mochila morada y audífonos sólo en concentración. Empieza por P1 de la guía: medir el render actual y preparar una variante móvil de 30–60 mil triángulos sin perder identidad, rig, expresiones ni animaciones. Trabaja sobre una copia, conserva el GLB actual, valida el export real y presenta evidencia antes/después. No anuncies IA ni funcionalidades que no existan. Si faltan fuentes Blender, indícalo y avanza con la medición web. Al terminar, actualiza esta guía con resultados, pendientes y la siguiente tarea concreta.
