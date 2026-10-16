# Consigna de Constitution para Registro

**Estado**: revisión inicial realizada; no hay una enmienda propuesta.
**Resultado**: [revisión de la Constitución](../../../specs/002-registro-usuarios/constitution-review.md).

El proyecto ya tiene una [Constitución común](../../../.specify/memory/constitution.md).
La entrada del usuario en esta etapa define qué principios revisar y qué restricciones
aplican a Registro. `$speckit-constitution` se utiliza si se acuerda crear o enmendar la
Constitución; no hace falta regenerarla para cada funcionalidad.

## Prompt para revisar la base existente

```text
Revisar .specify/memory/constitution.md para la funcionalidad Registro de Usuarios.
Identificar implicaciones de TDD, SOLID, Clean Architecture, reutilización, seguridad,
accesibilidad y trazabilidad. El alcance confirmado es una demo sin backend, con
envío simulado y sin guardar contraseñas.
Registrar el resultado en specs/002-registro-usuarios/constitution-review.md y las
decisiones en harness/sdd/registro-usuarios-log.md.
Conservar la Constitución existente y su versión. Si se identifica una necesidad
real de enmienda, presentar su motivo y alcance antes de modificarla.
```
