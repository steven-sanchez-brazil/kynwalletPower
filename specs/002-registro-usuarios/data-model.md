# Data Model: Pantalla de Registro de Usuarios de KynWallet

**Feature**: `002-registro-usuarios` | **Date**: 2026-10-15

Todas las entidades residen en memoria durante la sesión del navegador (sin persistencia en disco ni almacenamiento local del navegador, en cumplimiento de FR-011 y la Constitución 5.3/5.4).

## 1. RegistrationData (dominio, objeto de valor de entrada)

Representa los datos capturados en el formulario de registro antes de crear la cuenta (`Solicitud de Registro`).

| Campo | Tipo | Normalización | Reglas de validación (FR-002, FR-003, FR-004) | Mensaje de error inline |
|---|---|---|---|---|
| `fullName` | `string` | `trim()` | Vacío tras `trim()` o `< 2` caracteres | `"Ingresa tu nombre completo"` |
| | | | `> 120` caracteres tras `trim()` | `"El nombre no puede superar 120 caracteres"` |
| `email` | `string` | `trim().toLowerCase()` | Vacío tras `trim()` | `"Ingresa tu correo electrónico"` |
| | | | Formato inválido (`^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`) o `> 254` caracteres | `"Ingresa un correo electrónico válido"` |
| `password` | `string` | Sin recortar | Vacío (`""`) | `"Ingresa tu contraseña"` |
| | | | `< 8` caracteres | `"La contraseña debe tener al menos 8 caracteres"` |
| | | | `> 128` caracteres | `"La contraseña no puede superar 128 caracteres"` |
| `confirmPassword` | `string` | Sin recortar | Vacío (`""`) | `"Confirma tu contraseña"` |
| | | | `confirmPassword !== password` | `"Las contraseñas no coinciden"` |
| `termsAccepted` | `boolean` | — | `false` | `"Debes aceptar los términos y condiciones"` |

- `RegistrationField`: `'fullName' | 'email' | 'password' | 'confirmPassword' | 'termsAccepted'`
- `RegistrationErrors`: `Partial<Record<RegistrationField, string>>`
- `validateRegistration(data: RegistrationData): RegistrationErrors`: función pura en `src/domain/validation.ts`; devuelve `{}` cuando todos los campos son válidos.

## 2. RegisterAccountInput y RegisterResult (dominio / caso de uso)

Datos enviados al puerto `AuthGateway.register` una vez superada la validación de integridad:

```ts
export type RegisterAccountInput = {
  fullName: string;
  email: string;
  password: string;
};

export type RegisterResult =
  | { kind: 'success'; displayName: string }
  | { kind: 'email-already-exists' }
  | { kind: 'unavailable' };
```

| Variante | Condición de disparo | Mensaje observable en UI |
|---|---|---|
| `success` | Correo no registrado previamente; la cuenta se añade al almacén en memoria | `"¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…"` |
| `email-already-exists` | El correo normalizado ya pertenece a una cuenta en memoria | `"No fue posible crear la cuenta con este correo electrónico."` |
| `unavailable` | Almacén no disponible (`accounts === null`) o error inesperado | `"Servicio de registro no disponible. Intenta más tarde."` |

## 3. DemoAccount (dominio, entidad compartida en memoria)

Al registrarse con éxito, se agrega una nueva instancia de `DemoAccount` al almacén en memoria de `InMemoryAuthGateway`:

| Campo | Tipo | Origen en Registro |
|---|---|---|
| `email` | `string` | `normalizeEmail(input.email)` (único en el almacén) |
| `password` | `string` | `input.password` (exacto, solo en memoria de sesión) |
| `displayName` | `string` | `input.fullName.trim()` (mostrado en `WelcomeView` tras iniciar sesión en `/login`) |

## 4. RegisterFormState (UI, máquina de estados)

```text
               submit (con errores)
           ┌──────────────────────────┐
           ▼                          │
  ┌──────────────┐  submit (válido)  ┌┴─────────────┐
  │    editing   │──────────────────▶│  submitting  │
  └──────────────┘                   └──────┬───────┘
    ▲  ▲                                    │
    │  │             result: success        ├────────────────────────┐
    │  │                                    ▼                        ▼
    │  │                            ┌───────────────┐        ┌───────────────┐
    │  │                            │    success    │        │ registerError │
    │  │                            │ (alerta 1.5s) │        │  (mensaje)    │
    │  │                            └───────┬───────┘        └───────┬───────┘
    │  │                                    │                        │
    │  │                        redirect    ▼                        │
    │  │                              [ /login ]                     │
    │  └──────────────────────── edición de cualquier campo ─────────┘
```

| Propiedad | Tipo | Descripción |
|---|---|---|
| `status` | `'editing' \| 'submitting' \| 'registerError' \| 'success'` | Estado actual del formulario |
| `values` | `RegistrationData` | Valores actuales (`fullName`, `email`, `password`, `confirmPassword`, `termsAccepted`) |
| `touched` | `Record<RegistrationField, boolean>` | Campos ya visitados (`blur`) o evaluados en `submit` |
| `fieldErrors` | `RegistrationErrors` | Errores inline visibles para los campos en `touched` |
| `registerError` | `'email-already-exists' \| 'unavailable' \| null` | Error global devuelto por el caso de uso |
| `notice` | `string \| null` | Aviso informativo (`"Próximamente"` al pulsar Google o Apple, FR-007) |

**Reglas de transición clave**:
1. **`blur(field)`**: marca `touched[field] = true` y actualiza `fieldErrors` solo para los campos tocados.
2. **`change(field, value)`**: actualiza `values[field]`, limpia `registerError` si estaba en `'registerError'` y recalcula `fieldErrors` para todos los campos ya marcados como `touched` (de modo que si cambia `password` y `confirmPassword` ya fue tocado, se actualiza inmediatamente la validación de coincidencia).
3. **`submit`**: si `status === 'submitting'` o `status === 'success'`, se ignora. En caso contrario, marca los 5 campos como `touched = true` y calcula `fieldErrors`. Si existen errores, permanece en `'editing'`; si no hay errores, pasa a `'submitting'`.
4. **`result` con `email-already-exists` o `unavailable`**: pasa a `'registerError'`, conserva `fullName` y `email`, limpia `password` y `confirmPassword`, y coloca el foco en el campo `email`.
5. **`result` con `success`**: pasa a `'success'`, muestra la alerta de éxito, mantiene el botón `"Crear cuenta"` deshabilitado y tras `1500 ms` ejecuta la redirección automática a `/login`.
