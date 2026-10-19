---

description: "Task list for 003-home-billetera"
---

# Tasks: Pantalla Home (Dashboard Financiero) de KynWallet

**Input**: Design documents from `/specs/003-home-billetera/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-home.md, quickstart.md

**Tests**: OBLIGATORIAS. La Constitución del proyecto (Principio I, TDD — NO NEGOCIABLE, y Estándar 8.1) y `spec.md` (SC-003) exigen iniciar cada historia con pruebas automatizadas que fallen antes de escribir el código de producción.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions
- Trazabilidad (Constitución 9.2): cada prueba `it(...)` DEBE incluir el identificador del escenario o requisito que verifica (p. ej., `US1-2`, `US2-4`, `US3-1`, `FR-006`).

## Path Conventions

- **Single project**: `src/` at repository root; tests co-located alongside source files (`*.test.ts`, `*.test.tsx`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Incorporar los tokens semánticos de color y superficie del Dashboard Home manteniendo contraste WCAG 2.1 AA

- [X] T001 Ampliar `src/ui/styles/tokens.css` con los tokens semánticos verificados en `research.md` R3 (`--success-700: #166534`, `--success-50: #dcfce7`, `--surface-muted: #f4f5f9`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Textos únicos y tipos/estructuras base del dominio financiero que todas las historias del Dashboard Home necesitan

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Ampliar `src/domain/messages.ts` con las constantes de texto únicas del Dashboard Home según `data-model.md` y `contracts/ui-home.md`: `OPERATION_DESCRIPTION_REQUIRED: 'Ingresa una descripción o destinatario'`, `OPERATION_DESCRIPTION_TOO_LONG: 'La descripción no puede superar 60 caracteres'`, `OPERATION_AMOUNT_INVALID: 'Ingresa un monto válido mayor a 0'`, `OPERATION_AMOUNT_TOO_HIGH: 'El monto supera el límite permitido'`, `INSUFFICIENT_BALANCE: 'Saldo insuficiente para realizar esta operación'`, `OPERATION_SUCCESS: 'Operación realizada con éxito'`, `ALIAS_COPIED: 'Datos copiados al portapapeles'` y `EMPTY_TRANSACTIONS: 'No se encontraron movimientos para los criterios seleccionados'`
- [X] T003 [P] Crear los tipos e invariantes base del dominio financiero y las transacciones semilla `INITIAL_TRANSACTIONS` en `src/domain/wallet.ts` según `data-model.md`: `WalletTransaction` (`id: string`, `title: string`, `category: 'Recarga' | 'Transferencia' | 'Servicios' | 'Compras' | 'Ingresos'`, `type: 'income' | 'expense'`, `amount: number`, `dateLabel: string`), `WalletSummary` (`availableBalance: number`, `totalIncome: number`, `totalExpenses: number`, `incomeSharePercent: number`), `TransactionFilter` (`type: 'all' | 'income' | 'expense'`, `query: string`), `QuickOperationKind` (`'topup' | 'send' | 'pay'`), `QuickOperationInput` y `QuickOperationErrors`

**Checkpoint**: Tokens, textos y tipos financieros listos — el desarrollo de las historias de usuario puede comenzar.

---

## Phase 3: User Story 1 - Acceder al Dashboard Home tras iniciar sesión y visualizar el resumen financiero (Priority: P1) 🎯 MVP

**Goal**: Presentar automáticamente tras el inicio de sesión exitoso el Dashboard Home personalizado con el saludo al titular, el Saldo Disponible, los indicadores de Ingresos y Gastos del mes, la tarjeta virtual Kyn Card, el control dinámico para ocultar/mostrar montos por privacidad y el botón para cerrar sesión.

**Independent Test**: Iniciar sesión con una cuenta válida y verificar que aparece el Dashboard Home con el nombre del usuario, el saldo `"$2,450.00"`, ingresos `"+$3,200.00"`, gastos `"-$750.00"`, el botón `"Ocultar saldo"` que enmascara los importes con `"••••••"` y el botón `"Cerrar sesión"` que vuelve al Login vacío (`quickstart.md` escenarios 1, 2 y 10).

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Constitución, Principio I)**

- [X] T004 [P] [US1] Escribir pruebas unitarias en `src/domain/wallet.test.ts` para `calculateWalletSummary` y `formatCurrency` verificando las reglas de `data-model.md`: `availableBalance` es `"round2(totalIncome - totalExpenses) (siempre >= 0)"`, `totalIncome` es la `"Suma de amount para todas las transacciones con type === 'income'"`, `totalExpenses` es la `"Suma de amount para todas las transacciones con type === 'expense'"`, `incomeSharePercent` es el `"Porcentaje (0–100) de ingresos respecto al volumen total (totalIncome + totalExpenses)"`, y `formatCurrency` formatea en USD o devuelve `"••••••"` cuando `hidden === true`
- [X] T005 [P] [US1] Escribir pruebas unitarias en `src/ui/features/home/homeReducer.test.ts` para el estado inicial `initialHomeState` (`balanceHidden: false`, `filterType: 'all'`, `searchQuery: ''`, `activeAction: null`) y la acción `toggleBalancePrivacy`
- [X] T006 [US1] Escribir pruebas de integración en `src/ui/features/home/HomeDashboard.test.tsx` y actualizar `src/ui/features/login/WelcomeView.test.tsx` para US1: US1-1 renderiza `heading` nivel 1 `"¡Bienvenido, {displayName}!"` con foco inicial y muestra el titular en mayúsculas en `"Kyn Card"`; US1-2 muestra `"Saldo disponible"` (`"$2,450.00"`), `"Ingresos del mes"` (`"+$3,200.00"`) y `"Gastos del mes"` (`"-$750.00"`); US1-3 el botón `"Ocultar saldo"` cambia los montos a `"••••••"` y actualiza su etiqueta a `"Mostrar saldo"` (`aria-pressed="true"`); US1-4 el botón `"Cerrar sesión"` invoca `onLogout`

### Implementation for User Story 1

- [X] T007 [P] [US1] Implementar `calculateWalletSummary` y `formatCurrency` en `src/domain/wallet.ts` hasta pasar T004
- [X] T008 [US1] Implementar el estado inicial y `toggleBalancePrivacy` en `src/ui/features/home/homeReducer.ts` y el hook `src/ui/features/home/useHomeDashboard.ts` hasta pasar T005
- [X] T009 [US1] Implementar `src/ui/features/home/HomeDashboard.tsx` y `src/ui/features/home/HomeDashboard.module.css` con saludo personalizado, panel de Saldo Disponible con barra visual de proporción, indicadores de Ingresos/Gastos, tarjeta Kyn Card, control `"Ocultar saldo"` / `"Mostrar saldo"` y botón `"Cerrar sesión"`, e integrarlo en `src/ui/features/login/WelcomeView.tsx` y `src/ui/features/login/LoginScreen.tsx` hasta pasar T006

**Checkpoint**: User Story 1 es funcional de extremo a extremo tras iniciar sesión.

---

## Phase 4: User Story 2 - Explorar y filtrar dinámicamente los movimientos recientes (Priority: P1)

**Goal**: Permitir al usuario consultar sus movimientos recientes y filtrarlos dinámicamente por tipo (`Todos`, `Ingresos`, `Gastos`) o mediante búsqueda instantánea por concepto o categoría.

**Independent Test**: En el Dashboard Home, alternar entre los filtros `"Todos"`, `"Ingresos"` y `"Gastos"` y escribir en `"Buscar movimiento"`, comprobando que la lista de transacciones se actualiza al instante y muestra el estado vacío cuando ningún movimiento coincide (`quickstart.md` escenarios 3 y 4).

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US2] Ampliar `src/domain/wallet.test.ts` con pruebas unitarias para `filterTransactions` según `data-model.md`: `'all'` muestra todos los movimientos; `'income'` solo ingresos; `'expense'` solo gastos; `query` filtra `"sin distinguir mayúsculas/minúsculas ni tildes contra title y category"`
- [X] T011 [P] [US2] Ampliar `src/ui/features/home/homeReducer.test.ts` con pruebas para las acciones `setFilterType` (`'all' | 'income' | 'expense'`) y `setSearchQuery`
- [X] T012 [US2] Ampliar `src/ui/features/home/HomeDashboard.test.tsx` con pruebas de integración para US2-1 a US2-4: muestra la lista `"Lista de movimientos"` con montos prefijados por `+` o `-`; al pulsar `"Ingresos"` o `"Gastos"` filtra los ítems y actualiza `aria-pressed="true"`; al escribir en `searchbox` `"Buscar movimiento"` filtra en tiempo real y muestra `"No se encontraron movimientos para los criterios seleccionados"` cuando no hay coincidencias

### Implementation for User Story 2

- [X] T013 [P] [US2] Implementar `filterTransactions` en `src/domain/wallet.ts` hasta pasar T010
- [X] T014 [US2] Ampliar `src/ui/features/home/homeReducer.ts`, `src/ui/features/home/useHomeDashboard.ts` y `src/ui/features/home/HomeDashboard.tsx` con la sección `"Movimientos recientes"`, los controles de filtro (`"Todos"`, `"Ingresos"`, `"Gastos"`), el `searchbox` `"Buscar movimiento"` y el mensaje de estado vacío con botón para restablecer filtros hasta pasar T011 y T012

**Checkpoint**: User Stories 1 y 2 funcionan íntegramente con filtrado y búsqueda en tiempo real.

---

## Phase 5: User Story 3 - Ejecutar acciones rápidas simuladas con actualización dinámica del saldo (Priority: P2)

**Goal**: Permitir ejecutar las acciones rápidas interactivas (`Recargar`, `Enviar`, `Recibir`, `Pagar`) validando las entradas y actualizando instantáneamente el saldo disponible, los indicadores de ingresos/gastos y el historial de movimientos.

**Independent Test**: Ejecutar una recarga válida y un envío válido desde el Dashboard Home, verificando el incremento/descuento inmediato del saldo y la inserción del movimiento en el tope del historial, además del bloqueo ante saldo insuficiente y la copia de alias en `"Recibir"` (`quickstart.md` escenarios 5, 6, 7 y 8).

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T015 [P] [US3] Ampliar `src/domain/wallet.test.ts` con pruebas unitarias para `validateQuickOperation` verificando literalmente todas las restricciones de `data-model.md`: `title` `"Vacío tras trim()"` → `"Ingresa una descripción o destinatario"`, `"Longitud tras trim() > 60 caracteres"` → `"La descripción no puede superar 60 caracteres"`; `amountRaw` `"Vacío tras trim(), no numérico, <= 0 o más de 2 decimales"` → `"Ingresa un monto válido mayor a 0"`, `"Valor numérico > 999999.99"` → `"El monto supera el límite permitido"`, `"En 'send' o 'pay', valor numérico > availableBalance"` → `"Saldo insuficiente para realizar esta operación"`
- [X] T016 [P] [US3] Ampliar `src/ui/features/home/homeReducer.test.ts` con pruebas para `openQuickAction`, `closeQuickAction`, `changeOperationField` y `submitQuickOperation`: rechaza envíos con errores manteniendo el panel abierto; con datos válidos agrega el nuevo `WalletTransaction` al inicio de `transactions`, cierra el panel y establece `toastMessage: 'Operación realizada con éxito'`
- [X] T017 [US3] Ampliar `src/ui/features/home/HomeDashboard.test.tsx` con pruebas de integración para US3-1 a US3-4: `"Recargar"` suma al saldo e ingresos y añade el movimiento; `"Enviar"` y `"Pagar"` descuentan del saldo, suman a gastos y añaden el movimiento; un monto mayor al saldo disponible en `"Enviar"` muestra `"Saldo insuficiente para realizar esta operación"` y no modifica el saldo; `"Recibir"` muestra el alias y al pulsar `"Copiar alias"` muestra el Toast `"Datos copiados al portapapeles"`

### Implementation for User Story 3

- [X] T018 [P] [US3] Implementar `validateQuickOperation` y `createQuickTransaction` en `src/domain/wallet.ts` hasta pasar T015
- [X] T019 [US3] Ampliar `src/ui/features/home/homeReducer.ts`, `src/ui/features/home/useHomeDashboard.ts` y `src/ui/features/home/HomeDashboard.tsx` con los botones `"Recargar"`, `"Enviar"`, `"Recibir"`, `"Pagar"` y sus paneles interactivos de operación y recepción hasta pasar T016 y T017

**Checkpoint**: User Stories 1, 2 y 3 funcionan de forma dinámica e interactiva.

---

## Phase 6: User Story 4 - Diseño único Figma (`13:2`), comportamiento Responsive sin distorsión (Desktop 2 paneles / Mobile solo formulario) y notificaciones Toast `top-center` estilo `react-toastify` (Priority: P1)

**Goal**: Adoptar exclusivamente el diseño de referencia de Figma (`node-id=13-2`) manteniendo un comportamiento Responsive libre de distorsión — **2 paneles en Desktop (`≥ 960px`: panel lateral + contenido)** y **1 solo panel en Mobile (`< 960px`, desde `320px`: solo formulario/contenido centrado)** — haciendo que las opciones **`Movimientos`**, **`Tarjetas`** y **`Mi Perfil`** envíen únicamente el mensaje `"Próximamente"` mediante un **Toast Alert**, y mostrando todos los mensajes **Toast** flotantes en la **parte superior centrada (`top-center`)** con fondo de color de la paleta actual estilo `react-toastify`.

**Independent Test**: Verificar la navegación principal (`Inicio`, `Movimientos`, `Tarjetas`, `Mi Perfil`), comprobar que al pulsar `Movimientos`, `Tarjetas` y `Mi Perfil` se muestra el Toast Alert `"Próximamente"` en `top-center` con fondo de color (`data-position="top-center"`, `data-tone="brand"`), verificar el tono `success` en operaciones confirmadas, y validar la transición sin distorsión entre Desktop (2 paneles) y Mobile (1 solo panel) (`quickstart.md` escenarios 9 y 10).

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T020 [P] [US4] Ampliar `src/ui/components/Toast/Toast.test.tsx` con pruebas unitarias y de accesibilidad para US4-4 y FR-013: verifica posicionamiento superior centrado (`data-position="top-center"`), tono `brand` (`--brand-700`) para `"Próximamente"`, tono `success` (`--success-700`) para `"Operación realizada con éxito"` y `"Datos copiados al portapapeles"`, cierre manual mediante `"Cerrar notificación"`, autocierre a los `3000 ms` y cero violaciones `axe-core`
- [X] T021 [P] [US4] Ampliar `src/ui/features/home/HomeDashboard.test.tsx` con pruebas para US4-1, US4-3 y US4-4: verifica la región `navigation` `"Navegación principal"` con `"Inicio"` (`aria-current="page"`), `"Movimientos"`, `"Tarjetas"` y `"Mi Perfil"`, y comprueba que pulsar cada una de las 3 opciones secundarias muestra el Toast Alert superior centrado (`data-position="top-center"`) con `"Próximamente"` sin alterar el saldo ni los movimientos

### Implementation for User Story 4

- [X] T022 [P] [US4] Actualizar `src/ui/components/Toast/Toast.tsx` y `src/ui/components/Toast/Toast.module.css` para posicionar todas las notificaciones Toast en la parte superior centrada (`top-center`) con comportamiento estilo `react-toastify` (fondo de color `--brand-700` / `--success-700` respetando la paleta actual, icono SVG, botón `"Cerrar notificación"` y barra de progreso animada) manteniendo intactos todos los mensajes establecidos hasta pasar T020
- [X] T023 [US4] Implementar el layout responsivo basado exclusivamente en Figma (`13:2`) — Desktop (`≥ 960px`, 2 paneles) y Mobile (`< 960px`, 1 solo panel de contenido/formulario sin distorsión al cambiar de tamaño de pantalla) — en `src/ui/features/home/HomeDashboard.tsx`, `src/ui/features/home/HomeDashboard.module.css` y `src/ui/features/login/LoginScreen.module.css` hasta pasar T021

**Checkpoint**: Las 4 historias de usuario y el nuevo comportamiento `top-center` de los Toasts están completos y verificados.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Auditoría automatizada de accesibilidad WCAG 2.1 AA, actualización documental y verificación integral de cumplimiento constitucional

- [X] T024 [P] Ampliar `src/ui/features/home/HomeDashboard.test.tsx` y `src/App.test.tsx` con pruebas de accesibilidad `expectNoA11yViolations` (`axe-core`, Constitución 8.4 y SC-004) en el Dashboard Home inicial, con saldo oculto, con filtros aplicados y con el panel de acción rápida abierto
- [X] T025 [P] Actualizar `README.md` en la raíz del proyecto documentando el Dashboard Home (`003-home-billetera`), el diseño único de Figma (`13:2`) con comportamiento Responsive (Desktop 2 paneles / Mobile 1 panel), las notificaciones Toast `top-center` estilo `react-toastify` y el aviso `"Próximamente"` en `Movimientos`, `Tarjetas` y `Mi Perfil` (Constitución 8.3)
- [X] T026 Ejecutar `npm run verify` (`lint`, `format`, `typecheck`, `test:coverage` ≥ 80 %, `build`, `audit:deps`, `audit:licenses`, `scan:secrets`) y comprobar todos los escenarios de `specs/003-home-billetera/quickstart.md` (Constitución 9.4)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias — comienza de inmediato (`T001`).
- **Foundational (Phase 2)**: Depende de Setup — **BLOQUEA** todas las historias de usuario (`T002` y `T003` en paralelo).
- **User Story 1 (Phase 3 - P1 🎯 MVP)**: Depende de Foundational (Phase 2).
- **User Story 2 (Phase 4 - P1)**: Depende de Foundational y amplía `wallet.ts`, `homeReducer.ts` y `HomeDashboard.tsx`.
- **User Story 3 (Phase 5 - P2)**: Depende de US1/US2 al actualizar dinámicamente el saldo y la lista de movimientos en `HomeDashboard.tsx`.
- **User Story 4 (Phase 6 - P1)**: Depende de la estructura base de `HomeDashboard.tsx` y del componente compartido `Toast.tsx`.
- **Polish (Phase 7)**: Depende de la finalización de todas las historias de usuario (Phases 3–6).

### Parallel Opportunities

- **Foundational (Phase 2)**: `T002` (`messages.ts`) y `T003` (`wallet.ts`) en paralelo.
- **User Story 1 (Phase 3)**: Pruebas `T004` y `T005` en paralelo.
- **User Story 2 (Phase 4)**: Pruebas `T010` y `T011` en paralelo.
- **User Story 3 (Phase 5)**: Pruebas `T015` y `T016` en paralelo.
- **User Story 4 (Phase 6)**: Pruebas `T020` y `T021` en paralelo; implementación `T022` (`Toast`) y `T023` (`HomeDashboard`) en paralelo.
- **Polish (Phase 7)**: `T024` y `T025` en paralelo antes de `T026`.

---

## Parallel Example: User Story 4 Toast & Responsive Dashboard

```bash
Task: "T020 [P] [US4] Pruebas unitarias de Toast top-center estilo react-toastify en src/ui/components/Toast/Toast.test.tsx"
Task: "T021 [P] [US4] Pruebas de navegación y Toast Alert en Movimientos, Tarjetas y Mi Perfil en src/ui/features/home/HomeDashboard.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2 + User Story 4)

1. Completar **Phase 1: Setup** (`T001`) y **Phase 2: Foundational** (`T002`–`T003`).
2. Completar **Phase 3: User Story 1** (`T004`–`T009`) para mostrar el Dashboard Home (`13:2`) tras iniciar sesión con saldo, ingresos, gastos, Kyn Card, privacidad de montos y cierre de sesión.
3. Completar **Phase 4: User Story 2** (`T010`–`T014`) para habilitar el historial de movimientos con filtros dinámicos y búsqueda en tiempo real.
4. Completar **Phase 6: User Story 4** (`T020`–`T023`) para garantizar el comportamiento Responsive libre de distorsión (Desktop 2 paneles / Mobile 1 solo panel de contenido-formulario) y las notificaciones Toast `top-center` estilo `react-toastify`.
5. **DETENERSE Y VALIDAR**: Verificar los escenarios 1–4 y 9–11 de `quickstart.md`.

### Incremental Delivery

1. **Setup + Foundational** → Tokens, mensajes y modelo de dominio listos.
2. **US1 (P1)** → Resumen financiero, Kyn Card, privacidad de saldo y cierre de sesión.
3. **US2 (P1)** → Movimientos recientes con filtros (`Todos`, `Ingresos`, `Gastos`) y buscador instantáneo.
4. **US3 (P2)** → Acciones rápidas interactivas (`Recargar`, `Enviar`, `Recibir`, `Pagar`) con recálculo de saldo en vivo.
5. **US4 (P1)** → Diseño único Figma (`13:2`), comportamiento Responsive sin distorsión (Desktop 2 paneles / Mobile 1 panel) y Toast Alert `top-center` estilo `react-toastify` con fondo de color de la paleta actual.
6. **Polish** → Auditoría WCAG 2.1 AA con `axe-core`, documentación y `npm run verify`.
