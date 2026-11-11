# Casa Nodo / After Hours — evolución de la experiencia

11 de noviembre de 2026. Implementado sobre `feature/nyx-3d-quality`. El autor autorizó después integrar esta entrega en `main` y conservar una guía de continuidad. El despliegue se confirma por separado en GitHub Actions. Ver [CONTINUIDAD.md](../CONTINUIDAD.md).

## Resultado

La portada comparte un entorno real con Casa Nodo. NYX está junto a su escritorio, frente a una ciudad nocturna, con luz cálida, plantas, libros, una silla para el visitante y un núcleo de ideas animado. La composición editorial sustituye la ficha de especificaciones del hero y reduce la repetición de tarjetas.

Casa Nodo dispone de tres encuadres guiados, exploración orbital, tres ambientes, lámpara, pausa y las 16 reacciones existentes. Cambiar de cámara conserva la instancia del modelo. La interfaz se apila en tablet/móvil y reduce el coste de render en pantallas pequeñas.

El primer lienzo de Studio ya permite editar un título y subtítulo, escoger entre tres paletas y dos formatos, recuperar el borrador local y descargar un PNG de 1600×1000 o 1600×1600. La previsualización y la descarga utilizan el mismo Canvas. La exportación espera a que se haya dibujado la revisión actual del diseño.

La marca de navegación y el favicon recuperan la huella de NYX. El rig v2 y el GLB se mantienen intactos. No se añaden audífonos permanentes.

## Robustez

- Controlador de reacciones compartido y peticiones monotónicas.
- Fundido y detención de acciones salientes, limpieza de temporizadores/eventos.
- Arrastrar la escena no dispara un saludo accidental al soltar.
- Póster restaurado tras un error tardío o pérdida de contexto WebGL; Casa Nodo permite reintentar.
- Suspensión fuera de pantalla y en pestañas ocultas; pausa manual y movimiento reducido.
- DPR 1 y sin mapas de sombra dinámicos en tablet/móvil. DPR hasta 1,5 en escritorio.
- Editor desactivado hasta completar la recuperación inicial del borrador para evitar que la hidratación sobrescriba una edición temprana.
- Configuración de pruebas reproducible y workflow de comprobación de PRs, independiente del despliegue.

## Verificación

| Comprobación | Resultado |
|---|---|
| `npm run lint` | Sin errores ni advertencias en la verificación final |
| TypeScript / build normal | Correctos |
| Build estático con ambas variables de GitHub Pages | Correcto |
| Navegación y modelo bajo `/NYX/` en servidor estático | Sin errores JS ni respuestas HTTP fallidas; móvil sin desbordamiento |
| Playwright | 7 pruebas aprobadas |
| `npm audit` | 0 vulnerabilidades conocidas |
| `git diff --check` | Sin errores de espacios |

Las pruebas cubren 390, 768 y 1440 px; menú y Escape; persistencia y PNG real; reacción y retorno al reposo; lámpara, cámara y ambientes; movimiento reducido y restauración del póster al perder WebGL. La prueba de exportación comprueba la firma PNG, sus dimensiones y que contiene datos de imagen.

Durante la validación se corrigió una carrera de hidratación del editor. Una ejecución con dos procesos de captura simultáneos superó el límite de tiempo del caso 3D en SwiftShader; la ejecución posterior de la suite completa terminó correctamente. No se interpretan estos tiempos como rendimiento de una GPU física.

## Evidencia visual

Capturas reales del navegador. Las del entorno actual no son conceptos ni imágenes generadas por IA.

- [Portada anterior](evidence/before-home.png) / [Portada actual](evidence/after-home-1440.png).
- [Casa Nodo anterior](evidence/before-casa.png) / [Casa Nodo actual](evidence/after-casa-1440.png).
- [Escena de portada móvil](evidence/after-stage-390.png) / [Casa Nodo móvil](evidence/after-casa-390.png).
- [Studio escritorio](evidence/after-studio-1440.png) / [Studio móvil](evidence/after-studio-390.png).

Para regenerarlas con la app iniciada:

```sh
NYX_CAPTURE_URL=http://localhost:3000 node tools/capture-experience.mjs
```

El script también crea el póster WebP del entorno real. Usa Playwright y Sharp, disponible en la instalación de Next.

## Límites explícitos

- NYX AI sigue siendo un concepto; no hay servicio de conversación, autenticación o backend conectado.
- Studio es un experimento local de composición, no el editor completo ni generación con IA.
- El modelo conserva los 99.448 triángulos de fase 4. La mejora móvil reduce píxeles y pases de sombra; no es una retopología ni un LOD nuevo.
- No se modifican topología, párpados, boca ni pesos de skinning. Las mejoras de esta iteración son entorno, presentación, interacción y robustez web.
- No se ha certificado rendimiento en teléfonos físicos ni toda la compatibilidad Safari/Firefox.
- No se instalaron servicios de pago ni se usaron APIs con credenciales. Las nuevas dependencias directas son de desarrollo: Playwright y Prettier.

La siguiente evaluación visual debe hacerse visitando el espacio y probando Studio. Una puntuación de diseño es un juicio editorial, no una métrica que el código pueda garantizar.
