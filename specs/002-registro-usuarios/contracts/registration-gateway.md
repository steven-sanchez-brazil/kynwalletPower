# Contract: Alta simulada de cuenta

Contrato entre el caso de uso de registro y el gateway que comparte la colección de cuentas con
la autenticación. Las firmas son conceptuales; el plan no requiere una API de servidor.

## Operación

Puerto nuevo `RegistrationGateway` (en `application/ports/`), separado de `AuthGateway`:

`register(account: DemoAccount): Promise<AccountCreationResult>`

`AuthGateway` y sus pruebas `C1`–`C6` de 001 no cambian. `InMemoryAuthGateway` implementa ambos
puertos sobre la misma colección. El caso de uso añade encima:

`registerAccount(input: RegistrationInput): Promise<RegistrationResult>`

### Resultados del puerto (`AccountCreationResult`)

| Variante | Condición | Efecto |
|---|---|---|
| `success` | Colección disponible y correo normalizado no existente | Agrega exactamente una cuenta; login puede autenticarla de inmediato. |
| `duplicate-email` | Correo existe tras `normalizeEmail` | No altera la colección. |
| `unavailable` | Configuración inicial ausente/inválida o excepción interna | No agrega cuenta. |

### Resultados del caso de uso (`RegistrationResult`)

Los anteriores más `invalid` (con `errors`) cuando la entrada no supera la validación, sin
invocar al gateway, y `failure` cuando el gateway lanza una excepción inesperada.

## Obligaciones

- La instancia compartida autentica las cuentas de `.env.local` y las agregadas por `register`;
  no hay listas distintas por caso de uso. `main.tsx` crea una sola instancia.
- Se normaliza el correo con la misma regla que login (`trim().toLowerCase()`) y el nombre se
  recorta; no se normaliza la contraseña.
- Confirmación y aceptación de términos se validan antes de invocar el puerto y no se guardan en
  `DemoAccount`.
- `register` espera la demora simulada configurable (`delayMs`, 1 s por defecto) y después
  comprueba duplicado e inserta de forma síncrona e indivisible.
- La contraseña nunca se registra ni forma parte de resultados o mensajes.
- Un fallo no muta cuentas, comunica un error explícito y permite reintentar.
- Los errores inesperados no se silencian: el caso de uso devuelve `failure` y llama al reporter
  de diagnóstico con un código fijo, sin credenciales, valores del formulario ni datos
  personales; el usuario recibe un mensaje genérico accionable.
- El constructor copia superficialmente el arreglo inicial y no clona sus elementos.

## Pruebas de contrato (nombrar con prefijo `REG`)

| ID | Escenario | Resultado esperado |
|---|---|---|
| R1 | Correo nuevo con configuración disponible | `success`; `authenticate` con ese correo y contraseña da `success` y el nombre |
| R2 | Correo existente con otra capitalización o espacios | `duplicate-email`; la cuenta original sigue autenticando con su contraseña |
| R3 | Dos `register` simultáneos del mismo correo | Uno `success` y otro `duplicate-email`; una sola cuenta añadida |
| R4 | Colección `null` | `unavailable`; `authenticate` sigue en `unavailable` |
| R5 | Cuentas iniciales tras varias altas | Siguen autenticando |
| R6 | El arreglo recibido en el constructor | No se muta |
| R7 | Resultados serializados | Ninguno contiene la contraseña |
| R8 | Espera simulada | `register` no resuelve antes de `delayMs` |
| R9 | Gateway que lanza en el caso de uso | `failure`, reporter llamado una vez con código y sin datos del formulario |
| R10 | Entrada inválida en el caso de uso | `invalid` con errores; el gateway no se invoca |

## Integración existente

La autenticación sigue cumpliendo el contrato [AuthGateway del login](../../001-login-billetera/contracts/auth-gateway.md).
Compartir la colección no exige ampliar ese puerto: `createAuthenticate` y `createRegisterAccount`
reciben la misma instancia desde la raíz de composición.
