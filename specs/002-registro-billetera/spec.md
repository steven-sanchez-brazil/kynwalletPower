# Feature Specification: Pantalla de Registro de Billetera Virtual (KynWallet)

**Feature Branch**: `002-registro-billetera`

**Created**: 2026-10-19

**Status**: Draft

**Input**: User description: "Necesito construir una pantalla web de registro para una Billetera Virtual, con el objetivo de permitir que nuevos usuarios creen una cuenta de manera sencilla y segura. El diseño de referencia se encuentra en Figma: https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2. La pantalla debe incluir un formulario con los campos obligatorios(Nombre completo, Correo electrónico, Contraseña, Confirmar contraseña), en donde el correo debe tener un formato valido, y la contraseña debe de tener un minimo de 8 caracteres, la contraseña y la confirmación deben coincidir, mensajes de validación inline junto a cada campo. La pantalla debe incluir un Checkbox obligatorio para aceptar términos y condiciones, La pantalla debe incluir un Botón \"Crear cuenta\" debe validar todos los campos antes de enviar. Los Botones de registro con Google y Apple que muestren un mensaje \"Próximamente\". El link \"¿Ya tienes cuenta? Inicia sesión\" redirige a la pantalla login. Si todas las validaciones son exitosas, mostrar un mensaje de registro exitoso y redirigir a la pantalla de login. La pantalla debe tener un Diseño responsive, para desktop debe tener una distribución en dos paneles siguiendo el diseño de referencia, para mobile mostrar únicamente el formulario."

**Diseño de referencia**: Figma, frame `02 · Registro` (nodo `31:2`). Estructurado para escritorio en dos paneles principales: un panel visual de marca KynWallet (logotipo, propuesta de valor y tarjeta ilustrativa) y un panel interactivo de formulario ("Crea tu cuenta", campos de captura con validaciones inline, casilla de términos y condiciones, botón de creación, opciones sociales y enlace de retorno al login). En dispositivos móviles, la interfaz se adapta para presentar de manera exclusiva el formulario.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Creación exitosa de cuenta de usuario (Priority: P1)

Como nuevo usuario de KynWallet, quiero completar el formulario de registro con mis datos personales básicos (nombre completo, correo electrónico, contraseña y confirmación de contraseña), aceptar los términos y condiciones del servicio y presionar "Crear cuenta", para dar de alta mi cuenta y ser redirigido a la pantalla de inicio de sesión con un mensaje de éxito claro.

**Why this priority**: Es el flujo central y objetivo principal de la pantalla de registro; sin este recorrido no existe valor para el usuario ni conversión para la plataforma.

**Independent Test**: Se ingresan valores válidos en todos los campos obligatorios, se marca la casilla de términos y condiciones, se presiona el botón "Crear cuenta", y se verifica que aparece un mensaje de registro exitoso y la pantalla transiciona hacia el inicio de sesión.

**Acceptance Scenarios**:

1. **Given** el formulario de registro con todos los campos válidos y la casilla de términos marcada, **When** el usuario presiona el botón "Crear cuenta", **Then** el sistema procesa el registro, muestra una notificación clara de "Registro exitoso" y redirige al usuario a la pantalla de inicio de sesión.
2. **Given** el usuario presiona "Crear cuenta" con datos válidos, **When** la operación de registro está en proceso, **Then** el botón "Crear cuenta" muestra un indicador de carga, queda deshabilitado temporalmente y no permite envíos duplicados.
3. **Given** el usuario introduce su correo electrónico con espacios accidentales al inicio o al final, **When** envía el formulario, **Then** el sistema procesa el correo normalizado (sin espacios en los extremos y de forma insensible a mayúsculas/minúsculas).
4. **Given** el usuario se encuentra editando cualquiera de los campos de texto del formulario, **When** presiona la tecla Enter, **Then** el formulario valida los campos y procede con el envío equivalente a hacer clic en "Crear cuenta".

---

### User Story 2 - Validación de campos obligatorios y retroalimentación inline (Priority: P1)

Como nuevo usuario, quiero recibir indicaciones visuales y mensajes claros de validación inline junto a cada campo que contenga información faltante o inválida, para comprender exactamente qué debo corregir antes de reenviar el formulario.

**Why this priority**: Previene errores en la captura de datos críticos, orienta al usuario en el momento justo y garantiza la integridad de los datos de registro antes de su procesamiento.

**Independent Test**: Se interactúa con campos vacíos o con datos que incumplen las reglas de validación (correo sin formato, contraseña corta, contraseñas no coincidentes, casilla desmarcada), y se verifica la aparición inmediata y desaparición correctiva de cada mensaje inline.

**Acceptance Scenarios**:

1. **Given** el formulario con campos vacíos, **When** el usuario presiona "Crear cuenta", **Then** se detiene el envío, el foco se posiciona en el primer campo inválido y se muestran mensajes inline específicos: "Ingresa tu nombre completo", "Ingresa tu correo electrónico", "Ingresa tu contraseña", "Confirma tu contraseña" y "Debes aceptar los términos y condiciones".
2. **Given** el campo de correo electrónico con un texto sin estructura válida (ej. `usuario@`, `usuario.com`), **When** el usuario pierde el foco del campo o envía el formulario, **Then** se muestra el mensaje inline "Ingresa un correo electrónico válido".
3. **Given** el campo de contraseña con una longitud inferior a 8 caracteres, **When** el usuario pierde el foco o envía el formulario, **Then** se muestra el mensaje inline "La contraseña debe tener al menos 8 caracteres".
4. **Given** los campos de contraseña y confirmación de contraseña con valores diferentes, **When** el usuario completa ambos campos o envía el formulario, **Then** se muestra el mensaje inline "Las contraseñas no coinciden" junto al campo de confirmación.
5. **Given** un campo que presenta un mensaje de validación inline, **When** el usuario edita y corrige el valor cumpliendo la regla requerida, **Then** el mensaje de error de ese campo desaparece de forma inmediata.
6. **Given** un lector de pantalla activo, **When** un campo entra en estado de error, **Then** el mensaje de validación es anunciado de forma accesible mediante tecnologías de asistencia.

---

### User Story 3 - Alternar visibilidad de contraseñas (Priority: P2)

Como usuario, quiero disponer de controles para mostrar u ocultar el texto de mi contraseña y de la confirmación de contraseña, para verificar visualmente que escribí exactamente lo que deseaba y evitar discrepancias.

**Why this priority**: Mejora sustancialmente la experiencia del usuario y reduce la tasa de errores de confirmación de contraseñas en formularios de registro.

**Independent Test**: Se introduce texto en los campos de contraseña y confirmación, se activa cada botón de visibilidad independientemente y se corrobora la alternancia entre caracteres enmascarados y texto plano.

**Acceptance Scenarios**:

1. **Given** caracteres ingresados en el campo de contraseña (enmascarados por defecto), **When** el usuario activa el botón de visibilidad del campo, **Then** los caracteres se tornan legibles y el control indica la opción de ocultar.
2. **Given** el campo de confirmación de contraseña, **When** el usuario activa su control de visibilidad independiente, **Then** los caracteres de confirmación se tornan legibles sin afectar el estado de visibilidad del primer campo de contraseña.
3. **Given** el usuario navega utilizando exclusivamente el teclado, **When** enfoca y acciona los controles de visibilidad mediante teclado, **Then** el estado de visibilidad conmuta de manera accesible y visible.

---

### User Story 4 - Navegación a la pantalla de inicio de sesión (Priority: P2)

Como usuario que ya posee una cuenta en KynWallet, quiero hacer clic en el enlace "¿Ya tienes cuenta? Inicia sesión", para dirigirme a la pantalla de login sin necesidad de completar el registro.

**Why this priority**: Evita que usuarios existentes queden atrapados en el flujo de registro o creen cuentas duplicadas por error.

**Independent Test**: Se hace clic en el enlace "¿Ya tienes cuenta? Inicia sesión" desde la pantalla de registro y se confirma la redirección inmediata hacia la pantalla de inicio de sesión.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro en cualquier estado (vacía o con datos en progreso), **When** el usuario activa el enlace "¿Ya tienes cuenta? Inicia sesión", **Then** el sistema redirige inmediatamente a la pantalla de inicio de sesión sin generar errores ni registrar datos.
2. **Given** navegación por teclado, **When** el usuario llega con el tabulador al enlace de inicio de sesión y presiona Enter, **Then** la acción de redirección se ejecuta con foco lógico en la pantalla destino.

---

### User Story 5 - Opciones de registro social con Google y Apple (Priority: P3)

Como visitante interesado en registrarse con proveedores de identidad externos (Google o Apple), quiero presionar los botones correspondientes y recibir un mensaje informativo claro de que estarán disponibles próximamente, para conocer el estado de la funcionalidad sin confundirme con un error técnico.

**Why this priority**: Mantiene la fidelidad visual y de marca respecto al prototipo de diseño de Figma sin comprometer integraciones externas fuera del alcance inicial.

**Independent Test**: Se presiona el botón "Continuar con Google" y el botón "Continuar con Apple", y se verifica que se presenta un aviso con el texto "Próximamente" mientras el formulario preserva su estado.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario presiona el botón de registro con Google o con Apple, **Then** se presenta un mensaje no intrusivo indicando "Próximamente", sin recargar la página ni vaciar los campos diligenciados.
2. **Given** la aparición del mensaje "Próximamente", **When** el usuario interactúa nuevamente con cualquier otro elemento, **Then** el aviso desaparece de forma fluida.

---

### User Story 6 - Adaptación responsiva para escritorio y móvil (Priority: P2)

Como usuario que accede desde diferentes dispositivos (computadora de escritorio, tablet o teléfono inteligente), quiero que la pantalla organice sus elementos de manera óptima para mi tamaño de pantalla, para disfrutar de una navegación visualmente equilibrada y sin fricción.

**Why this priority**: El comportamiento responsivo es un requisito explícito de diseño; en dispositivos móviles el espacio disponible exige prescindir del panel de marca para priorizar el formulario.

**Independent Test**: Se visualiza la pantalla en anchos de escritorio (>= 1024px) comprobando los dos paneles, y en anchos móviles (< 768px) comprobando que solo el panel de formulario permanece visible y usable.

**Acceptance Scenarios**:

1. **Given** una pantalla con resolución de escritorio (>= 1024px), **When** se carga la vista de registro, **Then** se muestra una distribución de dos paneles: a la izquierda el panel de marca KynWallet (logo, titular y tarjeta ilustrativa) y a la derecha el panel con el formulario de registro completo.
2. **Given** un dispositivo o ventana con dimensiones móviles (< 768px), **When** se visualiza la pantalla de registro, **Then** se muestra únicamente el panel del formulario de registro centrado y adaptado al ancho de pantalla, sin presencia del panel lateral de marca ni barras de desplazamiento horizontal.

---

### Edge Cases

- **Múltiples pulsaciones consecutivas en "Crear cuenta"**: Si el usuario presiona repetidamente el botón mientras el registro está en proceso, únicamente se ejecuta una sola solicitud de creación.
- **Espacios en blanco periféricos e internos**: Los espacios al inicio o final del nombre y del correo se depuran de forma automática. En la contraseña, los espacios interiores se respetan estrictamente como caracteres válidos.
- **Copia y pegado en campos**: Si el usuario pega texto en el campo de correo, contraseña o confirmación de contraseña, las validaciones inline y la comprobación de coincidencia deben ejecutarse de forma inmediata tras el evento de pegado.
- **Nombres con caracteres especiales y acentos**: El campo de nombre completo debe admitir nombres con tildes, diéresis, caracteres como "ñ/Ñ", guiones y apóstrofes sin disparar falsos errores de formato.
- **Límites de longitud máxima**: Se restringen entradas desmedidas que puedan degradar la interfaz o la seguridad (Nombre completo: máximo 100 caracteres; Correo: máximo 254 caracteres; Contraseña y confirmación: máximo 128 caracteres).
- **Recarga de página durante el registro**: Si el usuario recarga la página antes de enviar, el formulario se reinicia a su estado inicial en blanco por motivos de privacidad y seguridad de datos sensibles.
- **Zoom y escalado de texto**: En niveles de zoom del navegador de hasta 200%, los campos, textos de ayuda, checkbox y botones permanecen legibles y accesibles sin colisiones visuales ni pérdidas de funcionalidad.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE reflejar fielmente la disposición, textos, tipografías y jerarquía visual del diseño de referencia de Figma (`02 · Registro`, nodo `31:2`).
- **FR-002**: La pantalla DEBE contener un formulario con los siguientes campos obligatorios:
  - Nombre completo
  - Correo electrónico
  - Contraseña
  - Confirmar contraseña
  - Casilla de verificación (checkbox) para aceptación de términos y condiciones
- **FR-003**: El sistema DEBE validar que el Nombre completo no esté vacío y contenga al menos 2 caracteres válidos.
- **FR-004**: El sistema DEBE validar que el Correo electrónico cumpla con un formato estándar reconocible (ejemplo: `nombre@dominio.extension`), sin espacios iniciales ni finales y con tratamiento insensible a mayúsculas.
- **FR-005**: El sistema DEBE validar que la Contraseña tenga una longitud mínima obligatoria de 8 caracteres.
- **FR-006**: El sistema DEBE validar que el contenido del campo Confirmar contraseña sea exactamente idéntico al del campo Contraseña.
- **FR-007**: El sistema DEBE validar que la casilla de Términos y condiciones esté explícitamente marcada para permitir el registro.
- **FR-008**: El sistema DEBE presentar mensajes de validación inline legibles junto a cada campo en caso de error, activándose tanto al perder el foco (blur) como al intentar enviar el formulario.
- **FR-009**: El sistema DEBE remover inmediatamente el mensaje de error inline de un campo en cuanto el usuario ingrese un valor que satisfaga la condición de validación.
- **FR-010**: El botón "Crear cuenta" DEBE validar la totalidad de los campos antes de proceder con el registro; si existen campos inválidos, DEBE detener el proceso y situar el foco en el primer campo con error.
- **FR-011**: Al iniciar el proceso de registro tras un formulario válido, el sistema DEBE mostrar un estado de carga en el botón "Crear cuenta", deshabilitar el botón y bloquear envíos duplicados.
- **FR-012**: Tras un registro exitoso, el sistema DEBE redirigir al usuario hacia la pantalla de inicio de sesión y mostrar en dicha pantalla un mensaje claro de éxito ("Registro exitoso" o equivalente acorde al diseño) junto con el correo registrado pre-cargado.
- **FR-013**: Los campos de Contraseña y Confirmar contraseña DEBEN mostrar sus caracteres ocultos/enmascarados por defecto y DEBEN contar con botones accesibles para alternar la visibilidad de los caracteres de forma independiente.
- **FR-014**: La pantalla DEBE incluir los botones de registro social con Google y Apple; al ser presionados, el sistema DEBE mostrar una notificación accesible indicando el mensaje "Próximamente" sin reiniciar el formulario.
- **FR-015**: La pantalla DEBE incluir un enlace con el texto "¿Ya tienes cuenta? Inicia sesión", que al ser activado redirija inmediatamente a la pantalla de inicio de sesión.
- **FR-016**: La pantalla DEBE implementar un diseño responsive:
  - En resoluciones de escritorio (>= 1024px), DEBE presentar una distribución en dos paneles: panel de marca a la izquierda y panel de formulario a la derecha.
  - En resoluciones móviles (< 768px), DEBE ocultar el panel de marca y desplegar exclusivamente el formulario de registro adaptado al ancho de pantalla.
- **FR-017**: La pantalla DEBE cumplir con las pautas de accesibilidad WCAG 2.1 nivel AA: cada control debe contar con etiqueta semántica, los errores inline deben estar vinculados mediante atributos de accesibilidad, el contraste de color debe ser suficiente y la navegación debe ser 100% operable mediante teclado.
- **FR-018**: El sistema NO DEBE persistir ni registrar contraseñas en texto claro en logs, almacenamiento no seguro ni parámetros visibles de URL, en cumplimiento con el Principio V de la Constitución.
- **FR-019**: El formulario DEBE admitir el envío al presionar la tecla Enter desde cualquiera de sus campos de entrada interactivos.

### Key Entities

- **Solicitud de Registro**: Estructura de datos temporal capturada durante la interacción del usuario en el formulario. Atributos: nombre completo del usuario, correo electrónico normalizado, contraseña cifrada/oculta, confirmación de contraseña, estado de aceptación de términos y condiciones, y estado de validación global.
- **Cuenta de Usuario Creada**: Entidad representativa de la cuenta generada tras el registro exitoso. Atributos: identificador único, nombre completo, correo electrónico registrado y estado de activación listo para autenticación en la pantalla de inicio de sesión.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario nuevo completa el proceso de registro y visualiza la confirmación de éxito en menos de 60 segundos desde que la pantalla se presenta.
- **SC-002**: El 100% de los intentos de envío con datos incompletos o erróneos son prevenidos por el sistema, mostrando mensajes inline descriptivos en menos de 100 milisegundos tras la interacción.
- **SC-003**: Ante un envío exitoso, la confirmación de registro y el inicio de la redirección hacia el login se ejecutan en un tiempo inferior a 1.5 segundos.
- **SC-004**: El 100% de los escenarios de aceptación correspondientes a las historias de prioridad P1 y P2 cuentan con pruebas automatizadas que verifican su correcto funcionamiento y previenen regresiones.
- **SC-005**: La interfaz supera una auditoría de accesibilidad conforme a WCAG 2.1 nivel AA con 0 violaciones críticas o serias, y es totalmente operable utilizando únicamente el teclado.
- **SC-006**: En pantallas móviles de 320 px a 767 px de ancho, el 100% de los campos y controles son utilizables sin que se produzca desplazamiento horizontal (scroll horizontal = 0).
- **SC-007**: Al menos el 90% de los usuarios evalúan el proceso de registro como fácil o intuitivo en pruebas de aceptación de usuario en su primer intento.

## Assumptions

- La funcionalidad de registro forma parte de la aplicación KynWallet y se conecta directamente con la pantalla de inicio de sesión implementada en `specs/001-login-billetera`.
- Al tratarse de una solución frontend con enfoque de Clean Architecture (Constitución, Principio III), el servicio de registro operará mediante un contrato o puerto desacoplado que valida y confirma la creación de la cuenta del lado del cliente, simulando o almacenando localmente la nueva cuenta para permitir el posterior inicio de sesión.
- El diseño gráfico de referencia se basa en el prototipo Figma nodo `31:2`, utilizando los tokens visuales, tipografía y paleta de color establecidos en el sistema de diseño corporativo de KynWallet.
- El checkbox de términos y condiciones incluye el texto acordado en el diseño; no se requiere en esta fase una pasarela de firma electrónica ni descarga de contratos en PDF, bastando con el enlace descriptivo a los términos.
- El idioma oficial de la pantalla, validaciones y retroalimentaciones al usuario es el español.
