# Feature Specification: Pantalla de Registro de Usuarios de KynWallet

**Feature Branch**: `002-registro-usuarios`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Crea la especificación funcional spec.md para la pantalla de Registro de Usuarios de KynWallet, consultando el frame "04  Registro" mediante el MCP de Figma. Requerimientos Funcionales y de Negocio: 1. Formulario y Campos: - Nombre completo (campo obligatorio). - Correo electrónico (formato válido). - Contraseña (mínimo 8 caracteres). - Confirmar contraseña (debe coincidir). - Checkbox obligatorio para aceptación de Términos y condiciones. 2. Validaciones e Interacción: - Validaciones inline para correo, longitud de contraseña y coincidencia. - Botón "Crear cuenta": debe validar la integridad antes del envío. 3. Autenticación Social y Navegación: - Botones Google y Apple con alert "Próximamente". - Enlace "¿Ya tienes cuenta? Inicia sesión" redirigiendo a /login. 4. Flujo Exitoso: - Redirección automática a /login al completar el registro con mensaje de éxito. 5. Responsive Design: - Desktop: 2 paneles (panel izquierdo KynCard, panel derecho formulario). - Mobile: 1 panel adaptativo (formulario)."

**Diseño de referencia**: Figma, archivo `Billetera Virtual - Prototipos` (`f7uDsv8sh6ZOtK2OitTqtg`), frame `04 · Registro` (nodo `31:2`, enlace: `https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual--Prototipos?node-id=31-2`).

### Especificación Visual del Diseño (Figma `04 · Registro`, nodo `31:2`)

1. **Distribución de Paneles (Desktop vs. Mobile)**:
   - **Desktop (`1440 × 1024 px`, ancho `≥ 960 px`)**: disposición de **2 paneles** en paralelo:
     - **Panel izquierdo (`BrandPanel`)**: ancho fijo de `620 px` en `≥ 1280 px` (`43 %` entre `960 px` y `1279 px`), `min-height: 100dvh`, `padding: 64px 56px`, con fondo en degradado corporativo (`linear-gradient(121.19deg, #ff8a65 0%, #ef5226 70.71%)`) y distribución vertical (`justify-content: space-between`) que contiene el encabezado con el logo KynWallet, el bloque de titular de marca y la tarjeta ilustrativa **KynCard**.
     - **Panel derecho (`FormPanel`)**: fondo blanco (`--neutral-0: #ffffff`), centrado vertical y horizontalmente (`padding: 40px 24px`), con un contenedor de formulario de ancho máximo `400 px` y separación vertical (`gap`) de `22 px` (ajustado según densidad de campos del frame `31:2`).
   - **Mobile (ancho `< 960 px`, desde `320 px`)**: disposición adaptativa de **1 panel** centrado en el formulario (con cabecera superior compacta para el logo y `padding: 32px 16px` en `< 480 px`), ocultando el titular promocional y la tarjeta **KynCard** para priorizar la tarea de registro sin desplazamiento horizontal.

2. **Elementos de la Tarjeta Ilustrativa KynCard y Panel de Marca**:
   - **Identidad**: isotipo SVG (`20 × 44 px`) junto al texto `"KynWallet"` (`26 px`, `Bold`, `#ffffff`).
   - **Titular y subtítulo**: titular `"Tu dinero, sin fronteras."` (`44 px`, `Bold`, `line-height: 1.08`, `#ffffff`, ancho máx. `508 px`) y subtítulo `"Envía, recibe y paga en segundos. Una billetera pensada para tu día a día."` (`17 px`, `Regular`, `line-height: 1.5`, `rgba(255, 255, 255, 0.85)`).
   - **Tarjeta KynCard** (`aria-hidden="true"`, decorativa): contenedor de `360 × 210 px`, `padding: 24px 26px`, radio de borde `22 px` (`--radius-card`), superficie translúcida `rgba(255, 255, 255, 0.16)` (`--card-surface`) y borde `1px solid rgba(255, 255, 255, 0.35)` (`--card-border`), compuesta por:
     - **Fila superior**: etiqueta `"Kyn Card"` (`15 px`, `SemiBold`, `#ffffff`) a la izquierda y chip dorado (`38 × 28 px`, radio `6 px`, `rgba(255, 217, 128, 0.9)`) a la derecha.
     - **Fila central**: número enmascarado `"5294  ••••  ••••  4827"` (`20 px`, `Medium`, `letter-spacing: 1px`, `#ffffff`).
     - **Fila inferior**: titular `"STEVEN LUNA"` a la izquierda y vencimiento `"12/29"` a la derecha (`13 px`, `Medium`, `rgba(255, 255, 255, 0.9)`).

3. **Paleta de Colores y Tokens (Figma + Tokens Accesibles WCAG 2.1 AA)**:
   - **Variables base de Figma**: `--neutral-0: #ffffff` (fondo de panel de formulario e inputs), `--neutral-300: #d7d9e6` (divisor y bordes base), `--neutral-400: #a9abc2` (placeholders base), `--neutral-500: #8a8ca8` (subtítulo, separador y textos de apoyo base), `--neutral-700: #3d3f5c` (etiquetas de campos, ratio `10.17:1`), `--neutral-900: #16182c` (título principal, texto de inputs y botones sociales), `--brand-500: #ff6b3d` (acento primario de marca), `--brand-600: #ef5226` (acento secundario y enlaces base).
   - **Tokens accesibles derivados (Constitución 8.4 — WCAG 2.1 AA)**: `--brand-700: #d04721` (`4.56:1` sobre blanco para botón principal `"Crear cuenta"` y enlaces interactivos), `--brand-800: #b03b1b` (hover de botón principal), `--neutral-600: #73748b` (`4.57:1` para subtítulos, placeholders y textos secundarios), `--neutral-border: #92949c` (`3.03:1` para bordes de inputs y controles), `--danger-600: #c62828` (`5.62:1` para errores inline y alertas).

4. **Tipografía y Dimensiones de Controles**:
   - **Familia tipográfica**: `Inter` (`@fontsource-variable/inter`).
   - **Escala tipográfica del formulario**: título principal `"Crear cuenta"` (`30 px`, `Bold`, `--neutral-900`), subtítulo del encabezado (`16 px`, `Regular`, `--neutral-600`), etiquetas de campos (`14 px`, `Medium`, `--neutral-700`), texto de entrada y placeholders (`15–16 px`, `Regular`), texto de botón principal `"Crear cuenta"` (`16 px`, `SemiBold`, `#ffffff`), texto de casilla de términos, separador `"o continúa con"` y pie `"¿Ya tienes cuenta? Inicia sesión"` (`14 px`).
   - **Geometría de controles**: campos de entrada (`Nombre completo`, `Correo electrónico`, `Contraseña`, `Confirmar contraseña`) y botón `"Crear cuenta"` con alto de `52 px` (`--control-height`) y radio de `12 px` (`--radius-control`); botones sociales (`Google`, `Apple`) en fila de 2 columnas con alto de `48 px` (`--social-height`) y radio de `12 px`; casilla de verificación (`checkbox`) con radio de `6 px` (`--radius-checkbox`).

## Clarifications

### Session 2026-10-15

- Q: ¿Cómo debe presentarse el mensaje de éxito y realizarse la redirección automática a `/login` tras completar el registro? (FR-009) → A: Mostrar el mensaje de éxito en la vista de registro durante una breve pausa (~1.5 s) antes de redirigir automáticamente a `/login`.
- Q: ¿Cómo debe presentarse el aviso "Próximamente" al pulsar los botones de Google o Apple en la pantalla de registro? (FR-007) → A: Mostrar un banner `Alert` integrado en la pantalla con el texto `"Próximamente"` (accesible vía `role="status"` y sin bloquear el hilo del navegador).
- Q: ¿Debe la cuenta recién creada en el registro permitir iniciar sesión inmediatamente al ser redirigido a `/login`, y debe el enlace "Regístrate" de `/login` navegar a `/register`? (FR-008) → A: Conectar la navegación bidireccional (`/login` ↔ `/register`) y guardar la cuenta creada en memoria de sesión para que pueda autenticarse de inmediato en `/login`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear cuenta con datos válidos y redirigir al inicio de sesión (Priority: P1)

Como nuevo usuario de KynWallet, quiero completar el formulario de registro con mi nombre completo, correo electrónico, contraseña, confirmación de contraseña y aceptación de términos y condiciones para crear mi cuenta y ser redirigido automáticamente a la pantalla de inicio de sesión (`/login`) con una confirmación de éxito.

**Why this priority**: constituye el flujo principal de valor del registro de usuarios; sin la capacidad de completar el alta y transicionar hacia `/login`, la pantalla no cumple su objetivo de negocio.

**Independent Test**: se completan todos los campos con datos válidos, se marca la casilla de Términos y condiciones, se presiona "Crear cuenta" y se verifica que se muestra el mensaje de registro exitoso y se redirige automáticamente a `/login`.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro cargada, **When** el usuario ingresa un nombre completo válido, un correo electrónico con formato válido y no registrado previamente, una contraseña de al menos 8 caracteres, una confirmación de contraseña idéntica, marca la casilla de aceptación de Términos y condiciones y presiona "Crear cuenta", **Then** el sistema registra la cuenta en el almacén en memoria de la sesión, muestra una alerta de éxito en la vista de registro confirmando la creación de la cuenta y, tras una breve pausa (~1.5 segundos), redirige automáticamente al usuario a `/login`, donde puede iniciar sesión de inmediato con las credenciales recién creadas.
2. **Given** que el usuario envió el formulario con todos los datos válidos, **When** el proceso de creación de cuenta está en curso, **Then** el botón "Crear cuenta" muestra un estado de carga, permanece deshabilitado y bloquea envíos duplicados.
3. **Given** que el usuario escribe su nombre completo o correo electrónico con espacios al inicio o al final, o el correo con letras mayúsculas, **When** envía el formulario válido, **Then** el sistema recorta los espacios periféricos en ambos campos y normaliza el correo sin distinguir mayúsculas.
4. **Given** que el usuario se encuentra en cualquiera de los campos de texto del formulario, **When** presiona la tecla Enter, **Then** se intenta enviar el formulario aplicando las mismas validaciones de integridad que al presionar el botón "Crear cuenta".

---

### User Story 2 - Validar campos en línea y verificar integridad antes del envío (Priority: P1)

Como usuario en proceso de registro, quiero recibir retroalimentación inmediata en línea sobre el formato de mi correo, la longitud de mi contraseña, la coincidencia de contraseñas y los campos obligatorios antes de enviar el formulario, para corregir errores rápidamente sin perder la información ingresada.

**Why this priority**: es un requerimiento funcional explícito e indispensable para garantizar la integridad de los datos antes de permitir la creación de la cuenta (Principio V de Seguridad por Diseño).

**Independent Test**: se interactúa con los campos introduciendo valores vacíos o inválidos (correo mal formado, contraseña corta, confirmación distinta, términos sin aceptar) y se comprueba que aparecen los mensajes de error inline junto a cada campo y que el envío queda bloqueado hasta corregirlos.

**Acceptance Scenarios**:

1. **Given** el formulario con uno o más campos vacíos o con la casilla de Términos y condiciones desmarcada, **When** el usuario presiona "Crear cuenta", **Then** el sistema bloquea el envío, muestra los mensajes de obligatoriedad correspondientes junto a cada campo faltante ("Ingresa tu nombre completo", "Ingresa tu correo electrónico", "Ingresa tu contraseña", "Confirma tu contraseña", "Debes aceptar los términos y condiciones") y mueve el foco al primer campo con error.
2. **Given** el campo de correo electrónico, **When** el usuario ingresa un valor sin formato de correo válido (por ejemplo, `usuario@` o `usuario.com`) y sale del campo o intenta enviar el formulario, **Then** se muestra en línea el mensaje "Ingresa un correo electrónico válido" y no se procesa el registro.
3. **Given** el campo de contraseña, **When** el usuario ingresa menos de 8 caracteres y sale del campo o intenta enviar el formulario, **Then** se muestra en línea el mensaje "La contraseña debe tener al menos 8 caracteres" y no se procesa el registro.
4. **Given** los campos de contraseña y confirmar contraseña, **When** el valor de confirmar contraseña no coincide exactamente con el de contraseña al salir del campo o al intentar enviar el formulario, **Then** se muestra en línea el mensaje "Las contraseñas no coinciden" junto al campo de confirmación y no se procesa el registro.
5. **Given** cualquier campo o casilla que muestre un mensaje de validación en línea, **When** el usuario modifica el valor hasta cumplir la regla correspondiente, **Then** el mensaje de error de ese campo desaparece inmediatamente.
6. **Given** un correo electrónico que ya pertenece a una cuenta existente, **When** el usuario intenta completar el registro, **Then** el sistema rechaza la operación e informa mediante un mensaje claro que no es posible completar el registro con los datos ingresados, conservando el nombre y correo en el formulario y limpiando los campos de contraseña.

---

### User Story 3 - Navegar al inicio de sesión y consultar opciones de autenticación social (Priority: P2)

Como usuario en la pantalla de registro, quiero poder ir a la pantalla de inicio de sesión si ya tengo una cuenta, o recibir un aviso claro al pulsar los botones de Google y Apple, para navegar sin confusión por las opciones disponibles.

**Why this priority**: completa los flujos de navegación requeridos entre pantallas (`/login` ↔ `/register`) y define el comportamiento esperado de los botones de autenticación social presentes en el diseño de Figma.

**Independent Test**: se pulsan los botones "Google" y "Apple" verificando la aparición del aviso "Próximamente", y se pulsa el enlace "¿Ya tienes cuenta? Inicia sesión" verificando la redirección a `/login` (así como el enlace "Regístrate" desde `/login` hacia `/register`).

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario presiona el botón "Google" o el botón "Apple", **Then** el sistema muestra un banner `Alert` integrado en la pantalla (`role="status"`) con el texto "Próximamente" y conserva intactos los datos que el usuario haya escrito en el formulario.
2. **Given** la pantalla de registro (`/register`), **When** el usuario activa el enlace "¿Ya tienes cuenta? Inicia sesión", **Then** el sistema navega a la ruta `/login`; de manera recíproca, al activar "Regístrate" en `/login`, el sistema navega a `/register`.

---

### User Story 4 - Visualizar diseño adaptativo en Desktop y Mobile y controlar visibilidad de contraseñas (Priority: P3)

Como usuario que accede desde distintos dispositivos, quiero ver la pantalla dividida en dos paneles (panel izquierdo con KynCard y panel derecho con el formulario) en escritorio y un único panel adaptativo con el formulario en móvil, además de poder mostrar u ocultar las contraseñas escritas, para disfrutar de una experiencia cómoda, accesible y fiel al diseño.

**Why this priority**: asegura la fidelidad visual con el frame `04 · Registro` de Figma, la adaptabilidad multi-dispositivo y la usabilidad al escribir contraseñas.

**Independent Test**: se inspecciona la pantalla en resolución de escritorio (≥ 960 px) comprobando los 2 paneles (KynCard a la izquierda y formulario a la derecha) y en resolución móvil (< 960 px, hasta 320 px) comprobando el panel único adaptativo sin scroll horizontal; adicionalmente se alterna la visibilidad en ambos campos de contraseña.

**Acceptance Scenarios**:

1. **Given** un dispositivo o ventana en vista Desktop (ancho ≥ 960 px), **When** se renderiza la pantalla de registro, **Then** se muestran 2 paneles: el panel izquierdo de marca con la tarjeta KynCard y el panel derecho con el formulario de registro.
2. **Given** un dispositivo o ventana en vista Mobile (ancho < 960 px, desde 320 px), **When** se renderiza la pantalla de registro, **Then** se muestra 1 único panel adaptativo centrado en el formulario (con cabecera compacta de marca), ocultando el bloque ilustrativo de KynCard y sin generar desplazamiento horizontal.
3. **Given** los campos "Contraseña" y "Confirmar contraseña" con caracteres ocultos por defecto, **When** el usuario activa el control de visibilidad de cualquiera de ellos, **Then** ese campo alterna entre mostrar y ocultar sus caracteres en texto legible de manera independiente y accesible por teclado.

---

### Edge Cases

- **Clics repetidos en "Crear cuenta"**: mientras la validación o el envío están en curso, solo se procesa una solicitud y el botón permanece deshabilitado.
- **Modificación de la contraseña principal después de haber escrito la confirmación**: si el usuario cambia el campo "Contraseña" y deja de coincidir con "Confirmar contraseña", la validación de coincidencia debe detectar la discrepancia antes de permitir el envío.
- **Espacios en blanco**: en "Nombre completo" y "Correo electrónico" se ignoran los espacios iniciales y finales; un nombre compuesto únicamente por espacios se rechaza como vacío. En "Contraseña" y "Confirmar contraseña" los espacios internos o periféricos se respetan exactamente tal como fueron ingresados.
- **Límites de longitud máxima**: para proteger el límite del sistema (Constitución 5.1), el nombre completo no debe superar 120 caracteres, el correo electrónico no debe superar 254 caracteres y la contraseña no debe superar 128 caracteres; si se exceden, se muestra el mensaje de validación correspondiente y se impide el envío.
- **Correo ya registrado**: si el usuario intenta registrarse con un correo electrónico que ya existe en las cuentas configuradas o registradas en la sesión, se impide el alta y se informa al usuario sin exponer detalles técnicos internos.
- **Enlace de Términos y condiciones**: la casilla debe permitir marcar/desmarcar la aceptación con teclado y puntero; si el texto incluye enlace de consulta de términos no implementado en el alcance actual, muestra un aviso informativo sin borrar los datos del formulario.
- **Pegado de texto**: se permite pegar contenido en todos los campos (incluidos correo, contraseña y confirmación) ejecutando las mismas validaciones en línea.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE reproducir la estructura, textos y jerarquía visual del frame `04 · Registro` de Figma, reutilizando los tokens y componentes del sistema de diseño corporativo de KynWallet (Constitución 8.5 y 8.6).
- **FR-002**: El formulario DEBE incluir los siguientes campos y controles de entrada:
  - **Nombre completo**: campo de texto obligatorio (entre 2 y 120 caracteres tras recortar espacios periféricos).
  - **Correo electrónico**: campo de texto obligatorio con formato de correo válido y longitud máxima de 254 caracteres.
  - **Contraseña**: campo de entrada oculta obligatorio con una longitud mínima de 8 caracteres y máxima de 128 caracteres.
  - **Confirmar contraseña**: campo de entrada oculta obligatorio cuyo valor DEBE coincidir exactamente con el campo "Contraseña".
  - **Aceptación de Términos y condiciones**: casilla de verificación (`checkbox`) obligatoria.
- **FR-003**: El sistema DEBE ejecutar validaciones en línea (inline) para el formato de correo electrónico, la longitud mínima de la contraseña (8 caracteres) y la coincidencia entre contraseña y confirmación de contraseña, mostrando los errores junto al campo correspondiente al perder el foco (`blur`) o al intentar enviar, y ocultándolos en cuanto el usuario corrija el valor.
- **FR-004**: El botón **"Crear cuenta"** DEBE validar la integridad completa de todos los campos y de la casilla de Términos y condiciones antes del envío; el sistema NO DEBE ejecutar el registro mientras exista cualquier error de validación.
- **FR-005**: Cuando el envío se bloquee por errores de validación, el sistema DEBE mostrar los mensajes de error en todos los campos inválidos y trasladar el foco automáticamente al primer campo con error.
- **FR-006**: Los campos "Contraseña" y "Confirmar contraseña" DEBEN enmascarar los caracteres por defecto y ofrecer cada uno un control accesible ("Mostrar contraseña" / "Ocultar contraseña") para alternar su visibilidad.
- **FR-007**: La pantalla DEBE mostrar los botones de autenticación social **"Google"** y **"Apple"**; al activarse cualquiera de ellos, el sistema DEBE mostrar un banner `Alert` integrado en la pantalla (`role="status"`) con el texto **"Próximamente"** conservando los datos ingresados en el formulario.
- **FR-008**: La pantalla DEBE incluir el enlace **"¿Ya tienes cuenta? Inicia sesión"**, el cual al activarse DEBE redirigir a la ruta `/login`; asimismo, el enlace **"Regístrate"** en `/login` DEBE navegar a `/register`.
- **FR-009**: Al completar el registro con datos válidos, el sistema DEBE almacenar la nueva cuenta en el almacén en memoria de la sesión, mostrar un mensaje de éxito en la vista de registro confirmando la creación de la cuenta y, tras una breve pausa (~1.5 segundos), ejecutar la redirección automática a la ruta `/login`, permitiendo que la nueva cuenta pueda iniciar sesión de inmediato.
- **FR-010**: Durante el procesamiento del registro y la visualización del mensaje de éxito previo a la redirección, el botón "Crear cuenta" DEBE permanecer deshabilitado para evitar envíos múltiples, transicionando automáticamente a `/login` al finalizar.
- **FR-011**: El sistema NO DEBE almacenar, exponer ni registrar contraseñas en texto plano en logs, URLs, mensajes de error ni archivos versionados (Constitución 5.3 y 5.4).
- **FR-012**: La interfaz DEBE implementar **Responsive Design** conforme a las siguientes reglas:
  - **Desktop** (≥ 960 px): disposición en **2 paneles**, con el panel izquierdo mostrando la identidad de marca y la tarjeta ilustrativa **KynCard**, y el panel derecho mostrando el formulario de registro.
  - **Mobile** (< 960 px, desde 320 px): disposición en **1 panel adaptativo** centrado en el formulario (ocultando el panel ilustrativo de la tarjeta KynCard) sin desplazamiento horizontal.
- **FR-013**: La pantalla DEBE ser operable íntegramente con teclado (orden de tabulación lógico, foco visible y envío con tecla Enter) y cumplir como mínimo **WCAG 2.1 nivel AA** (etiquetas asociadas a cada control, estados de error con `aria-invalid` y mensajes vinculados mediante `aria-describedby`, anuncios automáticos de alertas y ratios de contraste ≥ 4.5:1 en textos y ≥ 3:1 en bordes de controles, conforme a la Constitución 8.4).
- **FR-014**: Ante cualquier fallo inesperado o intento de registro con un correo ya utilizado, el sistema DEBE presentar un mensaje comprensible para el usuario sin revelar trazas ni detalles internos (Constitución 5.5).

### Key Entities

- **Solicitud de Registro**: representa los datos capturados en el formulario (nombre completo, correo electrónico, contraseña, confirmación de contraseña y estado de aceptación de términos y condiciones) junto con el estado de validación de cada campo.
- **Cuenta de Usuario Registrada**: representa la cuenta creada tras un flujo de registro exitoso en la demostración (correo electrónico normalizado en minúsculas como identificador único, nombre completo del titular y credencial de acceso en memoria de sesión), habilitada para autenticarse posteriormente en `/login`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario nuevo puede completar el formulario de registro y llegar a `/login` en menos de 60 segundos desde que carga la pantalla.
- **SC-002**: El 100 % de las validaciones en línea (nombre obligatorio, formato de correo, longitud mínima de 8 caracteres en contraseña, coincidencia de contraseñas y aceptación obligatoria de términos) proporcionan retroalimentación visual inmediata (≤ 100 ms tras salir del campo o presionar "Crear cuenta").
- **SC-003**: Tras enviar un formulario válido, la confirmación de éxito en la vista de registro y la posterior redirección automática a `/login` se completan en un máximo de 2 segundos.
- **SC-004**: El 100 % de los escenarios de aceptación de las historias de usuario (P1, P2 y P3) están cubiertos por pruebas automatizadas que pasan siguiendo el ciclo TDD (Constitución, Principio I).
- **SC-005**: La pantalla supera una auditoría automatizada de accesibilidad WCAG 2.1 nivel AA con 0 violaciones tanto en estado inicial como con errores de validación visibles.
- **SC-006**: La interfaz se visualiza correctamente en 2 paneles en resoluciones Desktop (≥ 960 px) y en 1 panel adaptativo en resoluciones Mobile (320 px a 959 px) sin presentar desplazamiento horizontal en ningún ancho de ventana.

## Assumptions

- **Alcance de demostración en cliente**: al igual que la pantalla de Login (`001-login-billetera`), la aplicación opera en el cliente sin servicios backend ni base de datos externa; el registro exitoso almacena la cuenta en el almacén en memoria compartido durante la sesión activa para que el usuario pueda probar el inicio de sesión inmediato tras ser redirigido a `/login`.
- **Navegación bidireccional entre `/register` y `/login`**: el enlace "¿Ya tienes cuenta? Inicia sesión" en Registro navega a `/login` y el enlace "Regístrate" en Login navega a `/register`.
- **Mensaje de éxito y redirección**: al completar el registro válido se muestra el mensaje de éxito directamente en la vista de registro durante una pausa breve (~1.5 s) y luego se redirige automáticamente a `/login`.
- **Política de contraseña**: se valida longitud mínima de 8 caracteres y máxima de 128 caracteres, además de coincidencia exacta con el campo "Confirmar contraseña", sin exigir reglas adicionales de caracteres especiales salvo que se especifiquen en un BRD posterior.
- **Tokens accesibles**: se reutilizan los tokens de color ajustados para cumplir WCAG 2.1 AA definidos en `001-login-billetera` (`--brand-700`, `--neutral-600`, `--neutral-border`) junto con las variables originales del frame de Figma.
- **Conformidad con BRD/ARD**: no existen documentos BRD o ARD adicionales en el repositorio; cualquier incorporación futura prevalecerá según el Principio VI de la Constitución.
