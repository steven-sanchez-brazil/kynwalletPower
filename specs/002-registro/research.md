# Research: registro de cuenta

**Fecha**: 2026-10-20  
**Fuentes locales**: `registro.svg`, `spec.md`, `.specify/memory/constitution.md`, `package.json`, `src/App.tsx`, componentes y estilos de `src/ui/`, `src/domain/validation.ts`, pruebas y configuración actuales. No se consultaron servicios externos.

## R1. Fidelidad visual al SVG

**Decision**: conservar la composición de 1440 × 1024: panel de marca izquierdo de 620 px, gradiente de `#FF8A65` a `#EF5226`, logo blanco, titular “Comienza tu camino financiero.”, subtítulo y tarjeta decorativa. El área derecha es blanca, con contenido centrado de 400 px: “Crea tu cuenta”, subtítulo, cuatro campos de unos 52 px, casilla, botón naranja, divisor, Google/Apple y enlace al login. Usar Inter variable y los tokens ya presentes. En móvil ocultar por completo el panel izquierdo y mostrar solo el formulario.

**Rationale**: el SVG fue inspeccionado visualmente y comparte sistema visual con el login existente. `LoginScreen.module.css` ya resuelve la retícula de dos columnas desde 960 px y `BrandPanel` ya contiene logo y tarjeta; una variante del contenido evita duplicación.

**Alternatives considered**: insertar todo el SVG como imagen (no ofrece campos utilizables ni accesibles); crear CSS y componentes independientes del login (duplica estilos y dificulta coherencia).

**Accesibilidad y desviación visual**: el naranja claro del botón del SVG no proporciona contraste AA suficiente para texto blanco. Emplear el token interactivo `--brand-700` ya establecido por el login para botón y enlaces, manteniendo el gradiente y geometría originales. Verificar contraste y registrar el ajuste en revisión de diseño.

## R2. Navegación sin dependencia adicional

**Decision**: incorporar en `App` una selección simple por `window.location.pathname`, con `/` y `/login` para el login y `/registro` para registro. Una función de navegación hace `history.pushState`, actualiza el estado React y atiende `popstate`. El aviso de éxito viaja como estado temporal en memoria, no en URL ni almacenamiento. Al recargar `/login`, desaparece.

**Rationale**: el proyecto actual no tiene router y solo necesita dos pantallas. Vite sirve la SPA en recarga directa durante desarrollo. Se conservan atrás/adelante y enlaces navegables.

**Alternatives considered**: añadir React Router (dependencia y alcance innecesarios para dos rutas); mostrar ambas pantallas sin URL (incumple `/login`); enviar el mensaje en query string o `history.state` (persiste más de lo deseado y expone información de flujo).

## R3. Validación y simulación

**Decision**: reutilizar `normalizeEmail`, límites y comprobación de contraseña del dominio actual. Añadir reglas del nombre, confirmación y términos en una sola función pura de registro. El caso de uso valida y delega en un puerto `RegistrationGateway`; un adaptador en memoria resuelve la simulación tras una espera breve, con bloqueo de envíos simultáneos en la UI. El resultado exitoso solo confirma el flujo, no crea una cuenta utilizable para login.

**Rationale**: satisface la Constitución II–IV con la menor extensión sobre la estructura existente y permite simular fallos en pruebas sin crear cuentas, secretos o infraestructura.

**Alternatives considered**: validación repartida entre componentes (duplica reglas); guardar una cuenta de prueba en memoria para permitir login posterior (amplía el alcance y puede confundirse con registro real); `fetch` o servicio remoto (prohibidos por el pedido).

## R4. Mensajes, datos y error

**Decision**: mostrar errores al salir del campo o enviar, corregirlos al editar, enfocar el primer control inválido y usar `Alert` para errores globales y aviso de éxito. Google y Apple conservan el formulario y muestran exactamente “Próximamente”. En un fallo inesperado se permite reintento sin revelar datos técnicos. No imprimir ni persistir nombre, correo o contraseña.

**Rationale**: coincide con los componentes y pruebas existentes y protege los datos personales de la demostración.

**Alternatives considered**: validación solo nativa del navegador (mensajes inconsistentes y difícil trazabilidad); mensaje de éxito en la pantalla de registro (contradice la instrucción actual de redirigir a `/login`).

## R5. Términos y pruebas

**Decision**: la casilla queda desmarcada por defecto y su texto incluye un acceso independiente a `terminos-y-condiciones.md` o a su versión accesible en la aplicación. La consulta no marca la casilla. El documento local fue aprobado para la demostración el 2026-10-20. Crear pruebas unitarias y de integración con Vitest/Testing Library y una revisión manual de 1440 px, 320 px, teclado y lector de pantalla.

**Rationale**: un consentimiento exige acceso a la información aceptada. La Constitución I, V, 8.4 y 9.2 exige pruebas previas, accesibilidad y trazabilidad.

**Alternatives considered**: casilla sin texto consultable (no satisface FR-008); reutilizar condiciones de un servicio de pagos real (atribuiría funciones y obligaciones que la demostración no ofrece).
