# Contract: Caso de uso de registro simulado

**Trazabilidad**: FR-002–FR-011/017/018, AC-102–104/201–207, EC-001–008/010–011.

## Entrada y resultado

Register recibe RegistrationValues y contexto de cancelación de un intento. Tipos del dominio y validaciones se detallan en [data-model.md](../data-model.md). Debe comprobar tipos, formato y límites en ejecución antes de cualquier efecto aunque la UI ya haya validado.

Resultado discriminado:

| kind | Contenido permitido | Efecto observable |
| --- | --- | --- |
| invalid | errores por campo, códigos sin valores | no invocar simulación, corregir formulario. |
| success | ningún dato de usuario | coordinador UI navega a login con aviso constante. |
| unavailable | código genérico, sin excepción cruda | aviso recuperable y reintento. |
| cancelled | sin payload | no error de usuario, éxito ni navegación tardía. |

El caso de uso no conoce React, historial, URL, cuentas de login o almacenamiento. No guarda el formulario en propiedad ni devuelve credenciales. Valida sin modificar el objeto de entrada.

## Puerto RegistrationSimulation

complete(signal: AbortSignal): Promise<void>. Señal estándar de cancelación, sin nombre, correo o contraseñas. Adaptador local espera 300 ms y resuelve, sin I/O. Si ya se canceló o se cancela, detiene el temporizador y rechaza con cancelación reconocible; el caso de uso devuelve cancelled. Otro rechazo produce unavailable. Una cancelación posterior a resolución pero anterior a procesar el resultado debe impedir éxito; verificar señal e identidad de intento antes de navegar.

Un stub controlable permite resolver, rechazar o cancelar en pruebas sin esperar tiempo real. No incorporar modos de fallo visibles al usuario para facilitar tests.

## Puerto RegistrationDiagnostics

record(event): void, esquema cerrado: código enumerado, duración no negativa opcional y sin payload adicional.

Códigos: validation_rejected, submission_started, submission_succeeded, submission_failed, submission_cancelled. Adaptador local acotado: contador por código y último evento estructurado. Sin consola, red, disco, localStorage/sessionStorage ni datos del formulario. Excepciones desconocidas se convierten en código genérico, sin serializarlas.

El caso de uso y el adaptador garantizan que fallos del diagnóstico no dejan el envío bloqueado ni exponen detalles; el adaptador de memoria no depende de I/O. Métricas no afectan el resultado funcional. Probar el esquema y que no se envían propiedades sensibles.

## Inyección, ciclo de vida y concurrencia

main.tsx construye adaptadores y caso de uso; App recibe dependencias por interfaces. La UI invoca Register y gestiona un único intento activo con guard síncrono. Al desmontar, cancela y descarta datos; en una nueva entrada crea nuevo estado e identidad. Solo el resultado del intento actual montado puede modificar la pantalla. Reiniciar guard en todos los finales permite reintento.

## Evidencias exigidas

Tests de contrato para éxito, inválido, rechazo, señal previamente cancelada, cancelación en curso y resolución tardía; validar que simulador no recibe formulario, no se modifican cuentas de login y solo se emiten metadatos permitidos. Unitarios de reglas antes de implementación, tests de integración del flujo después del verde de unidades. No se define API HTTP ni repositorio de cuentas porque no existen en el alcance.

