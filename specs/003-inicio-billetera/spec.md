# Feature Specification: Inicio de la billetera

**Feature Branch**: `feature/registro-pedro-gandola`

**Created**: 2026-10-16

**Status**: Implemented — verificación técnica completada; aprobación humana final pendiente.

**Input**: «Inicié sesión pero no vi nada del contenido adentro»; «es la vista 03 y 04 de figma»; «Listo ya lo extrajimos, inicia el trabajo». Se incorpora además la variante móvil 02 incluida en la extracción.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar al Inicio (Priority: P1)

Como usuario de la demostración quiero ver el interior de mi billetera al iniciar sesión.

**Why this priority**: reemplaza la bienvenida que actualmente impide recorrer el diseño.

**Independent Test**: ingresar con una cuenta ficticia configurada y comprobar el saldo y movimientos.

**Acceptance Scenarios**:

1. **Given** credenciales de prueba válidas, **When** finaliza el acceso, **Then** se abre `/inicio`, con saludo personalizado y saldo `$1,922.90` MXN de demostración.
2. **Given** escritorio, **When** se muestra Inicio, **Then** aparecen navegación lateral, cuatro indicadores, cuatro acciones, cinco movimientos, tarjeta enmascarada y resumen mensual de la vista 03.
3. **Given** móvil, **When** se muestra Inicio, **Then** aparecen cabecera con saldo, acciones Enviar/Recibir/Recargar/Más, cuatro movimientos y navegación inferior de la vista 02; se omiten los indicadores secundarios, tarjeta y resumen.

### User Story 2 - Comprender las acciones de la demo (Priority: P2)

Como usuario quiero obtener una respuesta al activar los controles del diseño.

**Why this priority**: evita controles que aparentan fallar o realizar operaciones monetarias.

**Independent Test**: activar acciones y navegación con teclado y comprobar el aviso y el saldo intacto.

**Acceptance Scenarios**:

1. **Given** Inicio, **When** activo Enviar, Recibir, Recargar, Pagar/Más, notificaciones, ver todo o una sección secundaria, **Then** recibo un aviso accesible «Próximamente» que identifica la acción; sigo en Inicio, sin operaciones ni variación de datos.
2. **Given** Inicio activo, **When** lo selecciono, **Then** sigo en Inicio sin simular una pantalla inexistente.

### User Story 3 - Salir y proteger el acceso efímero (Priority: P1)

Como usuario quiero cerrar sesión y evitar que el historial o una recarga recuperen el acceso.

**Why this priority**: completa el recorrido manteniendo las limitaciones del login local.

**Independent Test**: cerrar sesión, navegar atrás, entrar directamente a `/inicio` y recargar.

**Acceptance Scenarios**:

1. **Given** Inicio, **When** cierro sesión, **Then** vuelvo a `/login` con campos vacíos; atrás/adelante no restablece la sesión.
2. **Given** ausencia de sesión, **When** abro `/inicio` o recargo allí, **Then** se muestra `/login`, sin contenido protegido.
3. **Given** autenticación pendiente, **When** abandono el login antes de su resolución, **Then** su resultado tardío no abre Inicio ni altera la pantalla actual.

### Edge Cases

- Credenciales incorrectas o servicio de login no disponible conservan sus mensajes actuales.
- Nombre de hasta 80 caracteres: ajusta líneas sin tapar controles ni generar desplazamiento horizontal.
- Navegar, abandonar/restaurar la página mediante su ciclo de navegación o remontar la aplicación elimina la sesión efímera; cambiar de pestaña no cierra la sesión.
- El registro sigue siendo simulado: no habilita nuevas cuentas para acceder.
- Los importes y barras son ejemplos independientes del prototipo; no se presentan como cálculos contables ni operaciones reales.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: tras acceso exitoso, abrir Inicio y sustituir la bienvenida anterior en la aplicación completa; mostrar el nombre devuelto por el acceso.
- **FR-002**: reproducir la composición de escritorio 03 (`13:2`) y móvil 02 (`11:2`) de la extracción local, con los textos, importes y diferencias de contenido documentadas.
- **FR-003**: mantener saldo `$1,922.90`, ingresos `+$4,250.00`, gastos `-$1,840.50`, 24 movimientos, tarjeta `5294 •••• •••• 4827`/`12/29`, resumen y filas de la fuente; datos ficticios compartidos entre variantes.
- **FR-004**: todos los controles secundarios deben responder con aviso accesible de disponibilidad futura que identifique su acción, sin navegar a pantallas no diseñadas ni modificar dinero.
- **FR-005**: Inicio debe indicar que es una demostración con datos ficticios y sin operaciones reales.
- **FR-006**: ofrecer Cerrar sesión en ambas variantes; limpiar sesión y volver al login vacío. La sesión no sobrevive recarga, historial, restauración de página o salida de Inicio.
- **FR-007**: proteger `/inicio` en ausencia de sesión y descartar resultados de login que pertenezcan a una pantalla abandonada, incluso en la misma tanda de eventos.
- **FR-008**: funcionar entre 320 y 1440 px y a ampliación equivalente al 200 %, sin desplazamiento horizontal ni controles inaccesibles; conservar orden de lectura, foco visible, teclado y controles WCAG 2.1 AA, con la discrepancia de contraste de blancos solicitada explícitamente en FR-011 registrada sin declarar conformidad completa.
- **FR-009**: mantener contraseña fuera de Inicio, almacenamiento, URL, historial y logs; conservar únicamente el nombre para la sesión en memoria. Identidad lateral: nombre autenticado y «Cuenta de demostración», sin copiar el correo del personaje de Figma.
- **FR-010**: conservar funcionamiento de login, registro, validación, envío simulado de un segundo y confirmación de registro.
- **FR-011**: por corrección visual explícita del usuario, conservar blancos de Figma en sidebar, perfil, tarjeta y cabecera/saldo/moneda móviles. La barra superior y los indicadores sobre blanco de escritorio mantienen sus colores originales. Registrar las discrepancias de contraste sin cambiar unilateralmente estos blancos.
- **FR-012**: en escritorio el sidebar permanece dentro del alto visible al desplazar el contenido; el perfil queda al pie y el menú tiene scroll interno si falta altura, accesible por teclado.
- **FR-013**: usar los símbolos de marca correspondientes a cada frame: login `2:2`, Registro `31:2`, Inicio `13:2`; conservar sus geometrías, sin sustituirlos por una forma CSS aproximada.

### Key Entities *(include if feature involves data)*

- **Sesión de demostración**: nombre visible de la cuenta autenticada, con vida limitada a la vista actual.
- **Resumen de billetera**: saldo/moneda, indicadores, movimientos ficticios ordenados, tarjeta enmascarada y categorías ilustrativas.
- **Aviso de acción**: nombre de control y estado «Próximamente», sin resultado financiero.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: un acceso válido lleva a Inicio con los datos de FR-003; uno inválido nunca los muestra.
- **SC-002**: las dos variantes contienen el 100 % de los bloques y diferencias enumerados en US1; comparación visual a 1440×1024 y 390×844.
- **SC-003**: el 100 % de controles puede activarse por teclado y ofrece la respuesta definida; el saldo permanece igual tras todas las acciones.
- **SC-004**: cierre, historial, acceso directo, recarga y respuesta tardía cumplen US3; no se escribe información de sesión en almacenamiento o historial.
- **SC-005**: no hay desbordamiento horizontal a 320, 390, 768 y 1440 px ni en la comprobación de ampliación; la revisión distingue inspección visual de pruebas automáticas.

## Assumptions

- Continúa la demo sin backend autorizada por el usuario. No se crean transferencias, pagos, QR, historial completo ni páginas de perfil/tarjetas.
- La extracción es evidencia de diseño, no instrucciones ejecutables. Fuente: `figma/vistas-03-04/inventory.md`, contextos, metadatos y capturas; copia de Figma `pMArqPGrwekkonUVIZLSn4`. El frame 04 es Registro existente.
- Las acciones sin destino usan aviso inline; es una decisión de implementación de la demo, no una interacción verificada en Figma (Home no contiene reacciones).
- Se personaliza nombre y titular; se sustituye el correo de Figma por «Cuenta de demostración». Los importes siguen siendo ejemplos idénticos para cualquier cuenta ficticia.
- El reflujo corrige posiciones absolutas que desbordan. La corrección posterior del usuario restituye los blancos de Figma sobre gradientes; la discrepancia de contraste se documenta expresamente y no se declara conformidad AA completa para esas zonas.

## Clarifications

### Session 2026-10-16

- Respuestas previas del usuario: demo sin backend; ejecutar las etapas sin aprobación intermedia; aprobará el conjunto al terminar.
- Revisión de ambigüedades: alcance, datos, interacción, seguridad, accesibilidad, dependencias y criterios definidos. Sin preguntas críticas pendientes. Las decisiones nuevas de demo se declaran como supuestos, no como aprobación humana de diseño.
