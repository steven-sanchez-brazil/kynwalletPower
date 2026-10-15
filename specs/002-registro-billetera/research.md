# Research: Pantalla de Registro de KynWallet

**Feature**: `002-registro-billetera` | **Date**: 2026-10-15

Stack, estilos, pruebas, controles de cumplimiento y diseño responsivo se heredan de
[001-login-billetera/research.md](../001-login-billetera/research.md) (R1–R3, R5–R10). Aquí solo
se documentan las decisiones propias del registro.

## R1. Cómo conviven login y registro (sin router) — *sustituida por R10 (2026-10-15 (b))*

- **Decision**: segunda entrada de Vite (`register.html` + `src/registerMain.tsx`); ambas
  entradas comparten `src/` y se declaran en `build.rollupOptions.input`.
- **Rationale**: son dos pantallas independientes y el enlace entre ellas está fuera del alcance
  (se muestra "Función no disponible"); no se justifica una dependencia de enrutado (Principio IV,
  7.4).
- **Alternatives considered**: React Router (dependencia nueva sin requisito); alternar vistas con
  estado en `App` (acopla login y registro y rompe el alcance de cada spec).
- **Revisión 2026-10-15** (ver R9): el enlace entre pantallas pasó a estar en el alcance. La
  decisión de no usar enrutador se mantiene.

## R9. Navegación entre login y registro (cambio de alcance 2026-10-15) — *sustituida por R10*

- **Decision**: "Regístrate" (login) y "Inicia sesión" (registro) son elementos `<a>` estándar
  con rutas relativas (`./register.html` y `./`), definidas una sola vez en `src/ui/routes.ts`.
  Se dibujan con un componente `TextLink` que reutiliza el estilo del botón de enlace existente
  (`Button` variante `link`), sin duplicar CSS. Cada navegación recarga la página: los datos
  del formulario no se conservan ni viajan en la URL (FR-015 de 002, FR-012 de 001).
- **Rationale**: un enlace que cambia de página DEBE tener rol `link` (WCAG 4.1.2; un `<button>`
  anuncia una acción, no una navegación). Las rutas relativas funcionan con cualquier `base` de
  Vite y tanto en `npm run dev` como en `preview`. Es la solución más simple que satisface el
  requisito (Constitución 4.2) y no añade dependencias (7.4).
- **Alternatives considered**: React Router o un enrutador propio (dependencia o código nuevo
  solo para evitar una recarga, sin requisito que lo pida); `window.location` desde un `button`
  (rol incorrecto y sin soporte de "abrir en pestaña nueva"); rutas absolutas `/register.html`
  (se rompen si la demo se publica bajo una subruta).
- **Trade-off aceptado**: la recarga de página y la pérdida de lo escrito al cambiar de pantalla.

## R2. Reglas de validación y fuente única

- **Decision**: ampliar `domain/validation.ts`:
  - Nombre: `trim` + colapsar espacios internos; 2–100 caracteres; patrón Unicode
    `^[\p{L}][\p{L}\p{M}' -]*$` (letras con tildes/ñ, espacios, apóstrofes y guiones).
  - Correo: reutiliza `isValidEmail` y `EMAIL_MAX_LENGTH`.
  - Contraseña de registro: 8–128 y al menos una letra y un dígito (`\p{L}` y `\d`). La política
    de **login no cambia** (solo longitud) para no romper 001.
  - Confirmación: obligatoria e idéntica (comparación exacta, sin recortar).
  - Términos: booleano obligatorio.
- **Rationale**: una sola fuente para correo/longitudes (FR-021); la política de contraseña extra
  solo aplica al crear una contraseña nueva.
- **Alternatives considered**: Zod/Yup (dependencia innecesaria); endurecer también el login
  (cambio de comportamiento de 001 no solicitado).

## R3. Simulación del registro y error demostrable

- **Decision**: `InMemoryRegistrationGateway(accounts, {delayMs})` espera 1 s y devuelve
  `rejected` si el correo normalizado coincide con una cuenta de demostración, `unavailable` si la
  configuración no está disponible o ocurre una excepción, y `created` en otro caso. No guarda la
  cuenta (clarificación 2026-10-15).
- **Rationale**: produce el caso de error sin backend y sin revelar qué correos existen (mensaje
  único para `rejected`); cumple FR-010, FR-013 y FR-015.
- **Alternatives considered**: guardar la cuenta en memoria (descartado en la clarificación);
  error aleatorio (no determinista, imposible de probar).

## R4. Mensajes de error

- **Decision**: `rejected` → "No fue posible crear la cuenta. Verifica tus datos e inténtalo de
  nuevo."; `unavailable` → "Servicio de registro no disponible. Intenta más tarde." Ambos en
  `Alert` con rol `alert`; sin detalles internos (5.4, 5.5). Tras el error: se conservan nombre,
  correo y casilla; se vacían las contraseñas; el foco va al correo.
- **Rationale**: coherente con US2 y con el patrón de 001.

## R5. Estado del formulario

- **Decision**: `registerReducer` + `useRegisterForm` (patrón de `loginReducer`): estados
  `editing → submitting → failure | welcome`, errores por campo visibles solo si el campo fue
  tocado o se intentó enviar, y revalidación de la confirmación cuando cambia la contraseña.
- **Rationale**: máquina de estados pura y fácil de probar; cinco campos no justifican librerías.
- **Alternatives considered**: React Hook Form (dependencia innecesaria).

## R6. Diseño (Figma, nodo 31:2)

- **Decision**: el MCP de Figma no estaba disponible durante `/speckit-plan`, así que no se
  extrajeron tokens ni medidas del frame. Se parte de los tokens de 001 (mismo archivo de
  prototipos; mismo lenguaje visual) y se registra como **primera tarea** consultar
  `get_design_context` y `get_variable_defs` sobre `31:2`, añadir los tokens nuevos a
  `tokens.css`, y corregir textos en `messages.ts`.
- **Rationale**: no inventar medidas ni textos; el usuario exige fidelidad al diseño (FR-001,
  SC-006). Los contrastes de cualquier color nuevo se miden como en 001-R3.
- **Risk**: el frame podría incluir elementos no previstos (p. ej., indicador de fortaleza de
  contraseña). Si aparecen, se evalúan contra la spec y se actualiza vía `/speckit-clarify`.

## R7. Accesibilidad de la casilla de términos

- **Decision**: extender `Checkbox` con `error?: string` que aplica `aria-invalid`,
  `aria-describedby` y muestra el mensaje; el texto de la etiqueta admite un enlace "términos y
  condiciones" (botón con aviso, FR-019). El mensaje de error se asocia al campo para lectores de
  pantalla (US3-8).
- **Rationale**: reutiliza el componente existente (8.5) con un cambio retrocompatible.

## R8. Datos de prueba

- Las pruebas usan cuentas y personas ficticias construidas en `src/test/fixtures.ts` e inyectadas;
  ningún dato real ni credencial en archivos versionados (5.3).

### R6 · Resultado de la consulta a Figma (T001, 2026-10-15)

Consultado el nodo `31:2` ("04 · Registro", 1440×1024) en la copia `6R6EnGIBSmd0ILx8dHOpms` del
archivo original `f7uDsv8sh6ZOtK2OitTqtg` (el original rechazaba la lectura por el tipo de asiento).
`get_variable_defs` devolvió `{}`: el frame no usa variables, solo valores directos.

- **Textos**: coinciden con `contracts/ui-register.md`. Nuevos a fijar: título "Crea tu cuenta",
  subtítulo "Completa tus datos para comenzar", placeholders "Ej: Diego Martínez",
  "tucorreo@ejemplo.com" y "••••••••", separador "o regístrate con", pie "¿Ya tienes cuenta?" +
  "Inicia sesión", panel de marca "Comienza tu camino financiero." / "Crea tu cuenta en minutos y
  empieza a enviar, recibir y administrar tu dinero desde cualquier lugar."
- **Sin elementos no previstos** (no hay indicador de fortaleza de contraseña).
- **Medidas**: formulario de 400 px; campos 52 px (borde 1,5 px, radio 12); botones sociales 48 px
  en dos columnas de 192 px con 16 px de separación; casilla 20 px (radio 6); título 30 px/700;
  etiquetas 14 px/500; separación entre campos 16 px. Panel de marca de 620 px.
- **Tokens nuevos**: solo el degradado del panel (70,73°, `#ff8a65` 31,7 % → `#ef5226` 83,46 %),
  distinto al de login: `--brand-gradient-register`. El texto de enlaces usa `--brand-700` (el
  `#ef5226` de Figma no alcanza 4,5:1 sobre blanco, igual que en 001-R3).
- **Assets** guardados en `src/ui/assets/`: `register-logo-dot.svg` y `register-logo-dot-2.svg`
  (logo de dos puntos del panel). El icono del ojo (`#a9abc2` al 50 %) y el punto social
  (`#d7d9e6`) del frame no cumplen contraste de componentes de UI (1.4.11); se reutilizan
  `eye.svg` y `social-placeholder.svg` de 001, que ya son la variante accesible aprobada.

## R10. Enrutado con React Router (cambio de alcance 2026-10-15 (b))

- **Decision**: una única aplicación (`index.html` + `src/main.tsx`) con `react-router` `~8.4.0`
  (licencia MIT, publicada el 2026-09-15, compatible con React 19.3). Rutas `/login`, `/registro`
  y comodín → `<Navigate to="/login" replace>`. `BrowserRouter` en la raíz de composición;
  `MemoryRouter` en las pruebas. *Sustituye* R1 (dos entradas HTML) y R9 (enlaces con recarga).
- **Rationale (Constitución 7.4)**: los requisitos nuevos exigen rutas con nombre (`/login`,
  `/registro`) y pasar el resultado del registro a otra pantalla. Con React Router el resultado
  viaja en el `state` de la navegación, en memoria, sin URL ni almacenamiento (FR-012, FR-015), y
  `/login` funciona igual en `dev` y `preview` (Vite sirve `index.html` como respaldo de SPA).
- **Alternatives considered**:
  - Mantener dos HTML y redirigir a `/?registro=exitoso`: sin dependencia, pero la URL no sería
    `/login` (incumple el requisito) y el indicador quedaría visible y reutilizable en la URL.
  - Enrutador propio con `history.pushState`: código nuevo que reimplementa una librería madura
    (Principio IV, 8.5).
  - `sessionStorage` para el mensaje: contradice FR-015 y la decisión de no crear memoria.
- **Mensaje de un solo uso**: la página de login lee `location.state.registered` una vez y
  reemplaza la entrada del historial sin `state`, para que el mensaje no reaparezca al recargar.
- **Consecuencias**: se eliminan `register.html`, `src/registerMain.tsx` y `src/RegisterApp.tsx`
  (una sola raíz de composición); `TextLink` usa `Link` de React Router; en un despliegue real,
  el servidor debe devolver `index.html` para `/login` y `/registro` (documentado en el README).
- **Google/Apple → "Próximamente"**: se reutiliza el aviso existente (`Alert` con
  `role="status"`). Se descarta `window.alert()`: bloquea la página, no se puede probar de forma
  fiable y rompe la pauta de mensajes de la Constitución 8.4.

## R11. Aviso emergente (toast) para el registro exitoso (2026-10-15 (c))

- **Decision**: componente propio `Toast` en `src/ui/components/Toast/`, sin dependencias. Una
  región `role="status"` fija en la esquina superior derecha que existe siempre (vacía cuando no
  hay aviso), para que los lectores de pantalla anuncien el texto al insertarse. El aviso dura
  5 000 ms; el tiempo restante se pausa con `mouseenter`/`focus` y se reanuda con
  `mouseleave`/`blur`; botón "Cerrar aviso" (`×` decorativo con `aria-hidden`). Animación de
  entrada de 200 ms anulada con `prefers-reduced-motion: reduce`. Lo monta `LoginPage` fuera de
  `<main>`, de modo que no forma parte del formulario.
- **WCAG 2.1 AA**: 4.1.3 (mensaje de estado sin mover el foco), 2.2.1 (el tiempo se puede
  detener con puntero o foco y el aviso se puede cerrar; no contiene información imprescindible
  que no pueda repetirse), 2.3.3/2.3.1 (sin animación si el usuario lo pide), 1.4.11 (borde de
  acento).
- **Token nuevo**: `--success-600: #1b7a3a`, contraste 5,40:1 sobre blanco (cumple 4.5:1 para el
  icono y 3:1 para el acento). El texto usa `--neutral-900`.
- **Alternatives considered**: librerías de toasts (dependencia para un único aviso; 7.4);
  `window.alert` (bloqueante); mantener el aviso dentro del formulario (poco visible al llegar).
