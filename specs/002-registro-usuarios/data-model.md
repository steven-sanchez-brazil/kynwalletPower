# Data Model: Registro de Usuarios

**Fuente**: [spec.md](spec.md), FR-001–FR-019 y EC-001–EC-012. Datos efímeros; no hay tablas, cuentas guardadas ni migraciones.

## Entidades y campos

| Entidad | Campo | Tipo y reglas |
| --- | --- | --- |
| RegistrationValues | fullName | string, trim para validar; 1–100 caracteres, admite acentos, apóstrofos, guiones y un término. |
| RegistrationValues | email | string, trim; 1–254 caracteres, un @, parte local no vacía, dominio con al menos dos segmentos no vacíos y sin espacios internos. |
| RegistrationValues | password | string, 8–128 caracteres, sin recortar o alterar espacios/mayúsculas. |
| RegistrationValues | confirmPassword | string, 8–128 y coincidencia exacta con password. |
| RegistrationValues | acceptedTerms | boolean, inicial false; debe ser true para enviar. |
| FieldErrors | clave de RegistrationValues | código de error tipado, sin incluir valores; como máximo un error por control. |
| RegistrationState | values, errors, touched | valores de edición, errores actuales y controles visitados/validados. |
| RegistrationState | status | editing, invalid, submitting o failed; éxito/cancelación son resultados que llevan al desmontaje o descarte. |
| RegistrationState | notice | aviso informativo de opciones futuras; independiente de errores de campo. |
| NavigationArrival | registrationSucceeded | boolean transitorio en App; sin datos de formulario o identificador personal. |
| DiagnosticSnapshot | counters, lastEvent | contadores por código y último evento con duración numérica; cantidad acotada, sin payload. |

RegistrationState tiene un RegistrationValues y varios FieldErrors vinculados por clave. Un intento puede producir un único resultado final. No existe identidad de usuario, deduplicación de correo, relación con DemoAccount ni registro de consentimiento persistido.

## Validación

- Validar tipo antes de normalizar; datos externos mal tipados devuelven error y no provocan excepciones sin manejar.
- Valores ausentes o nombre/correo vacíos tras trim: requerido. Contraseña vacía: requerido; sus espacios son caracteres y no se recortan.
- Longitudes de registro contadas como puntos de código Unicode, incluida confirmación. No truncar silenciosamente para aparentar validez; mostrar error de límite.
- Dominio de correo con segmentos vacíos es inválido; no verificar existencia, DNS o duplicidad. Compartir primitivas con perfil explícito, conservando semántica de login.
- Prioridad de error por control: requerido, formato/longitud y después coincidencia. La falta de confirmación no se etiqueta como discrepancia.
- Blur valida el control; submit valida todos; cambios corrigen errores de controles ya validados. Cambiar password revalida confirmPassword si ya se validó. No mostrar errores de controles aún no visitados antes del primer envío.
- Retener texto de edición y casilla ante errores y avisos sociales. Normalizar solo para reglas; no usar textos ingresados en mensajes.

## Transiciones

| Estado/evento | Resultado |
| --- | --- |
| Apertura o nueva entrada | editing, valores vacíos, aceptación false, sin errores/avisos. |
| Cambio/blur | conservar valores ajenos; recalcular errores pertinentes; estado editing/invalid según validación ya realizada. |
| Submit inválido | invalid; marcar todos validados, sin simulación; enfocar primer inválido. |
| Submit válido | submitting; limpiar avisos anteriores, bloquear duplicados, validar autoritativamente en aplicación. |
| Éxito actual | descartar formulario; reemplazar ruta por /login con aviso transitorio. |
| Fallo actual | failed; datos conservados, mensaje comprensible y reintento habilitado. |
| Reintento | validar de nuevo; nuevo intento, nunca reutilizar resultado anterior. |
| Salida mientras se envía | cancelar señal, limpiar datos y suscripción; resultado tardío ignorado. |
| Google/Apple | solo aviso «Próximamente»; sin transición de envío ni cambio de valores. |
| Navegar fuera/recargar | descarte del estado de registro; aviso de éxito no reconstruido. |

## Invariantes de privacidad y concurrencia

Un guard síncrono bloquea dos submits antes del siguiente render. La identidad local del intento y cancelación previenen que una resolución antigua afecte un nuevo formulario. Congelar edición de campos/casilla durante el envío; permitir abandonar la pantalla y cancelar. Ninguna credencial se pasa al simulador, diagnóstico, navegador, historial, URL o almacenamiento. La limpieza elimina referencias de la aplicación; no pretende garantizar borrado físico de memoria administrada por el navegador.

