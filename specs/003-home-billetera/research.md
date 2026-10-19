# Research: Pantalla Home (Dashboard Financiero) de KynWallet

**Feature**: `003-home-billetera` | **Date**: 2026-10-18

Todas las decisiones técnicas, de diseño visual (basadas exclusivamente en el nodo `13:2` de Figma), comportamiento responsive sin distorsión (Desktop 2 paneles / Mobile 1 solo panel de contenido-formulario), interactividad dinámica y cumplimiento constitucional quedan documentadas aquí.

## R1. Stack base y Clean Architecture

- **Decision**: Mantener React 19 + TypeScript 5 (`strict: true`) + Vite 8, sin añadir ninguna dependencia externa nueva (`package.json` inalterado), organizando el código del Home en `src/domain/wallet.ts` (reglas financieras puras) y `src/ui/features/home/` (componentes reutilizables, reducer y hook del dashboard).
- **Rationale**: Dado que la demostración opera 100 % en el cliente con datos semilla y operaciones interactivas en memoria de la sesión autenticada, toda la lógica de cálculo de saldos, validación de operaciones y filtrado pertenece a funciones puras del dominio (`src/domain/wallet.ts`), verificadas con pruebas unitarias instantáneas (Principios I, II, III y IV).
- **Alternatives considered**: Librerías de gráficos pesadas (`recharts`, `chart.js`) o gestores de estado externos (`zustand`, `redux`) — rechazados por Principio IV (KISS/YAGNI) y sección 7.4 de la Constitución; barras de proporción CSS accesibles y `useReducer` ofrecen alto impacto visual con cero dependencias adicionales.

## R2. Único diseño de referencia en Figma (`node-id=13-2`) y patrón Responsive (Desktop 2 paneles / Mobile solo formulario-contenido)

- **Decision**: Adoptar exclusivamente el diseño de Figma **`node-id=13-2`** del archivo `f7uDsv8sh6ZOtK2OitTqtg` ([https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2)) y aplicar el mismo principio estructural responsive de 2 paneles en Desktop y 1 panel en Mobile que utilizan Login y Registro:
  1. **Desktop (`≥ 960px` — 2 paneles)**:
     - **Panel 1 (Izquierdo — Panel lateral de marca y navegación, `260px` fijo)**: fondo `--neutral-0` con borde derecho `--neutral-200`, encabezado con logo corporativo KynWallet (`logo-mark.svg` + `"KynWallet"`) y menú vertical de navegación (`"Inicio"` activo con `aria-current="page"`, `"Movimientos"`, `"Tarjetas"`, `"Mi Perfil"`).
     - **Panel 2 (Derecho — Panel de contenido y formularios del Dashboard, `1fr`)**: contenedor fluido y centrado (`max-width: 1080px`) con cabecera de bienvenida y botón `"Cerrar sesión"`, rejilla de 2 columnas para la tarjeta **Kyn Card** y el panel de **Ingresos/Gastos + flujo positivo**, botonera de **Acciones rápidas** (`Recargar`, `Enviar`, `Recibir`, `Pagar`) con su formulario interactivo inline y sección de **Movimientos recientes** con filtros y buscador.
  2. **Mobile (`< 960px`, desde `320px` — 1 solo panel / solo formulario-contenido)**:
     - Elimina el layout de barra inferior flotante (`11:2` descartado) que causaba distorsión al cambiar entre tamaños de ventana.
     - En `< 960px`, el contenedor principal se comporta como **1 solo panel vertical centrado** (`max-width: 540px`, sin paneles laterales fijos ni barras pegadas al borde inferior), presentando una cabecera compacta con las opciones de navegación en línea y apilando limpiamente en una sola columna las tarjetas de resumen, el formulario de acciones rápidas y la lista de movimientos recientes, garantizando cero distorsión durante el redimensionamiento continuo entre móvil, tablet y escritorio.
- **Rationale**: Unificar la maquetación en torno al prototipo `13:2` con transición de 1 columna (`< 960px`) a 2 paneles (`≥ 960px`) elimina los cambios abruptos de `order` y `position: sticky; bottom: 0` que deformaban la interfaz al redimensionar la pantalla.

## R3. Notificaciones Toast estilo `react-toastify` (`top-center` con fondo de color de la paleta actual)

- **Decision**: Actualizar el componente compartido `src/ui/components/Toast/Toast.tsx` y `src/ui/components/Toast/Toast.module.css` para que todas las notificaciones Toast de la aplicación (en Registro y en el Dashboard Home) se comporten como `react-toastify` (`position="top-center"`, `theme="colored"`), sin añadir dependencias externas (Principio IV y sección 7 de la Constitución):
  - **Posicionamiento superior centrado (`top-center`)**: `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000;` (`data-position="top-center"`), superpuesto sin desplazar ningún elemento del layout y adaptable desde `320px` (`max-width: min(420px, calc(100vw - 32px))`).
  - **Fondo de color respetando la paleta actual (`tokens.css`) y WCAG 2.1 AA**:
    - Tono corporativo `brand` (`background: var(--brand-700)` `#d04721`, texto `--neutral-0` `#ffffff`, ratio **4.56:1**) para avisos informativos como `"Próximamente"`.
    - Tono semántico `success` (`background: var(--success-700)` `#166534`, texto `--neutral-0` `#ffffff`, ratio **7.13:1**) para confirmaciones de acciones como `"Operación realizada con éxito"` y `"Datos copiados al portapapeles"`.
  - **anatomía interactiva estilo `react-toastify`**: icono semántico SVG, mensaje establecido intacto, botón de cierre inmediato (`aria-label="Cerrar notificación"`) y barra inferior animada de progreso temporal (`durationMs = 3000`).
- **Rationale**: Satisface el requerimiento de mostrar todos los Toasts en la parte superior centrada con fondo de color de la paleta actual y comportamiento estilo `react-toastify`, manteniendo intactos los mensajes establecidos y cumpliendo el contraste WCAG 2.1 AA validado con `axe-core`.

## R4. Tokens semánticos y contraste WCAG 2.1 AA (Constitución 8.4)

- **Decision**: Mantener en `src/ui/styles/tokens.css` los tokens semánticos verificados frente a WCAG 2.1 AA sobre fondo blanco (`#ffffff`):
  - `--success-700: #166534` (ratio **7.13:1** sobre blanco — montos de ingresos `+$` e indicadores positivos).
  - `--success-50: #dcfce7` (fondo suave para indicadores de ingresos).
  - `--surface-muted: #f4f5f9` (superficie de contraste suave para el fondo del panel derecho y tarjetas internas).
  - Reutilizar `--error-600: #dc2626` (montos de gastos `-$` y errores) y `--error-50: #fef2f2`.
  - Además del color, todo ingreso lleva el prefijo `+` y todo gasto el prefijo `-` para cumplir WCAG 1.4.1 (Uso del color).
- **Rationale**: Cumple de manera verificable la regla 8.4 de la Constitución (`axe-core` + ratios ≥ 4.5:1).

## R5. Cálculos financieros y validaciones en el dominio (`src/domain/wallet.ts`)

- **Decision**: Mantener en `src/domain/wallet.ts`:
  - Conjunto semilla inmutable `INITIAL_TRANSACTIONS` con 5 movimientos variados (2 ingresos y 3 gastos) que producen un saldo inicial positivo y realista (`$2,450.00` de saldo disponible: `$3,200.00` de ingresos y `$750.00` de gastos).
  - `calculateWalletSummary(transactions)`: calcula de forma pura `totalIncome`, `totalExpenses`, `availableBalance = roundCurrency(totalIncome - totalExpenses)` e `incomeSharePercent`.
  - `filterTransactions(transactions, { type, query })`: filtra por tipo (`'all' | 'income' | 'expense'`) y por coincidencia de texto normalizado (sin distinguir mayúsculas/minúsculas ni tildes) en `title` o `category`.
  - `validateQuickOperation(input, availableBalance)`: valida bajo el Principio V (5.1) que `title` tenga entre 1 y 60 caracteres tras `trim()`, que `amountRaw` sea un número válido `> 0` y `<= 999999.99` con máximo 2 decimales, y que para operaciones de salida (`'send' | 'pay'`) se cumpla `amount <= availableBalance`.
- **Rationale**: Centraliza todas las reglas de negocio financieras en el dominio (Principios III y IV), permitiendo probarlas exhaustivamente sin depender de React.
