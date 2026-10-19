# Contract: UserRegistrationGateway (puerto de registro y almacenamiento)

Interfaz entre la capa de aplicación y la infraestructura (Constitución 2.5, 3.4). La capa de UI nunca accede directamente a `window.localStorage`; invoca el caso de uso `registerUser` inyectado desde la raíz de composición (`src/main.tsx`).

```ts
// src/application/ports/UserRegistrationGateway.ts
import type { RegistrationCommand, RegistrationResult } from '@/domain/registration';

export interface UserRegistrationGateway {
  register(command: RegistrationCommand): Promise<RegistrationResult>;
}

// src/domain/registration.ts
export type RegistrationCommand = {
  fullName: string;
  email: string;
  password: string;
  acceptedTerms: true;
};

export type RegistrationResult =
  | { kind: 'success' }
  | { kind: 'email-already-exists' }
  | { kind: 'storage-error' };
```

## Comportamiento obligatorio de toda implementación

| # | Dado | Resultado |
|---|---|---|
| R1 | Datos válidos y `email` (normalizado) no existente ni en `localStorage` ni en `VITE_DEMO_USERS` | Persiste `RegisteredUserRecord` en `localStorage` bajo la clave `kynwallet.registeredUsers` y resuelve `{ kind: 'success' }` |
| R2 | `email` normalizado ya existe en `kynwallet.registeredUsers` o en las cuentas de demostración | No modifica `localStorage` y resuelve `{ kind: 'email-already-exists' }` |
| R3 | El objeto persistido en `localStorage` | Contiene `email`, `displayName`, `passwordDigest` (hash SHA-256 hex), `acceptedTerms: true`, `createdAt`; **NUNCA** incluye la contraseña en texto plano (FR-011, SC-006) |
| R4 | `localStorage.getItem` o `localStorage.setItem` lanza una excepción (`QuotaExceededError`, `SecurityError`, etc.) | Captura la excepción y resuelve `{ kind: 'storage-error' }`; la promesa NO DEBE rechazarse |
| R5 | Tras un registro exitoso (`R1`), el usuario se autentica a través de `AuthGateway.authenticate({ email, password })` | `AuthGateway` verifica también los registros de `kynwallet.registeredUsers` comparando `passwordDigest` y devuelve `{ kind: 'success', displayName }` (FR-012) |
