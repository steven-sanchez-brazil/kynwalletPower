# Contexto de diseño: 02 · Home (móvil)

**Fuente**: Figma MCP `get_design_context`, `get_metadata`, `get_variable_defs` y
`get_screenshot` sobre el nodo `11:2` del archivo `pMArqPGrwekkonUVIZLSn4`. Extraído el
2026-10-16 a pedido del usuario, como ampliación de la consigna de las vistas 03 y 04.
Procedencia completa en [../extraction-notes.md](../extraction-notes.md).

Las secciones 1 a 7 son **datos** devueltos por el MCP. La sección 8 contiene las
**interpretaciones** del agente y la sección 9 conserva el código de referencia.

## 1. Identificación

| Propiedad                    | Valor                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| Nombre                       | `02 · Home`                                                                                             |
| Página                       | `Page 1` (`0:1`)                                                                                        |
| Node-id                      | `11:2`                                                                                                  |
| URL                          | https://www.figma.com/design/pMArqPGrwekkonUVIZLSn4/Billetera-Virtual---Prototipos--copia-?node-id=11-2 |
| Tamaño                       | 390 × 844                                                                                               |
| Posición en el lienzo        | x 1604, y 1222                                                                                          |
| Fondo                        | `#f4f5f9`                                                                                               |
| Variables o estilos de Figma | Ninguno (`get_variable_defs` devolvió `{}`)                                                             |
| Layout                       | Posiciones absolutas; sin auto layout, componentes ni instancias                                        |
| Pantalla                     | Inicio de la billetera en móvil: ítem `Inicio` activo en la navegación inferior                         |

## 2. Navegación del prototipo (evidencia)

Según la lectura de reacciones con `use_figma` (solo lectura) hecha en esta misma
sesión, el frame `11:2` **no tiene reacciones** y **ningún otro frame navega hacia él**.
No forma parte del flujo `Flow 1`.

## 3. Textos exactos

| Nodo  | Texto                | Estilo                                        |
| ----- | -------------------- | --------------------------------------------- |
| 11:4  | `HOLA`               | Medium 11, `rgba(255,255,255,0.75)`           |
| 11:5  | `Diego`              | Bold 24, blanco                               |
| 11:8  | `SALDO DISPONIBLE`   | Medium 11, `rgba(255,255,255,0.75)`           |
| 11:9  | `$1,922.90`          | Bold 36, blanco                               |
| 11:11 | `MXN`                | Semi Bold 11, blanco, centrado en la insignia |
| 11:12 | `· cuenta principal` | Regular 13, `rgba(255,255,255,0.8)`           |
| 11:15 | `Enviar`             | Medium 12, `#3d3f5c`, centrado                |
| 11:17 | `Recibir`            | Medium 12, `#3d3f5c`, centrado                |
| 11:19 | `Recargar`           | Medium 12, `#3d3f5c`, centrado                |
| 11:21 | `Más`                | Medium 12, `#3d3f5c`, centrado                |
| 11:22 | `Movimientos`        | Bold 17, `#16182c`                            |
| 11:23 | `ver todo →`         | Semi Bold 13, `#ff6b3d`                       |
| 11:54 | `Inicio`             | Semi Bold 11, `#ff6b3d`, centrado (activo)    |
| 11:56 | `Historial`          | Medium 11, `#a9abc2`, centrado                |
| 11:58 | `QR`                 | Medium 11, `#a9abc2`, centrado                |
| 11:60 | `Perfil`             | Medium 11, `#a9abc2`, centrado                |

### Movimientos

| Fila  | Flecha (Bold 16) | Nombre (Semi Bold 14, `#16182c`) | Detalle (Regular 12, `#8a8ba8`) | Importe (Bold 14, derecha) |
| ----- | ---------------- | -------------------------------- | ------------------------------- | -------------------------- |
| 11:24 | `↙` en `#0f6e56` | `María González`                 | `Hoy 14:23`                     | `+$250.00` en `#0f6e56`    |
| 11:31 | `↗` en `#ff6b3d` | `Netflix`                        | `Hoy 09:15`                     | `-$35.90` en `#ff6b3d`     |
| 11:38 | `↙` en `#0f6e56` | `Recarga BBVA`                   | `Ayer 18:42`                    | `+$500.00` en `#0f6e56`    |
| 11:45 | `↗` en `#ff6b3d` | `Spotify`                        | `Ayer 08:00`                    | `-$19.90` en `#ff6b3d`     |

## 4. Layout y dimensiones

Coordenadas relativas al frame. Margen lateral de 16 px para tarjetas y de 24 px para
textos sueltos.

| Elemento                | Nodo          | Posición                                | Tamaño      | Notas                                                |
| ----------------------- | ------------- | --------------------------------------- | ----------- | ---------------------------------------------------- |
| Cabecera                | 11:3          | 0, 0                                    | 390 × 260   | Gradiente                                            |
| `HOLA` / `Diego`        | 11:4 / 11:5   | 24, 56 / 24, 72                         | —           |                                                      |
| Campana                 | 11:6          | 326, 56                                 | 40 × 40     | Punto de notificación 8 × 8 en 351, 58               |
| `SALDO DISPONIBLE`      | 11:8          | 24, 124                                 | —           |                                                      |
| Saldo                   | 11:9          | 24, 142                                 | 179 × 44    |                                                      |
| Insignia MXN            | 11:10         | 24, 196                                 | 44 × 22     | Texto `· cuenta principal` en 74, 200                |
| Tarjeta de acciones     | 11:13         | 16, 232                                 | 358 × 96    | Se superpone 28 px a la cabecera (232 < 260)         |
| Iconos de acción        | 11:14 … 11:20 | x 38, 128, 218, 308; y 248              | 52 × 52     | Paso 90; etiquetas de 64 de ancho centradas en y 308 |
| Título movimientos      | 11:22         | 24, 352                                 | —           | `ver todo →` en 298, 354                             |
| Filas de movimientos    | 11:24 … 11:45 | 16, 384 + 74·i                          | 358 × 64    | Separación 10                                        |
| Icono de fila           | 11:25 …       | 28, y+11                                | 42 × 42     | Flecha de texto en (42, y+22)                        |
| Nombre / detalle        | 11:28 …       | 82, y+12 / 82, y+33                     | —           |                                                      |
| Importe                 | 11:30 …       | alineado a x 360, y+22                  | 90 de ancho |                                                      |
| Navegación inferior     | 11:52         | 0, 792                                  | 390 × 52    |                                                      |
| Indicadores             | 11:53 … 11:59 | x 44, 126, 208, 290; y 792              | 36 × 2      | Solo el de Inicio es visible                         |
| Etiquetas de navegación | 11:54 … 11:60 | centradas en x 62, 144, 226, 308; y 818 | 68 de ancho | Paso 82                                              |

## 5. Colores, bordes y radios

| Elemento               | Relleno                                                       | Borde                           | Radio      |
| ---------------------- | ------------------------------------------------------------- | ------------------------------- | ---------- |
| Fondo del frame        | `#f4f5f9`                                                     | —                               | —          |
| Cabecera               | `linear-gradient(49.11deg, #ff8a65 31.698%, #ef5226 83.455%)` | —                               | 0          |
| Campana                | `rgba(255,255,255,0.18)`                                      | 1.5 px `rgba(255,255,255,0.35)` | 20         |
| Punto de notificación  | blanco                                                        | —                               | círculo    |
| Insignia MXN           | `rgba(255,255,255,0.2)`                                       | 1 px `rgba(255,255,255,0.3)`    | 6          |
| Tarjeta de acciones    | blanco                                                        | **0.5 px** `#d7d9e6`            | 20         |
| Iconos de acción       | `#fff5f0`                                                     | 1 px `#ffd4c5`                  | 14         |
| Filas de movimientos   | blanco                                                        | 0.5 px `#d7d9e6`                | 16         |
| Icono de entrada (SVG) | `#e7f7ef`                                                     | 1.5 px `#a3dfc0`                | círculo 42 |
| Icono de salida (SVG)  | `#feeeea`                                                     | 1.5 px `#f5c4b3`                | círculo 42 |
| Capa "Arrow"           | transparente (alfa 0)                                         | —                               | 2          |
| Navegación inferior    | blanco                                                        | 0.5 px `#d7d9e6`                | 0          |
| Indicador activo       | `#ff6b3d`                                                     | —                               | 2          |
| Indicadores inactivos  | transparentes                                                 | —                               | 2          |

## 6. Tipografía

**Inter**, con `line-height: normal`. Pesos: Regular, Medium, Semi Bold y Bold. Tamaños:
11, 12, 13, 14, 16, 17, 24 y 36. Las etiquetas `HOLA` y `SALDO DISPONIBLE` están escritas
en mayúsculas en el texto, no mediante una transformación.

## 7. Componentes, estados y recursos

- **Componentes y variantes**: no hay.
- **Estados**: solo el estado con datos e `Inicio` activo. No hay hover, presionado,
  carga, vacío ni error.
- **Iconos**:
  - Las acciones son cuadrados vacíos, sin glifo.
  - La campana no tiene glifo.
  - La navegación inferior no tiene iconos, solo texto.
  - Las flechas de los movimientos sí existen, como caracteres de texto `↙` y `↗`.
- **Recursos descargados** (en `assets/`):

| Archivo            | Nodo(s)      | Contenido                                 |
| ------------------ | ------------ | ----------------------------------------- |
| `notif-dot.svg`    | 11:7         | Círculo blanco 8 × 8                      |
| `mov-icon-in.svg`  | 11:25, 11:39 | Círculo `#e7f7ef` con borde `#a3dfc0`, 42 |
| `mov-icon-out.svg` | 11:32, 11:46 | Círculo `#feeeea` con borde `#f5c4b3`, 42 |

Figma los entregó como `222e3`, `0161a` y `1302b`; los nombres locales los eligió el
agente. No hay imágenes rasterizadas.

## 8. Interpretaciones del agente

Esta sección no proviene del MCP.

1. **Versión móvil de 03, con contenido reducido.** Comparte saldo, acciones y
   movimientos con `03 · Home — Desktop`, pero **omite** las tarjetas KPI de ingresos,
   gastos y cantidad de movimientos, "Mi tarjeta" y "Resumen del mes".
2. **Diferencias con 03 que la spec debe resolver:**

| Aspecto                         | 02 móvil                          | 03 escritorio                                      |
| ------------------------------- | --------------------------------- | -------------------------------------------------- |
| Cuarta acción                   | `Más`                             | `Pagar`                                            |
| Navegación                      | Inicio, Historial, **QR**, Perfil | Inicio, Historial, **Tarjetas**, **Pagos**, Perfil |
| Movimientos                     | 4 (sin Carlos Méndez)             | 5                                                  |
| Detalle de movimiento           | Solo fecha (`Hoy 14:23`)          | Tipo y fecha (`Transferencia · Hoy 14:23`)         |
| Color de salida y de "ver todo" | `#ff6b3d`                         | `#ef5226`                                          |
| Flecha de movimiento            | Carácter `↙` / `↗`                | Cuadrado de color de 12 px                         |
| Usuario                         | Solo "Diego"                      | "Diego" y `diego@kynwallet.mx`                     |
| Bordes                          | 0.5 px                            | 1 px                                               |

3. **Sin barra de estado.** Los primeros 56 px están vacíos dentro de la cabecera; no
   hay barra de estado del dispositivo dibujada.
4. **Espacio vacío** entre la última fila (y 670) y la navegación (y 792). No indica si
   la lista hace scroll ni cuántos movimientos se muestran.
5. **Ancho de referencia 390.** No hay variantes para otros anchos.

### Contraste WCAG 2.1 calculado sobre los valores del frame

| Par                         | Ratio | Uso                                       | AA                                             |
| --------------------------- | ----- | ----------------------------------------- | ---------------------------------------------- |
| `#16182c` sobre `#f4f5f9`   | 16.05 | título "Movimientos"                      | Cumple                                         |
| `#3d3f5c` sobre blanco      | 10.17 | etiquetas de acciones                     | Cumple                                         |
| `#0f6e56` sobre blanco      | 6.20  | importes de entrada                       | Cumple                                         |
| `#0f6e56` sobre `#e7f7ef`   | 5.60  | flecha de entrada                         | Cumple                                         |
| `#8a8ba8` sobre blanco      | 3.31  | fecha de movimientos (12)                 | **No cumple**                                  |
| Blanco sobre `#ef5226`      | 3.56  | zona oscura de la cabecera                | Solo texto grande                              |
| Blanco sobre `#ff8a65`      | 2.31  | "Diego", saldo (36 bold) en la zona clara | **No cumple** ni para texto grande             |
| Blanco 75 % sobre `#ff8a65` | 1.89  | `HOLA`, `SALDO DISPONIBLE` (11)           | **No cumple**                                  |
| `#ff6b3d` sobre blanco      | 2.83  | importes de salida, `Inicio` activo (11)  | **No cumple**                                  |
| `#ff6b3d` sobre `#f4f5f9`   | 2.60  | `ver todo →`                              | **No cumple**                                  |
| `#ff6b3d` sobre `#feeeea`   | 2.51  | flecha de salida                          | **No cumple**                                  |
| `#a9abc2` sobre blanco      | 2.26  | navegación inactiva (11)                  | **No cumple**                                  |
| `#ffd4c5` sobre `#fff5f0`   | 1.26  | borde del icono de acción                 | No cumple 1.4.11                               |
| `#d7d9e6` sobre `#f4f5f9`   | 1.29  | borde de tarjetas sobre el fondo          | No cumple 1.4.11 si es el único límite visible |

El indicador de 36 × 2 px es la única señal no textual del ítem activo. Los objetivos
táctiles de la navegación (68 × 52) y de las acciones (52 × 52) superan los 44 × 44.

## 9. Código de referencia devuelto por el MCP

Procedencia: `get_design_context`, nodo `11:2`, generado por Figma como React + Tailwind
con posiciones absolutas. Solo es referencia: no se copia a `src/` ni se agregan
dependencias. Las URLs temporales se sustituyeron por los nombres locales en `assets/`.

```tsx
const imgNotifDot = 'assets/notif-dot.svg';
const imgIconCircle = 'assets/mov-icon-in.svg';
const imgIconCircle1 = 'assets/mov-icon-out.svg';

export default function Component02Home() {
  return (
    <div className="bg-[#f4f5f9] relative size-full" data-node-id="11:2" data-name="02 · Home">
      <div
        className="absolute h-[260px] left-0 top-0 w-[390px]"
        data-node-id="11:3"
        style={{
          backgroundImage:
            'linear-gradient(49.10577349642234deg, rgb(255, 138, 101) 31.698%, rgb(239, 82, 38) 83.455%)',
        }}
        data-name="Header BG"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[24px] not-italic text-[11px] text-[rgba(255,255,255,0.75)] top-[56px] whitespace-nowrap"
        data-node-id="11:4"
      >
        HOLA
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[24px] not-italic text-[24px] text-white top-[72px] whitespace-nowrap"
        data-node-id="11:5"
      >
        Diego
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0.18)] border-[1.5px] border-[rgba(255,255,255,0.35)] border-solid left-[326px] rounded-[20px] size-[40px] top-[56px]"
        data-node-id="11:6"
        data-name="Bell BG"
      />
      <div
        className="absolute left-[351px] size-[8px] top-[58px]"
        data-node-id="11:7"
        data-name="Notif Dot"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNotifDot} />
      </div>
      <p
        className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[24px] not-italic text-[11px] text-[rgba(255,255,255,0.75)] top-[124px] whitespace-nowrap"
        data-node-id="11:8"
      >
        SALDO DISPONIBLE
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[24px] not-italic text-[36px] text-white top-[142px] whitespace-nowrap"
        data-node-id="11:9"
      >
        $1,922.90
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.3)] border-solid h-[22px] left-[24px] rounded-[6px] top-[196px] w-[44px]"
        data-node-id="11:10"
        data-name="MXN Badge"
      />
      <p
        className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[46px] not-italic text-[11px] text-center text-white top-[199px] whitespace-nowrap"
        data-node-id="11:11"
      >
        MXN
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[74px] not-italic text-[13px] text-[rgba(255,255,255,0.8)] top-[200px] whitespace-nowrap"
        data-node-id="11:12"
      >
        · cuenta principal
      </p>
      <div
        className="absolute bg-white border-[#d7d9e6] border-[0.5px] border-solid h-[96px] left-[16px] rounded-[20px] top-[232px] w-[358px]"
        data-node-id="11:13"
        data-name="Actions Card"
      />
      <div
        className="absolute bg-[#fff5f0] border border-[#ffd4c5] border-solid left-[38px] rounded-[14px] size-[52px] top-[248px]"
        data-node-id="11:14"
        data-name="Enviar icon bg"
      />
      <p
        className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[64px] not-italic text-[#3d3f5c] text-[12px] text-center top-[308px] w-[64px]"
        data-node-id="11:15"
      >
        Enviar
      </p>
      <div
        className="absolute bg-[#fff5f0] border border-[#ffd4c5] border-solid left-[128px] rounded-[14px] size-[52px] top-[248px]"
        data-node-id="11:16"
        data-name="Recibir icon bg"
      />
      <p
        className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[154px] not-italic text-[#3d3f5c] text-[12px] text-center top-[308px] w-[64px]"
        data-node-id="11:17"
      >
        Recibir
      </p>
      <div
        className="absolute bg-[#fff5f0] border border-[#ffd4c5] border-solid left-[218px] rounded-[14px] size-[52px] top-[248px]"
        data-node-id="11:18"
        data-name="Recargar icon bg"
      />
      <p
        className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[244px] not-italic text-[#3d3f5c] text-[12px] text-center top-[308px] w-[64px]"
        data-node-id="11:19"
      >
        Recargar
      </p>
      <div
        className="absolute bg-[#fff5f0] border border-[#ffd4c5] border-solid left-[308px] rounded-[14px] size-[52px] top-[248px]"
        data-node-id="11:20"
        data-name="Más icon bg"
      />
      <p
        className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[334px] not-italic text-[#3d3f5c] text-[12px] text-center top-[308px] w-[64px]"
        data-node-id="11:21"
      >
        Más
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[24px] not-italic text-[#16182c] text-[17px] top-[352px] whitespace-nowrap"
        data-node-id="11:22"
      >
        Movimientos
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[298px] not-italic text-[#ff6b3d] text-[13px] top-[354px] whitespace-nowrap"
        data-node-id="11:23"
      >
        ver todo →
      </p>
      <div
        className="absolute bg-white border-[#d7d9e6] border-[0.5px] border-solid h-[64px] left-[16px] rounded-[16px] top-[384px] w-[358px]"
        data-node-id="11:24"
        data-name="Mov María González"
      />
      <div
        className="absolute left-[28px] size-[42px] top-[395px]"
        data-node-id="11:25"
        data-name="Icon circle"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconCircle} />
      </div>
      <div
        className="absolute bg-[rgba(15,110,86,0)] left-[40px] rounded-[2px] size-[18px] top-[407px]"
        data-node-id="11:26"
        data-name="Arrow"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[42px] not-italic text-[#0f6e56] text-[16px] top-[406px] whitespace-nowrap"
        data-node-id="11:27"
      >
        ↙
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[82px] not-italic text-[#16182c] text-[14px] top-[396px] whitespace-nowrap"
        data-node-id="11:28"
      >
        María González
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[82px] not-italic text-[#8a8ba8] text-[12px] top-[417px] whitespace-nowrap"
        data-node-id="11:29"
      >
        Hoy 14:23
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[360px] not-italic text-[#0f6e56] text-[14px] text-right top-[406px] w-[90px]"
        data-node-id="11:30"
      >
        +$250.00
      </p>
      <div
        className="absolute bg-white border-[#d7d9e6] border-[0.5px] border-solid h-[64px] left-[16px] rounded-[16px] top-[458px] w-[358px]"
        data-node-id="11:31"
        data-name="Mov Netflix"
      />
      <div
        className="absolute left-[28px] size-[42px] top-[469px]"
        data-node-id="11:32"
        data-name="Icon circle"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconCircle1} />
      </div>
      <div
        className="absolute bg-[rgba(255,107,61,0)] left-[40px] rounded-[2px] size-[18px] top-[481px]"
        data-node-id="11:33"
        data-name="Arrow"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[42px] not-italic text-[#ff6b3d] text-[16px] top-[480px] whitespace-nowrap"
        data-node-id="11:34"
      >
        ↗
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[82px] not-italic text-[#16182c] text-[14px] top-[470px] whitespace-nowrap"
        data-node-id="11:35"
      >
        Netflix
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[82px] not-italic text-[#8a8ba8] text-[12px] top-[491px] whitespace-nowrap"
        data-node-id="11:36"
      >
        Hoy 09:15
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[360px] not-italic text-[#ff6b3d] text-[14px] text-right top-[480px] w-[90px]"
        data-node-id="11:37"
      >
        -$35.90
      </p>
      <div
        className="absolute bg-white border-[#d7d9e6] border-[0.5px] border-solid h-[64px] left-[16px] rounded-[16px] top-[532px] w-[358px]"
        data-node-id="11:38"
        data-name="Mov Recarga BBVA"
      />
      <div
        className="absolute left-[28px] size-[42px] top-[543px]"
        data-node-id="11:39"
        data-name="Icon circle"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconCircle} />
      </div>
      <div
        className="absolute bg-[rgba(15,110,86,0)] left-[40px] rounded-[2px] size-[18px] top-[555px]"
        data-node-id="11:40"
        data-name="Arrow"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[42px] not-italic text-[#0f6e56] text-[16px] top-[554px] whitespace-nowrap"
        data-node-id="11:41"
      >
        ↙
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[82px] not-italic text-[#16182c] text-[14px] top-[544px] whitespace-nowrap"
        data-node-id="11:42"
      >
        Recarga BBVA
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[82px] not-italic text-[#8a8ba8] text-[12px] top-[565px] whitespace-nowrap"
        data-node-id="11:43"
      >
        Ayer 18:42
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[360px] not-italic text-[#0f6e56] text-[14px] text-right top-[554px] w-[90px]"
        data-node-id="11:44"
      >
        +$500.00
      </p>
      <div
        className="absolute bg-white border-[#d7d9e6] border-[0.5px] border-solid h-[64px] left-[16px] rounded-[16px] top-[606px] w-[358px]"
        data-node-id="11:45"
        data-name="Mov Spotify"
      />
      <div
        className="absolute left-[28px] size-[42px] top-[617px]"
        data-node-id="11:46"
        data-name="Icon circle"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconCircle1} />
      </div>
      <div
        className="absolute bg-[rgba(255,107,61,0)] left-[40px] rounded-[2px] size-[18px] top-[629px]"
        data-node-id="11:47"
        data-name="Arrow"
      />
      <p
        className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[42px] not-italic text-[#ff6b3d] text-[16px] top-[628px] whitespace-nowrap"
        data-node-id="11:48"
      >
        ↗
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[82px] not-italic text-[#16182c] text-[14px] top-[618px] whitespace-nowrap"
        data-node-id="11:49"
      >
        Spotify
      </p>
      <p
        className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[82px] not-italic text-[#8a8ba8] text-[12px] top-[639px] whitespace-nowrap"
        data-node-id="11:50"
      >
        Ayer 08:00
      </p>
      <p
        className="-translate-x-full [word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[360px] not-italic text-[#ff6b3d] text-[14px] text-right top-[628px] w-[90px]"
        data-node-id="11:51"
      >
        -$19.90
      </p>
      <div
        className="absolute bg-white border-[#d7d9e6] border-[0.5px] border-solid h-[52px] left-0 top-[792px] w-[390px]"
        data-node-id="11:52"
        data-name="Bottom Nav"
      />
      <div
        className="absolute bg-[#ff6b3d] h-[2px] left-[44px] rounded-[2px] top-[792px] w-[36px]"
        data-node-id="11:53"
        data-name="Nav Inicio indicator"
      />
      <p
        className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[62px] not-italic text-[#ff6b3d] text-[11px] text-center top-[818px] w-[68px]"
        data-node-id="11:54"
      >
        Inicio
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0)] h-[2px] left-[126px] rounded-[2px] top-[792px] w-[36px]"
        data-node-id="11:55"
        data-name="Nav Historial indicator"
      />
      <p
        className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[144px] not-italic text-[#a9abc2] text-[11px] text-center top-[818px] w-[68px]"
        data-node-id="11:56"
      >
        Historial
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0)] h-[2px] left-[208px] rounded-[2px] top-[792px] w-[36px]"
        data-node-id="11:57"
        data-name="Nav QR indicator"
      />
      <p
        className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[226px] not-italic text-[#a9abc2] text-[11px] text-center top-[818px] w-[68px]"
        data-node-id="11:58"
      >
        QR
      </p>
      <div
        className="absolute bg-[rgba(255,255,255,0)] h-[2px] left-[290px] rounded-[2px] top-[792px] w-[36px]"
        data-node-id="11:59"
        data-name="Nav Perfil indicator"
      />
      <p
        className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[308px] not-italic text-[#a9abc2] text-[11px] text-center top-[818px] w-[68px]"
        data-node-id="11:60"
      >
        Perfil
      </p>
    </div>
  );
}
```
