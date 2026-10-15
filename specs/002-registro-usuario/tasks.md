---

description: "Task list for 002-registro-usuario"
---

# Tasks: Registro de Usuarios de KynWallet

**Input**: Design documents from `/specs/002-registro-usuario/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: OBLIGATORIAS (Constitución, Principio I). Cada historia empieza por sus pruebas y se
verifica que fallen antes de implementar.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede ejecutarse en paralelo (archivos distintos, sin dependencias)
- **[Story]**: historia de la spec (US1–US5)
- Pruebas junto al código (`*.test.ts(x)`); cada `it(...)` empieza con el ID del escenario,
  requisito o caso de contrato (Constitución 9.2).

---

## Phase 1: Setup

- [X] T001 Crear `specs/002-registro-usuario/` con spec, plan, research, data-model, contratos, quickstart y checklist
- [X] T002 Obtener el contexto de diseño del nodo `31:2` con el MCP de Figma (`get_design_context`) y registrar medidas y textos en research.md R7; confirmar que los SVG de 001 son los mismos

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T003 [P] Pruebas de `validateRegistration` en `src/domain/registration.test.ts`: datos válidos → `{}`; cada obligatorio (FR-003–FR-007); nombre > 80; correo y contraseña con las reglas de 001; confirmación distinta (US2-4); espacios en contraseñas no se recortan
- [X] T004 Implementar `src/domain/registration.ts` (`RegistrationData`, `RegistrationErrors`, `RegistrationResult`, `validateRegistration`); exportar `validateEmail`, `validatePassword` y `FULL_NAME_MAX_LENGTH` desde `src/domain/validation.ts`; usar `FULL_NAME_MAX_LENGTH` en `src/infrastructure/loadDemoAccounts.ts`; agregar los textos a `src/domain/messages.ts`
- [X] T005 [P] Pruebas del router en `src/ui/routing/router.test.ts` (contracts/routing.md N1–N4)
- [X] T006 Implementar `src/ui/routing/router.ts` (`ROUTES`, `navigate`, `useRoute`, títulos)
- [X] T007 [P] Ampliar `Alert` con `tone="success"` (`role="status"`) y los tokens `--success-600`/`--success-50` en `src/ui/styles/tokens.css`; pruebas en `Alert.test.tsx`
- [X] T008 [P] Ampliar `Checkbox` con `label: ReactNode`, `error` (con `aria-invalid` y `aria-describedby`) y `ref`; pruebas en `Checkbox.test.tsx`
- [X] T009 [P] `BrandPanel` con `title` y `subtitle` opcionales (valores de 001 por defecto); mover `LoginScreen` a `src/ui/layout/AuthLayout/` con los mismos estilos

**Checkpoint**: `npm test` pasa; el login de 001 no cambia.

---

## Phase 3: User Story 1 - Crear una cuenta (P1) 🎯 MVP

- [X] T010 [P] [US1] Pruebas del caso de uso en `src/application/register.test.ts` (normaliza correo y nombre, no envía la confirmación, excepción → `unavailable`)
- [X] T011 [P] [US1] Pruebas del adaptador en `src/infrastructure/InMemoryRegistrationGateway.test.ts` (contracts/registration-gateway.md R1–R6, incluido que el login autentica la cuenta nueva)
- [X] T012 [US1] Implementar `src/application/ports/RegistrationGateway.ts`, `src/application/register.ts` y `src/infrastructure/InMemoryRegistrationGateway.ts`; conectar en `src/main.tsx` con el mismo arreglo de cuentas
- [X] T013 [P] [US1] Pruebas de `registerReducer` en `src/ui/features/register/registerReducer.test.ts` (transiciones de data-model.md)
- [X] T014 [P] [US1] Pruebas de `RegisterForm` en `src/ui/features/register/RegisterForm.test.tsx`: US1-1 (llama a `register` y a `onRegistered`), US1-2 (carga y un solo envío), contrato de UI y `axe`
- [X] T015 [US1] Implementar `registerReducer.ts`, `useRegisterForm.ts`, `RegisterForm.tsx` y `RegisterForm.module.css` según el diseño (research R7)
- [X] T016 [US1] Pruebas e implementación en `src/App.test.tsx` y `src/App.tsx`: éxito → `/login` con mensaje (US1-1), mensaje se borra al enviar el login (US1-5), cuenta nueva inicia sesión (US1-3); `LoginForm` con `successMessage`

---

## Phase 4: User Story 2 - Corregir los datos antes de enviar (P1)

- [X] T017 [P] [US2] Pruebas en `RegisterForm.test.tsx`: US2-1 a US2-7, salida de campo vacío sin error (Edge Case) y foco en el primer error
- [X] T018 [US2] Ajustar `RegisterForm` y el reducer hasta pasar T017

---

## Phase 5: User Story 3 - Evitar correos repetidos (P2)

- [X] T019 [P] [US3] Pruebas en `RegisterForm.test.tsx`: US3-1 (mensaje, foco y datos conservados) y US3-2; error inesperado (FR-019)
- [X] T020 [US3] Implementar el manejo de `email-taken` y `unavailable`

---

## Phase 6: User Story 4 - Navegar entre registro e inicio de sesión (P2)

- [X] T021 [P] [US4] Pruebas en `src/App.test.tsx`: US4-1 a US4-5 (enlaces, URL directa, ruta desconocida, atrás, título y foco)
- [X] T022 [US4] "Regístrate" en `LoginForm` navega a `/registro` (prop `onGoToRegister`); actualizar sus pruebas; foco en "Nombre completo" al llegar navegando

---

## Phase 7: User Story 5 - Google y Apple (P3)

- [X] T023 [P] [US5] Prueba en `RegisterForm.test.tsx`: US5-1 con `window.alert` espiado
- [X] T024 [US5] Implementar el `alert('Próximamente')`

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T025 [P] Actualizar spec 001 (FR-016: "Regístrate" ahora navega), `contracts/ui-login.md` y README (rutas, registro, despliegue con fallback a `index.html`)
- [X] T026 Ejecutar `npm run verify` (lint, formato, tipos, cobertura ≥ 80 %, build, auditorías, secretos)
- [X] T027 Revisión visual a 1440 px y 375 px frente al frame `31:2` y validación de quickstart.md V1–V13

---

## Dependencies & Execution Order

- Phase 2 bloquea a las historias. US1 → US2 → US3 comparten el formulario; US4 depende de
  US1 (App con rutas); US5 es independiente una vez existe el formulario.
- Dentro de cada historia: pruebas (rojo) → implementación (verde) → refactor.
