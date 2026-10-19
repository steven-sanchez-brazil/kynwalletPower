# Data Model: Registro de Usuarios

## RegistrationForm (dominio, `src/domain/registration.ts`)

| Campo | Tipo | Regla (FR) | Mensaje si falla |
|---|---|---|---|
| `fullName` | string | obligatorio tras trim (FR-004) | "Ingresa tu nombre completo" |
| | | 2–80 caracteres y solo letras, espacios, `'`, `.`, `-` | "Ingresa un nombre válido (solo letras y espacios)" |
| `email` | string | obligatorio (FR-005) | "Ingresa tu correo electrónico" |
| | | formato válido y ≤ 254 | "Ingresa un correo electrónico válido" |
| `password` | string | obligatorio (FR-006) | "Ingresa tu contraseña" |
| | | ≥ 8 | "La contraseña debe tener al menos 8 caracteres" |
| | | ≤ 128 | "La contraseña no puede superar 128 caracteres" |
| `confirmPassword` | string | obligatorio (FR-007) | "Confirma tu contraseña" |
| | | igual a `password` | "Las contraseñas no coinciden" |
| `acceptedTerms` | boolean | `true` (FR-008) | "Debes aceptar los términos y condiciones" |

`validateRegistration(form)` devuelve `Partial<Record<keyof RegistrationForm, string>>`; `{}` si
es válido. Las reglas de correo y contraseña son las de `validation.ts` (fuente única).

## RegistrationResult

```ts
type RegistrationResult = { kind: 'success' } | { kind: 'email-taken' } | { kind: 'unavailable' };
```

## Cuenta creada

Es un `DemoAccount` de 001: `{ email: normalizeEmail(email), password, displayName:
normalizeFullName(fullName) }`. La contraseña se guarda tal cual (sin recortar).

## RegisterFormState (UI, `registerReducer.ts`)

| Campo | Descripción |
|---|---|
| `status` | `editing` → `submitting` → `registered` \| `submitError` |
| `values` | `RegistrationForm` |
| `touched` | por campo; se marca en `blur`, al cambiar la casilla y en `submit` |
| `fieldErrors` | errores de campos tocados (FR-009) |
| `submitError` | `email-taken` \| `unavailable` \| `null` |

Transiciones:

- `change` actualiza el valor, recalcula errores de campos tocados y, si había `submitError`,
  vuelve a `editing` sin mensaje.
- `blur` marca el campo y recalcula.
- `submit` marca todo; con errores queda en `editing`, sin errores pasa a `submitting`; en
  `submitting` se ignora.
- `result` success → `registered`; si no, `submitError` y vacía `password` y `confirmPassword`.
