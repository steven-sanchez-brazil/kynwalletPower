# Feature Specification: Pantalla de Registro de Usuarios de KynWallet

**Feature Branch**: `feature/registro-luciano-baez` (feature spec-kit `002-registro-usuarios`)

**Created**: 2026-10-19

**Status**: Draft

**Input**: User description: "Construir la pantalla de Registro de Usuarios de KynWallet siguiendo
el diseño de Figma (frame `04 · Registro`,
https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2).
Formulario con nombre completo, correo electrónico, contraseña y confirmar contraseña; checkbox de
aceptación de términos y condiciones; botón 'Crear cuenta' que valide todos los campos antes de
enviar; botones de Google y Apple que muestren un alert 'Próximamente'; link '¿Ya tienes cuenta?
Inicia sesión' que lleve a /login; registro exitoso → redirige a /login con mensaje de éxito;
validaciones inline (correo válido, contraseña mínimo 8 caracteres, contraseñas coinciden, todos
los campos obligatorios); responsive: desktop con 2 paneles y mobile solo formulario. Respetar la
Constitución del proyecto y reutilizar lo construido en 001-login-billetera."

**Diseño de referencia**: Figma, frame `04 · Registro` (nodo `31:2`). Panel de marca (logo
KynWallet, titular "Comienza tu camino financiero.", texto "Crea tu cuenta en minutos y empieza a
enviar, recibir y administrar tu dinero desde cualquier lugar." y la tarjeta ilustrativa) y panel
de formulario ("Crea tu cuenta", "Completa tus datos para comenzar", campos Nombre completo,
Correo electrónico, Contraseña y Confirmar contraseña con control de visibilidad, casilla "Acepto
los términos y condiciones", botón "Crear cuenta", separador "o regístrate con", botones Google y
Apple, y enlace "¿Ya tienes cuenta? Inicia sesión").

**Depende de**: `specs/001-login-billetera/` (pantalla de login, componentes de UI, tokens y
cuentas de demostración en memoria).

## Clarifications

### Session 2026-10-19

- Q: ¿Qué significa "alert 'Próximamente'" para Google y Apple? → A: el diálogo nativo del
  navegador (`window.alert`) con el texto "Próximamente", tal como lo indica el enunciado. Es
  accesible por defecto y no altera los datos ingresados.
- Q: ¿La cuenta registrada debe poder usarse para iniciar sesión? → A: Sí, mientras la pestaña
  esté abierta. Se agrega a las cuentas de demostración en memoria; al recargar la página se
  pierde (no hay backend ni persistencia).
- Q: ¿Cómo navega la app entre `/registro` y `/login` si no existe un router? → A: con la History
  API del navegador (rutas `/login` y `/registro`; la raíz `/` muestra el login). El mensaje de
  éxito viaja en el estado del historial, nunca en la URL (Constitución 5.4).
- Q: ¿Qué hace "Regístrate" en el login, que en 001 mostraba "Función no disponible"? → A: Ahora
  navega a `/registro`. Es el único cambio de comportamiento sobre 001.
- Q: ¿Qué hace el enlace "términos y condiciones"? → A: No existe el documento: muestra el mismo
  alert "Próximamente" y no cambia el estado de la casilla.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear una cuenta con datos válidos (Priority: P1)

Como persona interesada en KynWallet, quiero registrarme con mi nombre, correo y contraseña, para
poder iniciar sesión en la billetera.

**Why this priority**: es el propósito de la pantalla; sin este flujo no hay valor demostrable.

**Independent Test**: se completan los cuatro campos con datos válidos, se acepta la casilla de
términos, se presiona "Crear cuenta" y se verifica que la app navega a `/login` con el mensaje
de éxito; luego se inicia sesión con la cuenta creada.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario completa nombre, correo, contraseña y
   confirmación válidos, acepta los términos y presiona "Crear cuenta", **Then** la app navega a
   `/login` y muestra el mensaje "¡Cuenta creada con éxito! Inicia sesión para continuar."
2. **Given** el registro enviado con datos válidos, **When** el registro simulado está en curso,
   **Then** el botón muestra "Creando cuenta…", queda deshabilitado y no admite envíos
   adicionales.
3. **Given** una cuenta recién registrada, **When** el usuario inicia sesión en `/login` con ese
   correo y contraseña, **Then** ve la bienvenida con el nombre que registró.
4. **Given** el usuario está en cualquier campo de texto del formulario, **When** presiona Enter,
   **Then** el formulario se envía igual que al presionar "Crear cuenta".
5. **Given** el mensaje de éxito en `/login`, **When** el usuario envía el formulario de login,
   **Then** el mensaje desaparece.

---

### User Story 2 - Validar los datos antes de crear la cuenta (Priority: P1)

Como usuario, quiero que el formulario me indique, junto a cada campo, qué dato falta o es
incorrecto, para corregirlo antes de crear la cuenta.

**Why this priority**: el enunciado exige validar todos los campos antes de enviar; sin
validación el registro aceptaría datos inválidos.

**Independent Test**: se envía el formulario vacío y luego con datos inválidos, y se verifican
los mensajes de cada campo y que no se ejecuta el registro.

**Acceptance Scenarios**:

1. **Given** el formulario vacío, **When** el usuario presiona "Crear cuenta", **Then** se
   muestran "Ingresa tu nombre completo", "Ingresa tu correo electrónico", "Ingresa tu
   contraseña", "Confirma tu contraseña" y "Debes aceptar los términos y condiciones", no se
   ejecuta el registro y el foco se mueve al primer campo con error.
2. **Given** un correo sin formato válido (p. ej., "usuario@"), **When** el usuario sale del
   campo, **Then** se muestra "Ingresa un correo electrónico válido".
3. **Given** una contraseña de menos de 8 caracteres, **When** el usuario sale del campo o envía,
   **Then** se muestra "La contraseña debe tener al menos 8 caracteres".
4. **Given** una confirmación distinta de la contraseña, **When** el usuario sale del campo de
   confirmación o envía, **Then** se muestra "Las contraseñas no coinciden".
5. **Given** un campo con mensaje de error, **When** el usuario corrige el valor, **Then** el
   mensaje desaparece; si cambia la contraseña y la confirmación ya fue validada, la coincidencia
   se vuelve a evaluar.
6. **Given** un campo con error, **When** un lector de pantalla lee el campo, **Then** anuncia el
   mensaje asociado (`aria-invalid` y `aria-describedby`).

---

### User Story 3 - Moverse entre registro e inicio de sesión (Priority: P2)

Como usuario que ya tiene cuenta, quiero un enlace al inicio de sesión, y desde el login quiero
llegar al registro, para moverme entre ambas pantallas sin escribir la URL.

**Why this priority**: es navegación requerida por el enunciado, pero el registro es demostrable
sin ella.

**Independent Test**: se activa "Inicia sesión" en el registro y se verifica la ruta `/login`; se
activa "Regístrate" en el login y se verifica la ruta `/registro`.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario activa "Inicia sesión", **Then** la app
   navega a `/login` y muestra el formulario de inicio de sesión sin mensajes.
2. **Given** la pantalla de login, **When** el usuario activa "Regístrate", **Then** la app
   navega a `/registro`.
3. **Given** el usuario navegó entre pantallas, **When** usa los botones Atrás/Adelante del
   navegador, **Then** se muestra la pantalla que corresponde a la URL.
4. **Given** el usuario abre directamente `/registro` en el navegador, **When** carga la app,
   **Then** se muestra la pantalla de registro.

---

### User Story 4 - Registrarse con Google o Apple (próximamente) (Priority: P3)

Como usuario, quiero saber que el registro con Google o Apple todavía no está disponible.

**Why this priority**: fidelidad al diseño sin ampliar el alcance (YAGNI).

**Independent Test**: se activa cada botón y se verifica el alert "Próximamente".

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario activa "Google" o "Apple", **Then** se
   muestra un alert con el texto "Próximamente" y los datos ingresados se conservan.
2. **Given** la pantalla de registro, **When** el usuario activa el enlace "términos y
   condiciones", **Then** se muestra el mismo alert y la casilla no cambia de estado.

---

### Edge Cases

- El correo ya pertenece a una cuenta: se muestra "No pudimos crear la cuenta con este correo. Si
  ya tienes una cuenta, inicia sesión." sin afirmar explícitamente que el correo existe; se
  conservan nombre y correo, y se vacían las contraseñas.
- Doble clic en "Crear cuenta": solo se procesa un registro.
- Correo con mayúsculas o espacios periféricos: se normaliza (trim + minúsculas) antes de validar
  la unicidad y de guardar la cuenta.
- Nombre con espacios periféricos o múltiples: se recorta y se colapsan los espacios internos.
- Nombre con dígitos o símbolos (p. ej., "Diego123"): "Ingresa un nombre válido (solo letras y
  espacios)". Se permiten letras con tilde, ñ, apóstrofo, guion y punto.
- Nombre de más de 80 caracteres, correo de más de 254 o contraseña de más de 128: mensaje de
  validación y no se registra.
- La contraseña y su confirmación no se recortan; los espacios cuentan.
- Configuración de cuentas de demostración no disponible: "Servicio de registro no disponible.
  Intenta más tarde." sin detalles internos.
- Recarga de `/login` tras el registro: el mensaje de éxito se mantiene (vive en el estado del
  historial) pero la cuenta registrada se pierde (sin persistencia).
- Ruta desconocida (p. ej., `/otra`): se muestra el login.
- Ventana de 320 px: sin desplazamiento horizontal; solo se muestra el formulario con el logo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE reproducir la estructura, textos y jerarquía visual del frame
  `04 · Registro` de Figma, reutilizando los tokens y componentes de 001.
- **FR-002**: El formulario DEBE tener los campos Nombre completo, Correo electrónico, Contraseña
  y Confirmar contraseña, cada uno con su etiqueta visible y asociada.
- **FR-003**: El formulario DEBE incluir la casilla "Acepto los términos y condiciones", sin
  marcar por defecto.
- **FR-004**: El nombre completo DEBE ser obligatorio, de 2 a 80 caracteres tras recortar, con
  solo letras (incluidas tildes y ñ), espacios, apóstrofo, guion y punto.
- **FR-005**: El correo DEBE ser obligatorio, con formato válido y hasta 254 caracteres (mismas
  reglas que 001, FR-003).
- **FR-006**: La contraseña DEBE ser obligatoria y tener entre 8 y 128 caracteres (mismas reglas
  que 001, FR-004).
- **FR-007**: La confirmación DEBE ser obligatoria y ser idéntica a la contraseña.
- **FR-008**: La aceptación de términos DEBE ser obligatoria para crear la cuenta.
- **FR-009**: Los mensajes de validación DEBEN mostrarse junto a cada campo al salir de él y al
  intentar enviar, y DEBEN ocultarse al corregir el valor.
- **FR-010**: "Crear cuenta" NO DEBE ejecutar el registro mientras exista algún error; el foco
  DEBE moverse al primer campo con error.
- **FR-011**: El registro DEBE simularse en memoria (sin backend) con una espera breve (~1 s) e
  indicador de carga "Creando cuenta…"; durante la espera el envío queda deshabilitado.
- **FR-012**: Una cuenta registrada DEBE quedar disponible para el inicio de sesión de 001
  mientras la página no se recargue.
- **FR-013**: El registro exitoso DEBE navegar a `/login` y mostrar allí el mensaje "¡Cuenta
  creada con éxito! Inicia sesión para continuar.", anunciado por tecnologías de asistencia.
- **FR-014**: Si el correo ya está registrado, el sistema DEBE mostrar el mensaje genérico de los
  casos límite y NO DEBE crear una cuenta duplicada.
- **FR-015**: "Google" y "Apple" DEBEN mostrar un alert "Próximamente" sin modificar los datos
  ingresados. El enlace "términos y condiciones" DEBE comportarse igual.
- **FR-016**: "¿Ya tienes cuenta? Inicia sesión" DEBE navegar a `/login`; en el login,
  "Regístrate" DEBE navegar a `/registro`.
- **FR-017**: La app DEBE resolver las rutas `/registro` (registro) y `/login` o cualquier otra
  (login), y reaccionar a Atrás/Adelante del navegador.
- **FR-018**: Las contraseñas NO DEBEN registrarse ni mostrarse en mensajes, consola, URL ni
  almacenamiento del navegador; el mensaje de éxito NO DEBE viajar en la URL.
- **FR-019**: Ambos campos de contraseña DEBEN ocultar los caracteres por defecto y ofrecer el
  control accesible de visibilidad de 001.
- **FR-020**: La pantalla DEBE operarse completamente con teclado, enviarse con Enter y cumplir
  WCAG 2.1 AA.
- **FR-021**: En escritorio (≥ 960 px) la pantalla DEBE mostrar dos paneles (marca y formulario);
  en móvil DEBE mostrar solo el formulario con el logo, sin desplazamiento horizontal desde
  320 px.
- **FR-022**: Los errores inesperados DEBEN mostrarse con un mensaje comprensible sin detalles
  técnicos.

### Key Entities

- **Solicitud de registro**: datos del formulario (nombre completo, correo, contraseña,
  confirmación y aceptación de términos). No se persiste.
- **Cuenta de demostración** (de 001): correo (único, sin distinguir mayúsculas), contraseña y
  nombre del titular. El registro agrega una cuenta nueva a la lista en memoria.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario completa el registro en menos de 60 segundos desde que se muestra la
  pantalla.
- **SC-002**: El resultado del registro (navegación o error) se muestra en un máximo de 2
  segundos tras presionar "Crear cuenta".
- **SC-003**: El 100 % de los escenarios de aceptación de US1 y US2 se verifican con pruebas
  automatizadas que pasan; las pruebas de 001 siguen pasando.
- **SC-004**: La pantalla no presenta violaciones WCAG 2.1 AA en la auditoría automatizada (axe).
- **SC-005**: La revisión visual frente al frame `04 · Registro` no detecta diferencias de textos,
  orden de elementos ni jerarquía.
- **SC-006**: `npm run verify` termina sin errores (lint, formato, tipos, cobertura ≥ 80 %,
  build, auditorías y escaneo de secretos).

## Assumptions

- Demo solo-cliente: sin backend, base de datos ni envío de correos de verificación.
- La cuenta registrada vive en memoria; se pierde al recargar.
- Sin reglas de complejidad de contraseña más allá de la longitud (igual que 001).
- No existen BRD ni ARD para esta funcionalidad (Constitución, Principio VI).
- Idioma de la interfaz: español.
- Los colores de Figma que no alcanzan WCAG AA se sustituyen por los tokens accesibles ya
  definidos en 001 (research R3 de 001).
- El MCP de Figma no estaba disponible al especificar; se usó la imagen del frame incluida en el
  enunciado del taller (alternativa permitida por el taller).
