# Contract: Puerto `AccountRegistry`

```ts
// src/application/ports/AccountRegistry.ts
export interface AccountRegistry {
  register(account: DemoAccount): Promise<RegistrationResult>;
}
```

## Caso de uso `registerAccount`

```ts
type RegisterAccount = (form: RegistrationForm) => Promise<RegistrationResult>;
createRegisterAccount(registry: AccountRegistry): RegisterAccount;
```

- Construye la cuenta con el correo normalizado, el nombre normalizado y la contraseña sin cambios.
- No recibe `confirmPassword` ni `acceptedTerms` en el puerto (ISP).
- Si el registro lanza una excepción devuelve `{ kind: 'unavailable' }` (FR-022).

## Adaptador `InMemoryAccountRegistry`

- Constructor: `(accounts: DemoAccount[] | null, { delayMs = 1000 })`. La lista es la misma que
  usa `InMemoryAuthGateway`.
- Espera `delayMs` y luego:
  - `accounts === null` → `unavailable`.
  - correo ya presente (comparación normalizada) → `email-taken`, sin modificar la lista.
  - en otro caso agrega la cuenta → `success`.
