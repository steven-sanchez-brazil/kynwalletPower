# Contrato: Puerto de registro

**Feature**: `002-registro-billetera` | Cubre FR-010, FR-013, FR-014, FR-015

## Puerto (`src/application/ports/RegistrationGateway.ts`)

```ts
interface RegistrationGateway {
  register(request: { fullName: string; email: string; password: string }): Promise<RegistrationResult>;
}
```

- `confirmPassword` y `acceptedTerms` se validan antes y no llegan al puerto.
- Nunca rechaza la promesa hacia la UI: los fallos se expresan como `{ kind: 'unavailable' }`.

## Caso de uso (`src/application/register.ts`)

`createRegister(gateway): (request: RegistrationRequest) => Promise<RegistrationResult>`

1. Ejecuta `validateRegistration`; si hay errores, no llama al gateway y devuelve
   `{ kind: 'invalid', errors }` (la regla de negocio vive en el dominio, no en la UI; 3.3).
2. Normaliza: `fullName` (trim + colapso de espacios), `email` (trim + minúsculas).
3. Delega en el gateway; cualquier excepción → `{ kind: 'unavailable' }`.

## Adaptador (`src/infrastructure/InMemoryRegistrationGateway.ts`)

| Entrada | Salida |
|---|---|
| cuentas = `null` (configuración ausente/ inválida) | `unavailable` |
| correo coincide (normalizado) con una cuenta de demostración | `rejected` |
| cualquier otro | `created` con `displayName = fullName` |

- Espera `delayMs` (1000 por defecto, inyectable) antes de responder.
- No almacena la solicitud ni la contraseña; no escribe en consola ni en almacenamiento.
- Las cuentas provienen de `loadDemoAccounts(import.meta.env.VITE_DEMO_USERS)` (formato en
  `001-login-billetera/contracts/auth-gateway.md`).
