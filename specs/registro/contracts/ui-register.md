# UI Contract: Registro de Usuarios

## Entry and Navigation

- Path `/register` renders the registration screen.
- Path `/login` renders the existing login screen.
- Root `/` and unrecognized paths preserve the current login-screen default.
- The registration screen provides a semantic link to `/login`.
- Direct visits and refreshes on supported paths require the host to serve the SPA entry document.

## Form Controls

The registration view exposes required, visibly labeled controls in this order:

1. Nombre completo
2. Correo electrónico
3. Contraseña
4. Confirmar contraseña
5. Acceptance checkbox for términos y condiciones
6. Primary registration submit action

Google and Apple controls are secondary actions and do not authenticate or navigate externally.

## Validation and Result Behavior

- Email is required and must have a valid format; leading/trailing whitespace is ignored for validation.
- Password is required and at least 8 characters; whitespace is preserved.
- Confirmation is required and exactly matches the password.
- Terms acceptance is required.
- Blur displays field-level errors where applicable; submit validates every field.
- Errors are programmatically associated with invalid controls and use `aria-invalid`.
- Submit focuses the first invalid control in visual order.
- Correcting a value clears or updates its own error; confirmation is revalidated when password changes.
- Valid submit presents an accessible success confirmation; no password is included in the confirmation.
- Google and Apple show an accessible alert with exact text «Próximamente» and preserve form values.

## Responsive and Accessibility Behavior

- Desktop: two panels, brand and form.
- Mobile below the existing 960px breakpoint: form only; no brand panel.
- Widths from 320px upward: no horizontal overflow; vertical scrolling is permitted.
- Controls are operable by keyboard, have visible focus, and expose associated labels and validation feedback to assistive technology.
