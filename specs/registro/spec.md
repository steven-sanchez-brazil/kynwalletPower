# Feature Specification: Registro de Usuarios de KynWallet

**Feature Branch**: `feature/registro-alvaro-martinez`

**Created**: 2026-10-20

**Status**: Draft

**Input**: User description: "Crear la pantalla de Registro de Usuarios para KynWallet siguiendo el flujo SDD, con formulario, validaciones inline, accesos sociales informativos, enlace al login, confirmación de éxito y diseño responsive basado en el prototipo y la estructura del proyecto."

**Diseño de referencia**: La pantalla conserva la identidad visual y la composición de dos paneles del prototipo de acceso de KynWallet: panel de marca y panel de formulario en escritorio. En móvil se presenta únicamente el formulario de registro.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear una cuenta mediante el formulario (Priority: P1)

Como visitante, quiero proporcionar mi nombre completo, correo electrónico y contraseña, confirmar la contraseña y aceptar los términos y condiciones para completar el registro.

**Why this priority**: Es el flujo principal de la pantalla y permite que un visitante complete el alta con los datos requeridos.

**Independent Test**: Completar todos los campos con valores válidos, aceptar los términos y enviar el formulario; comprobar que aparece una confirmación de registro exitoso.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario completa nombre, correo válido, contraseña de al menos 8 caracteres y confirmación coincidente, acepta los términos y envía el formulario, **Then** ve un mensaje claro de registro exitoso.
2. **Given** un formulario enviado correctamente, **When** se presenta el resultado, **Then** la confirmación es visible y anunciada a tecnologías de asistencia.
3. **Given** un formulario con algún campo obligatorio vacío o con datos inválidos, **When** el usuario intenta enviarlo, **Then** no se confirma el registro y se muestran los errores junto a los campos correspondientes.

---

### User Story 2 - Corregir errores de validación (Priority: P1)

Como visitante, quiero identificar y corregir los errores en mis datos antes de enviar el registro para poder completar el proceso sin intentos innecesarios.

**Why this priority**: La validación es necesaria para prevenir envíos incompletos y para dejar claros los criterios de aceptación del formulario.

**Independent Test**: Introducir un correo inválido, una contraseña menor de 8 caracteres, contraseñas diferentes y dejar los términos sin aceptar; comprobar cada mensaje inline y volver a validar al corregir los valores.

**Acceptance Scenarios**:

1. **Given** un correo con formato inválido, **When** el usuario abandona el campo o envía el formulario, **Then** aparece un mensaje de error asociado al correo.
2. **Given** una contraseña de menos de 8 caracteres, **When** el usuario envía el formulario, **Then** aparece un mensaje que indica el mínimo de 8 caracteres y no se completa el registro.
3. **Given** contraseñas que no coinciden, **When** el usuario abandona el campo de confirmación o envía el formulario, **Then** aparece un mensaje que indica que las contraseñas deben coincidir.
4. **Given** que el usuario modifica un campo con error, **When** el nuevo valor satisface su validación, **Then** desaparece el error correspondiente.
5. **Given** que no se han aceptado los términos y condiciones, **When** el usuario envía el formulario, **Then** el registro no se completa y se informa que debe aceptar los términos.
6. **Given** varios campos inválidos, **When** el usuario envía el formulario, **Then** los errores se muestran junto a cada campo afectado y el primer campo inválido recibe el foco.

---

### User Story 3 - Elegir alternativas y volver al inicio de sesión (Priority: P2)

Como visitante, quiero reconocer las opciones de registro social y encontrar el acceso al inicio de sesión para elegir la ruta adecuada si ya tengo una cuenta.

**Why this priority**: Estas opciones completan la navegación y los elementos previstos por el prototipo sin simular integraciones no disponibles.

**Independent Test**: Activar por separado los botones de Google y Apple y el enlace de inicio de sesión; comprobar el aviso informativo de cada opción social y que el enlace lleva a `/login`.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario selecciona Google o Apple, **Then** se muestra una alerta con el texto exacto «Próximamente» y no se inicia un flujo externo.
2. **Given** la pantalla de registro, **When** el usuario activa el enlace «Iniciar sesión», **Then** navega a `/login`.

---

### User Story 4 - Usar el registro en escritorio y móvil (Priority: P2)

Como visitante, quiero completar el registro en distintos tamaños de pantalla para que el formulario siga siendo legible y utilizable.

**Why this priority**: La pantalla debe conservar la jerarquía del prototipo en escritorio y priorizar el formulario en móvil.

**Independent Test**: Abrir la pantalla en vista de escritorio y en una ventana móvil; comprobar la composición en dos paneles en escritorio y que en móvil solo se presenta el formulario, sin desbordamiento horizontal.

**Acceptance Scenarios**:

1. **Given** una ventana de escritorio, **When** se muestra la pantalla de registro, **Then** se distinguen dos paneles: marca y formulario.
2. **Given** una ventana móvil, **When** se muestra la pantalla de registro, **Then** solo se presenta el formulario y sus controles permanecen visibles y utilizables sin desplazamiento horizontal.

### Edge Cases

- El usuario envía el formulario con todos los campos vacíos: cada campo obligatorio presenta su error y no se confirma el registro.
- El correo contiene espacios al inicio o al final: estos no impiden validar un correo que, una vez normalizado, tiene formato válido.
- La contraseña contiene espacios: se validan como parte de la contraseña y no se eliminan silenciosamente.
- El usuario corrige la contraseña después de completar su confirmación: la coincidencia se vuelve a evaluar y el error se muestra si los valores difieren.
- El usuario desmarca los términos después de completar los campos: el envío queda bloqueado hasta aceptar nuevamente.
- El usuario activa repetidamente los botones sociales: cada activación informa «Próximamente» sin alterar los valores ingresados.
- En anchos móviles estrechos, todos los campos, errores, términos y acciones siguen disponibles sin scroll horizontal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE seguir la identidad visual del prototipo de KynWallet y presentar un panel de marca y un panel de formulario en escritorio.
- **FR-002**: En móvil, la pantalla DEBE mostrar únicamente el formulario de registro, sin el panel de marca.
- **FR-003**: El formulario DEBE incluir campos obligatorios para nombre completo, correo electrónico, contraseña y confirmar contraseña, cada uno con una etiqueta comprensible.
- **FR-004**: El formulario DEBE incluir una casilla de aceptación de términos y condiciones; el registro NO DEBE completarse mientras no esté marcada.
- **FR-005**: El sistema DEBE validar que el correo tenga un formato válido y mostrar el error inline junto al campo cuando no lo tenga.
- **FR-006**: El sistema DEBE exigir una contraseña de al menos 8 caracteres y mostrar el error inline junto al campo si no se cumple el mínimo.
- **FR-007**: El sistema DEBE comprobar que la confirmación sea idéntica a la contraseña y mostrar un error inline cuando no coincida.
- **FR-008**: El sistema DEBE informar inline de los campos obligatorios vacíos y de la falta de aceptación de los términos al intentar enviar el formulario.
- **FR-009**: Al corregir un valor para que cumpla su validación, el error correspondiente DEBE desaparecer o actualizarse sin ocultar errores de otros campos que sigan inválidos.
- **FR-010**: El sistema NO DEBE completar el registro ni mostrar éxito si hay errores de validación o no se aceptaron los términos.
- **FR-011**: Tras el envío válido, la pantalla DEBE mostrar un mensaje claro de registro exitoso.
- **FR-012**: Los botones de Google y Apple DEBEN estar disponibles visualmente y, al activarse, mostrar una alerta con el texto exacto «Próximamente» sin iniciar autenticación externa.
- **FR-013**: La pantalla DEBE incluir un enlace «Iniciar sesión» que navegue a `/login`.
- **FR-014**: La pantalla DEBE poder operarse con teclado; los campos deben tener etiquetas asociadas, los errores deben anunciarse a tecnologías de asistencia y el resultado del envío debe comunicarse de forma accesible.
- **FR-015**: El diseño DEBE adaptarse a escritorio y móvil sin desbordamiento horizontal, manteniendo legibles y utilizables los campos, las validaciones, la casilla y las acciones.
- **FR-016**: El sistema NO DEBE mostrar ni almacenar la contraseña en el mensaje de éxito, en la URL ni en mensajes de error.

### Key Entities

- **Datos de registro**: información introducida por el visitante para solicitar el alta; incluye nombre completo, correo electrónico, contraseña, confirmación de contraseña y aceptación de términos. La confirmación se usa para validar coincidencia, no como dato distinto de la contraseña.
- **Resultado de registro**: estado visible posterior al envío; puede ser errores de validación o confirmación de éxito.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los casos válidos presentados en los escenarios de aceptación muestra una confirmación de registro exitoso.
- **SC-002**: El 100 % de los casos inválidos de correo, contraseña, confirmación o términos bloquea el éxito y muestra el mensaje correspondiente.
- **SC-003**: Al menos 9 de cada 10 participantes de una prueba de usabilidad pueden completar el formulario válido en menos de 2 minutos sin ayuda.
- **SC-004**: En pruebas a tamaños de escritorio y móvil, todos los controles y mensajes requeridos pueden verse y utilizarse sin desplazamiento horizontal.
- **SC-005**: Todos los controles y errores pueden identificarse y operarse con teclado, y los mensajes de validación y éxito son perceptibles por tecnologías de asistencia.
- **SC-006**: La activación de Google y Apple muestra «Próximamente» en el 100 % de las pruebas y no inicia un flujo de autenticación externo.

## Assumptions

- La referencia visual disponible en el proyecto es la pantalla de inicio de sesión de KynWallet; se reutilizan su identidad visual y su composición de panel de marca más panel de formulario en escritorio, adaptadas al contenido de registro.
- El alcance de esta especificación es la experiencia de la pantalla y su confirmación visual; no se asume persistencia de cuentas ni integración con un servicio de registro.
- La confirmación es visible en la misma pantalla tras completar un envío válido, sin afirmar que una cuenta se haya guardado en un servicio externo.
- Los botones sociales son informativos en esta versión; sus integraciones quedan fuera del alcance.
- El idioma de la interfaz es español. La aceptación de términos es obligatoria, y el contenido legal se proporciona mediante el enlace o recurso definido por el producto.
- No existen BRD ni ARD específicos para esta funcionalidad; si se incorporan, esta especificación DEBE alinearse con ellos según el Principio VI de la Constitución.
