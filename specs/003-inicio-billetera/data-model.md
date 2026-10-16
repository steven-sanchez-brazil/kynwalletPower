# Modelo de datos: Inicio

- **WalletOverview**: readonly balance, currency `MXN`, tres indicadores (label/value/detail), cinco movimientos en orden, tarjeta maskedNumber/expiry, tres categorías label/amount/indicator.
- **Movement**: id único, name, category, date, amount con signo, direction `in` o `out`. Son importes ya presentados; no se usan para cálculos.
- **Category**: label, amount, indicator (0–100) ilustrativo, tone `expense`, `income` o `neutral`.
- **NavigationState**: path, generation numérica, registrationNotice y displayName nullable. Solo contiene el nombre de 1–80 caracteres ya validado por el cargador de cuentas del login.

## Transiciones

Login → autenticación pendiente → éxito vigente → `/inicio` con nombre. Error permanece en login. Respuesta de generación anterior se descarta. Inicio → logout/popstate/pagehide/restauración → sin nombre. Entrada a `/inicio` sin nombre → replace `/login`. Remontaje comienza sin sesión. No hay almacenamiento, tokens ni nuevos logs.

El snapshot es estático, de confianza y local; los datos externos siguen validados en `loadDemoAccounts` y casos de uso de acceso/registro existentes. UI codifica textos con React. Ningún callback recibe credenciales al completar acceso.
