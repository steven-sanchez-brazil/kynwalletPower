# Quickstart: Validación del Registro de Usuarios

## Prerequisites

- Node.js 20 or later.
- Dependencies already installed using the repository lockfile.

## Run the application

From the repository root:

```powershell
npm run dev
```

Open the Vite URL and navigate to `/register`. Verify `/login` and `/` still show the login screen.

## Automated checks

Run focused registration and existing login tests:

```powershell
npm test -- --run src/domain/registrationValidation.test.ts src/ui/features/register src/ui/components/Checkbox/Checkbox.test.tsx src/App.test.tsx src/ui/features/login
```

Run the repository quality checks when the feature is complete:

```powershell
npm run lint
npm run format
npm run typecheck
npm test -- --coverage
npm run build
```

## Manual scenarios

1. Submit an empty form. Confirm required errors appear and success is not shown.
2. Enter a malformed email, a password shorter than 8 characters, and a nonmatching confirmation. Submit and confirm each inline error is associated with its field and focus moves to the first invalid control.
3. Correct each value. Confirm its own error clears; change the password after confirmation and verify mismatch is reported.
4. Complete all fields validly but leave terms unchecked. Submit and confirm registration remains blocked with an associated terms error.
5. Accept terms and submit valid values. Confirm an accessible success message appears and contains no password.
6. Activate Google and Apple. Confirm each shows the exact notice «Próximamente» and preserves entered values.
7. Activate «Iniciar sesión». Confirm navigation reaches `/login`.
8. At desktop width, confirm both brand and form panels are visible. Below 960px, confirm only the form is visible. At 320px, check all controls and errors with no horizontal scrolling.

See [data-model.md](./data-model.md) for field semantics and [contracts/ui-register.md](./contracts/ui-register.md) for observable UI behavior.
