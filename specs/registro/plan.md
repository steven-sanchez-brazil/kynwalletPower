# Implementation Plan: Registro de Usuarios de KynWallet

**Branch**: `feature/registro-alvaro-martinez` | **Date**: 2026-10-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/registro/spec.md`

## Summary

Implement a client-side registration screen in the existing React + TypeScript single-page application. The screen will reuse the current KynWallet visual system and shared controls, add registration-only state and validation, display a local accessible success result without claiming account persistence, and expose `/register` and `/login` paths without adding a routing dependency. Desktop uses the existing two-panel brand/form composition; mobile hides the complete brand panel and keeps the form usable down to 320px.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict`), Node.js >= 20 for development tools.

**Primary Dependencies**: Existing React 19, Vite 8, `@fontsource-variable/inter`, CSS Modules; no new dependencies.

**Storage**: None. Form state and success are transient React state; no account, password, or terms choice is persisted.

**Testing**: Vitest 5, React Testing Library, `@testing-library/user-event`, jsdom, `axe-core` through `src/test/a11y.ts`, and existing V8 coverage thresholds.

**Target Platform**: Modern desktop and mobile browsers; responsive layout tested from 320px and above.

**Project Type**: Client-only React single-page web application.

**Performance Goals**: Validation and the local success state are synchronous; the screen should provide immediate feedback on submit.

**Constraints**: No backend, external authentication, database, storage, or new router dependency. Follow TDD, WCAG 2.1 AA, existing TypeScript/CSS Module conventions, and never expose the password in messages, URLs, logs, or persisted data.

**Scale/Scope**: One registration route and one form flow, with four text fields, a terms checkbox, social-provider notices, and a local success result; the existing login flow remains available.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Application to this feature | Status |
|---|---|---|
| I. TDD | Add failing domain, reducer, form, routing, accessibility, and responsive-related tests before production changes; run the focused tests and repository checks. | ✅ |
| II. SOLID | Keep validation pure, state transitions in a registration reducer/hook, and presentation in feature components. Reuse shared controls rather than making them registration-specific. | ✅ |
| III. Clean Architecture | Put registration rules in `src/domain`; keep React state and views in `src/ui/features/register`; do not introduce infrastructure or persistence for a local-only flow. Route selection stays at the application composition boundary in `src/App.tsx`. | ✅ |
| IV. DRY/KISS/YAGNI | Reuse the login layout, design tokens, fields, password, checkbox, alert, and social controls. Use a small pathname switch rather than adding a router library for two paths. No backend, OAuth, or account storage. | ✅ |
| V. Security by Design | Treat inputs as untrusted; do not log, persist, or put passwords in URLs or success output. The success view confirms only that the local form was accepted; no credential is submitted to an external service. | ✅ |
| VI. BRD/ARD | No feature-specific BRD or ARD is present. The spec records this assumption and requires alignment if governing documents are introduced. | ✅ N/A |
| 7. Dependency Management | Use only dependencies already in `package.json`; add no package or lockfile changes. | ✅ |
| 8.1–8.3. Quality and documentation | Add behavior and accessibility tests, use existing lint/typecheck/format/build scripts, and document runnable validation in `quickstart.md`. | ✅ |
| 8.4. Accessibility | Reuse labeled fields and alerts, provide an associated inline error for the terms checkbox, preserve visible focus, and verify the states with axe and keyboard interaction. | ✅ |
| 8.5–8.6. Reuse and design system | Reuse KynWallet shared controls, BrandPanel, and design tokens; derive styling from the existing login composition. | ✅ |
| 8.7. Observability | The local-only form has no operational service to instrument. Do not add logs that could expose registration input. | ✅ |
| 9.2. Traceability | Name tests after acceptance scenarios/FRs and keep tasks mapped to US1–US4. | ✅ |
| 9.3–9.4. Review and controls | Run repository checks in `package.json`; code integration remains subject to independent review and the existing quality pipeline. | ✅ |
| 9.5. Planning verification | This plan records the checks against each relevant principle; no deviation is proposed. | ✅ |

**Gate result**: PASS. The spec explicitly limits registration to a local UI confirmation, so no credentials are sent or stored. No constitution exception or new dependency is required.

**Re-check after design**: The proposed domain/UI split, in-memory-only form state, existing UI kit, simple route switch, and accessible validation preserve the gate results. No database, API, external provider, or additional architecture layer is introduced.

## Architecture and Design

### Component Architecture

The existing `src/App.tsx` remains the route-selection boundary. Its current login composition (`LoginScreen` + `LoginForm`) remains intact at `/login` and at the root path. Registration is added as a separate feature, not embedded in login state:

- `RegisterScreen` composes the existing `BrandPanel` with a registration content area and `RegisterForm`.
- `RegisterForm` renders the heading, four labeled fields, terms acceptance, social buttons, inline/global notices, and login link. It delegates form state to `useRegistrationForm`.
- `useRegistrationForm` coordinates the form's reducer, touched/submit behavior, pure domain validation, and local success state. It performs no network or persistence operations.
- `registrationReducer` owns registration values, checkbox state, field errors, touched state, and form result state. On success, the view presents a confirmation and never includes the password.
- Existing `TextField`, `PasswordField`, `Checkbox`, `Button`, `Divider`, `SocialButton`, and `Alert` components are reused. Extend `Checkbox` only with optional description/error accessibility props needed to associate the required-terms error; existing login usage must remain unchanged.

### Routing

The project currently has no router: `App` renders the login screen regardless of URL. Keep routing proportionate to the two required paths by selecting the screen from `window.location.pathname` in `App`:

- `/register` renders `RegisterScreen`.
- `/login`, `/`, and any unrecognized path render the existing login screen, preserving current default behavior.
- The registration form uses a semantic anchor with `href="/login"`; navigation is a standard document navigation and the app resolves the path on load. No custom history management or route dependency is needed.
- Vite's development server serves the application entry for these paths. Production hosting must provide the equivalent SPA fallback to `index.html` for direct path visits and refreshes.

The registration path `/register` is chosen to pair with the explicitly required `/login` path and is the path used by `tasks.md` and route tests.

### Validation and Form State

`src/domain/registrationValidation.ts` provides a pure registration validator and error type. It may reuse `normalizeEmail` and `isValidEmail` from `src/domain/validation.ts` to keep email normalization/format behavior aligned with login.

- Full name is required after trimming surrounding whitespace; retain the entered display value for form presentation.
- Email is required and checked with the existing normalized email rule, including its 254-character limit; surrounding whitespace is ignored for validation.
- Password is required and must contain at least 8 characters. Do not trim it; spaces are part of the password. Do not impose additional composition rules or a maximum absent from the registration spec.
- Confirmation is required and must match the password exactly.
- Terms acceptance is required. When submit validation fails, expose a checkbox error and do not enter success state.
- Validate on blur for fields as specified and on submit for all fields. Once a field is touched or the form has been submitted, revalidate it on change; recompute confirmation when either password value changes.
- On an invalid submit, show all relevant messages and move focus to the first invalid control in visual order. Associate each message using `aria-describedby` and mark invalid controls with `aria-invalid`.
- Valid submission changes the local form state to success and presents a concise accessible status. No account is created, no form data is stored, and passwords are cleared/not displayed when the success view replaces the form.
- Social actions show the exact text «Próximamente» using the existing informational alert pattern and preserve field values.

The legal destination for terms is not specified in the feature input or repository evidence. Do not invent a URL: render the required acceptance text and leave the destination to product-provided content. This assumption should be revisited if a legal URL becomes available.

### Responsive Layout

The existing login design is mobile-first and uses a 960px desktop breakpoint, 1280px wide-desktop breakpoint, a 620px brand column at wide desktop, and a 400px maximum form width. The registration screen follows those established dimensions for visual consistency:

- Below 960px: show the registration form only; hide the entire BrandPanel, including its logo, because the registration spec explicitly requires only the form on mobile.
- From 960px: render brand and form as two panels using the existing desktop grid proportions.
- From 1280px: use the established 620px brand column.
- At widths below 480px: use 16px horizontal form padding, retaining the project's mobile spacing convention.
- Keep controls and error messages within the viewport at 320px and allow vertical scrolling for the longer form; prohibit horizontal overflow.

### Test Strategy

Use the current Vitest/Testing Library setup and TDD. Test validation and reducer state in isolation, then user-observable form submission, errors, focus, social notices, navigation, success, and accessibility. Re-run existing login tests to ensure shared Checkbox changes and route selection do not regress login. Use targeted responsive assertions where possible and manually inspect the 320px/mobile and desktop breakpoints via the development server.

## Project Structure

### Documentation (this feature)

```text
specs/registro/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-register.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── App.tsx
├── App.test.tsx
├── domain/
│   ├── validation.ts
│   ├── registrationValidation.ts
│   └── registrationValidation.test.ts
├── ui/
│   ├── components/
│   │   └── Checkbox/
│   │       ├── Checkbox.tsx
│   │       ├── Checkbox.module.css
│   │       └── Checkbox.test.tsx
│   ├── features/
│   │   ├── login/                  # Existing login feature, preserved
│   │   └── register/
│   │       ├── RegisterScreen.tsx
│   │       ├── RegisterScreen.module.css
│   │       ├── RegisterScreen.test.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── RegisterForm.module.css
│   │       ├── RegisterForm.test.tsx
│   │       ├── RegisterFormValidation.test.tsx
│   │       ├── RegisterFormSocialNavigation.test.tsx
│   │       ├── registrationReducer.ts
│   │       ├── registrationReducer.test.ts
│   │       └── useRegistrationForm.ts
│   ├── layout/
│   │   └── BrandPanel/             # Existing shared brand panel
│   └── styles/                     # Existing global tokens and styles
└── test/                           # Existing test setup and a11y helper
```

**Structure Decision**: Keep the current single frontend project and Clean Architecture layering. Registration-specific rules live in `domain`, while reducer/hook and components live in `ui/features/register`. Shared visual elements remain in the existing component and layout directories. No `application` registration service is introduced because the approved scope ends at local validation and a local success view.

## Complexity Tracking

No constitution violations or architecture exceptions are proposed. A route switch rather than a routing package keeps the implementation proportional to two paths; standard anchor navigation relies on SPA fallback in production hosting.
