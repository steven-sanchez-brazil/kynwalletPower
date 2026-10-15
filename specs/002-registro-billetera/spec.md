# Feature Specification: Pantalla de Registro de KynWallet

**Feature Branch**: `002-registro-billetera`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Necesito construir una pantalla web de registro para una billetera
virtual, con el objetivo de permitir que los usuarios puedan crear una cuenta en la aplicación de
manera sencilla. El diseño de referencia se encuentra en Figma:
https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2.
La pantalla debe permitir ingresar nombre completo, correo, contraseña, confirmar contraseña,
validar los campos, aceptar términos y condiciones, simular una creación de cuenta. Si los datos
son correctos, debe mostrar un mensaje de bienvenida; de lo contrario, un mensaje de error. El
alcance se limita a una demostración funcional de la creación de una cuenta, sin servicios backend
ni base de datos. Genera historias de usuario y criterios de aceptación, respetando la
Constitución del proyecto."

**Diseño de referencia**: Figma, nodo `31:2` del archivo "Billetera Virtual - Prototipos". La
pantalla de registro mantiene el lenguaje visual de la pantalla de inicio de sesión
(`specs/001-login-billetera`): panel de marca y panel de formulario con los campos Nombre
completo, Correo electrónico, Contraseña y Confirmar contraseña, casilla de términos y
condiciones y botón de creación de cuenta. Los textos exactos se toman del frame de Figma durante
la planificación.

## Clarifications

### Session 2026-10-15

- Q: Después de crear la cuenta, ¿el usuario debe poder iniciar sesión con ella en la misma
  visita? → A: No; la cuenta creada solo sirve para mostrar la bienvenida y se descarta.
- Q: (cambio de alcance solicitado por el responsable del producto tras la implementación
  inicial) ¿"Inicia sesión" debe seguir mostrando el aviso de función no disponible? → A: No;
  pasa a ser un enlace que navega a la pantalla de inicio de sesión (feature 001). Se mantiene la
  arquitectura sin enrutador: navegación por enlace estándar entre las dos entradas HTML, con
  recarga de página y sin conservar los datos del formulario. Se añaden US6 y FR-022; se ajustan
  US5, FR-019 y los supuestos. El cambio recíproco ("Regístrate" en el login) se registra en
  `specs/001-login-billetera/spec.md`.

### Session 2026-10-15 (b) — Requisitos funcionales del responsable del producto

Revisión contra la lista de requisitos entregada por el responsable del producto. Las respuestas
**reemplazan** las decisiones anteriores donde se contradicen (marcadas como *sustituida*).

- Q: ¿Qué rutas usa la aplicación? → A: una sola aplicación con React Router: `/login` (inicio de
  sesión) y `/registro`. `/` y cualquier ruta desconocida redirigen a `/login`. *Sustituye* la
  decisión "sin enrutador" (dos entradas HTML) de la clarificación anterior y de research R1/R9.
- Q: ¿Qué ocurre tras un registro exitoso? → A: se redirige a `/login` y allí se muestra un
  mensaje de éxito. *Sustituye* la vista de bienvenida dentro del registro (antiguos US1-1, US1-5,
  FR-011 y FR-012).
- Q: ¿La cuenta recién creada permite iniciar sesión? → A: No. Confirma la primera clarificación:
  la cuenta se descarta; no se crea ningún almacenamiento ni memoria para ella.
- Q: ¿Qué muestran Google y Apple? → A: un aviso "Próximamente" dentro de la página (componente
  `Alert`, no `window.alert`, que bloquea la página y empeora la accesibilidad). El enlace de
  términos y condiciones conserva el aviso "Función no disponible en esta demostración".
- Q: La lista pide "contraseña mínimo 8 caracteres"; ¿se relajan las reglas? → A: No; se mantienen
  las reglas más estrictas de FR-003 y FR-005 (cumplen el mínimo pedido y lo superan).
- Q: La lista pide "mobile: solo formulario"; ¿se elimina la franja con el logo en móvil? → A: No;
  se mantiene en login y registro (FR-018 de 001). Desviación consciente y aceptada de ese punto.

### Session 2026-10-15 (c) — Presentación del mensaje de éxito

- Q: ¿Dónde y cómo se muestra "¡Cuenta creada con éxito!" en `/login`? → A: como aviso emergente
  temporal (toast) en la esquina superior derecha (en móvil, arriba a todo el ancho), visible
  ~5 s y luego oculto. Para cumplir WCAG 2.1 AA (2.2.1, 4.1.3, 2.3.3): el tiempo se pausa con el
  puntero encima o con el foco dentro, tiene botón "Cerrar aviso", se anuncia como estado sin
  mover el foco y su animación se desactiva con `prefers-reduced-motion`. Sustituye la
  presentación dentro de la zona de avisos del formulario (2026-10-15 (b)). Los avisos
  "Próximamente" y "Función no disponible…" no cambian.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear una cuenta con datos válidos (Priority: P1)

Como persona nueva, quiero ingresar mi nombre completo, mi correo y una contraseña, aceptar los
términos y condiciones y crear mi cuenta, para empezar a usar la billetera virtual de forma
sencilla.

**Why this priority**: es el propósito central de la pantalla; sin este flujo no existe valor
demostrable.

**Independent Test**: se completan todos los campos con datos válidos, se marca la casilla de
términos, se presiona el botón de crear cuenta y se verifica que se llega a `/login` con el
mensaje de éxito.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro cargada, **When** el usuario ingresa nombre completo, correo
   no registrado, contraseña válida, la misma contraseña en la confirmación, acepta los términos y
   presiona "Crear cuenta", **Then** la aplicación redirige a `/login` y muestra el mensaje
   "¡Cuenta creada con éxito!".
2. **Given** el usuario envió el formulario con datos válidos, **When** la creación simulada de la
   cuenta está en curso, **Then** el botón muestra un estado de carga, queda deshabilitado y no
   admite envíos adicionales.
3. **Given** el usuario escribe el correo con mayúsculas o con espacios al inicio o al final,
   **When** envía datos válidos, **Then** la cuenta se crea igualmente y el correo se trata sin
   distinguir mayúsculas ni espacios periféricos.
4. **Given** el usuario está en el último campo de texto, **When** presiona la tecla Enter,
   **Then** el formulario se envía igual que al presionar "Crear cuenta".
5. **Given** el usuario llegó a `/login` tras registrarse, **When** recarga la página o vuelve a
   entrar en `/login` por otro medio, **Then** el mensaje de éxito ya no se muestra.

---

### User Story 2 - Recibir un mensaje de error cuando la cuenta no puede crearse (Priority: P1)

Como usuario, quiero que se me informe claramente cuando mi cuenta no pudo crearse, para
corregir la situación e intentarlo de nuevo.

**Why this priority**: el requerimiento exige explícitamente el mensaje de error y es
indispensable para que la demostración refleje un comportamiento de registro completo.

**Independent Test**: se envía el formulario con un correo ya registrado en la demostración y se
verifica el mensaje de error y que no hay redirección.

**Acceptance Scenarios**:

1. **Given** una cuenta de demostración ya existente, **When** el usuario envía datos válidos con
   ese mismo correo, **Then** se muestra el mensaje de error "No fue posible crear la cuenta.
   Verifica tus datos e inténtalo de nuevo." y el usuario permanece en `/registro`.
2. **Given** se muestra el mensaje de error de creación, **When** el usuario modifica cualquier
   campo, **Then** el mensaje de error desaparece.
3. **Given** un intento fallido, **When** se muestra el error, **Then** el nombre y el correo
   ingresados se conservan, los campos de contraseña se vacían, la casilla de términos conserva su
   estado y el foco se coloca en el campo de correo.
4. **Given** un fallo inesperado durante la creación simulada, **When** ocurre, **Then** se
   muestra un mensaje comprensible sin detalles técnicos y el usuario puede reintentar.

---

### User Story 3 - Validar los campos antes de enviar (Priority: P2)

Como usuario, quiero que el formulario me indique qué datos faltan o son incorrectos antes de
crear la cuenta, para corregirlos rápidamente.

**Why this priority**: mejora la usabilidad y evita intentos innecesarios, pero el flujo principal
(P1) es demostrable sin ella.

**Independent Test**: se envía el formulario vacío y luego con datos inválidos por campo, y se
verifican los mensajes asociados a cada uno.

**Acceptance Scenarios**:

1. **Given** el formulario vacío, **When** el usuario presiona "Crear cuenta", **Then** se
   muestran mensajes de campo obligatorio junto a cada campo ("Ingresa tu nombre completo",
   "Ingresa tu correo electrónico", "Ingresa una contraseña", "Confirma tu contraseña") y el
   mensaje de términos, no se ejecuta la creación y el foco se mueve al primer campo con error.
2. **Given** un nombre de menos de 2 caracteres, solo con espacios, o con caracteres no permitidos
   (por ejemplo, dígitos o símbolos), **When** el usuario sale del campo o envía, **Then** se
   muestra "Ingresa un nombre válido".
3. **Given** un correo sin formato válido (por ejemplo, "usuario@" o "usuario.com"), **When** el
   usuario sale del campo o envía, **Then** se muestra "Ingresa un correo electrónico válido".
4. **Given** una contraseña de menos de 8 caracteres o sin al menos una letra y un número,
   **When** el usuario envía, **Then** se muestra "La contraseña debe tener al menos 8 caracteres,
   una letra y un número" y no se ejecuta la creación.
5. **Given** una confirmación distinta de la contraseña, **When** el usuario sale del campo o
   envía, **Then** se muestra "Las contraseñas no coinciden".
6. **Given** la casilla de términos y condiciones sin marcar, **When** el usuario envía, **Then**
   se muestra "Debes aceptar los términos y condiciones" y no se ejecuta la creación.
7. **Given** un campo con mensaje de validación, **When** el usuario corrige el valor, **Then** el
   mensaje de ese campo desaparece.
8. **Given** un campo con error, **When** es leído por un lector de pantalla, **Then** se anuncia
   el mensaje de error asociado a ese campo.

---

### User Story 4 - Mostrar u ocultar las contraseñas (Priority: P3)

Como usuario, quiero poder ver temporalmente lo que escribí en los campos de contraseña, para
confirmar que los ingresé correctamente.

**Why this priority**: es una mejora de conveniencia presente en el diseño de acceso, no
imprescindible para crear la cuenta.

**Independent Test**: se escribe una contraseña, se activa el control de visibilidad y se
verifica que el texto se muestra; se vuelve a activar y se oculta.

**Acceptance Scenarios**:

1. **Given** una contraseña ingresada y oculta, **When** el usuario activa el control de
   visibilidad de ese campo, **Then** el texto se muestra legible y el control indica "Ocultar
   contraseña".
2. **Given** la contraseña visible, **When** el usuario vuelve a activar el control, **Then** se
   oculta y el control indica "Mostrar contraseña".
3. **Given** los controles de visibilidad, **When** el usuario los opera solo con teclado,
   **Then** puede alcanzarlos y activarlos, y su estado es anunciado por tecnologías de
   asistencia.

---

### User Story 5 - Elementos del diseño fuera del alcance de la demostración (Priority: P3)

Como usuario de la demostración, quiero que los elementos del diseño que no forman parte del
alcance (enlace a los términos y condiciones, registro con Google/Apple) me informen que no
están disponibles, para no interpretarlo como un error.

**Why this priority**: garantiza fidelidad al diseño sin ampliar el alcance funcional.

**Independent Test**: se activa cada uno de estos elementos y se verifica el aviso informativo.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario activa el enlace de términos y
   condiciones, **Then** se muestra el aviso "Función no disponible en esta demostración" y se
   conservan los datos ingresados.
2. **Given** la pantalla de registro, **When** el usuario activa "Google" o "Apple", **Then** se
   muestra el aviso "Próximamente" dentro de la página y se conservan los datos ingresados.

---

### User Story 6 - Ir a la pantalla de inicio de sesión (Priority: P3)

Como persona que ya tiene cuenta, quiero que "Inicia sesión" me lleve a la pantalla de inicio de
sesión, para no tener que buscarla por otro medio.

**Why this priority**: conecta las dos pantallas existentes de la demostración; no aporta
funcionalidad nueva de registro.

**Independent Test**: se activa "Inicia sesión" con ratón o teclado y se verifica que se trata de
un enlace hacia la pantalla de inicio de sesión.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario activa "Inicia sesión", **Then** la
   aplicación navega a `/login` sin mostrar el mensaje de éxito.
2. **Given** la pantalla de registro, **When** el usuario llega a "Inicia sesión" con Tab,
   **Then** es anunciado como enlace y se activa con Enter.

---

### Edge Cases

- El usuario presiona "Crear cuenta" varias veces seguidas: solo se procesa un intento.
- El nombre o el correo contienen espacios al inicio o al final: se ignoran al validar; los
  espacios internos múltiples del nombre se normalizan a uno.
- Las contraseñas contienen espacios: se respetan tal cual, sin recortarlas.
- Longitudes excesivas (nombre > 100 caracteres, correo > 254, contraseña > 128): se rechazan con
  mensaje de validación y no se ejecuta la creación.
- El usuario modifica la contraseña después de confirmarla: la coincidencia se revalida.
- El usuario pega texto en los campos: se acepta y se valida igual que el texto escrito.
- Nombres con tildes, "ñ", apóstrofes o guiones (por ejemplo, "María Núñez-O'Brien"): son válidos.
- Tras crear la cuenta y llegar a `/login`, el usuario recarga la página: el mensaje de éxito
  desaparece (no existe persistencia; la cuenta creada no sobrevive).
- El usuario escribe una ruta desconocida (por ejemplo `/abc`) o `/`: se redirige a `/login`.
- Ventana estrecha (dispositivo móvil): el formulario permanece completamente utilizable sin
  desplazamiento horizontal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE reproducir la estructura, textos y jerarquía visual del diseño de
  referencia de Figma (nodo `31:2`), aplicando el sistema de diseño corporativo cuando exista y
  manteniendo coherencia con la pantalla de inicio de sesión.
- **FR-002**: La pantalla DEBE permitir ingresar nombre completo, correo electrónico, contraseña y
  confirmación de contraseña, y marcar la aceptación de términos y condiciones.
- **FR-003**: El sistema DEBE validar el nombre: obligatorio, entre 2 y 100 caracteres tras
  recortar espacios, compuesto únicamente por letras (incluidas tildes y "ñ"), espacios,
  apóstrofes y guiones.
- **FR-004**: El sistema DEBE validar el correo: obligatorio, formato de correo válido y máximo
  254 caracteres.
- **FR-005**: El sistema DEBE validar la contraseña: obligatoria, entre 8 y 128 caracteres, con al
  menos una letra y un número.
- **FR-006**: El sistema DEBE validar que la confirmación sea obligatoria e idéntica a la
  contraseña.
- **FR-007**: El sistema DEBE exigir la aceptación de los términos y condiciones para crear la
  cuenta.
- **FR-008**: El sistema DEBE mostrar los mensajes de validación junto al campo correspondiente,
  al salir del campo y al intentar enviar, y DEBE ocultarlos cuando el valor se corrija.
- **FR-009**: El sistema NO DEBE ejecutar la creación de la cuenta mientras existan errores de
  validación.
- **FR-010**: El sistema DEBE simular la creación de la cuenta sin servicios backend ni base de
  datos, con una espera breve (aprox. 1 segundo) e indicador de carga durante la cual el envío
  queda deshabilitado.
- **FR-011**: Cuando los datos son válidos y el correo no corresponde a una cuenta de demostración
  ya existente, el sistema DEBE redirigir a `/login` y mostrar allí el mensaje "¡Cuenta creada con
  éxito!" en un aviso emergente temporal según 001 FR-021. *(Revisado 2026-10-15 (b) y (c);
  antes: vista de bienvenida en el registro.)*
- **FR-012**: El mensaje de éxito DEBE mostrarse una sola vez: no reaparece al recargar ni al
  llegar a `/login` por otra vía. La redirección NO DEBE transportar datos ingresados (solo un
  indicador de "registro completado"). *(Revisado 2026-10-15 (b).)*
- **FR-013**: Cuando el correo corresponde a una cuenta de demostración ya existente o la
  creación simulada falla, el sistema DEBE mostrar un mensaje de error comprensible, sin detalles
  técnicos, y NO DEBE redirigir.
- **FR-014**: Las cuentas de demostración preexistentes NO DEBEN estar escritas en el código
  fuente; DEBEN provenir de configuración externa (Constitución, regla 5.3).
- **FR-015**: El sistema NO DEBE registrar ni mostrar las contraseñas en mensajes, registros de
  diagnóstico, URL ni almacenamiento del navegador, y NO DEBE persistir ningún dato ingresado.
- **FR-016**: Los campos de contraseña DEBEN ocultar los caracteres por defecto y ofrecer un
  control accesible para mostrarlos u ocultarlos de forma independiente.
- **FR-017**: El formulario DEBE poder enviarse con la tecla Enter y operarse completamente con
  teclado, con orden de foco lógico y foco visible.
- **FR-018**: La pantalla DEBE cumplir WCAG 2.1 nivel AA: etiquetas asociadas a cada campo,
  errores y resultados anunciados automáticamente por tecnologías de asistencia y contraste
  suficiente.
- **FR-019**: El enlace de términos y condiciones DEBE mostrarse según el diseño y, al activarse,
  informar "Función no disponible en esta demostración". "Google" y "Apple" DEBEN mostrarse según
  el diseño y, al activarse, mostrar el aviso "Próximamente" dentro de la página (no un diálogo
  bloqueante del navegador). *(Revisado 2026-10-15 (b).)*
- **FR-020**: La pantalla DEBE adaptarse a anchos desde 320 px hasta escritorio sin desplazamiento
  horizontal.
- **FR-021**: Las reglas de validación (nombre, correo, contraseña) DEBEN tener una única fuente
  autorizada y reutilizar las existentes de la pantalla de inicio de sesión cuando coincidan
  (Constitución, Principio IV y regla 8.5).
- **FR-022**: "Inicia sesión" DEBE ser un enlace (rol `link`) hacia `/login`, operable con
  teclado; la navegación NO DEBE conservar ni transmitir los datos del formulario (FR-015).
  *(Revisado 2026-10-15 (b): ruta `/login` con React Router, sin recarga.)*
- **FR-023**: La pantalla de registro DEBE estar disponible en la ruta `/registro`; `/` y las rutas
  desconocidas DEBEN redirigir a `/login`. Cada ruta DEBE fijar un título de documento propio
  ("KynWallet · Crear cuenta" / "KynWallet · Iniciar sesión") (WCAG 2.4.2).

### Key Entities

- **Solicitud de registro**: datos ingresados en el formulario (nombre completo, correo,
  contraseña, confirmación y aceptación de términos) y su resultado: error de validación, cuenta
  no creada o cuenta creada. No se persiste.
- **Cuenta de demostración**: usuario preexistente definido en configuración externa; su correo
  (único, sin distinguir mayúsculas) determina si un registro nuevo es rechazado por duplicado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario con datos válidos completa el registro en menos de 90 segundos desde que
  la pantalla se muestra.
- **SC-002**: El resultado de un intento (redirección con mensaje de éxito o error) se muestra en
  un máximo de 2 segundos tras presionar "Crear cuenta".
- **SC-003**: El 100 % de los escenarios de aceptación de las historias P1 y P2 se verifican
  mediante pruebas automatizadas que pasan.
- **SC-004**: El 90 % de los participantes de una prueba de usabilidad completa el registro en el
  primer intento sin asistencia.
- **SC-005**: La pantalla no presenta incumplimientos WCAG 2.1 AA en una auditoría automatizada y
  es operable solo con teclado.
- **SC-006**: La revisión visual frente al diseño de Figma no detecta diferencias en textos,
  orden de elementos ni jerarquía visual.
- **SC-007**: El análisis de secretos no detecta credenciales en el código fuente versionado.

## Assumptions

- La demostración es exclusivamente del lado del cliente: no hay backend, base de datos, sesión
  persistente ni pantallas adicionales; el flujo termina en `/login` con el mensaje de éxito y la
  cuenta creada se descarta: no se guarda ni permite iniciar sesión con ella, ni siquiera durante
  la misma visita.
- El error de "cuenta no creada" se demuestra con un correo coincidente con una cuenta de
  demostración existente (las mismas de la pantalla de inicio de sesión, por configuración
  externa); el mensaje es genérico para no confirmar la existencia de cuentas.
- La política de contraseña (8–128 caracteres, una letra y un número) aplica solo a formato; no
  hay medidor de fortaleza ni reglas adicionales.
- El contenido de los términos y condiciones no se muestra; solo se exige su aceptación.
- La verificación de correo y el registro con Google/Apple quedan fuera del alcance; sus
  elementos se muestran solo por fidelidad al diseño. La navegación hacia el inicio de sesión sí
  está en el alcance (US6, FR-022, FR-023), con React Router.
- En móvil se mantiene la franja con el logo sobre el formulario (decisión 2026-10-15 (b)); el
  requisito del responsable del producto "mobile: solo formulario" se cumple parcialmente por
  decisión consciente.
- El idioma de la interfaz es español.
- No existen BRD ni ARD para esta funcionalidad; si se incorporan, esta especificación DEBE
  alinearse con ellos (Constitución, Principio VI).
- El diseño de referencia corresponde a escritorio; la adaptación a móvil se deriva del mismo
  diseño. Los textos exactos del frame se confirman durante la planificación.
