# Data Model: Registro

Todo el estado es en memoria; nada se persiste. Los tipos nuevos conviven con los de
`src/domain/auth.ts` de 001 (`DemoAccount`, `LoginCredentials`, `AuthResult`).

## RegistrationData (dominio)

Datos que el caso de uso envía al puerto. **No incluye la confirmación de contraseña** (es solo
de validación en el formulario).

| Campo | Tipo | Regla |
|---|---|---|
| `name` | string | Obligatorio tras recortar espacios; 1–100 caracteres (FR-004) |
| `email` | string | Obligatorio; formato válido; ≤ 254; se normaliza (recorte y minúsculas) (FR-005) |
| `password` | string | Obligatoria; 8–128 caracteres; **no se recorta** (FR-006) |

## RegistrationFormValues (UI)

`RegistrationData` + `confirmPassword: string` + `acceptedTerms: boolean`.

| Campo | Regla |
|---|---|
| `confirmPassword` | Obligatoria; idéntica a `password`, sin recortar (FR-007) |
| `acceptedTerms` | Debe ser `true` (FR-008) |

## RegistrationResult (dominio)

```text
{ kind: 'success'; displayName: string }
| { kind: 'email-taken' }
| { kind: 'unavailable' }
```

`displayName` es el nombre recortado que ingresó la persona; solo se usa en el mensaje de éxito
que se muestra en `/login`. El resultado **nunca** contiene contraseñas (FR-016).

## Validación (`validateRegistration`)

Devuelve `Partial<Record<'name' | 'email' | 'password' | 'confirmPassword' | 'terms', string>>`
con el mensaje de cada campo inválido; `{}` si todo es válido.

| Campo | Condición | Mensaje (`messages.ts`) |
|---|---|---|
| `name` | vacío tras recortar | `NAME_REQUIRED`: "Ingresa tu nombre completo" |
| `name` | > 100 caracteres | `NAME_TOO_LONG`: "El nombre no puede superar 100 caracteres" |
| `email` | vacío | `EMAIL_REQUIRED` (existente) |
| `email` | formato inválido o > 254 | `EMAIL_INVALID` (existente) |
| `password` | vacía | `PASSWORD_CREATE_REQUIRED`: "Crea una contraseña" |
| `password` | < 8 | `PASSWORD_TOO_SHORT` (existente) |
| `password` | > 128 | `PASSWORD_TOO_LONG` (existente) |
| `confirmPassword` | vacía | `CONFIRM_REQUIRED`: "Confirma tu contraseña" |
| `confirmPassword` | distinta de `password` | `PASSWORD_MISMATCH`: "Las contraseñas no coinciden" |
| `terms` | no aceptada | `TERMS_REQUIRED`: "Debes aceptar los términos y condiciones" |

Mensajes de resultado nuevos: `EMAIL_TAKEN` = "Ya existe una cuenta con este correo";
`REGISTER_UNAVAILABLE` = "Servicio de registro no disponible. Intenta más tarde."; `COMING_SOON` =
"Próximamente" (texto del `alert` de Google y Apple); `REGISTER_SUCCESS(nombre)` = "¡Cuenta creada,
{nombre}! Ahora puedes iniciar sesión.". El aviso `FEATURE_UNAVAILABLE` ya existe (se usa para el
enlace de términos).

## RegisterFormState (UI, `registerReducer`)

```text
status: 'editing' | 'submitting' | 'registerError' | 'success'
values: RegistrationFormValues
touched: Record<campo, boolean>
fieldErrors: errores visibles (solo de campos tocados, salvo al enviar)
serviceError: 'email-taken' | 'unavailable' | null
createdName: string | null
notice: string | null
```

## Ruta (UI)

`Route = '/login' | '/registro'`. Cualquier otra dirección se normaliza a `/login`. El mensaje de
éxito (`string | null`) vive en el estado de `App`, se pasa al login y se descarta al interactuar con
el login o al navegar.

### Transiciones

| Estado | Evento | Siguiente |
|---|---|---|
| `editing` | `change` / `blur` | `editing` (recalcula errores visibles; al cambiar `password`, reevalúa la coincidencia) |
| `editing` | `submit` con errores | `editing` (todos los campos pasan a tocados; se muestran los errores) |
| `editing` | `submit` válido | `submitting` |
| `submitting` | `submit` | `submitting` (se ignora: un solo intento, FR-012) |
| `submitting` | `result: success` | `success` (guarda `createdName`) |
| `submitting` | `result: email-taken` | `registerError`: el error se asocia al campo de correo; se vacían contraseña y confirmación |
| `submitting` | `result: unavailable` | `registerError`: se muestra `REGISTER_UNAVAILABLE`; se vacían contraseña y confirmación |
| `registerError` | `change` | `editing` (se limpia el error de servicio) |
| `success` | — | terminal: el formulario avisa con `onRegistered(createdName)` y `App` navega a `/login`; el estado se descarta al desmontar |

El mensaje `email-taken` se limpia al modificar el correo (US3-2).

## Cuenta de demostración

Sin cambios: se reutiliza `DemoAccount` y `loadDemoAccounts` de 001. El registro solo consulta
los correos; nunca agrega cuentas.
