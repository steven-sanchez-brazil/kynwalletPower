# Tasks: Inicio de billetera

**Input**: spec, plan, research, modelo y contrato de esta carpeta. TDD obligatorio por Constitución. Estado inicial: tareas propuestas; marcar solo con evidencia.

## Phase 1: Setup

- [x] T001 Registrar fuentes, revisión constitucional y decisiones en specs/003-inicio-billetera/research.md y constitution-review.md.
- [x] T002 Comprobar ignores, rama y selección de feature; actualizar contexto en AGENTS.md.

## Phase 2: Foundational

- [x] T003 Escribir y ejecutar prueba roja de snapshot/puerto FR-003 en src/application/readWalletOverview.test.ts y src/infrastructure/DemoWalletGateway.test.ts.
- [x] T004 Crear contrato readonly, puerto síncrono, caso de uso y adaptador en src/domain/wallet.ts, src/application/ports/WalletGateway.ts, src/application/readWalletOverview.ts y src/infrastructure/DemoWalletGateway.ts; datos y restricciones de data-model.md.

## Phase 3: US1 Entrar a Inicio (P1, MVP)

**Goal**: mostrar interior de billetera tras acceso válido. **Independent Test**: login válido abre Inicio con nombre y datos.

- [x] T005 [P] [US1] Escribir y ejecutar pruebas rojas de contenido/semántica FR-002/003/005/008 en src/ui/features/home/WalletHome.test.tsx.
- [x] T006 [US1] Escribir y ejecutar prueba roja login→Inicio FR-001 en src/App.home.test.tsx y actualizar expectativa de App.test.tsx.
- [x] T007 [US1] Crear composición responsive, saldo/KPI, movimientos, tarjeta y resumen en src/ui/features/home/WalletHome.tsx y WalletHome.module.css; copiar diferencias desktop/móvil de contracts/ui.md y mantener nombre de 1–80 caracteres con reflujo.
- [x] T008 [US1] Conectar callback de acceso y snapshot inyectado en src/ui/features/login/LoginForm.tsx, useLoginForm.ts, src/App.tsx y src/main.tsx; ajustar tests de App con inyección explícita.

## Phase 4: US3 Salir y proteger acceso (P1)

**Goal**: sesión efímera sin credenciales. **Independent Test**: salida y ruta directa no recuperan Inicio.

- [x] T009 [P] [US3] Escribir y ejecutar pruebas rojas FR-006/007/009 de cierre, ruta directa, historial, restauración y respuesta tardía en src/App.home.test.tsx; limpieza de contraseña en src/ui/features/login/loginReducer.test.ts.
- [x] T010 [US3] Implementar nombre efímero, guardias y limpieza al éxito en src/ui/navigation/useNavigation.ts y src/ui/features/login/loginReducer.ts, con generación síncrona y sin escrituras de sesión.

## Phase 5: US2 Acciones demo (P2)

**Goal**: respuesta por acción sin operaciones. **Independent Test**: controles por teclado anuncian Próximamente; saldo/URL intactos.

- [x] T011 [US2] Escribir y ejecutar pruebas rojas FR-004 de todos los controles secundarios, activación repetida e Inicio activo en src/ui/features/home/WalletHome.test.tsx.
- [x] T012 [US2] Implementar avisos accesibles, nombres y estados activos en src/ui/features/home/WalletHome.tsx.

## Phase 6: Polish & Cross-Cutting

- [x] T013 Ejecutar regresiones, axe y verify completo FR-008/010; registrar resultados en specs/003-inicio-billetera/verification.md.
- [x] T014 Revisar navegador real a 1440/390/320/768, ampliación, teclado, nombre largo, salida y spinner Registro; guardar capturas y límites en specs/003-inicio-billetera/evidence/ y verification.md.
- [x] T015 Actualizar README.md, harness/sdd/inicio-billetera-log.md y revisión final de diff con trazabilidad.

## Dependencies & Execution Order

Setup → foundational → US1 → US3 → US2 → controles. US1 es el MVP; no se publica. US3 se valida como recorrido propio, US2 con componente aislado. T005 y T009 pueden escribirse en archivos distintos una vez disponible el snapshot, pero toda implementación espera su rojo. Los archivos compartidos se modifican en secuencia.

## Parallel examples

US1: contenido aislado T005 y preparación de integración T006 en archivos distintos. US3: prueba de reducer separable de integración dentro de T009. US2: avisos de UI separados del caso de uso de datos ya completo. La ejecución actual es secuencial; investigación delegada según skill Plan.

## Implementation Strategy

Probar datos, luego contenido/acceso, seguridad de sesión y controles. Rojo antes de comportamiento, Verde con pruebas enfocadas, refactorizar sin alterar contratos. Cerrar con controles completos y evidencia visual; revisión humana final no se marca como tarea técnica completada.

## Phase 7: Ajuste de accesibilidad detectado en revisión

- [x] T016 Corregir salto al contenido con foco explícito y sin navegación de fragmento en src/ui/features/home/WalletHome.tsx; prueba roja en WalletHome.test.tsx y comprobación en navegador, FR-008/007.

## Phase 8: Correcciones visuales solicitadas por el usuario

- [x] T017 Reproducir y comprobar con mediciones de navegador los textos oscuros y el perfil fuera del viewport; restaurar blancos de Figma y sidebar con menú de scroll interno en src/ui/features/home/WalletHome.module.css, FR-011/012.
- [x] T018 Observar primero fallo de selección de símbolo por frame en src/ui/layout/BrandPanel/BrandPanel.test.tsx; reutilizar SVG de geometría fiel desde src/ui/assets/ en BrandPanel.tsx y src/ui/features/home/WalletHome.tsx, FR-013.
- [x] T019 Ejecutar Verify y revisión visual desktop/móvil, altura reducida, scroll y teclado; actualizar specs/003-inicio-billetera/verification.md y harness/sdd/inicio-billetera-log.md con evidencia y discrepancia de contraste solicitada.

## Phase 9: Revisión de arquitectura y publicación al fork

- [x] T020 Comparar capas, composición, puertos, estado, componentes y herramientas con el commit original; registrar resultados en specs/003-inicio-billetera/architecture-review.md.
- [x] T021 Alinear el modelo de Registro con Login en src/domain/registration.ts, src/domain/messages.ts y src/domain/validation.ts; ajustar imports y conservar las pruebas de comportamiento en verde antes y después.
- [x] T022 Ejecutar Verify completo y revisar exclusiones y staged diff; crear commit y push normal a origin/feature/registro-pedro-gandola con la autorización del usuario, dejando el PR para el paso posterior; registrar evidencia en specs/003-inicio-billetera/verification.md y harness/sdd/inicio-billetera-log.md.
