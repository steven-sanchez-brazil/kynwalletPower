# Contract: Puerto de registro

**Archivo**: `src/application/ports/RegistrationGateway.ts`

```ts
interface RegistrationGateway {
  register(account: DemoAccount): Promise<RegistrationResult>;
}

type RegistrationResult = { kind: 'success' } | { kind: 'email-taken' } | { kind: 'unavailable' };
```

`account.email` llega normalizado y `account.displayName` sin espacios periféricos (los prepara
el caso de uso `register`).

## Comportamiento de `InMemoryRegistrationGateway`

| ID | Caso | Resultado |
|---|---|---|
| R1 | Correo nuevo | `success`; la cuenta queda en el arreglo compartido y `InMemoryAuthGateway` la autentica |
| R2 | Correo existente, con otras mayúsculas | `email-taken`; el arreglo no cambia |
| R3 | Configuración ausente (`null`) | `unavailable` |
| R4 | Excepción interna | `unavailable`; la promesa no se rechaza |
| R5 | Cualquier caso | El resultado no contiene la contraseña |
| R6 | Cualquier caso | Responde tras `delayMs` (1000 ms por defecto) |

## Caso de uso `register`

`createRegister(gateway)(data: RegistrationData) → Promise<RegistrationResult>`

- Envía `{ email: normalizeEmail(email), password, displayName: fullName.trim() }`.
- No envía `confirmPassword` ni `acceptTerms`.
- Si el puerto lanza una excepción, devuelve `unavailable`.
