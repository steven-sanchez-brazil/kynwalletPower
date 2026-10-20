# Research: Registro de Usuarios de KynWallet

**Feature**: `registro` | **Date**: 2026-10-20

The existing application and feature specification provide sufficient evidence to resolve the plan's technical choices. No new third-party research or dependencies are required.

## R1. Existing Frontend Stack and Testing

- **Decision**: Reuse React 19, TypeScript 5 in strict mode, Vite 8, CSS Modules, Vitest 5, React Testing Library, jsdom, and the repository's `axe-core` helper.
- **Rationale**: These packages and scripts already exist in `package.json` and `vite.config.ts`; no dependency is justified for one additional screen.
- **Alternatives considered**: Adding a form library, router, or another test framework would duplicate existing capability and increase complexity.
- **Evidence**: `package.json`, `vite.config.ts`, `tsconfig.json`, `src/test/a11y.ts`.

## R2. Component Reuse and Feature Boundary

- **Decision**: Add a separate registration feature under `src/ui/features/register/`; reuse `BrandPanel` and shared controls. Keep registration validation in a pure `src/domain/registrationValidation.ts` function and state in a reducer/hook.
- **Rationale**: The login feature already demonstrates separation of domain validation, reducer-driven form state, screen layout, and reusable fields. Registration rules must not be coupled to login credential submission.
- **Alternatives considered**: Extending `LoginForm` or reusing `LoginCredentials` would conflate distinct flows and risk changing existing login behavior.
- **Evidence**: `src/ui/features/login/LoginForm.tsx`, `src/ui/features/login/loginReducer.ts`, `src/ui/features/login/useLoginForm.ts`, `src/domain/validation.ts`, `src/ui/components/`.

## R3. Email Validation and Password Semantics

- **Decision**: Reuse the existing normalized email helpers (`normalizeEmail`, `isValidEmail`) so registration follows the login email format and 254-character limit. Require a password of at least 8 characters; preserve whitespace and impose no extra complexity or maximum rule.
- **Rationale**: The spec requires a valid email and minimum password length, and explicitly says password spaces are significant. Sharing email rules avoids divergence. No additional password constraint is authorized by the registration spec.
- **Alternatives considered**: A second email regex risks inconsistent behavior; applying login's 128-character maximum or password-composition rules to registration adds unspecified restrictions.
- **Evidence**: `src/domain/validation.ts`, `specs/registro/spec.md` FR-005–FR-007 and Edge Cases.

## R4. Routing without a Router Dependency

- **Decision**: Select `/register` versus login using `window.location.pathname` at the `App` composition boundary. Use a semantic `/login` anchor for return navigation; keep `/` and unknown paths mapped to login.
- **Rationale**: There are only two required paths and the repository does not currently use a router. Native links preserve browser navigation semantics without new dependencies or custom history behavior.
- **Alternatives considered**: Introducing a routing library is unnecessary for this bounded screen; implementing custom History API navigation would add state synchronization and test complexity.
- **Evidence**: `src/App.tsx` currently always renders login; `package.json` has no router dependency; `specs/registro/tasks.md` T004/T010/T018.
- **Operational constraint**: Production static hosting must serve `index.html` as a fallback for direct `/register` and `/login` requests.

## R5. Local Success and Credential Handling

- **Decision**: On valid form submission, transition local React state to a success view, clear form values from active state, and announce the result through the existing status-alert pattern. Do not call a service, persist input, or include the password in output.
- **Rationale**: The spec explicitly scopes this iteration to a functional frontend experience with a success message and no account persistence or backend claim.
- **Alternatives considered**: Calling the login gateway, adding an API, or persisting demo account details would exceed scope and create misleading behavior.
- **Evidence**: `specs/registro/spec.md` FR-010–FR-016 and Assumptions; `src/ui/components/Alert/Alert.tsx`.

## R6. Responsive Brand and Form Composition

- **Decision**: Reuse the login breakpoints and visual tokens (960px two-column threshold, 1280px wide desktop, 620px brand column, 400px form max width), but hide the complete brand panel below 960px for registration.
- **Rationale**: The existing layout provides project-consistent measurements. The login's mobile layout keeps the logo visible, while the registration spec specifically requires only the form on mobile, so registration needs its own screen CSS behavior.
- **Alternatives considered**: Reusing `LoginScreen` unchanged violates the mobile specification because `BrandPanel` remains visible below 960px.
- **Evidence**: `src/ui/features/login/LoginScreen.module.css`, `src/ui/layout/BrandPanel/BrandPanel.module.css`, `specs/registro/spec.md` FR-001/FR-002/FR-015.

## R7. Terms Link and Full-Name Boundaries

- **Decision**: Treat a name as required after trimming surrounding whitespace; keep the displayed value as entered. Do not invent a terms URL, name length limit, or extra name-format rule. Show an acceptance checkbox and an associated inline error.
- **Rationale**: A whitespace-only name should not pass a required-field check, but the feature does not prescribe more stringent identity rules. The terms destination is not provided.
- **Alternatives considered**: Guessing a legal URL or enforcing a culturally specific multi-part-name rule would introduce unsupported product requirements.
- **Open product input**: Supply the approved terms URL/content and any name length policy before implementation if required.

## R8. Accessible Checkbox Error Support

- **Decision**: Extend the shared Checkbox with optional accessible description/error props and conditional `aria-invalid`/`aria-describedby`, preserving its current label/checked/onChange API for login callers.
- **Rationale**: Existing Checkbox does not accept error content, but registration requires an inline terms error announced to assistive technology.
- **Alternatives considered**: Rendering unassociated text adjacent to the checkbox fails the explicit accessibility requirement; replacing the shared control duplicates styling and behavior.
- **Evidence**: `src/ui/components/Checkbox/Checkbox.tsx`, `src/ui/components/Checkbox/Checkbox.module.css`, `specs/registro/spec.md` FR-004, FR-008, FR-014.
