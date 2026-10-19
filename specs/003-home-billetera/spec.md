# Feature Specification: Pantalla Home (Dashboard Financiero) de KynWallet

**Feature Branch**: `003-home-billetera`

**Created**: 2026-10-17

**Last Updated**: 2026-10-18

**Status**: Draft

**Input**: User description: "Necesito realizar una modificación al spec 003-home-billetera y que sólo adopte el diseño de la interfaz que se encuentra en figma https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2 y mantenga un comportamiento Responsive: desktop (2 paneles) y mobile (solo formulario), ya que actualmente al cambiar entre tamaño de pantallas se distorsiona. Además considera que las opciones Movimientos, Tarjetas y Mi Perfil del Dashboard solo envíen un mensaje de Próximamente utilizando Toast Alert. Los controles dentro del dashboard tienen que ser dinámicos y de impacto visual al usuario. El alcance se limita a una demostración funcional, sin servicios backend ni base de datos. Genera historias de usuario y criterios de aceptación, respetando la Constitución del proyecto."

**Diseño único de referencia**:
- **Figma — Pantalla Home (`node-id=13-2`)**: archivo `f7uDsv8sh6ZOtK2OitTqtg` ([https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2)).
- **Comportamiento Responsive unificado**:
  - **Desktop (`≥ 960px`, 2 paneles)**: panel lateral izquierdo (marca KynWallet y menú principal con las opciones `Inicio`, `Movimientos`, `Tarjetas` y `Mi Perfil`) y panel principal derecho con el contenido y controles interactivos del Dashboard (saludo personalizado, resumen de saldo disponible, tarjeta virtual Kyn Card, indicadores de ingresos/gastos, acciones rápidas y movimientos recientes).
  - **Mobile (`< 960px`, desde `320px`, 1 solo panel / solo formulario-contenido)**: muestra únicamente el panel principal de contenido y controles del Dashboard en una sola columna vertical fluida (ocultando el panel lateral de escritorio para evitar distorsiones al redimensionar entre tamaños de pantalla) y conservando el acceso a las opciones de navegación (`Inicio`, `Movimientos`, `Tarjetas`, `Mi Perfil`) de forma compacta e integrada sin deformar el layout.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acceder al Dashboard Home tras iniciar sesión y visualizar el resumen financiero (Priority: P1)

Como usuario autenticado de KynWallet, quiero que inmediatamente después de iniciar sesión se muestre el dashboard Home basado en el diseño `13:2` con mi nombre, mi saldo disponible, mi tarjeta virtual y el resumen de mis ingresos y gastos, pudiendo ocultar o mostrar los importes por privacidad y cerrar sesión cuando lo desee, para tener visibilidad inmediata y segura del estado de mis finanzas.

**Why this priority**: es el núcleo de la funcionalidad solicitada; conecta el inicio de sesión exitoso con el panel de control financiero del usuario y entrega el impacto visual principal del diseño `13:2`.

**Independent Test**: se inicia sesión con una cuenta válida (de demostración o recién registrada) y se verifica que se despliega la pantalla Home mostrando el nombre del titular, el saldo total formateado, los indicadores de ingresos y gastos, la tarjeta Kyn Card con el titular, el control para ocultar/mostrar montos y la acción de cerrar sesión.

**Acceptance Scenarios**:

1. **Given** un usuario que ingresa credenciales válidas en la pantalla de inicio de sesión, **When** la autenticación se completa exitosamente, **Then** el sistema muestra la pantalla Home (Dashboard) personalizada con el nombre del usuario autenticado en el saludo (`"¡Bienvenido, {Nombre}!"`) y en mayúsculas dentro de la tarjeta virtual Kyn Card.
2. **Given** la pantalla Home cargada, **When** el usuario observa el panel de resumen financiero, **Then** visualiza el saldo total disponible, el total de ingresos del mes y el total de gastos del mes con formato monetario claro y jerarquía visual destacada.
3. **Given** los montos del dashboard visibles en pantalla, **When** el usuario activa el control de privacidad (`"Ocultar saldo"`), **Then** el saldo disponible y los montos de resumen se enmascaran dinámicamente (`"••••••"`) y el control cambia su etiqueta accesible a `"Mostrar saldo"`; al volver a activarlo, los montos vuelven a mostrarse.
4. **Given** el usuario autenticado en la pantalla Home, **When** activa el control `"Cerrar sesión"`, **Then** se limpia el estado de la sesión activa y el sistema regresa a la pantalla de inicio de sesión con los campos vacíos.

---

### User Story 2 - Explorar y filtrar dinámicamente los movimientos recientes (Priority: P1)

Como usuario en el dashboard Home, quiero consultar la lista de mis movimientos recientes y filtrarlos dinámicamente por tipo (`"Todos"`, `"Ingresos"`, `"Gastos"`) o buscarlos por concepto, para analizar en qué he recibido o utilizado mi dinero sin recargar la página.

**Why this priority**: un dashboard financiero con controles dinámicos requiere que el usuario pueda interactuar con sus movimientos para obtener información accionable sobre sus finanzas.

**Independent Test**: en la pantalla Home se seleccionan los filtros `"Todos"`, `"Ingresos"` y `"Gastos"` y se escribe un término en el buscador de movimientos, verificando que la lista se actualiza instantáneamente mostrando solo las transacciones que coinciden.

**Acceptance Scenarios**:

1. **Given** la pantalla Home cargada, **When** el filtro activo por defecto es `"Todos"`, **Then** el listado de movimientos recientes muestra tanto ingresos como gastos ordenados del más reciente al más antiguo, diferenciando visualmente cada tipo con su signo (`+` / `-`), color semántico accesible, categoría, fecha y monto.
2. **Given** el listado de movimientos en el Home, **When** el usuario selecciona el filtro `"Ingresos"`, **Then** la lista se actualiza dinámicamente para mostrar únicamente las transacciones de entrada de dinero y el control `"Ingresos"` queda marcado como activo (`aria-pressed="true"`).
3. **Given** el listado de movimientos en el Home, **When** el usuario selecciona el filtro `"Gastos"`, **Then** la lista se actualiza dinámicamente para mostrar únicamente las transacciones de salida de dinero y el control `"Gastos"` queda marcado como activo (`aria-pressed="true"`).
4. **Given** el campo de búsqueda de movimientos, **When** el usuario escribe parte del nombre de un comercio, contacto o concepto, **Then** el listado filtra en tiempo real las transacciones que coinciden (sin distinguir mayúsculas ni tildes); y si ninguna coincide, muestra un estado vacío comprensible (`"No se encontraron movimientos para los criterios seleccionados"`) con opción para restablecer los filtros.

---

### User Story 3 - Ejecutar acciones rápidas simuladas con actualización dinámica del saldo (Priority: P2)

Como usuario del dashboard Home, quiero utilizar los controles de acciones rápidas (`"Recargar"`, `"Enviar"`, `"Recibir"`, `"Pagar"`) para simular operaciones cotidianas y ver cómo mi saldo, mis totales de ingresos/gastos y mi lista de movimientos se actualizan al instante con impacto visual, para experimentar el control interactivo de mi billetera.

**Why this priority**: materializa la exigencia de que *"los controles dentro del dashboard tienen que ser dinámicos y de impacto visual al usuario"* dentro del alcance de una demostración sin backend.

**Independent Test**: desde la pantalla Home se activa `"Recargar"` o `"Enviar"`, se ingresa un concepto y un monto válido, se confirma la operación y se verifica que el saldo disponible, el indicador de ingresos/gastos y el primer ítem de movimientos recientes se actualizan inmediatamente.

**Acceptance Scenarios**:

1. **Given** la pantalla Home, **When** el usuario activa la acción rápida `"Recargar"` e ingresa un concepto válido y un monto válido (mayor a `0`), **Then** el saldo disponible y el total de ingresos se incrementan dinámicamente en ese monto, se añade un nuevo movimiento de ingreso al inicio del historial y se muestra una confirmación visual tipo Toast (`"Operación realizada con éxito"`).
2. **Given** la pantalla Home con saldo disponible suficiente, **When** el usuario activa la acción rápida `"Enviar"` (o `"Pagar"`), ingresa un destinatario/concepto y un monto válido menor o igual a su saldo disponible y confirma, **Then** el saldo disponible disminuye en ese monto, el total de gastos aumenta en ese monto, se agrega el nuevo movimiento de gasto al inicio del historial y se muestra una confirmación visual tipo Toast (`"Operación realizada con éxito"`).
3. **Given** el formulario de `"Enviar"` o `"Pagar"`, **When** el usuario intenta enviar un monto vacío, menor o igual a cero, o superior a su saldo disponible actual, **Then** el sistema muestra un mensaje de validación inline (`"Saldo insuficiente para realizar esta operación"` o `"Ingresa un monto válido mayor a 0"`) y no modifica el saldo ni registra el movimiento.
4. **Given** la pantalla Home, **When** el usuario activa la acción rápida `"Recibir"`, **Then** se muestra un panel interactivo con el alias del usuario para recibir transferencias y un control `"Copiar alias"` con confirmación visual tipo Toast (`"Datos copiados al portapapeles"`).

---

### User Story 4 - Diseño único Figma (`13:2`), comportamiento Responsive sin distorsión (Desktop 2 paneles / Mobile solo formulario) y aviso Toast en opciones secundarias (Priority: P1)

Como usuario que accede desde distintos tamaños de pantalla, quiero que el Dashboard Home adopte únicamente el diseño de referencia de Figma (`node-id=13-2`) manteniendo un comportamiento responsive consistente —**2 paneles en Desktop (`≥ 960px`)** y **1 solo panel de contenido/formulario en Mobile (`< 960px`)** sin distorsiones al redimensionar la ventana— y que las opciones **`Movimientos`**, **`Tarjetas`** y **`Mi Perfil`** muestren únicamente una alerta tipo **Toast** con el mensaje `"Próximamente"`, para disfrutar de una interfaz estable, coherente con el resto de la aplicación y clara sobre el alcance de la demostración.

**Why this priority**: corrige directamente la distorsión visual al cambiar entre tamaños de pantalla unificando el diseño en torno al nodo `13:2` con el patrón responsive de 2 paneles (Desktop) / 1 panel (Mobile) y acota el comportamiento de `Movimientos`, `Tarjetas` y `Mi Perfil` mediante Toast Alert.

**Independent Test**: se visualiza la pantalla Home en ancho de escritorio (`≥ 960px`) comprobando la distribución en 2 paneles (panel lateral izquierdo + panel principal derecho), luego se redimensiona a móvil (`< 960px`, p. ej. `375px` y `320px`) verificando que pasa limpiamente a 1 solo panel (solo el panel de formulario/contenido del Dashboard, sin distorsión ni scroll horizontal), y se hace clic en `Movimientos`, `Tarjetas` y `Mi Perfil` comprobando que cada una dispara un Toast Alert con el texto `"Próximamente"`.

**Acceptance Scenarios**:

1. **Given** una pantalla en tamaño Desktop (`≥ 960px`), **When** se muestra el Dashboard Home, **Then** la interfaz reproduce el diseño de Figma (`13:2`) estructurado en **2 paneles**: un panel lateral izquierdo fijo con la identidad de KynWallet y la navegación principal (`Inicio`, `Movimientos`, `Tarjetas`, `Mi Perfil`), y un panel principal derecho fluido con los controles y tarjetas del Dashboard sin solapamientos ni deformaciones.
2. **Given** una pantalla en tamaño Mobile o Tablet vertical (`< 960px`, hasta `320px`), **When** se muestra o se redimensiona el Dashboard Home, **Then** el panel lateral de escritorio se oculta y la interfaz muestra **únicamente el panel principal de formulario/contenido** en una sola columna fluida y centrada, sin barras inferiores flotantes que recorten contenido, sin desbordamientos y sin desplazamiento horizontal.
3. **Given** las opciones de navegación del Dashboard (`Inicio`, `Movimientos`, `Tarjetas`, `Mi Perfil`), **When** el usuario hace clic en **`Movimientos`**, en **`Tarjetas`** o en **`Mi Perfil`**, **Then** el sistema muestra exclusivamente una alerta tipo **Toast** (`role="status"`) con el mensaje exacto `"Próximamente"`, manteniendo activa la vista `"Inicio"` (`aria-current="page"`) y conservando intacto el estado financiero actual.
4. **Given** cualquier acción que dispare un mensaje tipo **Toast** en la aplicación (`"Próximamente"`, `"Operación realizada con éxito"` o `"Datos copiados al portapapeles"`), **When** la notificación se presenta en pantalla, **Then** se visualiza flotante en la **parte superior centrada (`top-center`)** con comportamiento estilo `react-toastify` (contenedor flotante superior centrado, fondo de color de la paleta corporativa actual con contraste accesible, indicador de progreso temporal y opción de cierre), sin aparecer en la parte inferior ni desplazar el contenido.

---

### Edge Cases

- **Cambio continuo de tamaño de ventana (resize entre `< 960px` y `≥ 960px`)**: la transición entre el modo de 1 panel (Mobile, solo contenido/formulario) y el modo de 2 paneles (Desktop, barra lateral + contenido) ocurre mediante CSS Grid/Flexbox sin saltos de scroll, sin elementos superpuestos y sin pérdida de foco ni de datos ingresados en los formularios de acciones rápidas.
- **Clics consecutivos en `Movimientos`, `Tarjetas` y `Mi Perfil`**: cada clic dispara o renueva el Toast Alert superior centrado con el texto `"Próximamente"` sin acumular múltiples alertas superpuestas en pantalla.
- **Intento de envío mayor al saldo disponible**: el sistema bloquea la operación con validación inline antes de procesar y el saldo nunca pasa a ser negativo.
- **Montos con decimales o formatos inválidos**: se aceptan hasta 2 decimales positivos y se rechazan caracteres no numéricos, valores negativos, `NaN`, `0` o montos que excedan el límite máximo por operación (`999,999.99`).
- **Filtro o búsqueda sin coincidencias**: cuando la combinación de filtro (`Ingresos` / `Gastos`) y texto de búsqueda no coincide con ningún movimiento, se muestra un estado vacío claro con opción para restablecer los filtros.
- **Ocultar saldo y realizar una nueva operación**: si el usuario tiene el saldo oculto (`••••••`) y realiza una recarga o envío, el estado de privacidad oculto se respeta hasta que el usuario decida mostrarlo nuevamente.
- **Nombres de titular extensos (hasta 80 caracteres)**: se truncan o ajustan limpiamente en la cabecera y en la tarjeta virtual Kyn Card sin romper la maquetación en `320px`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tras una autenticación exitosa en `LoginForm`, la aplicación DEBE presentar la pantalla **Home (Dashboard Financiero)** recibiendo el nombre para mostrar (`displayName`) del usuario autenticado y la acción de cierre de sesión.
- **FR-002**: La pantalla Home DEBE adoptar **únicamente** el diseño de referencia de Figma **`node-id=13-2`** ([https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2)), manteniendo un comportamiento **Responsive libre de distorsión**:
  - **Desktop (`≥ 960px`) — 2 paneles**: panel lateral izquierdo de marca/navegación y panel principal derecho con el contenido del Dashboard.
  - **Mobile (`< 960px`, desde `320px`) — 1 solo panel (solo formulario/contenido)**: se oculta el panel lateral de escritorio y se presenta únicamente el contenedor principal de formulario/controles del Dashboard en una columna vertical limpia, con acceso compacto a las opciones del menú sin barras fijas que distorsionen la vista.
- **FR-003**: El dashboard DEBE mostrar de forma destacada el saludo personalizado al usuario, el **Saldo Total Disponible**, el resumen de **Ingresos** y **Gastos** del periodo, y la representación visual de la **Kyn Card** con el nombre del titular autenticado en mayúsculas.
- **FR-004**: El dashboard DEBE incluir un control interactivo y accesible para alternar entre mostrar y ocultar (`"••••••"`) los montos sensibles en pantalla (saldo disponible, indicadores de ingresos/gastos e importes de movimientos).
- **FR-005**: El dashboard DEBE ofrecer los controles dinámicos de **Acciones Rápidas** (`"Recargar"`, `"Enviar"`, `"Recibir"`, `"Pagar"`):
  - `"Recargar"` DEBE permitir ingresar un concepto y un monto válido para incrementar dinámicamente el saldo disponible y registrar un nuevo movimiento de ingreso.
  - `"Enviar"` y `"Pagar"` DEBEN permitir ingresar un destinatario/concepto y un monto válido (mayor a `0` y menor o igual al saldo disponible actual) para descontar dinámicamente el saldo y registrar un nuevo movimiento de gasto.
  - `"Recibir"` DEBE mostrar el alias del usuario para recibir fondos con opción de copiado rápido y aviso tipo Toast (`"Datos copiados al portapapeles"`).
- **FR-006**: Toda entrada del usuario en los formularios de operaciones rápidas DEBE validarse en el límite por tipo, formato, longitud y rango (Constitución, Principio V, regla 5.1): concepto/destinatario obligatorio (1–60 caracteres) y monto numérico positivo con hasta 2 decimales, mayor a `0` y que no supere el saldo disponible en operaciones de salida.
- **FR-007**: El dashboard DEBE incluir una sección de **Movimientos Recientes** que liste cada transacción con título/concepto, categoría, fecha, tipo (`ingreso` o `gasto`) y monto formateado con distinción visual y semántica (incluyendo signo `+` o `-`).
- **FR-008**: La sección de Movimientos Recientes DEBE contar con controles dinámicos de filtrado por categoría de flujo (`"Todos"`, `"Ingresos"`, `"Gastos"`) y un campo de búsqueda instantánea por texto, mostrando un mensaje de estado vacío cuando no existan resultados.
- **FR-009**: Los cálculos de saldo disponible, suma de ingresos, suma de gastos y filtrado de movimientos DEBEN residir en la capa de dominio como funciones puras, sin duplicarse en los componentes de interfaz de usuario (Constitución, Principio III y Principio IV).
- **FR-010**: La pantalla Home DEBE incluir un control visible y accesible de **"Cerrar sesión"** que finalice la sesión actual y regrese al formulario de Login vacío sin exponer datos del usuario anterior.
- **FR-011**: Las opciones **`Movimientos`**, **`Tarjetas`** y **`Mi Perfil`** del Dashboard DEBEN enviar **únicamente** un mensaje `"Próximamente"` utilizando el componente **Toast Alert** (`role="status"`), sin navegar fuera del Dashboard ni alterar el estado financiero de la sesión.
- **FR-012**: Toda la interfaz del Home DEBE cumplir como mínimo **WCAG 2.1 nivel AA** (Constitución 8.4): contraste suficiente, roles semánticos (`navigation`, `region`, `status`), etiquetas accesibles y operación completa por teclado.
- **FR-013**: Todos los mensajes tipo **Toast** de la aplicación (tanto en la pantalla de Registro como en el Dashboard Home) DEBEN comportarse visual e interactivamente como una notificación estilo **`react-toastify` (`top-center`, tema coloreado)**: mostrarse flotantes en la **parte superior centrada de la ventana** (nunca en la parte inferior), con fondo de color perteneciente a la paleta actual del proyecto (`--brand-700` / `--brand-gradient` o `--success-700`) y texto claro de alto contraste (`--neutral-0`), barra de progreso de autocierre y manteniendo intactos todos los textos de mensajes ya establecidos (`"Próximamente"`, `"Operación realizada con éxito"` y `"Datos copiados al portapapeles"`).

### Key Entities *(include if feature involves data)*

- **Resumen de Billetera (`WalletSummary`)**: estado financiero agregado del usuario autenticado, compuesto por `availableBalance` (saldo disponible actual), `totalIncome` (suma de ingresos del periodo), `totalExpenses` (suma de gastos del periodo) e `incomeSharePercent` (porcentaje de ingresos respecto al volumen total).
- **Movimiento Financiero (`WalletTransaction`)**: registro individual en el historial de la billetera. Atributos: `id` único, `title` (concepto o destinatario, 1–60 caracteres), `category` (`"Transferencia"`, `"Recarga"`, `"Servicios"`, `"Compras"`, `"Ingresos"`), `type` (`'income' | 'expense'`), `amount` (valor numérico positivo con hasta 2 decimales) y `dateLabel` (fecha/hora legible).
- **Filtro de Movimientos (`TransactionFilterCriteria`)**: criterio activo de visualización en el dashboard, compuesto por `type` (`'all' | 'income' | 'expense'`) y `query` (texto de búsqueda normalizado).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los inicios de sesión exitosos cargan y presentan el dashboard Home en menos de 100 milisegundos tras completarse la autenticación.
- **SC-002**: Todas las interacciones dinámicas del dashboard (ocultar/mostrar saldo, filtrar movimientos por `"Todos"`/`"Ingresos"`/`"Gastos"`, buscar por texto, ejecutar una recarga/envío/pago simulado y accionar `Movimientos`, `Tarjetas` o `Mi Perfil` para mostrar el Toast `"Próximamente"`) actualizan la interfaz en menos de 100 milisegundos sin recargar la página.
- **SC-003**: El 100 % de los escenarios de aceptación de las historias US1, US2, US3 y US4 están verificados mediante pruebas automatizadas siguiendo TDD (Constitución, Principio I y 8.1), manteniendo una cobertura global ≥ 80 %.
- **SC-004**: La pantalla Home supera la auditoría automatizada de accesibilidad WCAG 2.1 nivel AA (`0` violaciones críticas o serias) en su estado inicial, con saldo oculto, con filtros aplicados y con paneles de acción rápida abiertos.
- **SC-005**: La interfaz mantiene una transición responsive limpia entre **Desktop (`≥ 960px`, 2 paneles)** y **Mobile (`< 960px`, desde `320px`, 1 solo panel de contenido/formulario)** sin distorsión de elementos ni desplazamiento horizontal en ningún ancho de ventana.

## Assumptions

- **Único prototipo de diseño (`node-id=13-2`)**: se descarta cualquier prototipo móvil separado (`11:2`) y se toma como única fuente visual el nodo `13:2` de Figma, aplicando el patrón responsive estándar del proyecto: 2 paneles en Desktop (`≥ 960px`) y 1 solo panel de formulario/contenido en Mobile (`< 960px`).
- **Opciones `Movimientos`, `Tarjetas` y `Mi Perfil`**: actúan exclusivamente como disparadores de un **Toast Alert** con el texto `"Próximamente"`, permitiendo probar la navegación del diseño `13:2` tanto en Desktop como en Mobile sin cambiar de pantalla.
- **Datos iniciales de demostración del Dashboard**: al iniciar sesión, la billetera se inicializa con un conjunto realista de movimientos recientes y saldo semilla determinista para la demostración, sobre el cual el usuario puede realizar recargas, envíos y pagos dinámicos que actualizan los montos en tiempo real.
- **Alcance sin backend**: todas las operaciones dentro del dashboard se ejecutan íntegramente en el cliente sin llamadas a servidores externos ni bases de datos.
- **Conformidad con BRD/ARD (Constitución, Principio VI)**: al no existir documentos BRD o ARD independientes en el repositorio, esta especificación y la Constitución actúan como fuente autorizada.
