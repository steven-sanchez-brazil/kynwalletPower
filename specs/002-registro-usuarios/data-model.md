# Modelo de datos: Registro de usuarios

**Fecha**: 2026-10-16 | **Feature**: `002-registro-usuarios`

Los datos viven en memoria durante la vida de la página. No hay tablas, migraciones, API HTTP
ni persistencia de cuentas nuevas.

## RegistrationInput — entrada del caso de uso

| Campo             | Tipo      | Regla                                                                  |
| ----------------- | --------- | ---------------------------------------------------------------------- |
| `fullName`        | `string`  | Requerido tras trim; de 1 a 80 caracteres normalizados                 |
| `email`           | `string`  | Requerido; formato compartido con login; máximo 254; trim y minúsculas |
| `password`        | `string`  | Requerido; de 8 a 128 caracteres, sin trim                             |
| `confirmPassword` | `string`  | Requerido e idéntico a `password`                                      |
| `acceptedTerms`   | `boolean` | Debe ser `true`                                                        |

`RegistrationErrors` es un mapa parcial por clave de `RegistrationInput`; `{}` significa
entrada válida. La validación es pura y no depende de React, red ni infraestructura.

## RegistrationAccount — datos enviados al puerto

| Campo      | Tipo     | Uso                                                 |
| ---------- | -------- | --------------------------------------------------- |
| `fullName` | `string` | Nombre con espacios periféricos eliminados          |
| `email`    | `string` | Correo normalizado                                  |
| `password` | `string` | Contraseña exacta, únicamente para la demo temporal |

Confirmación y términos no pertenecen a la cuenta. El adaptador convierte `fullName` en
`DemoAccount.displayName`, conservando el contrato de autenticación existente.

## RegistrationGatewayResult — resultado del puerto

| `kind`            | Significado                                                     |
| ----------------- | --------------------------------------------------------------- |
| `success`         | Se creó la cuenta en la instancia compartida                    |
| `duplicate-email` | El correo normalizado ya pertenece a una cuenta; no se modifica |
| `unavailable`     | No se pudo completar el registro                                |

## RegistrationResult — resultado del caso de uso

Incluye todas las variantes del puerto y `invalid-input`, que contiene `errors` de tipo
`RegistrationErrors`. Una entrada inválida nunca invoca `RegistrationGateway.register`.
Una excepción del adaptador se traduce a `unavailable` sin exponer detalles internos.

## Cuenta demo existente

Se reutiliza `DemoAccount` (`email`, `password`, `displayName`). Las cuentas iniciales siguen
cargándose desde la configuración local. Las nuevas cuentas se agregan únicamente a la
instancia del adaptador compartida por autenticación y registro.

**Invariantes**:

- La comparación de correo es normalizada y única para cuentas iniciales y nuevas.
- Un duplicado no sobrescribe contraseña ni nombre de una cuenta existente.
- La cuenta registrada solo existe después de un resultado exitoso.
- Ningún resultado de registro ni URL incluye contraseña o confirmación.
- La ausencia de cuentas configuradas no impide crear la primera cuenta demo.

## Estado de formulario y navegación

El formulario mantiene valores, campos visitados, errores, indicador de envío y error
global. La visibilidad de cada contraseña pertenece a su `PasswordField`.

```text
edición ──enviar inválido──> edición con errores
edición ──enviar válido───> enviando
enviando ──éxito──────────> /login + confirmación transitoria
enviando ──fallo──────────> edición con error y posibilidad de reintento
```

Mientras está enviando no se inicia otra solicitud. La UI no calcula reglas de negocio:
consume la validación del dominio y el resultado del caso de uso. La confirmación de éxito
es independiente de una sesión autenticada y no debe volver a mostrar datos de contraseña.
