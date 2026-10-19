# Contract: Interfaz de usuario de la pantalla Home (Dashboard Financiero)

Contrato observable por el usuario y por las pruebas automatizadas (React Testing Library consulta por rol y nombre accesible). Basado exclusivamente en el diseño de Figma **`node-id=13-2`** con comportamiento Responsive de **2 paneles en Desktop (`≥ 960px`)** y **1 solo panel (solo formulario/contenido) en Mobile (`< 960px`)**.

## 1. Estructura general, navegación y cabecera (`US1`, `US4`)

| Elemento | Rol / nombre accesible | Comportamiento |
|---|---|---|
| Contenedor raíz del Home | `[data-view="home"]` | En Desktop (`≥ 960px`) distribuye 2 paneles (barra lateral izquierda + panel principal derecho); en Mobile (`< 960px`) presenta 1 solo panel vertical centrado sin distorsión al redimensionar (FR-002) |
| Navegación principal | `navigation` `"Navegación principal"` | Contiene los botones `"Inicio"` (`aria-current="page"`), `"Movimientos"`, `"Tarjetas"` y `"Mi Perfil"` |
| Opciones secundarias (`Movimientos`, `Tarjetas`, `Mi Perfil`) | `button` `"Movimientos"`, `button` `"Tarjetas"`, `button` `"Mi Perfil"` | Al hacer clic muestran exclusivamente un **Toast Alert** (`role="status"`) con el texto `"Próximamente"`, sin cambiar de vista ni alterar el estado financiero (FR-011, US4-3) |
| Notificación Toast (`Toast`) | `status` (`role="status"`, `aria-live="polite"`, `data-position="top-center"`) y `button` `"Cerrar notificación"` | Flotante en la parte superior centrada (`top-center`) estilo `react-toastify`, con fondo de color de la paleta actual (`--brand-700` o `--success-700`), barra de progreso y textos intactos (`"Próximamente"`, `"Operación realizada con éxito"`, `"Datos copiados al portapapeles"`) (FR-013, US4-4) |
| Saludo principal | `heading` nivel 1 `"¡Bienvenido, {displayName}!"` | Recibe el foco inicial al entrar al Home (`tabIndex={-1}`, FR-001, FR-003) |
| Cerrar sesión | `button` `"Cerrar sesión"` | Limpia la sesión y regresa al formulario de Login vacío (FR-010) |

## 2. Panel de Saldo, Indicadores y Tarjeta Virtual (`US1`)

| Elemento | Rol / nombre accesible | Comportamiento |
|---|---|---|
| Saldo disponible | Región / texto con etiqueta `"Saldo disponible"` | Muestra el monto formateado (ej. `"$2,450.00"`) o `"••••••"` cuando `balanceHidden === true` |
| Control de privacidad | `button` `"Ocultar saldo"` / `"Mostrar saldo"` | `aria-pressed` refleja si el saldo está oculto; alterna la visibilidad de todos los importes de resumen y movimientos (FR-004) |
| Indicador de ingresos | Texto junto a `"Ingresos del mes"` | Muestra `"+$3,200.00"` (o `"••••••"` si está oculto) |
| Indicador de gastos | Texto junto a `"Gastos del mes"` | Muestra `"-$750.00"` (o `"••••••"` si está oculto) |
| Kyn Card | Tarjeta visual con `"Titular Kyn Card"` | Muestra `"•••• •••• •••• 4829"` y el nombre del titular en mayúsculas |

## 3. Controles de Acciones Rápidas (`US3`, `FR-005`, `FR-006`)

| Acción | Rol / nombre accesible | Comportamiento al activarse |
|---|---|---|
| Recargar | `button` `"Recargar"` | Abre el formulario inline `"Recargar saldo a tu billetera"` con campos `"Concepto"` y `"Monto (USD)"` y botón `"Confirmar operación"` |
| Enviar | `button` `"Enviar"` | Abre el formulario inline `"Enviar dinero a otro contacto"` con campos `"Destinatario o concepto"` y `"Monto (USD)"` y botón `"Confirmar operación"` |
| Recibir | `button` `"Recibir"` | Abre el panel con el alias del usuario y botón `"Copiar alias"` que dispara el Toast `"Datos copiados al portapapeles"` |
| Pagar | `button` `"Pagar"` | Abre el formulario inline `"Pagar un servicio o comercio"` con campos `"Servicio o concepto"` y `"Monto (USD)"` y botón `"Confirmar operación"` |

## 4. Historial de Movimientos Recientes y Filtros Dinámicos (`US2`, `FR-007`, `FR-008`)

| Elemento | Rol / nombre accesible | Comportamiento |
|---|---|---|
| Encabezado de sección | `heading` nivel 2 `"Movimientos recientes"` | Identifica la sección de historial |
| Filtros por tipo | `button` `"Todos"`, `button` `"Ingresos"`, `button` `"Gastos"` | `aria-pressed="true"` en el filtro activo; filtra instantáneamente la lista |
| Buscador de movimientos | `searchbox` `"Buscar movimiento"` | Filtra instantáneamente por concepto o categoría |
| Lista de movimientos | `list` `"Lista de movimientos"` con `listitem` | Cada ítem muestra título, categoría, fecha y monto con signo (`+$...` o `-$...`) |
| Estado vacío | Texto `"No se encontraron movimientos para los criterios seleccionados"` y `button` `"Restablecer filtros"` | Se muestra cuando ningún movimiento coincide con el filtro/búsqueda activos |
