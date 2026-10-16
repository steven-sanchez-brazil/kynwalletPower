# Research: Pantalla de Registro de Usuarios

## R1. Navegación entre `/login` y `/registro`

- **Decision**: módulo propio `ui/routing/router.ts` sobre la History API: `navigate(path)` usa
  `history.pushState` (o `replaceState`) y notifica a los suscriptores; `usePathname()` usa
  `useSyncExternalStore` escuchando `popstate`. Los enlaces son `<a href>` reales que interceptan
  el clic sin modificadores.
- **Rationale**: solo hay dos rutas sin parámetros. Una librería de rutas añadiría una
  dependencia (Constitución 7.4) sin un requisito que la justifique (4.2, 4.3). El `<a href>`
  conserva la semántica de enlace, abrir en pestaña nueva y el soporte de lectores de pantalla.
- **Alternatives considered**: `react-router` (dependencia y superficie innecesarias); rutas con
  hash `#/registro` (no cumple las direcciones `/login` y `/registro` pedidas).

## R2. Mensaje de éxito en `/login`

- **Decision**: `App` guarda en estado React que acaba de completarse un registro y lo pasa a
  `LoginForm`, que lo muestra con `Alert tone="success"` (`role="status"`). El indicador se
  limpia al ir a `/registro`.
- **Rationale**: un mensaje en `history.state` o en `sessionStorage` reaparecería al recargar
  (edge case de la spec) y almacenaría estado innecesario. El estado en memoria cumple FR-013.
- **Alternatives considered**: query string `?registrado=1` (visible en la URL y reaparece al
  recargar); `history.state` (persiste entre recargas).

## R3. Dónde se guardan las cuentas registradas

- **Decision**: `InMemoryAuthGateway` mantiene una lista mutable inicializada con las cuentas
  demo e implementa también `RegistrationGateway.register`. Si la configuración demo es inválida
  (`null`), ambos métodos devuelven `unavailable`.
- **Rationale**: autenticación y registro deben compartir el mismo almacén para que la cuenta
  creada pueda iniciar sesión (FR-011). Separar los puertos (ISP) permite que cada caso de uso
  dependa solo de lo que usa, aunque un mismo adaptador implemente ambos.
- **Alternatives considered**: un repositorio de cuentas separado usado por dos adaptadores
  (más clases sin beneficio en una demo); `localStorage` (contradice el alcance "solo en memoria"
  y guardaría contraseñas en el navegador, prohibido por FR-019).

## R4. Correo ya registrado y enumeración de cuentas

- **Decision**: informar "Ya existe una cuenta con este correo" junto al campo de correo.
- **Rationale**: lo pide la spec (US3) y es la práctica habitual en formularios de registro.
  El login conserva su mensaje genérico (FR-010 de 001). El riesgo de enumeración se documenta en
  los supuestos de la spec; en un sistema real se mitigaría con verificación por correo.
- **Alternatives considered**: mensaje genérico de éxito y aviso por correo (requiere backend).

## R5. Alerta "Próximamente"

- **Decision**: `window.alert('Próximamente')` para Google, Apple y "términos y condiciones".
- **Rationale**: el requisito del taller pide explícitamente un alert. El diálogo nativo es
  accesible (modal, anunciado y con foco gestionado por el navegador).
- **Alternatives considered**: reutilizar el aviso en página del login (`Alert tone="info"`); no
  cumple literalmente el requisito.

## R6. Casilla de términos con enlace

- **Decision**: `Checkbox` acepta `ariaLabel`, `error`, `ref` y `addon` (contenido junto a la
  etiqueta). La etiqueta visible es "Acepto los" y el `addon` es un botón con aspecto de enlace
  "términos y condiciones"; el nombre accesible de la casilla es "Acepto los términos y
  condiciones".
- **Rationale**: un botón dentro de un `<label>` alternaría la casilla al pulsarlo. Con el
  nombre accesible completo se cumple WCAG 2.5.3 (el nombre contiene el texto visible).
- **Alternatives considered**: todo el texto como etiqueta sin enlace (pierde la interacción del
  diseño); enlace a una página de términos (fuera de alcance).

## R7. Diseño de referencia sin MCP de Figma

- **Decision**: medir sobre la captura del frame `04 · Registro` incluida en el material del
  taller y reutilizar los tokens extraídos de `01 · Login` (mismo archivo de Figma).
- **Rationale**: el MCP de Figma no estaba conectado en la sesión; ambos frames comparten
  sistema visual (gradiente, tarjeta, campos, botones). El formulario de registro usa un espaciado
  vertical menor (18 px) y un título de 28 px para que los cuatro campos quepan sin scroll en
  1440 × 1024, como en el frame.
- **Alternatives considered**: esperar acceso al MCP (bloquea la entrega).
