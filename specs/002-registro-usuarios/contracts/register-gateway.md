# Contract: AuthGateway — Registro y Autenticación en Memoria

Extensión del puerto `AuthGateway` (`src/application/ports/AuthGateway.ts`) para soportar tanto el inicio de sesión (`001-login-billetera`) como el registro de nuevas cuentas (`002-registro-usuarios`) sobre el mismo almacén en memoria de la sesión (Constitución 2.5 y 3.4).

```ts
// src/application/ports/AuthGateway.ts
import type {
  AuthResult,
  LoginCredentials,
  RegisterAccountInput,
  RegisterResult,
} from '@/domain/auth';

export interface AuthGateway {
  authenticate(credentials: LoginCredentials): Promise<AuthResult>;
  register?(input: RegisterAccountInput): Promise<RegisterResult>;
}
```

```ts
// src/application/registerAccount.ts
export type RegisterAccount = (input: RegisterAccountInput) => Promise<RegisterResult>;

export function createRegisterAccount(gateway: AuthGateway): RegisterAccount;
```

## Comportamiento obligatorio de `register(input)`

| # | Dado | Resultado esperado |Efecto en el almacén en memoria |
|---|---|---|---|
| R1 | `fullName`, `email` (no existente tras `normalizeEmail`) y `password` válidos | `{ kind: 'success', displayName: fullName.trim() }` | Añade `{ email: normalizeEmail(email), password, displayName: fullName.trim() }` a la lista de cuentas activas de la sesión |
| R2 | `email` (normalizado) ya registrado en `.env.local` o en la sesión actual | `{ kind: 'email-already-exists' }` | No modifica las cuentas existentes |
| R3 | Configuración inicial nula (`accounts === null`) o `gateway.register` no definido | `{ kind: 'unavailable' }` | Sin efecto |
| R4 | Cualquier excepción interna durante el registro | `{ kind: 'unavailable' }` (la promesa NUNCA se rechaza) | Sin efecto |
| R5 | Tras R1 exitoso, se invoca `authenticate({ email, password })` en `/login` | `{ kind: 'success', displayName }` | Permite iniciar sesión inmediatamente con la cuenta recién registrada |
| R6 | Cualquier caso | NUNCA registra ni expone `password` en consola, errores, URLs ni `localStorage` | Cumple FR-011 y Constitución 5.3/5.4 |
