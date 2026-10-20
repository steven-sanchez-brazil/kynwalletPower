# Research: Registro de usuarios

**Feature**: `002-registro-usuarios` | **Date**: 2026-10-19

## R1. Stack y arquitectura

- **Decision**: conservar React 19.3, TypeScript 5.9, Vite 8.3, CSS Modules, tokens CSS y las
  capas existentes.
- **Rationale**: satisface reutilización y Clean Architecture sin nuevas licencias.
- **Alternatives considered**: app separada o librerías de formularios; duplican infraestructura.

## R2. Normalización y validación

- **Decision**: reglas puras. Nombre: solo `trim`, 1–80, sin regex restrictiva. Correo:
  `trim().toLowerCase()`, formato existente y ≤254. Contraseña cruda 8–128; confirmación
  exacta; términos `true`. Códigos de error y tabla única de mensajes.
- **Rationale**: una fuente testeable; admite nombres legítimos y no altera contraseñas.
- **Alternatives considered**: HTML solamente; regex de nombres; mezclar con LoginCredentials.

## R3. Simulación sin datos personales

- **Decision**: el caso de uso valida y llama `RegistrationSimulator.simulate()` sin argumentos.
  El adaptador devuelve `success | unavailable` dentro de 2 s; throw → `unavailable`.
- **Rationale**: no transportar PII que la simulación no utiliza.
- **Alternatives considered**: gateway con DTO, timeout en UI o API mock.

## R4. Estado y doble envío

- **Decision**: reducer `editing | submitting | submitError`; éxito limpia y navega. Botón
  inactivo + guardia reducer + lock síncrono en hook.
- **Rationale**: transiciones deterministas y bloqueo aun en el mismo tick.
- **Alternatives considered**: múltiples useState; solo `disabled`.

## R5. Navegación

- **Decision**: History API en App: `/register`, `/login` y `/`. El éxito lleva solo texto fijo
  en memoria a login; `popstate` soporta historial.
- **Rationale**: sin query, storage, PII ni dependencia.
- **Alternatives considered**: React Router (YAGNI); recarga (pierde flash); localStorage.

## R6. Reutilización

- **Decision**: reutilizar controles; ampliar Checkbox con ref/error/descripción y mantener el
  enlace separado. Extraer AuthScreen y parametrizar BrandPanel con defaults de login.
- **Rationale**: evita controles anidados, duplicación y regresión.
- **Alternatives considered**: duplicar; importar LoginScreen desde registro.

## R7. Figma y assets

- **Decision**: fuente consultada por Figma MCP el 2026-10-19: archivo
  `8d93T5F40yvMNXngrH48qt`, frame `04 · Registro`, nodo `31:2`, con captura. Referencias:
  1440×1024, panel 620, formulario 400, Inter, controles 400×52/radio 12/borde 1.5, checkbox
  20/radio 6, sociales 192×48/gap 16, tarjeta 360×210/radio 22 y gradiente
  `#FF8A65 → #EF5226` ~70.73°.
- **Rationale**: atributos de la fuente oficial.
- **Alternatives considered**: inferir desde 001 (su gradiente es 121.19°); URLs MCP runtime
  (caducan).

## R8. Contraste

- **Decision**: usar derivados actuales donde el original falla: `--brand-700 #D04721`,
  `--neutral-600 #73748B`, `--neutral-border #92949C`, `--danger-600 #C62828`. Medir el
  gradiente y obtener aprobación de diseño.
- **Rationale**: ratios documentados: 2.83:1, 3.56:1, 3.28:1, 2.26:1 y borde 1.40:1; AA prevalece.
- **Alternatives considered**: literal inaccesible; texto oscuro que altera más la identidad.

## R9. Responsive

- **Decision**: mobile-first; bajo 960 oculta promoción pero conserva logo; desde 960 dos
  columnas; desde 1280 panel 620. Formulario fluido max 400, padding 16 bajo 480, sin overflow
  horizontal; social se apila si no cabe.
- **Rationale**: cubre 320 px y reaprovecha breakpoints.
- **Alternatives considered**: escala fija; ocultar toda identidad.

## R10. Accesibilidad

- **Decision**: orden DOM visual, controles nativos, errores vinculados, foco al primer inválido,
  toggles independientes, avisos en `status`, error en `alert` y éxito vivo en login.
- **Rationale**: teclado y lector sin saltos inesperados.
- **Alternatives considered**: resumen sin asociación; foco en cada blur.

## R11. TDD y visual

- **Decision**: pruebas primero por capa y regresión. axe para semántica; contraste, zoom,
  lector, reflujo y overlay Figma manuales a 320 y 1440×1024.
- **Rationale**: jsdom/axe no verifican geometría o contraste con fiabilidad.
- **Alternatives considered**: añadir Playwright sin requisito; omitir comparación.

## R12. Privacidad y observabilidad

- **Decision**: ningún storage, cookie, URL o log contiene valores. Puerto con eventos
  `attempt_started`, `success`, `unavailable` y duración agregada, sin payload.
- **Rationale**: Constitution 8.7 sin contradecir FR-018–020.
- **Alternatives considered**: registrar DTO; omitir observabilidad.
