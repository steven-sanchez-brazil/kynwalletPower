# Feature Specification: Pantalla de Registro de KynWallet

**Feature Branch**: `002-registro-billetera`

**Created**: 2026-10-17

**Status**: Draft

**Input**: User description: "Necesito construir una pantalla de registro para la billetera virtual, con el objetivo de permitir que se registren nuevos usuarios de una manera sencilla. El diseño de referencia se encuentra en Figma: https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2. La pantalla debe permitir ingresar: Nombres Completos (obligatorio), Correo electrónico (máscara de formato email, obligatorio, validación inline), Contraseña (seguridad alta y 8 caracteres como mínimo), Confirmar contraseña (exactamente igual a la contraseña, seguridad alta, validación inline), checkbox de aceptación de términos en True para activar el botón 'Crear Cuenta'. Al hacer clic en 'Crear Cuenta' todos los campos deben ser válidos antes de enviarse; si es OK debe dirigirse a la ventana de Login y crear un registro de los datos en localStorage del navegador. Los botones de Google y Apple mostrarán una alerta tipo Toast con un mensaje 'Próximamente'. El alcance se limita a una demostración funcional del registro, sin servicios backend ni base de datos. Genera historias de usuario y criterios de aceptación, respetando la Constitución del proyecto."

**Diseño de referencia**: Figma, frame de Registro (nodo `31:2`). Mantiene la composición en dos paneles de la marca KynWallet (panel informativo de marca y panel de formulario de registro con campos de Nombres completos, Correo electrónico, Contraseña, Confirmar contraseña, casilla de aceptación de términos y condiciones, botón principal "Crear Cuenta", divisor con botones de registro social para Google y Apple, y enlace para volver a "Iniciar sesión").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar una nueva cuenta con datos válidos (Priority: P1)

Como nuevo usuario de la billetera virtual, quiero completar el formulario de registro con mi nombre completo, correo electrónico y una contraseña segura, aceptar los términos y crear mi cuenta, para quedar registrado y ser dirigido a la pantalla de inicio de sesión.

**Why this priority**: es el objetivo principal de la funcionalidad; sin la capacidad de completar el registro, persistir la cuenta y redirigir al inicio de sesión, no existe valor demostrable.

**Independent Test**: se accede a la pantalla de registro, se completan todos los campos con valores válidos, se marca la casilla de aceptación de términos, se presiona "Crear Cuenta" y se verifica que el registro queda almacenado localmente en el navegador y que se muestra la pantalla de inicio de sesión.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro cargada, **When** el usuario aún no ha marcado la casilla de aceptación de términos y condiciones, **Then** el botón "Crear Cuenta" permanece deshabilitado y no permite el envío del formulario.
2. **Given** la casilla de aceptación de términos desmarcada, **When** el usuario la marca en estado activo (`True`), **Then** el botón "Crear Cuenta" se habilita para permitir el envío.
3. **Given** el usuario ha ingresado Nombres Completos válidos, un Correo electrónico con formato válido no registrado previamente, una Contraseña de seguridad alta (mínimo 8 caracteres), una Confirmación de contraseña idéntica y ha marcado la casilla de aceptación de términos, **When** hace clic en "Crear Cuenta", **Then** el sistema valida que todos los campos sean correctos, guarda el registro del usuario en el almacenamiento local del navegador y redirige al usuario a la pantalla de inicio de sesión (Login).
4. **Given** un usuario que acaba de registrarse exitosamente y fue dirigido a la pantalla de inicio de sesión, **When** ingresa el correo electrónico y la contraseña con los que se registró, **Then** el sistema le permite iniciar sesión y muestra su nombre completo en la vista de bienvenida.
5. **Given** el usuario se encuentra en la pantalla de inicio de sesión, **When** activa el enlace "Regístrate", **Then** el sistema navega a la pantalla de registro; y cuando activa el enlace para iniciar sesión desde la pantalla de registro, regresa a la pantalla de inicio de sesión.

---

### User Story 2 - Validar campos en línea (inline) y antes del envío (Priority: P1)

Como usuario en proceso de registro, quiero recibir retroalimentación inmediata en cada campo (inline) sobre el formato de mi correo, el nivel de seguridad de mi contraseña y la coincidencia de ambas contraseñas, así como una verificación completa antes de enviar, para corregir cualquier error de forma sencilla antes de crear mi cuenta.

**Why this priority**: la validación inline de correo, seguridad alta de contraseña y confirmación de contraseña, junto con la validación previa al envío, son requisitos centrales explícitos para garantizar tanto la experiencia de usuario como la Seguridad por Diseño (Constitución, Principio V).

**Independent Test**: se interactúa con cada campo ingresando valores vacíos o inválidos (correo mal formado, contraseña débil o menor a 8 caracteres, confirmación distinta) y se comprueba que los mensajes de error aparecen en línea junto al campo correspondiente y bloquean el envío al hacer clic en "Crear Cuenta".

**Acceptance Scenarios**:

1. **Given** el campo "Nombres Completos" vacío o solo con espacios en blanco, **When** el usuario sale del campo o hace clic en "Crear Cuenta" (con términos aceptados), **Then** se muestra el mensaje inline "Ingresa tus nombres completos" y el formulario no se envía.
2. **Given** el campo "Correo electrónico", **When** el usuario escribe un valor que no cumple el formato de correo (`usuario@dominio.ext`) o sale del campo dejándolo vacío, **Then** se muestra inline el mensaje "Ingresa un correo electrónico válido" (o "Ingresa tu correo electrónico" si está vacío) y el formulario no se envía.
3. **Given** el campo "Contraseña", **When** el usuario ingresa una contraseña con menos de 8 caracteres o que no cumple con los criterios de seguridad alta (al menos una mayúscula, una minúscula, un número y un carácter especial), **Then** se muestra inline el mensaje indicando los requisitos de seguridad alta y mínimo de 8 caracteres, y el formulario no se envía.
4. **Given** el campo "Confirmar contraseña", **When** el usuario ingresa un valor que no es exactamente igual al del campo "Contraseña" o que no cumple con seguridad alta, **Then** se muestra inline el mensaje "Las contraseñas no coinciden" (o el requisito de seguridad pendiente) a medida que valida el campo.
5. **Given** que el usuario modificó el campo "Contraseña" después de haber completado "Confirmar contraseña", **When** ambos valores dejan de coincidir, **Then** el campo "Confirmar contraseña" actualiza su validación inline inmediatamente mostrando que las contraseñas no coinciden.
6. **Given** la casilla de aceptación de términos marcada pero con uno o más campos inválidos o vacíos, **When** el usuario hace clic en "Crear Cuenta", **Then** se muestran los errores inline de todos los campos inválidos, no se almacena ningún dato, no se redirige al Login y el foco se traslada al primer campo con error.
7. **Given** un campo con mensaje de error inline visible, **When** el usuario corrige el contenido hasta cumplir las reglas de validación, **Then** el mensaje de error inline desaparece inmediatamente.

---

### User Story 3 - Notificación "Próximamente" en botones de Google y Apple (Priority: P2)

Como usuario de la demostración, quiero que al pulsar los botones de registro con Google o Apple se me informe mediante una alerta tipo Toast con el mensaje "Próximamente", para comprender que dichos métodos de acceso rápido estarán disponibles en el futuro sin perder los datos que ya escribí.

**Why this priority**: es un requisito explícito del alcance de demostración para dar respuesta visual clara a los botones sociales del diseño de Figma sin implementar integraciones externas (YAGNI).

**Independent Test**: en la pantalla de registro se hace clic en el botón "Google" y luego en el botón "Apple", verificando que en ambos casos se despliega una notificación tipo Toast con el texto "Próximamente" que desaparece automáticamente tras unos segundos.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario hace clic en el botón "Google", **Then** se muestra una alerta tipo Toast con el mensaje "Próximamente" sin borrar ni alterar los valores ingresados en el formulario.
2. **Given** la pantalla de registro, **When** el usuario hace clic en el botón "Apple", **Then** se muestra una alerta tipo Toast con el mensaje "Próximamente" sin borrar ni alterar los valores ingresados en el formulario.
3. **Given** la alerta tipo Toast visible en pantalla, **When** transcurre su tiempo de visualización (o el usuario la descarta), **Then** la alerta se oculta automáticamente y es anunciada de forma no intrusiva por lectores de pantalla.

---

### User Story 4 - Mostrar u ocultar contraseñas durante el registro (Priority: P3)

Como usuario, quiero poder alternar la visibilidad del texto en los campos "Contraseña" y "Confirmar contraseña", para verificar que escribí la contraseña deseada sin errores tipográficos.

**Why this priority**: facilita el ingreso de contraseñas de seguridad alta con caracteres especiales y mantiene consistencia con los controles del sistema de diseño de la billetera.

**Independent Test**: se escribe texto en "Contraseña" y en "Confirmar contraseña", se activan sus respectivos controles de visibilidad y se comprueba que cada campo muestra y oculta su contenido de forma accesible.

**Acceptance Scenarios**:

1. **Given** texto ingresado y oculto en "Contraseña" o "Confirmar contraseña", **When** el usuario activa el control de visibilidad del campo correspondiente, **Then** el contenido de ese campo se muestra en texto legible y el control actualiza su etiqueta accesible a "Ocultar contraseña".
2. **Given** la contraseña visible en cualquiera de los dos campos, **When** el usuario vuelve a activar el control de visibilidad, **Then** el texto vuelve a ocultarse y la etiqueta accesible indica "Mostrar contraseña".

---

### Edge Cases

- **Correo electrónico ya registrado**: si el usuario intenta registrarse con un correo que ya existe en el almacenamiento local o en las cuentas de demostración preconfiguradas (comparando sin distinguir mayúsculas/minúsculas y sin espacios periféricos), el sistema muestra un error impidiendo duplicar el registro.
- **Espacios periféricos en Nombres Completos y Correo electrónico**: los espacios al inicio y al final se recortan al validar y guardar; si "Nombres Completos" contiene únicamente espacios, se considera vacío e inválido.
- **Espacios en Contraseña y Confirmar contraseña**: no se recortan silenciosamente; la comparación entre ambos campos es exacta carácter por carácter.
- **Límites de longitud (Principio V - Seguridad por Diseño)**: Nombres Completos mayores a 80 caracteres, Correos mayores a 254 caracteres o Contraseñas mayores a 128 caracteres son rechazados por validación inline antes del envío.
- **Doble clic o múltiples envíos en "Crear Cuenta"**: mientras se procesa la creación de cuenta, el botón se deshabilita para evitar registros duplicados.
- **Almacenamiento local del navegador deshabilitado o lleno (`QuotaExceededError` / modo privado restringido)**: el sistema captura el error de forma segura y muestra un mensaje comprensible al usuario ("No se pudo completar el registro en este navegador. Verifica la configuración de almacenamiento.") sin exponer trazas técnicas (Constitución 5.5).
- **Desmarcar aceptación de términos tras haber llenado el formulario**: si el usuario desmarca el checkbox de términos en cualquier momento, el botón "Crear Cuenta" vuelve a deshabilitarse inmediatamente.
- **Pantallas móviles (desde 320 px)**: el formulario de registro completo y la alerta Toast se adaptan sin desplazamiento horizontal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla de registro DEBE reproducir la estructura, textos, campos y jerarquía visual del diseño de referencia en Figma (nodo `31:2`), reutilizando los tokens y componentes del sistema de diseño del proyecto (Constitución 8.5 y 8.6).
- **FR-002**: El formulario DEBE incluir el campo obligatorio "Nombres Completos", validando que no esté vacío (tras recortar espacios periféricos) y que tenga entre 1 y 80 caracteres.
- **FR-003**: El formulario DEBE incluir el campo obligatorio "Correo electrónico" con validación inline y máscara/validación de formato de correo electrónico estándar (`usuario@dominio.ext`), longitud máxima de 254 caracteres y normalización en minúsculas sin espacios periféricos.
- **FR-004**: El formulario DEBE incluir el campo obligatorio "Contraseña" con validación inline que exija una longitud de entre 8 y 128 caracteres y **seguridad alta** (definida como la presencia obligatoria de al menos una letra mayúscula, una letra minúscula, un dígito numérico y un carácter especial).
- **FR-005**: El formulario DEBE incluir el campo obligatorio "Confirmar contraseña" con validación inline que verifique que su valor cumpla con seguridad alta y sea exactamente idéntico al valor actual del campo "Contraseña".
- **FR-006**: Las validaciones inline de los campos DEBEN ejecutarse durante la interacción del usuario (al modificar el valor tras haber interactuado con el campo o al perder el foco) y actualizarse inmediatamente si cambia el campo "Contraseña" afectando la coincidencia de "Confirmar contraseña".
- **FR-007**: El formulario DEBE incluir una casilla de verificación (checkbox) de aceptación de términos y condiciones; el botón "Crear Cuenta" DEBE permanecer deshabilitado mientras la casilla esté en `False` y habilitarse únicamente cuando la casilla esté en `True`.
- **FR-008**: Al hacer clic en "Crear Cuenta" (o presionar Enter con el botón habilitado), el sistema DEBE validar todos los campos del formulario antes de procesar el envío; si algún campo es inválido, DEBE impedir el envío, mostrar todos los mensajes de error inline correspondientes y colocar el foco en el primer campo con error.
- **FR-009**: El sistema DEBE verificar antes de completar el registro que el correo electrónico normalizado no pertenezca ya a un usuario registrado en el navegador o en las cuentas de demostración activas.
- **FR-010**: Cuando todos los campos sean válidos y la casilla de términos esté marcada en `True`, al enviar el formulario el sistema DEBE persistir el registro del usuario en el almacenamiento local del navegador (`localStorage`) y redirigir inmediatamente a la pantalla de inicio de sesión (Login).
- **FR-011**: En cumplimiento del Principio V de la Constitución (Seguridad por Diseño, reglas 5.3 y 5.4), el registro almacenado en `localStorage` NO DEBE guardar la contraseña en texto plano; DEBE almacenar únicamente los datos necesarios de la cuenta (identificador/correo normalizado, nombres completos, fecha de registro y aceptación de términos, junto con un resumen criptográfico unidireccional de la contraseña para permitir la verificación en el Login de demostración) y NUNCA exponer la contraseña en logs, consola ni URLs.
- **FR-012**: El flujo de inicio de sesión de la aplicación DEBE reconocer las cuentas registradas en `localStorage` además de las cuentas de demostración configuradas, permitiendo que el usuario recién registrado inicie sesión de inmediato tras ser redirigido a la ventana de Login.
- **FR-013**: Al hacer clic en cualquiera de los botones sociales ("Google" o "Apple"), el sistema DEBE mostrar una notificación temporal tipo Toast con el mensaje exacto `"Próximamente"`, posicionada flotante en la **parte superior centrada (`top-center`)** con fondo de color de la paleta corporativa actual e indicador de progreso (comportamiento estilo `react-toastify`), sin enviar ni limpiar el formulario.
- **FR-014**: La pantalla de inicio de sesión y la pantalla de registro DEBEN estar conectadas mediante sus enlaces de navegación ("Regístrate" en Login e "Inicia sesión" en Registro) para permitir el flujo completo de extremo a extremo.
- **FR-015**: Los campos "Contraseña" y "Confirmar contraseña" DEBEN ocultar los caracteres por defecto y ofrecer controles accesibles por teclado y lector de pantalla para alternar su visibilidad.
- **FR-016**: La pantalla de registro y la alerta tipo Toast DEBEN cumplir como mínimo WCAG 2.1 nivel AA (Constitución 8.4): etiquetas asociadas a cada control, estados de error anunciados mediante atributos de accesibilidad (`aria-invalid`, `aria-describedby`), notificación Toast anunciada mediante región viva (`role="status"` / `aria-live="polite"`), navegación completa por teclado y ratios de contraste conformes.
- **FR-017**: Ante errores de acceso o escritura en `localStorage`, el sistema DEBE manejar la excepción de forma explícita y presentar un mensaje claro al usuario sin exponer detalles técnicos internos (Constitución 5.5).

### Key Entities *(include if feature involves data)*

- **Solicitud de Registro (RegistrationInput)**: datos ingresados por el usuario en el formulario (nombres completos, correo electrónico, contraseña, confirmación de contraseña y estado de aceptación de términos). Existe únicamente en memoria durante la edición y validación.
- **Usuario Registrado (RegisteredUserRecord)**: entidad persistida en `localStorage` tras un registro válido. Contiene: correo electrónico normalizado (identificador único), nombres completos (nombre para mostrar), huella/resumen unidireccional de la contraseña (nunca en texto plano, por Principio V de la Constitución), indicador de términos aceptados y marca temporal de creación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario nuevo puede completar el formulario de registro y llegar a la pantalla de inicio de sesión en menos de 60 segundos.
- **SC-002**: La retroalimentación de validación inline (formato de correo, seguridad de contraseña y coincidencia de confirmación) se presenta al usuario en menos de 100 milisegundos tras salir del campo o modificar su valor.
- **SC-003**: El 100 % de los escenarios de aceptación de las historias P1 y P2 están cubiertos por pruebas automatizadas que pasan siguiendo TDD (Constitución, Principio I y 8.1).
- **SC-004**: El 100 % de los intentos de envío con algún campo inválido, contraseñas que no coinciden o casilla de términos sin marcar son bloqueados antes de escribir en el almacenamiento del navegador o redirigir al Login.
- **SC-005**: La pantalla de registro no presenta incumplimientos de accesibilidad WCAG 2.1 nivel AA en auditorías automatizadas y es 100 % operable mediante teclado.
- **SC-006**: Ninguna contraseña en texto plano queda almacenada en `localStorage`, registros de consola, mensajes de error ni URLs bajo ningún escenario de prueba (Constitución, Principio V).

## Assumptions

- **Criterio de contraseña de seguridad alta**: se define según el estándar de la industria como una contraseña de entre 8 y 128 caracteres que incluye al menos una letra mayúscula (`A-Z`), una letra minúscula (`a-z`), un número (`0-9`) y un carácter especial (por ejemplo, `!@#$%^&*()_+-=[]{};':"\|,.<>/?~`).
- **Máscara de formato de correo electrónico**: se aplica formato visual/validación en línea de estructura estándar `usuario@dominio.ext` (sin espacios, con un único `@` y dominio con extensión de al menos 2 caracteres), normalizando espacios al inicio/final al validar.
- **Protección de credenciales en `localStorage` (Constitución 5.3 y 5.4)**: dado que el requerimiento solicita persistir el registro en `localStorage` del navegador para efectos de la demostración sin backend, y la Constitución exige proteger los datos sensibles en reposo, la contraseña se transforma mediante una función de resumen criptográfico unidireccional (hash) antes de guardarse en `localStorage`, de modo que nunca se almacene en texto claro y pueda verificarse al iniciar sesión en la ventana de Login.
- **Integración con la pantalla de Login existente (`001-login-billetera`)**: la navegación entre Registro y Login se realiza en el cliente dentro de la misma aplicación; al redirigir al Login tras crear la cuenta, el formulario de Login se muestra listo para que el usuario ingrese sus credenciales recién creadas, y el enlace "Regístrate" del Login ahora abre la pantalla de Registro.
- **Duración del Toast "Próximamente"**: la alerta tipo Toast mostrada al pulsar Google o Apple permanece visible durante aproximadamente 3 segundos antes de ocultarse automáticamente, sin bloquear la interacción con el formulario.
- **Tokens de color accesibles**: al igual que en la pantalla de Login (`001-login-billetera`), se reutilizan los tokens del sistema de diseño con el ajuste de contraste accesible documentado para cumplir WCAG 2.1 AA (Constitución 8.4 y 8.6).
- **Conformidad con BRD/ARD (Constitución, Principio VI)**: no existen documentos BRD o ARD separados en el repositorio; esta especificación actúa como referencia funcional autorizada junto con la Constitución del proyecto.
