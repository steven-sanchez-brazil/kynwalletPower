# Contract: Puerto de registro y caso de uso

## `RegistrationGateway` (`src/application/ports/RegistrationGateway.ts`)

```ts
interface RegistrationGateway {
  register(account: DemoAccount): Promise<RegisterResult>;
}
```

- Recibe la cuenta ya normalizada por el caso de uso.
- `email-taken` si ya existe una cuenta con el mismo correo normalizado (demo o registrada).
- `unavailable` si el almacén no está disponible (configuración demo inválida) o ante un error
  inesperado.
- `success` agrega la cuenta; desde ese momento `AuthGateway.authenticate` la acepta.

**Implementación**: `InMemoryAuthGateway` (espera simulada de 1 s, configurable con `delayMs`).

## Caso de uso `register` (`src/application/register.ts`)

```ts
type Register = (data: RegistrationData) => Promise<RegisterResult>;
function createRegister(gateway: RegistrationGateway): Register;
```

- Construye la cuenta: correo normalizado, nombre recortado, contraseña sin cambios.
- No valida: la validación ocurre en la UI con `validateRegistration` antes de llamar (FR-009).
- Cualquier excepción del puerto se traduce a `{ kind: 'unavailable' }` (FR-023).
- Nunca registra ni expone la contraseña (FR-019).
