# Feature Specification: Pantalla de Registro de Usuarios de KynWallet

**Feature Branch**: `feature/registro-hebert-chavez`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Pantalla de Registro de Usuarios de KynWallet (frame Figma
'04 · Registro', node-id=31-2). Layout de 2 paneles en desktop y solo el formulario en mobile.
Campos nombre completo, correo, contraseña y confirmar contraseña; checkbox de términos y
condiciones; botón 'Crear cuenta' que valida todo antes de enviar; Google y Apple muestran un
alert 'Próximamente'; enlace '¿Ya tienes cuenta? Inicia sesión' a /login. Validaciones inline:
obligatorios, correo válido, contraseña mínimo 8 caracteres, contraseñas coinciden. Registro
exitoso redirige a /login con mensaje de éxito. Sin backend: la cuenta se guarda en memoria
durante la sesión del navegador y permite iniciar sesión. Rutas /login y /registro; el enlace
'Regístrate' del login lleva a /registro. Reutilizar componentes, tokens y arquitectura de
001-login-billetera."

**Diseño de referencia**: Figma, frame `04 · Registro` (nodo `31:2`). Compuesto por un panel de
marca (logo KynWallet, titular "Comienza tu camino financiero.", texto "Crea tu cuenta en minutos
y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar." y tarjeta ilustrativa
Kyn Card) y un panel de formulario ("Crea tu cuenta", "Completa tus datos para comenzar", campos
Nombre completo, Correo electrónico, Contraseña y Confirmar contraseña con control de
visibilidad, casilla "Acepto los términos y condiciones", botón "Crear cuenta", separador
"o regístrate con", botones Google y Apple, y enlace "¿Ya tienes cuenta? Inicia sesión").

**Relación con otras features**: extiende `001-login-billetera` (pantalla de inicio de sesión),
cuyo enlace "Regístrate" pasa a llevar a esta pantalla.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear una cuenta con datos válidos (Priority: P1)

Como persona nueva en KynWallet, quiero registrarme con mi nombre, correo y una contraseña, para
obtener una cuenta con la que pueda iniciar sesión.

**Why this priority**: es el propósito central de la pantalla; sin este flujo no hay registro
demostrable.

**Independent Test**: se completan los cuatro campos con datos válidos, se aceptan los términos,
se presiona "Crear cuenta" y se verifica la llegada a la pantalla de inicio de sesión con el
mensaje de éxito; luego se inicia sesión con la cuenta recién creada.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario completa nombre, un correo no
   registrado, una contraseña válida, la misma contraseña en la confirmación, acepta los términos
   y presiona "Crear cuenta", **Then** el sistema lo lleva a la pantalla de inicio de sesión
   (`/login`) y muestra el mensaje "¡Cuenta creada con éxito! Ya puedes iniciar sesión."
2. **Given** una cuenta recién registrada, **When** el usuario inicia sesión con ese correo y esa
   contraseña, **Then** accede y la bienvenida muestra el nombre completo registrado.
3. **Given** el usuario envió el formulario con datos válidos, **When** el registro simulado está
   en curso, **Then** el botón "Crear cuenta" muestra un estado de carga, queda deshabilitado y no
   admite envíos adicionales.
4. **Given** el usuario está en cualquier campo del formulario, **When** presiona Enter,
   **Then** el formulario se envía igual que al presionar "Crear cuenta".

---

### User Story 2 - Validar los datos antes de crear la cuenta (Priority: P1)

Como usuario, quiero que el formulario me indique junto a cada campo qué dato falta o es
incorrecto, para corregirlo antes de crear la cuenta.

**Why this priority**: el requerimiento exige validaciones inline y que "Crear cuenta" valide
todos los campos antes de enviar; sin ellas se crearían cuentas inválidas.

**Independent Test**: se envía el formulario vacío y luego con cada dato inválido, y se verifica
el mensaje asociado a cada campo.

**Acceptance Scenarios**:

1. **Given** el formulario vacío, **When** el usuario presiona "Crear cuenta", **Then** se
   muestran "Ingresa tu nombre completo", "Ingresa tu correo electrónico", "Ingresa tu
   contraseña", "Confirma tu contraseña" y "Debes aceptar los términos y condiciones", no se crea
   la cuenta y el foco se mueve al primer campo con error.
2. **Given** un correo sin formato válido (por ejemplo, "usuario@" o "usuario.com"), **When** el
   usuario sale del campo o envía el formulario, **Then** se muestra "Ingresa un correo
   electrónico válido".
3. **Given** una contraseña con menos de 8 caracteres, **When** el usuario sale del campo o envía
   el formulario, **Then** se muestra "La contraseña debe tener al menos 8 caracteres".
4. **Given** una confirmación distinta de la contraseña, **When** el usuario sale del campo de
   confirmación o envía el formulario, **Then** se muestra "Las contraseñas no coinciden".
5. **Given** la confirmación ya validada, **When** el usuario cambia la contraseña de modo que
   deja de coincidir, **Then** el mensaje "Las contraseñas no coinciden" se muestra en la
   confirmación sin necesidad de volver a editarla.
6. **Given** un campo con mensaje de validación, **When** el usuario corrige el valor, **Then** el
   mensaje de ese campo desaparece.
7. **Given** un campo con error, **When** es leído por un lector de pantalla, **Then** se anuncia
   el mensaje de error asociado a ese campo.

---

### User Story 3 - Rechazar un correo ya registrado (Priority: P2)

Como usuario, quiero saber si mi correo ya tiene una cuenta, para iniciar sesión en lugar de
registrarme otra vez.

**Why this priority**: evita cuentas duplicadas, pero el flujo principal es demostrable sin ella.

**Independent Test**: se intenta registrar el correo de una cuenta de demostración y se verifica
el mensaje de error.

**Acceptance Scenarios**:

1. **Given** un correo que ya pertenece a una cuenta (de demostración o registrada en la sesión),
   **When** el usuario envía el formulario con datos válidos, **Then** se muestra el mensaje "Ya
   existe una cuenta con este correo" asociado al campo de correo, no se crea la cuenta y el foco
   se mueve al correo.
2. **Given** se muestra ese mensaje, **When** el usuario modifica el correo, **Then** el mensaje
   desaparece.
3. **Given** el correo se escribe con mayúsculas o espacios periféricos, **When** coincide con
   una cuenta existente, **Then** se considera ya registrado.

---

### User Story 4 - Navegar entre registro e inicio de sesión (Priority: P2)

Como usuario, quiero moverme entre la pantalla de inicio de sesión y la de registro, para elegir
la acción que necesito.

**Why this priority**: conecta las dos pantallas de la demostración; sin ella el registro no es
alcanzable desde el login.

**Independent Test**: desde `/login` se activa "Regístrate" y se llega a `/registro`; desde
`/registro` se activa "Inicia sesión" y se vuelve a `/login`.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario activa "Inicia sesión", **Then** llega a
   la pantalla de inicio de sesión en `/login`.
2. **Given** la pantalla de inicio de sesión, **When** el usuario activa "Regístrate", **Then**
   llega a la pantalla de registro en `/registro`.
3. **Given** el usuario abre la raíz de la aplicación (`/`) o una dirección desconocida, **When**
   carga la página, **Then** se muestra la pantalla de inicio de sesión en `/login`.
4. **Given** el usuario navegó entre pantallas, **When** usa los botones atrás/adelante del
   navegador, **Then** se muestra la pantalla correspondiente a la dirección.
5. **Given** el usuario abre directamente `/registro`, **When** carga la página, **Then** se
   muestra la pantalla de registro.

---

### User Story 5 - Opciones fuera del alcance de la demostración (Priority: P3)

Como usuario, quiero que los elementos del diseño que aún no funcionan me lo indiquen, para no
pensar que la aplicación falló.

**Why this priority**: da fidelidad al diseño sin ampliar el alcance (YAGNI).

**Independent Test**: se activan "Google", "Apple" y "términos y condiciones" y se verifica el
aviso "Próximamente".

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario activa "Google" o "Apple", **Then** se
   muestra una alerta con el texto "Próximamente" y los datos ingresados se conservan.
2. **Given** la pantalla de registro, **When** el usuario activa el enlace "términos y
   condiciones", **Then** se muestra la alerta "Próximamente" y la casilla no cambia de estado.

---

### User Story 6 - Mostrar u ocultar las contraseñas (Priority: P3)

Como usuario, quiero ver temporalmente lo que escribí en contraseña y confirmación, para
verificar que coinciden.

**Why this priority**: conveniencia presente en el diseño, no imprescindible para registrarse.

**Independent Test**: se activa el control de visibilidad de cada campo y se verifica que el
texto se muestra y oculta de forma independiente.

**Acceptance Scenarios**:

1. **Given** una contraseña oculta, **When** el usuario activa su control de visibilidad,
   **Then** el texto se muestra y el control indica "Ocultar contraseña"; la confirmación no
   cambia.
2. **Given** el control de visibilidad, **When** se opera solo con teclado, **Then** es
   alcanzable, activable y su estado se anuncia a tecnologías de asistencia.

---

### Edge Cases

- El usuario presiona "Crear cuenta" varias veces seguidas: solo se procesa un registro.
- El nombre o el correo tienen espacios al inicio o al final: se ignoran al validar y guardar.
- El nombre contiene solo espacios: se trata como vacío.
- Nombre de más de 80 caracteres, correo de más de 254 o contraseña de más de 128: se rechaza con
  mensaje de validación.
- La contraseña contiene espacios: se respetan tal cual, sin recortarlos.
- El usuario pega texto en los campos: se acepta y valida igual que el texto escrito.
- La configuración de cuentas de demostración no está disponible: el registro muestra "Servicio de
  acceso no disponible. Intenta más tarde.", igual que el inicio de sesión, sin detalles internos.
- El usuario recarga la página tras registrarse: las cuentas registradas se pierden (no hay
  persistencia) y el mensaje de éxito no vuelve a mostrarse.
- El usuario abandona la pantalla de registro mientras el registro está en curso: no se produce
  ningún error visible.
- Ventana estrecha (desde 320 px): el formulario es completamente utilizable sin desplazamiento
  horizontal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE reproducir la estructura, textos y jerarquía visual del frame
  `04 · Registro` de Figma, con los colores, tipografía y componentes del sistema de diseño ya
  usados en el inicio de sesión.
- **FR-002**: El formulario DEBE ofrecer los campos Nombre completo, Correo electrónico,
  Contraseña y Confirmar contraseña, y la casilla "Acepto los términos y condiciones".
- **FR-003**: El nombre completo DEBE ser obligatorio (sin contar espacios periféricos) y no
  exceder 80 caracteres.
- **FR-004**: El correo DEBE ser obligatorio, tener formato de correo válido y no exceder 254
  caracteres, con las mismas reglas que el inicio de sesión.
- **FR-005**: La contraseña DEBE ser obligatoria y tener entre 8 y 128 caracteres, con las mismas
  reglas que el inicio de sesión.
- **FR-006**: La confirmación DEBE ser obligatoria y coincidir exactamente con la contraseña.
- **FR-007**: La aceptación de términos y condiciones DEBE ser obligatoria.
- **FR-008**: Los mensajes de validación DEBEN mostrarse junto al campo correspondiente al salir
  del campo y al intentar enviar, y DEBEN ocultarse cuando el valor se corrija.
- **FR-009**: "Crear cuenta" DEBE validar todos los campos antes de enviar; el registro NO DEBE
  ejecutarse mientras existan errores, y el foco DEBE moverse al primer campo con error.
- **FR-010**: El registro DEBE simularse sin backend ni base de datos, con una espera breve
  (aprox. 1 segundo) y un indicador de carga durante el cual el envío queda deshabilitado.
- **FR-011**: La cuenta registrada DEBE conservarse solo en memoria durante la sesión del
  navegador y DEBE permitir iniciar sesión con su correo y contraseña.
- **FR-012**: El sistema DEBE rechazar el registro de un correo que ya pertenezca a una cuenta,
  comparando sin distinguir mayúsculas ni espacios periféricos, con el mensaje "Ya existe una
  cuenta con este correo".
- **FR-013**: Un registro exitoso DEBE llevar a `/login` y mostrar allí el mensaje de éxito
  "¡Cuenta creada con éxito! Ya puedes iniciar sesión.", anunciado a tecnologías de asistencia.
- **FR-014**: Los botones "Google" y "Apple" y el enlace "términos y condiciones" DEBEN mostrar
  una alerta con el texto "Próximamente" y conservar los datos del formulario.
- **FR-015**: El enlace "¿Ya tienes cuenta? Inicia sesión" DEBE llevar a `/login`.
- **FR-016**: La aplicación DEBE ofrecer las direcciones `/login` y `/registro`; la raíz y las
  direcciones desconocidas DEBEN llevar a `/login`, y la navegación DEBE respetar los botones
  atrás/adelante del navegador.
- **FR-017**: El enlace "Regístrate" de la pantalla de inicio de sesión DEBE llevar a
  `/registro`.
- **FR-018**: Los campos de contraseña y confirmación DEBEN ocultar los caracteres por defecto y
  ofrecer cada uno un control accesible e independiente para mostrarlos u ocultarlos.
- **FR-019**: El sistema NO DEBE registrar ni mostrar la contraseña en mensajes, registros de
  diagnóstico, URL ni almacenamiento del navegador.
- **FR-020**: El formulario DEBE poder enviarse con Enter y operarse completamente con teclado,
  con orden de foco lógico y foco visible.
- **FR-021**: La pantalla DEBE cumplir WCAG 2.1 nivel AA: etiquetas asociadas, errores anunciados,
  mensajes de resultado anunciados automáticamente y contraste suficiente.
- **FR-022**: En escritorio (desde 960 px) la pantalla DEBE mostrar dos paneles (marca y
  formulario); en móvil DEBE mostrar solo el formulario, sin desplazamiento horizontal desde
  320 px.
- **FR-023**: Los errores inesperados del registro DEBEN mostrarse con un mensaje comprensible,
  sin detalles técnicos.

### Key Entities

- **Solicitud de registro**: datos ingresados en el formulario (nombre completo, correo,
  contraseña, confirmación y aceptación de términos) y su resultado: error de validación, correo
  ya registrado o cuenta creada. No se persiste.
- **Cuenta**: usuario habilitado para iniciar sesión. Atributos: correo (identificador único, sin
  distinguir mayúsculas), contraseña y nombre del titular. Proviene de la configuración de
  demostración o de un registro en la sesión actual.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario nuevo completa el registro en menos de 60 segundos desde que la pantalla
  se muestra.
- **SC-002**: El resultado del registro (redirección con éxito o error) se muestra en un máximo
  de 2 segundos tras presionar "Crear cuenta".
- **SC-003**: El 100 % de las cuentas registradas en la sesión pueden iniciar sesión en el primer
  intento con los datos ingresados.
- **SC-004**: El 100 % de los escenarios de aceptación de las historias P1 y P2 se verifican
  mediante pruebas automatizadas que pasan.
- **SC-005**: La pantalla no presenta incumplimientos WCAG 2.1 AA en una auditoría automatizada y
  es operable solo con teclado.
- **SC-006**: La revisión visual frente al frame de Figma no detecta diferencias en textos, orden
  de elementos ni jerarquía visual, en escritorio y en móvil.

## Assumptions

- La demostración es exclusivamente del lado del cliente: no hay backend, base de datos ni
  persistencia entre recargas; las cuentas registradas viven solo en memoria.
- Informar que un correo ya está registrado es aceptable en esta demo (es la práctica habitual
  en formularios de registro); en un sistema real se evaluaría frente al riesgo de enumeración de
  cuentas.
- El registro no exige verificación de correo, reglas de complejidad de contraseña adicionales ni
  la lectura de un documento de términos; el texto legal y el registro con Google/Apple quedan
  fuera del alcance y se informan como "Próximamente".
- Tras registrarse, el usuario no inicia sesión automáticamente: debe hacerlo en `/login`.
- En móvil se conserva la barra superior con el logo, igual que en el inicio de sesión, por
  coherencia de marca; el panel de marca con titular y tarjeta solo aparece en escritorio.
- No hubo acceso al MCP de Figma; el diseño se toma de la captura del frame `04 · Registro`
  incluida en el material del taller y de los tokens ya extraídos para `01 · Login`.
- El idioma de la interfaz es español.
- No existen BRD ni ARD para esta funcionalidad (Constitución, Principio VI).
