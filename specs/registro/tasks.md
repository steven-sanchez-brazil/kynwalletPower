# Tasks: Registro de Usuarios de KynWallet

**Input**: Design documents from `specs/registro/`

**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`, `contracts/ui-register.md`, `research.md`, and `quickstart.md`. No additional dependencies are required.

**Tests**: Tests are included because the project constitution requires test-driven development (TDD), with tests written and verified to fail before production changes.

**Organization**: Tasks are grouped by the user stories in `spec.md`; the existing React, TypeScript, Vitest, and Testing Library setup is reused.

## Phase 1: Setup

**Purpose**: Project tooling is already configured in the repository; no initialization or dependency installation is required.

## Phase 2: Foundational

**Purpose**: No additional shared infrastructure is required before the registration stories. The registration domain and UI remain isolated from login authentication and persistence.

---

## Phase 3: User Story 1 - Crear una cuenta mediante el formulario (Priority: P1) 🎯 MVP

**Goal**: A visitor can enter valid registration details, accept the terms, and see an accessible success confirmation without creating a backend account or storing credentials.

**Independent Test**: Render the registration screen at `/register`, submit a valid full name, email, password of at least 8 characters, matching confirmation, and accepted terms; verify the success confirmation appears and no password is exposed.

### Tests for User Story 1

> Write tests first and confirm they fail before implementing the corresponding behavior.

- [X] T001 [P] [US1] Add unit tests for required full name, valid email, minimum 8-character password, matching confirmation, and accepted terms in `src/domain/registrationValidation.test.ts`
- [X] T002 [P] [US1] Add reducer tests for registration values and transition from an idle form to success in `src/ui/features/register/registrationReducer.test.ts`
- [X] T003 [P] [US1] Add form tests for valid submission, visible accessible success confirmation, and no password in the result in `src/ui/features/register/RegisterForm.test.tsx`
- [X] T004 [P] [US1] Add application tests proving `/register` renders the registration screen and `/login` continues to render the login screen in `src/App.test.tsx`

### Implementation for User Story 1

- [X] T005 [US1] Implement pure registration validation in `src/domain/registrationValidation.ts`; treat a name as required after trimming surrounding whitespace, validate email format after trimming surrounding whitespace, require a password of at least 8 characters without trimming it, require an exact confirmation match, and require terms acceptance
- [X] T006 [US1] Implement the registration form state transitions in `src/ui/features/register/registrationReducer.ts` for field changes, validation errors, terms acceptance, submit, and local success
- [X] T007 [US1] Implement registration state and submit handling in `src/ui/features/register/useRegistrationForm.ts`, using the domain validator and making no network, authentication, persistence, or logging calls
- [X] T008 [US1] Implement the registration fields and success confirmation in `src/ui/features/register/RegisterForm.tsx` and `src/ui/features/register/RegisterForm.module.css`, reusing existing shared text, password, checkbox, button, divider, social, and alert controls where suitable
- [X] T009 [US1] Implement the registration screen shell in `src/ui/features/register/RegisterScreen.tsx` and `src/ui/features/register/RegisterScreen.module.css`, reusing the existing brand panel on desktop
- [X] T010 [US1] Route `/register` to `RegisterScreen` and preserve `/login` and the current default login behavior in `src/App.tsx`

**Checkpoint**: A valid registration submission shows success, invalid values cannot produce success, and the existing login remains available at `/login`.

---

## Phase 4: User Story 2 - Corregir errores de validación (Priority: P1)

**Goal**: Visitors receive inline, accessible feedback for invalid or missing values, can correct errors, and are directed to the first invalid field on submit.

**Independent Test**: Submit invalid email, a password shorter than 8 characters, mismatched confirmation, blank required fields, and unchecked terms; verify associated messages, first-invalid focus, and error removal or update after correction.

### Tests for User Story 2

> Write tests first and confirm they fail before implementing the corresponding behavior.

- [X] T011 [P] [US2] Add interaction tests for blur and submit validation, password changes after confirmation, correction of individual errors, and focus on the first invalid field in `src/ui/features/register/RegisterFormValidation.test.tsx`
- [X] T012 [P] [US2] Add checkbox tests for an associated terms-acceptance error and accessible invalid state in `src/ui/components/Checkbox/Checkbox.test.tsx`

### Implementation for User Story 2

- [X] T013 [US2] Implement touched-field, blur, submit, and correction behavior in `src/ui/features/register/useRegistrationForm.ts` and `src/ui/features/register/registrationReducer.ts` so corrected values clear or update only their corresponding errors
- [X] T014 [US2] Associate each registration error with its field and focus the first invalid field after submit in `src/ui/features/register/RegisterForm.tsx`
- [X] T015 [US2] Extend the shared checkbox with optional accessible description and error support in `src/ui/components/Checkbox/Checkbox.tsx` and `src/ui/components/Checkbox/Checkbox.module.css`, preserving current callers
- [X] T016 [US2] Display the required-terms error inline and associate it with the terms checkbox in `src/ui/features/register/RegisterForm.tsx` and `src/ui/features/register/RegisterForm.module.css`

**Checkpoint**: Invalid submission never produces success; each inline error is accessible, updates when corrected, and the first invalid field receives focus.

---

## Phase 5: User Story 3 - Elegir alternativas y volver al inicio de sesión (Priority: P2)

**Goal**: Google and Apple provide the specified informational alert, and existing users can navigate to `/login`.

**Independent Test**: Activate both social buttons and verify the exact alert text «Próximamente» without losing form values; activate «Iniciar sesión» and verify the browser navigates to `/login`.

### Tests for User Story 3

> Write tests first and confirm they fail before implementing the corresponding behavior.

- [X] T017 [P] [US3] Add tests for Google and Apple «Próximamente» alerts, retained form values, and the `/login` link in `src/ui/features/register/RegisterFormSocialNavigation.test.tsx`

### Implementation for User Story 3

- [X] T018 [US3] Wire Google and Apple actions to an accessible «Próximamente» alert and add a semantic link to `/login` in `src/ui/features/register/RegisterForm.tsx`

**Checkpoint**: Each social action shows the exact notice without external navigation, and the login link reaches the existing login screen.

---

## Phase 6: User Story 4 - Usar el registro en escritorio y móvil (Priority: P2)

**Goal**: The registration page matches the desktop two-panel composition and shows only the form on mobile without horizontal overflow.

**Independent Test**: At desktop width, verify brand and form panels are both visible; at mobile widths down to 320px, verify the brand panel is hidden and all form controls remain usable without horizontal scrolling.

### Tests for User Story 4

> Write tests first and confirm they fail before implementing the corresponding behavior.

- [X] T019 [P] [US4] Add registration screen rendering and accessible main-heading tests in `src/ui/features/register/RegisterScreen.test.tsx`

### Implementation for User Story 4

- [X] T020 [US4] Implement responsive registration layout in `src/ui/features/register/RegisterScreen.module.css`, showing the brand and form as two panels on desktop and hiding the entire brand panel on mobile while preventing horizontal overflow from 320px

**Checkpoint**: Desktop presents the two-panel design; mobile presents only the complete, operable form.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete registration flow and document reproducible checks.

- [X] T021 [P] Document prerequisites, commands, expected valid/invalid registration outcomes, social alerts, `/login` navigation, and desktop/mobile checks in `specs/registro/quickstart.md`
- [X] T022 Run the registration tests and repository checks from `package.json`; resolve failures in `src/domain/registrationValidation.ts`, `src/ui/features/register/`, `src/ui/components/Checkbox/`, or `src/App.tsx` before marking the feature complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No new setup is required; repository tooling is already present.
- **Foundational (Phase 2)**: No additional foundation is required.
- **User Story 1 (Phase 3)**: Can start immediately; delivers the valid registration MVP.
- **User Story 2 (Phase 4)**: Builds on the form and registration state introduced by US1.
- **User Story 3 (Phase 5)**: Builds on the registration form from US1; can proceed independently of US2 after the form exists.
- **User Story 4 (Phase 6)**: Builds on the registration screen from US1; can proceed independently of US2 and US3.
- **Polish (Phase 7)**: Depends on all selected stories being complete.

### User Story Dependencies

- **US1 (P1)**: No story dependencies.
- **US2 (P1)**: Depends on US1's form, validation, and state.
- **US3 (P2)**: Depends on US1's form; independent of US2 and US4.
- **US4 (P2)**: Depends on US1's screen; independent of US2 and US3.

### Within Each User Story

- Write tests before changing production behavior and verify they fail first (Constitution, Principle I).
- Domain validation is implemented before it is consumed by the registration form.
- Form state and form controls precede route integration.
- Social navigation and responsive layout are added after the screen exists.

### Parallel Opportunities

- Within US1, T001–T004 target distinct test files and can be authored in parallel; implementation follows the relevant failing tests.
- Within US2, T011 and T012 target distinct test files and can be authored in parallel; checkbox support (T015) can proceed independently of registration focus behavior (T013–T014).
- US3 and US4 can proceed in parallel after US1 because they primarily change different files; coordinate any shared `RegisterForm.tsx` changes between US2 and US3.
- Within US4, the screen rendering test and responsive CSS work use separate files.

## Parallel Example: User Story 1

```text
Task: "Add domain validation tests in src/domain/registrationValidation.test.ts"
Task: "Add reducer tests in src/ui/features/register/registrationReducer.test.ts"
Task: "Add form success tests in src/ui/features/register/RegisterForm.test.tsx"
Task: "Add route rendering tests in src/App.test.tsx"
```

## Parallel Example: User Story 2

```text
Task: "Add form validation interaction tests in src/ui/features/register/RegisterFormValidation.test.tsx"
Task: "Add checkbox accessibility tests in src/ui/components/Checkbox/Checkbox.test.tsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Reuse the existing project tooling; add no dependencies.
2. Complete US1, including tests, registration domain validation, local success state, registration screen, and `/register` entry.
3. **STOP and VALIDATE**: run the US1 tests and confirm success and the existing `/login` view.
4. Deliver US1 as the independently demonstrable registration MVP.

### Incremental Delivery

1. Complete US1 and validate the valid registration flow.
2. Add US2 and validate each inline error, correction, checkbox accessibility, and focus behavior.
3. Add US3 and validate informational social controls and return navigation.
4. Add US4 and validate desktop/mobile layouts independently.
5. Run the final repository checks and the scenarios documented in `specs/registro/quickstart.md`.
