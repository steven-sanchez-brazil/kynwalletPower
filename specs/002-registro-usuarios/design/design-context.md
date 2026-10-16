# Contexto de diseño: 04 · Registro

**Fuente**: Figma MCP `get_design_context` y `get_metadata` sobre el nodo `31:2` de la copia
`pMArqPGrwekkonUVIZLSn4` del archivo original `f7uDsv8sh6ZOtK2OitTqtg`. Extraído el 2026-10-15.
La procedencia completa está en [extraction-notes.md](extraction-notes.md).

Las secciones 1 a 6 son **datos** devueltos por el MCP. La sección 7 contiene las
**interpretaciones** del agente y la sección 8 conserva el código de referencia.

## 1. Frame

| Propiedad | Valor |
| --- | --- |
| Nombre | `04 · Registro` |
| Tamaño | 1440 × 1024 |
| Fondo | `#ffffff` (blanco) |
| Variables o estilos de Figma | Ninguno (`get_variable_defs` devolvió `{}`) |
| Layout | Posiciones absolutas; sin auto layout |
| Frame móvil de Registro | No existe en la página. Los otros frames son `01 · Login` (2:2), `02 · Home` (11:2, 390 × 844) y `03 · Home — Desktop` (13:2) |

## 2. Textos exactos

| Nodo | Capa | Texto |
| --- | --- | --- |
| 31:6 | KynWallet | `KynWallet` |
| 31:7 | Headline 1 | `Comienza tu` |
| 31:8 | Headline 2 | `camino financiero.` |
| 31:9 | Subtext | `Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar.` |
| 31:11 | Card name | `Kyn Card` |
| 31:14 | Card number | `5294  ••••  ••••  4827` (dos espacios entre grupos) |
| 31:15 | Card holder | `STEVEN LUNA` |
| 31:16 | Card exp | `12/29` |
| 31:17 | Heading | `Crea tu cuenta` |
| 31:18 | Subheading | `Completa tus datos para comenzar` |
| 31:19 | Name label | `Nombre completo` |
| 31:21 | Name placeholder | `Ej: Diego Martínez` |
| 31:22 | Email label | `Correo electrónico` |
| 31:24 | Email placeholder | `tucorreo@ejemplo.com` |
| 31:25 | Pass label | `Contraseña` |
| 31:27 | Pass placeholder | `••••••••` |
| 31:29 | Confirm label | `Confirmar contraseña` |
| 31:31 | Confirm placeholder | `••••••••` |
| 31:34 | Terms text | `Acepto los ` (con espacio final) |
| 31:35 | Terms link | `términos y condiciones` |
| 31:37 | Btn text | `Crear cuenta` |
| 31:39 | Div text | `o regístrate con` |
| 31:43 | Google text | `Google` |
| 31:46 | Apple text | `Apple` |
| 31:47 | Footer Q | `¿Ya tienes cuenta?` |
| 31:48 | Footer link | `Inicia sesión` |

## 3. Layout y dimensiones

Coordenadas relativas al frame (x, y, ancho × alto).

### Panel de marca (izquierda)

| Elemento | Nodo | Posición | Tamaño |
| --- | --- | --- | --- |
| Brand Panel | 31:3 | 0, 0 | 620 × 1024 |
| Logo dot | 31:4 | 56, 64 | 10 × 28 |
| Logo dot 2 | 31:5 | 60, 76 | 14 × 14 |
| KynWallet | 31:6 | 78, 70 | 128 × 31 |
| Headline 1 | 31:7 | 56, 400 | 272 × 48 |
| Headline 2 | 31:8 | 56, 452 | 399 × 48 |
| Subtext | 31:9 | 56, 510 | 500 × 52 (ancho fijo 500) |
| Card Mockup | 31:10 | 56, 750 | 360 × 210 |
| Card name | 31:11 | 82, 774 | — |
| Chip | 31:12 | 378, 770 | 38 × 28 |
| Chip line | 31:13 | 378, 782 | 38 × 4 |
| Card number | 31:14 | 82, 854 | — |
| Card holder | 31:15 | 82, 924 | — |
| Card exp | 31:16 | 368, 924 | — |

### Panel de formulario (derecha, 820 px de ancho)

La columna del formulario empieza en x = 820 y mide 400 px de ancho.

| Elemento | Nodo | y | Alto | Notas |
| --- | --- | --- | --- | --- |
| Heading | 31:17 | 140 | 36 | |
| Subheading | 31:18 | 182 | 19 | |
| Name label | 31:19 | 222 | 17 | |
| Name input | 31:20 | 246 | 52 | 400 de ancho; placeholder en x 836 (padding 16) |
| Email label | 31:22 | 314 | 17 | |
| Email input | 31:23 | 338 | 52 | |
| Pass label | 31:25 | 406 | 17 | |
| Pass input | 31:26 | 430 | 52 | Eye icon en x 1184, y 450 (20 × 12) |
| Confirm label | 31:29 | 498 | 17 | |
| Confirm input | 31:30 | 522 | 52 | Eye icon 2 en x 1184, y 542 |
| Terms checkbox | 31:33 | 592 | 20 | 20 × 20; texto en x 852 (gap 12) |
| Btn Register | 31:36 | 628 | 52 | 400 de ancho |
| Divider | 31:38–31:40 | 700–709 | 16 | Línea izq. 820→985; texto 990→1087; línea der. 1120→1220 |
| Google btn | 31:41 | 730 | 48 | x 820, 192 de ancho |
| Apple btn | 31:44 | 730 | 48 | x 1028, 192 de ancho (gap 16) |
| Footer | 31:47–31:48 | 798 | 17 | Pregunta en x 920; enlace en x 1052 |

**Espaciados derivados de las coordenadas**:
- Heading → Subheading: 6 (176 → 182).
- Subheading → primer label: 21 (201 → 222).
- Label → input: 7 (239 → 246).
- Input → siguiente label: 16 (298 → 314).
- Último input → checkbox: 18 (574 → 592).
- Checkbox → botón: 16 (612 → 628).
- Botón → divider: 20 (680 → 700).
- Divider → botones sociales: 14 (716 → 730).
- Botones sociales → footer: 20 (778 → 798).

## 4. Tipografía

Fuente: **Inter** en todo el frame. `line-height: normal` salvo donde se indica.

| Uso | Peso | Tamaño | Line-height | Color |
| --- | --- | --- | --- | --- |
| Logo "KynWallet" | Bold 700 | 26 | normal | `#ffffff` |
| Headlines | Bold 700 | 44 | 1.08 | `#ffffff` |
| Subtext | Regular 400 | 17 | 1.5 | `rgba(255,255,255,0.85)` |
| Card name | Semi Bold 600 | 15 | normal | `#ffffff` |
| Card number | Medium 500 | 20 | normal | `#ffffff` |
| Card holder y exp | Medium 500 | 13 | normal | `rgba(255,255,255,0.9)` |
| Heading "Crea tu cuenta" | Bold 700 | 30 | normal | `#16182c` |
| Subheading | Regular 400 | 16 | normal | `#8a8ba8` |
| Labels | Medium 500 | 14 | normal | `#3d3f5c` |
| Placeholders | Regular 400 | 15 | normal | `#a9abc2` |
| "Acepto los" | Medium 500 | 14 | normal | `#3d3f5c` |
| "términos y condiciones" | Semi Bold 600 | 14 | normal | `#ef5226` |
| Botón "Crear cuenta" | Semi Bold 600 | 16 | normal | `#ffffff`, centrado |
| Divider "o regístrate con" | Regular 400 | 13 | normal | `#8a8ba8` |
| Google / Apple | Semi Bold 600 | 15 | normal | `#16182c` |
| "¿Ya tienes cuenta?" | Regular 400 | 14 | normal | `#8a8ba8` |
| "Inicia sesión" | Semi Bold 600 | 14 | normal | `#ef5226` |

## 5. Colores, bordes y radios

| Elemento | Relleno | Borde | Radio |
| --- | --- | --- | --- |
| Brand Panel | `linear-gradient(70.73deg, #ff8a65 31.698%, #ef5226 83.455%)` | — | 0 |
| Logo dot (31:4) | `#ffffff` | — | elipse |
| Logo dot 2 (31:5) | `#ffffff` al 55 % | — | círculo |
| Card Mockup | `rgba(255,255,255,0.16)` | 1 px `rgba(255,255,255,0.35)` | 22 |
| Chip | `rgba(255,217,128,0.9)` | — | 6 |
| Chip line | `rgba(22,24,44,0.15)` | — | 0 |
| Inputs (4) | `#ffffff` | 1.5 px `#d7d9e6` | 12 |
| Eye icons | `#a9abc2` al 50 % | — | elipse |
| Terms checkbox | `#ffffff` | 1.5 px `#d7d9e6` | 6 |
| Btn Register | `#ff6b3d` | — | 12 |
| Líneas del divider | `#d7d9e6`, 1 px de alto | — | 0 |
| Google / Apple btn | `#ffffff` | 1.5 px `#d7d9e6` | 12 |
| Iconos Google / Apple | `#d7d9e6` | — | círculo |

## 6. Componentes identificados

Ningún nodo es instancia de un componente de Figma: son rectángulos, elipses y textos
sueltos. No hay Code Connect. Los grupos funcionales según los nombres de capa son:

- Panel de marca: logo, titular de dos líneas, subtítulo y tarjeta decorativa.
- Encabezado del formulario: título y subtítulo.
- Cuatro campos con label e input: nombre, correo, contraseña y confirmación. Los dos
  campos de contraseña tienen un icono de ojo.
- Checkbox de términos con texto y enlace.
- Botón primario "Crear cuenta".
- Divider con texto.
- Dos botones sociales: Google y Apple.
- Footer con enlace a inicio de sesión.

## 7. Interpretaciones del agente

Esta sección no proviene del MCP. Es análisis para la spec y el plan.

1. **Paralelo con el login.** El frame `01 · Login` (2:2) usa la misma división: panel de
   marca de 620 px, formulario de 400 px de ancho, inputs de 52, botones sociales de 48
   y la misma tarjeta (360 × 210 en 56, 750). El login sí usa frames anidados con
   nombres de componentes (`Input`, `Btn / Iniciar sesión`, `Divider`, `Social`); el
   registro no. Conviene reutilizar los componentes y el layout ya implementados para el login.
2. **Colores ya presentes en el código.** `src/ui` ya contiene `#ef5226`, `#ff8a65`,
   `#ff6b3d`, `#d7d9e6`, `#a9abc2`, `#3d3f5c` y `#16182c`. El gris secundario del
   código es `#8a8ca8`; en este frame es `#8a8ba8`, una diferencia de 1 en el canal verde.
3. **Iconos provisorios.** Los SVG del logo, el ojo y los iconos de Google y Apple son
   formas geométricas simples, no los logotipos reales. En el frame, Apple reutiliza
   el mismo SVG que Google.
4. **Divider asimétrico.** El texto termina en x 1087, a 5 px de la línea izquierda y
   a 33 px de la derecha. Las líneas miden 165 y 100. Parece un ajuste manual
   impreciso; un divider con flex y líneas iguales es la lectura más probable.
5. **Footer centrado a mano.** El bloque pregunta + enlace va de 920 a 1136, con centro
   en 1028, igual que el centro de la columna (820 + 200 = 1020) más 8 px. Se interpreta
   como texto centrado.
6. **Sin estados.** El frame muestra solo el estado vacío. No hay diseño de error inline,
   foco, checkbox marcado, botón deshabilitado ni mensaje de éxito. Esos estados deben
   salir de los componentes existentes del login.
7. **Sin frame móvil.** La versión móvil (solo formulario) no está diseñada en Figma;
   debe definirse en la spec o el plan a partir de los requisitos.

### Contraste WCAG 2.1 calculado sobre los valores del frame

| Par | Ratio | AA texto normal (4.5) |
| --- | --- | --- |
| `#16182c` sobre blanco (heading, botones sociales) | 17.48 | Cumple |
| `#3d3f5c` sobre blanco (labels) | 10.17 | Cumple |
| `#8a8ba8` sobre blanco (subtítulo, divider, footer) | 3.31 | **No cumple** |
| `#a9abc2` sobre blanco (placeholders) | 2.26 | No cumple (los placeholders no son contenido obligatorio, pero conviene revisar) |
| `#ef5226` sobre blanco (enlaces, 14 px semibold) | 3.56 | **No cumple** |
| Blanco sobre `#ff6b3d` (botón, 16 px semibold) | 2.83 | **No cumple** |
| `#d7d9e6` sobre blanco (borde de inputs) | 1.40 | **No cumple** el 3:1 de componentes no textuales (1.4.11) |
| Blanco sobre `#ff8a65` (inicio del gradiente) | 2.31 | El titular de 44 px es texto grande (3:1) y aun así no cumple en la zona clara |
| Blanco sobre `#ef5226` (fin del gradiente) | 3.56 | Cumple solo para texto grande |

Estas discrepancias entre Figma y la accesibilidad deben resolverse y documentarse en el
plan, como exige `AGENTS.md`. Conviene comprobar cómo las resolvió el login.

## 8. Código de referencia devuelto por el MCP

Procedencia: `get_design_context`, nodo `31:2`, generado por Figma como React + Tailwind
con posiciones absolutas. Solo sirve como referencia: no se copia a `src/`, el proyecto
no usa Tailwind y no se agregan dependencias. Las URLs de assets eran temporales (7 días);
los archivos descargados están en `assets/`.

```tsx
const assetPathPrefix = "<URL temporal de Figma, omitida>";
const imgLogoDot = `${assetPathPrefix}/cb2fb.svg`;   // assets/logo-dot.svg
const imgLogoDot2 = `${assetPathPrefix}/bc0bd.svg`;  // assets/logo-dot-2.svg
const imgEyeIcon = `${assetPathPrefix}/ff621.svg`;   // assets/eye-icon.svg
const imgGoogleDot = `${assetPathPrefix}/2c3a0.svg`; // assets/social-dot.svg

export default function Component04Registro() {
  return (
    <div className="bg-white relative size-full" data-node-id="31:2" data-name="04 · Registro">
      <div className="absolute h-[1024px] left-0 top-0 w-[620px]" data-node-id="31:3" style={{ backgroundImage: "linear-gradient(70.73150689567015deg, rgb(255, 138, 101) 31.698%, rgb(239, 82, 38) 83.455%)" }} data-name="Brand Panel" />
      <div className="absolute h-[28px] left-[56px] top-[64px] w-[10px]" data-node-id="31:4" data-name="Logo dot">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogoDot} />
      </div>
      <div className="absolute left-[60px] size-[14px] top-[76px]" data-node-id="31:5" data-name="Logo dot 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogoDot2} />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[78px] not-italic text-[26px] text-white top-[70px] whitespace-nowrap" data-node-id="31:6">
        KynWallet
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[1.08] left-[56px] not-italic text-[44px] text-white top-[400px] whitespace-nowrap" data-node-id="31:7">
        Comienza tu
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[1.08] left-[56px] not-italic text-[44px] text-white top-[452px] whitespace-nowrap" data-node-id="31:8">
        camino financiero.
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[1.5] left-[56px] not-italic text-[17px] text-[rgba(255,255,255,0.85)] top-[510px] w-[500px]" data-node-id="31:9">
        Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar.
      </p>
      <div className="absolute bg-[rgba(255,255,255,0.16)] border border-[rgba(255,255,255,0.35)] border-solid h-[210px] left-[56px] rounded-[22px] top-[750px] w-[360px]" data-node-id="31:10" data-name="Card Mockup" />
      <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[82px] not-italic text-[15px] text-white top-[774px] whitespace-nowrap" data-node-id="31:11">
        Kyn Card
      </p>
      <div className="absolute bg-[rgba(255,217,128,0.9)] h-[28px] left-[378px] rounded-[6px] top-[770px] w-[38px]" data-node-id="31:12" data-name="Chip" />
      <div className="absolute bg-[rgba(22,24,44,0.15)] h-[4px] left-[378px] top-[782px] w-[38px]" data-node-id="31:13" data-name="Chip line" />
      <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[82px] not-italic text-[20px] text-white top-[854px] whitespace-pre" data-node-id="31:14">{`5294  ••••  ••••  4827`}</p>
      <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[82px] not-italic text-[13px] text-[rgba(255,255,255,0.9)] top-[924px] whitespace-nowrap" data-node-id="31:15">
        STEVEN LUNA
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[368px] not-italic text-[13px] text-[rgba(255,255,255,0.9)] top-[924px] whitespace-nowrap" data-node-id="31:16">
        12/29
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[820px] not-italic text-[#16182c] text-[30px] top-[140px] whitespace-nowrap" data-node-id="31:17">
        Crea tu cuenta
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[820px] not-italic text-[#8a8ba8] text-[16px] top-[182px] w-[400px]" data-node-id="31:18">
        Completa tus datos para comenzar
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[820px] not-italic text-[#3d3f5c] text-[14px] top-[222px] whitespace-nowrap" data-node-id="31:19">
        Nombre completo
      </p>
      <div className="absolute bg-white border-[#d7d9e6] border-[1.5px] border-solid h-[52px] left-[820px] rounded-[12px] top-[246px] w-[400px]" data-node-id="31:20" data-name="Name input" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[836px] not-italic text-[#a9abc2] text-[15px] top-[262px] whitespace-nowrap" data-node-id="31:21">
        Ej: Diego Martínez
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[820px] not-italic text-[#3d3f5c] text-[14px] top-[314px] whitespace-nowrap" data-node-id="31:22">
        Correo electrónico
      </p>
      <div className="absolute bg-white border-[#d7d9e6] border-[1.5px] border-solid h-[52px] left-[820px] rounded-[12px] top-[338px] w-[400px]" data-node-id="31:23" data-name="Email input" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[836px] not-italic text-[#a9abc2] text-[15px] top-[354px] whitespace-nowrap" data-node-id="31:24">
        tucorreo@ejemplo.com
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[820px] not-italic text-[#3d3f5c] text-[14px] top-[406px] whitespace-nowrap" data-node-id="31:25">
        Contraseña
      </p>
      <div className="absolute bg-white border-[#d7d9e6] border-[1.5px] border-solid h-[52px] left-[820px] rounded-[12px] top-[430px] w-[400px]" data-node-id="31:26" data-name="Pass input" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[836px] not-italic text-[#a9abc2] text-[15px] top-[446px] whitespace-nowrap" data-node-id="31:27">
        ••••••••
      </p>
      <div className="absolute h-[12px] left-[1184px] top-[450px] w-[20px]" data-node-id="31:28" data-name="Eye icon">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEyeIcon} />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[820px] not-italic text-[#3d3f5c] text-[14px] top-[498px] whitespace-nowrap" data-node-id="31:29">
        Confirmar contraseña
      </p>
      <div className="absolute bg-white border-[#d7d9e6] border-[1.5px] border-solid h-[52px] left-[820px] rounded-[12px] top-[522px] w-[400px]" data-node-id="31:30" data-name="Confirm input" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[836px] not-italic text-[#a9abc2] text-[15px] top-[538px] whitespace-nowrap" data-node-id="31:31">
        ••••••••
      </p>
      <div className="absolute h-[12px] left-[1184px] top-[542px] w-[20px]" data-node-id="31:32" data-name="Eye icon 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEyeIcon} />
      </div>
      <div className="absolute bg-white border-[#d7d9e6] border-[1.5px] border-solid left-[820px] rounded-[6px] size-[20px] top-[592px]" data-node-id="31:33" data-name="Terms checkbox" />
      <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[852px] not-italic text-[#3d3f5c] text-[14px] top-[590px] whitespace-nowrap" data-node-id="31:34">{`Acepto los `}</p>
      <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[926px] not-italic text-[#ef5226] text-[14px] top-[590px] whitespace-nowrap" data-node-id="31:35">
        términos y condiciones
      </p>
      <div className="absolute bg-[#ff6b3d] h-[52px] left-[820px] rounded-[12px] top-[628px] w-[400px]" data-node-id="31:36" data-name="Btn Register" />
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[1020px] not-italic text-[16px] text-center text-white top-[642px] w-[400px]" data-node-id="31:37">
        Crear cuenta
      </p>
      <div className="absolute bg-[#d7d9e6] h-px left-[820px] top-[708px] w-[165px]" data-node-id="31:38" data-name="Div left" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[990px] not-italic text-[#8a8ba8] text-[13px] top-[700px] whitespace-nowrap" data-node-id="31:39">
        o regístrate con
      </p>
      <div className="absolute bg-[#d7d9e6] h-px left-[1120px] top-[708px] w-[100px]" data-node-id="31:40" data-name="Div right" />
      <div className="absolute bg-white border-[#d7d9e6] border-[1.5px] border-solid h-[48px] left-[820px] rounded-[12px] top-[730px] w-[192px]" data-node-id="31:41" data-name="Google btn" />
      <div className="absolute left-[880px] size-[20px] top-[744px]" data-node-id="31:42" data-name="Google dot">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGoogleDot} />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[908px] not-italic text-[#16182c] text-[15px] top-[744px] whitespace-nowrap" data-node-id="31:43">
        Google
      </p>
      <div className="absolute bg-white border-[#d7d9e6] border-[1.5px] border-solid h-[48px] left-[1028px] rounded-[12px] top-[730px] w-[192px]" data-node-id="31:44" data-name="Apple btn" />
      <div className="absolute left-[1088px] size-[20px] top-[744px]" data-node-id="31:45" data-name="Apple dot">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGoogleDot} />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[1116px] not-italic text-[#16182c] text-[15px] top-[744px] whitespace-nowrap" data-node-id="31:46">
        Apple
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal leading-[normal] left-[920px] not-italic text-[#8a8ba8] text-[14px] top-[798px] whitespace-nowrap" data-node-id="31:47">
        ¿Ya tienes cuenta?
      </p>
      <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[1052px] not-italic text-[#ef5226] text-[14px] top-[798px] whitespace-nowrap" data-node-id="31:48">
        Inicia sesión
      </p>
    </div>
  );
}
```
