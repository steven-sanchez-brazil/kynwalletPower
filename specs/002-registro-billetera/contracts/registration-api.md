# Contract: API ficticia de registro y caso de uso

**Referencias**: FR-002–009 y FR-016; [modelo](../data-model.md).

## Alcance del transporte

Operación lógica `POST /api/demo/register`. Es documentación del comportamiento simulado, no un endpoint disponible: la aplicación llama una función asíncrona en memoria. No se implementan fetch, XHR, servidor, service worker, API externa ni almacenamiento. DevTools no debe mostrar solicitudes de registro. No publicar este contrato como un servicio real.

## Puerto y composición

`RegistrationGateway.register(request: RegistrationRequest): Promise<FakeRegistrationResponse>`.

La UI recibe `Register`, función de aplicación creada mediante `createRegister(gateway, observer)`. `main.tsx` compone ambos y selecciona el fake; ningún componente importa infraestructura. El puerto no expone opciones de presentación o detalles de HTTP real.

- Entrada: nombre normalizado, correo normalizado, contraseña sin transformar, aceptación true.
- No transmitir confirmPassword al fake.
- Respuestas permitidas: `{ status: 201, body: { kind: 'created' } }` y `{ status: 503, body: { kind: 'unavailable' } }`.
- La forma debe comprobarse en el límite: estado desconocido, cuerpo inválido o excepción producen `unavailable`, sin mostrar causa interna.
- No devolver identidad, número de cuenta, credenciales o tokens. No consultar duplicados ni mutar cuentas de login.

## Casos de uso observables

| Entrada / resultado fake | Resultado Register | Efecto |
| --- | --- | --- |
| datos inválidos o tipo incorrecto | validation-error con errores seguros | cero llamadas al puerto, sin navegación |
| datos válidos + 201/created | created | UI limpia y navega a `/login` con aviso |
| datos válidos + 503/unavailable | unavailable | UI conserva datos y permite reintento |
| respuesta inesperada o excepción | unavailable | mismo mensaje seguro, diagnóstico sin excepción cruda |

Una invocación válida ejecuta una llamada; la UI evita invocaciones simultáneas. No hay reintentos automáticos ni dependencia de correo o contraseña para provocar fallos.

## Fake determinista

- Constructor/configuración inyectable con `delayMs` (predeterminado 500) y resultado elegido; no usar aleatoriedad.
- `VITE_DEMO_REGISTRATION_MODE` opcional: `success` o ausente → 201; `unavailable` → 503; valor inválido → fallo controlado. Es configuración pública de demostración y no contiene secretos.
- Cambios de esta variable requieren reiniciar Vite. Para volver a éxito después de demostrar error, establecer `success` y reiniciar.
- En tests: inyectar fake/stub que responda error primero y éxito después para verificar reintento en la misma pantalla. Temporizadores falsos evitan esperas reales.
- El adaptador no retiene solicitudes tras resolver. Al salir durante la demora, el resultado no debe navegar ni reabrir mensajes.

## Observabilidad y seguridad

Observer acepta solo eventos categóricos y duración. Registrar `registration.completed` o `registration.failed` una vez por intento procesado, no por render. Para validaciones rechazadas puede emitirse un contador sin valores ni mensajes de campo. Un sink local documentado cumple diagnóstico sin servicio externo; si usa consola, la excepción ESLint se limita a su archivo y solo al método permitido.

## Pruebas contractuales mínimas

1. Solicitud válida produce exactamente el esquema de éxito tras la demora.
2. Modo unavailable produce exactamente el esquema de fallo.
3. Tipos/validación incorrectos no llegan al gateway; confirmación nunca forma parte de request.
4. Respuesta corrupta y promesa rechazada producen el mismo error seguro.
5. Cambiar el stub error→éxito permite recuperación sin resetear datos.
6. Ni respuestas ni diagnóstico contienen campos del formulario; no hay llamadas fetch/XHR ni cambios en almacenamiento o cuentas del login.
