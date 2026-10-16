# Feature Specification: Registro de Usuarios de KynWallet

**Feature Branch**: `feature/registro-pedro-gandola`

**Created**: 2026-10-15

**Status**: Especificación revisada para ejecución; aprobación humana final pendiente.

**Input**: requisitos del taller de Registro y solicitud de avanzar paso a paso conservando
la intención de cada etapa. El prompt utilizado está registrado en la
[bitácora del harness](../../harness/sdd/registro-usuarios-log.md).
La [consigna vigente de Specify](../../harness/sdd/specify/registro-usuarios.md) se mantiene
separada del resultado de esta especificación.

**Diseño de referencia**: [04 Registro](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2),
nodo `31:2`. Se recibió la [extracción local](design/extraction-notes.md) obtenida por Claude
desde la copia `pMArqPGrwekkonUVIZLSn4`. El original no pudo consultarse; la copia conserva
el nodo y se usa como instantánea fechada. Hay captura de escritorio y medidas verificables;
no hay frame móvil, tokens de Figma ni estados de interacción diseñados.

**Alcance confirmado por el usuario**: demostración sin backend, con envío simulado y sin
guardar contraseñas. No se crean cuentas reales.

## Context

La demo de login existente necesita un recorrido de alta para demostrar el onboarding de
KynWallet. El visitante debe poder completar sus datos, corregir errores y volver al login
con confirmación de éxito. El objetivo del taller es demostrar ese recorrido con fidelidad
visual, navegación, accesibilidad y trazabilidad; no habilitar cuentas de producción.

El usuario autorizó ejecutar el ciclo completo sin aprobaciones intermedias y revisar el
resultado al final. Esa autorización permite avanzar; no equivale a una aprobación humana
ya realizada de cada artefacto.

## Clarifications

### Session 2026-10-15

- Q: ¿El registro será una demostración sin backend o creará usuarios en un servicio real?
  → A: Demo sin backend: envío simulado, sin guardar contraseñas.

### Decisiones de trabajo para la ejecución autorizada

- Se conservan `/registro`, `/login` y `/` como entrada compatible al login; se integra
  "Regístrate" con la nueva pantalla. El éxito no se persiste al recargar o volver por historial.
- Se mantienen los límites de A4 y se reutilizan las reglas del login para evitar diferencias.
- El formulario se vacía al abandonarlo o completar el envío. Un fallo conserva nombre,
  correo y aceptación para reintentar, pero descarta contraseña y confirmación.
- El envío válido dura al menos un segundo y muestra un spinner visible en la demo. Los errores de envío se verifican
  con una dependencia sustituible; no se incorporan fallos aleatorios ni opciones de producción.
- Los términos no tienen texto legal provisto: su control muestra un aviso de que no están
  disponibles en la demo. No se inventa un documento legal.
- El diseño móvil y los estados ausentes se derivan de los componentes accesibles existentes.
  Las adaptaciones de contraste se documentan y quedan incluidas en la revisión final.

## User Scenarios & Testing

### User Story 1 - Completar el registro de demostración (Priority: P1)

Como visitante, quiero completar mis datos y aceptar los términos para terminar el flujo
de registro y recibir una confirmación en el inicio de sesión.

**Why this priority**: es el recorrido principal del taller.

**Independent Test**: completar los cuatro campos con datos válidos, aceptar los términos
y enviar; comprobar la navegación a `/login` y el mensaje de éxito.

**Acceptance Scenarios**:

1. **US1-1**: **Given** el formulario de Registro, **When** se completan nombre, correo,
   contraseña y confirmación válidos y se aceptan los términos, **Then** "Crear cuenta"
   permite iniciar el envío.
2. **US1-2**: **Given** un envío en curso, **When** se intenta enviarlo otra vez, **Then**
   no se inicia un segundo envío y se muestra que el primero sigue en curso.
3. **US1-3**: **Given** el envío completado correctamente, **When** termina el flujo,
   **Then** se muestra `/login` con "Registro de demostración completado. Para iniciar sesión, usa una cuenta de prueba configurada."
   y el formulario de login sin contraseñas precargadas.
4. **US1-4**: **Given** un envío que no pudo completarse, **When** se informa el resultado,
   **Then** se permanece en Registro con un mensaje comprensible, se descartan ambas
   contraseñas, se conservan los demás datos y se permite reintentar.
5. **US1-5**: **Given** un envío en curso, **When** la persona vuelve al login antes de
   completarlo, **Then** su finalización no redirige ni muestra una confirmación tardía.

### User Story 2 - Corregir los datos antes de enviarlos (Priority: P1)

Como visitante, quiero saber qué datos faltan o son inválidos para corregirlos sin perder
el resto de lo que escribí.

**Why this priority**: las validaciones evitan envíos inválidos y son un requisito del taller.

**Independent Test**: enviar vacío y probar por separado correo inválido, contraseña corta,
confirmación distinta y términos sin aceptar; comprobar errores inline y ausencia de envío.

**Acceptance Scenarios**:

1. **US2-1**: **Given** los campos vacíos y los términos sin aceptar, **When** se pulsa
   "Crear cuenta", **Then** aparecen errores asociados a cada elemento obligatorio y
   el foco llega al primer elemento inválido, sin efectuar el envío.
2. **US2-2**: **Given** un correo como `persona@` o `persona.ejemplo.com`, **When** se sale
   de ese campo o se intenta enviar, **Then** aparece un mensaje de correo inválido.
3. **US2-3**: **Given** una contraseña de siete caracteres, **When** se valida el campo,
   **Then** se indica un mínimo de ocho; una contraseña de ocho pasa esa regla.
4. **US2-4**: **Given** contraseñas que difieren, incluso solo en mayúsculas o espacios,
   **When** se valida la confirmación, **Then** se informa que no coinciden.
5. **US2-5**: **Given** un error visible, **When** se corrige su causa, **Then** ese error
   desaparece y los demás campos conservan su contenido.
6. **US2-6**: **Given** los cuatro campos válidos y los términos sin aceptar, **When** se
   intenta enviar, **Then** aparece el error junto a la aceptación y no se envía.
7. **US2-7**: **Given** valores por encima de los límites de FR-006 o un nombre formado
   solo por espacios, **When** se valida, **Then** se explica el error y no se envía.

### User Story 3 - Volver al inicio de sesión (Priority: P2)

Como persona que ya tiene cuenta, quiero regresar al login sin completar el registro.

**Why this priority**: conecta la nueva pantalla con el recorrido existente.

**Independent Test**: activar el enlace desde un formulario incompleto y verificar `/login`.

**Acceptance Scenarios**:

1. **US3-1**: **Given** Registro abierto con datos incompletos, **When** se activa
   "¿Ya tienes cuenta? Inicia sesión", **Then** se navega a `/login` sin enviar ni validar
   el formulario y sin mostrar un mensaje de registro exitoso.
2. **US3-2**: **Given** la pantalla de login, **When** se activa su enlace "Regístrate",
   **Then** se accede al formulario de Registro en `/registro`.
3. **US3-3**: **Given** el login abierto después del registro, **When** se usan las cuentas
   ficticias ya configuradas, **Then** se conserva el comportamiento de acceso existente.

### User Story 4 - Entender los accesos sociales (Priority: P3)

Como visitante, quiero recibir una respuesta clara al activar Google o Apple.

**Why this priority**: el taller incluye ambos controles, con funcionalidad limitada a un aviso.

**Independent Test**: activar cada proveedor y comprobar el aviso sin navegación ni envío.

**Acceptance Scenarios**:

1. **US4-1**: **Given** Registro abierto, **When** se pulsa Google, **Then** se muestra un
   alert con el texto exacto "Próximamente" y se conserva el formulario.
2. **US4-2**: **Given** Registro abierto, **When** se pulsa Apple, **Then** se muestra el
   mismo alert sin iniciar una autenticación externa.

### User Story 5 - Usar el formulario en móvil y con teclado (Priority: P2)

Como visitante, quiero completar el registro desde el teléfono o usando teclado y ayudas
de lectura, manteniendo los campos y sus mensajes disponibles.

**Why this priority**: responsive es parte del taller y la accesibilidad es obligatoria.

**Independent Test**: recorrer y completar el formulario con teclado; revisar las vistas
de 320, 375 y 1440 píxeles de ancho y una ampliación del contenido al 200 %.

**Acceptance Scenarios**:

1. **US5-1**: **Given** una vista de escritorio de 1440 píxeles, **When** se abre Registro,
   **Then** se muestran el panel de marca y el formulario según la referencia de diseño.
2. **US5-2**: **Given** una vista móvil de 320 o 375 píxeles, **When** se abre Registro,
   **Then** se muestra solo el panel del formulario, sin desplazamiento horizontal.
3. **US5-3**: **Given** navegación por teclado, **When** se recorre el formulario,
   **Then** todos los controles tienen nombre, orden y foco visibles; los errores se
   asocian al elemento correspondiente y pueden conocerse sin depender del color.
4. **US5-4**: **Given** contenido ampliado al 200 %, **When** se completa el flujo,
   **Then** los campos, errores y botones siguen disponibles sin solaparse.
5. **US5-5**: **Given** ambas contraseñas inicialmente ocultas, **When** se activa el control
   de visibilidad de una, **Then** solo esa cambia y su control comunica el estado y su nombre.
6. **US5-6**: **Given** Registro abierto, **When** se activa "términos y condiciones",
   **Then** se informa que el texto legal no está disponible, sin enviar ni alterar la aceptación.

### Edge Cases

- Un nombre que solo contiene espacios se considera vacío; se admiten nombres con acentos.
- Los espacios exteriores de nombre y correo no los convierten en valores diferentes al validar.
- Los espacios de las contraseñas se conservan y cuentan para la coincidencia exacta.
- Pegar datos en un campo se valida igual que escribirlos.
- Cambiar la contraseña después de confirmar vuelve a comprobar la coincidencia.
- Volver al login por el enlace no produce la confirmación de éxito reservada al envío exitoso.
- Un fallo de envío no muestra éxito ni revela detalles internos del sistema.
- Completar la demo no habilita una cuenta nueva para autenticarse; esto se informa al usuario.

## Requirements

### Functional Requirements

- **FR-001**: Registro DEBE permitir introducir nombre completo, correo electrónico,
  contraseña y confirmación de contraseña.
- **FR-002**: El formulario DEBE mostrar una casilla de aceptación de términos y condiciones,
  desmarcada inicialmente; aceptarla es obligatorio para el envío.
- **FR-003**: El botón principal DEBE llamarse "Crear cuenta" y validar todos los campos y
  la aceptación de términos antes de iniciar un envío.
- **FR-004**: Nombre, correo, contraseña y confirmación DEBEN ser obligatorios; un nombre
  vacío tras eliminar espacios exteriores DEBE rechazarse.
- **FR-005**: Un correo válido DEBE tener una parte antes de `@`, un dominio con punto y
  una terminación de al menos dos caracteres, sin espacios interiores ni más de un `@`.
- **FR-006**: El nombre DEBE tener entre 1 y 80 caracteres útiles después de quitar espacios
  exteriores; el correo no DEBE superar 254 caracteres; la contraseña DEBE tener entre
  8 y 128 caracteres. La confirmación DEBE respetar el mismo límite máximo de 128.
- **FR-007**: La confirmación DEBE coincidir exactamente con la contraseña, sin eliminar
  espacios ni ignorar mayúsculas. Cambiar cualquiera de las dos DEBE actualizar un error
  de coincidencia que ya esté visible.
- **FR-008**: Los errores DEBEN mostrarse junto al elemento correspondiente al salir de
  un campo o intentar enviar; antes de la primera interacción no se muestran errores.
- **FR-009**: Corregir un elemento con error DEBE actualizar su mensaje sin borrar otros
  campos. Un envío inválido DEBE dirigir el foco al primer elemento inválido.
- **FR-010**: Durante un envío válido DEBE mostrarse un spinner visible y el texto "Creando
  cuenta…", deshabilitando el envío duplicado durante al menos 1000 ms antes de navegar.
  Respetar movimiento reducido manteniendo el indicador y el estado ocupado.
- **FR-011**: El éxito DEBE llevar a `/login` y mostrar "Registro de demostración completado.
  Para iniciar sesión, usa una cuenta de prueba configurada." con las contraseñas del registro descartadas.
- **FR-012**: Un fallo DEBE mantener a la persona en Registro, mostrar un mensaje genérico
  que permita reintentar y no mostrar confirmación de éxito.
- **FR-013**: El enlace "¿Ya tienes cuenta? Inicia sesión" DEBE llevar a `/login` sin efectuar
  un envío y sin mostrar éxito. El enlace "Regístrate" del login DEBE abrir `/registro`.
- **FR-014**: Los botones Google y Apple DEBEN mostrar un alert con el texto "Próximamente",
  sin enviar el formulario, borrar sus valores ni iniciar acceso social real.
- **FR-015**: En escritorio DEBEN mostrarse dos paneles; en móvil solo el panel del formulario.
  El flujo DEBE funcionar desde 320 píxeles de ancho, sin desplazamiento horizontal.
- **FR-016**: Textos, componentes y distribución DEBEN corresponder al frame `31:2`.
  Los valores visuales DEBEN apoyarse en la referencia disponible; cualquier discrepancia
  necesaria DEBE documentarse, especialmente por accesibilidad.
- **FR-017**: Etiquetas, mensajes y controles DEBEN permitir el recorrido con teclado,
  foco visible y lectura asistida, cumpliendo WCAG 2.1 AA.
- **FR-018**: Contraseñas y otros datos del formulario no DEBEN aparecer en URLs o registros
  ni conservarse como datos persistentes de la demo.
- **FR-019**: El envío DEBE ser simulado, sin backend ni creación de cuentas reales. La
  pantalla DEBE informar que el registro es de demostración. Las cuentas ficticias del
  login existente DEBEN seguir funcionando.
- **FR-020**: Cada contraseña DEBE tener un control independiente para mostrarla u ocultarla,
  con nombre y estado accesibles; ambas comienzan ocultas.
- **FR-021**: Activar "términos y condiciones" DEBE informar que el texto legal no está
  disponible en la demo, sin envío ni cambio de aceptación.
- **FR-022**: Abandonar Registro DEBE descartar sus datos e impedir que un envío pendiente
  cause navegación o confirmación posteriores. El éxito no se conserva al recargar el login
  ni al volver por historial; nunca se incluye en la URL ni datos del registro ni contraseñas.

### Key Entities

- **Solicitud de registro de demostración**: nombre, correo, contraseña, confirmación y
  aceptación de términos necesarios para completar el recorrido; no representa una cuenta persistida.
- **Resultado del envío**: en curso, éxito o fallo; determina la respuesta que recibe la persona.
- **Error de validación**: elemento afectado y mensaje que indica cómo corregirlo.
- **Confirmación de registro**: aviso de éxito presentado en el login después de un envío exitoso.

## Success Criteria

### Measurable Outcomes

- **SC-001**: El 100 % de los escenarios identificados de US1 a US5 satisface sus resultados esperados.
- **SC-002**: Ninguno de los casos de validación inválidos inicia un envío ni produce éxito.
- **SC-003**: Un envío válido produce una sola confirmación en `/login`; el enlace de regreso
  no produce esa confirmación.
- **SC-004**: El flujo se completa con teclado y a 320, 375 y 1440 píxeles, sin pérdida de
  controles, errores inaccesibles ni desplazamiento horizontal en móvil.
- **SC-005**: La revisión contra la referencia de Registro no deja discrepancias de textos,
  componentes o distribución sin registrar; la interfaz alcanza WCAG 2.1 AA.
- **SC-006**: La demostración no conserva contraseñas ni crea cuentas reales y el acceso con
  las cuentas ficticias existentes continúa funcionando.

## Assumptions

- **A1, alcance confirmado el 2026-10-15**: demostración sin backend, con envío simulado
  y sin guardar contraseñas. No se exige persistencia ni poder entrar con los datos recién
  enviados. Cambiar a registro real requiere revisar esta spec.
- **A2, decisión de trabajo**: la entrada directa al registro es `/registro`; `/login` muestra el login.
  La navegación inicial existente del proyecto deberá conservarse en la integración.
- **A3, decisión de trabajo**: el enlace "Regístrate" del login abre la nueva pantalla para que la
  demostración pueda recorrerse sin conocer de antemano una URL.
- **A4, decisión de trabajo**: se adoptan los límites existentes de correo y contraseña y un máximo
  de 80 caracteres para el nombre, coherente con el nombre de las cuentas de demostración.
- **A5**: los términos deben aceptarse, pero redactar textos legales y crear una pantalla
  de términos quedan fuera del taller. No se añade OAuth real, verificación por correo,
  detección de cuentas duplicadas ni recuperación de contraseña.
- **A6**: se recibió una extracción de escritorio desde la copia del diseño. Las medidas
  verificadas y las adaptaciones técnicas corresponden al plan; no se presenta una vista
  móvil derivada como si proviniera de un frame inexistente.

## Constraints

- Rigen la Constitución 1.0.0, el comportamiento de login existente, WCAG 2.1 AA y los
  controles de calidad ya configurados, con cobertura mínima del 80 %.
- El apunte del usuario distingue Specify (qué/por qué), Plan (cómo) y tareas atómicas,
  verificables y trazables; se adopta como guía del proceso, sin alterar reglas del taller.
- No se requieren servicios externos ni dependencias nuevas para completar la demo.

## Non-Goals

No se crean cuentas reales, backend, base de datos, OAuth, verificación por correo,
gestión de duplicados, persistencia de datos del formulario, términos legales, despliegue,
push, pull request ni integración con herramientas de seguimiento en este ciclo local.
