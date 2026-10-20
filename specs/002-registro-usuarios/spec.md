# Feature Specification: Registro de Usuarios de KynWallet

**Feature Branch**: `feature/registro-hector-najarro`  
**Feature Directory**: `specs/002-registro-usuarios/`  
**Created**: 2026-10-20  
**Status**: Alcance confirmado — demostración frontend sin backend  
**Input**: Taller práctico «Registro de Usuarios — KynWallet · SDD + Figma MCP» (páginas 1–4).

**Objetivo**: construir la pantalla de Registro de Usuarios de KynWallet siguiendo el flujo Spec Driven Development (SDD), tomando como referencia el frame `04 · Registro` de Figma y respetando la Constitución del repositorio.

**Diseño de referencia**: [Figma — Billetera Virtual, frame 04 · Registro](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2). El PDF proporciona una captura alternativa si no es posible acceder al diseño mediante el MCP de Figma. La composición de escritorio usa un panel de marca de fondo naranja con el titular «Comienza tu camino financiero.» y un panel de formulario titulado «Crea tu cuenta».

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Completar el registro y regresar al inicio de sesión (Priority: P1)

Como visitante de KynWallet, quiero completar un formulario de creación de cuenta y recibir una confirmación para continuar hacia la pantalla de inicio de sesión.

**Why this priority**: es el flujo principal que se evalúa en el taller.

**Independent Test**: completar los cuatro campos con valores válidos, aceptar los términos y pulsar «Crear cuenta»; comprobar la llegada a `/login` y la presentación del mensaje de éxito.

**Acceptance Scenarios**:

1. **Given** que el visitante está en la pantalla de registro, **When** ingresa un nombre completo, correo válido, contraseña de al menos 8 caracteres y confirmación idéntica, acepta los términos y presiona «Crear cuenta», **Then** se procesa una única solicitud de registro y, cuando se confirma el éxito, se navega a `/login` con un mensaje de éxito visible y accesible.
2. **Given** que el formulario tiene datos correctos, **When** el visitante presiona Enter desde un campo del formulario, **Then** se obtiene el mismo resultado que al pulsar «Crear cuenta».
3. **Given** que un envío válido está en curso, **When** el visitante intenta volver a enviar, **Then** no se ejecuta un segundo envío simultáneo.

---

### User Story 2 — Corregir errores del formulario (Priority: P1)

Como visitante, quiero ver mensajes de error junto a los campos incorrectos para poder corregirlos antes del registro.

**Why this priority**: el taller exige validación antes de enviar y retroalimentación inline.

**Independent Test**: intentar enviar con todos los campos vacíos y luego con correo incorrecto, contraseña corta, contraseñas distintas y términos sin aceptar; verificar que no se complete el registro y que se muestre el error correspondiente.

**Acceptance Scenarios**:

1. **Given** que el formulario está vacío, **When** el visitante pulsa «Crear cuenta», **Then** se indican los cuatro campos obligatorios y la necesidad de aceptar los términos, no se registra el usuario y el foco se dirige al primer control inválido.
2. **Given** un correo sin formato válido, **When** el visitante intenta enviar o sale del campo, **Then** se muestra un error junto al correo.
3. **Given** una contraseña de menos de 8 caracteres, **When** se valida el formulario, **Then** se muestra un error junto a la contraseña.
4. **Given** que las contraseñas no coinciden, **When** se valida el formulario, **Then** se muestra un error junto a «Confirmar contraseña».
5. **Given** que los términos no están aceptados, **When** el visitante intenta enviar, **Then** no se completa el registro y se indica que debe aceptarlos.
6. **Given** un error de validación visible, **When** el visitante corrige el valor, **Then** el error correspondiente desaparece tras la revalidación sin borrar los demás campos.

---

### User Story 3 — Acceder al inicio de sesión sin registrarse (Priority: P2)

Como visitante que ya tiene una cuenta, quiero usar el enlace «¿Ya tienes cuenta? Inicia sesión» para ir directamente al inicio de sesión.

**Why this priority**: es un requisito explícito de navegación y permite completar el recorrido entre ambas pantallas.

**Independent Test**: activar el enlace y comprobar que se abre la ruta `/login`.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el visitante activa «¿Ya tienes cuenta? Inicia sesión», **Then** navega a `/login`.
2. **Given** que se alcanzó `/login` tras un registro exitoso, **When** se carga el formulario de acceso, **Then** el mensaje de registro exitoso es visible y se anuncia a tecnologías de asistencia, sin incluir contraseñas ni otros datos sensibles.

---

### User Story 4 — Utilizar el registro en escritorio y móvil (Priority: P2)

Como visitante, quiero que la pantalla se adapte al tamaño de mi dispositivo para completar el formulario sin perder funcionalidad.

**Why this priority**: el PDF exige expresamente dos paneles en escritorio y solo el formulario en móvil.

**Independent Test**: verificar la vista de escritorio con ambos paneles y una vista móvil de 320 px sin panel promocional ni desplazamiento horizontal.

**Acceptance Scenarios**:

1. **Given** un ancho de escritorio, **When** se muestra el registro, **Then** aparecen el panel de marca y el panel del formulario, siguiendo la jerarquía del frame `04 · Registro`.
2. **Given** un ancho móvil, **When** se muestra el registro, **Then** solo aparece el área de formulario, que sigue siendo completamente operable sin desplazamiento horizontal.
3. **Given** cualquier tamaño soportado, **When** el visitante usa teclado o lector de pantalla, **Then** puede identificar y operar todos los campos, errores, checkbox, botones y enlaces.

---

### User Story 5 — Recibir información sobre Google y Apple (Priority: P3)

Como visitante, quiero que los botones de Google y Apple indiquen que todavía no están disponibles, para entender por qué no puedo registrarme por esos medios.

**Why this priority**: deben aparecer según el diseño, pero no se requiere implementar proveedores de identidad.

**Independent Test**: activar los botones de Google y Apple, por separado, y comprobar el aviso esperado.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** se activa el botón «Google», **Then** aparece un `alert` con el texto exacto «Próximamente», sin navegar ni enviar el formulario.
2. **Given** la pantalla de registro, **When** se activa el botón «Apple», **Then** aparece un `alert` con el texto exacto «Próximamente», sin navegar ni enviar el formulario.

---

### User Story 6 — Verificar la contraseña introducida (Priority: P3)

Como visitante, quiero poder mostrar u ocultar la contraseña y su confirmación para comprobar lo que escribí.

**Why this priority**: los controles de visibilidad aparecen en el diseño de referencia y mejoran la usabilidad.

**Independent Test**: alternar la visibilidad de ambos campos y comprobar que conservan sus valores y que el control tiene un nombre accesible.

**Acceptance Scenarios**:

1. **Given** una contraseña oculta, **When** se activa su control de visibilidad, **Then** se muestra temporalmente el texto sin alterar su valor.
2. **Given** la contraseña visible, **When** se activa de nuevo el control, **Then** vuelve a ocultarse.
3. **Given** los controles de visibilidad, **When** se operan con teclado, **Then** pueden activarse y sus nombres o estados son comprensibles para tecnologías de asistencia.

### Edge Cases

- Correo con espacios al inicio o al final: se eliminan únicamente esos espacios al validar; la comparación de correos no distingue mayúsculas de minúsculas.
- Contraseña con espacios: se conserva exactamente como fue escrita; no se recorta ni transforma.
- Longitudes por encima de los límites definidos en los supuestos (nombre de más de 80 caracteres, correo de más de 254, contraseña de más de 128): se indica el error sin completar el registro.
- La confirmación cambia después de editar la contraseña: se revalida la coincidencia.
- El visitante pega contenido en los campos: se valida igual que cuando escribe.
- Doble clic o envíos repetidos: no generan procesamiento simultáneo.
- La simulación de registro falla inesperadamente: se presenta un mensaje genérico, sin revelar datos internos, y el usuario permanece en registro.
- La pantalla se abre directamente en `/login` o en la ruta de registro: ambas rutas deben ser accesibles desde la aplicación.
- El visitante intenta usar Google o Apple sin completar el formulario: se muestra «Próximamente» sin desencadenar validación.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE seguir la estructura y jerarquía del frame `04 · Registro` de Figma, reutilizando los tokens y componentes visuales existentes cuando corresponda.
- **FR-002**: El formulario DEBE incluir cuatro campos etiquetados: «Nombre completo», «Correo electrónico», «Contraseña» y «Confirmar contraseña».
- **FR-003**: El formulario DEBE incluir una casilla para aceptar los términos y condiciones; su aceptación es obligatoria para enviar.
- **FR-004**: El botón «Crear cuenta» DEBE validar el formulario completo antes de iniciar el registro.
- **FR-005**: Los cuatro campos DEBEN ser obligatorios; los campos de solo espacios no cuentan como nombre o correo válidos.
- **FR-006**: El correo DEBE tener un formato de dirección válido y no superar 254 caracteres; se ignorarán espacios periféricos.
- **FR-007**: La contraseña DEBE tener al menos 8 caracteres y no superar 128; su contenido NO DEBE modificarse automáticamente.
- **FR-008**: «Confirmar contraseña» DEBE coincidir exactamente con «Contraseña».
- **FR-009**: Las validaciones DEBEN mostrarse de forma inline, junto al campo o control correspondiente, y DEBEN actualizarse cuando el usuario corrija la entrada.
- **FR-010**: Mientras haya errores de validación o los términos no estén aceptados, el sistema NO DEBE enviar ni confirmar el registro.
- **FR-011**: Tras confirmación de registro exitoso, el sistema DEBE redirigir a `/login` y mostrar allí un mensaje de éxito.
- **FR-012**: El enlace «¿Ya tienes cuenta? Inicia sesión» DEBE llevar a `/login`.
- **FR-013**: Los botones «Google» y «Apple» DEBEN mostrar un `alert` con el texto exacto «Próximamente»; no deben implementar autenticación social.
- **FR-014**: En escritorio la pantalla DEBE presentar dos paneles (marca y formulario); en móvil DEBE mostrar solo el formulario y evitar desplazamiento horizontal.
- **FR-015**: La interfaz DEBE poder utilizarse con teclado, tener etiquetas, foco visible y errores/resultados anunciados, cumpliendo WCAG 2.1 AA.
- **FR-016**: Los campos de contraseña DEBEN ocultar el texto por defecto y permitir mostrarlo u ocultarlo mediante controles accesibles.
- **FR-017**: El envío DEBE poder activarse con Enter y DEBE impedir envíos simultáneos duplicados.
- **FR-018**: Ninguna contraseña ni dato sensible DEBE aparecer en URL, mensajes de error, registros de diagnóstico ni archivos versionados.
- **FR-019**: Se DEBEN manejar los fallos inesperados con mensajes comprensibles que no expongan información interna.
- **FR-020**: El nombre completo DEBE tener entre 1 y 80 caracteres después de eliminar espacios al inicio y al final (límite propuesto para alinear con la cuenta de demostración existente; confirmar antes del plan).

### Key Entities

- **Solicitud de registro**: nombre completo, correo electrónico, contraseña, confirmación y aceptación de términos; existe durante la interacción del formulario. Contraseña y confirmación son datos sensibles y no deben divulgarse.
- **Resultado de registro**: estado de éxito o fallo de la operación de registro; permite decidir si se muestra un error o se redirige a `/login` con confirmación.
- **Mensaje de confirmación**: notificación visible y accesible de que el flujo se completó correctamente; no incluye credenciales.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los escenarios de aceptación de las historias P1 y P2 están cubiertos por pruebas automatizadas que pasan.
- **SC-002**: Un formulario inválido nunca genera una confirmación de registro ni una navegación de éxito, en todas las combinaciones de errores cubiertas por las pruebas.
- **SC-003**: Un formulario válido y con términos aceptados finaliza en `/login` con un mensaje de éxito que puede identificarse por texto y tecnologías de asistencia.
- **SC-004**: En tamaños de pantalla de 320 px y de escritorio no existe desplazamiento horizontal y se cumple la estructura de paneles correspondiente.
- **SC-005**: La pantalla no presenta incumplimientos detectados por la auditoría automatizada de accesibilidad y es utilizable solamente con teclado.
- **SC-006**: Una revisión visual del frame de Figma (o, si el MCP no está disponible, de la captura del PDF) valida el orden, la jerarquía y los elementos esenciales de la interfaz.
- **SC-007**: Los controles de calidad del repositorio (pruebas, construcción, análisis estático, secretos y dependencias) pasan antes del Pull Request.

## Assumptions & Open Questions

### Supuestos y decisiones

- El proyecto base es una demostración solo del lado del cliente; actualmente el inicio de sesión usa cuentas ficticias definidas en configuración y no tiene backend ni base de datos. **Se simula el resultado exitoso del registro, sin afirmar que la cuenta quede almacenada o pueda iniciar sesión posteriormente**. Este alcance fue confirmado para el taller.
- El acceso al formulario de registro tendrá la ruta `/registro`; la ruta de destino `/login` sí es obligatoria según el taller.
- El máximo de 80 caracteres para el nombre, 254 para el correo y 128 para la contraseña se toma por consistencia con las restricciones ya existentes del inicio de sesión, no por una exigencia explícita del PDF.
- La interfaz estará en español. El texto exacto de validaciones y mensaje de éxito puede definirse en el plan, siempre que sea claro, accesible y consistente con el proyecto.
- La captura del PDF es una referencia visual válida cuando el MCP de Figma no está disponible, tal como permite el taller.
- No se identificaron documentos BRD o ARD en los archivos proporcionados; si existen fuera del repositorio, deberán revisarse antes de implementar.

### Decisiones confirmadas

- **OQ-001 — Resultado**: registro de demostración frontend, sin backend y sin creación o persistencia de cuentas.
- **OQ-002 — Ruta de entrada**: `/registro`, enlazada desde el inicio de sesión. La pantalla de destino `/login` es obligatoria por el PDF.

## Constitution Alignment

- **I — TDD**: cada requisito funcional deberá contar con pruebas escritas antes del código correspondiente (Rojo → Verde → Refactorizar).
- **II–III — SOLID y Clean Architecture**: la lógica de validación y el resultado de registro pertenecerán al dominio/aplicación; la UI se limitará a presentación y eventos, con infraestructura sustituible.
- **IV — DRY / KISS / YAGNI**: se reutilizarán validaciones y controles existentes y no se agregará un proveedor social o backend fuera de alcance.
- **V — Seguridad**: los datos de contraseña no se persistirán ni se mostrarán en errores, URLs ni registros; el supuesto de demo no debe confundirse con registro seguro de producción.
- **VI — BRD / ARD**: si aparecen documentos aplicables, deberán prevalecer según lo establecido por la Constitución.
- **Estándares 8.4–8.6**: se reutilizarán componentes y tokens; se verificará accesibilidad WCAG 2.1 AA.
- **Gobernanza 9.2 y 9.5**: las tareas y pruebas del plan deberán citar los identificadores `FR-*` y los escenarios de usuario; el plan realizará la comprobación formal de cumplimiento.
