# Data Model: Pantalla de Registro de KynWallet

**Feature**: `002-registro-billetera` | **Date**: 2026-10-17

Define las entidades del dominio, reglas de validación en línea, estructura de persistencia en `localStorage` y la máquina de estados del formulario de registro.

## 1. RegistrationInput (dominio, valor en memoria)

Datos ingresados por el usuario en el formulario de registro antes de su persistencia.

| Campo | Tipo | Reglas de validación (FR-002 a FR-007) | Mensaje de error inline |
|---|---|---|---|
| `fullName` | `string` | Vacío tras `trim()` | `"Ingresa tus nombres completos"` |
| | | Longitud tras `trim()` > 80 caracteres | `"Los nombres completos no pueden superar 80 caracteres"` |
| `email` | `string` | Vacío tras `trim()` | `"Ingresa tu correo electrónico"` |
| | | No cumple `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` o > 254 caracteres | `"Ingresa un correo electrónico válido"` |
| `password` | `string` | Vacío | `"Ingresa tu contraseña"` |
| | | < 8 caracteres, o no incluye al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial | `"La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial"` |
| | | > 128 caracteres | `"La contraseña no puede superar 128 caracteres"` |
| `confirmPassword` | `string` | Vacío | `"Confirma tu contraseña"` |
| | | No coincide exactamente con `password` (`!==`) | `"Las contraseñas no coinciden"` |
| | | No cumple seguridad alta (cuando `password` también es inválida) | `"La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial"` |
| `acceptedTerms` | `boolean` | `false` | Deshabilita el botón `"Crear Cuenta"` (FR-007); si se intenta forzar el envío: `"Debes aceptar los términos y condiciones"` |

`validateRegistration(input: RegistrationInput) → RegistrationFieldErrors` es una función pura en `src/domain/validation.ts`; devuelve `{}` únicamente cuando todos los campos son válidos y `acceptedTerms === true`.

## 2. RegisteredUserRecord (dominio / persistencia en `localStorage`)

Registro persistido bajo la clave `kynwallet.registeredUsers` en `window.localStorage` (ver [research.md R5](./research.md#r5-persistencia-en-localstorage-y-seguridad-por-diseño-constitución-53-y-54)).

| Campo | Tipo | Reglas e invariantes |
|---|---|---|
| `email` | `string` | Identificador único normalizado (`trim()` + minúsculas), formato de correo válido, ≤ 254 caracteres |
| `displayName` | `string` | `fullName.trim()`, 1–80 caracteres; se emplea en la vista de bienvenida tras iniciar sesión |
| `passwordDigest` | `string` | Resumen criptográfico `SHA-256` en hexadecimal (`sha256("${email}:${password}")`); **nunca** contiene la contraseña en texto plano (FR-011, SC-006) |
| `acceptedTerms` | `true` | Siempre `true` para registros completados |
| `createdAt` | `string` | Fecha y hora en formato ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`) |

**Invariantes del conjunto almacenado**:
- No pueden existir dos registros con el mismo `email` normalizado, ni coincidir con el `email` de una cuenta de demostración (`VITE_DEMO_USERS`).
- Si el contenido previo de `localStorage` bajo `kynwallet.registeredUsers` está corrupto (JSON inválido), se trata de forma segura sin lanzar excepciones no controladas.

## 3. RegistrationResult (dominio, unión discriminada)

Resultado devuelto por el puerto `UserRegistrationGateway` y el caso de uso `registerUser`:

| Variante | Datos | Origen |
|---|---|---|
| `{ kind: 'success' }` | — | Usuario validado y almacenado en `localStorage` |
| `{ kind: 'email-already-exists' }` | — | El correo normalizado ya existe en `localStorage` o en las cuentas de demostración (FR-009) |
| `{ kind: 'storage-error' }` | — | Excepción al leer/escribir en `localStorage` (modo privado restringido, cuota llena, etc., FR-017) |

## 4. RegisterFormState (UI, máquina de estados)

```text
               submit (con errores de validación)
           ┌────────────────────────────────────┐
           ▼                                    │
  ┌─────────────────┐  submit (válido + terms) ┌┴───────────────┐
  │     editing     │─────────────────────────▶│   submitting   │
  └─────────────────┘                          └────────┬───────┘
    ▲      ▲                                   success  │  email-already-exists / storage-error
    │      │                         ┌──────────────────┤
    │      │                         ▼                  ▼
    │      │               ┌──────────────────┐  ┌──────────────────┐
    │      │               │   registered     │  │   submitError    │
    │      │               │ (redirige Login) │  │ (error visible)  │
    │      │               └──────────────────┘  └──────┬───────────┘
    │      └────────── edición de campo ────────────────┘
    └───────────────── mostrar / ocultar Toast ("Próximamente")
```

| Campo | Tipo | Descripción |
|---|---|---|
| `status` | `'editing' \| 'submitting' \| 'submitError' \| 'registered'` | Estado actual del formulario |
| `values` | `RegistrationInput` | Valores actuales (`fullName`, `email`, `password`, `confirmPassword`, `acceptedTerms`) |
| `touched` | `Record<'fullName' \| 'email' \| 'password' \| 'confirmPassword', boolean>` | Campos con los que el usuario ya interactuó |
| `fieldErrors` | `RegistrationFieldErrors` | Errores inline visibles por campo |
| `submitError` | `'storage-error' \| null` | Error global de almacenamiento (si `email-already-exists`, se asigna directamente a `fieldErrors.email`) |
| `toastMessage` | `string \| null` | Mensaje del Toast activo (`"Próximamente"` al pulsar Google o Apple, FR-013) |
