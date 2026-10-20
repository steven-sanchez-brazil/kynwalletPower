---

description: "Task list for 002-registro-usuarios"
---

# Tasks: Registro de usuarios de KynWallet

**Input**: Design documents from `/specs/002-registro-usuarios/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md,
contracts/registration-simulator.md, contracts/ui-registration.md, quickstart.md

**Tests**: OBLIGATORIAS. La Constitution exige TDD; cada conducta se inicia con una prueba
automatizada que falla y sigue el ciclo Rojo → Verde → Refactorizar.

**Organization**: Las tareas se agrupan por historia para que cada incremento sea implementable
y verificable de forma independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede ejecutarse en paralelo porque usa archivos distintos y no depende de tareas pendientes.
- **[Story]**: historia de usuario de `spec.md` (US1–US7).
- Todas las rutas son relativas a la raíz; las pruebas viven junto al código (`*.test.ts[x]`).
- Cada `it(...)` DEBE comenzar con el ID US/FR/SC o escenario que verifica para cumplir
  trazabilidad bidireccional (Constitution 9.2 y FR-030).
- En cada bloque de pruebas se DEBE observar el fallo esperado antes de iniciar la implementación.

---

## Phase 1: Setup (preparación de la feature)

**Purpose**: preservar la base existente, preparar dobles de prueba y fijar una línea de regresión

- [X] T001 Ejecutar la suite existente y registrar rama, comandos y resultado base de login en `specs/002-registro-usuarios/quickstart.md`, sin corregir ni modificar archivos de `specs/001-login-billetera/`
- [X] T002 [P] Crear fixtures ficticios sin datos reales y stubs inyectables de registro, simulación, telemetría y navegación en `src/test/registrationFixtures.ts` y `src/test/registrationStubs.ts`

---

## Phase 2: Foundational (prerrequisitos bloqueantes)

**Purpose**: construir contratos, reglas compartidas, adaptadores y layout requeridos por todas las historias

**⚠️ CRITICAL**: ninguna historia comienza hasta completar esta fase.

### Tests first

- [X] T003 [P] Escribir pruebas de `validateRegistration` y `normalizeRegistration` en `src/domain/registrationValidation.test.ts`: nombre “solo trim, 1–80 y espacios internos admitidos”; correo “trim + minúsculas, formato válido y máximo 254”; contraseña “obligatoria, 8–128 y nunca recortar/normalizar”; confirmación “obligatoria e igualdad exacta”; términos “debe ser true”; verificar todos los mensajes de `data-model.md` (FR-003–FR-006, FR-008, FR-011)
- [X] T004 [P] Definir tipos `RegistrationValues`, `RegistrationField`, `RegistrationErrorCode`, `RegistrationErrors` y `RegistrationResult = success | unavailable`, y agregar la tabla única de mensajes exactos en `src/domain/registration.ts` y `src/domain/messages.ts`
- [X] T005 Implementar normalización y validación puras hasta pasar T003 en `src/domain/registrationValidation.ts`, reutilizando primitivas existentes sin cambiar el contrato de `src/domain/validation.ts`
- [X] T006 [P] Definir los puertos mínimos `RegistrationSimulator.simulate()` sin argumentos y `RegistrationTelemetry` con eventos categóricos sin PII en `src/application/ports/RegistrationSimulator.ts` y `src/application/ports/RegistrationTelemetry.ts`
- [X] T007 [P] Escribir pruebas de contrato para demora/resultado controlables, cero argumentos, traducción de fallos y eventos sin PII en `src/infrastructure/InMemoryRegistrationSimulator.test.ts` y `src/infrastructure/BrowserRegistrationTelemetry.test.ts` (FR-018–FR-021, SC-002, SC-008)
- [X] T008 Implementar `InMemoryRegistrationSimulator` y `BrowserRegistrationTelemetry` hasta pasar T007 en `src/infrastructure/InMemoryRegistrationSimulator.ts` y `src/infrastructure/BrowserRegistrationTelemetry.ts`, sin red, storage, cookies, campos libres ni datos del formulario
- [X] T009 [P] Escribir pruebas de contrato de `createRegisterUser` en `src/application/registerUser.test.ts`: inválidos → errores y cero simulaciones; válidos → una simulación sin payload; throw → unavailable; resultado sin PII (FR-012, FR-016–FR-021)
- [X] T010 Implementar el caso de uso inyectable `createRegisterUser` hasta pasar T009 en `src/application/registerUser.ts`, coordinando validación, simulación y telemetría sin conservar valores
- [X] T011 [P] Escribir pruebas de compatibilidad del layout compartido y de los valores por defecto del login en `src/ui/layout/AuthScreen/AuthScreen.test.tsx` y `src/ui/layout/BrandPanel/BrandPanel.test.tsx`
- [X] T012 Extraer `AuthScreen` y parametrizar `BrandPanel` hasta pasar T011 en `src/ui/layout/AuthScreen/AuthScreen.tsx`, `src/ui/layout/AuthScreen/AuthScreen.module.css`, `src/ui/layout/BrandPanel/BrandPanel.tsx` y `src/ui/features/login/LoginScreen.tsx`, preservando textos y presentación de feature 001

**Checkpoint**: reglas, puertos, simulación y layout están listos; la regresión de login continúa verde.

---

## Phase 3: User Story 1 - Completar el registro y continuar al login (Priority: P1) 🎯 MVP

**Goal**: completar datos válidos, procesar exactamente una simulación y llegar a `/login` con
el mensaje exacto de éxito; informar y permitir reintento ante error inesperado.

**Independent Test**: completar el formulario válido, aceptar términos y enviar; verificar una
simulación, estado ocupado, mensaje “Cuenta creada correctamente. Ya puedes iniciar sesión.” en
`/login`, limpieza de valores y retry tras unavailable.

### Tests for User Story 1 ⚠️

- [X] T013 [P] [US1] Escribir pruebas del estado inicial y transiciones happy-path/error/doble-submit del reducer en `src/ui/features/registration/registrationReducer.test.ts` (FR-016–FR-021, SC-009)
- [X] T014 [P] [US1] Escribir pruebas del hook con lock síncrono, desmontaje seguro, limpieza y una única llamada asíncrona en `src/ui/features/registration/useRegistrationForm.test.tsx`
- [X] T015 [P] [US1] Escribir pruebas de integración del envío válido, Enter, loading, unavailable y retry en `src/ui/features/registration/RegistrationForm.test.tsx` (US1-1–US1-4, SC-001–SC-002)
- [X] T016 [P] [US1] Escribir pruebas de `/register → /login`, flash fijo perceptible y descarte de datos al navegar en `src/App.test.tsx` (FR-017, FR-020, SC-001, SC-008)

### Implementation for User Story 1

- [X] T017 [US1] Implementar `RegistrationFormState`, acciones y transiciones hasta pasar T013 en `src/ui/features/registration/registrationReducer.ts`
- [X] T018 [US1] Implementar `useRegistrationForm` hasta pasar T014 en `src/ui/features/registration/useRegistrationForm.ts`, con botón inactivo, guardia reducer, lock `inFlightRef` y liberación en `finally`
- [X] T019 [US1] Implementar el formulario y pantalla base hasta pasar T015 en `src/ui/features/registration/RegistrationForm.tsx`, `src/ui/features/registration/RegistrationForm.module.css` y `src/ui/features/registration/RegistrationScreen.tsx`, reutilizando TextField, PasswordField, Button, Divider, SocialButton y Alert
- [X] T020 [US1] Integrar rutas mínimas, flash en memoria e inyección de simulator/telemetry hasta pasar T016 en `src/App.tsx`, `src/main.tsx` y `src/ui/features/login/LoginForm.tsx`, manteniendo `/` y `/login` compatibles

**Checkpoint**: el recorrido válido y el error inesperado funcionan de punta a punta sin persistencia.

---

## Phase 4: User Story 2 - Validar los datos antes de registrar (Priority: P1)

**Goal**: mostrar errores inline específicos, validar al abandonar/enviar, corregir aisladamente
y enfocar el primer control inválido sin invocar el simulator.

**Independent Test**: enviar todos los campos vacíos, corregirlos uno por uno y probar nombre
compuesto/espacios y correo inválido/largo; comprobar mensajes, foco y cero simulaciones.

### Tests for User Story 2 ⚠️

- [X] T021 [P] [US2] Ampliar pruebas del reducer para blur, touched, submit inválido, corrección aislada y orden de errores en `src/ui/features/registration/registrationReducer.test.ts` (FR-010–FR-014)
- [X] T022 [P] [US2] Ampliar pruebas de `RegistrationForm` con envío vacío, nombre 0/1/80/81 tras trim, nombre compuesto, correo inválido/254/255 y foco nombre→correo en `src/ui/features/registration/RegistrationForm.test.tsx` (US2-1–US2-6, SC-003–SC-004)
- [X] T023 [P] [US2] Ampliar pruebas del caso de uso para cada error de nombre/correo y confirmar cero llamadas al simulator en `src/application/registerUser.test.ts`

### Implementation for User Story 2

- [X] T024 [US2] Integrar validación incremental y recálculo solo del campo corregido en `src/ui/features/registration/registrationReducer.ts` hasta pasar T021 y T023
- [X] T025 [US2] Asociar errores con `aria-invalid`/`aria-describedby`, validar en blur/submit y mover foco mediante refs al primer inválido en `src/ui/features/registration/RegistrationForm.tsx` hasta pasar T022

**Checkpoint**: US2 bloquea todo envío inválido y cada error puede corregirse sin afectar los demás.

---

## Phase 5: User Story 3 - Confirmar y proteger la contraseña (Priority: P2)

**Goal**: conservar exactamente las contraseñas, exigir coincidencia y ofrecer visibilidad
independiente y accesible.

**Independent Test**: probar 7/8/128/129 caracteres y espacios, una confirmación distinta y
activar por teclado cada toggle sin alterar el otro campo o su valor.

### Tests for User Story 3 ⚠️

- [X] T026 [P] [US3] Ampliar pruebas de PasswordField para etiquetas de visibilidad configurables, `aria-pressed`, teclado y dos instancias independientes en `src/ui/components/PasswordField/PasswordField.test.tsx` (FR-007, SC-005)
- [X] T027 [P] [US3] Ampliar pruebas del reducer para 7/8/128/129, espacios intactos, confirmación vacía/no coincidente y revalidación de confirmación tocada en `src/ui/features/registration/registrationReducer.test.ts`
- [X] T028 [P] [US3] Ampliar pruebas del formulario para toggles independientes y ausencia de contraseñas fuera de inputs en `src/ui/features/registration/RegistrationForm.test.tsx` (US3-1–US3-5, SC-004, SC-008)

### Implementation for User Story 3

- [X] T029 [US3] Extender de forma compatible `PasswordField` con nombre accesible específico por campo hasta pasar T026 en `src/ui/components/PasswordField/PasswordField.tsx`
- [X] T030 [US3] Integrar las reglas exactas y ambos PasswordField sin recortar valores hasta pasar T027–T028 en `src/ui/features/registration/registrationReducer.ts` y `src/ui/features/registration/RegistrationForm.tsx`

**Checkpoint**: contraseña y confirmación se validan y controlan independientemente sin exposición.

---

## Phase 6: User Story 4 - Aceptar términos y condiciones (Priority: P2)

**Goal**: exigir aceptación, enfocar la casilla inválida y ofrecer la acción informativa de
términos sin perder datos.

**Independent Test**: enviar datos válidos sin aceptar, marcar la casilla y activar el enlace;
comprobar error, foco, corrección y aviso exacto con valores intactos.

### Tests for User Story 4 ⚠️

- [X] T031 [P] [US4] Escribir pruebas compatibles de Checkbox con ref, error, `aria-invalid`, `aria-describedby` y etiqueta compuesta sin controles anidados en `src/ui/components/Checkbox/Checkbox.test.tsx`
- [X] T032 [P] [US4] Ampliar pruebas del reducer para TERMS_REQUIRED, corrección al marcar y aviso no destructivo en `src/ui/features/registration/registrationReducer.test.ts`
- [X] T033 [P] [US4] Ampliar pruebas del formulario para bloqueo/foco de términos y aviso “Función no disponible en esta demostración” sin navegación ni pérdida de estado en `src/ui/features/registration/RegistrationForm.test.tsx` (US4-1–US4-3)

### Implementation for User Story 4

- [X] T034 [US4] Extender Checkbox hasta pasar T031 en `src/ui/components/Checkbox/Checkbox.tsx` y `src/ui/components/Checkbox/Checkbox.module.css`, preservando el contrato de “Recordarme” del login
- [X] T035 [US4] Integrar casilla, acción separada de términos, error/foco y status hasta pasar T032–T033 en `src/ui/features/registration/registrationReducer.ts` y `src/ui/features/registration/RegistrationForm.tsx`

**Checkpoint**: no existe registro sin consentimiento temporal y la acción informativa no altera el formulario.

---

## Phase 7: User Story 5 - Consultar alternativas de registro futuras (Priority: P3)

**Goal**: Google y Apple anuncian “Próximamente” sin enviar ni modificar datos.

**Independent Test**: completar parcialmente el formulario, activar cada proveedor y confirmar
el texto exacto, cero simulaciones y estado intacto.

### Tests for User Story 5 ⚠️

- [X] T036 [P] [US5] Ampliar pruebas de `RegistrationForm` para Google/Apple con valores y errores preexistentes, cero submit y status exacto “Próximamente” en `src/ui/features/registration/RegistrationForm.test.tsx` (FR-022)
- [X] T037 [P] [US5] Ampliar pruebas de regresión de SocialButton para `type=button`, nombre del proveedor e icono decorativo en `src/ui/components/SocialButton/SocialButton.test.tsx`

### Implementation for User Story 5

- [X] T038 [US5] Integrar SocialButton de Google/Apple y aviso no destructivo hasta pasar T036–T037 en `src/ui/features/registration/RegistrationForm.tsx` y `src/ui/features/registration/registrationReducer.ts`

**Checkpoint**: ambas alternativas futuras son comprensibles y no afectan el registro.

---

## Phase 8: User Story 6 - Ir al inicio de sesión (Priority: P3)

**Goal**: ofrecer un enlace semántico y operable por teclado hacia `/login`, descartando el formulario.

**Independent Test**: introducir datos, activar “Inicia sesión” con teclado y comprobar path
exacto, foco visible y ausencia posterior de datos sensibles.

### Tests for User Story 6 ⚠️

- [X] T039 [P] [US6] Ampliar pruebas de App para navegación directa, `pushState`, `popstate` y descarte al pasar de `/register` a `/login` en `src/App.test.tsx` (FR-020, FR-023)
- [X] T040 [P] [US6] Ampliar pruebas del pie para texto exacto, enlace real `href=/login`, nombre accesible, Tab/Enter y valores descartados en `src/ui/features/registration/RegistrationForm.test.tsx` (US6-1–US6-2)

### Implementation for User Story 6

- [X] T041 [US6] Implementar el enlace y callback de navegación History API hasta pasar T039–T040 en `src/ui/features/registration/RegistrationForm.tsx` y `src/App.tsx`
- [X] T042 [US6] Ampliar la regresión de rutas del login para `/`, `/login`, atrás/adelante y flash transitorio en `src/App.test.tsx` y `src/ui/features/login/LoginForm.test.tsx`

**Checkpoint**: el acceso al login funciona con puntero o teclado y no conserva el registro.

---

## Phase 9: User Story 7 - Usar el registro en móvil y con asistencia (Priority: P3)

**Goal**: reproducir Figma en escritorio y ofrecer una experiencia AA, usable desde 320 px y
completamente operable por teclado/tecnologías de asistencia.

**Independent Test**: recorrer toda la vista solo con teclado y revisar 320 px/1440×1024;
comprobar anuncios, foco, ausencia de overflow y estructura visual.

### Tests for User Story 7 ⚠️

- [X] T043 [P] [US7] Ampliar pruebas de BrandPanel con contenido de registro “Comienza tu camino financiero.”, texto de apoyo, logo y tarjeta decorativa, preservando defaults de login, en `src/ui/layout/BrandPanel/BrandPanel.test.tsx`
- [X] T044 [P] [US7] Añadir pruebas axe de registro inicial, errores, submitting, unavailable y flash de éxito en `src/App.test.tsx` (FR-027–FR-029, SC-006)
- [X] T045 [P] [US7] Añadir prueba de orden completo Tab/Shift+Tab, Enter/Espacio, foco al primer error y regiones status/alert en `src/ui/features/registration/RegistrationForm.test.tsx` (US7-3–US7-4, SC-005)

### Implementation for User Story 7

- [X] T046 [US7] Configurar BrandPanel de registro y su contenido Figma hasta pasar T043 en `src/ui/features/registration/RegistrationScreen.tsx` y `src/ui/layout/BrandPanel/BrandPanel.tsx`
- [X] T047 [US7] Reproducir escritorio 1440×1024: panel 620, formulario 400, campos 52/radio 12/borde 1.5, sociales 192×48/gap 16, checkbox 20/radio 6, tarjeta 360×210/radio 22 y jerarquía Inter en `src/ui/features/registration/RegistrationForm.module.css`, `src/ui/layout/AuthScreen/AuthScreen.module.css` y `src/ui/layout/BrandPanel/BrandPanel.module.css` (FR-001, FR-024)
- [X] T048 [US7] Añadir tokens específicos del gradiente de registro ~70.73° y aplicar variantes AA aprobadas sin alterar tokens del login en `src/ui/styles/tokens.css` y `src/ui/features/registration/RegistrationForm.module.css` (FR-029, SC-010)
- [X] T049 [US7] Implementar responsive mobile-first: ocultar promoción bajo 960, conservar identidad, max-width 400, padding 16 bajo 480, `min-width: 0`, social apilable y cero overflow desde 320 en `src/ui/layout/AuthScreen/AuthScreen.module.css`, `src/ui/layout/BrandPanel/BrandPanel.module.css` y `src/ui/features/registration/RegistrationForm.module.css` (FR-025–FR-026)
- [X] T050 [US7] Completar semántica, live regions y foco visible hasta pasar T044–T045 en `src/ui/features/registration/RegistrationForm.tsx`, `src/ui/components/Alert/Alert.tsx` y `src/ui/styles/global.css`

**Checkpoint**: US7 es operable sin puntero y mantiene identidad/fidelidad en móvil y escritorio.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: privacidad, regresión, evidencia visual, documentación y controles de cumplimiento

- [X] T051 [P] Escribir prueba de privacidad que inspeccione DOM fuera de inputs, URL, localStorage, sessionStorage, cookies, console y eventos de telemetría tras éxito, error y abandono en `src/ui/features/registration/RegistrationForm.test.tsx` (FR-018–FR-020, SC-008)
- [X] T052 [P] Escribir prueba de observabilidad que confirme únicamente `attempt_started` y `attempt_finished` con resultado/duración agregada, incluso si el sink falla, en `src/infrastructure/BrowserRegistrationTelemetry.test.ts`
- [X] T053 [P] Ejecutar y ampliar regresiones de TextField, PasswordField, Checkbox, Button, Alert, SocialButton, BrandPanel y LoginScreen en `src/ui/components/**/*.test.tsx`, `src/ui/layout/**/*.test.tsx` y `src/ui/features/login/**/*.test.tsx`
- [X] T054 [P] Verificar que desmontaje, navegación y resultados asíncronos tardíos no actualizan estado ni restauran valores en `src/ui/features/registration/useRegistrationForm.test.tsx` y `src/App.test.tsx`
- [X] T055 [P] Actualizar instrucciones de ejecución, rutas, arquitectura, ausencia de credenciales/API y aprobación de contraste en `README.md`, sin modificar documentación de `specs/001-login-billetera/`
- [X] T056 Revisar manualmente 320, 480, 959, 960, 1279, 1280 y 1440×1024, incluido viewport de poca altura y `scrollWidth <= clientWidth`, y registrar evidencia en `specs/002-registro-usuarios/quickstart.md` (SC-007)
- [X] T057 Reconsultar Figma MCP nodo `31:2`, capturar 1440×1024 y realizar overlay de textos, orden, medidas, radios, tipografía, espaciados, gradiente y tarjeta; registrar diferencias AA aprobadas en `specs/002-registro-usuarios/quickstart.md` (SC-010)
- [X] T058 Completar revisión manual WCAG 2.1 AA con teclado, lector, zoom 200 %, reflujo, contraste del gradiente y aprobación de diseño; registrar resultados en `specs/002-registro-usuarios/quickstart.md` (SC-005–SC-006)
- [X] T059 Ejecutar los recorridos funcionales y límites de `specs/002-registro-usuarios/quickstart.md`, registrar cada resultado y devolver cualquier fallo a la historia correspondiente
- [X] T060 Ejecutar `npm run verify` y corregir hasta que lint, formato, typecheck, cobertura ≥80 %, pruebas, build, auditoría de dependencias/licencias y escaneo de secretos queden verdes en los archivos afectados y `package.json`
- [X] T061 Auditar la matriz US/FR/SC contra nombres de pruebas y evidencias, confirmando cobertura de FR-001–FR-030 y SC-001–SC-010 en `specs/002-registro-usuarios/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: inmediata; T001 y T002 pueden avanzar independientemente.
- **Foundational (Phase 2)**: depende de Setup y bloquea todas las historias. T003/T004 antes
  de T005; T006 antes de T007–T010; T011 antes de T012.
- **US1 (Phase 3)**: depende de Foundational y constituye el MVP.
- **US2 (Phase 4)**: depende de Foundational y del formulario/reducer de US1.
- **US3 (Phase 5)**: depende de US1; puede desarrollarse en paralelo con US2 si se coordinan
  `registrationReducer.ts` y `RegistrationForm.tsx`.
- **US4 (Phase 6)**: depende de US1 y del contrato de errores/foco de US2.
- **US5 (Phase 7)**: depende de US1; es funcionalmente independiente de US3/US4.
- **US6 (Phase 8)**: depende de la frontera de rutas y formulario creados en US1.
- **US7 (Phase 9)**: depende de todas las piezas visuales/interactivas que debe auditar.
- **Polish (Phase 10)**: depende de las historias incluidas en la entrega.

### User Story Graph

```text
Setup → Foundational → US1 (MVP)
                         ├─→ US2 ─→ US4 ─┐
                         ├─→ US3 ────────┤
                         ├─→ US5 ────────┤→ US7 → Polish
                         └─→ US6 ────────┘
```

### Within Each User Story

1. Escribir pruebas y observar Rojo.
2. Implementar dominio/aplicación antes que UI cuando aplique.
3. Implementar reducer/hook antes que integración visual.
4. Obtener Verde, refactorizar y ejecutar regresión de historias previas.
5. Cerrar el checkpoint independiente antes de continuar.

### Parallel Opportunities

- Setup: T001 y T002.
- Foundational: T003/T004/T006/T007/T009/T011 según sus dependencias explícitas.
- US1: T013–T016; luego integración secuencial T017–T020.
- US2: T021–T023.
- US3: T026–T028.
- US4: T031–T033.
- US5: T036–T037.
- US6: T039–T040.
- US7: T043–T045.
- Polish: T051–T055.

## Parallel Examples by User Story

| Historia | Ejemplo de tareas paralelas |
|---|---|
| US1 | T013 reducer test; T014 hook test; T015 form integration test; T016 App route test |
| US2 | T021 reducer validation test; T022 UI validation test; T023 use-case invalid-input test |
| US3 | T026 PasswordField test; T027 reducer password test; T028 form privacy/toggle test |
| US4 | T031 Checkbox test; T032 reducer terms test; T033 form terms test |
| US5 | T036 provider integration test; T037 SocialButton regression test |
| US6 | T039 App/history test; T040 semantic-link test |
| US7 | T043 BrandPanel test; T044 axe states; T045 keyboard-order test |

---

## Implementation Strategy

### MVP First

1. Completar Setup y Foundational.
2. Completar US1 con `/register → /login`, éxito, error y limpieza.
3. Detenerse y ejecutar el test independiente de US1 más la regresión de login.
4. Demostrar el MVP sin incorporar todavía historias P2/P3.

### Incremental Delivery

1. US1 → registro válido y navegación.
2. US2 → validación inline completa.
3. US3 + US4 → protección de contraseña y consentimiento.
4. US5 + US6 → alternativas y navegación explícita.
5. US7 → accesibilidad y responsive/fidelidad final.
6. Polish → privacidad, Figma, quickstart y controles corporativos.

---

## Notes

- No agregar React Router, librerías de formularios, backend, API o almacenamiento.
- No pasar datos personales a `RegistrationSimulator` ni a `RegistrationTelemetry`.
- Las URLs de assets devueltas por Figma MCP son temporales y nunca se usan en runtime.
- No modificar `specs/001-login-billetera/` ni `.specify/memory/constitution.md`.
- No iniciar una tarea visual que dependa de colores AA hasta registrar la aprobación de diseño.
- No realizar commits o push salvo solicitud posterior explícita.
