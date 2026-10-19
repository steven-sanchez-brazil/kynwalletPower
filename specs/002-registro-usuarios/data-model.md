# Data Model: Registro de Usuarios de KynWallet

**Feature**: `002-registro-usuarios` | **Date**: 2026-10-19

El registro añade cuentas únicamente a la colección en memoria creada al iniciar la aplicación.
No se persiste ningún dato y no se modifica `.env.local` ni `.env.example`.

## DemoAccount

Entidad ya definida por el login, reutilizada por registro. Las cuentas iniciales se validan
desde `VITE_DEMO_USERS`; las nuevas se agregan al mismo gateway durante la ejecución.

| Campo | Tipo | Reglas |
|---|---|---|
| `email` | `string` | Obligatorio, formato válido, máximo 254 caracteres; guardado con trim y minúsculas; único en la colección. |
| `password` | `string` | Obligatorio, 8–128 caracteres; se conserva exactamente y solo vive en memoria. Nunca se registra ni incluye en URL/resultado. |
| `displayName` | `string` | Obligatorio, trim y 1–80 caracteres; corresponde al nombre completo ingresado y se usa en la bienvenida. El límite vive en `domain/validation.ts` y lo comparten `loadDemoAccounts` y el registro. |

## RegistrationInput

Valor recibido del formulario antes de normalizar.

| Campo | Tipo | Reglas |
|---|---|---|
| `displayName` | `string` | Tras trim, 1–80 caracteres. |
| `email` | `string` | Obligatorio; validar con las mismas reglas y normalización del login. |
| `password` | `string` | 8–128 caracteres; no trim. |
| `confirmPassword` | `string` | Obligatorio; coincidencia exacta con `password`; no se conserva en `DemoAccount`. |
| `acceptedTerms` | `boolean` | Debe ser `true`; no forma parte de `DemoAccount`. |

## RegistrationFieldErrors

`Partial<Record<'displayName' | 'email' | 'password' | 'confirmPassword' | 'acceptedTerms', string>>`.
La validación es pura (`validateRegistration`) y recorre los campos en este orden, que también
define el foco: nombre, correo, contraseña, confirmación y términos. Al enviar se marcan los
campos como tocados, se enfoca el primer error y no se ejecuta el caso de uso si el objeto no
está vacío. Corregir un valor recalcula y retira su error sin borrar los otros valores. Cambiar
la contraseña recalcula también la confirmación.

## AccountCreationResult y RegistrationResult

`AccountCreationResult` es lo que devuelve el puerto `RegistrationGateway`; `RegistrationResult`
lo amplía con los casos que produce el caso de uso.

| Variante | Origen | Datos | Significado |
|---|---|---|---|
| `success` | gateway | — | Cuenta agregada exactamente una vez a la colección compartida. |
| `duplicate-email` | gateway | — | El correo normalizado ya existe; no modifica ninguna cuenta. |
| `unavailable` | gateway | — | La colección inicial no pudo cargarse o no está disponible. |
| `invalid` | caso de uso | `errors: RegistrationFieldErrors` | La entrada no supera la validación; no se invoca al gateway. |
| `failure` | caso de uso | — | Fallo inesperado comunicado con texto genérico; el diagnóstico no incluye datos del formulario ni la contraseña. |

Ningún resultado incluye la contraseña ni la confirmación.

## AccountCollection (en memoria)

Estado interno de `InMemoryAuthGateway`; no es una entidad exportada.

| Aspecto | Regla |
|---|---|
| Origen | Copia superficial del arreglo de `loadDemoAccounts`, o `null` si la configuración falta o es inválida. |
| Alta | Tras la espera simulada, comprobar duplicado con `normalizeEmail` e insertar en una sola sección síncrona; el correo se guarda normalizado. |
| Lectura | `authenticate` consulta la misma colección, sin otra lista paralela. |
| Vida útil | La instancia creada en `main.tsx`; recargar la descarta. |

## RegistrationNotice (estado de `App`)

Indicador booleano en memoria de `App` que muestra "registro exitoso" en `/login`. No contiene
datos personales, no viaja en la URL ni en `history.state` y se limpia al enviar el login o al
salir de la ruta. Recargar lo descarta.

## RegistrationFormState

Estado del formulario exclusivo de UI: `editing | submitting | error`. Contiene valores,
campos tocados, errores y aviso (`notice`, por ejemplo "Próximamente"). No existe estado
`success` permanente en registro: un resultado exitoso navega a `/login`, limpiando los valores
del formulario.

### Transiciones

- `change`/`blur`: actualizar un campo y recalcular el error visible correspondiente.
- `submit` inválido: marcar controles tocados, mostrar errores y no llamar al caso de uso.
- `submit` válido: cambiar a `submitting`; bloquear envíos adicionales.
- resultado `duplicate-email`: volver a edición con el error en el campo de correo (se retira al
  cambiarlo), foco en ese campo y datos conservados.
- resultado `unavailable`/`failure`/`invalid`: volver a edición, mostrar aviso seguro y
  conservar los datos que puedan corregirse.
- resultado `success`: activar `RegistrationNotice`, navegar a `/login` y descartar el
  formulario desmontado.
- `showNotice`: mostrar "Próximamente" para Google/Apple sin alterar los campos ni crear cuenta.

## Invariantes de la colección

1. Se crea una vez en la raíz de composición y es la misma instancia que consume login y
   registro.
2. Configuración inicial `null` no se convierte silenciosamente en una colección vacía válida.
3. Correo duplicado se determina con `normalizeEmail`, incluyendo cuentas iniciales y registros
   previos de esta ejecución.
4. Logout/navegación no destruye cuentas registradas; recarga de la aplicación las descarta.
5. Ningún estado, resultado o mensaje persiste contraseñas o la confirmación.
6. Dos altas concurrentes del mismo correo producen como máximo un `success`.
7. Registrar no modifica ni sustituye cuentas existentes.
