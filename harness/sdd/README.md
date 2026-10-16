# Guía del usuario para conducir el proceso SDD

Esta carpeta contiene las entradas con las que el usuario dirige cada etapa: objetivos,
prompts y decisiones. Se pueden ajustar antes de ejecutar el paso correspondiente.
Los resultados de spec-kit se guardan en sus rutas de trabajo habituales.

`harness/sdd/` fue agregado para organizar entradas y registros; no lo crea spec-kit.
Los dos niveles no son una exigencia de SDD. Las carpetas `constitution/`, `specify/`,
`plan/` y `tasks/` de este harness contienen **consignas**, no los documentos generados.
Estos últimos permanecen donde los dejan las skills y sus scripts, sin reubicar sus salidas.

## Carpetas de las consignas

| Etapa                          | Entrada del usuario para Registro                                      |
| ------------------------------ | ---------------------------------------------------------------------- |
| Constitution                   | [constitution/registro-usuarios.md](constitution/registro-usuarios.md) |
| Specify                        | [specify/registro-usuarios.md](specify/registro-usuarios.md)           |
| Plan                           | [plan/registro-usuarios.md](plan/registro-usuarios.md)                 |
| Tasks                          | [tasks/registro-usuarios.md](tasks/registro-usuarios.md)               |
| Extracción de Figma con Claude | [figma/registro-usuarios.md](figma/registro-usuarios.md)               |

La [bitácora de Registro](registro-usuarios-log.md) conserva los prompts utilizados,
las respuestas y las decisiones. Los prompts de pasos pendientes son propuestas editables;
no indican que esos pasos se hayan ejecutado.

## Dónde se guardan los resultados

- Constitución común del proyecto: `.specify/memory/constitution.md`.
- Documentos de Registro: `specs/002-registro-usuarios/`.
- En esa carpeta, `spec.md`, `plan.md` y `tasks.md` pertenecen a la misma funcionalidad.
  Sus documentos de apoyo incluyen investigación, contratos, checklists y referencias de diseño.

Esta distribución es la que utiliza la integración instalada: el
[resolutor de rutas](../../.specify/scripts/powershell/common.ps1) busca `spec.md`,
`plan.md` y `tasks.md` dentro de la carpeta de la feature. Las skills consultan la
Constitución en `.specify/memory/constitution.md`. No se modifican esos resolutores.

## Cómo trabajamos por etapas

1. El usuario define o ajusta la consigna del paso en su carpeta del harness.
2. Codex lee esa consigna y aplica la skill correspondiente en el chat. Los comandos
   `$speckit-...` son invocaciones del agente; los scripts PowerShell son herramientas de apoyo.
3. Se revisa el resultado y se registran en la bitácora decisiones y respuestas.
4. Se avanza al paso siguiente con los documentos vigentes y revisados.

La Constitución común se revisó sin enmienda. Registro tiene spec, aclaraciones, plan,
research, modelo, contratos y tareas ejecutadas con pruebas previas; Analyze no encontró
bloqueos. Se implementó la demo sin backend ni persistencia que confirmó el usuario.
El control completo del ajuste pasó con 166 pruebas, limitando la concurrencia del proceso a dos workers. Se revisó escritorio, móvil y teclado en Edge en la entrega inicial,
además de ampliación controlada al 200 %; evidencia y límites están en
[verification.md](../../specs/002-registro-usuarios/verification.md).

El usuario autorizó el 2026-10-15 ejecutar el ciclo local completo sin aprobaciones
intermedias, tomando su [apunte SDD](method-reference.md) como referencia. Esto no
convierte los resultados en aprobados: la revisión humana final sigue pendiente.

## Extracción de Claude recibida

Para el interior posterior al login, el usuario señaló las vistas 03 y 04 el 2026-10-16.
La [consigna de extracción de esas vistas](figma/vistas-03-04.md) ya se ejecutó en Claude.
Los resultados están en `figma/vistas-03-04/`: 03 (`13:2`) es Inicio de escritorio,
02 (`11:2`) es su variante móvil y 04 (`31:2`) sigue siendo Registro.
Inicio tiene su ciclo independiente en `specs/003-inicio-billetera/` y la bitácora
[inicio-billetera-log.md](inicio-billetera-log.md), con consignas `inicio-billetera.md`
en las cuatro carpetas de etapas. El puntero local de spec-kit selecciona esa feature.

El usuario informó el 2026-10-15 que Claude Code ya está conectado al MCP de Figma.
Claude ejecutó la consigna de `figma/registro-usuarios.md` con el nodo `31:2` de una copia
del archivo en borradores. Los archivos recibidos se conservan en
`specs/002-registro-usuarios/design/`, porque son evidencia de la funcionalidad.

Codex verificó la captura, contexto, metadata, variables vacías y recursos antes de
planificar. No hay frame móvil ni estados de interacción; el plan documenta esas
derivaciones y las adaptaciones de contraste. La extracción no cambia la integración
de spec-kit de Codex ni prueba una conexión directa de esta sesión a Figma.
