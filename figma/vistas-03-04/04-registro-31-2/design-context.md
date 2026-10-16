# Contexto de diseño: 04 · Registro

**La vista 04 sigue siendo Registro.** El nodo `31:2` del archivo `pMArqPGrwekkonUVIZLSn4`
se llama `04 · Registro` y muestra el formulario "Crea tu cuenta". No es una vista interna
de la billetera.

La extracción completa ya existe y se conserva intacta en
[specs/002-registro-usuarios/design/](../../../specs/002-registro-usuarios/design/):
textos, layout, tipografía, colores, contraste y código de referencia. Este archivo
**no la duplica**; registra solo la verificación del 2026-10-16.

## Identificación

| Propiedad             | Valor                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Nombre                | `04 · Registro`                                                                                         |
| Página                | `Page 1` (`0:1`), la única del archivo                                                                  |
| Node-id               | `31:2`                                                                                                  |
| URL                   | https://www.figma.com/design/pMArqPGrwekkonUVIZLSn4/Billetera-Virtual---Prototipos--copia-?node-id=31-2 |
| Tamaño                | 1440 × 1024                                                                                             |
| Posición en el lienzo | x 1540, y 0 (a la derecha de `01 · Login`)                                                              |
| Variables             | Ninguna (`get_variable_defs` devolvió `{}`)                                                             |

## Navegación del prototipo (evidencia)

Leída con `use_figma` en modo solo lectura:

- En el login (`2:2`), el nodo `3:2` `Form Panel` tiene un disparador `ON_DRAG` que
  navega a `31:2`. El clic en ese mismo panel va a `13:2` (`03 · Home — Desktop`).
- El frame `31:2` no tiene reacciones propias. "Inicia sesión" no está conectado de
  vuelta al login.

Interpretación del agente: arrastrar es un disparador inusual y no corresponde a un
control concreto. En la UI, el acceso al registro es el enlace "Regístrate" del login,
que no tiene reacción propia en el prototipo.

## Comparación con la extracción del 2026-10-15

| Fuente                                                                            | Resultado                                                                                                                                                                           |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_metadata` (estructura, 46 nodos hijos de 31:3 a 31:48, posiciones y tamaños) | Idéntica a `specs/002-registro-usuarios/design/metadata.xml`. `metadata.xml` de esta carpeta reproduce esa estructura con el encabezado de hoy                                      |
| `get_design_context` (textos, estilos, colores y radios)                          | Sin diferencias con el código guardado en `design-context.md` §8 de la extracción previa. Solo cambia el prefijo temporal de las URLs                                               |
| SVG descargados (`logo-dot`, `logo-dot-2`, `eye-icon`, `social-dot`)              | Idénticos byte a byte a los de `specs/002-registro-usuarios/design/assets/` (comprobado con `cmp`)                                                                                  |
| `get_variable_defs`                                                               | `{}` en ambas fechas                                                                                                                                                                |
| Captura                                                                           | `screenshot.png` (1440 × 1024, `get_screenshot`). La extracción previa guardó el export de `download_assets`; ambas son renders del mismo nodo, pero no se compararon píxel a píxel |

**Conclusión**: no se observan diferencias en el diseño de Registro entre el 2026-10-15
y el 2026-10-16.

## Archivos de esta carpeta

- `metadata.xml`: estructura del nodo 31:2.
- `variables.json`: respuesta real y vacía de `get_variable_defs`.
- `screenshot.png`: captura 1440 × 1024 obtenida hoy.
- `assets/`: los cuatro SVG descargados hoy, idénticos a los previos.
- Este `design-context.md`.
