# Feature Specification: Registro de usuarios de KynWallet

**Feature Branch**: `feature/registro-johanrene-garcia`

**Created**: 2026-10-18

**Status**: Draft

**Input**: Demostración web de registro con nombre completo, correo, contraseña y confirmación; aceptación obligatoria de términos; validaciones inline; Google y Apple con alerta «Próximamente»; navegación y éxito en `/login`; escritorio con dos paneles y móvil con solo formulario; sin backend ni base de datos.

**Referencias visuales**: [Captura 04 · Registro](../../.prompts/registro/04%20%C2%B7%20Registro.png) y [estilos exportados](../../.prompts/registro/styles.css), correspondientes al nodo `31:2` del [diseño Figma](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2). Se inspeccionaron los archivos locales; el archivo remoto no fue accesible. La captura de 1440 × 1024 muestra un panel de marca naranja a la izquierda, con logo KynWallet, «Comienza tu camino financiero.», texto de apoyo y tarjeta decorativa; a la derecha, «Crea tu cuenta», «Completa tus datos para comenzar», formulario, términos, acción principal, separador «o regístrate con», Google/Apple y acceso a inicio de sesión. Los colores, tipografía Inter, proporciones y espaciados del CSS constituyen referencia visual, no una obligación de posicionamiento fijo.

## Clarifications

### Session 2026-10-18

- Q: ¿El enlace «Regístrate» de la pantalla de login debe abrir la nueva pantalla de registro? → A: Sí. «Regístrate» abre `/register`; «Inicia sesión» vuelve a `/login`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Completar un registro de demostración (Priority: P1)

Como visitante, quiero completar mis datos y aceptar los términos para finalizar el registro de demostración y llegar al inicio de sesión.

**Why this priority**: entrega el recorrido principal solicitado.

**Independent Test**: completar los cuatro campos con datos ficticios válidos, aceptar los términos y enviar; comprobar destino y mensaje sin crear una cuenta persistente.

**Acceptance Scenarios**:

1. **Given** la pantalla inicial, **When** el visitante la consulta, **Then** los cuatro campos están vacíos, las contraseñas ocultas y la casilla de términos desmarcada; aparecen las etiquetas y acciones de la referencia.
2. **Given** nombre «Diego Martínez», correo «diego@example.com», dos contraseñas idénticas de ocho o más caracteres dentro de los límites y términos aceptados, **When** activa «Crear cuenta», **Then** se validan todos los campos, finaliza la simulación y se navega a `/login`, donde aparece «Registro de demostración exitoso. Puedes iniciar sesión con una cuenta de demostración».
3. **Given** un registro válido, **When** el visitante envía con Enter desde un campo, **Then** obtiene el mismo resultado que con «Crear cuenta»; activaciones repetidas durante el mismo envío producen una sola finalización.
4. **Given** la finalización, **When** se muestra `/login`, **Then** se anuncia el mensaje de éxito, se eliminan los datos del registro y el login conserva su comportamiento existente; las credenciales recién introducidas no habilitan una cuenta nueva.
5. **Given** un registro finalizado, **When** se recarga `/login` o se vuelve a abrir el registro, **Then** no se restaura el formulario ni reaparece el éxito de la operación anterior.

---

### User Story 2 - Corregir datos y aceptar los términos (Priority: P1)

Como visitante, quiero saber qué datos son incorrectos para corregirlos sin perder lo que ya escribí.

**Why this priority**: evita finalizar registros incompletos y hace comprensibles las reglas.

**Independent Test**: probar valores vacíos, correo inválido, contraseña corta, confirmación diferente y términos desmarcados; corregir cada condición y verificar que permite continuar.

**Acceptance Scenarios**:

1. **Given** el formulario vacío, **When** se activa «Crear cuenta», **Then** aparecen junto a los campos «Ingresa tu nombre completo», «Ingresa tu correo electrónico», «Ingresa tu contraseña» y «Confirma tu contraseña», además de «Debes aceptar los términos y condiciones» junto a la casilla; el foco pasa al primer control inválido y no hay redirección.
2. **Given** «usuario@», «usuario.com» o un correo con espacios interiores, **When** se abandona el campo o se envía, **Then** aparece «Ingresa un correo electrónico válido»; «diego@example.com» es aceptado.
3. **Given** una contraseña de siete caracteres, **When** se valida, **Then** aparece «La contraseña debe tener al menos 8 caracteres»; una de ocho satisface la longitud mínima.
4. **Given** dos contraseñas diferentes, **When** se valida la confirmación, **Then** aparece «Las contraseñas no coinciden»; si se cambia la contraseña original después de confirmar, la coincidencia se vuelve a evaluar.
5. **Given** datos válidos y términos desmarcados, **When** se envía, **Then** aparece el error de aceptación y se permanece en registro; marcar y volver a desmarcar la casilla vuelve a impedir finalizar.
6. **Given** errores visibles, **When** se corrige un valor, **Then** se actualiza su error sin borrar los demás datos; al quedar válido, desaparece el error correspondiente. Los campos sin interacción no muestran errores antes del primer envío.
7. **Given** valores por encima de los máximos de nombre, correo o contraseña, **When** se validan, **Then** se informa el límite del campo, no se trunca silenciosamente y no finaliza el registro.
8. **Given** un nombre compuesto por espacios, **When** se valida, **Then** se considera vacío; nombres con tildes, apóstrofos o guiones son aceptados sin exigir dos apellidos. Los espacios periféricos de nombre y correo se ignoran, pero los de las contraseñas se conservan al comparar.

---

### User Story 3 - Usar las acciones secundarias (Priority: P2)

Como visitante, quiero abrir el registro desde el login, volver a iniciar sesión si ya tengo cuenta y conocer la disponibilidad de las otras opciones de registro.

**Why this priority**: completa la navegación y evita expectativas de integraciones inexistentes.

**Independent Test**: abrir registro desde «Regístrate» en el login y activar cada acción secundaria desde un formulario parcialmente completado.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** se activa «Inicia sesión» en «¿Ya tienes cuenta? Inicia sesión», **Then** se navega a `/login` sin mostrar un éxito de registro y sin conservar los datos abandonados.
2. **Given** datos parcialmente escritos, **When** se activa Google o Apple, **Then** aparece una alerta con el texto exacto «Próximamente», sin enviar el formulario, validar campos ni navegar; al cerrarla se conservan los datos y el foco vuelve al botón activado.
3. **Given** el texto destacado «términos y condiciones», **When** se activa, **Then** aparece «Términos y condiciones no disponibles en esta demostración», sin enviar ni alterar la casilla o los datos. El aviso no constituye contenido legal ni consentimiento real.
4. **Given** la pantalla de login, **When** se activa «Regístrate», **Then** se navega a `/register` y aparece el formulario de registro vacío, sin el aviso de función no disponible; «Inicia sesión» permite volver a `/login`.

---

### User Story 4 - Consultar las contraseñas ingresadas (Priority: P2)

Como visitante, quiero mostrar temporalmente cada contraseña para revisar lo que escribí.

**Why this priority**: los dos controles aparecen en la referencia y ayudan a corregir errores.

**Independent Test**: alternar por separado la visibilidad de contraseña y confirmación.

**Acceptance Scenarios**:

1. **Given** ambas contraseñas ocultas, **When** se activa el control de una, **Then** solo esa contraseña se hace legible, sin cambiar su valor ni enviar el formulario.
2. **Given** una contraseña visible, **When** se vuelve a activar su control, **Then** se oculta; cada control comunica su campo y acción «Mostrar» u «Ocultar» mediante un nombre accesible.

---

### User Story 5 - Registrarse desde móvil y con ayudas de accesibilidad (Priority: P1)

Como visitante, quiero utilizar el formulario desde mi dispositivo y con teclado o lector de pantalla para completar el mismo recorrido sin barreras.

**Why this priority**: el comportamiento adaptable es explícito y la accesibilidad es obligatoria por Constitución.

**Independent Test**: recorrer el formulario en escritorio y móvil, repetir con teclado, ampliación y lector de pantalla, incluyendo errores y éxito.

**Acceptance Scenarios**:

1. **Given** una ventana de 1440 × 1024, **When** se muestra registro, **Then** aparecen el panel de marca y el formulario según el orden, textos, proporciones y jerarquía de la referencia local.
2. **Given** una ventana menor de 1024 px de ancho, **When** se muestra registro, **Then** se oculta el panel de marca y queda solo el contenido del formulario con todas sus acciones; desde 320 px no hay desplazamiento horizontal ni superposición de controles o errores.
3. **Given** uso exclusivo de teclado, **When** se recorre la pantalla, **Then** todos los campos, casilla, enlaces, controles de visibilidad y botones son alcanzables y activables con orden lógico y foco visible.
4. **Given** un lector de pantalla, **When** se recorren campos o aparecen errores y resultados, **Then** se anuncian etiquetas, obligatoriedad, estado de casilla, errores asociados y éxito sin depender únicamente del color.
5. **Given** ampliación de texto al 200 % o una altura reducida, **When** se usa el formulario, **Then** el contenido permanece legible y operable, con desplazamiento vertical cuando sea necesario; contraste y presentación cumplen WCAG 2.1 AA.

### Edge Cases

- Confirmación vacía: se muestra obligatoriedad antes que discrepancia; cada campo muestra un error prioritario a la vez: obligatorio, formato o longitud y luego coincidencia.
- Contraseñas de 128 caracteres se aceptan si cumplen las demás reglas; 129 se rechazan. No se imponen requisitos adicionales de mayúsculas, números o símbolos.
- Nombre de 100 caracteres y correo de 254 son válidos por longitud; valores superiores se rechazan. Pegar texto recibe las mismas validaciones que escribir.
- Repetir el mismo correo no produce «correo ya registrado»: no existe registro persistente ni consulta de unicidad.
- Cambiar el ancho de ventana conserva lo escrito y los errores; abandonar registro o recargarlo restablece campos y casilla.
- Un fallo inesperado muestra «No se pudo completar la demostración. Intenta de nuevo», sin detalles internos, permite reintentar y no muestra éxito ni navega. Se conservan los datos solo mientras se permanece en el formulario.
- Nombres o valores con apariencia de contenido ejecutable se tratan como texto y nunca se ejecutan; no se reflejan datos personales en mensajes de resultado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE presentar los cuatro campos y los textos, orden y jerarquía visual de la referencia local, usando el sistema de diseño corporativo aplicable. [US1.1, US5.1]
- **FR-002**: Nombre, correo, contraseña, confirmación y aceptación explícita de términos DEBEN ser obligatorios; la casilla DEBE iniciar desmarcada. [US1.1, US2.1, US2.5]
- **FR-003**: El nombre DEBE admitir entre 1 y 100 caracteres tras ignorar espacios periféricos, sin exigir una estructura de nombres o apellidos. [US2.7–8]
- **FR-004**: El correo DEBE tener formato de dirección con parte local, una arroba y dominio con extensión, sin espacios interiores, y máximo 254 caracteres tras ignorar espacios periféricos. [US2.2, US2.7–8]
- **FR-005**: Contraseña y confirmación DEBEN tener entre 8 y 128 caracteres, conservar espacios y coincidir exactamente, distinguiendo mayúsculas. La coincidencia DEBE reevaluarse al cambiar cualquiera. [US2.3–4, US2.7–8]
- **FR-006**: Las validaciones DEBEN mostrarse inline al abandonar un control y al enviar; una vez mostrado un error, DEBE actualizarse al corregirlo, conservando los otros valores y aplicando la prioridad descrita en casos límite. [US2.1–8]
- **FR-007**: «Crear cuenta» y Enter desde los campos DEBEN validar todo antes de simular el registro, bloquear la finalización con cualquier error y evitar duplicados durante un envío. [US1.2–3, US2.1–5]
- **FR-008**: Todo envío válido DEBE finalizar la simulación y navegar a `/login` con el mensaje de éxito de US1.2, anunciado de manera accesible, visible hasta abandonar o recargar el login. [US1.2–5, US5.4]
- **FR-009**: El registro DEBE funcionar sin servicios backend ni base de datos; NO DEBE crear cuentas reales, cambiar las cuentas de demostración del login ni enviar, persistir o registrar datos del formulario. Al abandonar o recargar registro, sus datos DEBEN descartarse. [US1.4–5, US3.1 y casos límite]
- **FR-010**: Google y Apple DEBEN abrir únicamente la alerta «Próximamente», preservar el formulario y devolver el foco al cerrar. [US3.2]
- **FR-011**: «Regístrate» en el login DEBE abrir `/register` con el formulario vacío en lugar de mostrar el aviso de función no disponible; «Inicia sesión» en registro DEBE llevar a `/login` sin mensaje de registro exitoso por esa acción. [US3.1, US3.4]
- **FR-012**: Ambas contraseñas DEBEN estar ocultas inicialmente y contar con controles independientes, accesibles y reversibles de visibilidad. [US1.1, US4.1–2]
- **FR-013**: La pantalla DEBE mostrar dos paneles desde 1024 px y solo el formulario por debajo de ese ancho, ser utilizable desde 320 px y conservar estado al redimensionar. [US5.1–2 y casos límite]
- **FR-014**: La pantalla DEBE cumplir WCAG 2.1 AA, incluyendo etiquetas, errores asociados, foco en el primer control inválido, resultados anunciados, teclado, contraste y ampliación sin pérdida de funcionalidad. [US2.1, US5.3–5]
- **FR-015**: El acceso destacado a términos DEBE informar su indisponibilidad conforme a US3.3, sin simular aceptación ni introducir documentos legales o rutas adicionales. [US3.3]
- **FR-016**: Los fallos inesperados DEBEN producir el mensaje y recuperación definidos en casos límite. Los datos personales y contraseñas NO DEBEN aparecer en URL, registros de diagnóstico ni mensajes; cualquier diagnóstico DEBE ser estructurado y excluir esos datos. [US1.4, US2.6 y casos límite]

### Key Entities

- **Solicitud de registro de demostración**: nombre completo, correo, contraseña, confirmación y aceptación de términos. Existe únicamente durante el recorrido activo y no representa una cuenta creada.
- **Resultado de validación**: errores asociados a cada campo o casilla; determina si puede finalizarse el envío.
- **Resultado de registro simulado**: éxito o fallo sin datos personales; el éxito permite presentar una confirmación transitoria en el login.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al menos 4 de 5 participantes de una prueba de usabilidad completan el registro con datos ficticios en menos de 2 minutos, sin asistencia, e identifican que es una demostración.
- **SC-002**: El 100 % de los envíos inválidos de los escenarios permanece en registro con un mensaje específico junto al control correspondiente; ningún envío inválido produce éxito.
- **SC-003**: En el 100 % de los envíos válidos evaluados, `/login` y el mensaje de éxito aparecen en un máximo de 2 segundos desde la activación de «Crear cuenta».
- **SC-004**: Todos los controles y mensajes permanecen utilizables a 320, 375, 768, 1024 y 1440 px, sin solapamientos ni desplazamiento horizontal; se verifican ambos modos de presentación y texto al 200 %.
- **SC-005**: El recorrido completo, la corrección de errores y las acciones secundarias se pueden realizar solo con teclado y con lector de pantalla; la auditoría automatizada y revisión manual no detectan incumplimientos WCAG 2.1 AA.
- **SC-006**: La comparación con la captura local a 1440 × 1024 confirma coincidencia de textos, orden, dos paneles, jerarquía y elementos decorativos, con las adaptaciones de accesibilidad documentadas y aprobadas cuando corresponda.
- **SC-007**: El 100 % de los escenarios de aceptación y casos límite tiene evidencia verificable; ningún recorrido deja datos personales del registro al recargar o abandonar la pantalla.

## Assumptions

- El idioma es español y el propósito es demostrar el registro. La pantalla DEBE incluir un aviso breve «Demostración: no se creará una cuenta real. Usa datos ficticios», incorporado sin ocultar elementos de la referencia. Este aviso permite verificar SC-001 y evita pedir datos personales innecesarios.
- Se retoma la única carpeta `specs/002-registro-billetera` creada antes de la pausa; no se crea una segunda funcionalidad ni se cambia la rama existente.
- La captura y el CSS locales sustituyen la consulta directa de Figma para esta especificación. No se dispone de variantes móviles, estados de interacción ni errores diseñados; el umbral de 1024 px y las reglas inline son supuestos explícitos. Una referencia adicional podrá ajustarlos.
- Los máximos de correo y contraseña mantienen coherencia con la especificación existente de login; el máximo de nombre de 100 caracteres limita entradas sin restringir nombres internacionales.
- `/login` es el destino existente a integrar. Esta funcionalidad añade allí la confirmación transitoria y conecta «Regístrate» con `/register`; no cambia autenticación ni habilita el inicio de sesión con datos recién registrados. La especificación de login `001-login-billetera` es una dependencia de navegación, no un BRD ni un ARD.
- El registro se abre en `/register` desde «Regístrate» en el login y también mediante acceso directo a esa ruta. Quedan fuera de alcance la verificación de correo, detección de duplicados, autenticación social, recuperación de contraseña, persistencia, sesiones y documento legal completo. Esta funcionalidad sustituye únicamente el aviso de indisponibilidad de «Regístrate» definido en US5/FR-016 de `001-login-billetera`; las demás acciones del login conservan su comportamiento.
- No se identificaron BRD ni ARD en el repositorio; si se incorporan, deben revisarse sus secciones aplicables conforme al principio VI de la Constitución.
- Rige la [Constitución 1.0.0](../../.specify/memory/constitution.md): TDD (I), SOLID (II), separación de responsabilidades y reglas únicas (III–IV), seguridad y minimización de datos (V), conformidad documental (VI), dependencias justificadas (7), accesibilidad y reutilización (8), trazabilidad y controles de integración (9). La planificación DEBE verificar cada principio y definir pruebas previas, trazabilidad FR → escenario → prueba y controles exigidos. Esta especificación fija comportamientos y no selecciona tecnologías ni diseño de implementación.
## Decisión visual — 2026-10-19

El usuario indicó explícitamente mantener en blanco el texto «KynWallet», «Comienza tu camino
financiero.» y el párrafo de apoyo del panel izquierdo de registro, conservando el gradiente
original de la referencia. Se aplica `--neutral-0` (#FFFFFF) a esos tres elementos.

Esta decisión sustituye el ajuste previo a texto oscuro. Conforme a Constitución 8.8, se
prioriza el diseño para este conflicto concreto. Afecta al contraste de FR-014/SC-005: no se
declara cumplimiento completo de WCAG AA para esos textos sobre las zonas claras del gradiente.
La formalización de la excepción de 9.1, incluidos responsables y vencimiento, sigue pendiente
antes de integrar; no se inventan aprobaciones ni se cambia el resto de los requisitos.
