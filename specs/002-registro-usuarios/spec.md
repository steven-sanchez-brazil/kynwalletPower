# Feature Specification: Registro de Usuarios de KynWallet

**Feature Branch**: `feature/registro-jorge-velasco` (rama existente; no creada por esta especificación)

**Created**: 2026-10-20

**Status**: Draft — validada para planificación

**Input**: User description: "Construir la pantalla de Registro de Usuarios de KynWallet siguiendo la Constitution existente, con formulario responsive, validación inline, aceptación obligatoria de términos, navegación a /login y registro exitoso simulado. Demostración del lado del cliente, sin autenticación real ni persistencia de credenciales. Mantener trazabilidad sin decisiones de implementación."

## Clarifications

### Session 2026-10-20

- Q: ¿El enlace «Regístrate» del login debe abrir la nueva pantalla de registro? → A: Sí, «Regístrate» debe abrir la pantalla de registro (opción A).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Completar el registro de demostración (Priority: P1)

Como visitante, quiero completar mis datos y aceptar los términos para recorrer el registro y recibir una confirmación antes de iniciar sesión.

**Why this priority**: representa el objetivo central de la demostración.

**Independent Test**: completar los cuatro campos con datos válidos, aceptar términos y enviar; verificar el estado de envío y la llegada a /login con confirmación.

**Acceptance Scenarios**:

1. **AC-101**: **Given** la pantalla de registro, **When** se presenta el formulario, **Then** aparecen nombre completo, correo electrónico, contraseña, confirmar contraseña, casilla de términos inicialmente desmarcada y botón "Crear cuenta"; se indica que todos son obligatorios.
2. **AC-102**: **Given** datos válidos y términos aceptados, **When** se activa "Crear cuenta", **Then** se validan todos los campos, se muestra "Creando cuenta…" durante el envío y solo se procesa un intento, aunque se vuelva a activar el envío.
3. **AC-103**: **Given** un envío válido, **When** finaliza la simulación, **Then** se navega a /login y se muestra "Registro de demostración completado. Puedes volver al inicio de sesión; no se ha creado una cuenta real."; no se inicia una sesión ni se agregan credenciales a las cuentas de demostración existentes; las decisiones de autenticación previas al registro permanecen iguales.
4. **AC-104**: **Given** un registro completado, **When** se vuelve a abrir el registro o se recarga la página, **Then** el formulario está vacío y los términos desmarcados, sin recuperar datos del intento anterior.

5. **AC-105**: **Given** dos pares de credenciales ficticias, uno admitido por el login existente y otro no admitido, **When** se completa un registro válido con cada par y se compara su autenticación antes y después bajo la misma configuración, **Then** el primero sigue admitido y el segundo sigue no admitido; el registro no crea, modifica ni habilita cuentas, y no inicia sesión automáticamente.

### User Story 2 - Corregir datos sin perder el progreso (Priority: P1)

Como visitante, quiero conocer los errores junto a cada campo y conservar lo que ingresé para corregir el formulario sin empezar de nuevo.

**Why this priority**: evita envíos inválidos y permite completar el flujo principal.

**Independent Test**: enviar campos vacíos y distintas combinaciones inválidas, corregir cada error y comprobar que el resto del formulario conserva su contenido.

**Acceptance Scenarios**:

1. **AC-201**: **Given** campos vacíos y términos sin aceptar, **When** se intenta enviar, **Then** se muestra un error junto a cada campo obligatorio y a la casilla, el foco pasa al primer control inválido y no se procesa el registro.
2. **AC-202**: **Given** un correo como "persona@" o "persona.com", **When** se abandona el campo o se envía, **Then** se muestra "Ingresa un correo electrónico válido" junto al correo; al corregirlo desaparece el error.
3. **AC-203**: **Given** una contraseña de siete caracteres, **When** se valida, **Then** se indica el mínimo de ocho; una contraseña de ocho caracteres cumple ese mínimo sin exigir categorías adicionales de caracteres.
4. **AC-204**: **Given** contraseñas distintas, **When** se valida la confirmación, **Then** se muestra "Las contraseñas no coinciden" junto a ella; al igualarlas desaparece el error. Cambiar la contraseña original vuelve a comprobar una confirmación ya validada.
5. **AC-205**: **Given** cualquier error de validación, **When** se muestra o se corrige, **Then** se conservan los valores ingresados, incluidos los válidos, y el estado de aceptación; los errores pendientes siguen visibles y no se redirige.
6. **AC-206**: **Given** valores en los límites de longitud o con espacios, **When** se validan, **Then** se aplican las reglas FR-003 a FR-006 y los resultados definidos en EC-002 a EC-005.
7. **AC-207**: **Given** un fallo inesperado durante el envío simulado, **When** no se puede completar, **Then** aparece "No se pudo completar el registro. Inténtalo de nuevo.", se conservan los datos, se habilita otro intento y no se muestra éxito.

### User Story 3 - Usar el registro en distintos dispositivos y con teclado (Priority: P1)

Como visitante, quiero una experiencia coherente con el login y accesible en móvil y escritorio para completar el registro desde mi dispositivo y forma de interacción.

**Why this priority**: la adaptación y la accesibilidad son condiciones obligatorias de uso.

**Independent Test**: revisar el formulario en anchos móviles y de escritorio, completar el flujo solo con teclado y comprobar etiquetas y anuncios con tecnología de asistencia.

**Acceptance Scenarios**:

1. **AC-301**: **Given** un ancho de escritorio, **When** se abre el registro, **Then** aparecen dos paneles, uno de marca y otro de formulario, coherentes con colores, tipografía, controles y jerarquía del login existente.
2. **AC-302**: **Given** un ancho móvil desde 320 px, **When** se abre o redimensiona la pantalla, **Then** se muestra únicamente el panel del formulario, con todos sus controles disponibles, sin desplazamiento horizontal ni pérdida de los datos ingresados.
3. **AC-303**: **Given** cualquier control interactivo, **When** se recorre y opera solo con teclado, **Then** existe un orden lógico, foco visible, ausencia de bloqueos de foco y posibilidad de enviar con Enter y cambiar la casilla con Espacio.
4. **AC-304**: **Given** campos, errores, envío y resultado, **When** se utiliza tecnología de asistencia, **Then** se identifican etiquetas y obligatoriedad, se anuncian errores asociados y cambios de estado, y al llegar a /login se percibe el mensaje de éxito.
5. **AC-305**: **Given** estados normales, de foco, error y envío, **When** se revisa la pantalla con ampliación al 200 % y criterios WCAG 2.1 AA, **Then** los controles siguen utilizables, el contenido es legible, hay contraste suficiente y los errores no dependen únicamente del color.

### User Story 4 - Elegir otra vía de acceso (Priority: P2)

Como visitante, quiero volver al login o conocer la disponibilidad de Google y Apple para entender mis opciones sin perder el progreso accidentalmente.

**Why this priority**: permite navegar y evita confundir acciones futuras con un registro real.

**Independent Test**: abrir el registro desde "Regístrate" en el login; activar Google, Apple y el enlace a inicio de sesión, verificando sus resultados por separado.

**Acceptance Scenarios**:

1. **AC-401**: **Given** el registro con datos ingresados, **When** se activa Google o Apple, **Then** se muestra "Próximamente", se mantiene la pantalla y se conservan los datos y la casilla; no se envía el formulario ni se inicia acceso externo.
2. **AC-402**: **Given** la pantalla de registro, **When** se activa "¿Ya tienes cuenta? Inicia sesión", **Then** se navega a /login sin mensaje de registro exitoso ni transferencia de los datos del formulario.
3. **AC-403**: **Given** la pantalla de login, **When** se activa "Regístrate" mediante puntero o teclado, **Then** se abre la pantalla de registro con los campos vacíos y los términos desmarcados, sin trasladar credenciales del login ni mostrar el aviso anterior de función no disponible.

### Edge Cases

| ID | Caso y resultado esperado | Aceptación |
| --- | --- | --- |
| EC-001 | Envío vacío o términos desmarcados: errores por control, sin procesar. | AC-201 |
| EC-002 | Nombre solo con espacios: inválido; nombre con acentos, apóstrofos, guiones o un solo término: permitido. Tras ignorar espacios periféricos, 1–100 caracteres válidos; 101 inválidos. No se exige un número de apellidos. | AC-206 |
| EC-003 | Correo con espacios periféricos: se ignoran para validar; mayúsculas permitidas. Debe contener una parte local, un único @ y un dominio con al menos dos segmentos no vacíos separados por punto, sin espacios internos. Hasta 254 caracteres permitido si cumple formato; 255 inválidos. | AC-202, AC-206 |
| EC-004 | Contraseña de 7 caracteres: inválida; de 8 y 128: válida; de 129: inválida. Sus espacios se cuentan y conservan, sin recorte ni reglas adicionales de complejidad. | AC-203, AC-206 |
| EC-005 | Confirmación vacía: error obligatorio; diferencia incluso de mayúsculas o espacios: error de coincidencia. Debe respetar también la longitud de la contraseña. | AC-204, AC-206 |
| EC-006 | Pegar texto produce las mismas validaciones que escribirlo; no se borran campos por errores de otros controles. | AC-205, AC-206 |
| EC-007 | Doble clic o Enter repetido durante envío: un único resultado y una única navegación. | AC-102 |
| EC-008 | Modificar contraseña tras validar confirmación: se vuelve a mostrar la discrepancia hasta corregirla. | AC-204 |
| EC-009 | Cambio de orientación o ancho durante edición: datos conservados y formulario utilizable. | AC-302 |
| EC-010 | Volver o recargar tras éxito: no reaparecen credenciales ni una cuenta nueva; abrir /login por navegación ordinaria no muestra un éxito nuevo. | AC-103, AC-104, AC-402 |
| EC-011 | Fallo inesperado: mensaje comprensible, sin detalles internos ni datos personales, con reintento disponible. | AC-207 |
| EC-012 | Volver al login y activar nuevamente "Regístrate": nuevo formulario vacío y términos desmarcados, sin recuperar credenciales previas. | AC-403 |
| EC-013 | Los datos ingresados coinciden con una cuenta de demostración existente: la simulación no cambia esa cuenta ni su acceso previo. Si no eran admitidos antes, siguen sin ser admitidos después. No se consulta duplicidad durante el registro. | AC-105 |

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El formulario DEBE presentar los cuatro campos identificados, la casilla obligatoria y "Crear cuenta", indicando su obligatoriedad; las contraseñas DEBEN estar ocultas al ingresar.
- **FR-002**: "Crear cuenta" y Enter DEBEN validar todos los campos y la aceptación antes de procesar; cualquier incumplimiento DEBE impedir el registro.
- **FR-003**: El nombre completo DEBE ser obligatorio y admitir entre 1 y 100 caracteres tras ignorar espacios periféricos, sin restricciones a nombres según EC-002.
- **FR-004**: El correo DEBE ser obligatorio y cumplir formato y longitud según EC-003; su validación DEBE ser inline.
- **FR-005**: La contraseña DEBE ser obligatoria y tener entre 8 y 128 caracteres; se DEBEN conservar espacios y mayúsculas, sin requisitos de complejidad adicionales.
- **FR-006**: La confirmación DEBE ser obligatoria, tener entre 8 y 128 caracteres y coincidir exactamente con la contraseña; DEBE revalidarse al cambiar esta si la confirmación ya se validó.
- **FR-007**: La aceptación DEBE estar desmarcada inicialmente y ser explícita y obligatoria para cada intento de registro nuevo.
- **FR-008**: Los errores DEBEN mostrarse junto al control al abandonarlo o enviar; tras un error, se DEBEN actualizar al corregir el valor, conservando el resto de errores pendientes. Un envío inválido DEBE enfocar el primer control con error.
- **FR-009**: La validación y los avisos de opciones futuras DEBEN conservar los datos del formulario y la aceptación durante la edición actual.
- **FR-010**: Un envío válido DEBE mostrar un estado perceptible "Creando cuenta…" y evitar envíos simultáneos hasta finalizar.
- **FR-011**: El éxito simulado DEBE redirigir a /login con el mensaje de AC-103, perceptible al llegar. Solo el flujo exitoso DEBE originar ese aviso; NO DEBE crear, modificar ni habilitar cuentas o credenciales, ni iniciar sesión automáticamente. La autenticación DEBE dar los mismos resultados antes y después del registro bajo idéntica configuración: las credenciales de cuentas de demostración existentes conservan su acceso y las no admitidas previamente siguen sin ser admitidas.
- **FR-012**: Google y Apple DEBEN estar disponibles como acciones informativas que muestran exactamente "Próximamente", sin enviar el formulario ni iniciar registro externo.
- **FR-013**: "¿Ya tienes cuenta? Inicia sesión" DEBE navegar a /login sin mensaje de éxito ni datos del formulario.
- **FR-014**: Escritorio DEBE mostrar panel de marca y formulario; móvil DEBE mostrar únicamente el panel del formulario. Entre 320 y 1440 px DEBE mantenerse el uso sin desplazamiento horizontal ni pérdida de datos al redimensionar.
- **FR-015**: La pantalla DEBE mantener los colores, tipografía, jerarquía y estados de controles del login existente y los lineamientos corporativos aplicables.
- **FR-016**: Toda la experiencia DEBE cumplir WCAG 2.1 AA, incluyendo operación por teclado, orden lógico, foco visible, etiquetas, errores asociados, anuncios de estado y contraste; el color NO DEBE ser el único indicador de error.
- **FR-017**: El registro DEBE limitarse a una demostración sin envío ni persistencia de datos personales o credenciales. NO DEBE exponerlos en mensajes, direcciones de navegación ni registros de diagnóstico. Al abandonar o recargar el registro DEBE descartarse el intento; un nuevo registro DEBE empezar vacío.
- **FR-018**: Un fallo inesperado DEBE ofrecer el mensaje de AC-207 y permitir reintentar conservando los datos de la edición actual, sin redirigir ni mostrar éxito.
- **FR-019**: El enlace "Regístrate" del login DEBE abrir la pantalla de registro mediante puntero o teclado, con campos vacíos y términos desmarcados, sin transferir credenciales; esta navegación DEBE sustituir su aviso previo de función no disponible.

### Key Entities

- **Intento de registro**: nombre completo, correo, contraseña, confirmación, aceptación y estado del intento (edición, inválido, envío, éxito o fallo). Solo existe durante el flujo de demostración; no representa una cuenta persistida.
- **Error de validación**: control afectado, regla incumplida y mensaje de corrección; desaparece al resolver la condición correspondiente.
- **Aviso de resultado**: confirmación del registro simulado, indisponibilidad de opciones futuras o fallo recuperable; nunca contiene datos sensibles.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al menos el 90 % de un grupo de cinco o más participantes completa el registro simulado sin asistencia en menos de dos minutos y reconoce que no se creó una cuenta real.
- **SC-002**: El 100 % de las combinaciones inválidas descritas en los criterios de aceptación y casos límite bloquea el envío y presenta el error correspondiente, sin perder otros datos ingresados.
- **SC-003**: El 100 % de los envíos válidos termina en /login con confirmación en un máximo de dos segundos; las activaciones repetidas producen un solo resultado.
- **SC-004**: El 100 % de las acciones puede completarse solo con teclado; una revisión de accesibilidad automatizada y manual no identifica incumplimientos WCAG 2.1 AA dentro del flujo.
- **SC-005**: En anchos de 320, 375, 768, 1024 y 1440 px y con ampliación al 200 %, todos los controles permanecen utilizables sin desplazamiento horizontal; móvil muestra solo formulario y escritorio dos paneles. La revisión visual confirma coherencia con el login en los cuatro aspectos de FR-015.
- **SC-006**: El 100 % de las activaciones de Google y Apple presenta "Próximamente" sin alterar el formulario; el enlace de inicio de sesión siempre lleva a /login sin éxito espurio y "Regístrate" en el login siempre abre un registro vacío.
- **SC-007**: Ningún escenario de registro transmite o conserva datos personales o credenciales fuera de la edición actual, crea o modifica cuentas o habilita credenciales nuevas. En el 100 % de las comparaciones de autenticación antes y después, bajo idéntica configuración, se conserva el resultado previo, tanto para credenciales admitidas como no admitidas; ningún registro inicia sesión automáticamente.
- **SC-008**: En todos los fallos simulados revisados, el usuario recibe una explicación comprensible y puede reintentar conservando sus datos.

## Assumptions

- El idioma es español. El registro es una simulación educativa; cualquier dato que cumpla las reglas puede completar el flujo sin comprobar existencia o duplicidad del correo. La coincidencia con una cuenta de demostración previa no cambia su autenticación; completar el registro no otorga ni revoca acceso.
- La pantalla de login existente y su especificación [001-login-billetera](../001-login-billetera/spec.md) son referencias de continuidad visual. La llegada a /login y su aviso de éxito forman parte de esta feature; las reglas de acceso existentes se conservan.
- La entrada al registro desde "Regístrate" del login está incluida por aclaración expresa del usuario. Para este enlace, FR-019 sustituye el comportamiento informativo previsto en FR-016 y AC-1 de la historia 5 de la especificación de login; las demás acciones de ese flujo conservan su alcance.
- Se asumen móvil los anchos inferiores a 768 px y escritorio los anchos desde 1024 px. Entre ambos, la disposición puede adaptarse siempre que el formulario permanezca íntegro. Estos valores permiten verificar la presentación sin imponer una técnica de implementación.
- Los límites superiores de nombre y contraseña, la normalización periférica y el formato de correo son valores de alcance asumidos para acotar entradas; la contraseña sigue el límite de la demostración de login existente.
- La casilla representa aceptación en la demostración. Redactar documentos legales o construir una pantalla de términos no forma parte de esta feature.
- No se exige que el aviso de éxito sobreviva a una recarga de /login; sí que aparezca y sea anunciado en la llegada desde el registro exitoso.

### Alcance y exclusiones

Incluye formulario, validaciones, aceptación, estados de envío y error, simulación exitosa, aviso al llegar a /login, entrada desde "Regístrate" del login, opciones sociales informativas y presentación responsive accesible.

Quedan fuera backend, base de datos, autenticación real, persistencia de credenciales o cuentas, registro real con Google o Apple, envío de correos de confirmación, recuperación de contraseña y modificación de la Constitution.

### Conformidad y dependencias

La [Constitution v1.0.0](../../.specify/memory/constitution.md) permanece vigente sin modificaciones. Aplican validación y protección de datos (5.1, 5.3–5.5), accesibilidad (8.4), continuidad con el sistema de diseño (8.5–8.6) y trazabilidad (9.2). La planificación deberá verificar todos sus principios (9.5), incluido TDD (1.1–1.4), sin que esta especificación seleccione tecnologías o arquitectura.

Como condiciones obligatorias de integración conforme a 5.6, 8.1 y 9.4, se DEBE ejecutar análisis estático de seguridad del código además de los controles de calidad y secretos. La cobertura del código nuevo o modificado DEBE alcanzar el umbral del 80 % en líneas, ramas, funciones y sentencias, sin disminuir ninguna de las cuatro métricas globales frente a una referencia comparable. Un control fallido, informe incompleto o evidencia ausente NO DEBE considerarse aprobado. No se autoriza ninguna excepción constitucional mediante esta especificación.

No se identificaron BRD o ARD en los archivos del proyecto revisados. Si se incorporan documentos aplicables, deberán referenciarse y verificarse según el Principio VI antes de implementar.

### Matriz de trazabilidad

Cada requisito tiene cobertura de aceptación; los identificadores se conservarán para vincular pruebas y tareas posteriores conforme a 9.2.

| Historia | Requisitos funcionales | Criterios de aceptación | Casos límite | Resultados |
| --- | --- | --- | --- | --- |
| US1 | FR-001, FR-002, FR-007, FR-010, FR-011, FR-017 | AC-101–AC-105 | EC-001, EC-007, EC-010, EC-013 | SC-001, SC-003, SC-007 |
| US2 | FR-002–FR-009, FR-018 | AC-201–AC-207 | EC-001–EC-006, EC-008, EC-011 | SC-002, SC-008 |
| US3 | FR-014–FR-016 | AC-301–AC-305 | EC-009 | SC-004, SC-005 |
| US4 | FR-009, FR-012, FR-013, FR-017, FR-019 | AC-401–AC-403 | EC-010, EC-012 | SC-006, SC-007 |

