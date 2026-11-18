# Orbis // Lunar Frontier

Página independiente pedida por especificación, entregada en
`public/orbis/index.html`. Un archivo HTML, CSS inline y JavaScript nativo;
no necesita Next, npm ni compilación para funcionar. La landing de NYX se conserva.
En GitHub Pages se publica bajo `/NYX/orbis/`.

Se mantienen los dos MP4 originales de media.kolpusites.com y las fuentes de Google.
Los vídeos no se reproducen: únicamente se modifica currentTime. Ambos permanecen
montados y opacos; se alterna z-index. Sin overlays sobre la imagen.

## Verificación

`python3 -m http.server 3120 --directory public` y `node tools/check-orbis.mjs`.
El comprobador es una herramienta de desarrollo y no se carga en la página.

- Chromium: vídeos originales accesibles (206), pausados en cero sin entrada.
- Avance a derecha/izquierda, vuelta al centro y barridos repetidos, manteniendo
  pausa y opacity:1 en ambos vídeos. Captura de la grabación en `evidence/crossover.webp`.
- 320, 375, 390, 768, 1440 y 2560 px: sin scroll horizontal/vertical.
- Menú: abrir, cerrar, Escape con foco restaurado, enlace y clic exterior.
- Reduced motion: vídeo inmóvil, hint oculto, sin listener de mousemove.
- Puntero táctil: inmóvil incluso si el navegador sintetiza eventos de ratón al tocar.
- Clases anim/play retiradas tras la entrada; ninguna llamada a reproducción.
- Sin errores JavaScript en las comprobaciones. No se validaron Safari/Firefox
  ni todos los escenarios de red/decodificación; no se garantiza ausencia de
  fallos del servidor externo de vídeos.

Detalles de la especificación que se respetan deliberadamente:

- El objetivo del clip inactivo se pone en cero, pero no se busca hasta que vuelve
  a activarse (sección 9). Su currentTime puede conservar el valor anterior mientras
  está debajo; el clip visible sí vuelve a cero en el centro. Esto difiere de una
  lectura literal del punto 3 de aceptación que pide ambos tiempos en cero.
- La duración real de los recursos es 4,041667 s, no se fuerza a cinco segundos.
- Los botones de navegación y Join The Mission no reciben destinos, formulario
  ni secciones inventadas: la especificación solo define esta pantalla.
- El burger conserva su color oscuro y la hoja móvil su fondo blanco.

La prueba de carga bloquea únicamente el mousemove sintético (0,0) que Chromium
headless emite al navegar, para medir el estado sin intervención. Después habilita
la entrada normal para las pruebas. Ese código no forma parte del HTML entregado.

A 768 px, la fila centrada con gap:22px se solapa 13,08 px con el CTA
(navRight 583,95 / ctaLeft 570,88). Se conservaron los valores exactos solicitados.
