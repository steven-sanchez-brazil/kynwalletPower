# Contexto de diseño: 03 · Home — Desktop

**Fuente**: Figma MCP `get_design_context`, `get_metadata`, `get_variable_defs`,
`get_screenshot`, `download_assets` y `use_figma` (solo lectura) sobre el nodo `13:2` del
archivo `pMArqPGrwekkonUVIZLSn4`. Extraído el 2026-10-16. Procedencia completa en
[../extraction-notes.md](../extraction-notes.md).

Las secciones 1 a 7 son **datos** devueltos por el MCP. La sección 8 contiene las
**interpretaciones** del agente y la sección 9 conserva el código de referencia.

## 1. Identificación

| Propiedad                    | Valor                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Nombre                       | `03 · Home — Desktop`                                                                                            |
| Página                       | `Page 1` (`0:1`), la única del archivo                                                                           |
| Node-id                      | `13:2`                                                                                                           |
| URL                          | https://www.figma.com/design/pMArqPGrwekkonUVIZLSn4/Billetera-Virtual---Prototipos--copia-?node-id=13-2          |
| Tamaño                       | 1440 × 1024                                                                                                      |
| Posición en el lienzo        | x 0, y 1100 (debajo de `01 · Login`)                                                                             |
| Fondo                        | `#f4f5f9`                                                                                                        |
| Variables o estilos de Figma | Ninguno (`get_variable_defs` devolvió `{}`)                                                                      |
| Layout                       | Posiciones absolutas; sin auto layout, sin componentes ni instancias                                             |
| Pantalla que representa      | Inicio (dashboard) de la billetera en escritorio: título de página `Inicio` e ítem de navegación `Inicio` activo |

## 2. Navegación del prototipo (evidencia)

Leída con `use_figma` en modo solo lectura (`flowStartingPoints` y `reactions`):

- Flujo `Flow 1`, que empieza en `2:2` (`01 · Login`).
- Nodo `3:2` `Form Panel` del login (todo el panel derecho de 820 × 1024):
  - `ON_CLICK` → `NAVIGATE` a `13:2` (este frame).
  - `ON_DRAG` → `NAVIGATE` a `31:2` (`04 · Registro`).
- Es la única reacción del archivo. El frame `13:2` no tiene reacciones: ninguno de
  sus elementos (navegación, acciones, "ver todo", campana, avatar) navega a otra parte.

## 3. Textos exactos

### Sidebar

| Nodo  | Texto                | Estilo                                 |
| ----- | -------------------- | -------------------------------------- |
| 13:6  | `KynWallet`          | Bold 22, blanco                        |
| 13:10 | `Inicio`             | Semi Bold 15, blanco (activo)          |
| 13:12 | `Historial`          | Regular 15, blanco 70 %                |
| 13:14 | `Tarjetas`           | Regular 15, blanco 70 %                |
| 13:16 | `Pagos`              | Regular 15, blanco 70 %                |
| 13:18 | `Perfil`             | Regular 15, blanco 70 %                |
| 13:22 | `D`                  | Bold 14, blanco (inicial en el avatar) |
| 13:23 | `Diego`              | Semi Bold 14, blanco                   |
| 13:24 | `diego@kynwallet.mx` | Regular 11, blanco 70 %                |

### Barra superior

| Nodo  | Texto                        | Estilo                                    |
| ----- | ---------------------------- | ----------------------------------------- |
| 13:26 | `Inicio`                     | Bold 22, `#16182c`                        |
| 13:27 | `Bienvenido de nuevo, Diego` | Regular 13, `#8a8ba8`                     |
| 13:31 | `D`                          | Bold 14, `#3d3f5c` (inicial en el avatar) |

### Tarjetas de resumen (KPI)

| Tarjeta | Etiqueta (Medium 12, `#8a8ba8`) | Valor (Bold 24)           | Pie (Regular 12)                      |
| ------- | ------------------------------- | ------------------------- | ------------------------------------- |
| 13:32   | `Saldo disponible`              | `$1,922.90` en `#ef5226`  | `MXN · cuenta principal` en `#ff6b3d` |
| 13:37   | `Ingresos del mes`              | `+$4,250.00` en `#16182c` | `vs mes anterior ↑12%` en `#a9abc2`   |
| 13:41   | `Gastos del mes`                | `-$1,840.50` en `#16182c` | `vs mes anterior ↑5%` en `#a9abc2`    |
| 13:45   | `Movimientos`                   | `24` en `#16182c`         | `Este mes` en `#a9abc2`               |

### Acciones rápidas

Título `Acciones rápidas` (13:49), Bold 16, `#16182c`.

| Tarjeta | Nombre (Semi Bold 14, `#16182c`) | Descripción (Regular 11, `#8a8ba8`) |
| ------- | -------------------------------- | ----------------------------------- |
| 13:50   | `Enviar`                         | `Transferir dinero`                 |
| 13:55   | `Recibir`                        | `Compartir QR`                      |
| 13:60   | `Recargar`                       | `Añadir saldo`                      |
| 13:65   | `Pagar`                          | `Servicios y más`                   |

### Movimientos recientes

Título `Movimientos recientes` (13:70), Bold 16, `#16182c`. Enlace `ver todo →` (13:71),
Semi Bold 13, `#ef5226`.

| Fila | Nombre (Semi Bold 15, `#16182c`) | Detalle (Regular 12, `#8a8ba8`) | Importe (Bold 15, alineado a la derecha) | Tipo de icono    |
| ---- | -------------------------------- | ------------------------------- | ---------------------------------------- | ---------------- |
| 0    | `María González`                 | `Transferencia · Hoy 14:23`     | `+$250.00` en `#0f6e56`                  | entrada (verde)  |
| 1    | `Netflix`                        | `Suscripción · Hoy 09:15`       | `-$35.90` en `#ef5226`                   | salida (naranja) |
| 2    | `Recarga BBVA`                   | `Depósito · Ayer 18:42`         | `+$500.00` en `#0f6e56`                  | entrada          |
| 3    | `Spotify`                        | `Suscripción · Ayer 08:00`      | `-$19.90` en `#ef5226`                   | salida           |
| 4    | `Carlos Méndez`                  | `Transferencia · 29 May`        | `+$1,200.00` en `#0f6e56`                | entrada          |

### Mi tarjeta

| Nodo   | Texto                                                | Estilo                           |
| ------ | ---------------------------------------------------- | -------------------------------- |
| 13:102 | `Mi tarjeta`                                         | Bold 16, `#16182c`               |
| 13:108 | `Kyn Card`                                           | Semi Bold 15, blanco             |
| 13:109 | `5294  ••••  ••••  4827` (dos espacios entre grupos) | Medium 18, blanco, tracking 1 px |
| 13:110 | `STEVEN LUNA`                                        | Medium 13, blanco 90 %           |
| 13:111 | `12/29`                                              | Medium 13, blanco 90 %           |

### Resumen del mes

Título `Resumen del mes` (13:112), Bold 16, `#16182c`.

| Fila | Categoría (Medium 13, `#3d3f5c`) | Importe (Semi Bold 13, `#16182c`, derecha) | Color del punto y la barra | Ancho de barra |
| ---- | -------------------------------- | ------------------------------------------ | -------------------------- | -------------- |
| 0    | `Suscripciones`                  | `$55.80`                                   | `#ef5226`                  | 89 de 296      |
| 1    | `Transferencias`                 | `$1,450.00`                                | `#0f6e56`                  | 192 de 296     |
| 2    | `Recargas`                       | `$500.00`                                  | `#a9abc2`                  | 53 de 296      |

## 4. Layout y dimensiones

Coordenadas relativas al frame (x, y, ancho × alto).

### Estructura general

| Zona              | Posición                                                                                                   | Tamaño     |
| ----------------- | ---------------------------------------------------------------------------------------------------------- | ---------- |
| Sidebar           | 0, 0                                                                                                       | 260 × 1024 |
| Barra superior    | 260, 0                                                                                                     | 1180 × 72  |
| Área de contenido | Columna izquierda 300 → 980 (680); columna derecha 1020 → 1400 (380); separación 40; márgenes laterales 40 | —          |

### Sidebar

| Elemento                | Nodo          | Posición                        | Tamaño              |
| ----------------------- | ------------- | ------------------------------- | ------------------- |
| Logo dot 1              | 13:4          | 32, 48                          | 14 × 22             |
| Logo dot 2              | 13:5          | 38, 56                          | 14 × 14             |
| KynWallet               | 13:6          | 58, 52                          | 108 × 27            |
| Fondo del ítem activo   | 13:7          | 16, 138                         | 228 × 44            |
| Barra del ítem activo   | 13:8          | 16, 138                         | 4 × 44              |
| Puntos de navegación    | 13:9 … 13:17  | x 36; y 156, 208, 260, 312, 364 | 8 × 8               |
| Etiquetas de navegación | 13:10 … 13:18 | x 56; y 150, 202, 254, 306, 358 | paso vertical de 52 |
| Divisor                 | 13:19         | 24, 420                         | 212 × 1             |
| Tarjeta de usuario      | 13:20         | 16, 936                         | 228 × 64            |
| Avatar                  | 13:21         | 30, 952                         | 32 × 32             |
| Nombre / correo         | 13:23 / 13:24 | 72, 950 / 72, 970               | —                   |

### Barra superior

| Elemento              | Nodo  | Posición | Tamaño   |
| --------------------- | ----- | -------- | -------- |
| Título                | 13:26 | 300, 22  | 59 × 27  |
| Subtítulo             | 13:27 | 300, 48  | 171 × 16 |
| Fondo de la campana   | 13:28 | 1338, 16 | 40 × 40  |
| Punto de notificación | 13:29 | 1368, 18 | 10 × 10  |
| Avatar                | 13:30 | 1390, 16 | 40 × 40  |

### Contenido

| Elemento             | Nodo                       | Posición                                                                                                                       | Tamaño    | Notas                                                                                                        |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------ |
| Tarjetas KPI         | 13:32, 13:37, 13:41, 13:45 | x 300, 604, 908, 1212; y 100                                                                                                   | 256 × 110 | Separación 48; texto a 20 px del borde (y 118, 140, 180)                                                     |
| Acento de saldo      | 13:33                      | 300, 100                                                                                                                       | 256 × 4   |                                                                                                              |
| Título acciones      | 13:49                      | 300, 240                                                                                                                       | —         |                                                                                                              |
| Tarjetas de acción   | 13:50 … 13:65              | x 300, 452, 604, 756; y 270                                                                                                    | 136 × 76  | Separación 16; icono 36 en (x+16, 284) con punto 16 en (x+26, 294); textos en x+60, y 284 y 304              |
| Título movimientos   | 13:70                      | 300, 352                                                                                                                       | —         | "ver todo →" en 880, 354                                                                                     |
| Lista de movimientos | 13:72                      | 300, 382                                                                                                                       | 680 × 420 |                                                                                                              |
| Filas                | 13:73 … 13:101             | icono 44 en (320, 402 + 78·i)                                                                                                  | paso 78   | Nombre en (380, y+2); detalle en (380, y+24); importe alineado a x 960; divisor 640 × 1 en (316, 460 + 78·i) |
| Título tarjeta       | 13:102                     | 1020, 352                                                                                                                      | —         |                                                                                                              |
| Tarjeta visual       | 13:103                     | 1020, 382                                                                                                                      | 380 × 210 |                                                                                                              |
| Círculos decorativos | 13:104 / 13:105            | 1280, 332 / 1040, 452                                                                                                          | 160 / 100 |                                                                                                              |
| Chip                 | 13:106                     | 1046, 414                                                                                                                      | 38 × 28   | Línea interna 38 × 4 en 1046, 416                                                                            |
| Textos de la tarjeta | 13:108 … 13:111            | nombre 1046, 394; número 1046, 466; titular 1046, 528; vencimiento 1330, 528                                                   | —         |                                                                                                              |
| Título resumen       | 13:112                     | 1020, 604                                                                                                                      | —         |                                                                                                              |
| Panel de resumen     | 13:113                     | 1020, 634                                                                                                                      | 380 × 168 |                                                                                                              |
| Filas del resumen    | 13:114 … 13:128            | punto 12 en (1040, 655 + 44·i); etiqueta en (1062, 650 + 44·i); importe alineado a x 1380; barra 296 × 6 en (1062, 672 + 44·i) | paso 44   |                                                                                                              |

## 5. Colores, bordes y radios

| Elemento                   | Relleno                                                       | Borde              | Radio            |
| -------------------------- | ------------------------------------------------------------- | ------------------ | ---------------- |
| Fondo del frame            | `#f4f5f9`                                                     | —                  | —                |
| Sidebar                    | `linear-gradient(81.66deg, #ff8a65 31.698%, #ef5226 93.924%)` | —                  | 0                |
| Logo dot 1 / 2             | blanco / blanco 55 %                                          | —                  | elipse / círculo |
| Fondo del ítem activo      | `rgba(255,255,255,0.18)`                                      | —                  | 12               |
| Barra del ítem activo      | blanco                                                        | —                  | 2                |
| Punto activo / inactivo    | blanco / `rgba(255,255,255,0.55)`                             | —                  | 4                |
| Divisor del sidebar        | `rgba(255,255,255,0.2)`                                       | —                  | —                |
| Tarjeta de usuario         | `rgba(255,255,255,0.14)`                                      | —                  | 14               |
| Avatar del sidebar         | blanco 30 %                                                   | —                  | círculo          |
| Barra superior             | blanco                                                        | 1 px `#d7d9e6`     | 0                |
| Fondo de la campana        | `#f4f5f9`                                                     | 1 px `#d7d9e6`     | 20               |
| Punto de notificación      | `#ef5226`                                                     | —                  | círculo          |
| Avatar superior            | `#d7d9e6`                                                     | —                  | círculo          |
| Tarjeta "Saldo disponible" | blanco                                                        | **2 px `#ff6b3d`** | 16               |
| Acento superior del saldo  | `#ff6b3d`                                                     | —                  | 2                |
| Otras tarjetas KPI         | blanco                                                        | 1 px `#d7d9e6`     | 16               |
| Tarjetas de acción         | blanco                                                        | 1 px `#d7d9e6`     | 14               |
| Fondo del icono de acción  | `rgba(255,107,61,0.12)`                                       | —                  | 10               |
| Punto del icono de acción  | `rgba(239,82,38,0.7)`                                         | —                  | 4                |
| Lista de movimientos       | blanco                                                        | 1 px `#d7d9e6`     | 18               |
| Icono de entrada (SVG)     | `#e7f7ef`                                                     | 1.5 px `#a0e0c0`   | círculo 44       |
| Icono de salida (SVG)      | `#feeeea`                                                     | 1.5 px `#f5c4b3`   | círculo 44       |
| Marca de entrada / salida  | `rgba(15,110,86,0.8)` / `rgba(239,82,38,0.8)`                 | —                  | 6 (12 × 12)      |
| Divisores de la lista      | `rgba(215,217,230,0.6)`                                       | —                  | —                |
| Tarjeta visual             | `linear-gradient(43.75deg, #ff8a65 31.698%, #ef5226 104.9%)`  | —                  | 22               |
| Círculos decorativos       | blanco 7 %                                                    | —                  | círculo          |
| Chip / línea interna       | `rgba(255,217,128,0.9)` / `rgba(22,24,44,0.15)`               | —                  | 6 / 0            |
| Panel de resumen           | blanco                                                        | 1 px `#d7d9e6`     | 18               |
| Fondo de barra             | `#d7d9e6`                                                     | —                  | 3                |
| Relleno de barra           | `#ef5226` / `#0f6e56` / `#a9abc2`                             | —                  | 3                |

## 6. Tipografía

Fuente: **Inter** en todo el frame, con `line-height: normal`. Pesos: Regular 400,
Medium 500, Semi Bold 600 y Bold 700. Tamaños usados: 11, 12, 13, 14, 15, 16, 18, 22 y 24.
El único `letter-spacing` es 1 px, en el número de la tarjeta.

## 7. Componentes, variantes, estados y recursos

- **Componentes y variantes**: no hay. Todo son rectángulos, elipses y textos sueltos;
  no hay instancias, variantes ni Code Connect.
- **Estados**: solo el estado con datos. El único estado visible es "Inicio" activo en
  la navegación. No hay hover, foco, carga, vacío ni error.
- **Iconos**: provisorios. Campana sin glifo (solo círculo y punto), acciones con un
  cuadrado de color, marcas de entrada y salida como cuadrados redondeados de 12 px.
  No hay flechas reales pese al nombre de capa "Mov arrow".
- **Recursos descargados** (en `assets/`), todos SVG de formas simples:

| Archivo              | Nodo(s)             | Contenido                                 |
| -------------------- | ------------------- | ----------------------------------------- |
| `logo-dot-1.svg`     | 13:4                | Elipse blanca 14 × 22                     |
| `logo-dot-2.svg`     | 13:5                | Círculo blanco 55 %, 14                   |
| `user-avatar.svg`    | 13:21               | Círculo blanco 30 %, 32                   |
| `bell-dot.svg`       | 13:29               | Círculo `#ef5226`, 10                     |
| `avatar-bg.svg`      | 13:30               | Círculo `#d7d9e6`, 40                     |
| `mov-icon-in.svg`    | 13:73, 13:85, 13:97 | Círculo `#e7f7ef` con borde `#a0e0c0`, 44 |
| `mov-icon-out.svg`   | 13:79, 13:91        | Círculo `#feeeea` con borde `#f5c4b3`, 44 |
| `glass-circle-1.svg` | 13:104              | Círculo blanco 7 %, 160                   |
| `glass-circle-2.svg` | 13:105              | Círculo blanco 7 %, 100                   |
| `cat-dot-0.svg`      | 13:114              | Círculo `#ef5226`, 12                     |
| `cat-dot-1.svg`      | 13:119              | Círculo `#0f6e56`, 12                     |
| `cat-dot-2.svg`      | 13:124              | Círculo `#a9abc2`, 12                     |

Los nombres de archivo los eligió el agente a partir de las capas. Figma los entregó
como `1a50f`, `bc0bd`, `4967b`, `87c28`, `05eaf`, `65936`, `aa274`, `a57f9`, `fd112`,
`91919`, `44f4d` y `46511`. No hay imágenes rasterizadas (`rawImages` vacío).

## 8. Interpretaciones del agente

Esta sección no proviene del MCP.

1. **Destino del login en el prototipo.** El clic en el panel del formulario de login
   lleva a este frame, lo que sugiere que es la pantalla posterior a iniciar sesión. El
   disparador es todo el panel, no el botón "Iniciar sesión"; es una conexión rápida de
   prototipo, no una especificación del comportamiento del botón.
2. **Contrapartida móvil.** El frame `02 · Home` (`11:2`, 390 × 844) muestra en móvil
   el saldo, las acciones Enviar, Recibir, Recargar y "Más", cuatro movimientos y una
   navegación inferior con Inicio, Historial, QR y Perfil. Sus acciones y su
   navegación **no coinciden** con las de escritorio (Pagar frente a Más; Tarjetas y
   Pagos frente a QR). Extracción y tabla de diferencias en
   [../02-home-mobile-11-2/design-context.md](../02-home-mobile-11-2/design-context.md).
3. **Desbordes en el diseño.**
   - La tarjeta KPI "Movimientos" termina en x 1468, 28 px fuera del frame, y aparece
     cortada en la captura. Con márgenes de 40, las cuatro tarjetas deberían repartirse
     entre 300 y 1400.
   - Las descripciones "Transferir dinero" (termina en 446) y "Servicios y más" (898)
     sobrepasan sus tarjetas, que terminan en 436 y 892.
   - El círculo decorativo 13:104 sobresale de la tarjeta visual, por arriba y a la
     derecha. Como la tarjeta no recorta su contenido, lo que se vea depende de la
     implementación.
4. **Datos de ejemplo no coherentes entre sí.**
   - El resumen suma $2,005.80, pero "Gastos del mes" indica -$1,840.50.
   - "Transferencias" ($1,450.00) aparece como categoría de gasto, mientras que en la
     lista las transferencias son ingresos.
   - Los anchos de las barras (30 %, 65 % y 18 %) no son proporcionales a los importes.
   - El usuario es "Diego", pero la tarjeta muestra "STEVEN LUNA".

   Conviene tratar todo esto como contenido ilustrativo, no como reglas de cálculo.

5. **Sin comportamiento definido.** El diseño no indica qué hacen Historial, Tarjetas,
   Pagos, Perfil, las acciones rápidas, "ver todo", la campana ni el avatar, ni de dónde
   salen los datos. Tampoco hay un control para cerrar sesión. Todo eso debe decidirse
   en la spec.
6. **Moneda y formato.** Importes con `$`, separador de miles `,` y decimal `.`, y la
   etiqueta "MXN", lo que sugiere pesos mexicanos con formato `en-US`/`es-MX`.

### Contraste WCAG 2.1 calculado sobre los valores del frame

| Par                         | Ratio | Uso                                                                                        | AA                                                                      |
| --------------------------- | ----- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `#16182c` sobre `#f4f5f9`   | 16.05 | títulos de sección                                                                         | Cumple                                                                  |
| `#3d3f5c` sobre blanco      | 10.17 | categorías del resumen                                                                     | Cumple                                                                  |
| `#3d3f5c` sobre `#d7d9e6`   | 7.25  | inicial del avatar                                                                         | Cumple                                                                  |
| `#0f6e56` sobre blanco      | 6.20  | importes de entrada (15 bold)                                                              | Cumple                                                                  |
| `#ef5226` sobre blanco      | 3.56  | saldo (24 bold, texto grande): cumple; salidas (15 bold) y "ver todo" (13): **no cumplen** | Parcial                                                                 |
| `#8a8ba8` sobre blanco      | 3.31  | etiquetas KPI, detalles de filas, descripciones                                            | **No cumple**                                                           |
| `#8a8ba8` sobre `#f4f5f9`   | 3.04  | — (subtítulo de la barra superior va sobre blanco)                                         | —                                                                       |
| `#ff6b3d` sobre blanco      | 2.83  | "MXN · cuenta principal" (12)                                                              | **No cumple**                                                           |
| `#a9abc2` sobre blanco      | 2.26  | pies de KPI (12)                                                                           | **No cumple**                                                           |
| Blanco sobre `#ff8a65`      | 2.31  | "KynWallet" e ítem activo en la zona clara del sidebar                                     | **No cumple**                                                           |
| Blanco 70 % sobre `#ff8a65` | 1.81  | ítems de navegación inactivos                                                              | **No cumple**                                                           |
| Blanco sobre `#ef5226`      | 3.56  | zona oscura del gradiente                                                                  | Solo texto grande                                                       |
| `#d7d9e6` sobre blanco      | 1.40  | bordes de tarjetas                                                                         | No cumple el 3:1 si el borde es el único indicador del control (1.4.11) |

Además, distinguir entradas y salidas solo por color (verde y naranja) no basta para
1.4.1. Los signos `+` y `-` de los importes sí ayudan.

## 9. Código de referencia devuelto por el MCP

Procedencia: `get_design_context`, nodo `13:2`, generado por Figma como React + Tailwind
con posiciones absolutas. Solo es referencia: no se copia a `src/`, el proyecto no usa
Tailwind y no se agregan dependencias. Las URLs de recursos eran temporales y se
sustituyeron por los nombres locales en `assets/`.

```tsx
const imgLogoDot1 = 'assets/logo-dot-1.svg';
const imgLogoDot2 = 'assets/logo-dot-2.svg';
const imgUserAvatar = 'assets/user-avatar.svg';
const imgBellDot = 'assets/bell-dot.svg';
const imgAvatarBg = 'assets/avatar-bg.svg';
const imgMovIcon0 = 'assets/mov-icon-in.svg';
const imgMovIcon1 = 'assets/mov-icon-out.svg';
const imgGlassCircle1 = 'assets/glass-circle-1.svg';
const imgGlassCircle2 = 'assets/glass-circle-2.svg';
const imgCatDot0 = 'assets/cat-dot-0.svg';
const imgCatDot1 = 'assets/cat-dot-1.svg';
const imgCatDot2 = 'assets/cat-dot-2.svg';

export default function Component03HomeDesktop() {
  return (
    <div
      className="bg-[#f4f5f9] relative size-full"
      data-node-id="13:2"
      data-name="03 · Home — Desktop"
    >
      <div
        className="absolute h-[1024px] left-0 top-0 w-[260px]"
        data-node-id="13:3"
        style={{
          backgroundImage:
            'linear-gradient(81.66000800693513deg, rgb(255, 138, 101) 31.698%, rgb(239, 82, 38) 93.924%)',
        }}
        data-name="Sidebar"
      />
      <div
        className="absolute h-[22px] left-[32px] top-[48px] w-[14px]"
        data-node-id="13:4"
        data-name="Logo dot 1"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogoDot1} />
      </div>
      <div
        className="absolute left-[38px] size-[14px] top-[56px]"
        data-node-id="13:5"
        data-name="Logo dot 2"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogoDot2} />
      </div>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[58px] not-italic text-[22px] text-white top-[52px] whitespace-nowrap"
        data-node-id="13:6"
      >
        KynWallet
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0.18)] h-[44px] left-[16px] rounded-[12px] top-[138px] w-[228px]"
        data-node-id="13:7"
        data-name="Nav active bg"
      />
      <div
        className="absolute bg-white h-[44px] left-[16px] rounded-[2px] top-[138px] w-[4px]"
        data-node-id="13:8"
        data-name="Nav active bar"
      />
      <div
        className="absolute bg-white left-[36px] rounded-[4px] size-[8px] top-[156px]"
        data-node-id="13:9"
        data-name="Nav Inicio dot"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[56px] not-italic text-[15px] text-white top-[150px] whitespace-nowrap"
        data-node-id="13:10"
      >
        Inicio
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0.55)] left-[36px] rounded-[4px] size-[8px] top-[208px]"
        data-node-id="13:11"
        data-name="Nav Historial dot"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[56px] not-italic text-[15px] text-[rgba(255,255,255,0.7)] top-[202px] whitespace-nowrap"
        data-node-id="13:12"
      >
        Historial
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0.55)] left-[36px] rounded-[4px] size-[8px] top-[260px]"
        data-node-id="13:13"
        data-name="Nav Tarjetas dot"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[56px] not-italic text-[15px] text-[rgba(255,255,255,0.7)] top-[254px] whitespace-nowrap"
        data-node-id="13:14"
      >
        Tarjetas
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0.55)] left-[36px] rounded-[4px] size-[8px] top-[312px]"
        data-node-id="13:15"
        data-name="Nav Pagos dot"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[56px] not-italic text-[15px] text-[rgba(255,255,255,0.7)] top-[306px] whitespace-nowrap"
        data-node-id="13:16"
      >
        Pagos
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0.55)] left-[36px] rounded-[4px] size-[8px] top-[364px]"
        data-node-id="13:17"
        data-name="Nav Perfil dot"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[56px] not-italic text-[15px] text-[rgba(255,255,255,0.7)] top-[358px] whitespace-nowrap"
        data-node-id="13:18"
      >
        Perfil
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0.2)] h-px left-[24px] top-[420px] w-[212px]"
        data-node-id="13:19"
        data-name="Sidebar divider"
      />
      <div
        className="absolute bg-[rgba(255,255,255,0.14)] h-[64px] left-[16px] rounded-[14px] top-[936px] w-[228px]"
        data-node-id="13:20"
        data-name="User card"
      />
      <div
        className="absolute left-[30px] size-[32px] top-[952px]"
        data-node-id="13:21"
        data-name="User avatar"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUserAvatar} />
      </div>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[36px] not-italic text-[14px] text-white top-[959px] whitespace-nowrap"
        data-node-id="13:22"
      >
        D
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[72px] not-italic text-[14px] text-white top-[950px] whitespace-nowrap"
        data-node-id="13:23"
      >
        Diego
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[72px] not-italic text-[11px] text-[rgba(255,255,255,0.7)] top-[970px] whitespace-nowrap"
        data-node-id="13:24"
      >
        diego@kynwallet.mx
      </p>
      <div
        className="absolute bg-white border border-[#d7d9e6] border-solid h-[72px] left-[260px] top-0 w-[1180px]"
        data-node-id="13:25"
        data-name="Top Bar"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[300px] not-italic text-[#16182c] text-[22px] top-[22px] whitespace-nowrap"
        data-node-id="13:26"
      >
        Inicio
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[300px] not-italic text-[#8a8ba8] text-[13px] top-[48px] whitespace-nowrap"
        data-node-id="13:27"
      >
        Bienvenido de nuevo, Diego
      </p>
      <div
        className="absolute bg-[#f4f5f9] border border-[#d7d9e6] border-solid left-[1338px] rounded-[20px] size-[40px] top-[16px]"
        data-node-id="13:28"
        data-name="Bell bg"
      />
      <div
        className="absolute left-[1368px] size-[10px] top-[18px]"
        data-node-id="13:29"
        data-name="Bell dot"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBellDot} />
      </div>
      <div
        className="absolute left-[1390px] size-[40px] top-[16px]"
        data-node-id="13:30"
        data-name="Avatar bg"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAvatarBg} />
      </div>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[1403px] not-italic text-[#3d3f5c] text-[14px] top-[28px] whitespace-nowrap"
        data-node-id="13:31"
      >
        D
      </p>
      <div
        className="absolute bg-white border-2 border-[#ff6b3d] border-solid h-[110px] left-[300px] rounded-[16px] top-[100px] w-[256px]"
        data-node-id="13:32"
        data-name="Card Saldo disponible"
      />
      <div
        className="absolute bg-[#ff6b3d] h-[4px] left-[300px] rounded-[2px] top-[100px] w-[256px]"
        data-node-id="13:33"
        data-name="Accent top"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[320px] not-italic text-[#8a8ba8] text-[12px] top-[118px] whitespace-nowrap"
        data-node-id="13:34"
      >
        Saldo disponible
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[320px] not-italic text-[#ef5226] text-[24px] top-[140px] whitespace-nowrap"
        data-node-id="13:35"
      >
        $1,922.90
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[320px] not-italic text-[#ff6b3d] text-[12px] top-[180px] whitespace-nowrap"
        data-node-id="13:36"
      >
        MXN · cuenta principal
      </p>
      <div
        className="absolute bg-white border border-[#d7d9e6] border-solid h-[110px] left-[604px] rounded-[16px] top-[100px] w-[256px]"
        data-node-id="13:37"
        data-name="Card Ingresos del mes"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[624px] not-italic text-[#8a8ba8] text-[12px] top-[118px] whitespace-nowrap"
        data-node-id="13:38"
      >
        Ingresos del mes
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[624px] not-italic text-[#16182c] text-[24px] top-[140px] whitespace-nowrap"
        data-node-id="13:39"
      >
        +$4,250.00
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[624px] not-italic text-[#a9abc2] text-[12px] top-[180px] whitespace-nowrap"
        data-node-id="13:40"
      >
        vs mes anterior ↑12%
      </p>
      <div
        className="absolute bg-white border border-[#d7d9e6] border-solid h-[110px] left-[908px] rounded-[16px] top-[100px] w-[256px]"
        data-node-id="13:41"
        data-name="Card Gastos del mes"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[928px] not-italic text-[#8a8ba8] text-[12px] top-[118px] whitespace-nowrap"
        data-node-id="13:42"
      >
        Gastos del mes
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[928px] not-italic text-[#16182c] text-[24px] top-[140px] whitespace-nowrap"
        data-node-id="13:43"
      >
        -$1,840.50
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[928px] not-italic text-[#a9abc2] text-[12px] top-[180px] whitespace-nowrap"
        data-node-id="13:44"
      >
        vs mes anterior ↑5%
      </p>
      <div
        className="absolute bg-white border border-[#d7d9e6] border-solid h-[110px] left-[1212px] rounded-[16px] top-[100px] w-[256px]"
        data-node-id="13:45"
        data-name="Card Movimientos"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[1232px] not-italic text-[#8a8ba8] text-[12px] top-[118px] whitespace-nowrap"
        data-node-id="13:46"
      >
        Movimientos
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[1232px] not-italic text-[#16182c] text-[24px] top-[140px] whitespace-nowrap"
        data-node-id="13:47"
      >
        24
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[1232px] not-italic text-[#a9abc2] text-[12px] top-[180px] whitespace-nowrap"
        data-node-id="13:48"
      >
        Este mes
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[300px] not-italic text-[#16182c] text-[16px] top-[240px] whitespace-nowrap"
        data-node-id="13:49"
      >
        Acciones rápidas
      </p>
      <div
        className="absolute bg-white border border-[#d7d9e6] border-solid h-[76px] left-[300px] rounded-[14px] top-[270px] w-[136px]"
        data-node-id="13:50"
        data-name="Act Enviar"
      />
      <div
        className="absolute bg-[rgba(255,107,61,0.12)] left-[316px] rounded-[10px] size-[36px] top-[284px]"
        data-node-id="13:51"
        data-name="Act icon Enviar"
      />
      <div
        className="absolute bg-[rgba(239,82,38,0.7)] left-[326px] rounded-[4px] size-[16px] top-[294px]"
        data-node-id="13:52"
        data-name="Act icon dot 0"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[360px] not-italic text-[#16182c] text-[14px] top-[284px] whitespace-nowrap"
        data-node-id="13:53"
      >
        Enviar
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[360px] not-italic text-[#8a8ba8] text-[11px] top-[304px] whitespace-nowrap"
        data-node-id="13:54"
      >
        Transferir dinero
      </p>
      <div
        className="absolute bg-white border border-[#d7d9e6] border-solid h-[76px] left-[452px] rounded-[14px] top-[270px] w-[136px]"
        data-node-id="13:55"
        data-name="Act Recibir"
      />
      <div
        className="absolute bg-[rgba(255,107,61,0.12)] left-[468px] rounded-[10px] size-[36px] top-[284px]"
        data-node-id="13:56"
        data-name="Act icon Recibir"
      />
      <div
        className="absolute bg-[rgba(239,82,38,0.7)] left-[478px] rounded-[4px] size-[16px] top-[294px]"
        data-node-id="13:57"
        data-name="Act icon dot 1"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[512px] not-italic text-[#16182c] text-[14px] top-[284px] whitespace-nowrap"
        data-node-id="13:58"
      >
        Recibir
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[512px] not-italic text-[#8a8ba8] text-[11px] top-[304px] whitespace-nowrap"
        data-node-id="13:59"
      >
        Compartir QR
      </p>
      <div
        className="absolute bg-white border border-[#d7d9e6] border-solid h-[76px] left-[604px] rounded-[14px] top-[270px] w-[136px]"
        data-node-id="13:60"
        data-name="Act Recargar"
      />
      <div
        className="absolute bg-[rgba(255,107,61,0.12)] left-[620px] rounded-[10px] size-[36px] top-[284px]"
        data-node-id="13:61"
        data-name="Act icon Recargar"
      />
      <div
        className="absolute bg-[rgba(239,82,38,0.7)] left-[630px] rounded-[4px] size-[16px] top-[294px]"
        data-node-id="13:62"
        data-name="Act icon dot 2"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[664px] not-italic text-[#16182c] text-[14px] top-[284px] whitespace-nowrap"
        data-node-id="13:63"
      >
        Recargar
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[664px] not-italic text-[#8a8ba8] text-[11px] top-[304px] whitespace-nowrap"
        data-node-id="13:64"
      >
        Añadir saldo
      </p>
      <div
        className="absolute bg-white border border-[#d7d9e6] border-solid h-[76px] left-[756px] rounded-[14px] top-[270px] w-[136px]"
        data-node-id="13:65"
        data-name="Act Pagar"
      />
      <div
        className="absolute bg-[rgba(255,107,61,0.12)] left-[772px] rounded-[10px] size-[36px] top-[284px]"
        data-node-id="13:66"
        data-name="Act icon Pagar"
      />
      <div
        className="absolute bg-[rgba(239,82,38,0.7)] left-[782px] rounded-[4px] size-[16px] top-[294px]"
        data-node-id="13:67"
        data-name="Act icon dot 3"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[816px] not-italic text-[#16182c] text-[14px] top-[284px] whitespace-nowrap"
        data-node-id="13:68"
      >
        Pagar
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[816px] not-italic text-[#8a8ba8] text-[11px] top-[304px] whitespace-nowrap"
        data-node-id="13:69"
      >
        Servicios y más
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[300px] not-italic text-[#16182c] text-[16px] top-[352px] whitespace-nowrap"
        data-node-id="13:70"
      >
        Movimientos recientes
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[880px] not-italic text-[#ef5226] text-[13px] top-[354px] whitespace-nowrap"
        data-node-id="13:71"
      >
        ver todo →
      </p>
      <div
        className="absolute bg-white border border-[#d7d9e6] border-solid h-[420px] left-[300px] rounded-[18px] top-[382px] w-[680px]"
        data-node-id="13:72"
        data-name="Mov bg"
      />
      <div
        className="absolute left-[320px] size-[44px] top-[402px]"
        data-node-id="13:73"
        data-name="Mov icon 0"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMovIcon0} />
      </div>
      <div
        className="absolute bg-[rgba(15,110,86,0.8)] left-[336px] rounded-[6px] size-[12px] top-[412px]"
        data-node-id="13:74"
        data-name="Mov arrow 0"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[380px] not-italic text-[#16182c] text-[15px] top-[404px] whitespace-nowrap"
        data-node-id="13:75"
      >
        María González
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[380px] not-italic text-[#8a8ba8] text-[12px] top-[426px] whitespace-nowrap"
        data-node-id="13:76"
      >
        Transferencia · Hoy 14:23
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[960px] not-italic text-[#0f6e56] text-[15px] text-right top-[412px] w-[140px]"
        data-node-id="13:77"
      >
        +$250.00
      </p>
      <div
        className="absolute bg-[rgba(215,217,230,0.6)] h-px left-[316px] top-[460px] w-[640px]"
        data-node-id="13:78"
        data-name="Mov div 0"
      />
      <div
        className="absolute left-[320px] size-[44px] top-[480px]"
        data-node-id="13:79"
        data-name="Mov icon 1"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMovIcon1} />
      </div>
      <div
        className="absolute bg-[rgba(239,82,38,0.8)] left-[336px] rounded-[6px] size-[12px] top-[490px]"
        data-node-id="13:80"
        data-name="Mov arrow 1"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[380px] not-italic text-[#16182c] text-[15px] top-[482px] whitespace-nowrap"
        data-node-id="13:81"
      >
        Netflix
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[380px] not-italic text-[#8a8ba8] text-[12px] top-[504px] whitespace-nowrap"
        data-node-id="13:82"
      >
        Suscripción · Hoy 09:15
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[960px] not-italic text-[#ef5226] text-[15px] text-right top-[490px] w-[140px]"
        data-node-id="13:83"
      >
        -$35.90
      </p>
      <div
        className="absolute bg-[rgba(215,217,230,0.6)] h-px left-[316px] top-[538px] w-[640px]"
        data-node-id="13:84"
        data-name="Mov div 1"
      />
      <div
        className="absolute left-[320px] size-[44px] top-[558px]"
        data-node-id="13:85"
        data-name="Mov icon 2"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMovIcon0} />
      </div>
      <div
        className="absolute bg-[rgba(15,110,86,0.8)] left-[336px] rounded-[6px] size-[12px] top-[568px]"
        data-node-id="13:86"
        data-name="Mov arrow 2"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[380px] not-italic text-[#16182c] text-[15px] top-[560px] whitespace-nowrap"
        data-node-id="13:87"
      >
        Recarga BBVA
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[380px] not-italic text-[#8a8ba8] text-[12px] top-[582px] whitespace-nowrap"
        data-node-id="13:88"
      >
        Depósito · Ayer 18:42
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[960px] not-italic text-[#0f6e56] text-[15px] text-right top-[568px] w-[140px]"
        data-node-id="13:89"
      >
        +$500.00
      </p>
      <div
        className="absolute bg-[rgba(215,217,230,0.6)] h-px left-[316px] top-[616px] w-[640px]"
        data-node-id="13:90"
        data-name="Mov div 2"
      />
      <div
        className="absolute left-[320px] size-[44px] top-[636px]"
        data-node-id="13:91"
        data-name="Mov icon 3"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMovIcon1} />
      </div>
      <div
        className="absolute bg-[rgba(239,82,38,0.8)] left-[336px] rounded-[6px] size-[12px] top-[646px]"
        data-node-id="13:92"
        data-name="Mov arrow 3"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[380px] not-italic text-[#16182c] text-[15px] top-[638px] whitespace-nowrap"
        data-node-id="13:93"
      >
        Spotify
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[380px] not-italic text-[#8a8ba8] text-[12px] top-[660px] whitespace-nowrap"
        data-node-id="13:94"
      >
        Suscripción · Ayer 08:00
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[960px] not-italic text-[#ef5226] text-[15px] text-right top-[646px] w-[140px]"
        data-node-id="13:95"
      >
        -$19.90
      </p>
      <div
        className="absolute bg-[rgba(215,217,230,0.6)] h-px left-[316px] top-[694px] w-[640px]"
        data-node-id="13:96"
        data-name="Mov div 3"
      />
      <div
        className="absolute left-[320px] size-[44px] top-[714px]"
        data-node-id="13:97"
        data-name="Mov icon 4"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMovIcon0} />
      </div>
      <div
        className="absolute bg-[rgba(15,110,86,0.8)] left-[336px] rounded-[6px] size-[12px] top-[724px]"
        data-node-id="13:98"
        data-name="Mov arrow 4"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[380px] not-italic text-[#16182c] text-[15px] top-[716px] whitespace-nowrap"
        data-node-id="13:99"
      >
        Carlos Méndez
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[380px] not-italic text-[#8a8ba8] text-[12px] top-[738px] whitespace-nowrap"
        data-node-id="13:100"
      >
        Transferencia · 29 May
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[960px] not-italic text-[#0f6e56] text-[15px] text-right top-[724px] w-[140px]"
        data-node-id="13:101"
      >
        +$1,200.00
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[1020px] not-italic text-[#16182c] text-[16px] top-[352px] whitespace-nowrap"
        data-node-id="13:102"
      >
        Mi tarjeta
      </p>
      <div
        className="absolute h-[210px] left-[1020px] rounded-[22px] top-[382px] w-[380px]"
        data-node-id="13:103"
        style={{
          backgroundImage:
            'linear-gradient(43.74599791686888deg, rgb(255, 138, 101) 31.698%, rgb(239, 82, 38) 104.9%)',
        }}
        data-name="Card visual"
      />
      <div
        className="absolute left-[1280px] size-[160px] top-[332px]"
        data-node-id="13:104"
        data-name="Glass circle 1"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGlassCircle1} />
      </div>
      <div
        className="absolute left-[1040px] size-[100px] top-[452px]"
        data-node-id="13:105"
        data-name="Glass circle 2"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGlassCircle2} />
      </div>
      <div
        className="absolute bg-[rgba(255,217,128,0.9)] h-[28px] left-[1046px] rounded-[6px] top-[414px] w-[38px]"
        data-node-id="13:106"
        data-name="Chip"
      />
      <div
        className="absolute bg-[rgba(22,24,44,0.15)] h-[4px] left-[1046px] top-[416px] w-[38px]"
        data-node-id="13:107"
        data-name="Chip inner"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[1046px] not-italic text-[15px] text-white top-[394px] whitespace-nowrap"
        data-node-id="13:108"
      >
        Kyn Card
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[1046px] not-italic text-[18px] text-white top-[466px] tracking-[1px] whitespace-pre"
        data-node-id="13:109"
      >{`5294  ••••  ••••  4827`}</p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[1046px] not-italic text-[13px] text-[rgba(255,255,255,0.9)] top-[528px] whitespace-nowrap"
        data-node-id="13:110"
      >
        STEVEN LUNA
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[1330px] not-italic text-[13px] text-[rgba(255,255,255,0.9)] top-[528px] whitespace-nowrap"
        data-node-id="13:111"
      >
        12/29
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[1020px] not-italic text-[#16182c] text-[16px] top-[604px] whitespace-nowrap"
        data-node-id="13:112"
      >
        Resumen del mes
      </p>
      <div
        className="absolute bg-white border border-[#d7d9e6] border-solid h-[168px] left-[1020px] rounded-[18px] top-[634px] w-[380px]"
        data-node-id="13:113"
        data-name="Resumen bg"
      />
      <div
        className="absolute left-[1040px] size-[12px] top-[655px]"
        data-node-id="13:114"
        data-name="Cat dot 0"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCatDot0} />
      </div>
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[1062px] not-italic text-[#3d3f5c] text-[13px] top-[650px] whitespace-nowrap"
        data-node-id="13:115"
      >
        Suscripciones
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[1380px] not-italic text-[#16182c] text-[13px] text-right top-[650px] w-[80px]"
        data-node-id="13:116"
      >
        $55.80
      </p>
      <div
        className="absolute bg-[#d7d9e6] h-[6px] left-[1062px] rounded-[3px] top-[672px] w-[296px]"
        data-node-id="13:117"
        data-name="Bar bg 0"
      />
      <div
        className="absolute bg-[#ef5226] h-[6px] left-[1062px] rounded-[3px] top-[672px] w-[89px]"
        data-node-id="13:118"
        data-name="Bar fill 0"
      />
      <div
        className="absolute left-[1040px] size-[12px] top-[699px]"
        data-node-id="13:119"
        data-name="Cat dot 1"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCatDot1} />
      </div>
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[1062px] not-italic text-[#3d3f5c] text-[13px] top-[694px] whitespace-nowrap"
        data-node-id="13:120"
      >
        Transferencias
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[1380px] not-italic text-[#16182c] text-[13px] text-right top-[694px] w-[80px]"
        data-node-id="13:121"
      >
        $1,450.00
      </p>
      <div
        className="absolute bg-[#d7d9e6] h-[6px] left-[1062px] rounded-[3px] top-[716px] w-[296px]"
        data-node-id="13:122"
        data-name="Bar bg 1"
      />
      <div
        className="absolute bg-[#0f6e56] h-[6px] left-[1062px] rounded-[3px] top-[716px] w-[192px]"
        data-node-id="13:123"
        data-name="Bar fill 1"
      />
      <div
        className="absolute left-[1040px] size-[12px] top-[743px]"
        data-node-id="13:124"
        data-name="Cat dot 2"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCatDot2} />
      </div>
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[1062px] not-italic text-[#3d3f5c] text-[13px] top-[738px] whitespace-nowrap"
        data-node-id="13:125"
      >
        Recargas
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[1380px] not-italic text-[#16182c] text-[13px] text-right top-[738px] w-[80px]"
        data-node-id="13:126"
      >
        $500.00
      </p>
      <div
        className="absolute bg-[#d7d9e6] h-[6px] left-[1062px] rounded-[3px] top-[760px] w-[296px]"
        data-node-id="13:127"
        data-name="Bar bg 2"
      />
      <div
        className="absolute bg-[#a9abc2] h-[6px] left-[1062px] rounded-[3px] top-[760px] w-[53px]"
        data-node-id="13:128"
        data-name="Bar fill 2"
      />
    </div>
  );
}
```
