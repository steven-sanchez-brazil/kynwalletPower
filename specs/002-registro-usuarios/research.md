# Research: Registro de Usuarios de KynWallet

**Feature**: `002-registro-usuarios` | **Date**: 2026-10-19

## R1. Stack y arquitectura existentes

- **Decision**: mantener React 19, TypeScript 5 strict, Vite 8, CSS Modules, tokens CSS,
  Vitest 5, React Testing Library, jsdom, axe-core y coverage-v8.
- **Rationale**: todos están ya configurados y usados por `001-login-billetera`; el registro
  puede construirse sin una nueva biblioteca de forms ni un backend.
- **Alternatives considered**: migrar framework o estado de aplicación; no añade valor y
  contradice KISS/YAGNI.
- **Runtime note**: aunque `package.json` declara Node `>=20`, las versiones bloqueadas de
  Vite y `@vitejs/plugin-react` requieren `^20.19.0 || >=22.12.0`; armonizar metadatos o
  documentación en la implementación si se modifica el alcance correspondiente. El taller pide
  "Node.js 18+", que tampoco cumple Vite 8; el README y el quickstart de 001 dicen "20 LTS o
  superior".

## R2. Diseño y recursos de referencia

- **Decision**: tomar como referencia primaria `Docs/04 · Registro.png` (1440 × 1024) y los
  recursos `Docs/Prototipos/`; no afirmar que se extrajeron propiedades mediante MCP.
- **Rationale**: el frame completo permite confirmar dos paneles, textos y proporción del
  escritorio. La columna de marca mide 620 × 1024 y el formulario ocupa el área blanca restante
  de 820 px; el formulario tiene aproximadamente 400 px de ancho visual.
- **Observed values**: muestras de esquina del panel de marca `#FE855F`, `#EE5225`, `#FF8A65`
  y `#F5683F`; el área de formulario es `#FFFFFF`. Assets: Brand Panel 620 × 1024, KynWallet
  125 × 25, Card Mockup 360 × 210, Chip 38 × 28, Card number 214 × 15 y Card holder 90 × 10.
- **Constraints**: los PNG están dentro de `Docs/`, ignorada por Git. Si un asset se necesita
  en runtime, copiarlo al árbol versionado de `src/ui/assets/` y probar que el archivo exista;
  no importarlo desde Docs. No se conoce frame móvil ni estilos exactos por control.
- **Geometría medida (2026-10-19, en píxeles del PNG de 1440 × 1024)**: inputs de 400 × 52 px en
  x 820–1219, con 40 px entre el borde inferior de uno y el superior del siguiente (incluye la
  etiqueta); botón "Crear cuenta" de 400 × 52 px; botones sociales de 48 px de alto,
  ≈192 px de ancho y ≈16 px de separación (2 × 192 + 16 = 400); checkbox de 20 × 20 px; radio de
  esquina de los inputs ≈12 px. Coinciden con los valores de 001 (`--control-height` 52,
  `--social-height` 48, `--radius-control` 12).
- **Tipografía estimada** (altura de la mayúscula ÷ 0,727, valor de Inter): titular del panel
  de marca ≈44 px; título "Crea tu cuenta" ≈30–32 px; subtítulo y botón ≈16 px; etiquetas
  ≈14 px; botones sociales ≈15 px. Son estimaciones por píxeles: coinciden con las de 001
  (30/44/16/14/16 px) pero **no** confirman la familia, los pesos ni la altura de línea, y el
  tamaño del placeholder no se pudo medir con fiabilidad.
- **Decisión sobre recursos**: se reutiliza el `BrandPanel` construido con CSS y
  `logo-mark.svg`; los PNG de `Docs/` quedan solo como referencia visual.
- **Decisión sobre móvil**: solo formulario, sin cabecera de logo (literal del taller); no hay
  frame móvil que lo verifique visualmente.
- **Alternatives considered**: deducir tipografía, radios y espaciados solo de la imagen; esos
  valores no se pueden confirmar fielmente y se dejan al sistema de tokens existente hasta una
  inspección Figma aprobada.

## R3. Rutas y navegación de cliente

- **Decision**: mantener navegación cliente para `/`, `/login` y `/registro`; React Router
  sigue siendo la opción propuesta, pero su incorporación no queda aprobada hasta completar
  la auditoría local de dependencias.
- **Rationale**: el taller exige navegación sin recargar para conservar la cuenta compartida
  en memoria. No existe router en el manifiesto, lockfile ni código. Una librería evita mantener
  una solución propia de historial, enlaces, rutas desconocidas y navegación accesible.
- **Candidate review (2026-10-19)**: React Router `7.18.4` declara licencia MIT, peers
  `react >=18`/`react-dom >=18` y Node `>=20`; la publicación `7.18.4` del 2026-09-15 es
  evidencia reciente de mantenimiento. Es compatible por metadatos con React `19.3.0` y con
  el mínimo efectivo del proyecto (Node `20.19.0` para Vite 8). La línea `8.5.0`, aunque
  también publica peers React compatibles y licencia MIT, exige Node `>=22.22.0`, por lo que
  no se elige mientras `package.json` declare Node `>=20` y el stack Vite permita Node 20.
  Fuentes: [paquete 7.18.4](https://raw.githubusercontent.com/remix-run/react-router/react-router%407.18.4/packages/react-router/package.json),
  [licencia MIT](https://raw.githubusercontent.com/remix-run/react-router/react-router%407.18.4/LICENSE.md),
  [releases oficiales](https://github.com/remix-run/react-router/releases).
- **Dependency gate (verificado el 2026-10-19 en una copia temporal fuera del repo)**: con
  Node 24.20.0 y npm 11.19.0 se resolvió `react-router@^7.18.4` en una copia de `package.json` y
  `package-lock.json`; el repositorio no se modificó.
  - Registro npm: versión `7.18.4` (etiqueta `version-7`), licencia MIT, peers
    `react >=18`/`react-dom >=18`, Node `>=20`, publicada el 2026-09-15 (anteriores: 7.18.3 el
    2026-08-28 y 7.18.2 el 2026-07-28); mantenedores identificables y repositorio oficial
    `remix-run/react-router`. La etiqueta `latest` es 8.5.0, que no se elige por exigir Node
    `>=22.22.0`.
  - Dependencias nuevas en producción: `react-router`, `cookie@1.1.1` y
    `set-cookie-parser@2.7.2`, las tres MIT.
  - `npm audit --audit-level=high`: 0 vulnerabilidades, tanto en el árbol completo como en
    producción.
  - Licencias: `license-checker-rseidelsohn@5.0.1` con la lista permitida de `audit:licenses`
    sobre los 7 paquetes de producción: 6 MIT y 1 OFL-1.1 (Inter), sin incumplimientos.
  - Compatibilidad: con React 19.3.0 se renderizaron `MemoryRouter`, `Routes`, `Route` y `Link`
    para `/`, `/login`, `/registro` y una ruta desconocida, con el resultado esperado.
  - Entorno: la red corporativa interceptaba TLS (`SELF_SIGNED_CERT_IN_CHAIN`); se resolvió
    con `NODE_OPTIONS=--use-system-ca` sin desactivar `strict-ssl`.
  - **Queda para la implementación**: añadir `"react-router": "^7.18.4"` a `package.json`,
    regenerar el `package-lock.json` real, y repetir `npm run audit:deps` y
    `npm run audit:licenses` con el árbol completo.
- **API prevista** (declarative mode de la v7): `BrowserRouter` solo en `main.tsx`,
  `MemoryRouter` en pruebas mediante un helper `renderWithRouter`, y `Routes`/`Route`/`Link`.
  `/` y `/login` renderizan la misma vista (alias, sin redirección, la URL se conserva);
  `/registro` el alta y `*` una vista de ruta no encontrada. Verificar los imports exactos
  contra la versión fijada.
- **Success message**: el aviso se guarda en un estado en memoria de `App`, no en
  `location.state`. El navegador conserva `history.state` al recargar, por lo que el mensaje
  reaparecería y contradeciría "recargar elimina el mensaje" de la spec. Se limpia al enviar el
  login o al salir de la ruta.
- **Unknown paths**: resolver a una vista no encontrada explícita con enlace a `/login`; no
  asumir que cualquier URL debe caer silenciosamente en el formulario de registro.
- **Foco en SPA**: al cambiar de ruta el foco pasa al `h1` de la vista nueva, para que
  teclado y lector de pantalla no queden en un elemento desmontado.
- **Alojamiento**: las rutas profundas requieren reescritura a `index.html`; Vite dev y
  `preview` ya la aplican. Documentarlo en el README, sin definir despliegue.

## R4. Fuente compartida de cuentas y alta simulada

- **Decision**: cargar cuentas iniciales una vez desde `VITE_DEMO_USERS` y crear una única
  instancia de `InMemoryAuthGateway` en `main.tsx`. `AuthGateway` (contrato de 001) no cambia:
  un puerto nuevo `RegistrationGateway` con `register(account)` lo implementa la misma clase, y
  esa instancia se inyecta en `createAuthenticate` y en el nuevo `createRegisterAccount`.
- **Colección mutable**: el constructor guarda una copia superficial del arreglo inicial (no
  muta el de `loadDemoAccounts`) y conserva `null` como `unavailable`. No se clonan los
  elementos en el constructor: la prueba `C5` de 001 usa un objeto con getter que lanza.
  `register` espera la demora simulada y después comprueba duplicado e inserta en una sola
  sección síncrona; así dos altas concurrentes del mismo correo no pueden ambas tener éxito.
- **Demora**: se reutiliza la opción `delayMs` (1 s por defecto, 0 en pruebas). Hace visible el
  estado de carga y la protección contra doble envío (US1-5) y da coherencia con el login.
  Esto sustituye la idea previa de "alta sin espera", incompatible con una operación asíncrona
  observable. Alternativa descartada: alta inmediata; no deja un estado "en curso" que probar.
- **Rationale**: satisface la aclaración del usuario (poder iniciar sesión inmediatamente), la
  normalización del login, y pérdida de nuevas cuentas al recargar; evita otra capa de
  persistencia.
- **Validation**: reutilizar `normalizeEmail`, `isValidEmail` e `isValidPasswordLength` donde sus
  reglas coinciden; añadir validación de confirmación, aceptación y duplicados. El límite de 80
  caracteres y el recorte del nombre hoy son privados de `loadDemoAccounts.ts`
  (`DISPLAY_NAME_MAX_LENGTH`): se mueven a `domain/validation.ts` para tener una única fuente
  (4.1) que usen la configuración inicial y el registro. La contraseña se mantiene exacta.
- **Use case**: `createRegisterAccount(gateway, report)` normaliza (nombre recortado, correo
  con `normalizeEmail`), vuelve a validar como defensa en profundidad (5.1) y devuelve `invalid`
  con los errores si falla, delega en el puerto y traduce excepciones a `failure`. El hook de UI
  usa las mismas funciones puras para los errores en línea; la regla no se duplica.
- **Failure policy**: cuentas iniciales ausentes/inválidas mantienen la condición `unavailable`
  existente; no anunciar éxito sin una inserción disponible. Errores de negocio se expresan
  como resultados discriminados. Un error inesperado no se silencia: el caso de uso devuelve
  `failure` (mensaje genérico) y llama a un reporter inyectado con un código fijo, sin valores
  del formulario, contraseña ni el objeto de error. `no-console` está en error en ESLint, así
  que el adaptador `consoleDiagnostics.ts` es el único sitio con una excepción acotada. La
  captura silenciosa de `createAuthenticate` en 001 es preexistente y queda fuera de alcance.
- **Alternatives considered**: editar `.env.local` o `.env.example` desde la UI (imposible y
  contrario a seguridad); localStorage/sessionStorage (contradice la decisión de solo memoria);
  gateway de registro con otra lista (no permite autenticación posterior y rompe la fuente única
  de cuentas); ampliar `AuthGateway` con `register` (rompe el contrato de 001 y las interfaces
  específicas, 2.4); `console.error` directo (incumple `no-console`).

## R5. Validación y estado de formulario

- **Decision**: funciones puras para validar y reducer/hook propio modelado sobre los patrones
  de `useLoginForm` y `loginReducer`; campos accesibles reutilizando `TextField`,
  `PasswordField`, `Checkbox`, `Button`, `Alert`, `Divider` y `SocialButton`.
- **Rationale**: cinco controles requieren estado por campo y foco en el primer error, pero no
  justifican una dependencia de forms; mantiene lógica fuera del JSX y se prueba sin DOM para
  reglas puras.
- **Alternatives considered**: React Hook Form/Zod o un store global: dependencias/capas no
  requeridas por el alcance.

## R6. Contraste y accesibilidad

- **Decision**: usar los tokens existentes de `src/ui/styles/tokens.css` y reutilizar las
  variantes derivadas accesibles cuando el color original no alcance WCAG AA. Ejecutar axe y
  revisar contraste de texto, botones, enlaces, bordes y foco; registrar la desviación y pedir
  aprobación de diseño cuando el cambio visual sea necesario.
- **Rationale**: la Constitución 8.4 exige WCAG 2.1 AA; 8.6 requiere aprobación de desviaciones.
- **Medición del 2026-10-19** sobre `Docs/04 · Registro.png` (se muestrearon los píxeles de
  texto y de fondo; razones calculadas con la fórmula WCAG; son aproximadas por el suavizado
  de bordes):
  - Los colores del panel de formulario coinciden exactamente con los tokens de 001
    (`#16182C`, `#3D3F5C`, `#8A8BA8`, `#A9ABC2`, `#D7D9E6`, `#EF5226`, `#FF6B3D`), por lo que
    los resultados y las variantes accesibles de 001 (R3) aplican sin cambios.
  - Cumplen: título 17,48:1, etiquetas y texto "Acepto los" 10,17:1, botones sociales 17,48:1.
  - No cumplen y se corrigen con los tokens accesibles de 001: subtítulo, "o regístrate con" y
    "¿Ya tienes cuenta?" (3,31:1 → `--neutral-600`), placeholders (2,26:1 → `--neutral-600`),
    enlaces "Inicia sesión" y "términos y condiciones" (3,56:1 → `--brand-700`), texto del botón
    principal (2,83:1 → `--brand-700`) y bordes de inputs, botones sociales y checkbox
    (1,40:1 → `--neutral-border`).
  - **Hallazgo nuevo, no cubierto por 001**: el texto claro del panel de marca no alcanza AA
    sobre el degradado `#FF8A65 → #EF5226`. El fondo mide entre 2,3:1 y 3,6:1 frente al blanco:
    titular de 44 px (texto grande, mínimo 3:1) 2,37:1 en la zona clara y 3,07:1 en la oscura;
    texto de apoyo de 16 px (mínimo 4,5:1) 2,12–2,75:1. El logotipo está exento (1.4.3) y la
    tarjeta es ilustrativa (`aria-hidden`). Este panel ya existe en 001 con el mismo problema,
    porque su R3 solo midió el panel del formulario; axe no evalúa texto sobre degradados.
  - Las opciones para el panel de marca, con sus razones calculadas, están en R10. Se decidió
    mantener el texto blanco del diseño original y registrar el incumplimiento como excepción
    temporal (9.1), aprobada el 2026-10-19 y con vencimiento el 2027-01-19.
  - El texto "términos y condiciones" aparece en naranja como un enlace pero la demo no tiene
    destino (decisión: solo etiqueta). Se renderiza como texto resaltado no interactivo,
    no como enlace.
- **Pending**: estados hover, foco y error de los controles no aparecen en la exportación; la
  verificación final se hace con axe y revisión visual al implementar. La excepción de contraste
  del panel de marca vence el 2027-01-19 (R10).

## R7. Pruebas y controles

- **Decision**: Vitest + RTL para dominio, gateway, rutas e interacciones observables; pruebas
  axe para los estados de registro y login con el aviso de éxito; comandos existentes
  `lint`, `format`, `typecheck`, `test:coverage`, `build`, `audit:deps`, `audit:licenses` y
  `scan:secrets`.
- **Rationale**: conserva la infraestructura del login y sus umbrales; pruebas de integración
  aseguran que la nueva cuenta es autenticable sin recarga.
- **Acceptance mapping**: nombrar pruebas con US/FR de la especificación; comprobar duplicados
  con mayúsculas/espacios, los límites de longitud, reenvío, error de configuración y pérdida
  al recargar.
- **Impacto en pruebas de 001**: `App.test.tsx` necesita `MemoryRouter`; US5-1 y FR-014 de
  `LoginForm.test.tsx` cambian porque "Regístrate" pasa de botón con aviso a enlace. Se añaden
  los helpers `renderWithRouter` y `registerStub` en `src/test/`. Las pruebas `C1`–`C6` del
  gateway no cambian.
- **Prefijo `REG`**: los IDs `US*`/`FR-*` de 002 coinciden con los de 001; las pruebas nuevas
  usan el prefijo `REG` para no confundirlas (matriz en plan.md).

## R8. Reutilización y adaptación de componentes

- **Decision**: reutilizar los componentes de 001 con cambios compatibles y justificados:
  - `Checkbox`: hoy no admite error; añadir `error` opcional con `aria-invalid` y
    `aria-describedby` (FR-006 para los términos).
  - `PasswordField`: el botón de visibilidad fija `Mostrar/Ocultar contraseña`; con dos campos
    habría dos botones con el mismo nombre. Añadir un sustantivo configurable (por defecto
    "contraseña", sin cambiar el login) y usar "confirmación de contraseña" en el segundo.
  - `BrandPanel` y el layout (`LoginScreen`): contenido configurable; el login conserva su
    cabecera con logo en móvil y el registro la omite por completo, según el taller.
  - `TextLink` (nuevo): enlace con la apariencia de la variante `link` de `Button`. Un `Button`
    no debe usarse para navegar (rol `link`).
- **Rationale**: Constitución 8.5 y DRY; el cambio de `PasswordField` y `Checkbox` es aditivo y
  mantiene sus pruebas actuales.
- **Recursos**: el `BrandPanel` de 001 se construye con CSS y `logo-mark.svg` versionado; se
  reutiliza en lugar de importar los PNG de `Docs/` (ignorada por Git). Si la fidelidad exigiera
  PNG, copiarlos a `src/ui/assets/` con aprobación.
- **Alternatives considered**: duplicar componentes para registro (viola 8.5 y DRY).

## R9. Diferencias frente a 001 y su justificación

| Aspecto | 001 login | 002 registro | Justificación |
|---|---|---|---|
| Alcance | 1 pantalla, 2 vistas | 3 rutas + vista no encontrada | El taller pide `/login` y `/registro` |
| Router | Descartado (IV, YAGNI) | React Router condicional | Navegar sin recargar conserva la colección en memoria; 001 no lo necesitaba |
| Puertos | `AuthGateway` | `AuthGateway` intacto + `RegistrationGateway` | Contrato de 001 y ISP; una sola clase comparte la colección |
| Cuentas | Lista de solo lectura | Colección mutable en memoria | Las altas deben poder autenticarse hasta recargar |
| Latencia | 1 s simulada | Misma opción `delayMs` | Estado de carga y US1-5 observables |
| Diseño | Tokens por `get_variable_defs` y `get_design_context` | Solo la exportación PNG; tipografía y controles pendientes | El MCP no pudo inspeccionar el nodo `31:2` |
| Contraste | R3 midió los tokens | Se reutilizan los tokens accesibles; no se remide hasta tener colores nuevos | Evita re-trabajo; pendiente de revisión |
| Responsive | Móvil con cabecera de logo (R10) | Móvil "solo formulario" (taller); breakpoint 960 px de 001 como supuesto | Diferencia por requisito; el móvil no está verificado |
| Recursos | SVG de Figma en `src/assets` | Reutiliza `BrandPanel` en CSS; PNG de `Docs/` solo de referencia | `Docs/` está ignorada |
| Controles | Sin errores en checkbox | `Checkbox` con error; toggles de visibilidad con nombres distintos | FR-006 y WCAG |
| Diagnóstico | Excepciones capturadas sin reporte | Reporter inyectado | 5.5 y 8.7 |
| Node | "20 LTS o superior" | `^20.19.0 \|\| >=22.12.0`; el taller dice 18+ | Requisito real de Vite 8 |
| Quickstart | Comandos bash (`cp`) | Comandos PowerShell (`Copy-Item`) | Entorno del equipo; equivalentes |
| Git y revisión | Directorio sin git (acción previa) | Repositorio y rama activos | Condición ya resuelta |

## R10. Contraste del panel de marca: opciones y razones calculadas

**Método (2026-10-19)**: razones WCAG calculadas sobre `Docs/Prototipos/Brand Panel.png`, que es
solo el fondo (620 × 1024, sin texto), en las zonas del titular (x 57–455, y 405–500) y del texto
de apoyo (x 56–496, y 515–560), tomando el peor píxel. Umbrales: 3:1 para el titular de 44 px en
negrita (texto grande) y 4,5:1 para el texto de apoyo de 17 px. El texto de apoyo usa blanco al
85 % (`--on-brand-muted`). Estas cifras sustituyen las aproximadas de R6, que se midieron sobre
el frame completo. El logotipo está exento (1.4.3) y el texto de la tarjeta (2,02:1) es una
ilustración `aria-hidden`, que se trata como decoración; ambas interpretaciones necesitan el
visto bueno del revisor de accesibilidad.

| Opción | Cambio | Titular (≥3) | Apoyo (≥4,5) | Aspecto resultante |
|---|---|---|---|---|
| 0. Base actual | Ninguno | 2,30:1 ❌ | 2,04:1 ❌ | El actual |
| A1. Degradado más oscuro | Luminosidad ×0,54, misma tonalidad | 5,71:1 ✅ | 4,50:1 ✅ | Extremos `#C12E00` y `#8A270B`: otro aspecto de marca |
| A2. Degradado oscuro y apoyo al 100 % | Luminosidad ×0,63 | 4,50:1 ✅ | 4,50:1 ✅ | Extremos `#DE3500` y `#9F2D0C` |
| A3. Degradado algo más oscuro y apoyo como texto grande | Luminosidad ×0,70; apoyo ≥18,66 px en negrita o ≥24 px | 3,69:1 ✅ | 3,00:1 ✅ | Extremos `#F93C00` y `#B2320E`; cambia la tipografía del apoyo |
| B1. Capa oscura `#16182C` | Opacidad 0,45 | 5,52:1 ✅ | 4,50:1 ✅ | Extremos `#97574C` y `#8E3828`: marrón apagado |
| B2. Capa oscura y apoyo al 100 % | Opacidad 0,35 | 4,50:1 ✅ | 4,50:1 ✅ | Extremos `#AD6251` y `#A23D27` |
| C. Texto oscuro | Titular y apoyo en `#16182C` (`--neutral-900`) | 5,51:1 ✅ | 5,51:1 ✅ | Degradado y tarjeta intactos |
| D. Excepción temporal (9.1) | Ninguno | 2,30:1 ❌ | 2,04:1 ❌ | El actual; exige aprobación y fecha de vencimiento |

Notas:

- Para el titular bastaría una capa de opacidad 0,15 (3:1), pero el texto de apoyo es el que
  obliga a oscurecer más.
- Con el degradado CSS de 001 en lugar del PNG las razones base son 2,70:1 (titular) y 2,40:1
  (apoyo) y varían poco entre tamaños de ventana (2,64–2,71 y 2,37–2,44). Los parámetros
  calculados sobre el PNG también cumplen con el CSS, porque el PNG es más claro bajo el texto.
- **Hallazgo aparte (fidelidad, SC-005)**: el degradado CSS de 001
  (`121.19deg, #ff8a65 → #ef5226 al 70,71 %`) no coincide con la exportación. El CSS es claro
  arriba a la izquierda y oscuro abajo a la derecha; el PNG es claro a la izquierda y oscuro
  arriba a la derecha (esquina superior derecha `#F46339` en CSS frente a `#EE5125` en el PNG;
  inferior izquierda `#F46238` frente a `#FF8A65`). Conviene decidirlo junto con el contraste.
- La decisión afecta también al login, que comparte `BrandPanel`.
- Las pruebas con jsdom no calculan contraste sobre degradados ni axe lo evalúa: la verificación
  es una revisión manual con las razones de esta tabla.

**Decisión (2026-10-19): se mantiene el texto blanco del diseño original.** El usuario decidió que
el panel de marca siga el diseño de Figma, por lo que la opción C se descarta (era reversible: dos
reglas de `BrandPanel.module.css`). Como el blanco no alcanza AA (Constitución 8.4), el
incumplimiento se registra como **excepción temporal** conforme a 9.1, que exige que sea
documentada, aprobada y con fecha de vencimiento:

- **Alcance**: solo el titular de 44 px (2,70:1 sobre el degradado publicado, 2,30:1 sobre la
  exportación; mínimo 3:1) y el texto de apoyo de 17 px (2,40:1 y 2,04:1; mínimo 4,5:1) del panel
  de marca, en login y registro. El logotipo y la tarjeta están exentos.
- **Mitigaciones**: el texto del panel no es necesario para completar la tarea (el formulario, sus
  etiquetas, errores y controles sí cumplen AA); el registro oculta el panel en móvil; el panel
  no contiene controles ni información que no esté en otro lugar de la pantalla.
- **Aprobación**: aprobada el 2026-10-19 por el usuario, propietario del proyecto, al aprobar el
  diseño tal como está implementado (texto blanco, tokens accesibles de 001 y degradado
  publicado). Si el proyecto exige a otra persona como responsable de diseño o de arquitectura,
  debe ratificarla.
- **Vencimiento**: 2027-01-19 (90 días), la fecha propuesta que acompañó la aprobación. Al
  vencer, se debe resolver con la opción C o B, o renovar la excepción por escrito.

Alternativas si la excepción se revoca o vence sin renovarse: C (texto oscuro, 5,51:1) o B aplicada
solo a una capa detrás del bloque de texto, con opacidad entre 0,35 y 0,45. A cambia la identidad
de marca.
