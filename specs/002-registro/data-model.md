# Data model: registro simulado

**Alcance**: estado transitorio de la sesión de interfaz. No hay entidad de cuenta persistente ni relación con el conjunto de cuentas ficticias usado por login.

## RegistrationValues

| Campo | Tipo | Regla | Tratamiento |
|---|---|---|---|
| `fullName` | string | Obligatorio, 2–100 caracteres tras quitar espacios periféricos; letras Unicode y separadores habituales | Recortar extremos solo para mostrar la confirmación; descartar al navegar |
| `email` | string | Obligatorio, formato válido, ≤254 caracteres | Validar con `normalizeEmail`; no registrar ni persistir |
| `password` | string | Obligatoria, 8–128 caracteres | Comparar y validar sin recortar; descartar al navegar |
| `confirmPassword` | string | Obligatoria, igual a `password` | Nunca enviar al adaptador; descartar al navegar |
| `acceptedTerms` | boolean | Debe ser `true` por acción explícita | No persistir ni deducir de la consulta de términos |

**Invariantes**: una solicitud válida tiene los cinco valores válidos; la contraseña y confirmación coinciden exactamente; el formulario no dispara simulación con errores.

## RegistrationErrors

Mapa opcional por campo (`fullName`, `email`, `password`, `confirmPassword`, `acceptedTerms`) con mensajes en español. Hay a lo sumo un mensaje principal por campo. Los errores de campo desaparecen al corregir el valor; el error global de simulación desaparece antes de un nuevo intento. El orden de foco es el orden visual de los controles.

## RegistrationStatus

| Estado | Entrada | Salida |
|---|---|---|
| `editing` | Inicio, corrección o fallo de validación | `submitting` si no hay errores |
| `submitting` | Envío válido | `success` o `failure`; ignora envíos adicionales |
| `failure` | Rechazo inesperado de la simulación | `editing` al corregir o reintentar |
| `success` | Simulación confirmada | Navegación inmediata a `/login` y descarte de valores |

`success` es transitorio; no se renderiza una cuenta ni una vista de bienvenida en `/registro`.

## LoginSuccessNotice

Un mensaje temporal en memoria de la raíz de la SPA, mostrado una sola vez en `/login`: “Registro de demostración completado. No se creó una cuenta real.” No contiene nombre, correo ni contraseña. Se elimina al cerrar el aviso, navegar o recargar. El formulario de login conserva su estado inicial vacío.
