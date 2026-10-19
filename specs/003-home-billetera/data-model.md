# Data Model: Pantalla Home (Dashboard Financiero) de KynWallet

**Feature**: `003-home-billetera` | **Date**: 2026-10-17

Define las entidades financieras del dominio, las reglas de validación de acciones rápidas y la máquina de estados del Dashboard Home.

## 1. WalletTransaction (dominio)

Representa un movimiento individual de ingreso o gasto dentro de la billetera virtual.

| Campo | Tipo | Reglas e invariantes |
|---|---|---|
| `id` | `string` | Identificador único no vacío |
| `title` | `string` | Concepto, comercio o destinatario; obligatorio tras `trim()`, longitud entre 1 y 60 caracteres |
| `category` | `'Recarga' \| 'Transferencia' \| 'Servicios' \| 'Compras' \| 'Ingresos'` | Categoría del movimiento |
| `type` | `'income' \| 'expense'` | Tipo de flujo: `'income'` suma al saldo disponible; `'expense'` resta del saldo disponible |
| `amount` | `number` | Monto numérico positivo (`> 0` y `<= 999999.99`), redondeado a 2 decimales |
| `dateLabel` | `string` | Fecha legible para el usuario (p. ej. `"Hoy, 14:30"`, `"15 oct 2026"`) |

## 2. WalletSummary (dominio, valor calculado)

Resultado puro de `calculateWalletSummary(transactions: readonly WalletTransaction[])`:

| Campo | Tipo | Regla de cálculo |
|---|---|---|
| `availableBalance` | `number` | `round2(totalIncome - totalExpenses)` (siempre `>= 0`) |
| `totalIncome` | `number` | Suma de `amount` para todas las transacciones con `type === 'income'` |
| `totalExpenses` | `number` | Suma de `amount` para todas las transacciones con `type === 'expense'` |
| `incomeSharePercent` | `number` | Porcentaje (`0`–`100`) de ingresos respecto al volumen total (`totalIncome + totalExpenses`) para la barra de impacto visual |

## 3. TransactionFilter (dominio, valor)

Criterio de filtrado dinámico aplicado sobre la lista de movimientos (FR-008):

| Campo | Tipo | Comportamiento |
|---|---|---|
| `type` | `'all' \| 'income' \| 'expense'` | `'all'` muestra todos; `'income'` solo ingresos; `'expense'` solo gastos |
| `query` | `string` | Texto libre; se compara sin distinguir mayúsculas/minúsculas ni tildes contra `title` y `category` |

## 4. QuickOperationInput (dominio, validación en el límite)

Datos ingresados por el usuario al ejecutar una acción rápida interactiva (`'topup' | 'send' | 'pay'`).

| Campo | Tipo | Reglas de validación (FR-005, FR-006) | Mensaje de error inline |
|---|---|---|---|
| `kind` | `'topup' \| 'send' \| 'pay'` | Tipo de operación rápida | — |
| `title` | `string` | Vacío tras `trim()` | `"Ingresa una descripción o destinatario"` |
| | | Longitud tras `trim()` > 60 caracteres | `"La descripción no puede superar 60 caracteres"` |
| `amountRaw` | `string` | Vacío tras `trim()`, no numérico, `<= 0` o más de 2 decimales | `"Ingresa un monto válido mayor a 0"` |
| | | Valor numérico > `999999.99` | `"El monto supera el límite permitido"` |
| | | En `'send'` o `'pay'`, valor numérico > `availableBalance` | `"Saldo insuficiente para realizar esta operación"` |

## 5. HomeDashboardState (UI, máquina de estados)

```text
  ┌─────────────────────────────────────────────────────────────────────┐
  │                         active (Dashboard)                          │
  │  - toggleBalancePrivacy() → alterna balanceHidden (true / false)    │
  │  - setFilterType('all' | 'income' | 'expense') → filtra lista       │
  │  - setSearchQuery(text) → filtra lista en tiempo real               │
  │  - openQuickAction('topup' | 'send' | 'receive' | 'pay')            │
  │  - submitQuickOperation() → valida; si es válido agrega movimiento, │
  │    recalcula WalletSummary, cierra panel y muestra Toast de éxito   │
  │  - triggerComingSoon() → muestra Toast "Próximamente"               │
  └─────────────────────────────────────────────────────────────────────┘
```

| Campo | Tipo | Descripción |
|---|---|---|
| `transactions` | `readonly WalletTransaction[]` | Lista ordenada de movimientos (los nuevos se insertan al inicio) |
| `balanceHidden` | `boolean` | Si es `true`, los montos se muestran enmascarados como `"••••••"` (FR-004) |
| `filterType` | `'all' \| 'income' \| 'expense'` | Filtro activo de movimientos (FR-008) |
| `searchQuery` | `string` | Búsqueda instantánea por concepto o categoría (FR-008) |
| `activeAction` | `'topup' \| 'send' \| 'receive' \| 'pay' \| null` | Panel de acción rápida abierto actualmente (FR-005) |
| `operationForm` | `{ title: string; amount: string; errors: QuickOperationErrors }` | Estado del formulario de acción rápida y sus errores inline |
| `toastMessage` | `string \| null` | Mensaje del Toast activo (`"Próximamente"`, `"Operación realizada con éxito"`, `"Datos copiados al portapapeles"`) |
