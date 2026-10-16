# Inventario: vistas 03 y 04 de KynWallet

**Fecha**: 2026-10-16
**Archivo**: `pMArqPGrwekkonUVIZLSn4`, "Billetera Virtual - Prototipos (copia)", copia del
original `f7uDsv8sh6ZOtK2OitTqtg`, que la cuenta no puede leer.
**Consigna**: [harness/sdd/figma/vistas-03-04.md](../../harness/sdd/figma/vistas-03-04.md)

## Páginas y frames del archivo

El archivo tiene una sola página: `Page 1` (`0:1`). Sus frames de nivel superior son:

| Nº     | Nombre completo           | Node-id    | Tamaño      | Posición en el lienzo | ¿Extraído aquí?                                     |
| ------ | ------------------------- | ---------- | ----------- | --------------------- | --------------------------------------------------- |
| 01     | `01 · Login`              | `2:2`      | 1440 × 1024 | 0, 0                  | No (ya implementado en `specs/001-login-billetera`) |
| 02     | `02 · Home`               | `11:2`     | 390 × 844   | 1604, 1222            | Sí, a pedido del usuario (versión móvil de 03)      |
| **03** | **`03 · Home — Desktop`** | **`13:2`** | 1440 × 1024 | 0, 1100               | **Sí**                                              |
| **04** | **`04 · Registro`**       | **`31:2`** | 1440 × 1024 | 1540, 0               | **Sí** (verificación; extracción completa previa)   |

**Sin ambigüedad**: hay un único frame con el número 03 y uno con el 04. No hay otros
candidatos ni frames anidados con esa numeración.

## Vistas 03 y 04

| Vista | Pantalla                                               | URL                                                                                                     | Carpeta                                        |
| ----- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 03    | Inicio (dashboard) de la billetera, escritorio         | https://www.figma.com/design/pMArqPGrwekkonUVIZLSn4/Billetera-Virtual---Prototipos--copia-?node-id=13-2 | [03-home-desktop-13-2/](03-home-desktop-13-2/) |
| 04    | **Registro** de usuario ("Crea tu cuenta"), escritorio | https://www.figma.com/design/pMArqPGrwekkonUVIZLSn4/Billetera-Virtual---Prototipos--copia-?node-id=31-2 | [04-registro-31-2/](04-registro-31-2/)         |

**La vista 04 sigue siendo Registro**, no una pantalla interna de la billetera. Del
contenido posterior al login, solo la 03 (y su versión móvil 02) muestra el interior.

### Ampliación: vista 02 (móvil)

A pedido del usuario se extrajo también la versión móvil del inicio:

| Vista | Pantalla                          | URL                                                                                                     | Carpeta                                      |
| ----- | --------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 02    | Inicio de la billetera, móvil 390 | https://www.figma.com/design/pMArqPGrwekkonUVIZLSn4/Billetera-Virtual---Prototipos--copia-?node-id=11-2 | [02-home-mobile-11-2/](02-home-mobile-11-2/) |

## Navegación real del prototipo

Evidencia obtenida con `use_figma` en modo solo lectura:

- Punto de inicio del flujo: `Flow 1` → `2:2` (`01 · Login`).
- `3:2` `Form Panel` (panel derecho completo del login):
  - `ON_CLICK` → `NAVIGATE` → `13:2` `03 · Home — Desktop`.
  - `ON_DRAG` → `NAVIGATE` → `31:2` `04 · Registro`.
- No hay otras reacciones en el archivo. Las vistas 03 y 04 no navegan a ninguna parte,
  y `02 · Home` no está conectada.

## Archivos guardados

| Ruta                                     | Origen                                                           |
| ---------------------------------------- | ---------------------------------------------------------------- |
| `inventory.md`                           | Este archivo                                                     |
| `extraction-notes.md`                    | Fecha, procedencia, herramientas y limitaciones                  |
| `03-home-desktop-13-2/design-context.md` | `get_design_context` + `get_metadata` + `use_figma` (reacciones) |
| `03-home-desktop-13-2/metadata.xml`      | `get_metadata`                                                   |
| `03-home-desktop-13-2/variables.json`    | `get_variable_defs` (respuesta `{}`)                             |
| `03-home-desktop-13-2/screenshot.png`    | `get_screenshot`, 1440 × 1024                                    |
| `03-home-desktop-13-2/assets/*.svg` (12) | URLs de `get_design_context`                                     |
| `04-registro-31-2/design-context.md`     | Verificación y comparación con la extracción previa              |
| `04-registro-31-2/metadata.xml`          | `get_metadata`                                                   |
| `04-registro-31-2/variables.json`        | `get_variable_defs` (respuesta `{}`)                             |
| `04-registro-31-2/screenshot.png`        | `get_screenshot`, 1440 × 1024                                    |
| `04-registro-31-2/assets/*.svg` (4)      | URLs de `get_design_context`                                     |
| `02-home-mobile-11-2/design-context.md`  | `get_design_context` + `get_metadata`                            |
| `02-home-mobile-11-2/metadata.xml`       | `get_metadata`                                                   |
| `02-home-mobile-11-2/variables.json`     | `get_variable_defs` (respuesta `{}`)                             |
| `02-home-mobile-11-2/screenshot.png`     | `get_screenshot`, 390 × 844                                      |
| `02-home-mobile-11-2/assets/*.svg` (3)   | URLs de `get_design_context`                                     |

## Contenido no extraído o sin verificar

- **Archivo original `f7uDsv8sh6ZOtK2OitTqtg`**: inaccesible; no se pudo confirmar que
  la copia coincida con él.
- **Estados interactivos** de 02, 03 y 04 (hover, foco, carga, vacío, error, éxito): no
  existen en el diseño.
- **Pantallas de Historial, Tarjetas, Pagos, Perfil, acciones rápidas y "ver todo"**: no
  existen en el archivo.
