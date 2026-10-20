# Data Model: Registro de demostración

No hay entidades persistentes ni relación con la lista de cuentas del login.

## RegistrationValues

| Campo | Tipo | Regla |
| --- | --- | --- |
| fullName | string | trim para validar; 1–100 caracteres; admitir Unicode, espacios internos, tildes, guiones y apóstrofos |
| email | string | normalizar con regla compartida del login; ≤254; parte local, arroba y dominio con extensión; sin espacios interiores |
| password | string | 8–128 caracteres; no recortar; reglas compartidas de longitud |
| confirmPassword | string | 8–128 caracteres; coincidencia exacta con password |
| acceptedTerms | boolean | debe ser true para continuar; inicialmente false |

Las longitudes siguen la semántica `string.length` existente. Valores iniciales: cadenas vacías y false. Validar tipos en el límite del caso de uso aunque TypeScript ya delimite consumidores internos. No coercionar valores desconocidos a datos válidos.

## RegistrationErrors

Mapa parcial de los cinco campos a mensajes de dominio. Un error por campo, con prioridad obligatorio, formato/longitud y coincidencia. Confirmación vacía informa obligatoriedad, no discrepancia. Los máximos deben tener mensajes explícitos. La normalización no altera el texto de contraseña y confirmación. No reflejar valores introducidos en los mensajes.

Reglas invocadas por UI al blur/envío y por el caso de uso antes de delegar. La misma función completa evita duplicación; touched determina qué errores se muestran, no qué errores existen.

## RegistrationRequest

Solicitud interna al fake con `fullName`, `email`, `password`, `acceptedTerms: true`. El caso de uso la construye únicamente después de validar RegistrationValues y aplica normalización de nombre y correo. No contiene confirmación. Su vida es la duración de la llamada; el fake no la acumula, devuelve ni imprime.

## RegistrationResult

Unión discriminada del caso de uso:

- `validation-error`, con RegistrationErrors: no invoca gateway.
- `created`: no contiene cuenta, datos personales, token ni sesión.
- `unavailable`: representa fallo declarado, respuesta inválida o excepción del fake; mismo mensaje de UI para todos.

El gateway utiliza el contrato de [API ficticia](contracts/registration-api.md); el caso de uso traduce su respuesta a estos resultados y valida su forma.

## RegistrationFormState

Valores, conjunto touched por campo, indicador de primer envío, estado `editing | submitting | failed`, errores derivados y aviso global de fallo. Visibilidad de cada contraseña local a su PasswordField, independiente entre instancias.

| Estado / evento | Condición | Efecto |
| --- | --- | --- |
| Inicio | montar registro | valores vacíos, sin errores visibles, términos false |
| editing o failed / change | entrada permitida | actualizar valor; quitar fallo global; reevaluar campos ya tocados o enviados y confirmación dependiente |
| editing o failed / blur | control abandonado | marcar touched y mostrar su error si existe |
| editing o failed / submit | datos inválidos | mostrar errores de todos; foco en primer inválido; sin llamada |
| editing o failed / submit | datos válidos | guardia inmediata, submitting, un único intento |
| submitting / submit repetido | intento activo | ignorar; no duplicar gateway ni diagnóstico |
| submitting / created | formulario aún montado e intento vigente | limpiar valores; desmontar registro; navegar a login con aviso volátil |
| submitting / unavailable | intento vigente | failed; conservar valores; permitir reintento; mostrar fallo genérico |
| submitting / desmontaje | navegar o cerrar pantalla | invalidar intento; descartar valores e ignorar cualquier resultado tardío |
| cualquier estado / resize | solo cambia presentación | conservar estado |
| cualquier estado / abandono o recarga | cambio de recorrido | descartar valores, errores y visibilidad |

Durante submitting deshabilitar campos y casilla para no mostrar datos distintos de los enviados; botón con texto «Creando cuenta…» y estado ocupado. La guardia contra duplicados debe ser síncrona, no depender solo del siguiente render.

## NavigationState

`pathname` admitido: `/register`, `/login` y `/` como alias histórico de login. `registrationNotice` es booleano volátil en App; solo una finalización válida lo activa. No se escribe en URL, history.state, almacenamiento ni configuración. Cada navegación fuera de login y cada popstate limpia el aviso; una recarga inicializa false. El enlace desde registro no lo activa. Desconocidas se reemplazan por `/login`.

## DiagnosticEvent

Atributos permitidos: nombre del evento, resultado categórico, duración numérica y contador. Sin nombre de persona, correo, valores de formulario, mensaje de excepción ni stack. Generar métricas solo de duración/resultados; el observador no recibe RegistrationRequest. Los errores del diagnóstico no deben exponer información ni impedir que el usuario obtenga una respuesta controlada.
