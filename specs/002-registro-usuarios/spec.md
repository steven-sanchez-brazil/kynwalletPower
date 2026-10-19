# Feature Specification: Registro de Usuarios de KynWallet

**Feature Branch**: `002-registro-usuarios`

**Created**: 2026-10-19

**Status**: Draft

**Input**: Pantalla de registro de usuarios del taller KynWallet, como continuación del login
existente. Debe reproducir el frame `04 · Registro` de Figma, validar nombre, correo, contraseña,
confirmación y aceptación de términos; mostrar "Próximamente" en Google y Apple; ofrecer acceso
a `/login`; y, tras un registro simulado exitoso, volver a `/login` con confirmación. Las cuentas
iniciales proceden de `VITE_DEMO_USERS` en `.env.local`; las nuevas solo existen en memoria y
permiten iniciar sesión hasta que se recarga la página. Sin backend, base de datos ni persistencia.

**Referencias**: [Constitución](../../.specify/memory/constitution.md),
[login existente](../001-login-billetera/spec.md) y taller
`Docs/taller-registro-kynwallet-v2.pdf` (material local no versionado). La exportación completa
del frame es `Docs/04 · Registro.png`; los recursos exportados están en `Docs/Prototipos/`.
Estos archivos están bajo `Docs/`, ignorada por Git, y sirven como referencia, no como assets
versionados de la aplicación.

**Diseño de referencia**: [Figma, frame `04 · Registro` (nodo `31:2`)](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2&t=br6flbVZqIJdpyNF-4).
La exportación completa confirma un frame de escritorio de **1440 × 1024 px**. La columna de
marca ocupa **620 × 1024 px** a la izquierda y el panel blanco restante **820 px**. El
formulario se centra en ese panel y tiene un ancho visual aproximado de **400 px**. La columna
izquierda contiene el logo KynWallet, el titular "Comienza tu camino financiero.", el texto
"Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier
lugar." y la tarjeta ilustrativa "Kyn Card". La derecha contiene "Crea tu cuenta", "Completa
tus datos para comenzar", los cuatro campos (ambas contraseñas con control de visibilidad),
"Acepto los términos y condiciones", "Crear cuenta", el separador "o regístrate con", Google,
Apple y "¿Ya tienes cuenta? Inicia sesión".

Los PNG de referencia documentan estos recursos y dimensiones originales: `Brand Panel.png`
(620 × 1024), `KynWallet.png` (125 × 25), `Card Mockup.png` (360 × 210), `Chip.png`
(38 × 28), `Card number.png` (214 × 15) y `Card holder.png` (90 × 10). El fondo de marca es
un degradado cálido coral/naranja; sus píxeles de esquina en el PNG exportado son `#FE855F`,
`#EE5225`, `#FF8A65` y `#F5683F`. El panel del formulario es blanco (`#FFFFFF`).

La especificación visual queda verificada respecto de la exportación para el tamaño del frame,
división de paneles, textos principales, assets y muestras de color indicadas. No se pudo
inspeccionar Figma por MCP; por ello no se afirman valores exactos de tipografía, medidas de
controles individuales, radios, espaciado ni tokens, y no hay un diseño móvil verificado. El
comportamiento móvil (solo formulario) procede de la consigna del taller. Los PNG están bajo
`Docs/`, ignorada por Git: no deben usarse como assets de aplicación hasta que se apruebe y
versione su incorporación en la ubicación correspondiente.

## Clarifications

### Session 2026-10-19

- **Origen de las cuentas**: el login carga cuentas ficticias iniciales desde
  `VITE_DEMO_USERS` en `.env.local`; `.env.example` solo es una plantilla y el registro no
  modifica ninguno de esos archivos.
- **Éxito del registro**: un formulario válido, con términos aceptados y correo no registrado,
  añade una cuenta a la misma colección en memoria consultada por el login. Después se navega
  a `/login` y se anuncia el éxito. La cuenta puede iniciar sesión sin recargar la página.
- **Duración de la cuenta**: al recargar o abrir una nueva sesión de la aplicación se pierden las
  cuentas registradas durante la ejecución; permanecen solo las cuentas ficticias configuradas.
  Esta demostración no crea cuentas reales.
- **Fuente del diseño**: se visualizó el frame de escritorio en el navegador compartido, sin
  acceso a la inspección de propiedades de Figma. La exportación `Docs/04 · Registro.png` y
  los assets `Docs/Prototipos/` confirman geometría general, textos, recursos y muestras de
  color; no los estilos precisos de cada control ni detalles de un frame móvil.
- **Navegación desde el login**: "Regístrate" lleva a `/registro` (FR-016).
- **Diseño móvil**: solo el formulario, sin cabecera de logo, según el literal del taller. No hay
  un frame móvil que lo verifique visualmente.
- **Términos y condiciones**: en esta demo solo se muestra la etiqueta, sin enlace ni documento.
  El texto "términos y condiciones" se resalta como en el frame, pero no es interactivo.
- **Textos de la interfaz**: se aprueban los propuestos en
  `contracts/ui-registration.md` (errores, éxito, servicio no disponible y ruta no encontrada).
- **Contraste del panel de marca**: el titular y el texto de apoyo se mantienen en blanco, como en
  el diseño original. Sobre el degradado no alcanzan WCAG AA (2,70:1 y 2,40:1; mínimos 3:1 y 4,5:1),
  por lo que el incumplimiento se registra como excepción temporal de la Constitución 9.1
  (research R10), aprobada el 2026-10-19 y con vencimiento el 2027-01-19. Aplica también al login, que
  comparte el panel.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear una cuenta de demostración (Priority: P1)

Como usuario nuevo, quiero registrar mis datos y regresar al login con una confirmación para
acceder a la demostración con la cuenta que acabo de crear.

**Why this priority**: es el resultado principal del taller; sin alta y acceso posterior no
existe un flujo de registro funcional.

**Independent Test**: completar el formulario con un correo nuevo, aceptar los términos,
registrarse, observar la confirmación en `/login` e iniciar sesión con esas credenciales.

**Acceptance Scenarios**:

1. **Given** un registro con nombre, correo nuevo, contraseña y confirmación válidos y términos
   aceptados, **When** se activa "Crear cuenta", **Then** se crea una sola cuenta de demostración
   en memoria, se navega a `/login` y se anuncia un mensaje de registro exitoso.
2. **Given** el registro anterior sin recargar la aplicación, **When** el usuario inicia sesión
   con su correo y contraseña recién registrados, **Then** el login existente muestra la
   bienvenida con el nombre indicado en el registro.
3. **Given** una cuenta creada en el registro, **When** se recarga la página, **Then** esa cuenta
   ya no permite iniciar sesión y solo siguen disponibles las cuentas ficticias configuradas.
4. **Given** una cuenta inicial configurada, **When** se registra otra cuenta y se vuelve al
   login, **Then** la cuenta inicial sigue permitiendo iniciar sesión.
5. **Given** un envío válido en curso, **When** el usuario intenta enviar de nuevo, **Then** no
   se crea otra cuenta ni se procesa una segunda solicitud.

---

### User Story 2 - Corregir datos y evitar registros duplicados (Priority: P1)

Como usuario, quiero conocer los errores junto a cada control para corregirlos antes de
registrarme sin perder los datos válidos que ya ingresé.

**Why this priority**: impide dar por exitoso un registro inválido o reemplazar una cuenta
existente.

**Independent Test**: enviar datos vacíos, incorrectos y un correo existente; comprobar los
mensajes, corregir cada error y registrar una cuenta nueva sin perder los demás valores.

**Acceptance Scenarios**:

1. **Given** el formulario vacío, **When** se pulsa "Crear cuenta", **Then** nombre, correo,
   contraseña, confirmación y aceptación de términos muestran errores junto a sus controles;
   el foco va al primer error y no se crea ninguna cuenta.
2. **Given** un correo con formato inválido o una contraseña de menos de 8 caracteres,
   **When** se abandona el campo o se intenta enviar, **Then** aparece un error específico junto
   al campo y se impide el registro.
3. **Given** contraseña y confirmación diferentes, **When** se intenta enviar, **Then** se
   indica la discrepancia junto a la confirmación y no se registra la cuenta.
4. **Given** todos los campos válidos pero términos no aceptados, **When** se intenta enviar,
   **Then** se indica que su aceptación es obligatoria y no se registra la cuenta.
5. **Given** un correo ya presente entre las cuentas iniciales o las creadas en la ejecución,
   **When** se intenta registrarlo con distinta capitalización o espacios periféricos, **Then**
   se indica que el correo ya está registrado, sin sustituir la cuenta existente.
6. **Given** un error de validación visible, **When** el usuario corrige el control, **Then** el
   error corregido desaparece y se conservan los valores de los demás controles.

---

### User Story 3 - Navegar y conocer las opciones disponibles (Priority: P2)

Como usuario, quiero volver al login o saber que el registro social no está disponible para
elegir un camino que sí funcione.

**Why this priority**: preserva la navegación solicitada por el taller sin simular proveedores
de identidad inexistentes.

**Independent Test**: activar el enlace a login y, por separado, cada botón social; comprobar
destino, aviso y conservación de datos.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** se activa "¿Ya tienes cuenta? Inicia sesión",
   **Then** se navega a `/login` y se muestra el formulario de acceso.
2. **Given** datos escritos en registro, **When** se activa Google o Apple, **Then** se anuncia
   "Próximamente", no se crea una cuenta y permanecen los datos del formulario.
3. **Given** la pantalla de registro en escritorio, **When** se visualiza, **Then** se muestran
   dos paneles; **Given** un dispositivo móvil, **When** se visualiza, **Then** se muestra solo
   el formulario y todos los controles siguen utilizables sin desplazamiento horizontal.
4. **Given** el formulario operado únicamente con teclado o lector de pantalla, **When** se
   presentan errores, éxito o avisos, **Then** se pueden alcanzar los controles en orden lógico,
   se anuncia cada mensaje y el foco permite continuar la tarea.

### Edge Cases

- El correo se compara ignorando mayúsculas y espacios periféricos, igual que en el login; la
  contraseña se compara sin recortar ni modificar.
- Se rechazan correos de más de 254 caracteres, contraseñas de más de 128 caracteres y nombres
  vacíos o de más de 80 caracteres, según las reglas de la cuenta existente.
- Cambiar la contraseña tras escribir la confirmación vuelve a invalidar la confirmación si ya
  no coincide.
- Pegar texto se valida igual que escribirlo; los campos con errores se pueden corregir sin
  perder datos de otros controles.
- Si falta o es inválida la configuración inicial de cuentas, el registro no debe informar
  éxito ni crear una colección alternativa que el login no pueda consultar: se muestra un
  mensaje de servicio no disponible, coherente con el login.
- Los errores inesperados del alta se comunican sin detalles internos ni pérdida silenciosa de
  los datos ingresados; no se anuncia éxito si la cuenta no quedó disponible para el login.
- Recargar en `/login` elimina la cuenta recién creada y el mensaje de éxito temporal, sin
  afectar las cuentas iniciales configuradas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE presentar nombre completo, correo electrónico, contraseña,
  confirmación de contraseña, aceptación de términos y condiciones y el botón "Crear cuenta".
- **FR-002**: El nombre DEBE ser obligatorio y, tras ignorar espacios periféricos, contener
  entre 1 y 80 caracteres.
- **FR-003**: El correo DEBE ser obligatorio, tener formato válido y longitud máxima de 254
  caracteres; DEBE normalizarse igual que en el login para detectar duplicados.
- **FR-004**: La contraseña DEBE ser obligatoria y tener entre 8 y 128 caracteres, sin recortar
  ni alterar los caracteres que el usuario introdujo.
- **FR-005**: La confirmación DEBE ser obligatoria y coincidir exactamente con la contraseña;
  la aceptación de términos DEBE ser obligatoria antes de crear la cuenta.
- **FR-006**: Los errores DEBEN mostrarse junto a su control al salir de él o al enviar,
  anunciarse a las tecnologías de asistencia y desaparecer al corregir la causa; un envío
  inválido NO DEBE crear una cuenta.
- **FR-007**: No DEBE aceptarse un correo ya presente entre las cuentas configuradas o creadas
  durante la ejecución; un intento duplicado NO DEBE alterar la cuenta existente.
- **FR-008**: Un registro válido DEBE añadir exactamente una cuenta a la colección en memoria
  usada por el login, conservar las cuentas iniciales y permitir autenticarse con la nueva
  cuenta hasta que se recargue la aplicación.
- **FR-009**: Tras el éxito se DEBE navegar a `/login` y anunciar una confirmación de registro
  sin incluir contraseñas ni detalles internos. Los envíos repetidos durante el alta NO DEBEN
  crear registros adicionales.
- **FR-010**: El enlace "¿Ya tienes cuenta? Inicia sesión" DEBE llevar a `/login`. Los botones
  Google y Apple DEBEN comunicar "Próximamente", sin registrar ni borrar los datos ingresados.
- **FR-011**: La pantalla DEBE presentar dos paneles en escritorio y solo el formulario en
  móvil; DEBE mantenerse utilizable desde 320 px sin desplazamiento horizontal.
- **FR-012**: Toda la interacción DEBE poder realizarse con teclado, con foco visible y
  mensajes accesibles, cumpliendo WCAG 2.1 AA.
- **FR-013**: Las cuentas creadas durante la ejecución NO DEBEN persistirse. `.env.example`
  DEBE seguir siendo una plantilla; el registro NO DEBE modificar archivos de configuración,
  introducir credenciales en código o almacenar datos del formulario en URL, registros o
  almacenamiento del navegador.
- **FR-014**: Si la configuración inicial no está disponible o falla el registro, se DEBE
  mostrar un error comprensible sin dar una falsa confirmación de alta.
- **FR-015**: En escritorio se DEBEN reproducir el frame de 1440 × 1024 px, sus dos paneles
  (marca de 620 px y formulario de 820 px), textos, jerarquía y recursos descritos. El panel
  de marca puede omitirse en móvil según el taller. Las propiedades de controles que no están
  expuestas por la exportación no se consideran verificadas.
- **FR-016**: El enlace "Regístrate" del login DEBE llevar a `/registro` sin recargar la
  página. Sustituye el aviso "Función no disponible en esta demostración" que el login de la
  feature 001 mostraba para ese elemento; los demás elementos fuera de alcance de 001 conservan
  su aviso.

### Key Entities

- **Cuenta de demostración**: correo normalizado y único, contraseña y nombre para la
  bienvenida; puede provenir de la configuración inicial o del registro de esta ejecución.
- **Intento de registro**: nombre, correo, contraseña, confirmación y aceptación de términos,
  más los errores correspondientes. La confirmación y la aceptación no son datos de la cuenta.
- **Resultado de registro**: éxito, correo duplicado o servicio no disponible; solo el éxito
  habilita la navegación con mensaje de confirmación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los escenarios de aceptación P1 y P2 se cubren mediante pruebas
  automatizadas antes de integrar el cambio.
- **SC-002**: En una ejecución sin recarga, el 100 % de los registros válidos con correo nuevo
  permite iniciar sesión con el mismo correo y contraseña; después de recargar, el 100 % de
  esas cuentas deja de estar disponible.
- **SC-003**: El 100 % de los envíos inválidos, duplicados o repetidos deja intactas las
  cuentas existentes y no presenta un mensaje de éxito.
- **SC-004**: Entre 320 px y escritorio, el formulario conserva todos sus controles
  utilizables sin desplazamiento horizontal; la auditoría automatizada no detecta
  incumplimientos WCAG 2.1 AA y se verifica la navegación solo con teclado.
- **SC-005**: Una revisión visual frente al frame `04 · Registro` confirma los textos,
  disposición, colores, tipografía y jerarquía antes de dar por aprobada la fidelidad visual.

## Assumptions and Scope

- El registro, como el login actual, es una demostración exclusivamente del lado del cliente:
  no crea una cuenta real ni utiliza backend, base de datos o sesión persistente.
- Las cuentas iniciales ficticias provienen de `VITE_DEMO_USERS` en `.env.local`. Al ser una
  aplicación cliente, estas cuentas pueden quedar visibles en el bundle; NO DEBEN usarse
  credenciales ni datos reales.
- Las cuentas creadas por el usuario duran solo hasta la recarga. El mensaje de confirmación
  también es temporal y no contiene datos personales ni secretos.
- La exportación del frame completo y los PNG de recursos verifican geometría general, textos,
  assets y las muestras de color anotadas. No se pudo inspeccionar mediante el MCP de Figma;
  familia tipográfica, estilos exactos de componentes y diseño móvil siguen pendientes.
- El contenido o destino de los términos y condiciones no se proporcionó en el taller: su
  aceptación se exige para la demo, pero no se presupone un documento legal ni se afirma que
  exista uno. Debe aclararse antes de ofrecer esta pantalla como registro real.
- El registro con Google/Apple, las cuentas persistentes, correos de verificación y la
  autenticación real quedan fuera de alcance.
