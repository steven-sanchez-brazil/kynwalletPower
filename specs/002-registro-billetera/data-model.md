# Data Model: Pantalla de Registro de KynWallet

**Feature**: `002-registro-billetera` | Nada se persiste; todo vive en memoria.

## Entidades de dominio (`src/domain/registration.ts`)

### RegistrationRequest

| Campo | Tipo | Regla de validación | Spec |
|---|---|---|---|
| `fullName` | string | obligatorio; tras `trim` y colapsar espacios: 2–100 caracteres, solo letras (con tildes/ñ), espacios, `'` y `-` | FR-003 |
| `email` | string | obligatorio; formato válido; ≤ 254 (normalizado: trim + minúsculas) | FR-004 |
| `password` | string | obligatoria; 8–128; ≥ 1 letra y ≥ 1 dígito; sin recortar | FR-005 |
| `confirmPassword` | string | obligatoria; idéntica a `password` | FR-006 |
| `acceptedTerms` | boolean | debe ser `true` | FR-007 |

`validateRegistration(request): RegistrationErrors` devuelve `Partial<Record<campo, mensaje>>`;
`{}` = válido. Mensajes en `domain/messages.ts` (fuente única).

### RegistrationResult

```ts
type RegistrationResult =
  | { kind: 'created'; displayName: string }   // nombre normalizado para la bienvenida
  | { kind: 'invalid'; errors: RegistrationErrors } // el caso de uso revalida antes de delegar
  | { kind: 'rejected' }                       // correo ya existente en la demo
  | { kind: 'unavailable' };                   // configuración ausente o fallo inesperado
```

### DemoAccount (existente, 001)

`{ email, password, displayName }` — se usa solo para detectar correos duplicados.

## Estado de la UI (`registerReducer`)

```text
RegisterState {
  status: 'editing' | 'submitting' | 'failure' | 'registered'
  values: { fullName, email, password, confirmPassword }
  acceptedTerms: boolean
  touched: Record<campo, boolean>
  fieldErrors: RegistrationErrors            // solo los visibles
  failure: 'rejected' | 'unavailable' | null
  notice: string | null                      // "Función no disponible…" o "Próximamente"
}
```

*Revisado 2026-10-15 (b)*: se eliminan `welcomeName`, el estado `welcome` y el evento `reset`
(ya no hay vista de bienvenida). `registered` mantiene el envío deshabilitado mientras la vista
redirige a `/login`; la redirección la hace la página, no el reducer.

### Transiciones

| Desde | Evento | Hacia | Efecto |
|---|---|---|---|
| editing | `change` / `blur` | editing | actualiza valores y errores visibles; limpia `failure`; revalida confirmación al cambiar contraseña |
| editing | `submit` con errores | editing | marca todo como tocado; foco al primer campo con error |
| editing | `submit` válido | submitting | deshabilita el envío |
| submitting | `result: created` | registered | la página redirige a `/login` con `{ registered: true }` |
| submitting | `result: rejected/unavailable` | failure | conserva nombre, correo y términos; vacía contraseñas; foco al correo |
| failure | `change` | editing | oculta el mensaje de error |
| cualquiera | `showNotice` | (igual) | muestra el aviso informativo sin perder datos |

Reglas: estando en `submitting` se ignoran `submit` adicionales (edge case de doble clic).
