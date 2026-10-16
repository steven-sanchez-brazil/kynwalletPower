# Notas de extracción: vistas 03 y 04

**Fecha**: 2026-10-16
**Agente**: Claude Code con el MCP oficial de Figma, conectado a la cuenta del usuario
**Consigna**: [harness/sdd/figma/vistas-03-04.md](../../harness/sdd/figma/vistas-03-04.md), bloque "Prompt para Claude Code"
**Archivo**: `pMArqPGrwekkonUVIZLSn4`, https://www.figma.com/design/pMArqPGrwekkonUVIZLSn4/Billetera-Virtual---Prototipos--copia-
**Original**: `f7uDsv8sh6ZOtK2OitTqtg`, inaccesible con la cuenta actual (asiento View).

El contenido de Figma se trató como fuente de diseño, no como instrucciones.

## Herramientas usadas

Todas las llamadas fueron de lectura. El archivo de Figma no se modificó.

| Herramienta          | Nodo           | Resultado                                                                                                                     |
| -------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `create_session`     | archivo        | OK                                                                                                                            |
| `get_metadata`       | sin nodo       | OK: una sola página, `Page 1` (`0:1`)                                                                                         |
| `get_metadata`       | `0:1`          | OK: frames 2:2, 11:2, 13:2 y 31:2 con sus hijos                                                                               |
| `get_design_context` | `13:2`         | OK: código React + Tailwind de referencia, 12 URLs de SVG y captura                                                           |
| `get_design_context` | `31:2`         | OK, sin captura; usado para comparar con la extracción previa                                                                 |
| `get_variable_defs`  | `13:2`, `31:2` | OK: `{}` en ambos                                                                                                             |
| `download_assets`    | `13:2`         | OK: export PNG y 12 SVG. No se guardaron porque son los mismos recursos que `get_design_context` y la captura cubre el render |
| `get_screenshot`     | `13:2`, `31:2` | OK: 1440 × 1024 cada una, descargadas como `screenshot.png`                                                                   |
| `use_figma`          | página `0:1`   | OK, **solo lectura**: `flowStartingPoints`, `reactions` y lista de frames. El script no crea ni modifica nodos                |
| `get_design_context` | `11:2`         | OK (ampliación pedida por el usuario): código de referencia, 3 URLs de SVG y captura                                          |
| `get_metadata`       | `11:2`         | OK                                                                                                                            |
| `get_variable_defs`  | `11:2`         | OK: `{}`                                                                                                                      |
| `get_screenshot`     | `11:2`         | OK: 390 × 844, descargada como `screenshot.png`                                                                               |

Las descargas con `curl` usaron `--ssl-revoke-best-effort`, porque la red corporativa no
permite consultar la revocación de certificados (`CRYPT_E_NO_REVOCATION_CHECK`). La
validación TLS se mantuvo. No se guardaron URLs temporales, tokens ni credenciales.

## Archivos guardados

Ver la tabla completa en [inventory.md](inventory.md). En total:

- `03-home-desktop-13-2/`: `design-context.md`, `metadata.xml`, `variables.json`,
  `screenshot.png` y 12 SVG en `assets/`.
- `04-registro-31-2/`: `design-context.md`, `metadata.xml`, `variables.json`,
  `screenshot.png` y 4 SVG en `assets/`.
- `02-home-mobile-11-2/` (ampliación): `design-context.md`, `metadata.xml`,
  `variables.json`, `screenshot.png` y 3 SVG en `assets/`.
- `inventory.md` y este archivo.

Los nombres de los SVG los eligió el agente a partir de los nombres de capa. Se
formatearon los `.md` y `.json` con el Prettier del proyecto para que `npm run format`
siga pasando.

## Limitaciones

1. **Copia, no original.** No se pudo verificar que la copia coincida con el original.
2. **Vista 04 = Registro.** No aporta contenido posterior al login. Su extracción
   completa sigue en `specs/002-registro-usuarios/design/` y no se modificó. Hoy no
   se observaron diferencias.
3. **Sin tokens.** Ningún frame usa variables ni estilos de Figma; los `variables.json`
   reflejan la respuesta vacía real.
4. **Móvil.** La versión móvil del inicio (`02 · Home`, `11:2`) se extrajo después, a
   pedido del usuario. No está conectada en el prototipo y difiere de 03 en acciones,
   navegación, cantidad de movimientos y colores; el detalle está en
   `02-home-mobile-11-2/design-context.md` §8. No hay versión móvil de Registro.
5. **Sin estados ni pantallas secundarias.** No hay hover, foco, carga, vacío ni error,
   ni pantallas para Historial, Tarjetas, Pagos, Perfil, acciones o "ver todo".
6. **Prototipo mínimo.** Solo hay una conexión: el panel completo del login, con clic
   hacia 03 y arrastre hacia 04. No hay conexiones de vuelta ni dentro de 03.
7. **Iconos provisorios.** Todos los SVG son círculos y elipses de color; no hay glifos
   reales de campana, acciones, navegación ni logos. Solo 02 tiene flechas, como
   caracteres de texto `↙` y `↗`.
8. **Desbordes y datos de ejemplo incoherentes en 03.** La tarjeta KPI "Movimientos"
   sale 28 px del frame, dos descripciones de acciones sobrepasan su tarjeta y los
   importes del resumen no cuadran con "Gastos del mes". Detalle en
   `03-home-desktop-13-2/design-context.md` §8.
9. **Contraste.** Varios pares de color de 03 no cumplen WCAG 2.1 AA. Tabla en
   `03-home-desktop-13-2/design-context.md` §8.

## No modificado

`src/`, `specs/` (incluida `specs/002-registro-usuarios/design/`), la Constitución,
`package.json` y los comandos, las skills, `.specify/feature.json`, la rama y el archivo
de Figma. No se generó código de aplicación ni se agregaron dependencias, commits, push
o PR.
