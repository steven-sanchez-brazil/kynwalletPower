# Notas de extracción de Figma: 04 Registro

**Fecha de extracción**: 2026-10-15
**Agente**: Claude Code con el MCP oficial de Figma
**Consigna**: [harness/sdd/figma/registro-usuarios.md](../../../harness/sdd/figma/registro-usuarios.md), bloque "Consigna para Claude Code"

**Resultado**: extracción completa desde una **copia** del archivo original.

## Origen

| | Archivo | URL |
| --- | --- | --- |
| Original (consigna) | `f7uDsv8sh6ZOtK2OitTqtg` | https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2 |
| Copia usada | `pMArqPGrwekkonUVIZLSn4` | https://www.figma.com/design/pMArqPGrwekkonUVIZLSn4/Billetera-Virtual---Prototipos--copia-?node-id=31-2 |

**Nodo consultado**: `31:2`, frame `04 · Registro`, 1440 × 1024. La copia conserva el
mismo ID de nodo y nombre de frame que la consigna.

**Equivalencia entre copia y original**: el usuario duplicó el archivo en sus borradores
el 2026-10-15. No se pudo comparar con el original porque sigue inaccesible. Se asume
que la copia refleja el original a esa fecha; cambios posteriores en el original no
estarán en esta extracción.

## Intentos previos sobre el original

El MCP rechazó todas las lecturas del archivo original con "Looks like you don't have
edit access to this file". `whoami` muestra un único plan Starter con asiento View.

| Herramienta | Figma Debug UUID |
| --- | --- |
| `create_session` | `f175fcd6-7ebd-4819-99ae-3448788fe2e2`, `a2517975-e798-489e-95a5-35f831183950` |
| `get_design_context` | `f2e41701-e6e6-45c6-a34f-2f8e23ebc236` |
| `get_metadata` (31:2 y página) | `f3e95628-ed5e-4c5a-85c6-cfcc445f31d5`, `67e5fd23-f0b5-4d20-8d4d-96c157c52692` |
| `get_variable_defs` | `13722102-ed25-4cd4-bd53-b3e05a3c6917` |
| `get_screenshot` | `a94ba9d7-9e8e-4cca-a67f-716b40657b74` |
| `download_assets` | `7d2bf195-edb6-43f3-bf87-89dae9314e82` |

## Herramientas usadas sobre la copia

| Herramienta | Resultado |
| --- | --- |
| `create_session` | OK |
| `get_metadata` (página `0:1`) | OK. Frames: `01 · Login` (2:2), `02 · Home` (11:2), `03 · Home — Desktop` (13:2) y `04 · Registro` (31:2) |
| `get_design_context` (31:2) | OK. Código React + Tailwind de referencia, 4 URLs de SVG y captura |
| `get_metadata` (31:2) | OK. Guardado en `metadata.xml` |
| `get_variable_defs` (31:2) | OK, respuesta vacía `{}` |
| `download_assets` (31:2) | OK. Export PNG 1440 × 1024 y 4 SVG |
| `get_screenshot` (31:2) | OK. Se usó como verificación; se guardó el export de `download_assets` |

Las descargas con `curl` necesitaron `--ssl-revoke-best-effort`. La red corporativa
no deja consultar la revocación de certificados (`CRYPT_E_NO_REVOCATION_CHECK`). La
validación TLS se mantuvo; solo se tolera que la consulta de revocación no responda.

## Archivos guardados

| Archivo | Contenido |
| --- | --- |
| `design-context.md` | Textos exactos, layout, medidas, tipografía, colores, bordes, radios, componentes, interpretaciones, contraste WCAG y código de referencia del MCP |
| `metadata.xml` | Estructura del frame 31:2 devuelta por `get_metadata` |
| `design-tokens.json` | Resultado de `get_variable_defs`: sin variables ni estilos |
| `registro-desktop.png` | Export PNG del frame, 1440 × 1024, escala 1 (`download_assets`) |
| `assets/logo-dot.svg` | Nodo 31:4, elipse blanca 10 × 28 |
| `assets/logo-dot-2.svg` | Nodo 31:5, círculo blanco al 55 %, 14 × 14 |
| `assets/eye-icon.svg` | Nodos 31:28 y 31:32, elipse `#a9abc2` al 50 %, 20 × 12 |
| `assets/social-dot.svg` | Nodos 31:42 (Google) y 31:45 (Apple), círculo `#d7d9e6` 20 × 20 |
| `extraction-notes.md` | Este archivo |

Los nombres de los SVG los eligió el agente a partir de las capas. En la respuesta de
Figma se llamaban `cb2fb`, `bc0bd`, `ff621` y `2c3a0`.

## Limitaciones

1. **Extraído de una copia**, no del archivo original. Ver "Equivalencia" arriba.
2. **Sin tokens de Figma.** El frame usa valores directos. `design-tokens.json` está vacío
   a propósito; los valores están en `design-context.md`.
3. **Sin frame móvil de Registro.** Ningún frame de la página corresponde al registro
   móvil. No se dedujo un diseño móvil.
4. **Sin estados de interacción.** Solo existe el estado vacío. No hay error inline,
   foco, checkbox marcado, carga ni éxito.
5. **Iconos provisorios.** Los SVG son formas geométricas, no los logos reales de Google
   y Apple ni un icono de ojo.
6. **Sin componentes de Figma ni Code Connect**: el frame no usa instancias.
7. **Contraste.** Varios pares de color no cumplen WCAG 2.1 AA. Ver la tabla en
   `design-context.md`, sección 7.
8. No se modificó ningún archivo de Figma ni del código de la aplicación. No se
   guardaron tokens de acceso ni URLs temporales de assets.
