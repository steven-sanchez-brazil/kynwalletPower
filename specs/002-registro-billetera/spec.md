# Feature Specification: Pantalla de Registro de KynWallet

**Feature Branch**: `feature/registro-julio-oria` (rama existente; el directorio de la spec es `002-registro-billetera`)

**Created**: 2026-10-20

**Status**: Draft

**Input**: User description: "Pantalla de Registro de KynWallet. Diseño de dos paneles (1440x1024): panel de marca izquierdo naranja con logo KynWallet, titular, subtexto y tarjeta decorativa; panel derecho blanco con formulario de registro (nombre, correo, contraseña y confirmación, con control de visibilidad), casilla de términos y condiciones con enlace, botón de registro, separador, accesos con Google y Apple (simulados) y pie con enlace al inicio de sesión. Validaciones: correo válido, contraseñas coincidentes, términos aceptados. Registro simulado, igual que el login existente (001-login-billetera)."

**Diseño de referencia**: Figma, frame `04 · Registro` (archivo "Billetera Virtual - Prototipos", nodo `31:2`). Captura guardada en `design/registro.png`. Compuesto por un panel de marca (logo KynWallet, titular "Comienza tu camino financiero.", texto de apoyo "Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar." y tarjeta ilustrativa "Kyn Card") y un panel de formulario ("Crea tu cuenta", "Completa tus datos para comenzar", campos Nombre completo, Correo electrónico, Contraseña y Confirmar contraseña con control de visibilidad, casilla "Acepto los términos y condiciones", botón "Crear cuenta", separador "o regístrate con", accesos Google y Apple, y pie "¿Ya tienes cuenta? Inicia sesión").

**Requisitos del taller** (`taller-registro-kynwallet-v2.pdf`, fuente de verdad del alcance funcional; prevalecen sobre cualquier decisión anterior de esta spec): (1) campos nombre completo, correo, contraseña y confirmar contraseña; (2) casilla de términos y condiciones; (3) botón "Crear cuenta" que valida todos los campos antes de enviar; (4) Google y Apple muestran un `alert` "Próximamente"; (5) enlace "¿Ya tienes cuenta? Inicia sesión" que lleva a `/login`; (6) registro exitoso → redirige a `/login` con mensaje de éxito; (7) validaciones inline: correo válido, contraseña mínima de 8 caracteres, contraseñas coinciden, todos los campos obligatorios; (8) responsive: escritorio con 2 paneles y móvil solo con el formulario. Trazabilidad: (1)→FR-003; (2)→FR-008; (3)→FR-009/FR-010; (4)→FR-021; (5)→FR-020; (6)→FR-013; (7)→FR-004 a FR-009; (8)→FR-022.

**Valores visuales del diseño** (referencia para la fidelidad visual): tipografía Inter; panel de marca de 620 px con degradado de `#FF8A65` a `#EF5226`; botón principal `#FF6B3D`; enlaces `#EF5226`; textos `#16182C`, `#3D3F5C` y `#8A8BA8`; marcadores de posición `#A9ABC2`; bordes `#D7D9E6`; campos de 400 × 52 px con borde de 1,5 px y esquinas de 12 px.

## Clarifications

### Session 2026-10-20

- Q: Después de crear la cuenta con éxito, ¿qué debe ver la persona usuaria? → A: Se redirige a
  `/login`, que muestra un mensaje de éxito (sin iniciar sesión automática). *(Reemplaza la
  respuesta inicial —vista de confirmación con botón— por el requisito 6 del taller.)*
- Q: Si el correo ya existe en las cuentas de demostración, ¿qué mensaje se muestra? → A: "Ya
  existe una cuenta con este correo" junto al campo de correo (se acepta revelar la existencia,
  al ser una demostración sin datos reales).
- Q: ¿El enlace "Regístrate" del login debe llevar a esta pantalla, modificando la feature 001?
  → A: Sí; se ajusta el login y sus pruebas para que "Regístrate" navegue al registro.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear una cuenta con datos válidos (Priority: P1)

Como persona nueva, quiero ingresar mi nombre, correo y una contraseña, aceptar los términos y crear mi cuenta, para empezar a usar la billetera virtual.

**Why this priority**: es el propósito central de la pantalla; sin este flujo no hay valor demostrable.

**Independent Test**: se completan todos los campos con datos válidos, se marca la casilla de términos, se presiona "Crear cuenta" y se verifica que aparece la confirmación de cuenta creada con el nombre ingresado.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro cargada, **When** el usuario ingresa nombre, un correo no registrado, una contraseña válida, la misma contraseña en la confirmación, marca los términos y presiona "Crear cuenta", **Then** la aplicación redirige a `/login` y el formulario de inicio de sesión muestra un mensaje de éxito que menciona el nombre ingresado ("¡Cuenta creada, {nombre}! Ahora puedes iniciar sesión.").
2. **Given** el usuario envió el formulario con datos válidos, **When** el registro simulado está en curso, **Then** el botón "Crear cuenta" muestra un estado de carga, queda deshabilitado y no admite envíos adicionales.
3. **Given** el usuario escribe el correo con mayúsculas o espacios al inicio o final, **When** se registra, **Then** el correo se normaliza (sin espacios periféricos y sin distinguir mayúsculas) para validarlo y compararlo.
4. **Given** el usuario está en cualquier campo de texto, **When** presiona Enter, **Then** el formulario se envía igual que al presionar "Crear cuenta".
5. **Given** el login mostrado tras un registro exitoso, **When** el usuario comienza a escribir o envía el formulario de login, o navega a otra pantalla, **Then** el mensaje de éxito desaparece; al recargar la página `/login` el mensaje no vuelve a mostrarse y los campos aparecen vacíos.

---

### User Story 2 - Validar los campos antes de registrar (Priority: P1)

Como usuario, quiero que el formulario me indique qué datos faltan o son incorrectos, para corregirlos antes de crear mi cuenta.

**Why this priority**: las validaciones forman parte del requerimiento (correo válido, contraseñas coincidentes, términos aceptados) y evitan registros inválidos.

**Independent Test**: se envía el formulario vacío y luego con correo mal formado, contraseñas distintas y términos sin marcar, y se verifican los mensajes junto a cada campo.

**Acceptance Scenarios**:

1. **Given** todos los campos vacíos, **When** el usuario presiona "Crear cuenta", **Then** se muestra un mensaje de obligatoriedad junto a cada campo ("Ingresa tu nombre completo", "Ingresa tu correo electrónico", "Crea una contraseña", "Confirma tu contraseña"), no se ejecuta el registro y el foco se mueve al primer campo con error.
2. **Given** un correo sin formato válido (por ejemplo, "usuario@" o "usuario.com"), **When** el usuario sale del campo o envía el formulario, **Then** se muestra "Ingresa un correo electrónico válido".
3. **Given** una contraseña con menos de 8 caracteres, **When** el usuario envía el formulario, **Then** se muestra "La contraseña debe tener al menos 8 caracteres".
4. **Given** una confirmación distinta de la contraseña, **When** el usuario sale del campo de confirmación o envía el formulario, **Then** se muestra "Las contraseñas no coinciden".
5. **Given** la casilla de términos sin marcar, **When** el usuario envía el formulario, **Then** se muestra "Debes aceptar los términos y condiciones" junto a la casilla y no se ejecuta el registro.
6. **Given** un campo con mensaje de validación, **When** el usuario corrige el valor, **Then** el mensaje de ese campo desaparece.
7. **Given** un campo con error, **When** es leído por un lector de pantalla, **Then** se anuncia el mensaje de error asociado.

---

### User Story 3 - Rechazar un correo ya registrado (Priority: P2)

Como usuario, quiero saber si el correo que ingresé ya tiene una cuenta, para iniciar sesión en lugar de duplicarla.

**Why this priority**: da realismo a la demostración, pero el flujo principal (P1) es demostrable sin ella.

**Independent Test**: se registra el correo de una cuenta de demostración existente y se verifica el mensaje de error.

**Acceptance Scenarios**:

1. **Given** datos válidos con un correo que ya pertenece a una cuenta de demostración, **When** el usuario presiona "Crear cuenta", **Then** se muestra "Ya existe una cuenta con este correo" junto al campo de correo, el formulario conserva los datos ingresados (excepto las contraseñas, que se vacían) y no se muestra la confirmación.
2. **Given** se muestra el error de correo existente, **When** el usuario modifica el correo, **Then** el mensaje desaparece.

---

### User Story 4 - Mostrar u ocultar la contraseña (Priority: P3)

Como usuario, quiero poder ver temporalmente lo que escribí en los campos de contraseña, para confirmar que los ingresé correctamente.

**Why this priority**: es una mejora de conveniencia presente en el diseño, no imprescindible.

**Independent Test**: se escribe una contraseña, se activa su control de visibilidad y se verifica que el texto se muestra; se vuelve a activar y se oculta.

**Acceptance Scenarios**:

1. **Given** una contraseña oculta, **When** el usuario activa el control de visibilidad de ese campo, **Then** se muestra en texto legible y el control indica "Ocultar contraseña".
2. **Given** la contraseña visible, **When** el usuario vuelve a activar el control, **Then** se oculta y el control indica "Mostrar contraseña".
3. **Given** los campos "Contraseña" y "Confirmar contraseña", **When** el usuario usa sus controles de visibilidad, **Then** cada control actúa solo sobre su propio campo.
4. **Given** un control de visibilidad, **When** el usuario lo opera solo con teclado, **Then** puede alcanzarlo y activarlo, y su estado es anunciado por tecnologías de asistencia.

---

### User Story 5 - Navegar entre registro e inicio de sesión y elementos fuera de alcance (Priority: P3)

Como usuario, quiero poder volver al inicio de sesión desde el registro, y que los elementos del diseño que no forman parte del alcance me informen que no están disponibles.

**Why this priority**: conecta las dos pantallas y mantiene la fidelidad al diseño sin ampliar el alcance (YAGNI).

**Independent Test**: se activa "Inicia sesión" y se verifica que se muestra el login; se activan "Google", "Apple" y el enlace "términos y condiciones" y se verifica el aviso.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario activa "Inicia sesión", **Then** se muestra la pantalla de inicio de sesión.
2. **Given** la pantalla de inicio de sesión, **When** el usuario activa "Regístrate", **Then** se muestra la pantalla de registro.
3. **Given** la pantalla de registro, **When** el usuario activa "Google" o "Apple", **Then** se muestra un `alert` del navegador con el texto "Próximamente" y la pantalla conserva los datos ingresados; **And** al activar el enlace "términos y condiciones" se muestra el aviso "Función no disponible en esta demostración".

---

### Edge Cases

- El usuario presiona "Crear cuenta" varias veces seguidas: solo se procesa un intento.
- El nombre o el correo tienen espacios al inicio o al final: se ignoran al validar.
- Las contraseñas contienen espacios: se respetan tal cual, sin recortarlos.
- Nombre > 100 caracteres, correo > 254 o contraseña > 128: se rechaza con mensaje de validación y no se ejecuta el registro.
- El usuario pega texto en los campos: se acepta y se valida igual que el texto escrito.
- El usuario cambia la contraseña después de llenar la confirmación: la coincidencia se vuelve a evaluar.
- La configuración de cuentas de demostración no está disponible: se muestra "Servicio de registro no disponible. Intenta más tarde." sin exponer detalles internos.
- El usuario recarga la página en `/registro`: permanece en el registro con el formulario vacío; la cuenta recién creada no persiste.
- El usuario abre una dirección desconocida o la raíz `/`: se redirige a `/login`.
- El usuario usa los botones atrás/adelante del navegador: se muestra la pantalla que corresponde a la dirección.
- Ventana estrecha (dispositivo móvil): solo se muestra el formulario, sin panel de marca, completamente utilizable y sin desplazamiento horizontal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE reproducir la estructura, textos y jerarquía visual del diseño de referencia de Figma (`04 · Registro`), aplicando el sistema de diseño corporativo cuando exista.
- **FR-002**: La pantalla DEBE reutilizar la identidad visual ya establecida por la pantalla de inicio de sesión (panel de marca, tipografía, colores y estilo de campos y botones) para que ambas sean coherentes.
- **FR-003**: El formulario DEBE permitir ingresar nombre completo, correo electrónico, contraseña y confirmación de contraseña.
- **FR-004**: El sistema DEBE validar que el nombre sea obligatorio y no exceda 100 caracteres.
- **FR-005**: El sistema DEBE validar que el correo sea obligatorio, tenga formato válido y no exceda 254 caracteres.
- **FR-006**: El sistema DEBE validar que la contraseña sea obligatoria y tenga entre 8 y 128 caracteres.
- **FR-007**: El sistema DEBE validar que la confirmación sea obligatoria y coincida exactamente con la contraseña.
- **FR-008**: El sistema DEBE exigir que la casilla de términos y condiciones esté marcada para permitir el registro.
- **FR-009**: El sistema DEBE mostrar los mensajes de validación junto al campo correspondiente, al salir del campo y al intentar enviar, y DEBE ocultarlos cuando el valor se corrija.
- **FR-010**: El sistema NO DEBE ejecutar el registro mientras existan errores de validación.
- **FR-011**: El registro DEBE ser simulado, sin servicios backend ni base de datos: comprueba el correo contra las cuentas de demostración existentes y no persiste la cuenta creada.
- **FR-012**: El registro simulado DEBE incluir una espera breve (aprox. 1 segundo) con indicador de carga, durante la cual el envío queda deshabilitado.
- **FR-013**: Ante un registro correcto, el sistema DEBE redirigir a `/login` y mostrar allí un mensaje de éxito anunciado a tecnologías de asistencia que incluya el nombre ingresado; el mensaje DEBE desaparecer al interactuar con el login y NO DEBE persistir tras recargar.
- **FR-014**: Ante un correo ya existente, el sistema DEBE mostrar el mensaje "Ya existe una cuenta con este correo" junto al campo de correo.
- **FR-015**: Las cuentas de demostración usadas para detectar correos existentes NO DEBEN estar escritas en el código fuente; DEBEN provenir de la misma configuración externa que usa el login, conforme a la Constitución (regla 5.3).
- **FR-016**: El sistema NO DEBE registrar ni mostrar las contraseñas en mensajes, registros de diagnóstico, URL ni almacenamiento del navegador.
- **FR-017**: Cada campo de contraseña DEBE ocultar los caracteres por defecto y ofrecer un control accesible e independiente para mostrarlos u ocultarlos.
- **FR-018**: El formulario DEBE poder enviarse con la tecla Enter y operarse completamente con teclado, con orden de foco lógico y foco visible.
- **FR-019**: La pantalla DEBE cumplir WCAG 2.1 nivel AA: etiquetas asociadas a cada campo, errores anunciados por tecnologías de asistencia, mensajes de resultado anunciados de forma automática y contraste suficiente.
- **FR-020**: Cada pantalla DEBE tener su propia dirección: `/login` para el inicio de sesión y `/registro` para el registro. El enlace "Inicia sesión" DEBE llevar a `/login` y el enlace "Regístrate" del login DEBE llevar a `/registro`. La raíz `/` y las direcciones desconocidas DEBEN redirigir a `/login`; los botones atrás/adelante del navegador DEBEN funcionar.
- **FR-021**: Los botones "Google" y "Apple" DEBEN mostrarse según el diseño y, al activarse, mostrar un `alert` con el texto "Próximamente". El enlace de términos y condiciones DEBE mostrarse según el diseño y, al activarse, informar "Función no disponible en esta demostración".
- **FR-022**: La pantalla DEBE adaptarse a anchos desde 320 px hasta escritorio sin desplazamiento horizontal: en escritorio muestra dos paneles (marca y formulario) y en móvil solo el formulario.
- **FR-023**: Los errores inesperados DEBEN mostrarse con un mensaje comprensible, sin revelar detalles técnicos.

### Key Entities

- **Cuenta de demostración**: usuario existente en la configuración de la demo. Atributos: correo electrónico (identificador único, sin distinguir mayúsculas), contraseña y nombre del titular. Se usa aquí solo para detectar correos ya registrados.
- **Solicitud de registro**: datos ingresados (nombre, correo, contraseña, confirmación y aceptación de términos) y su resultado: error de validación, correo ya existente o registro exitoso. No se persiste.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario completa el registro con datos válidos en menos de 60 segundos desde que la pantalla se muestra.
- **SC-002**: El resultado de un intento (confirmación o error) se muestra en un máximo de 2 segundos tras presionar "Crear cuenta".
- **SC-003**: El 100 % de los escenarios de aceptación de las historias P1 y P2 se verifican mediante pruebas automatizadas que pasan.
- **SC-004**: El 90 % de los participantes de una prueba de usabilidad completa el registro en el primer intento sin asistencia.
- **SC-005**: La pantalla no presenta incumplimientos WCAG 2.1 AA en una auditoría automatizada de accesibilidad y es operable solo con teclado.
- **SC-006**: La revisión visual frente al diseño de Figma no detecta diferencias en textos, orden de elementos ni jerarquía visual.
- **SC-007**: El análisis de secretos no detecta credenciales en el código fuente versionado.

## Assumptions

- La demostración es exclusivamente del lado del cliente: no hay backend, base de datos ni sesión persistente; la cuenta creada no se guarda ni permite iniciar sesión después.
- La política de contraseña (8 a 128 caracteres) es la misma del login y aplica solo a formato; no hay reglas de complejidad adicionales.
- El registro con Google y Apple y la página de términos y condiciones quedan fuera del alcance; sus elementos se muestran solo por fidelidad al diseño.
- La navegación entre login y registro usa direcciones reales (`/login` y `/registro`) dentro de la misma aplicación; esta funcionalidad modifica el login: su enlace "Regístrate" deja de mostrar el aviso de "Función no disponible" y el login pasa a vivir en `/login`.
- El mensaje de éxito tras el registro viaja en la propia aplicación (no en la dirección) y se pierde al recargar.
- El punto de quiebre entre escritorio (dos paneles) y móvil (solo formulario) es el mismo que usa el login para mostrar su panel de marca completo.
- El nombre de la cuenta recién creada se usa solo en el mensaje de confirmación.
- El idioma de la interfaz es español.
- No existen BRD ni ARD para esta funcionalidad; si se incorporan, esta especificación DEBE alinearse con ellos (Constitución, Principio VI).
- El diseño de referencia corresponde a escritorio (1440 × 1024); la adaptación a móvil se deriva del mismo diseño.
- Los iconos del ojo y de Google y Apple aparecen como formas de relleno en el diseño; se usarán iconos reconocibles equivalentes.
