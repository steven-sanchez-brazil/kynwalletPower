# Feature Specification: Registro de cuenta de KynWallet

**Feature Branch**: `feature/registro-sebastian-zmener`  
**Created**: 2026-10-20  
**Status**: Draft  
**Input**: Continuar la billetera virtual con una pantalla de registro basada en `registro.svg`, que solicite nombre completo, correo electrónico, contraseña, confirmación de contraseña y aceptación de términos y condiciones; valide los datos y simule la creación de la cuenta sin backend ni base de datos. Tras un registro válido, ir a `/login` con un mensaje de éxito. Google y Apple muestran “Próximamente”.  
**Diseño de referencia**: [`registro.svg`](./registro.svg), lienzo de escritorio de 1440 × 1024. La estructura, identidad visual y jerarquía de la pantalla de registro deben seguir este recurso local.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Completar un registro de demostración (Priority: P1)

Como visitante, quiero completar un formulario breve y recibir confirmación en la pantalla de acceso, para comprobar cómo sería la creación de una cuenta de KynWallet.

**Why this priority**: es el resultado principal solicitado y permite demostrar el flujo de registro de extremo a extremo.

**Independent Test**: completar los cinco controles obligatorios con datos válidos y verificar que se abre `/login` con un mensaje de éxito sin crear una cuenta real.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro vacía, **When** la persona ingresa nombre completo, correo válido, contraseña válida, la misma contraseña en confirmación, acepta los términos y envía el formulario, **Then** se simula la creación de la cuenta, se abre `/login` y se muestra allí un mensaje de éxito.
2. **Given** un envío válido en curso, **When** la simulación todavía no terminó, **Then** el control de envío indica progreso y evita envíos duplicados.
3. **Given** el mensaje de éxito en `/login`, **When** la persona lo lee, **Then** se informa claramente que la creación fue simulada y que no existe una cuenta real ni datos guardados.
4. **Given** el formulario completo y válido, **When** la persona lo envía con la tecla Enter, **Then** obtiene el mismo resultado que al activar el botón de registro.

---

### User Story 2 - Corregir datos inválidos (Priority: P1)

Como visitante, quiero saber qué dato debo corregir, para completar el registro sin adivinar por qué falló.

**Why this priority**: el resultado de error y la prevención de registros inválidos son parte indispensable del flujo.

**Independent Test**: enviar el formulario vacío y luego probar cada regla inválida por separado; verificar mensajes asociados al control afectado y que no se navega a `/login`.

**Acceptance Scenarios**:

1. **Given** el formulario vacío, **When** se intenta enviarlo, **Then** se indican como obligatorios el nombre, correo, contraseña, confirmación y aceptación de términos; no se inicia la simulación ni se navega a `/login`, y el foco va al primer control inválido.
2. **Given** un nombre con menos de 2 o más de 100 caracteres después de quitar espacios periféricos, **When** se valida, **Then** se muestra un error junto al nombre y no se registra.
3. **Given** un correo mal formado o de más de 254 caracteres, **When** se valida, **Then** se muestra un error junto al correo y no se registra.
4. **Given** una contraseña de menos de 8 o más de 128 caracteres, **When** se valida, **Then** se muestra un error junto a la contraseña y no se registra.
5. **Given** una confirmación distinta de la contraseña, **When** se valida, **Then** se muestra un error junto a la confirmación y no se registra.
6. **Given** todos los campos válidos pero la casilla de términos sin marcar, **When** se intenta enviar, **Then** se indica que la aceptación es obligatoria y no se registra.
7. **Given** un error visible, **When** la persona corrige el dato afectado, **Then** desaparece el error correspondiente sin borrar los demás datos ingresados.

---

### User Story 3 - Revisar contraseña y condiciones (Priority: P2)

Como visitante, quiero comprobar lo que escribí y consultar las condiciones antes de aceptarlas, para enviar el formulario con confianza.

**Why this priority**: facilita una decisión informada y reduce errores de escritura.

**Independent Test**: alternar la visibilidad de cada contraseña, abrir la información de términos y volver al formulario conservando lo ingresado.

**Acceptance Scenarios**:

1. **Given** contraseñas ocultas, **When** se activa el control de visibilidad de cualquiera de ellas, **Then** solo ese campo alterna entre texto visible y oculto, conserva su valor y el control anuncia su acción.
2. **Given** la casilla de términos, **When** la persona activa el acceso a “Términos y condiciones”, **Then** puede consultar el texto aplicable sin que la casilla se marque automáticamente ni se pierdan los datos del formulario.
3. **Given** la información de términos consultada, **When** la persona regresa al formulario, **Then** puede aceptar o no aceptar de forma explícita.

---

### User Story 4 - Navegar entre acceso y registro (Priority: P2)

Como visitante que ya tiene una cuenta de demostración, quiero volver al inicio de sesión, para elegir el flujo adecuado.

**Why this priority**: el registro continúa la pantalla de acceso existente y necesita una navegación coherente.

**Independent Test**: activar el enlace de inicio de sesión desde registro y verificar que se presenta esa pantalla.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** la persona activa el acceso “Iniciar sesión”, **Then** se muestra la pantalla de login existente.
2. **Given** la pantalla de login existente, **When** la persona activa “Regístrate”, **Then** se muestra el formulario de registro.

---

### User Story 5 - Conocer la disponibilidad del registro social (Priority: P3)

Como visitante, quiero saber si puedo crear mi cuenta con Google o Apple, para no esperar una operación que la demostración todavía no ofrece.

**Why this priority**: los botones forman parte del diseño, pero el registro social está fuera del alcance de la simulación.

**Independent Test**: activar cada botón y verificar el aviso “Próximamente” sin iniciar navegación ni registro.

**Acceptance Scenarios**:

1. **Given** el formulario de registro, **When** la persona activa Google o Apple, **Then** se muestra “Próximamente”, se conservan los datos del formulario y no se inicia la simulación.

### Edge Cases

- Los espacios al principio y al final del nombre y correo se ignoran al validar; los espacios internos del nombre se conservan. Un nombre compuesto por espacios se considera vacío.
- El correo se trata sin distinguir mayúsculas y minúsculas. No se comprueba si ya existe, porque no hay cuentas persistidas.
- La contraseña y su confirmación se comparan exactamente, incluidos espacios y mayúsculas. No se muestran en mensajes, URL ni registros.
- Pegar texto en cualquier campo produce la misma validación que escribirlo.
- Repetir el envío durante la simulación no produce resultados duplicados.
- Si ocurre un fallo inesperado en la simulación, se muestra un mensaje genérico, se conserva la información no sensible y se permite volver a intentar; no se navega a `/login`.
- Al recargar la página se vuelve a un formulario vacío: el registro simulado no persiste.
- En pantallas estrechas, desde 320 px, el formulario sigue siendo legible y operable sin desplazamiento horizontal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE presentar la estructura, identidad y jerarquía visual de `registro.svg`: dos paneles en escritorio y solo el formulario en móvil; DEBE usar los lineamientos del sistema de diseño corporativo cuando existan.
- **FR-002**: El formulario DEBE incluir controles etiquetados “Nombre completo”, “Correo electrónico”, “Contraseña”, “Confirmar contraseña” y aceptación explícita de “Términos y condiciones”, además del botón “Crear cuenta”.
- **FR-003**: El nombre completo DEBE ser obligatorio, contener entre 2 y 100 caracteres tras quitar espacios periféricos y admitir letras Unicode, espacios internos y separadores habituales de nombres (guion y apóstrofo); NO DEBE aceptar solo separadores.
- **FR-004**: El correo DEBE ser obligatorio, tener un formato de correo válido y una longitud máxima de 254 caracteres; DEBE ignorar espacios periféricos y diferencias de mayúsculas para su interpretación.
- **FR-005**: La contraseña DEBE ser obligatoria y tener entre 8 y 128 caracteres; sus caracteres NO DEBEN recortarse ni modificarse.
- **FR-006**: La confirmación DEBE ser obligatoria y coincidir exactamente con la contraseña.
- **FR-007**: La casilla de términos DEBE comenzar desmarcada, requerir una acción explícita para marcarla y bloquear el registro mientras permanezca desmarcada.
- **FR-008**: La persona DEBE poder consultar el texto de términos y condiciones aplicable antes de aceptarlo, sin que esa consulta equivalga a consentimiento.
- **FR-009**: Los errores de validación DEBEN mostrarse junto al control correspondiente al salir del campo o al intentar enviar, y desaparecer al corregirlo. El primer control inválido DEBE recibir el foco al intentar enviar.
- **FR-010**: La simulación de creación de cuenta DEBE empezar solo cuando todos los controles sean válidos y los términos hayan sido aceptados; durante el proceso DEBE indicar progreso y bloquear envíos duplicados.
- **FR-011**: Tras completar la simulación, la aplicación DEBE navegar a `/login` y mostrar allí un mensaje de éxito que indique que la creación fue solo demostrativa y no quedó guardada.
- **FR-012**: Si falla la simulación por un error inesperado, la pantalla DEBE mostrar un mensaje comprensible sin detalles internos y permitir reintentar; NO DEBE navegar a `/login`.
- **FR-013**: El registro NO DEBE crear una cuenta real ni depender de servicios backend o base de datos; NO DEBE guardar nombre, correo, contraseña, confirmación o aceptación en almacenamiento persistente.
- **FR-014**: Las contraseñas DEBEN estar ocultas por defecto y disponer de controles independientes y accesibles para mostrarlas u ocultarlas; sus valores NO DEBEN aparecer en mensajes, registros ni URL.
- **FR-015**: La pantalla DEBE ser operable con teclado y cumplir WCAG 2.1 AA: etiquetas asociadas, foco visible y lógico, errores vinculados a los controles y resultados anunciados a tecnologías de asistencia.
- **FR-016**: La pantalla de registro DEBE mostrar “¿Ya tienes cuenta?” con el vínculo “Inicia sesión” hacia `/login`, y el enlace “Regístrate” del login DEBE abrir el registro cuando se implemente esta funcionalidad.
- **FR-017**: La pantalla DEBE conservar su funcionalidad desde 320 px de ancho sin desplazamiento horizontal.
- **FR-018**: Los botones Google y Apple DEBEN mostrarse según el diseño y, al activarse, DEBEN mostrar “Próximamente” sin iniciar registro ni perder los datos ingresados.

### Key Entities

- **Solicitud de registro de demostración**: nombre completo, correo, contraseña, confirmación y aceptación de términos aportados en el formulario. Existe solo durante la interacción actual.
- **Resultado de registro simulado**: estado de validación, progreso, confirmación para `/login` o error inesperado. No representa una cuenta persistente ni habilita autenticación real.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una persona puede completar el registro de demostración con datos válidos en menos de 2 minutos desde que aparece la pantalla.
- **SC-002**: En el 100 % de los intentos con un control inválido, se muestra el error correspondiente y se permanece en el registro.
- **SC-003**: En el 100 % de los intentos válidos, se abre `/login` y se muestra la confirmación de que no se creó una cuenta real en un máximo de 2 segundos después del envío.
- **SC-004**: Al menos el 90 % de las personas participantes en una prueba de usabilidad completan el flujo válido sin ayuda.
- **SC-005**: La pantalla se puede completar solo con teclado y una revisión automatizada y manual no detecta incumplimientos de WCAG 2.1 AA.
- **SC-006**: La revisión frente a `registro.svg` no detecta diferencias en los controles requeridos, su orden ni la jerarquía visual principal en escritorio.
- **SC-007**: El 100 % de los criterios de aceptación asociados a los requisitos funcionales cuenta con una prueba automatizada identificable antes de implementar el comportamiento, conforme a la Constitución 1.1 y 9.2.

## Assumptions

- La expresión “validación indicada más abajo” no trae reglas adicionales en la solicitud. Se adoptan las longitudes de correo y contraseña ya documentadas para el login (`specs/001-login-billetera/spec.md`); el límite y caracteres permitidos del nombre son supuestos de esta especificación.
- La confirmación de contraseña debe coincidir exactamente, sin reglas adicionales de complejidad. La demostración no exige verificar propiedad del correo ni comprobar duplicados.
- El contenido consultable de “Términos y condiciones” se encuentra en [`terminos-y-condiciones.md`](./terminos-y-condiciones.md), aprobado por la persona responsable del proyecto el 2026-10-20 para la demostración.
- No hay sesión, cuenta ni consentimiento persistente. El mensaje en `/login` termina el flujo de demostración y debe distinguirse de una cuenta real; el formulario de acceso permanece vacío.
- El idioma de la interfaz es español. La pantalla de login existente se integrará con el registro al implementar esta funcionalidad; su especificación actual aún describe “Regístrate” como no disponible.
- No se encontraron BRD ni ARD en el repositorio. Si se incorporan, esta especificación debe referenciar sus secciones aplicables y alinearse con ellas (Constitución VI).
- La implementación futura debe seguir TDD, separación de responsabilidades, seguridad por diseño, trazabilidad y verificaciones de accesibilidad de la Constitución. Esas decisiones se detallarán en el plan sin imponer una tecnología en esta especificación.
