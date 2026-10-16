# Data Model: Pantalla de Registro de Usuarios

## RegistrationData (dominio)

Datos ingresados en el formulario.

| Campo | Tipo | Regla (FR) | Mensaje |
|---|---|---|---|
| `fullName` | string | obligatorio sin espacios periféricos; ≤ 80 caracteres (FR-003) | "Ingresa tu nombre completo" / "El nombre no puede superar 80 caracteres" |
| `email` | string | mismas reglas que login: obligatorio, formato, ≤ 254 (FR-004) | "Ingresa tu correo electrónico" / "Ingresa un correo electrónico válido" |
| `password` | string | mismas reglas que login: obligatoria, 8–128, sin recortar (FR-005) | "Ingresa tu contraseña" / "La contraseña debe tener al menos 8 caracteres" / "La contraseña no puede superar 128 caracteres" |
| `passwordConfirmation` | string | obligatoria; igual a `password` (FR-006) | "Confirma tu contraseña" / "Las contraseñas no coinciden" |
| `acceptedTerms` | boolean | debe ser `true` (FR-007) | "Debes aceptar los términos y condiciones" |

`validateRegistration(data): RegistrationErrors` devuelve un objeto parcial con un mensaje por
campo inválido, o `{}` si todo es válido. Orden de foco ante errores: `fullName`, `email`,
`password`, `passwordConfirmation`, `acceptedTerms`.

## Account / DemoAccount (dominio, existente)

`{ email, password, displayName }`. Al registrar: `email` normalizado (minúsculas, sin espacios
periféricos), `displayName` = `fullName` recortado, `password` tal cual.

## RegisterResult (dominio)

```text
{ kind: 'success' } | { kind: 'email-taken' } | { kind: 'unavailable' }
```

## RegisterFormState (UI)

| Campo | Descripción |
|---|---|
| `status` | `editing` → `submitting` → (`editing` con error) o `registered` |
| `values` | valores de los cuatro campos de texto y `acceptedTerms` |
| `touched` | campos que el usuario ya abandonó o que se intentaron enviar |
| `fieldErrors` | errores visibles: solo de campos tocados (FR-008) |
| `submitError` | `email-taken` (se muestra en el campo de correo) o `unavailable` (alerta global) |

Transiciones:

```text
editing --submit válido--> submitting --success--> registered (App navega a /login)
editing --submit inválido--> editing (todos los campos tocados, foco al primer error)
submitting --email-taken--> editing (error en correo, foco al correo)
submitting --unavailable--> editing (alerta global)
cualquier cambio de valor --> limpia submitError y recalcula errores visibles
```

## Navegación (UI)

| Ruta | Pantalla |
|---|---|
| `/login` | inicio de sesión (con mensaje de éxito si se acaba de registrar) |
| `/registro` | registro |
| `/` u otra | redirección (`replace`) a `/login` |
