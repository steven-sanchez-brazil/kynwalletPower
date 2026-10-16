---

description: "Task list for 002-registro-usuarios"
---

# Tasks: Pantalla de Registro de Usuarios de KynWallet

**Input**: Design documents from `/specs/002-registro-usuarios/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-register.md,
contracts/registration-gateway.md, quickstart.md

**Tests**: OBLIGATORIAS. La Constitución (Principio I, TDD) exige escribir las pruebas antes del
código y verlas fallar. Cada historia empieza por sus pruebas.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US6)
- Rutas relativas a la raíz del repositorio. Las pruebas viven junto al código (`*.test.ts(x)`).
- Trazabilidad (Constitución 9.2): cada `it(...)` DEBE empezar con el ID del escenario o
  requisito que verifica, p. ej. `it('US3-1: rechaza un correo ya registrado…')`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar la línea base de 001 antes de modificarla

- [X] T001 Ejecutar `npm test` y `npm run lint` en la raíz y confirmar que todo pasa antes de empezar (sin dependencias nuevas, plan.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Navegación, layout compartido y piezas de dominio que usan todas las historias

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Reiniciar la URL antes de cada prueba con `window.history.replaceState(null, '', '/')` en `src/test/setup.ts`
- [X] T003 [P] Escribir pruebas de `navigate` y `usePathname` (push, replace, `popstate`) en `src/ui/routing/router.test.ts` (FR-016)
- [X] T004 Implementar `ROUTES = { login: '/login', register: '/registro' }`, `navigate(path, { replace? })` y `usePathname()` con `useSyncExternalStore` sobre `popstate` en `src/ui/routing/router.ts` (research.md R1)
- [X] T005 [P] Escribir pruebas de `RouteLink` (rol `link`, `href`, clic navega sin recargar, clic con Ctrl/Meta no se intercepta) en `src/ui/routing/RouteLink.test.tsx`
- [X] T006 Implementar `RouteLink` (`<a href>` que llama a `navigate` en clic primario sin modificadores, estilo de enlace del diseño) en `src/ui/routing/RouteLink.tsx` y `src/ui/routing/RouteLink.module.css`
- [X] T007 Mover `src/ui/features/login/LoginScreen.tsx` y su CSS a `src/ui/layout/AuthLayout/AuthLayout.tsx` y `AuthLayout.module.css`, con props `brandTitle: ReactNode`, `brandSubtitle: string` y `children`
- [X] T008 Hacer que `BrandPanel` reciba `title` y `subtitle` por props en `src/ui/layout/BrandPanel/BrandPanel.tsx` (contracts/ui-register.md, "Panel de marca")
- [X] T009 [P] Exportar `validateEmail`, `validatePassword` y `FULL_NAME_MAX_LENGTH = 80` en `src/domain/validation.ts`, y usar esa constante en `src/infrastructure/loadDemoAccounts.ts` en lugar de `DISPLAY_NAME_MAX_LENGTH` (Constitución 4.1)
- [X] T010 [P] Agregar a `src/domain/messages.ts`: `FULL_NAME_REQUIRED` "Ingresa tu nombre completo", `FULL_NAME_TOO_LONG` "El nombre no puede superar 80 caracteres", `PASSWORD_CONFIRMATION_REQUIRED` "Confirma tu contraseña", `PASSWORDS_DO_NOT_MATCH` "Las contraseñas no coinciden", `TERMS_REQUIRED` "Debes aceptar los términos y condiciones", `EMAIL_TAKEN` "Ya existe una cuenta con este correo", `REGISTER_SUCCESS` "¡Cuenta creada con éxito! Ya puedes iniciar sesión.", `COMING_SOON` "Próximamente"
- [X] T011 Escribir pruebas de rutas en `src/App.test.tsx`: `/` y rutas desconocidas redirigen a `/login`; `/registro` muestra "Crea tu cuenta"; atrás/adelante cambian de pantalla; `document.title` por ruta (US4-3, US4-4, US4-5)
- [X] T012 Reescribir `src/App.tsx` para elegir pantalla según `usePathname()`, redirigir con `replace` a `/login`, fijar `document.title` y recibir `authenticate` y `register` por props; actualizar `src/main.tsx` para crear un único `InMemoryAuthGateway` y pasar ambos casos de uso

**Checkpoint**: `/login` y `/registro` existen y se puede navegar entre ellas por URL

---

## Phase 3: User Story 1 - Crear una cuenta con datos válidos (Priority: P1) 🎯 MVP

**Goal**: registrar una cuenta, volver a `/login` con mensaje de éxito e iniciar sesión con ella

**Independent Test**: completar el formulario válido, ver el mensaje de éxito en `/login` e iniciar sesión con la cuenta nueva

### Tests for User Story 1 ⚠️

- [X] T013 [P] [US1] Escribir pruebas de `createRegister` (normaliza correo, recorta nombre, conserva contraseña, excepción → `unavailable`) en `src/application/register.test.ts`
- [X] T014 [P] [US1] Escribir pruebas de `InMemoryAuthGateway.register` (alta → `success` y luego `authenticate` acepta la cuenta; configuración `null` → `unavailable`) en `src/infrastructure/InMemoryAuthGateway.test.ts`
- [X] T015 [P] [US1] Escribir pruebas de `registerReducer` para `submit` válido → `submitting`, `result success` → `registered` y doble envío ignorado en `src/ui/features/register/registerReducer.test.ts`
- [X] T016 [P] [US1] Escribir pruebas de `RegisterForm` (US1-1 llama a `onRegistered`, US1-3 estado de carga "Creando cuenta…" y un solo envío, US1-4 Enter envía) en `src/ui/features/register/RegisterForm.test.tsx`
- [X] T017 [US1] Escribir prueba de integración en `src/App.test.tsx` con `InMemoryAuthGateway` real (`delayMs: 0`): registrar, ver "¡Cuenta creada con éxito! Ya puedes iniciar sesión." en `/login`, iniciar sesión y ver "¡Bienvenido, {nombre}!" (US1-1, US1-2, SC-003)

### Implementation for User Story 1

- [X] T018 [P] [US1] Agregar `RegisterResult` (`success` | `email-taken` | `unavailable`) en `src/domain/auth.ts` y `RegistrationData` (`fullName`, `email`, `password`, `passwordConfirmation`, `acceptedTerms`) en `src/domain/registration.ts`
- [X] T019 [P] [US1] Crear el puerto `RegistrationGateway { register(account: DemoAccount): Promise<RegisterResult> }` en `src/application/ports/RegistrationGateway.ts`
- [X] T020 [US1] Implementar `createRegister(gateway)` en `src/application/register.ts` (contracts/registration-gateway.md)
- [X] T021 [US1] Hacer que `InMemoryAuthGateway` guarde una copia mutable de las cuentas e implemente `register` con la misma espera simulada en `src/infrastructure/InMemoryAuthGateway.ts` (research.md R3)
- [X] T022 [US1] Implementar `registerReducer` (data-model.md, RegisterFormState) en `src/ui/features/register/registerReducer.ts` y el hook `useRegisterForm` (envío único, protección si se desmonta) en `src/ui/features/register/useRegisterForm.ts`
- [X] T023 [US1] Implementar `RegisterForm` con título, subtítulo, los cuatro campos, la casilla, "Crear cuenta", separador "o regístrate con", Google/Apple y "¿Ya tienes cuenta? Inicia sesión" según contracts/ui-register.md en `src/ui/features/register/RegisterForm.tsx` y `RegisterForm.module.css` (gap 18 px, título 28 px, research.md R7)
- [X] T024 [US1] Agregar el tono `success` (`role="status"`) a `src/ui/components/Alert/Alert.tsx` y `Alert.module.css`, y la prop `notice` a `LoginForm` para mostrar `MESSAGES.REGISTER_SUCCESS` en `src/ui/features/login/LoginForm.tsx`
- [X] T025 [US1] Conectar en `src/App.tsx`: al registrarse, marcar el éxito y navegar a `/login`; limpiar el indicador al ir a `/registro` (research.md R2)

**Checkpoint**: el flujo de registro y posterior inicio de sesión funciona de punta a punta

---

## Phase 4: User Story 2 - Validar los datos antes de crear la cuenta (Priority: P1)

**Goal**: mensajes inline por campo y bloqueo del envío con datos inválidos

**Independent Test**: enviar vacío y con cada dato inválido; verificar mensajes y foco

### Tests for User Story 2 ⚠️

- [X] T026 [P] [US2] Escribir pruebas de `validateRegistration` en `src/domain/registration.test.ts`: nombre "obligatorio sin espacios periféricos; ≤ 80 caracteres", correo y contraseña con las reglas de login, confirmación "obligatoria; igual a `password`", términos "debe ser `true`"
- [X] T027 [P] [US2] Escribir pruebas del reducer para errores visibles solo en campos tocados y recálculo de "Las contraseñas no coinciden" al cambiar la contraseña en `src/ui/features/register/registerReducer.test.ts` (US2-5, US2-6)
- [X] T028 [P] [US2] Escribir pruebas de `RegisterForm` para US2-1 (cinco mensajes y foco en "Nombre completo"), US2-2, US2-3, US2-4 y US2-7 (`aria-invalid` y `aria-describedby`) en `src/ui/features/register/RegisterForm.test.tsx`
- [X] T029 [P] [US2] Escribir pruebas de `Checkbox` con `error`, `ariaLabel`, `addon` y `ref` en `src/ui/components/Checkbox/Checkbox.test.tsx`

### Implementation for User Story 2

- [X] T030 [US2] Implementar `validateRegistration` reutilizando `validateEmail` y `validatePassword` en `src/domain/registration.ts`
- [X] T031 [US2] Extender `Checkbox` con `error` (texto bajo la casilla con `aria-describedby` y `aria-invalid`), `ariaLabel`, `addon` y `ref` en `src/ui/components/Checkbox/Checkbox.tsx` y `Checkbox.module.css` (research.md R6)
- [X] T032 [US2] Aplicar `validateRegistration` en el reducer (`blur`, `change`, `submit`) y mover el foco al primer campo con error en el orden `fullName`, `email`, `password`, `passwordConfirmation`, `acceptedTerms` en `src/ui/features/register/`

**Checkpoint**: ningún registro se envía con datos inválidos

---

## Phase 5: User Story 3 - Rechazar un correo ya registrado (Priority: P2)

**Goal**: impedir cuentas duplicadas con un mensaje en el campo de correo

**Independent Test**: registrar el correo de una cuenta demo y ver "Ya existe una cuenta con este correo"

### Tests for User Story 3 ⚠️

- [X] T033 [P] [US3] Escribir pruebas de `InMemoryAuthGateway.register` con correo existente (demo o registrado, con mayúsculas y espacios) → `email-taken` en `src/infrastructure/InMemoryAuthGateway.test.ts` (US3-1, US3-3)
- [X] T034 [P] [US3] Escribir pruebas de `RegisterForm` para US3-1 (mensaje en correo y foco) y US3-2 (desaparece al editar), y para `unavailable` como alerta global, en `src/ui/features/register/RegisterForm.test.tsx`

### Implementation for User Story 3

- [X] T035 [US3] Rechazar correos existentes en `InMemoryAuthGateway.register` en `src/infrastructure/InMemoryAuthGateway.ts`
- [X] T036 [US3] Manejar `email-taken` (error en el campo de correo y foco) y `unavailable` (alerta "Servicio de acceso no disponible. Intenta más tarde.") en `src/ui/features/register/registerReducer.ts` y `RegisterForm.tsx`

---

## Phase 6: User Story 4 - Navegar entre registro e inicio de sesión (Priority: P2)

**Goal**: enlaces entre ambas pantallas

**Independent Test**: "Regístrate" lleva a `/registro` e "Inicia sesión" a `/login`

### Tests for User Story 4 ⚠️

- [X] T037 [P] [US4] Escribir pruebas en `src/App.test.tsx` para US4-1 ("Inicia sesión" → `/login`) y US4-2 ("Regístrate" → `/registro`), y actualizar `src/ui/features/login/LoginForm.test.tsx`, donde "Regístrate" ya no muestra el aviso de función no disponible

### Implementation for User Story 4

- [X] T038 [US4] Reemplazar el botón "Regístrate" por `RouteLink` a `ROUTES.register` en `src/ui/features/login/LoginForm.tsx`, y usar `RouteLink` a `ROUTES.login` para "Inicia sesión" en `src/ui/features/register/RegisterForm.tsx`

---

## Phase 7: User Story 5 - Opciones fuera del alcance (Priority: P3)

**Goal**: Google, Apple y "términos y condiciones" muestran "Próximamente"

**Independent Test**: activar cada uno y verificar `window.alert("Próximamente")`

- [X] T039 [P] [US5] Escribir pruebas con `vi.spyOn(window, 'alert')` para US5-1 y US5-2 (la casilla no cambia, los datos se conservan) en `src/ui/features/register/RegisterForm.test.tsx`
- [X] T040 [US5] Llamar a `window.alert(MESSAGES.COMING_SOON)` desde Google, Apple y el botón "términos y condiciones" en `src/ui/features/register/RegisterForm.tsx` (research.md R5)

---

## Phase 8: User Story 6 - Mostrar u ocultar las contraseñas (Priority: P3)

**Goal**: cada campo de contraseña tiene su propio control de visibilidad

- [X] T041 [US6] Escribir prueba de US6-1 (los controles de contraseña y confirmación son independientes) en `src/ui/features/register/RegisterForm.test.tsx`; se reutiliza `PasswordField`, sin código nuevo

---

## Phase 9: Polish & Cross-Cutting Concerns

- [X] T042 [P] Pruebas de accesibilidad con `expectNoA11yViolations` para `/registro` vacío, con errores y `/login` con mensaje de éxito en `src/App.test.tsx` (FR-021, SC-005)
- [X] T043 [P] Verificar responsive: dos paneles desde 960 px y solo formulario en móvil sin scroll horizontal desde 320 px en `src/ui/layout/AuthLayout/AuthLayout.module.css` (FR-022)
- [X] T044 [P] Actualizar `README.md` con las rutas `/login` y `/registro`, el registro en memoria y el enlace a `specs/002-registro-usuarios/`
- [X] T045 Ejecutar `npm run verify` (lint, formato, tipos, cobertura ≥ 80 %, build, auditorías y secretos) y corregir hallazgos
- [X] T046 Validar manualmente los escenarios de `specs/002-registro-usuarios/quickstart.md` con `npm run dev`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → **Foundational (Phase 2)** → historias → **Polish (Phase 9)**
- US1 depende de Foundational. US2, US3, US5 y US6 amplían `RegisterForm`, creado en US1.
- US4 depende solo de Foundational (`RouteLink`), pero su enlace "Inicia sesión" vive en `RegisterForm` (US1).

### Within Each User Story

- Pruebas primero y verlas fallar (Rojo) → implementación (Verde) → refactorizar
- Dominio → caso de uso → adaptador → reducer → componente → App

### Parallel Opportunities

- T003 y T005; T009 y T010 (archivos distintos)
- En US1: T013, T014, T015 y T016; T018 y T019
- En US2: T026, T027, T028 y T029
- En Polish: T042, T043 y T044

## Parallel Example: User Story 1

```bash
Task: "Pruebas de createRegister en src/application/register.test.ts"
Task: "Pruebas de InMemoryAuthGateway.register en src/infrastructure/InMemoryAuthGateway.test.ts"
Task: "Pruebas de registerReducer en src/ui/features/register/registerReducer.test.ts"
```

## Implementation Strategy

### MVP First (User Story 1 + 2)

US1 y US2 son ambas P1: juntas entregan un registro válido y funcional. Validar con quickstart
escenarios 3, 4, 7 y 8 antes de continuar.

### Incremental Delivery

1. Foundational → rutas navegables
2. US1 + US2 → MVP de registro
3. US3 + US4 → duplicados y navegación por enlaces
4. US5 + US6 → fidelidad al diseño
5. Polish → `npm run verify` en verde
