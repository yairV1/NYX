# NYX — Casa Nodo / After Hours

Dirección implementada en la iteración de noviembre de 2026.

## Intención

NYX vive en un lugar, no dentro de un visor de especificaciones. La portada presenta a su anfitrión dentro del mismo espacio que luego se visita en Casa Nodo. Se combina un laboratorio digital nocturno con señales de hogar: cerámica, luz cálida, plantas, libros, una silla para el visitante y un escritorio usado.

## Jerarquía visual

- Inter en los mensajes principales: frases humanas, tamaños fluidos, peso medio y espacio suficiente para leer.
- Orbitron en marca y detalles técnicos, sin convertir todos los textos en mayúsculas.
- Fondo azul noche `#080D18`; texto claro `#EEF1FB`; texto secundario derivado `#A9B2CF`.
- Violeta suave `#B9A2FF` para acciones y énfasis. Paleta de marca `#7C3AED`, `#6366F1`, `#06B6D4`, `#10B981` en escena, temas y señales.
- Luz de escritorio cálida para contrastar con la ciudad azul y el borde violeta. El brillo tiene un origen físico en lámpara, pantalla o detalle del mobiliario.
- Secciones con ritmo: portada espacial, declaración editorial, ventana al hogar, visión del asistente, ecosistema y lienzo funcional. Reducir el uso repetido de tarjetas idénticas.

## Composición y movimiento

Escritorio: texto en el tercio izquierdo, escena abierta a la derecha, controles discretos. Tablet y móvil: mensaje y escena apilados; no permitir que el canvas invada el texto. Casa Nodo usa un panel de exploración lateral en escritorio y debajo del escenario en pantallas estrechas.

El visitante decide cuándo saludar, cambiar la luz o explorar otra perspectiva. La cámara interpola entre encuadres sin remonte del modelo. Pausa manual y movimiento reducido controlan el ambiente. Las acciones HTML siguen disponibles por teclado.

## Identidad

Se conserva Nyx_rig v2 antropomórfico, gato atigrado con hoodie azul marino y mochila morada. Esta iteración no modifica su malla ni añade audífonos fijos. El objetivo visual es dar contexto y presencia al asset real, sin sustituirlo por un render que prometa un modelo distinto.

## Honestidad funcional

Casa Nodo es una experiencia 3D real. El primer lienzo de Studio produce un PNG real, en el navegador. La conversación de NYX AI sigue rotulada como ilustrativa. No se muestran cifras de usuarios, experiencias de clientes ni capacidades inventadas.

## Sistema unificado

La página mezclaba dos lenguajes: el de «After Hours» (portada, personaje, Casa
Nodo, Studio) y el anterior de paneles y rótulos cian (NYX AI, ecosistema,
historia, roadmap). Ahora hay uno solo, definido como tokens en
`src/app/globals.css`.

### Tipografía

Orbitron para títulos (`h1`, `h2`) y rótulos; Inter para todo lo demás. Los
títulos van en caja normal; solo los rótulos van en mayúsculas.

| Token | Tamaño | Uso |
|---|---|---|
| `--text-label` | 11 px | Rótulos, estados, números de sección |
| `--text-caption` | 12 px | Notas y texto de apoyo |
| `--text-body-sm` | 14 px | Texto secundario, botones |
| `--text-body` | 16 px | Lectura |
| `--text-lead` | 18 px | Entradillas |
| `--text-title` | 20 px | Títulos de tarjeta |
| `--text-heading` | fluido, 26–40 px | Títulos de sección |
| `--text-display` | fluido, 34–64 px | Titular de portada |

Ningún texto baja de 11 px. Los tokens también existen como utilidades de
Tailwind (`text-label`, `text-heading`…). Quedan fuera de la escala los glifos
decorativos de las tarjetas del ecosistema.

### Cabecera de sección

Todas las secciones abren igual: rótulo `.eyebrow` con el número («03 / NYX AI»)
y título. `components/ui/Section.tsx` lo aplica; las secciones con maquetación
propia usan las mismas clases. La numeración es corrida, del 01 al 07.

### Color

- Lila (`--color-violet-soft`, `#C1AFFF`): énfasis, números de sección, acción
  principal.
- Cian (`--color-signal`): solo estados en vivo o en curso y el foco de teclado.
- Texto: `starlight` (principal), `mist` (secundario), `dim` (terciario).

### Radios y botones

Tres radios: `--radius-control` (8 px), `--radius-card` (12 px) y
`--radius-panel` (20 px). Tres acciones: principal (lila, relleno), secundaria
(contorno) y enlace discreto (`.quiet-action`), con la misma altura y tipografía.

### Antes y después (medido en la portada, 1440 px)

| | Antes | Después |
|---|---|---|
| Tamaños de letra distintos | 33 | 11 |
| Textos por debajo de 11 px (móvil) | 95 | 0 |
| Radios de esquina distintos | 15 | 9 |
| Tamaños escritos a mano en el CSS | 36 | 11 |
| Colores de texto escritos a mano en el CSS | 86 | 14 |

### Pendiente

- Fondos, bordes y degradados siguen con colores escritos a mano; solo se
  migraron los colores de texto.
- El póster de la sección Casa Nodo incluye restos de la interfaz de la escena
  (texto recortado a la izquierda); hay que volver a capturarlo.
- La sección NYX AI sigue siendo una maqueta; se unificó su estilo, no su contenido.
