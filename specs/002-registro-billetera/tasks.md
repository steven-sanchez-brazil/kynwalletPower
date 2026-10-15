---

description: "Task list for 002-registro-billetera"
---

# Tasks: Pantalla de Registro de KynWallet

**Input**: Design documents from `/specs/002-registro-billetera/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-register.md,
contracts/registration-gateway.md, quickstart.md

**Tests**: OBLIGATORIAS (Constitución, Principio I, TDD). En cada fase se escriben primero las
pruebas, se verifica que fallan (Rojo), se implementa (Verde) y se refactoriza.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Rutas relativas a la raíz del repositorio; pruebas junto al código (`*.test.ts(x)`).
- Trazabilidad (Constitución 9.2): cada `it(...)` empieza con el ID del escenario o requisito,
  p. ej. `it('US3-5: muestra "Las contraseñas no coinciden"…')`.
- El proyecto de la feature 001 ya existe (herramientas, ESLint, Vitest, componentes); no se
  reinstala nada ni se añaden dependencias.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Diseño de referencia y segunda entrada de la aplicación

- [X] T001 Consultar Figma con el MCP (`get_design_context` y `get_variable_defs` sobre el nodo `31:2` del archivo `f7uDsv8sh6ZOtK2OitTqtg`); guardar los SVG del frame en `src/ui/assets/` y registrar en `specs/002-registro-billetera/research.md` (sección R6) los textos exactos, medidas y tokens nuevos; si algún texto difiere de `contracts/ui-register.md` o aparece un elemento no previsto en la spec, actualizar el contrato y detenerse para `/speckit-clarify`
- [X] T002 [P] Añadir los tokens nuevos del frame (si los hay) a `src/ui/styles/tokens.css`, midiendo su contraste WCAG AA como en 001-R3 y derivando una variante accesible cuando no cumpla
- [X] T003 Crear `register.html` (`lang="es"`, `<title>KynWallet · Crear cuenta</title>`, `<div id="root">`, script `/src/registerMain.tsx`) y declarar ambas entradas (`index.html`, `register.html`) en `build.rollupOptions.input` de `vite.config.ts`; excluir `src/registerMain.tsx` de la cobertura

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Dominio, caso de uso, adaptador y utilidades de prueba que necesitan todas las historias

**⚠️ CRITICAL**: Ninguna historia de usuario puede empezar hasta completar esta fase

### Tests primero (deben fallar)

- [X] T004 [P] Escribir `src/domain/validation.test.ts` (añadir casos a la suite existente) para `validateRegistration`, `isValidFullName` y la política de contraseña de registro: nombre obligatorio, `trim` + colapso de espacios, 2–100 caracteres, solo letras (con tildes/ñ), espacios, `'` y `-` ("María Núñez-O'Brien" válido; "A", "   ", "Ana1", "Ana@" inválidos; 101 caracteres inválido) — FR-003; correo reutilizando `isValidEmail` (254 máx.) — FR-004; contraseña 8–128 con al menos una letra y un número, sin recortar ("abcdefgh", "12345678", "short1" inválidas; contraseña con espacios respetada) — FR-005; confirmación obligatoria e idéntica — FR-006; términos `true` — FR-007; y que `validateCredentials` del login NO cambia
- [X] T005 [P] Escribir `src/application/register.test.ts` con una pasarela falsa: datos inválidos → `{ kind: 'invalid', errors }` sin llamar al gateway; normaliza `fullName` (trim + espacios múltiples → uno) y `email` (trim + minúsculas) antes de delegar; no envía `confirmPassword` ni `acceptedTerms`; si el gateway lanza → `{ kind: 'unavailable' }`
- [X] T006 [P] Escribir `src/infrastructure/InMemoryRegistrationGateway.test.ts` con temporizadores falsos: correo nuevo → `created` con `displayName` igual al nombre; correo de una cuenta de demostración (en cualquier capitalización) → `rejected`; cuentas `null` → `unavailable`; espera de `delayMs` (1000 por defecto) antes de resolver; no escribe en `localStorage`, `sessionStorage` ni `console` (FR-015)
- [X] T007 [P] Añadir a `src/ui/components/Checkbox/Checkbox.test.tsx` las pruebas de la nueva prop `error`: sin error no hay `aria-invalid`; con error el checkbox tiene `aria-invalid="true"`, `aria-describedby` apunta al mensaje y no hay violaciones `axe-core` (research R7)

### Implementación

- [X] T008 [P] Añadir a `src/domain/messages.ts` los textos de registro de `contracts/ui-register.md` (nombre, contraseña de registro, confirmación, términos, `REGISTRATION_REJECTED`, `REGISTRATION_UNAVAILABLE`), reutilizando `EMAIL_*` y `FEATURE_UNAVAILABLE` existentes
- [X] T009 [P] Crear `src/domain/registration.ts` con `RegistrationRequest` (`fullName`, `email`, `password`, `confirmPassword`, `acceptedTerms`), `RegistrationErrors` y `RegistrationResult` (`created | invalid | rejected | unavailable`) tal como en `data-model.md`
- [X] T010 Implementar en `src/domain/validation.ts` `normalizeFullName`, `isValidFullName` (patrón `^[\p{L}][\p{L}\p{M}' -]*$`, 2–100 tras normalizar), la política de contraseña de registro y `validateRegistration(request): RegistrationErrors`, reutilizando `normalizeEmail`, `isValidEmail` y las constantes de longitud existentes (sin duplicar reglas, Principio IV); hacer pasar T004
- [X] T011 [P] Crear el puerto `src/application/ports/RegistrationGateway.ts` (`register({ fullName, email, password }): Promise<RegistrationResult>`)
- [X] T012 Implementar `src/application/register.ts` (`createRegister(gateway)`) según `contracts/registration-gateway.md`; hacer pasar T005
- [X] T013 Implementar `src/infrastructure/InMemoryRegistrationGateway.ts` (cuentas inyectadas, `delayMs` inyectable, comparación con `normalizeEmail`, sin persistir nada); hacer pasar T006
- [X] T014 [P] Extender `src/ui/components/Checkbox/Checkbox.tsx` y `Checkbox.module.css` con la prop opcional `error?: string` (`aria-invalid`, `aria-describedby`, mensaje visible con el estilo de error de `TextField`) y permitir `label` como `ReactNode` para incluir el enlace de términos; hacer pasar T007
- [X] T015 [P] Añadir a `src/test/fixtures.ts` un `VALID_REGISTRATION` ficticio (nombre, correo `nueva.persona@example.test`, contraseña `fixture-pass-02`) y crear `src/test/registerStub.ts` con `createRegisterStub(result)` equivalente a `authStub.ts` (`defer()`/`release()`)

**Checkpoint**: dominio, caso de uso y adaptador verdes; `npm run lint`, `typecheck` y `test` pasan

---

## Phase 3: User Story 1 - Crear una cuenta con datos válidos (Priority: P1) 🎯 MVP

**Goal**: completar el formulario, enviarlo y ver la bienvenida; volver al registro limpio

**Independent Test**: con datos válidos y términos marcados, "Crear cuenta" muestra carga y luego "¡Bienvenido, {nombre}!"; el botón de volver deja el formulario vacío (US1-1…5)

### Tests primero (deben fallar)

- [X] T016 [P] [US1] Escribir `src/ui/features/register/registerReducer.test.ts`: estado inicial; `change` actualiza valores; `submit` válido → `submitting` y segundo `submit` ignorado (US1-2, edge doble clic); `result: created` → `welcome` con `welcomeName`; `reset` → estado inicial (US1-5)
- [X] T017 [P] [US1] Escribir `src/ui/features/register/RegisterWelcomeView.test.tsx`: título "¡Bienvenido, {nombre}!" con `tabIndex=-1` y foco al montar (FR-011), botón "Volver al registro" invoca `onReset`, sin violaciones `axe-core`
- [X] T018 [US1] Escribir `src/ui/features/register/RegisterForm.test.tsx` (flujo feliz, con `registerStub` y `user-event`): US1-1 flujo completo hasta la bienvenida con el nombre; US1-2 botón deshabilitado con `aria-busy` mientras el stub está diferido; US1-3 correo con mayúsculas y espacios llega normalizado al caso de uso; US1-4 Enter en el último campo envía; US1-5 volver deja campos vacíos, casilla desmarcada y sin mensajes; sin violaciones `axe-core`

### Implementación

- [X] T019 [US1] Implementar `src/ui/features/register/registerReducer.ts` según la tabla de transiciones de `data-model.md` (usa `validateRegistration` del dominio); hacer pasar T016
- [X] T020 [US1] Implementar `src/ui/features/register/useRegisterForm.ts`: conecta el reducer con el caso de uso `register` inyectado, `submit` asíncrono, gestión de foco (primer campo con error, correo tras fallo, título de bienvenida)
- [X] T021 [P] [US1] Implementar `src/ui/features/register/RegisterWelcomeView.tsx` y `RegisterWelcomeView.module.css` reutilizando el estilo de `WelcomeView` de 001; hacer pasar T017
- [X] T022 [US1] Implementar `src/ui/features/register/RegisterForm.tsx` y `RegisterForm.module.css` con `TextField` (nombre y correo), dos `PasswordField`, `Checkbox` de términos, `Button` "Crear cuenta" y `Divider` + `SocialButton` Google/Apple + "Inicia sesión", con textos y medidas obtenidos en T001, orden de foco de `contracts/ui-register.md` y atributos `autocomplete`; hacer pasar T018
- [X] T023 [US1] Crear `src/RegisterApp.tsx` (reutiliza `LoginScreen` como layout con `BrandPanel` y recibe `register` por props) y `src/registerMain.tsx` como raíz de composición: `loadDemoAccounts(import.meta.env.VITE_DEMO_USERS)` → `InMemoryRegistrationGateway` → `createRegister` → `RegisterApp` (único lugar que conoce las implementaciones concretas, Constitución 2.5); añadir `src/RegisterApp.test.tsx` que verifica el montaje con un `register` falso

**Checkpoint**: `http://localhost:5173/register.html` permite crear una cuenta y ver la bienvenida (MVP demostrable)

---

## Phase 4: User Story 2 - Mensaje de error cuando la cuenta no puede crearse (Priority: P1)

**Goal**: mostrar el error genérico ante correo duplicado o fallo, conservando datos útiles

**Independent Test**: enviar datos válidos con el correo de una cuenta de demostración muestra el error y no la bienvenida (US2-1…4)

### Tests primero (deben fallar)

- [X] T024 [P] [US2] Añadir a `registerReducer.test.ts`: `result: rejected` → `failure` con conservación de nombre, correo y términos y contraseñas vacías (US2-3); `result: unavailable` → `failure`; `change` posterior limpia el error (US2-2)
- [X] T025 [US2] Añadir a `RegisterForm.test.tsx`: US2-1 muestra "No fue posible crear la cuenta. Verifica tus datos e inténtalo de nuevo." en un `role="alert"` y no la bienvenida; US2-2 el mensaje desaparece al editar un campo; US2-3 foco en el correo y contraseñas vacías; US2-4 resultado `unavailable` muestra "Servicio de registro no disponible. Intenta más tarde." sin detalles técnicos y permite reintentar; sin violaciones `axe-core`

### Implementación

- [X] T026 [US2] Implementar en `registerReducer.ts`, `useRegisterForm.ts` y `RegisterForm.tsx` el manejo de `rejected`/`unavailable` con `Alert` (`role="alert"`), vaciado de contraseñas y foco al correo; hacer pasar T024–T025

**Checkpoint**: US1 y US2 funcionan y se prueban de forma independiente (escenarios P1 completos, SC-003)

---

## Phase 5: User Story 3 - Validar los campos antes de enviar (Priority: P2)

**Goal**: mostrar mensajes por campo al salir del campo o al enviar, y bloquear el envío mientras haya errores

**Independent Test**: enviar vacío y con datos inválidos muestra los mensajes por campo, sin llamar al caso de uso (US3-1…8)

### Tests primero (deben fallar)

- [X] T027 [P] [US3] Añadir a `registerReducer.test.ts`: errores visibles solo en campos tocados; `submit` con errores marca todo como tocado y no pasa a `submitting` (FR-009); cambiar `password` revalida `confirmPassword` ya tocado (edge case); el mensaje desaparece al corregir (US3-7)
- [X] T028 [US3] Añadir a `RegisterForm.test.tsx` un `it` por escenario US3-1…US3-8 (mensajes exactos de `contracts/ui-register.md`; el caso de uso no se invoca; foco al primer campo con error; `aria-invalid` y `aria-describedby` en cada campo con error; `blur` muestra el error del campo; sin violaciones `axe-core` en el estado con errores)

### Implementación

- [X] T029 [US3] Implementar en `registerReducer.ts` y `RegisterForm.tsx` los errores por campo (props `error` de `TextField`/`PasswordField`/`Checkbox`), `onBlur`, marcado de tocados al enviar y revalidación de la confirmación; hacer pasar T027–T028

---

## Phase 6: User Story 4 - Mostrar u ocultar las contraseñas (Priority: P3)

**Goal**: cada campo de contraseña tiene su control accesible e independiente

**Independent Test**: activar el ojo de un campo muestra solo ese campo; operable con teclado (US4-1…3)

- [X] T030 [US4] Añadir a `RegisterForm.test.tsx` (antes de cualquier cambio) US4-1…3: dos botones "Mostrar contraseña" independientes con `aria-pressed`, alternancia a "Ocultar contraseña", activables con teclado (Tab + Space/Enter); si pasa sin cambios, `PasswordField` ya cumple y solo se conserva la prueba como regresión
- [X] T031 [US4] Ajustar `RegisterForm.tsx` solo si T030 falla (p. ej., `aria-label` distinguible por campo: "Mostrar contraseña" / "Mostrar confirmación de contraseña" si el diseño de T001 lo requiere), sin duplicar `PasswordField`

---

## Phase 7: User Story 5 - Elementos fuera del alcance (Priority: P3)

**Goal**: términos, Google, Apple e "Inicia sesión" informan que no están disponibles

**Independent Test**: activar cada elemento muestra "Función no disponible en esta demostración" y conserva los datos (US5-1)

- [X] T032 [P] [US5] Añadir a `registerReducer.test.ts` la acción `showNotice` (conserva valores y estado) y a `RegisterForm.test.tsx` US5-1 para los cuatro elementos (aviso en `role="status"`, datos conservados)
- [X] T033 [US5] Implementar `showNotice` en `registerReducer.ts` y conectar los cuatro elementos en `RegisterForm.tsx` (el aviso se limpia al editar o al enviar); hacer pasar T032

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T034 [P] Añadir a `src/ui/features/register/RegisterForm.test.tsx` una prueba de datos sensibles (FR-015): tras un envío, `localStorage`, `sessionStorage` y `console` no contienen la contraseña
- [X] T035 [P] Revisión visual contra Figma `31:2` en 1440 px, 768 px y 320 px (SC-006, FR-020): corregir `RegisterForm.module.css` y `tokens.css`; confirmar sin scroll horizontal a 320 px
- [X] T036 [P] Actualizar `README.md` con cómo ejecutar ambas pantallas (`/` y `/register.html`), configurar `.env.local`, correr pruebas y `npm run verify`, y dónde está la documentación de la feature (Constitución 8.3)
- [X] T037 Revisar la duplicación entre `loginReducer.ts`/`LoginForm.tsx` y sus equivalentes de registro; consolidar solo lo que sea idéntico (Principio IV), con las pruebas de 001 en verde
- [X] T038 Ejecutar `npm run verify` (lint, formato, tipos, cobertura ≥ 80 %, build de ambas entradas, auditorías de dependencias y licencias, secretos) y corregir hallazgos
- [ ] T039 Ejecutar manualmente los 14 escenarios de `specs/002-registro-billetera/quickstart.md` en `npm run dev` y registrar resultados; actualizar el estado de `plan.md` (Open Items) y marcar el checklist de requisitos

---

## Phase 9: Cambio de alcance 2026-10-15 — Navegación entre login y registro

**Origen**: solicitud del responsable del producto tras la implementación inicial. Registrado en
las Clarifications de `spec.md` (002: US6, FR-022) y de `specs/001-login-billetera/spec.md`
(001: US6, FR-020); decisión técnica en `research.md` R9. Sin dependencias nuevas.

### Tests primero (deben fallar)

- [X] T040 [P] Escribir `src/ui/components/TextLink/TextLink.test.tsx`: rol `link` con el nombre y `href` dados, se activa con teclado (foco + Enter), sin violaciones `axe-core`
- [X] T041 [P] [US6] En `src/ui/features/register/RegisterForm.test.tsx`: quitar "Inicia sesión" de US5-1 y añadir US6-1/US6-2 (`link` "Inicia sesión" con `href="./"`, alcanzable con Tab después de Apple)
- [X] T042 [P] [001-US6] En `src/ui/features/login/LoginForm.test.tsx`: quitar "Regístrate" de US5-1, añadir 001-US6-1/US6-2 (`link` "Regístrate" con `href="./register.html"`) y actualizar la prueba de orden de tabulación (FR-014) al rol `link`

### Implementación

- [X] T043 Crear `src/ui/routes.ts` (rutas relativas `./` y `./register.html`, fuente única) y `src/ui/components/TextLink/TextLink.tsx` reutilizando las clases de `Button` variante `link`; hacer pasar T040
- [X] T044 Sustituir el `Button` "Inicia sesión" de `RegisterForm.tsx` y el `Button` "Regístrate" de `LoginForm.tsx` por `TextLink`; hacer pasar T041–T042
- [X] T045 Actualizar `README.md` (notas de alcance) y ejecutar `npm run verify`

---

## Phase 10: Requisitos funcionales del responsable del producto (2026-10-15 (b))

**Origen**: lista de 8 requisitos del responsable del producto, revisada contra la implementación.
Decisiones en Clarifications 2026-10-15 (b) de `spec.md` (002) y de `specs/001-login-billetera/spec.md`;
decisión técnica en `research.md` R10. Sustituye parcialmente la Phase 9 (rutas relativas y
enlaces con recarga). Dependencia nueva: `react-router ~8.4.0` (7.4, Complexity Tracking).

### Setup

- [X] T046 Instalar `react-router@~8.4.0` (`npm install`), verificar con `npm run audit:deps` y `npm run audit:licenses`

### Tests primero (deben fallar)

- [X] T047 [P] [US1] `registerReducer.test.ts`: `result: created` → `registered` (envío deshabilitado); eliminar las pruebas de `welcome`/`reset` (antiguo US1-5)
- [X] T048 [P] [US1,US5,US6] `RegisterForm.test.tsx` (con `MemoryRouter`): US1-1 invoca `onRegistered`; sin vista de bienvenida; US5-1 términos → aviso de función no disponible; US5-2 Google/Apple → "Próximamente"; US6-1 `link` "Inicia sesión" con `href="/login"`
- [X] T049 [P] [001-US6] `LoginForm.test.tsx` (con `MemoryRouter`): `link` "Regístrate" con `href="/registro"`; prop `initialNotice` muestra el aviso en `role="status"` y se limpia al enviar (001 FR-021)
- [X] T050 [P] `TextLink.test.tsx` con `MemoryRouter`: navega sin recarga
- [X] T051 [US1,US6,FR-023] `src/App.test.tsx`: `/` y `/abc` → `/login`; `/registro` muestra el registro con título "KynWallet · Crear cuenta"; "Regístrate" → `/registro`; "Inicia sesión" → `/login` sin mensaje; registro exitoso → `/login` con "¡Cuenta creada con éxito!" (US1-1) y el mensaje no reaparece al volver a montar `/login` (US1-5); sin violaciones `axe-core`

### Implementación

- [X] T052 `messages.ts`: `COMING_SOON` ("Próximamente") y `REGISTRATION_SUCCESS` ("¡Cuenta creada con éxito!"); `routes.ts` → `/login`, `/registro`; `TextLink` con `Link` de React Router; hacer pasar T050
- [X] T053 `registerReducer.ts`, `useRegisterForm.ts`, `RegisterForm.tsx`: estado `registered`, prop `onRegistered`, Google/Apple → `COMING_SOON`; eliminar `RegisterWelcomeView`; hacer pasar T047–T048
- [X] T054 `useLoginForm.ts`/`LoginForm.tsx`: prop opcional `initialNotice`; hacer pasar T049
- [X] T055 `src/ui/pages/LoginPage.tsx` y `RegisterPage.tsx` (título del documento, lectura de un solo uso de `state.registered`, `navigate` tras el registro), `App.tsx` con `Routes`, `main.tsx` con `BrowserRouter` como única raíz de composición; eliminar `register.html`, `src/registerMain.tsx`, `src/RegisterApp.tsx`(+test) y la entrada doble de `vite.config.ts`; hacer pasar T051
- [X] T056 Actualizar `README.md` (rutas, despliegue con respaldo SPA) y ejecutar `npm run verify`

---

## Phase 11: Aviso emergente de registro exitoso y saltos de línea (2026-10-15 (c))

**Origen**: decisión del responsable del producto (Clarifications 2026-10-15 (c) en 001 y 002);
diseño en `research.md` R11. Sin dependencias nuevas.

- [X] T057 Crear `.gitattributes` (`* text=auto eol=lf`, binarios sin conversión) y normalizar la copia de trabajo a LF sin cambiar contenido; `npm run format` en verde

### Tests primero (deben fallar)

- [X] T058 [P] [001-US7] `src/ui/components/Toast/Toast.test.tsx` (temporizadores falsos): región `role="status"` siempre presente y vacía sin mensaje; muestra el mensaje; se cierra a los 5 000 ms y no antes (US7-2); pausa con el puntero y con el foco y reanuda con el tiempo restante (US7-3); "Cerrar aviso" cierra de inmediato; sin violaciones `axe-core`
- [X] T059 [P] [001-US7] `src/App.test.tsx`: tras un registro exitoso el aviso está fuera de `main` (US7-1) y "Cerrar aviso" lo oculta; `LoginForm.test.tsx`: eliminar las pruebas de `initialNotice`

### Implementación

- [X] T060 Token `--success-600` en `tokens.css`; `Toast.tsx` + `Toast.module.css` (posición fija, móvil a todo el ancho, animación con `prefers-reduced-motion`); hacer pasar T058
- [X] T061 `LoginPage.tsx` monta el `Toast`; eliminar `initialNotice` de `LoginForm.tsx` y `useLoginForm.ts` (código sin uso, 4.4); hacer pasar T059
- [X] T062 Actualizar `README.md` y ejecutar `npm run verify`

---

## Dependencies & Execution Order

- **Phase 1** → T001 antes de T002 y T022 (textos/medidas); T003 es independiente de T001.
- **Phase 2** depende de la Phase 1 solo para T008 (textos definitivos); las pruebas T004–T007 pueden empezar de inmediato. Bloquea todas las historias.
- **US1 (P1)** depende de la Phase 2. **US2 (P1)** depende de US1 (reutiliza reducer y formulario). **US3 (P2)**, **US4** y **US5** dependen de US1 y son independientes entre sí.
- **Polish** depende de las historias deseadas.
- Dentro de cada historia: pruebas (Rojo) → implementación (Verde) → refactor.

```text
Setup → Foundational → US1 → ┬─ US2
                              ├─ US3
                              ├─ US4
                              └─ US5 → Polish
```

## Parallel Opportunities

- Phase 2: T004, T005, T006, T007 (pruebas) en paralelo; luego T008, T009, T011, T014, T015 en paralelo; T010 → T012 → T013 en orden por dependencias de tipos.
- US1: T016 y T017 en paralelo; T021 en paralelo con T019/T020.
- Tras US1: US3, US4 y US5 pueden desarrollarse en paralelo (tocan distintas secciones de `RegisterForm.tsx`; coordinar la integración).
- Polish: T034, T035, T036 en paralelo.

## Implementation Strategy

1. **MVP**: Phases 1–3 (US1) → demo del registro exitoso.
2. Añadir US2 (error) para completar los escenarios P1 exigidos por SC-003.
3. Añadir US3 (validación) y luego US4/US5 en cualquier orden.
4. Cerrar con Polish y `npm run verify` antes de abrir la solicitud de cambio (Constitución 9.3–9.4).
