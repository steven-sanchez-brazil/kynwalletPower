# Revisión de la Constitución para Registro de Usuarios

**Fecha**: 2026-10-15.
**Base**: [Constitución 1.0.0](../../.specify/memory/constitution.md), ratificada el 2026-10-14.
**Estado**: revisión documental de Codex; implementación y revisión humana pendientes.

El registro se desarrolla bajo la Constitución que ya rige el login. No se propone una
enmienda. Esta revisión identifica sus implicaciones; la comprobación formal del diseño
corresponde a la sección Constitution Check del futuro plan.

| Principio o sección        | Aplicación a Registro                                                                                         | Evidencia que habrá que producir                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| I. TDD                     | Validaciones, envío, navegación y estados comienzan con pruebas que fallan                                    | Tareas y resultados Rojo -> Verde -> Refactorizar                   |
| II. SOLID                  | Separar responsabilidades e inyectar las dependencias que se necesiten                                        | Contratos y composición descritos en el plan                        |
| III. Clean Architecture    | Reglas en dominio o aplicación; UI e infraestructura en el exterior                                           | Estructura del plan y controles de importaciones                    |
| IV. DRY, KISS, YAGNI       | Reutilizar campos, botones, checkbox y tokens; justificar cualquier dependencia                               | Decisiones y alternativas en research.md                            |
| V. Seguridad               | Validar entradas; no guardar ni registrar contraseñas; distinguir demo de cuenta real                         | Requisitos, contratos y pruebas identificables                      |
| VI. BRD y ARD              | No se identificaron documentos independientes en el repo inspeccionado; el taller aporta el alcance funcional | Referencias utilizadas y registro de nueva documentación si aparece |
| 7. Dependencias            | Mantener el lockfile y verificar licencias y vulnerabilidades                                                 | Justificación de nuevas dependencias y auditorías                   |
| 8. Calidad y accesibilidad | TypeScript estricto, cobertura existente y WCAG 2.1 AA                                                        | Pruebas, teclado, contraste, responsive y controles de calidad      |
| 9. Gobierno                | Conservar trazabilidad y revisiones antes de integrar                                                         | Spec, plan, tareas, pruebas y revisión del cambio                   |

## Decisiones de preparación

- Conservar la Constitución existente como única referencia normativa.
- Documentar Registro en `specs/002-registro-usuarios/`, separado del login.
- Conservar la rama `feature/registro-pedro-gandola` y la integración de Codex.
- Registrar prompts y decisiones en la [bitácora del harness](../../harness/sdd/registro-usuarios-log.md).
- Aplicar el alcance confirmado por el usuario el 2026-10-15: demo sin backend, envío
  simulado y sin guardar contraseñas.

## Comprobaciones para el plan (estado inicial)

- Para la demo confirmada, definir cómo se simula el resultado sin persistir credenciales
  ni prometer que la nueva cuenta permitirá autenticarse.
- Comparar el frame de Registro con los componentes y tokens del login. Las desviaciones
  de contraste que ya documenta el login no se consideran automáticamente aprobadas para
  una nueva pantalla; registrar el tratamiento aplicable al nuevo diseño.
- Precisar navegación y mensaje de confirmación en `/login` sin perder el comportamiento
  vigente del login para las cuentas de prueba.
- Mantener los controles existentes; no incorporar servicios o datos sensibles ajenos
  al alcance del taller.

Esta revisión no certifica cumplimiento de código futuro ni sustituye la revisión técnica
exigida para integrar un cambio.

## Revisión del ciclo completo del 2026-10-15

Se resolvió la plantilla con `resolve-template.ps1 constitution-template -Json` y se
contrastó la Constitución vigente, el apunte metodológico y la extracción recibida.
No se identificó una enmienda necesaria: se conserva versión 1.0.0 y sus fechas.
La autorización explícita de ejecutar sin aprobaciones intermedias se aplica al proceso;
la aprobación humana y de las adaptaciones visuales siguen pendientes al finalizar.

El plan resolvió las comprobaciones iniciales con puerto sin datos, simulación de 1000 ms,
variantes de componentes y navegación efímera. La verificación automatizada posterior
pasó los controles existentes; evidencia y revisión visual en `verification.md`.
