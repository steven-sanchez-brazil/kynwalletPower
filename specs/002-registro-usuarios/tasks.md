---

description: "Task list for 002-registro-usuarios"
---

# Tasks: Pantalla de Registro de Usuarios de KynWallet

**Input**: Design documents from `/specs/002-registro-usuarios/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/account-registry.md,
contracts/ui-registro.md

**Tests**: OBLIGATORIAS (Constitución, Principio I). En cada par "pruebas → implementación", las
pruebas se escriben primero y se confirma que fallan.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede ejecutarse en paralelo (archivos distintos, sin dependencias)
- **[Story]**: historia de la spec (US1–US4)
- Trazabilidad (9.2): cada `it(...)` empieza con el ID del escenario o requisito que verifica.

---

## Phase 1: Setup

- [X] T001 Crear la rama `feature/registro-luciano-baez` y el directorio de la feature con `.specify/scripts/bash/create-new-feature.sh --short-name registro-usuarios`
- [X] T002 Ejecutar `npm install` y confirmar que `npm test` pasa en verde antes de empezar (línea base de 001)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: enrutador, layout compartido y componentes que usan todas las historias

- [X] T003 [P] Pruebas de `src/ui/routing/router.test.ts`: `useRoute` devuelve la ruta actual; `navigate('/registro')` cambia la URL y re-renderiza; `navigate` con estado lo expone en `history.state`; reacciona a `popstate` (Atrás/Adelante) (FR-017)
- [X] T004 Implementar `src/ui/routing/router.ts` (`ROUTES`, `navigate`, `useRoute` con `useSyncExternalStore`) hasta pasar T003
- [X] T005 [P] Pruebas de `src/ui/routing/Link.test.tsx`: renderiza `<a href>`; clic simple navega sin recargar; clic con Ctrl/Meta no se intercepta
- [X] T006 Implementar `src/ui/routing/Link.tsx` y `Link.module.css` (estilo de enlace de Figma: 14 px SemiBold `var(--brand-700)`) hasta pasar T005
- [X] T007 [P] Pruebas de `Checkbox` en `src/ui/components/Checkbox/Checkbox.test.tsx`: acepta `label` como ReactNode, muestra `error` con `aria-invalid` y `aria-describedby`, acepta `ref`
- [X] T008 Extender `src/ui/components/Checkbox/Checkbox.tsx` y su CSS hasta pasar T007 sin romper el uso de "Recordarme"
- [X] T009 Mover `src/ui/features/login/LoginScreen.*` a `src/ui/layout/AuthLayout/AuthLayout.*` y hacer que `BrandPanel` reciba `title` y `subtitle` por props; el login pasa sus textos de 001 (refactor sin cambio de comportamiento: las pruebas de 001 siguen en verde)

**Checkpoint**: `npm test` en verde; el login se ve igual que antes

---

## Phase 3: User Story 2 - Validar los datos antes de crear la cuenta (Priority: P1)

> Se implementa antes que US1 porque la validación de dominio es prerrequisito del envío.

**Goal**: mensajes por campo según data-model.md, sin ejecutar el registro con errores

### Tests for User Story 2 ⚠️

- [X] T010 [P] [US2] Pruebas de `src/domain/registrationValidation.test.ts`: cada regla y mensaje de data-model.md (obligatorios, nombre inválido/corto/largo, correo inválido, contraseña corta/larga, confirmación distinta, términos sin aceptar); `normalizeFullName` recorta y colapsa espacios; contraseñas sin recortar
- [X] T011 [P] [US2] Pruebas de `src/ui/features/register/registerReducer.test.ts`: `blur` marca y calcula; `change` en campo tocado recalcula; cambiar `password` revalida `confirmPassword` tocado (US2-5); `submit` con errores marca todo y queda en `editing` (FR-010)

### Implementation for User Story 2

- [X] T012 [US2] Agregar a `src/domain/messages.ts` los textos de registro y exportar `validateEmail`/`validatePassword` en `src/domain/validation.ts` (fuente única, Principio IV)
- [X] T013 [US2] Crear `src/domain/registration.ts` (tipos) y `src/domain/registrationValidation.ts` hasta pasar T010
- [X] T014 [US2] Crear `src/ui/features/register/registerReducer.ts` hasta pasar T011

---

## Phase 4: User Story 1 - Crear una cuenta con datos válidos (Priority: P1) 🎯 MVP

**Goal**: el registro válido agrega la cuenta, navega a `/login` y muestra el éxito

### Tests for User Story 1 ⚠️

- [X] T015 [P] [US1] Pruebas de `src/application/registerAccount.test.ts`: delega con correo y nombre normalizados y contraseña intacta; excepción → `unavailable`
- [X] T016 [P] [US1] Pruebas de `src/infrastructure/InMemoryAccountRegistry.test.ts`: agrega a la lista compartida → `success`; correo duplicado (sin distinguir mayúsculas) → `email-taken` sin modificar la lista; `null` → `unavailable`; espera `delayMs`
- [X] T017 [P] [US1] Ampliar `registerReducer.test.ts`: `submit` válido → `submitting`; segundo `submit` ignorado; `result` success → `registered`; error → `submitError` y contraseñas vacías; `change` limpia `submitError`
- [X] T018 [US1] Pruebas de integración `src/ui/features/register/RegisterForm.test.tsx`: US1-1 (llama a `onRegistered`), US1-2 (carga y sin reenvíos), US1-4 (Enter), US2-1 (todos los mensajes, foco en el nombre, sin registrar), US2-2/3/4/6, correo duplicado, no disponible, FR-018 (la contraseña no aparece en DOM, URL, consola ni storage)

### Implementation for User Story 1

- [X] T019 [P] [US1] Crear `src/application/ports/AccountRegistry.ts` y `src/application/registerAccount.ts` hasta pasar T015
- [X] T020 [P] [US1] Crear `src/infrastructure/InMemoryAccountRegistry.ts` hasta pasar T016
- [X] T021 [US1] Completar `registerReducer.ts` (T017) y crear `src/ui/features/register/useRegisterForm.ts`
- [X] T022 [US1] Crear `src/ui/features/register/RegisterForm.tsx` y `RegisterForm.module.css` según contracts/ui-registro.md y Figma hasta pasar T018
- [X] T023 [US1] Login: `useLoginForm`/`LoginForm` aceptan un aviso inicial (`initialNotice`) que desaparece al enviar (US1-5); prueba en `LoginForm.test.tsx`
- [X] T024 [US1] Componer en `src/main.tsx` la lista de cuentas compartida, `InMemoryAccountRegistry` y `createRegisterAccount`; `App` recibe `registerAccount`

---

## Phase 5: User Story 3 - Moverse entre registro e inicio de sesión (Priority: P2)

### Tests for User Story 3 ⚠️

- [X] T025 [US3] Pruebas en `src/App.test.tsx`: `/registro` muestra el registro (US3-4); "Inicia sesión" navega a `/login` (US3-1); "Regístrate" navega a `/registro` (US3-2); Atrás vuelve (US3-3); ruta desconocida muestra el login; flujo completo registro → éxito en `/login` → login con la cuenta nueva (US1-1, US1-3); axe sin violaciones en registro y en registro con errores
- [X] T026 [US3] Actualizar `LoginForm.test.tsx` (001 US5-1 y FR-014): "Regístrate" deja de mostrar el aviso y es un `link` a `/registro`

### Implementation for User Story 3

- [X] T027 [US3] `App.tsx` elige la pantalla con `useRoute`; el login cambia "Regístrate" por `Link` a `/registro` y lee `history.state.registered` para el aviso de éxito

---

## Phase 6: User Story 4 - Google, Apple y términos (próximamente) (Priority: P3)

- [X] T028 [US4] Pruebas en `RegisterForm.test.tsx`: "Google", "Apple" y "términos y condiciones" llaman a `window.alert('Próximamente')`, conservan los datos y no cambian la casilla (US4-1, US4-2)
- [X] T029 [US4] Implementar los manejadores en `RegisterForm.tsx` hasta pasar T028

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T030 [P] Responsive (FR-021): revisar 320 px, 768 px y 1440 px en el navegador; sin scroll horizontal; en móvil solo el formulario con el logo
- [X] T031 [P] Actualizar `README.md`: rutas, registro, cuenta en memoria y enlace a `specs/002-registro-usuarios/`
- [X] T032 Ejecutar `npm run verify` (lint, formato, tipos, cobertura ≥ 80 %, build, auditorías, secretos) y corregir hallazgos
- [X] T033 Revisión visual contra el frame `04 · Registro` (SC-005)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → (Phase 3 → Phase 4) → Phase 5 → Phase 6 → Phase 7.
- Dentro de cada historia: pruebas (rojo) → implementación (verde) → refactor.
- [P] marca tareas sin dependencias entre sí (archivos distintos).

## Traceability (FR → tareas)

| FR | Tareas |
|---|---|
| FR-001, FR-021 | T009, T022, T030, T033 |
| FR-002, FR-003, FR-019 | T007, T008, T018, T022 |
| FR-004 – FR-010 | T010 – T014, T018 |
| FR-011, FR-012 | T016, T017, T020, T021, T024, T025 |
| FR-013 | T023, T025, T027 |
| FR-014, FR-022 | T015, T016, T018 |
| FR-015 | T028, T029 |
| FR-016, FR-017 | T003 – T006, T025 – T027 |
| FR-018 | T018 |
| FR-020 | T018, T025 |
