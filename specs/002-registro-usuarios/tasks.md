---

description: "Task list for 002-registro-usuarios"
---

# Tasks: Registro de Usuarios de KynWallet

**Input**: Design documents from `/specs/002-registro-usuarios/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/registration-gateway.md,
contracts/ui-registration.md, quickstart.md

**Tests**: OBLIGATORIAS. La Constitución (Principio I, TDD) exige escribir las pruebas antes del
código y verlas fallar. Cada historia empieza por sus pruebas.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US3)
- Rutas relativas a la raíz del repositorio. Las pruebas viven junto al código (`*.test.ts(x)`).
- Trazabilidad (Constitución 9.2): los IDs de esta spec coinciden con los de 001, así que cada
  `it(...)` nuevo DEBE empezar con el prefijo `REG` y el ID del escenario o requisito, p. ej.
  `it('REG US2-5: rechaza un correo duplicado…')` o `it('REG FR-007: …')`.
- Entorno: si `npm` falla con `SELF_SIGNED_CERT_IN_CHAIN`, usar `NODE_OPTIONS=--use-system-ca`
  (no desactivar `strict-ssl`). Usar Node `^20.19.0 || >=22.12.0`.
- No modificar `.env.example`, `.gitignore` ni `Docs/`. No importar archivos de `Docs/` en `src/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencia de rutas, versión de Node y regla de lint para el diagnóstico

- [X] T001 Alinear `engines.node` con Vite 8 en `package.json`: cambiar `">=20"` por `"^20.19.0 || >=22.12.0"` (research.md R1)
- [X] T002 Instalar el router con `npm install react-router@^7.18.4` y comprobar en `package.json` que la dependencia queda como `^7.18.4` (nunca `^8`) y en `package-lock.json` que se resuelve `react-router@7.18.4` con `cookie` y `set-cookie-parser` (todas MIT); ejecutar `npm run audit:deps` (esperado: 0 vulnerabilidades altas o críticas) y `npm run audit:licenses` (esperado: sin incumplimientos). Si falla un control, detenerse: no continuar sin mitigación aprobada (Constitución 7; research.md R3)
- [X] T003 [P] Añadir en `eslint.config.js` un override para `files: ['src/infrastructure/consoleDiagnostics.ts']` que desactive solo `no-console`, con un comentario que cite Constitución 5.5 y 8.7; `no-console: error` debe seguir activo en el resto del código (plan.md, Complexity Tracking)

**Checkpoint**: `npm run lint`, `npm run typecheck` y `npm test` terminan sin errores

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Dominio, puertos, gateway compartido, componentes ajustados y esqueleto de rutas que todas las historias usan

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests for Foundational ⚠️ (escribirlos primero y verlos fallar)

- [X] T004 [P] Pruebas del nombre en `src/domain/validation.test.ts`: `normalizeDisplayName` recorta espacios periféricos; `isValidDisplayName` acepta 1–80 caracteres tras recortar y rechaza vacío o de solo espacios y 81 caracteres (`REG FR-002`; data-model.md `displayName`: "Obligatorio, trim y 1–80 caracteres")
- [X] T005 [P] Pruebas de `validateRegistration` en `src/domain/registrationValidation.test.ts` según data-model.md: `email` "Obligatorio, formato válido, máximo 254 caracteres" (254 válido, 255 inválido); `password` "Obligatorio, 8–128 caracteres" sin recortar (7 y 129 inválidos, 8 y 128 válidos, espacios cuentan); `confirmPassword` "Obligatorio; coincidencia exacta con `password`"; `acceptedTerms` "Debe ser `true`"; devuelve `{}` si todo es válido; el orden de las claves de error es `displayName`, `email`, `password`, `confirmPassword`, `acceptedTerms`; mensajes de `MESSAGES` (`REG FR-002`, `FR-003`, `FR-004`, `FR-005`, `US2-1`, `US2-2`, `US2-3`, `US2-4`)
- [X] T006 [P] Pruebas del caso de uso en `src/application/registerAccount.test.ts` con un gateway falso: normaliza (nombre recortado, correo con `normalizeEmail`) y entrega al gateway una `DemoAccount` sin `confirmPassword` ni `acceptedTerms`; devuelve `success`, `duplicate-email` y `unavailable` tal cual; entrada inválida → `{ kind: 'invalid', errors }` sin invocar al gateway (R10); si el gateway lanza → `{ kind: 'failure' }` y el reporter se llama una vez con un código fijo y sin contraseña ni valores del formulario (R9) (`REG FR-007`, `FR-014`, `FR-013`)
- [X] T007 [P] Ampliar `src/infrastructure/InMemoryAuthGateway.test.ts` con las pruebas de contrato R1–R8 de contracts/registration-gateway.md: R1 `register` correo nuevo → `success` y `authenticate` lo acepta; R2 duplicado con otra capitalización o espacios → `duplicate-email` y la cuenta original sigue autenticando; R3 dos `register` simultáneos del mismo correo → un `success` y un `duplicate-email`; R4 colección `null` → `unavailable` y `authenticate` sigue en `unavailable`; R5 las cuentas iniciales siguen autenticando tras varias altas; R6 el arreglo recibido no se muta; R7 ningún resultado serializado contiene la contraseña; R8 `register` no resuelve antes de `delayMs` (temporizadores falsos). Las pruebas `C1`–`C6` existentes no se tocan (`REG FR-007`, `FR-008`, `US1-2`, `US1-4`, `US2-5`)
- [X] T008 [P] Pruebas de `src/infrastructure/consoleDiagnostics.test.ts`: llama a `console.error` una sola vez con un objeto estructurado que contiene únicamente el código del evento; no incluye datos del formulario (`REG FR-013`, Constitución 8.7)
- [X] T009 [P] Ampliar `src/ui/components/Checkbox/Checkbox.test.tsx`: con `error` el input tiene `aria-invalid="true"` y `aria-describedby` apuntando al texto visible del error; sin `error` no los tiene; `label` acepta contenido React y el nombre accesible sigue siendo el texto completo; las pruebas actuales siguen en verde (`REG FR-006`)
- [X] T010 [P] Ampliar `src/ui/components/PasswordField/PasswordField.test.tsx`: con la propiedad nueva `visibilityLabel="confirmación de contraseña"` el botón se llama "Mostrar confirmación de contraseña" y "Ocultar confirmación de contraseña"; sin ella conserva "Mostrar contraseña" y "Ocultar contraseña" (`REG FR-012`)
- [X] T011 [P] Pruebas de `TextLink` en `src/ui/components/TextLink/TextLink.test.tsx` (dentro de `MemoryRouter`): tiene rol `link` con el `href` esperado; al activarlo navega sin recargar el documento; sin violaciones de `axe` (`REG FR-010`, `FR-012`)
- [X] T012 [P] Pruebas de `BrandPanel` en `src/ui/layout/BrandPanel/BrandPanel.test.tsx`: la variante de login muestra "Tu dinero, sin fronteras." y la de registro "Comienza tu camino financiero." con su texto de apoyo "Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar."; ambas muestran el logo y la tarjeta ilustrativa `aria-hidden` (`REG FR-015`)
- [X] T013 [P] Pruebas de `AuthScreen` en `src/ui/layout/AuthScreen/AuthScreen.test.tsx`: renderiza el panel de marca recibido y los hijos dentro de un `main`; la variante de registro no renderiza la cabecera de logo del login (`REG FR-011`)

### Implementation for Foundational

- [X] T014 Mover la regla del nombre al dominio en `src/domain/validation.ts`: exportar `DISPLAY_NAME_MAX_LENGTH = 80`, `normalizeDisplayName` e `isValidDisplayName`; actualizar `src/infrastructure/loadDemoAccounts.ts` para usarlos en lugar de su constante privada (fuente única, Constitución 4.1); `src/infrastructure/loadDemoAccounts.test.ts` debe seguir en verde sin cambios
- [X] T015 [P] Crear los tipos en `src/domain/registration.ts` según data-model.md: `RegistrationInput` (`displayName`, `email`, `password`, `confirmPassword`: `string`; `acceptedTerms`: `boolean`), `RegistrationFieldErrors` (`Partial<Record<'displayName' | 'email' | 'password' | 'confirmPassword' | 'acceptedTerms', string>>`), `AccountCreationResult` (`success` | `duplicate-email` | `unavailable`) y `RegistrationResult` (lo anterior más `invalid` con `errors: RegistrationFieldErrors` y `failure`); ningún resultado incluye contraseña
- [X] T016 [P] Añadir a `src/domain/messages.ts` los textos aprobados (fuente única): `NAME_REQUIRED: 'Ingresa tu nombre completo'`, `NAME_TOO_LONG: 'El nombre no puede superar 80 caracteres'`, `CONFIRM_REQUIRED: 'Confirma tu contraseña'`, `CONFIRM_MISMATCH: 'Las contraseñas no coinciden'`, `TERMS_REQUIRED: 'Debes aceptar los términos y condiciones'`, `EMAIL_TAKEN: 'Este correo ya está registrado'`, `REGISTER_UNAVAILABLE: 'Servicio de registro no disponible. Intenta más tarde.'`, `REGISTER_FAILED: 'No pudimos crear tu cuenta. Inténtalo de nuevo.'`, `REGISTER_SUCCESS: 'Cuenta creada. Ya puedes iniciar sesión.'`, `COMING_SOON: 'Próximamente'`, `NOT_FOUND_TITLE: 'Página no encontrada'`, `NOT_FOUND_LINK: 'Ir a iniciar sesión'`; no cambiar los existentes
- [X] T017 Implementar `validateRegistration` en `src/domain/registrationValidation.ts` (depende de T014–T016): reutiliza `normalizeEmail`, `isValidEmail` y `isValidPasswordLength`; la contraseña no se recorta; recorre los campos en el orden nombre, correo, contraseña, confirmación, términos; devuelve `RegistrationFieldErrors` con los mensajes de `MESSAGES`; hace pasar T004 y T005
- [X] T018 [P] Crear el puerto `src/application/ports/RegistrationGateway.ts` con `register(account: DemoAccount): Promise<AccountCreationResult>`; no modificar `src/application/ports/AuthGateway.ts` (contracts/registration-gateway.md)
- [X] T019 Implementar `createRegisterAccount(gateway, report)` en `src/application/registerAccount.ts` (depende de T015, T017, T018): exporta los tipos `RegisterAccount` y `ReportDiagnostic` (`(event: { code: string }) => void`); valida con `validateRegistration` (defensa en profundidad, 5.1), normaliza, delega en el puerto y traduce excepciones a `failure` llamando al reporter con un código fijo y sin el objeto de error; hace pasar T006
- [X] T020 Ampliar `src/infrastructure/InMemoryAuthGateway.ts` para implementar también `RegistrationGateway` (depende de T015, T018): copia superficial del arreglo inicial en el constructor sin clonar sus elementos (la prueba `C5` usa un getter que lanza) y `null` sigue siendo `unavailable`; `register` espera `delayMs`, y tras la espera comprueba el duplicado con `normalizeEmail` e inserta en una sola sección síncrona guardando el correo normalizado; hace pasar T007 sin romper `C1`–`C6`
- [X] T021 [P] Crear el adaptador `src/infrastructure/consoleDiagnostics.ts` (depende de T003, T019): función `ReportDiagnostic` que emite el evento con `console.error`; hace pasar T008
- [X] T022 [P] Crear los helpers de prueba en `src/test/`: `renderWithRouter.tsx` (envuelve en `MemoryRouter` con `initialEntries`), `registerStub.ts` (caso de uso falso con `defer()` y `release()`, igual que `authStub.ts`) y ampliar `fixtures.ts` con una entrada de registro válida distinta de `TEST_ACCOUNT` (cuenta ficticia, sin datos reales)
- [X] T023 [P] Implementar en `src/ui/components/Checkbox/Checkbox.tsx` y `Checkbox.module.css` la propiedad `error` opcional (`aria-invalid`, `aria-describedby`, texto de error con el estilo de `TextField`) y aceptar `label` como `ReactNode`; hace pasar T009 sin romper el login
- [X] T024 [P] Implementar en `src/ui/components/PasswordField/PasswordField.tsx` la propiedad `visibilityLabel` opcional (por defecto `'contraseña'`) para construir los nombres "Mostrar …"/"Ocultar …" del botón; hace pasar T010
- [X] T025 [P] Implementar `src/ui/components/TextLink/TextLink.tsx` y `TextLink.module.css` (depende de T002): enlace de `react-router` con la apariencia de la variante `link` de `Button` (`--brand-700`, foco con `--focus-ring`); hace pasar T011
- [X] T026 Hacer `src/ui/layout/BrandPanel/BrandPanel.tsx` configurable por variante (`login` | `registration`) con los textos de T012 (depende de T012) y mantener los colores blancos del diseño original en `BrandPanel.module.css` (la opción C de research.md R10 se aplicó y se revirtió el 2026-10-19 por decisión del usuario); hace pasar T012
- [X] T027 Generalizar `LoginScreen` en `src/ui/layout/AuthScreen/AuthScreen.tsx` y `AuthScreen.module.css` (mover con `git mv` desde `src/ui/features/login/LoginScreen.tsx` y `LoginScreen.module.css`; depende de T013, T026): recibe el panel de marca por props; el login conserva la cabecera de logo en móvil y el registro la omite por completo por debajo de 960 px; eliminar `LoginScreen` y actualizar sus importaciones; hace pasar T013
- [X] T028 Reescribir `src/App.test.tsx` (depende de T022; debe fallar): envolver los casos existentes con `renderWithRouter` y `registerStub`; añadir que `/` y `/login` muestran el mismo login con el encabezado "Bienvenido de nuevo" (`REG` alias de ruta, FR-015)
- [X] T029 Reestructurar `src/App.tsx` y `src/main.tsx` (depende de T020, T021, T027, T028): `App` recibe `authenticate` y `registerAccount` y declara `Routes` con `/` y `/login` apuntando al login existente; `main.tsx` crea una única instancia de `InMemoryAuthGateway`, la inyecta en `createAuthenticate` y `createRegisterAccount(gateway, consoleDiagnostics)` y monta `<BrowserRouter>` dentro de `StrictMode`; hace pasar T028 y mantiene en verde los tests del login

**Checkpoint**: el login funciona en `/` y `/login`, `npm run lint`, `npm run typecheck` y `npm test` están en verde y la base compartida está lista

---

## Phase 3: User Story 1 - Crear una cuenta de demostración (Priority: P1) 🎯 MVP

**Goal**: Registrar nombre, correo y contraseña, volver a `/login` con confirmación e iniciar sesión con la cuenta nueva hasta recargar

**Independent Test**: Completar el formulario con un correo nuevo, aceptar los términos, registrarse, ver la confirmación en `/login` e iniciar sesión con esas credenciales; recargar y comprobar que la cuenta ya no existe

### Tests for User Story 1 ⚠️

- [X] T030 [P] [US1] Pruebas del reducer en `src/ui/features/registration/registrationReducer.test.ts`: estado inicial; `change` actualiza un valor; un `submit` con datos válidos pasa a `submitting` y un segundo `submit` se ignora (`REG US1-5`); el resultado `success` se refleja en el estado
- [X] T031 [P] [US1] Pruebas de `src/ui/features/registration/RegistrationForm.test.tsx` con `registerStub`: muestra el `h1` "Crea tu cuenta", el subtítulo "Completa tus datos para comenzar", los campos "Nombre completo", "Correo electrónico", "Contraseña" y "Confirmar contraseña" con sus placeholders, el checkbox "Acepto los términos y condiciones" y el botón "Crear cuenta" (`REG FR-001`); los dos botones de visibilidad tienen nombres distintos; un envío válido llama una sola vez a `registerAccount` con los cinco valores, muestra "Creando cuenta…" con `aria-busy` y un segundo clic durante el envío no lo vuelve a llamar (`REG US1-5`, `FR-009`); al tener éxito invoca `onRegistered`; no escribe en `localStorage` ni `sessionStorage` y no cambia la URL (`REG FR-013`); sin violaciones de `axe`
- [X] T032 [P] [US1] Ampliar `src/ui/features/login/LoginForm.test.tsx`: con `registrationNotice` se muestra un `status` "Cuenta creada. Ya puedes iniciar sesión."; al enviar el formulario se llama a `onRegistrationNoticeDismiss` y el aviso desaparece; sin la propiedad no hay aviso; sin violaciones de `axe` con el aviso visible (`REG FR-009`)
- [X] T033 [P] [US1] Ampliar `src/App.test.tsx` con integración usando el gateway real (`delayMs: 0`), `createAuthenticate` y `createRegisterAccount`, empezando en `/registro`: registrar una cuenta nueva termina en el login con el aviso; iniciar sesión con ella muestra "Bienvenido, {nombre registrado}" (`REG US1-1`, `US1-2`, `SC-002`); la cuenta inicial sigue funcionando tras el registro (`REG US1-4`); con un gateway y render nuevos (equivale a recargar) la cuenta nueva da "Correo o contraseña incorrectos" y no hay aviso (`REG US1-3`, `FR-013`); el aviso desaparece al enviar el login y al navegar fuera de `/` y `/login`

### Implementation for User Story 1

- [X] T034 [US1] Crear `src/ui/features/registration/registrationReducer.ts` con el estado `editing | submitting | error`, valores, campos tocados, errores, aviso y las acciones `change`, `submit` y `result` para el flujo válido, siguiendo el patrón de `src/ui/features/login/loginReducer.ts`; hace pasar T030
- [X] T035 [US1] Crear `src/ui/features/registration/useRegistrationForm.ts` modelado sobre `useLoginForm.ts`: recibe `registerAccount`, evita envíos concurrentes con una referencia `inFlight`, ignora el resultado si el componente se desmontó y llama a `onRegistered` solo en `success` (depende de T034)
- [X] T036 [US1] Crear `src/ui/features/registration/RegistrationForm.tsx` y `RegistrationForm.module.css` con los cinco controles reutilizando `TextField`, `PasswordField` (el segundo con `visibilityLabel="confirmación de contraseña"`), `Checkbox` y `Button` ("Creando cuenta…" mientras carga); atributos `autoComplete` `name`, `username` y `new-password`; en el checkbox, "términos y condiciones" se resalta como texto no interactivo; hace pasar T031 (depende de T023, T024, T035)
- [X] T037 [US1] Crear `src/ui/features/registration/RegistrationScreen.tsx`: monta `AuthScreen` con el panel de marca de registro y `RegistrationForm`; recibe `registerAccount` y `onRegistered` (depende de T027, T036)
- [X] T038 [US1] Modificar `src/ui/features/login/LoginForm.tsx` para aceptar `registrationNotice` y `onRegistrationNoticeDismiss`: muestra `Alert` `tone="info"` con `MESSAGES.REGISTER_SUCCESS` encima del formulario y llama al callback al enviar; hace pasar T032
- [X] T039 [US1] Modificar `src/App.tsx` (depende de T037, T038): añadir la ruta `/registro`; guardar un indicador booleano `registrationNotice` en un estado en memoria de `App` (no en `location.state`: el navegador conserva `history.state` al recargar); `onRegistered` lo activa y navega a `/login`; el login recibe el aviso y el callback de cierre; limpiarlo con un efecto sobre `useLocation` cuando la ruta deja de ser `/` o `/login`, sin usar la limpieza de un efecto de montaje (`StrictMode` la ejecuta una vez en desarrollo y borraría el aviso); hace pasar T033

**Checkpoint**: US1 completa y verificable de forma independiente (quickstart escenarios 7–9 y 15)

---

## Phase 4: User Story 2 - Corregir datos y evitar registros duplicados (Priority: P1)

**Goal**: Mostrar los errores junto a cada control, conservar los datos al corregir y rechazar correos duplicados sin alterar cuentas existentes

**Independent Test**: Enviar datos vacíos, incorrectos y un correo existente; comprobar mensajes, corregir cada error y registrar una cuenta nueva sin perder los demás valores

### Tests for User Story 2 ⚠️

- [X] T040 [P] [US2] Ampliar `src/ui/features/registration/registrationReducer.test.ts`: `blur` marca el campo como tocado y muestra su error; un `submit` inválido marca todos los campos, muestra los errores, no pasa a `submitting` (`REG US2-1`, `FR-006`); `change` recalcula y retira el error de ese campo y conserva los demás valores (`REG US2-6`); cambiar la contraseña revalida la confirmación (caso límite); el resultado `duplicate-email` pone `MESSAGES.EMAIL_TAKEN` en el correo y vuelve a edición; `unavailable` y `failure` dejan un mensaje general; `invalid` muestra sus errores
- [X] T041 [P] [US2] Ampliar `src/ui/features/registration/RegistrationForm.test.tsx`: envío vacío → cinco errores asociados con `aria-describedby`, foco en "Nombre completo" y `registerAccount` sin llamar (`REG US2-1`, `FR-006`); correo inválido y contraseña de menos de 8 al salir del campo (`REG US2-2`, `FR-003`, `FR-004`); confirmación distinta (`REG US2-3`, `FR-005`); términos sin aceptar con el error asociado al checkbox (`REG US2-4`); nombre de 81 caracteres rechazado y texto pegado validado igual que el escrito (`REG FR-002`); duplicado → error "Este correo ya está registrado" junto al correo, foco en él y datos conservados (`REG US2-5`, `FR-007`); `unavailable` → `alert` "Servicio de registro no disponible. Intenta más tarde."; `failure` → `alert` "No pudimos crear tu cuenta. Inténtalo de nuevo." sin éxito ni navegación (`REG FR-014`); corregir un campo retira solo su error (`REG US2-6`); axe sin violaciones con errores visibles
- [X] T042 [P] [US2] Ampliar `src/App.test.tsx` con el gateway real: registrar el correo de una cuenta inicial con otra capitalización y espacios periféricos muestra el duplicado y esa cuenta sigue iniciando sesión con su contraseña (`REG US2-5`, `SC-003`); dos envíos válidos seguidos crean una sola cuenta (`REG US1-5`, `SC-003`)

### Implementation for User Story 2

- [X] T043 [US2] Ampliar `src/ui/features/registration/registrationReducer.ts` (depende de T040): campos tocados, errores visibles calculados con `validateRegistration`, revalidación de la confirmación al cambiar la contraseña, manejo de los resultados `duplicate-email`, `unavailable`, `failure` e `invalid`; los valores del formulario se conservan siempre que puedan corregirse
- [X] T044 [US2] Ampliar `src/ui/features/registration/useRegistrationForm.ts` (depende de T043): `blur`, `submit` que devuelve los errores para gestionar el foco (como `useLoginForm`) y no llama a `registerAccount` si hay errores
- [X] T045 [US2] Ampliar `src/ui/features/registration/RegistrationForm.tsx` (depende de T044): pasar `error` a cada control, referencias para enfocar el primer error en el orden nombre, correo, contraseña, confirmación y términos, enfocar el correo ante un duplicado y `Alert` `tone="error"` para `unavailable` y `failure`; hace pasar T041 y T042

**Checkpoint**: US1 y US2 funcionan; el registro valida y rechaza duplicados (quickstart escenarios 1–4)

---

## Phase 5: User Story 3 - Navegar y conocer las opciones disponibles (Priority: P2)

**Goal**: Volver al login, ir al registro desde el login, avisar que Google y Apple no están disponibles y mantener la pantalla accesible y responsiva

**Independent Test**: Activar el enlace al login y cada botón social; comprobar destino, aviso y conservación de datos; recorrer la pantalla con teclado y con axe

### Tests for User Story 3 ⚠️

- [X] T046 [P] [US3] Ampliar `src/ui/features/registration/RegistrationForm.test.tsx`: Google y Apple muestran un `status` "Próximamente", no llaman a `registerAccount` y conservan los valores (`REG US3-2`, `FR-010`); el enlace "¿Ya tienes cuenta? Inicia sesión" tiene rol `link` y apunta a `/login`; el orden de tabulación es nombre, correo, contraseña, su botón de visibilidad, confirmación, su botón, términos, "Crear cuenta", Google, Apple y el enlace (`REG US3-4`, `FR-012`)
- [X] T047 [P] [US3] Ampliar `src/ui/features/login/LoginForm.test.tsx` (modifica pruebas de 001): "Regístrate" deja la lista de botones con aviso de `US5-1`, pasa a ser un `link` hacia `/registro` y los demás elementos conservan su aviso; en el orden de tabulación de `FR-014` ocupa la misma posición como enlace (`REG FR-016`)
- [X] T048 [P] [US3] Pruebas de `src/ui/features/notFound/NotFoundScreen.test.tsx`: `h1` "Página no encontrada", enlace "Ir a iniciar sesión" hacia `/login`, no muestra el formulario de registro ni modifica cuentas; sin violaciones de `axe`
- [X] T049 [P] [US3] Pruebas del hook en `src/ui/layout/useRouteFocus.test.tsx`: tras un cambio de ruta mueve el foco al `h1` de la vista nueva y le añade `tabindex="-1"`; no roba el foco en la carga inicial (`REG FR-012`, `US3-4`)
- [X] T050 [P] [US3] Ampliar `src/App.test.tsx`: `/registro` muestra "Crea tu cuenta"; una ruta desconocida muestra "Página no encontrada" sin el formulario de registro; "¿Ya tienes cuenta? Inicia sesión" lleva a `/login` y "Regístrate" a `/registro`, sin recarga (`REG US3-1`, `FR-010`, `FR-016`); el foco queda en el `h1` tras navegar; axe sin violaciones en el registro, el registro con errores y el login con aviso (`REG SC-004`)

### Implementation for User Story 3

- [X] T051 [US3] Completar `src/ui/features/registration/RegistrationForm.tsx` con el `Divider` "o regístrate con", los `SocialButton` Google y Apple que llaman a `showNotice(MESSAGES.COMING_SOON)` mostrado como `Alert` `tone="info"`, y el pie "¿Ya tienes cuenta?" con `TextLink` "Inicia sesión" hacia `/login`; sin `window.alert`; hace pasar T046
- [X] T052 [US3] Modificar `src/ui/features/login/LoginForm.tsx`: sustituir el `Button` "Regístrate" por `TextLink` hacia `/registro`, conservando posición y apariencia, y retirar su uso de `notAvailable`; ajustar `LoginForm.module.css` si hace falta; hace pasar T047 (los demás elementos fuera de alcance de 001 mantienen su aviso)
- [X] T053 [US3] Crear `src/ui/features/notFound/NotFoundScreen.tsx` y su CSS con el `h1`, el enlace a `/login` y un `main`, y añadir en `src/App.tsx` la ruta `*`; hace pasar T048
- [X] T054 [US3] Crear `src/ui/layout/useRouteFocus.ts` (hace pasar T049): al cambiar `pathname`, no en la carga inicial, enfoca el primer `h1` dentro del `main` y le añade `tabindex="-1"`; usarlo en `App` (una sola instancia, para que no se reinicie al cambiar de vista); hace pasar T050. Añadido durante la implementación: `src/ui/layout/useDocumentTitle.ts` mantiene `document.title` acorde con la vista (WCAG 2.4.2), con prueba en `src/App.test.tsx`
- [X] T055 [US3] Completar el CSS responsivo de `src/ui/layout/AuthScreen/AuthScreen.module.css` y `BrandPanel.module.css` para el registro: dos paneles desde 960 px (620 px de marca desde 1280 px y 43 % entre 960 y 1280), solo el formulario por debajo de 960 px, sin scroll horizontal desde 320 px; el login conserva su cabecera de logo (FR-011, FR-015); verificación manual en el quickstart (escenario 10)

**Checkpoint**: Las tres historias son funcionales (quickstart escenarios 5, 6, 10–14 y 16)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentación, controles de cumplimiento y verificación final

- [X] T056 [P] Actualizar `README.md`: descripción y arquitectura con el registro, las rutas `/`, `/login`, `/registro` y la nota de que un alojamiento estático necesita reescribir las rutas a `index.html`; requisito de Node `^20.19.0 || >=22.12.0` en lugar de "20 LTS o superior"; quitar "registro" de "Fuera de alcance"; actualizar la nota de contraste del `BrandPanel` (excepción temporal con texto blanco). Corregir el mismo requisito de Node en `specs/001-login-billetera/quickstart.md` (Constitución 8.3)
- [X] T057 [P] Retirar de `src/ui/styles/tokens.css` el token `--on-brand-muted` si tras T026 ya no lo usa ningún archivo (comprobarlo con una búsqueda en `src/`); no eliminar `--on-brand-soft` si aún lo usa la tarjeta
- [X] T058 Comprobar la trazabilidad (Constitución 9.2): cada US1–US3 y FR-001–FR-016 de `spec.md` tiene al menos una prueba con el prefijo `REG` según la matriz de `plan.md` (Test Strategy y Traceability); añadir las pruebas que falten
- [X] T059 Ejecutar `npm run verify` (lint, formato, typecheck, cobertura ≥ 80 %, build, `audit:deps`, `audit:licenses` y `scan:secrets`) y corregir cualquier fallo; un control fallido bloquea la integración (Constitución 9.4)
- [X] T060 Ejecutar los 16 escenarios manuales de `quickstart.md`, incluidos 320 px sin scroll horizontal, solo teclado y axe en registro, registro con errores y login con aviso; medir a mano el contraste del titular y del texto de apoyo del panel de marca (con texto blanco: 2,70:1 y 2,40:1, excepción temporal, research.md R10)
- [X] T061 Obtener la aprobación del responsable de diseño o de arquitectura de la excepción temporal de contraste del panel de marca con texto blanco (Constitución 9.1: aprobación y fecha de vencimiento; propuesta 2027-01-19) y la confirmación (8.6) de la desviación heredada de 001 (`--brand-700`, `--neutral-600`, `--neutral-border`), y decidir si se ajusta el degradado CSS, que no coincide con la exportación (research.md R10)
- [X] T062 Revisar `git status` y `git diff` antes de integrar: sin credenciales, sin `.env.local`, sin cambios en `.env.example`, `.gitignore` ni `Docs/`, y sin importaciones desde `Docs/` en `src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias; T002 espera a T001 porque ambos editan `package.json`
- **Foundational (Phase 2)**: depende de Setup; bloquea todas las historias
- **User Stories (Phase 3–5)**: dependen de Foundational. US2 amplía el formulario de US1 y US3 completa ese mismo formulario, por lo que se implementan en orden P1 → P1 → P2; los cambios de US3 en el login y la pantalla de ruta no encontrada son independientes
- **Polish (Phase 6)**: depende de las historias completadas

### Within Each User Story

- Las pruebas se escriben primero y DEBEN fallar (rojo) antes de la implementación (verde) y la refactorización
- Reducer → hook → componente → pantalla → integración en `App`
- Cada historia termina con su checkpoint antes de pasar a la siguiente

### Parallel Opportunities

- Setup: T003 en paralelo con T001/T002
- Foundational: pruebas T004–T013 en paralelo; T015, T016, T018, T021, T022, T023, T024 y T025 en paralelo (archivos distintos)
- US1: pruebas T030–T033 en paralelo
- US2: pruebas T040–T042 en paralelo
- US3: pruebas T046–T050 en paralelo
- Polish: T056 y T057 en paralelo

---

## Parallel Example: Foundational

```bash
# Pruebas en paralelo (archivos distintos):
Task: "T004 Pruebas del nombre en src/domain/validation.test.ts"
Task: "T005 Pruebas de validateRegistration en src/domain/registrationValidation.test.ts"
Task: "T006 Pruebas del caso de uso en src/application/registerAccount.test.ts"
Task: "T007 Pruebas de contrato en src/infrastructure/InMemoryAuthGateway.test.ts"
Task: "T009 Pruebas de Checkbox en src/ui/components/Checkbox/Checkbox.test.tsx"
Task: "T011 Pruebas de TextLink en src/ui/components/TextLink/TextLink.test.tsx"

# Implementaciones independientes:
Task: "T015 Tipos en src/domain/registration.ts"
Task: "T016 Mensajes en src/domain/messages.ts"
Task: "T018 Puerto en src/application/ports/RegistrationGateway.ts"
Task: "T023 Checkbox con error en src/ui/components/Checkbox/Checkbox.tsx"
Task: "T024 PasswordField con visibilityLabel en src/ui/components/PasswordField/PasswordField.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup) y Phase 2 (Foundational)
2. Completar Phase 3 (US1)
3. **DETENERSE Y VALIDAR**: quickstart escenarios 7–9 y 15
4. Demostrar el MVP: registrar una cuenta e iniciar sesión con ella hasta recargar

### Incremental Delivery

1. Setup + Foundational → base compartida lista (gateway, rutas, componentes ajustados)
2. US1 → alta e inicio de sesión con la cuenta nueva (MVP)
3. US2 → validación, errores junto a cada control y duplicados
4. US3 → navegación, avisos de Google y Apple, foco en SPA y diseño responsivo
5. Polish → `npm run verify` en verde, escenarios manuales y confirmación de diseño antes de integrar (Constitución 9.3)

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes
- La etiqueta [USn] y el prefijo `REG` con el ID del escenario dan la trazabilidad requisito → prueba (9.2)
- Hacer commit al cerrar cada tarea o grupo lógico, referenciando el ID de la tarea
- Decisiones abiertas que pueden cambiar tareas: (a) si no se aprueba la excepción de contraste del panel de marca, cambian T026 y T060 (alternativas: opción C con texto `#16182C`, o capa oscura con opacidad entre 0,35 y 0,45, research.md R10); (b) si se decide ajustar el degradado CSS a la exportación, se añade una tarea en `BrandPanel.module.css` y `tokens.css`; (c) si la auditoría de T002 falla, cambia la elección del router antes de continuar
- Pendientes de diseño sin tarea de código: familia, pesos y estados de los controles, y el diseño móvil (sin frame)

## Resultados de la implementación (2026-10-19)

- **T059**: `lint`, `typecheck`, `test:coverage` (245 pruebas, 98,35 % de sentencias), `build`, `audit:deps` (0 vulnerabilidades), `audit:licenses` y `scan:secrets` pasan. `npm run format` falla en este equipo solo por 7 archivos de la raíz con saltos de línea CRLF de la copia de trabajo de Windows (`autocrlf=true`), incluidos archivos no modificados como `.prettierrc.json`, `index.html` y `tsconfig.json`; con `--end-of-line auto` pasa. Es un problema de entorno preexistente. Se subió `testTimeout` de Vitest a 20 s en `vite.config.ts` porque jsdom arranca lento y una prueba de 001 agotaba los 5 s por defecto.
- **T060**: los escenarios 1–9 y 11–14 y 16 del quickstart se recorrieron en el navegador (Chromium integrado); el 15 (envío doble) y el orden de tabulación y axe (escenario 10) se cubren con pruebas automatizadas; a 320 px no hay scroll horizontal. Contraste del panel de marca con texto blanco sobre el degradado CSS publicado: 2,70:1 (titular) y 2,40:1 (apoyo), registrado como excepción temporal (9.1). La opción C se aplicó y se revirtió el 2026-10-19 por decisión del usuario; `--on-brand-muted` se conserva porque el apoyo vuelve a usarlo (T057 queda sin efecto).
- **T061**: aprobada el 2026-10-19 por el usuario, propietario del proyecto, al aprobar el diseño tal como está implementado: excepción temporal de contraste del panel de marca (vence el 2027-01-19), desviación de contraste heredada de 001 y degradado CSS publicado (se mantiene).
