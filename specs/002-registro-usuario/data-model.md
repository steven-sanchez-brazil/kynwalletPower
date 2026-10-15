# Data Model: Registro de Usuarios de KynWallet

**Feature**: `002-registro-usuario` | **Date**: 2026-10-15

No hay persistencia: las cuentas creadas viven en memoria con las de demostración (research R3).

## RegistrationData (dominio, valor)

Datos del formulario.

| Campo | Tipo | Regla (FR) | Mensaje |
|---|---|---|---|
| `fullName` | string | Vacío tras trim (FR-003) | "Ingresa tu nombre completo" |
| | | > 80 caracteres tras trim | "El nombre no puede superar 80 caracteres" |
| `email` | string | Reglas de 001 (FR-004) | "Ingresa tu correo electrónico" / "Ingresa un correo electrónico válido" |
| `password` | string | Reglas de 001 (FR-005) | "Ingresa tu contraseña" / "La contraseña debe tener al menos 8 caracteres" / "La contraseña no puede superar 128 caracteres" |
| `confirmPassword` | string | Vacío (FR-006) | "Confirma tu contraseña" |
| | | Distinta de `password` | "Las contraseñas no coinciden" |
| `acceptTerms` | boolean | `false` (FR-007) | "Debes aceptar los términos y condiciones" |

`validateRegistration(data) → RegistrationErrors` es pura; `{}` significa válido. La contraseña y
la confirmación no se recortan.

## RegistrationResult (dominio, unión discriminada)

| Variante | Origen | Mensaje en UI |
|---|---|---|
| `success` | Cuenta agregada | Navega a `/login` con "Cuenta creada correctamente. Ya puedes iniciar sesión." |
| `email-taken` | El correo ya existe (sin distinguir mayúsculas) | "Ya existe una cuenta con este correo" en el campo de correo |
| `unavailable` | Configuración ausente o excepción | "No pudimos crear tu cuenta. Intenta más tarde." |

## DemoAccount (de 001)

La cuenta nueva se arma así: `email` = correo normalizado; `password` = contraseña sin cambios;
`displayName` = nombre completo sin espacios periféricos.

## RegisterFormState (UI, `registerReducer`)

| Campo | Tipo | Descripción |
|---|---|---|
| `status` | `'editing' \| 'submitting'` | `submitting` bloquea envíos duplicados |
| `values` | `RegistrationData` | Valores actuales |
| `touched` | Record de campo → boolean | Campos cuyo error ya se muestra |
| `fieldErrors` | `RegistrationErrors` | Errores visibles (solo campos tocados) |
| `emailTaken` | boolean | Error del servidor simulado; se borra al cambiar el correo |
| `failure` | boolean | Muestra el error inesperado |

**Transiciones**:

| Acción | Efecto |
|---|---|
| `change(campo, valor)` | Actualiza el valor y recalcula los errores visibles; si es el correo, borra `emailTaken`; borra `failure` |
| `blur(campo)` | Marca el campo como tocado si tiene contenido o ya mostraba error (research R5) |
| `submit` | Marca todo como tocado; sin errores → `submitting`; con errores → `editing` |
| `result(email-taken)` | `editing` + `emailTaken` |
| `result(unavailable)` | `editing` + `failure` |
| `result(success)` | Sin cambio de estado: la vista navega a `/login` |

## Route (UI, `router.ts`)

| Ruta | Pantalla | Título de pestaña |
|---|---|---|
| `/login` | Inicio de sesión (001) | "KynWallet · Iniciar sesión" |
| `/registro` | Registro | "KynWallet · Crear cuenta" |
| cualquier otra | Redirige a `/login` (`replaceState`) | — |
