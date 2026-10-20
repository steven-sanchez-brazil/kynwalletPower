# Contrato: Puerto de registro (`RegistrationGateway`)

Interfaz en `src/application/ports/RegistrationGateway.ts`. La implementa
`InMemoryRegistrationGateway` (`src/infrastructure/`).

```ts
interface RegistrationGateway {
  register(data: RegistrationData): Promise<RegistrationResult>;
}
```

`RegistrationData` y `RegistrationResult` están definidos en [data-model.md](../data-model.md).

## Caso de uso `createRegister(gateway)` (`src/application/register.ts`)

Devuelve `Register = (data: RegistrationData) => Promise<RegistrationResult>`.

| ID | Comportamiento |
|---|---|
| U1 | Delega en el gateway con el correo normalizado (recorte y minúsculas) y el nombre recortado; la contraseña se envía sin modificar |
| U2 | Si el gateway lanza una excepción, devuelve `{ kind: 'unavailable' }` (FR-023) |

## Adaptador `InMemoryRegistrationGateway(accounts, { delayMs })`

Recibe las mismas `DemoAccount[] | null` que `InMemoryAuthGateway`. `delayMs` por defecto 1000
(FR-012).

| ID | Dado | Resultado |
|---|---|---|
| C1 | Correo no presente en `accounts` (comparado sin distinguir mayúsculas y sin espacios) | `{ kind: 'success', displayName: <nombre> }` |
| C2 | Correo ya presente en `accounts` | `{ kind: 'email-taken' }` |
| C3 | `accounts` es `null` (configuración ausente o inválida) | `{ kind: 'unavailable' }` |
| C4 | Excepción interna | `{ kind: 'unavailable' }` sin rechazar la promesa |
| C5 | Cualquier resultado | No contiene la contraseña (FR-016) |
| C6 | Cualquier llamada con éxito | No agrega la cuenta: una segunda llamada con el mismo correo vuelve a devolver `success` |

## Configuración

Sin variables nuevas: usa `VITE_DEMO_USERS` ya definida en `.env.example` (FR-015).
