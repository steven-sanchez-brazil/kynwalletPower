# Consigna de Tasks para Registro

**Estado**: propuesta; todavía no ejecutada. Se utilizará después de revisar el plan.
**Resultado esperado**: `specs/002-registro-usuarios/tasks.md`.

## Prompt para Codex

```text
$speckit-tasks
SPECIFY_FEATURE_DIRECTORY=specs/002-registro-usuarios
Descomponer la spec y el plan revisados en tareas por historia de usuario.
Cada cambio de comportamiento comienza con una prueba que falle y luego sigue
Rojo -> Verde -> Refactorizar. Relacionar cada tarea con requisitos y escenarios.
Incluir dependencias, reutilización de componentes, navegación y confirmación
de éxito, validaciones, responsive, accesibilidad y protección de contraseñas.
Mantener el alcance de demo sin backend y los controles existentes del proyecto.
Incluir npm run verify y revisión visual al cerrar la implementación.
Guardar tasks.md en specs/002-registro-usuarios/ y registrar las decisiones en
harness/sdd/registro-usuarios-log.md. No marcar tareas como completadas por anticipado.
El siguiente paso será analizar consistencia con $speckit-analyze antes de implementar.
```
