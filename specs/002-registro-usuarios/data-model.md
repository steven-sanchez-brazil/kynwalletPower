# Data Model: Registro de usuarios

**Feature**: `002-registro-usuarios` | **Date**: 2026-10-19

No existe persistencia. Todo vive en memoria hasta corregir, abandonar o completar el flujo.

## RegistrationValues

| Campo | Regla |
|---|---|
| `fullName` | Crudo en UI; `trim()` para validar 1–80; espacios internos admitidos. |
| `email` | Crudo en UI; `trim().toLowerCase()`; obligatorio, válido, ≤254. |
| `password` | Obligatorio, 8–128; nunca recortar/normalizar. |
| `passwordConfirmation` | Obligatorio; igualdad exacta. |
| `acceptedTerms` | Debe ser `true`; no se persiste consentimiento. |

Contraseñas nunca salen del formulario; el simulador no recibe campos. Al navegar, todo se descarta.

## Errores

`RegistrationField = fullName | email | password | passwordConfirmation | acceptedTerms`.
`RegistrationErrors` mapea parcialmente campo a código:

| Código | Mensaje exacto |
|---|---|
| NAME_REQUIRED | Ingresa tu nombre completo |
| NAME_LENGTH | El nombre debe tener entre 1 y 80 caracteres |
| EMAIL_REQUIRED | Ingresa tu correo electrónico |
| EMAIL_INVALID | Ingresa un correo electrónico válido |
| EMAIL_TOO_LONG | El correo no puede superar 254 caracteres |
| PASSWORD_REQUIRED | Ingresa tu contraseña |
| PASSWORD_TOO_SHORT | La contraseña debe tener al menos 8 caracteres |
| PASSWORD_TOO_LONG | La contraseña no puede superar 128 caracteres |
| CONFIRMATION_REQUIRED | Confirma tu contraseña |
| PASSWORD_MISMATCH | Las contraseñas no coinciden |
| TERMS_REQUIRED | Debes aceptar los términos y condiciones |

## RegistrationResult

`success | unavailable`. No contiene PII, causa interna ni identificador. Throw → unavailable.

## RegistrationFormState

| Campo | Tipo / propósito |
|---|---|
| `status` | `editing | submitting | submitError` |
| `values` | Valores crudos, solo memoria |
| `touched` | Mapa de campos visitados |
| `fieldErrors` | Un error vigente por campo |
| `notice` | `null | comingSoon | termsUnavailable` |
| `submitError` | `null | unavailable` |

Visibilidad permanece local en cada PasswordField.

## Transiciones

```text
editing -- blur/cambio --> editing (validación incremental)
editing -- submit inválido --> editing + touched + foco primer inválido
editing -- submit válido --> submitting
submitting -- submit repetido --> submitting (sin otra llamada)
submitting -- unavailable --> submitError
submitError -- cambio/reintento --> editing/submitting
submitting -- success --> limpiar + /login con flash fijo
cualquier estado -- navegación --> desmontar + descartar
```

Cambiar password recalcula confirmación solo si fue tocada. Corregir un campo no borra errores
ajenos. Avisos no alteran valores ni envío.

## Relaciones

- El caso de uso recibe valores, valida y llama una vez al simulator sin datos.
- Success origina flash/navegación; unavailable origina mensaje genérico.
- Telemetry solo observa evento y duración, nunca valores.
