# Tasks: Registro de Usuarios de KynWallet

**Input**: spec.md, plan.md, research.md, data-model.md y contracts/registration.md.
**Tests**: obligatorias por Constitución I. Cada comportamiento comienza con una prueba
que falle. Los tests incluyen prefijo `Registro` e ID FR/US para distinguirlos del login.
**Autorización**: ciclo local completo, sin aprobaciones intermedias; revisión humana final pendiente.

## Phase 1 Setup

- [x] T001 Verificar extracción y procedencia en `specs/002-registro-usuarios/design/`; registrar el apunte del usuario y la autorización en `harness/sdd/method-reference.md`.
- [x] T002 Revisar `specs/002-registro-usuarios/checklists/requirements.md` y registrar Constitución, Specify, Clarify y Plan en `harness/sdd/registro-usuarios-log.md`.

## Phase 2 Foundational

- [x] T003 Escribir y observar fallar pruebas de `src/domain/registration.test.ts`: FR-001 a FR-007; nombre 1–80 tras trim, correo <=254 según login, contraseña 8–128 sin trim, confirmación obligatoria <=128 e igualdad exacta, términos true.
- [x] T004 Implementar tipos, errores y `validateRegistration` en `src/domain/registration.ts`, reutilizando reglas de `src/domain/validation.ts`; pasar T003.
- [x] T005 [P] Escribir y observar fallar pruebas de `src/application/register.test.ts` y `src/infrastructure/SimulatedRegistrationGateway.test.ts`: FR-003/012/018/019; inválidos no envían, puerto sin argumentos, éxito, rechazo genérico y temporizador controlado.
- [x] T006 Implementar `src/application/ports/RegistrationGateway.ts`, `src/application/register.ts` y `src/infrastructure/SimulatedRegistrationGateway.ts`; caso de uso inyectado y espera predeterminada de 1000 ms; pasar T005.
- [x] T007 Escribir pruebas previas en `src/ui/components/Checkbox/Checkbox.test.tsx` y `src/ui/components/PasswordField/PasswordField.test.tsx` para error/ref/foco, acción separada que no cambia aceptación y nombre de visibilidad distinguible; FR-002/009/017/020/021.
- [x] T008 Extender `src/ui/components/Checkbox/Checkbox.tsx` y CSS, y `src/ui/components/PasswordField/PasswordField.tsx` y CSS para pasar T007, conservando defaults del login.

## Phase 3 US1 Completar el registro (P1, MVP)

**Goal**: éxito único, fallo recuperable y abandono sin confirmaciones tardías.
**Independent Test**: completar la demo, esperar éxito en login y comprobar contraseñas vacías.

- [x] T009 [US1] Escribir pruebas RED en `src/ui/features/registration/RegistrationForm.test.tsx` para US1-1/2/4/5, doble envío y StrictMode; preparar valores ficticios en `src/test/registrationStub.ts`.
- [x] T010 [US1] Implementar `src/ui/features/registration/registrationReducer.ts`, `useRegistrationForm.ts` y `RegistrationForm.tsx` con estado, bloqueo inmediato, guard de intento/desmontaje, campos y respuesta de éxito/error; pasar T009.
- [x] T011 [US1] Escribir pruebas RED de US1-3/5 y FR-011/022 en `src/App.registration.test.tsx`: éxito transitorio, abandono incluso con resolución en la misma tanda, desmontaje/remonte y datos no precargados.
- [x] T012 [US1] Integrar Registro, callback de éxito vigente y casos de uso en `src/App.tsx`, `src/main.tsx` y `src/ui/navigation/useNavigation.ts`; pasar T011 y conservar autenticación existente.

## Phase 4 US2 Validación inline (P1)

**Goal**: corregir antes de enviar, con foco y mensajes asociados.
**Independent Test**: vacío, correo inválido, 7 caracteres, confirmación distinta y términos faltantes.

- [x] T013 [US2] Añadir pruebas RED de US2-1 a US2-7 en `src/ui/features/registration/RegistrationForm.test.tsx`: blur, corrección, coincidencia tras cambiar contraseña, foco de checkbox y límites.
- [x] T014 [US2] Completar estados touched/errores y foco en `src/ui/features/registration/registrationReducer.ts`, `useRegistrationForm.ts` y `RegistrationForm.tsx`; pasar T013 sin duplicar reglas del dominio.

## Phase 5 US3 Navegación y login existente (P2)

**Goal**: enlaces reales, historial y compatibilidad de `/`.
**Independent Test**: login -> Registro -> login; atrás/adelante sin aviso ni formulario viejo.

- [x] T015 [US3] Escribir pruebas RED en `src/App.registration.test.tsx` y actualizar solo expectativas del enlace en `src/ui/features/login/LoginForm.test.tsx`: US3-1/2/3, FR-013/022, historial y restauración de página.
- [x] T016 [US3] Implementar `src/ui/components/NavigationLink/NavigationLink.tsx` y CSS, completar `src/ui/navigation/useNavigation.ts`, cambiar enlace en `src/ui/features/login/LoginForm.tsx` y mantener sus demás funciones; pasar T015.

## Phase 6 US5 Accesibilidad y responsive (P2)

**Goal**: teclado, contraseñas independientes y layout usable desde 320px.
**Independent Test**: controles con nombres y errores accesibles; escritorio dos paneles, móvil solo formulario.

- [x] T017 [US5] Escribir pruebas RED de US5-3/5 en `src/ui/features/registration/RegistrationForm.test.tsx` y variante de marca en `src/ui/layout/BrandPanel/BrandPanel.test.tsx`; axe vacío/errores/ocupado y controles independientes.
- [x] T018 [US5] Implementar estilos en `src/ui/features/registration/RegistrationForm.module.css` y variantes opt-in de `src/ui/features/login/LoginScreen.tsx`, CSS y `src/ui/layout/BrandPanel/BrandPanel.tsx`, CSS; reutilizar tokens accesibles y documentar diferencias R3; pasar T017 (FR-015/016/017/020).

## Phase 7 US4 Accesos sociales y términos (P3)

**Goal**: avisos definidos sin envío ni cambio de aceptación.
**Independent Test**: cada proveedor muestra alert exacto; términos informa sin marcar checkbox.

- [x] T019 [US4] Escribir pruebas RED de US4-1/2 y US5-6 en `src/ui/features/registration/RegistrationForm.test.tsx`: alert "Próximamente" y términos sin cambio de casilla ni envío.
- [x] T020 [US4] Implementar avisos y acción de términos en `src/ui/features/registration/RegistrationForm.tsx`; pasar T019 (FR-014/021).

## Phase 8 Polish y controles

- [x] T021 Verificar FR-018/019/022 y SC-006 con pruebas de privacidad en `src/application/register.test.ts`, `src/ui/features/registration/RegistrationForm.test.tsx` y `src/App.registration.test.tsx`: puerto sin datos, no Storage/logs/URL/history.state con valores, confirmación no persistida.
- [x] T022 Revisar `src/ui/features/registration/RegistrationForm.module.css` y variantes de layout en navegador a 1440×1024, 375 y 320, con teclado y zoom 200 %; registrar capturas y resultados de FR-015/016/017 y SC-004/005 en `specs/002-registro-usuarios/verification.md`.
- [x] T023 Ejecutar `npm run verify` mediante `scripts/harness.cmd -Task Verify` y corregir hasta pasar lint, formato, tipos, cobertura >=80 %, build, auditorías y secretos; registrar salida en `specs/002-registro-usuarios/verification.md`.
- [x] T024 Actualizar `README.md` y `specs/002-registro-usuarios/quickstart.md` con navegación, límites de demo y resultados reales; mantener trazabilidad en `harness/sdd/registro-usuarios-log.md`.
- [x] T025 Comparar código con spec/plan/tasks mediante `speckit-converge` y registrar cualquier trabajo faltante en `specs/002-registro-usuarios/tasks.md`; resolverlo antes de declarar finalización.
- [x] T026 Preparar revisión final en `specs/002-registro-usuarios/verification.md`: matriz requisito -> tarea -> prueba/evidencia y diferencias de diseño; aprobación humana pendiente, sin push ni PR.

## Dependencies & Execution Order

T001/T002 preceden al código. T003 -> T004 y T005 -> T006. T007 -> T008. Las historias usan
esas bases. Las pruebas de UI T009/T011/T013/T015/T017/T019/T021 se preparan y observan
fallar juntas antes de implementar los archivos compartidos del formulario/navegación;
así las pruebas de una historia posterior no se escriben después de su comportamiento.
Luego se construye el MVP y se completan historias en prioridad. T022/T023 dependen de UI
en verde. T024/T025/T026 cierran evidencias y documentos.

## Parallel Opportunities

T005 puede prepararse con T003 en archivos distintos; las investigaciones de R2 y R3 fueron
independientes. Los cambios del formulario y sus pruebas se ejecutan secuencialmente porque
comparten archivos. No se fuerza paralelismo en esos cambios.

## Implementation Strategy

MVP: reglas + caso de uso + formulario + confirmación. Después se validan errores inline,
navegación completa, accesibilidad y avisos. Cada lote registra Rojo -> Verde; refactorizar
solo con pruebas en verde. No se modifican marcadores de revisión humana para habilitar
implementación: el usuario ya autorizó avanzar y conserva aprobación final.

## Phase 9: Convergence

- [x] T027 Consolidar el límite de confirmación en `src/domain/registration.ts` usando `PASSWORD_MAX_LENGTH` de `src/domain/validation.ts`, conservando los tests de límites y observando verde tras refactorizar, según FR-006 y plan R4 de reutilización (partial).

## Phase 10: Ajustes solicitados el 2026-10-16

- [x] T028 Escribir y observar fallar pruebas de spinner visible y duración mínima de 1000 ms en `src/ui/components/Button/Button.test.tsx` y `src/App.registration.test.tsx`; implementar indicador accesible en Button sin cambiar su nombre, con alternativa de movimiento reducido (FR-010).
- [x] T029 Aclarar en mensajes, spec y README que Registro no habilita usuarios del login; observar primero fallar pruebas de esos mensajes en App y RegistrationForm. Configurar una cuenta ficticia únicamente en `.env.local`, sin versionar credenciales (FR-011/019).
- [x] T030 Verificar rutas nativas de spec-kit y explicar la separación entre resultados y consignas manuales en `harness/sdd/README.md`; conservar resultados donde los generan los comandos y registrar la decisión en la bitácora.
- [x] T031 Ejecutar Verify y comprobar el login local y el indicador de envío en navegador; registrar evidencia y límites reales sin marcar aprobación humana. Completado en la revisión de Inicio del 2026-10-16: `../003-inicio-billetera/verification.md`; duración real probada a 999/1000 ms y captura del mismo indicador en fixture visual de 10 s explícito.
