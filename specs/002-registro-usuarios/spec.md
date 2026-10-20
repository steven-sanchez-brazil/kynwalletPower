# Feature Specification: Registro de usuarios de KynWallet

**Feature Branch**: `feature/registro-miguel-misericordia`

**Created**: 2026-10-19

**Status**: Draft

**Input**: Crear una demostración funcional e independiente de registro de usuarios para
KynWallet, basada en el frame `04 · Registro` de Figma. La experiencia debe validar nombre,
correo, contraseña, confirmación y aceptación de términos; simular un resultado exitoso;
comunicarlo de forma perceptible; y dirigir al usuario a `/login`, sin crear cuentas reales ni
persistir datos personales o credenciales.

## Contexto y propósito

La funcionalidad permite demostrar el flujo de creación de una cuenta de KynWallet antes de
iniciar sesión. Su propósito es que una persona pueda completar sus datos, comprender y corregir
errores, aceptar los términos y recibir confirmación clara de un registro simulado.

Esta especificación define el comportamiento observable, las restricciones de seguridad,
privacidad y accesibilidad, y la fidelidad visual requerida. No define decisiones de
implementación.

## Alcance y exclusiones

### Incluido

- Captura y validación de nombre completo, correo electrónico, contraseña y confirmación.
- Aceptación obligatoria de términos y condiciones.
- Simulación del registro y comunicación de éxito o error inesperado.
- Navegación hacia `/login` desde el resultado exitoso y desde el enlace existente.
- Avisos para alternativas de registro todavía no disponibles.
- Experiencia de escritorio, móvil, teclado y tecnologías de asistencia.

### Excluido

- Creación de cuentas reales, persistencia de perfiles o almacenamiento de credenciales.
- Verificación de correo, recuperación de contraseña o inicio automático de sesión.
- Registro real mediante Google o Apple.
- Navegación a un documento real de términos y condiciones.
- Servicios backend, bases de datos o sesiones persistentes.

## Diseño oficial y fidelidad visual

**Fuente oficial**: [Figma · Billetera Virtual — Prototipos (Copy)](https://www.figma.com/design/8d93T5F40yvMNXngrH48qt/Billetera-Virtual---Prototipos--Copy-?node-id=31-2)

**Frame verificado mediante Figma MCP**: `04 · Registro`, nodo `31:2`, referencia de escritorio
de `1440 × 1024 px`.

La consulta directa confirmó la siguiente jerarquía visual:

- Panel de marca izquierdo de `620 × 1024 px`, con logotipo KynWallet, titular “Comienza tu
  camino financiero.”, texto de apoyo y tarjeta ilustrativa.
- Panel de formulario blanco a la derecha, con contenido principal de 400 px de ancho.
- Encabezado “Crea tu cuenta” y subtítulo “Completa tus datos para comenzar”.
- Cuatro controles en este orden: “Nombre completo”, “Correo electrónico”, “Contraseña” y
  “Confirmar contraseña”.
- Casilla “Acepto los términos y condiciones”, acción principal “Crear cuenta”, separador
  “o regístrate con”, acciones “Google” y “Apple”, y pie “¿Ya tienes cuenta? Inicia sesión”.

Los atributos visuales verificados son:

- Tipografía Inter; logotipo 26 px negrita; titular promocional 44 px negrita con interlineado
  1.08; título del formulario 30 px negrita; cuerpo 16–17 px; etiquetas 14 px; contenido de
  controles y acciones 13–16 px según su jerarquía.
- Degradado promocional entre `#FF8A65` y `#EF5226`, con inclinación aproximada de 70.73° en la
  referencia obtenida.
- Texto principal `#16182C`; etiquetas `#3D3F5C`; texto secundario `#8A8BA8`; placeholders
  `#A9ABC2`; bordes y divisores `#D7D9E6`; acción principal `#FF6B3D`; enlaces `#EF5226`.
- Controles de 400 × 52 px, borde de 1.5 px y radio de 12 px; botones sociales de 192 × 48 px
  separados por 16 px; casilla de 20 × 20 px con radio de 6 px.
- Tarjeta ilustrativa de 360 × 210 px, radio de 22 px, superficie blanca al 16 % y borde blanco
  al 35 %; incluye chip y datos ficticios visibles en el diseño.
- Los campos principales avanzan con un ritmo vertical regular de 92 px entre posiciones
  equivalentes; el contenido interior de los campos mantiene 16 px de separación horizontal.
- Recursos gráficos identificados: marca de logotipo, dos controles de visibilidad y marcador
  social. Figma reutiliza el mismo marcador visual para Google y Apple.

Figma no aporta nombres accesibles ni semántica suficiente para los controles interactivos;
esas propiedades se rigen por los requisitos de accesibilidad de esta especificación y por la
Constitution. Cuando un color exacto no alcance WCAG 2.1 AA, DEBE prevalecer el contraste
accesible. La desviación DEBE conservar el rol visual y el matiz general del diseño, quedar
documentada y ser verificable en la revisión de fidelidad.

En escritorio DEBEN conservarse los paneles de marca y formulario. En móvil DEBE ocultarse el
contenido promocional y mantenerse el formulario con identidad KynWallet, completamente usable
desde 320 px y sin desplazamiento horizontal.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Completar el registro y continuar al login (Priority: P1)

Como persona interesada en KynWallet, quiero completar un registro válido y recibir confirmación,
para saber que puedo continuar al inicio de sesión.

**Why this priority**: es el resultado principal de la funcionalidad y constituye el recorrido
mínimo que entrega valor demostrable.

**Independent Test**: completar todos los campos con datos válidos, aceptar los términos y
activar “Crear cuenta”; verificar el mensaje exacto de éxito, la navegación a `/login` y la
ausencia de datos sensibles conservados.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro con todos los campos válidos y los términos aceptados,
   **When** la persona activa “Crear cuenta”, **Then** se procesa un único registro simulado.
2. **Given** un registro simulado exitoso, **When** finaliza el procesamiento, **Then** se muestra
   o anuncia “Cuenta creada correctamente. Ya puedes iniciar sesión.” antes o durante la llegada
   a `/login`, de modo que la persona pueda percibirlo.
3. **Given** el registro exitoso, **When** la persona llega a `/login`, **Then** la contraseña y
   su confirmación no aparecen ni permanecen disponibles en la interfaz, URL o almacenamiento.
4. **Given** un error inesperado durante la simulación, **When** el flujo no puede completarse,
   **Then** se informa “No pudimos crear tu cuenta. Intenta más tarde.” sin detalles internos y
   se permite volver a intentarlo.

---

### User Story 2 - Validar los datos antes de registrar (Priority: P1)

Como persona que completa el formulario, quiero recibir errores claros junto a cada dato
inválido, para poder corregirlos antes de continuar.

**Why this priority**: sin validaciones fiables no puede producirse un registro correcto, seguro
ni comprensible.

**Independent Test**: enviar el formulario vacío y luego corregir cada campo de forma aislada;
verificar los mensajes inline, el foco y que la simulación no se ejecuta mientras haya errores.

**Acceptance Scenarios**:

1. **Given** todos los campos vacíos y los términos sin aceptar, **When** se intenta enviar,
   **Then** cada requisito incumplido muestra su mensaje y el foco pasa al nombre completo.
2. **Given** un nombre con espacios periféricos y uno o más nombres compuestos, **When** se
   valida, **Then** se evalúa el contenido normalizado sin rechazar los espacios internos.
3. **Given** un nombre normalizado vacío o fuera de 1 a 80 caracteres, **When** se valida,
   **Then** aparece el error correspondiente y no se procesa el registro.
4. **Given** un correo mal formado o de más de 254 caracteres, **When** se abandona el campo o
   se intenta enviar, **Then** aparece un mensaje específico y no se procesa el registro.
5. **Given** un campo con error, **When** su valor se corrige, **Then** desaparece únicamente el
   mensaje asociado a ese campo.
6. **Given** varios campos inválidos, **When** se intenta enviar, **Then** el foco pasa al primer
   control inválido según el orden visual y de lectura.

---

### User Story 3 - Confirmar y proteger la contraseña (Priority: P2)

Como persona que se registra, quiero confirmar la contraseña y controlar temporalmente su
visibilidad, para detectar errores sin comprometer su privacidad.

**Why this priority**: evita errores de captura y protege el dato más sensible del formulario.

**Independent Test**: ingresar contraseñas válidas, no coincidentes y con longitudes límite;
operar independientemente ambos controles de visibilidad y verificar que los valores no se
alteran ni se exponen fuera de los campos.

**Acceptance Scenarios**:

1. **Given** una contraseña con menos de 8 o más de 128 caracteres, **When** se valida, **Then**
   se muestra el mensaje de longitud correspondiente y no se procesa el registro.
2. **Given** una contraseña que contiene espacios, **When** se valida y compara, **Then** los
   espacios se conservan exactamente como fueron introducidos.
3. **Given** contraseña y confirmación distintas, **When** se valida el formulario, **Then** se
   muestra “Las contraseñas no coinciden” en la confirmación.
4. **Given** ambos campos ocultos, **When** se activa el control de uno de ellos, **Then** solo
   ese campo se vuelve visible y el control anuncia su nuevo estado.
5. **Given** una contraseña visible, **When** se vuelve a activar su control, **Then** vuelve a
   ocultarse sin modificar su valor.

---

### User Story 4 - Aceptar los términos y condiciones (Priority: P2)

Como persona que se registra, quiero conocer y aceptar los términos aplicables, para confirmar
mi consentimiento antes de continuar.

**Why this priority**: la aceptación es una condición explícita del registro y debe ser
consciente, accesible y verificable.

**Independent Test**: intentar registrar sin marcar la casilla, marcarla y activar el enlace;
verificar bloqueo, corrección y aviso sin perder los datos ingresados.

**Acceptance Scenarios**:

1. **Given** datos válidos y la casilla sin seleccionar, **When** se intenta enviar, **Then** se
   muestra “Debes aceptar los términos y condiciones”, el foco llega a la casilla y no se
   procesa el registro.
2. **Given** el error de aceptación visible, **When** se selecciona la casilla, **Then** el error
   desaparece.
3. **Given** datos ya ingresados, **When** se activa “términos y condiciones”, **Then** se muestra
   “Función no disponible en esta demostración” y se conservan todos los datos y estados.

---

### User Story 5 - Consultar alternativas de registro futuras (Priority: P3)

Como persona interesada en usar Google o Apple, quiero recibir una respuesta clara al activar
esas opciones, para comprender que todavía no están disponibles.

**Why this priority**: conserva la intención del diseño sin ampliar el alcance a integraciones
externas.

**Independent Test**: completar parcialmente el formulario y activar por separado Google y
Apple; verificar el aviso exacto y la conservación de todos los valores.

**Acceptance Scenarios**:

1. **Given** cualquier estado del formulario, **When** se activa “Google”, **Then** se anuncia
   exactamente “Próximamente”, no se envía el formulario y no cambia ningún dato.
2. **Given** cualquier estado del formulario, **When** se activa “Apple”, **Then** se anuncia
   exactamente “Próximamente”, no se envía el formulario y no cambia ningún dato.

---

### User Story 6 - Ir al inicio de sesión (Priority: P3)

Como persona que ya tiene una cuenta, quiero ir directamente al inicio de sesión, para no tener
que completar un registro innecesario.

**Why this priority**: proporciona una salida clara y conecta de forma coherente las dos
experiencias de acceso de KynWallet.

**Independent Test**: activar “Inicia sesión” desde el pie y verificar que el destino sea
exactamente `/login`.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** se activa “Inicia sesión”, **Then** la persona es
   dirigida a `/login`.
2. **Given** el enlace “Inicia sesión”, **When** se recorre la pantalla con teclado, **Then** el
   enlace recibe foco visible, tiene nombre accesible y puede activarse sin puntero.

---

### User Story 7 - Usar el registro en móvil y con asistencia (Priority: P3)

Como persona que utiliza una pantalla pequeña, teclado o tecnología de asistencia, quiero
completar el registro sin barreras, para acceder al mismo flujo que el resto de usuarios.

**Why this priority**: la Constitution exige accesibilidad AA y la experiencia debe funcionar
en todos los tamaños incluidos en el alcance.

**Independent Test**: recorrer y operar toda la pantalla únicamente con teclado y repetir el
flujo a 320 px; verificar nombres accesibles, anuncios, orden de foco y ausencia de recortes o
desplazamiento horizontal.

**Acceptance Scenarios**:

1. **Given** un ancho de 320 px, **When** se muestra la pantalla, **Then** el panel promocional
   está oculto, el formulario y la identidad KynWallet son visibles y no existe desplazamiento
   horizontal, superposición ni contenido cortado.
2. **Given** la pantalla en escritorio, **When** se muestra a 1440 × 1024 px, **Then** conserva
   los paneles de marca y formulario, la jerarquía, los textos y las proporciones del frame.
3. **Given** una persona que usa teclado, **When** recorre todos los controles, **Then** el orden
   coincide con el orden visual, cada foco es visible y todas las acciones son operables.
4. **Given** un error inline, aviso o resultado de registro, **When** aparece, **Then** es
   anunciado automáticamente sin desplazar el foco de forma inesperada, salvo el foco requerido
   al primer campo inválido.

### Edge Cases

- Todos los campos están vacíos y los términos no están aceptados.
- El nombre es compuesto, contiene espacios internos o tiene espacios periféricos.
- El nombre queda vacío tras normalizar o tiene más de 80 caracteres.
- El correo tiene formato inválido o supera 254 caracteres.
- La contraseña tiene 7, 8, 128 o 129 caracteres.
- La contraseña contiene espacios al inicio, al final o en el interior.
- La confirmación está vacía o no coincide exactamente.
- Todos los datos son válidos, pero los términos no se aceptaron.
- Se activa “Crear cuenta” varias veces consecutivas durante la simulación.
- Se activa Google o Apple después de completar parcial o totalmente el formulario.
- Se activa el enlace a `/login` con datos sensibles todavía escritos.
- Todo el flujo se realiza exclusivamente con teclado.
- La ventana tiene exactamente 320 px de ancho.
- Ocurre un error inesperado durante la simulación.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE reproducir la estructura, los textos, la jerarquía y las
  proporciones verificadas del frame Figma `04 · Registro` (`31:2`), salvo las adaptaciones
  exigidas por accesibilidad y responsive.
- **FR-002**: La pantalla DEBE mostrar los campos obligatorios “Nombre completo”, “Correo
  electrónico”, “Contraseña” y “Confirmar contraseña” en ese orden.
- **FR-003**: El nombre completo DEBE normalizar únicamente sus espacios periféricos, aceptar
  nombres compuestos y contener entre 1 y 80 caracteres tras la normalización.
- **FR-004**: El correo DEBE ser obligatorio, tener formato válido, no superar 254 caracteres y
  validarse ignorando mayúsculas y espacios periféricos.
- **FR-005**: La contraseña DEBE ser obligatoria, contener entre 8 y 128 caracteres y conservar
  exactamente todos los caracteres introducidos, incluidos los espacios.
- **FR-006**: La confirmación DEBE ser obligatoria y coincidir exactamente con la contraseña.
- **FR-007**: Contraseña y confirmación DEBEN permanecer ocultas por defecto y ofrecer controles
  de visibilidad independientes, accesibles y con estado anunciado.
- **FR-008**: La pantalla DEBE incluir una casilla obligatoria de aceptación y presentar
  “términos y condiciones” como acción accesible diferenciada.
- **FR-009**: Al activar “términos y condiciones”, el sistema DEBE anunciar “Función no
  disponible en esta demostración” sin navegar ni modificar el formulario.
- **FR-010**: La pantalla DEBE mostrar errores inline comprensibles junto al control
  correspondiente al abandonar un campo inválido y al intentar enviar.
- **FR-011**: Los mensajes de validación DEBEN distinguir campo obligatorio, longitud inválida,
  correo inválido, falta de coincidencia y términos no aceptados.
- **FR-012**: El sistema NO DEBE procesar el registro mientras exista al menos un error.
- **FR-013**: Al intentar enviar con errores, el foco DEBE pasar al primer control inválido según
  el orden visual y de lectura.
- **FR-014**: El error de un campo DEBE desaparecer cuando el valor asociado satisfaga su regla,
  sin borrar errores todavía vigentes en otros campos.
- **FR-015**: “Crear cuenta” DEBE poder activarse mediante teclado y el formulario DEBE poder
  enviarse con Enter desde sus campos.
- **FR-016**: Durante la simulación, “Crear cuenta” DEBE comunicar actividad, quedar inactivo y
  aceptar como máximo un envío hasta recibir un resultado.
- **FR-017**: Un registro simulado exitoso DEBE mostrar o anunciar exactamente “Cuenta creada
  correctamente. Ya puedes iniciar sesión.” y dirigir después a `/login` manteniendo el mensaje
  perceptible.
- **FR-018**: La demostración NO DEBE crear una cuenta real ni persistir nombre, correo,
  contraseña, confirmación o aceptación de términos.
- **FR-019**: Contraseña y confirmación NO DEBEN aparecer en mensajes, URL, registros de
  diagnóstico, almacenamiento del navegador ni contenido visible fuera de sus campos.
- **FR-020**: Tras completar el flujo o navegar a `/login`, contraseña y confirmación NO DEBEN
  conservarse.
- **FR-021**: Ante un error inesperado, el sistema DEBE anunciar “No pudimos crear tu cuenta.
  Intenta más tarde.”, no revelar detalles internos y permitir un nuevo intento.
- **FR-022**: Google y Apple DEBEN mostrarse conforme al diseño y, al activarse, anunciar
  exactamente “Próximamente” sin enviar ni alterar el formulario.
- **FR-023**: El pie DEBE mostrar “¿Ya tienes cuenta? Inicia sesión” y la acción “Inicia sesión”
  DEBE dirigir exactamente a `/login`.
- **FR-024**: En escritorio, la pantalla DEBE presentar los paneles de marca y formulario con la
  identidad, contenido, orden y proporciones del frame de 1440 × 1024 px.
- **FR-025**: En móvil, el panel promocional DEBE ocultarse y el formulario DEBE mantener visible
  la identidad KynWallet y todo el contenido interactivo.
- **FR-026**: La pantalla DEBE funcionar desde 320 px sin desplazamiento horizontal, elementos
  cortados ni superposiciones.
- **FR-027**: Todos los campos y acciones DEBEN tener nombres accesibles, orden de lectura y foco
  coherentes, foco visible y operación completa con teclado.
- **FR-028**: Errores, avisos y resultados DEBEN anunciarse automáticamente a tecnologías de
  asistencia y asociarse con los controles correspondientes cuando aplique.
- **FR-029**: La experiencia DEBE cumplir WCAG 2.1 AA; si un color exacto de Figma no ofrece el
  contraste requerido, DEBE utilizarse una variante accesible documentada sin alterar su función
  ni jerarquía visual.
- **FR-030**: Cada requisito y escenario de esta especificación DEBE ser trazable a una prueba
  verificable antes de implementar el comportamiento correspondiente.

### Mensajes de validación observables

| Condición | Mensaje |
|---|---|
| Nombre vacío | “Ingresa tu nombre completo” |
| Nombre fuera de 1–80 caracteres | “El nombre debe tener entre 1 y 80 caracteres” |
| Correo vacío | “Ingresa tu correo electrónico” |
| Correo con formato inválido | “Ingresa un correo electrónico válido” |
| Correo de más de 254 caracteres | “El correo no puede superar 254 caracteres” |
| Contraseña vacía | “Ingresa tu contraseña” |
| Contraseña menor de 8 caracteres | “La contraseña debe tener al menos 8 caracteres” |
| Contraseña mayor de 128 caracteres | “La contraseña no puede superar 128 caracteres” |
| Confirmación vacía | “Confirma tu contraseña” |
| Contraseñas diferentes | “Las contraseñas no coinciden” |
| Términos no aceptados | “Debes aceptar los términos y condiciones” |

### Key Entities

- **Datos de registro**: conjunto temporal formado por nombre completo, correo, contraseña,
  confirmación y aceptación de términos. Existe únicamente durante la interacción y no se
  persiste.
- **Intento de registro**: acción de validar los datos y solicitar una simulación; su resultado
  es validación fallida, éxito simulado o error inesperado.
- **Resultado de registro**: comunicación observable asociada al intento; en caso de éxito se
  relaciona con la navegación a `/login`.
- **Consentimiento de términos**: decisión temporal y obligatoria de la persona; no representa
  aceptación legal persistida en esta demostración.

## Security, Privacy & Accessibility Constraints

- Los datos personales y las credenciales DEBEN minimizarse y permanecer únicamente durante el
  tiempo necesario para completar o abandonar el formulario.
- Ningún valor sensible DEBE exponerse en mensajes, URL, registros o almacenamiento.
- Los errores inesperados DEBEN manejarse explícitamente y sin revelar detalles internos.
- Toda conducta nueva derivada de esta especificación DEBE definirse mediante pruebas previas,
  siguiendo el ciclo Rojo → Verde → Refactorizar exigido por la Constitution.
- La experiencia DEBE cumplir WCAG 2.1 AA mediante verificación automatizada y revisión de
  teclado, lectura, foco, anuncios y contraste.
- Las decisiones posteriores DEBEN favorecer la reutilización de patrones y elementos ya
  existentes en KynWallet, sin introducir duplicación o alcance no solicitado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una persona puede completar el recorrido válido desde la pantalla de registro
  hasta `/login` en menos de 90 segundos, incluyendo la percepción del mensaje de éxito.
- **SC-002**: El resultado de la simulación, ya sea éxito o error inesperado, se comunica en un
  máximo de 2 segundos después de activar “Crear cuenta” con datos válidos.
- **SC-003**: El 100 % de los escenarios de aceptación P1 y P2 produce el resultado observable
  definido en una evaluación de aceptación repetible.
- **SC-004**: Para cada combinación inválida enumerada en “Mensajes de validación observables”,
  la evaluación confirma el mensaje correspondiente, ausencia de procesamiento y foco correcto.
- **SC-005**: Una evaluación completa solo con teclado permite alcanzar y activar todos los
  controles en orden lógico, sin trampas de foco y con foco visible.
- **SC-006**: Una auditoría automatizada y una revisión manual no detectan incumplimientos WCAG
  2.1 AA dentro del alcance, incluyendo contraste, etiquetas, errores y anuncios.
- **SC-007**: A 320 px, la revisión visual no detecta desplazamiento horizontal, solapamientos,
  recortes ni controles inaccesibles; a 1440 × 1024 px conserva los dos paneles y la jerarquía
  visual del frame `31:2`.
- **SC-008**: La revisión de seguridad no encuentra nombre, correo, contraseña ni confirmación
  en almacenamiento, URL o registros después del envío, abandono o navegación.
- **SC-009**: En cada ejecución del escenario de activaciones consecutivas durante un mismo
  procesamiento se produce exactamente un intento de registro y un único resultado observable.
- **SC-010**: La comparación con Figma confirma todos los textos, el orden, las dimensiones de
  referencia, radios, jerarquía tipográfica y roles de color; cualquier diferencia de color se
  limita a ajustes documentados necesarios para WCAG 2.1 AA.

## Traceability

| Historia | Requisitos principales | Criterios | Referencia de diseño |
|---|---|---|---|
| US1 Registro y login | FR-002–FR-006, FR-012, FR-016–FR-021 | SC-001–SC-004, SC-008–SC-009 | `31:17`–`31:37`, `31:47`–`31:48` |
| US2 Validación | FR-003–FR-006, FR-010–FR-014 | SC-003–SC-004 | `31:19`–`31:35` |
| US3 Contraseña | FR-005–FR-007, FR-019–FR-020 | SC-004, SC-005, SC-008 | `31:25`–`31:32` |
| US4 Términos | FR-008–FR-009, FR-012–FR-014 | SC-003–SC-005 | `31:33`–`31:35` |
| US5 Alternativas | FR-022, FR-028 | SC-003, SC-005 | `31:38`–`31:46` |
| US6 Inicio de sesión | FR-023, FR-027 | SC-001, SC-005 | `31:47`–`31:48` |
| US7 Responsive y accesibilidad | FR-001, FR-024–FR-030 | SC-005–SC-007, SC-010 | frame `31:2` completo |

## Assumptions

- La experiencia y todos sus mensajes se presentan en español.
- El registro es una simulación sin backend, base de datos, cuenta real ni persistencia.
- El mensaje de éxito permanece visible o es anunciado al llegar a `/login`; la navegación no
  debe hacerlo imperceptible.
- La acción de términos muestra “Función no disponible en esta demostración” porque el documento
  real está fuera del alcance.
- El correo se normaliza para validación, pero no se usa para crear una identidad persistente.
- La política de contraseña se limita a longitud y coincidencia; no se imponen reglas adicionales
  de complejidad.
- No existe bloqueo por intentos ni verificación de correo en esta demostración.
- No existen BRD ni ARD identificados para esta funcionalidad; si se incorporan, prevalecen
  conforme a la Constitution.
- La adaptación móvil se deriva del frame de escritorio porque Figma no proporciona en el nodo
  consultado una variante móvil independiente.

## Clarifications

No quedan aclaraciones pendientes: el alcance, el resultado exitoso, la navegación, los
mensajes, la privacidad y la precedencia entre Figma, requisitos y Constitution están definidos
de forma suficiente para la planificación.
