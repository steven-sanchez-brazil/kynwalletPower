# Matriz de validación del registro

| Requisito  | Evidencia real                                                                          | Estado                                         |
| ---------- | --------------------------------------------------------------------------------------- | ---------------------------------------------- |
| FR-001     | RegistrationScreen, BrandPanel tests; browser-evidence/register-1440.png                | Implementado; diferencias AA documentadas      |
| FR-002–005 | domain/registrationValidation.test.ts; REG-US2 formulario y límites                     | Verificado automáticamente                     |
| FR-006     | REG-US2 blur/envío/corrección/pegado                                                    | Verificado automáticamente                     |
| FR-007     | register.test.ts, hook/reducer y REG-US1 de formulario                                  | Verificado automáticamente                     |
| FR-008     | App.registration.test.tsx, Chrome éxito y recarga                                       | Verificado automáticamente                     |
| FR-009     | fake.test.ts, App.registration, red/Storage/History en browser-smoke                    | Verificado automáticamente                     |
| FR-010     | REG-US3 alertas exactas y foco de Google/Apple                                          | Verificado automáticamente                     |
| FR-011     | App.registration enlaces conectados y popstate; Chrome navegación                       | Verificado automáticamente                     |
| FR-012     | REG-US4 dos controles por teclado; PasswordField previo conservado                      | Verificado automáticamente                     |
| FR-013     | Chrome 320/375/768/1024/1440, sin overflow; layout y capturas                           | Verificado en Chrome                           |
| FR-014     | Axe jsdom y Chrome; foco/teclado/required/anuncios; texto 200 %                         | Automático verificado; lector humano pendiente |
| FR-015     | REG-US3 términos, datos/casilla preservados                                             | Verificado automáticamente                     |
| FR-016     | register/fake/diagnostics tests; recuperación/error seguro; texto ejecutable como valor | Verificado automáticamente                     |
| SC-001     | usability-review.md                                                                     | Pendiente: cinco participantes reales          |
| SC-002     | casos inválidos con cero llamadas y mensajes inline                                     | Verificado automáticamente                     |
| SC-003     | results.json, éxito observado ≈550 ms (<2 s)                                            | Verificado en Chrome                           |
| SC-004     | screenshots cinco anchos, errores móvil, texto ampliado y medición de overflow          | Verificado automáticamente y visualmente       |
| SC-005     | axe sin infracciones en Chrome + revisión de semántica/foco                             | Parcial: lector humano pendiente               |
| SC-006     | design-review.md y capturas reales comparadas con referencia                            | Pendiente aprobación de diferencias AA         |
| SC-007     | pruebas identificadas REG-USn y escenarios de privacidad                                | Parcial: evidencias humanas pendientes         |

Rutas de pruebas relativas a `src/`; el detalle de comandos/resultados y línea base está en `validation.md`. No hay APIs externas, base de datos, cuentas persistidas ni bibliotecas nuevas.
