---

description: "Task list for 002-registro-billetera"
---

# Tasks: Pantalla de Registro de KynWallet

**Input**: Design documents from `/specs/002-registro-billetera/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-register.md,
contracts/registration-gateway.md, quickstart.md

**Tests**: OBLIGATORIAS. La Constitución (Principio I, TDD) exige escribir las pruebas antes del
código y verlas fallar. Cada historia empieza por sus pruebas.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Rutas relativas a la raíz del repositorio. Las pruebas viven junto al código (`*.test.ts(x)`).
- Trazabilidad (Constitución 9.2): cada `it(...)` DEBE empezar con el ID del escenario o
  requisito que verifica, p. ej. `it('US2-4: muestra "Las contraseñas no coinciden"…')`.
- Esta funcionalidad **extiende 001**: se reutilizan sus componentes, tokens y herramientas.
  No se instalan dependencias nuevas.

---

## Phase 1: Setup

**Purpose**: Confirmar la base de 001 antes de tocarla

- [X] T001 Verificar que existen `.env.local` (copiado de `.env.example`, con al menos una cuenta ficticia en `VITE_DEMO_USERS`) y que la rama actual es `feature/registro-julio-oria`; ejecutar `npm run verify` y confirmar que termina sin errores (línea base antes de modificar 001)

**Checkpoint**: la línea base de 001 está en verde

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Dominio, tokens y componentes compartidos que todas las historias usan

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Añadir los tipos del registro en `src/domain/auth.ts` según data-model.md: `RegistrationData = { name: string; email: string; password: string }` y `RegistrationResult` = `{ kind: 'success'; displayName: string } | { kind: 'email-taken' } | { kind: 'unavailable' }`. No modificar los tipos existentes
- [X] T003 [P] Añadir a `src/domain/messages.ts` (fuente única, Principio IV) los textos nuevos, sin tocar los existentes: `NAME_REQUIRED: 'Ingresa tu nombre completo'`, `NAME_TOO_LONG: 'El nombre no puede superar 100 caracteres'`, `PASSWORD_CREATE_REQUIRED: 'Crea una contraseña'`, `CONFIRM_REQUIRED: 'Confirma tu contraseña'`, `PASSWORD_MISMATCH: 'Las contraseñas no coinciden'`, `TERMS_REQUIRED: 'Debes aceptar los términos y condiciones'`, `EMAIL_TAKEN: 'Ya existe una cuenta con este correo'`, `REGISTER_UNAVAILABLE: 'Servicio de registro no disponible. Intenta más tarde.'` Además, `COMING_SOON: 'Próximamente'` (texto del `alert` de Google y Apple, requisito 4 del taller) y `REGISTER_SUCCESS: (name: string) => `¡Cuenta creada, ${name}! Ahora puedes iniciar sesión.``
- [X] T004 [P] Añadir el token `--brand-gradient-register: linear-gradient(70.73deg, #ff8a65 31.698%, #ef5226 83.455%)` en `src/ui/styles/tokens.css` (research.md R5; ángulo y paradas leídos del archivo de Figma con `get_design_context`), sin modificar los tokens existentes
- [X] T005 [P] Añadir a `src/test/fixtures.ts` los datos de prueba del registro, ficticios: `REGISTRATION_DATA = { name: 'Diego Martínez', email: 'diego.martinez@example.test', password: 'fixture-pass-02' }`; el correo NO debe coincidir con `TEST_ACCOUNT.email`
- [X] T006 Escribir las pruebas (que deben fallar) de `validateRegistration` en `src/domain/validation.test.ts`, una por regla de data-model.md, nombradas por requisito: `FR-004` nombre vacío tras recortar → `NAME_REQUIRED`; nombre de > 100 caracteres → `NAME_TOO_LONG` y de exactamente 100 → válido; `FR-005` correo vacío → `EMAIL_REQUIRED`, formato inválido o > 254 → `EMAIL_INVALID`; `FR-006` contraseña vacía → `PASSWORD_CREATE_REQUIRED`, < 8 → `PASSWORD_TOO_SHORT`, > 128 → `PASSWORD_TOO_LONG`, y una contraseña de 7 caracteres + espacios cuenta los espacios (no se recorta); `FR-007` confirmación vacía → `CONFIRM_REQUIRED`, distinta de la contraseña → `PASSWORD_MISMATCH` (comparación exacta, sin recortar); `FR-008` términos no aceptados → `TERMS_REQUIRED`; datos totalmente válidos → `{}`; el resultado usa las claves `name`, `email`, `password`, `confirmPassword` y `terms`
- [X] T007 Implementar en `src/domain/validation.ts` hasta pasar T006: exportar los validadores de correo y contraseña ya existentes (`validateEmail`, `validatePassword`) y reutilizarlos (research.md R2, sin duplicar reglas); añadir `NAME_MAX_LENGTH = 100`, el tipo `RegistrationFormValues` (`RegistrationData` + `confirmPassword: string` + `acceptedTerms: boolean`), el tipo `RegistrationErrors` y `validateRegistration(values)`. La contraseña vacía en el registro devuelve `PASSWORD_CREATE_REQUIRED` en lugar de `PASSWORD_REQUIRED`. Las pruebas existentes de `validateCredentials` deben seguir pasando
- [X] T008 [P] Escribir las pruebas (que deben fallar) de `Checkbox` ampliado en `src/ui/components/Checkbox/Checkbox.test.tsx`, conservando la prueba existente: `FR-008` la etiqueta acepta contenido (`ReactNode`) con un botón-enlace dentro y el nombre accesible de la casilla incluye ese texto; con `error` se muestra el mensaje, la casilla tiene `aria-invalid="true"` y `aria-describedby` apunta al mensaje; sin `error` no hay `aria-invalid`; acepta un `ref`; sin violaciones de `axe` con y sin error
- [X] T009 Ampliar `src/ui/components/Checkbox/Checkbox.tsx` y `Checkbox.module.css` hasta pasar T008: `label: ReactNode`, `error?: string`, `ref?: Ref<HTMLInputElement>`; mensaje de error con estilo igual al de `TextField` (`var(--danger-600)`). El comportamiento actual de "Recordarme" no cambia
- [X] T010 [P] Escribir las pruebas (que deben fallar) de `BrandPanel` parametrizado en `src/ui/layout/BrandPanel/BrandPanel.test.tsx`: sin props muestra el titular y subtexto del login actuales ("Tu dinero, sin fronteras." y su subtexto); con props `title`, `subtitle` y `tone="register"` muestra "Comienza tu camino financiero." y "Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar."; el logo "KynWallet" y la tarjeta "Kyn Card" aparecen en ambos casos y la tarjeta está oculta a tecnologías de asistencia; con `tone="register"` el logo se compone de los dos puntos del diseño de registro (research.md R8) y con `login` conserva `logo-mark.svg`
- [X] T011 Parametrizar `src/ui/layout/BrandPanel/BrandPanel.tsx` y `BrandPanel.module.css` hasta pasar T010: props opcionales `title` (con salto de línea), `subtitle` y `tone: 'login' | 'register'` (por defecto `login`); el tono `register` usa `var(--brand-gradient-register)` y el `login` conserva `var(--brand-gradient)`. Para el tono `register`, descargar con `curl -L` a `src/ui/assets/` los dos SVG del logo del diseño de registro con `get_design_context` sobre el nodo `31:2` del archivo `22iIXNQrWthcJ3wTDGNkn8` (`logo-dot.svg`, 10×28, y `logo-dot-2.svg`, 14×14; el segundo se superpone en x=+4, y=+12 sobre el primero) y colocar el texto "KynWallet" en x=+22, y=+6 respecto al primer punto; comprobar si `eye.svg` y `social-placeholder.svg` del login coinciden con los del diseño de registro y reutilizarlos si es así. El panel de login no debe cambiar visualmente (OCP, Constitución 2.2) Con `tone="register"`, el panel se oculta por completo por debajo de 960 px (`display: none` en el CSS): en móvil solo se muestra el formulario (requisito 8 del taller, research.md R6); con `login` conserva la franja con el logo de 001
- [X] T012 Mover `src/ui/features/login/LoginScreen.tsx` y `LoginScreen.module.css` a `src/ui/layout/AuthScreen/AuthScreen.tsx` y `AuthScreen.module.css` (renombrar a `AuthScreen`; acepta las props de `BrandPanel` y las pasa al panel); actualizar el import en `src/App.tsx`. Es un refactor sin cambio de comportamiento: `npm test` debe seguir en verde sin modificar las pruebas del login

**Checkpoint**: `npm run lint`, `npm run typecheck` y `npm test` en verde; el login se ve y funciona igual que antes

---

## Phase 3: User Story 1 — Crear una cuenta con datos válidos (Priority: P1) 🎯 MVP

**Goal**: completar el formulario con datos válidos y que la aplicación avise del éxito para redirigir a `/login` con un mensaje.

**Independent Test**: renderizar `RegisterForm` con un caso de uso falso, completar los campos válidos, marcar los términos, presionar "Crear cuenta" y verificar el estado de carga y luego la llamada a `onRegistered` con el nombre (US1-1, US1-2); el mensaje de éxito en el login se verifica con T017.

### Tests for User Story 1 ⚠️ (escribir primero y verlos fallar)

- [X] T013 [P] [US1] Escribir las pruebas de `createRegister` en `src/application/register.test.ts` (contracts/registration-gateway.md): `U1` delega en el gateway con el correo normalizado (`' Diego@Example.test '` → `'diego@example.test'`), el nombre recortado y la contraseña sin modificar; `U2` si el gateway lanza una excepción devuelve `{ kind: 'unavailable' }`
- [X] T014 [P] [US1] Escribir las pruebas de `InMemoryRegistrationGateway` en `src/infrastructure/InMemoryRegistrationGateway.test.ts` con `delayMs: 0` salvo la de tiempo: `C1` correo no presente en las cuentas (con mayúsculas y espacios) → `{ kind: 'success', displayName: <nombre> }`; `C3` cuentas `null` → `unavailable`; `C4` excepción interna (cuenta con getter que lanza) → `unavailable` sin rechazar la promesa; `C5` el resultado no contiene la contraseña (`JSON.stringify`); `C6` una segunda llamada con el mismo correo vuelve a devolver `success` (no se persiste); `FR-012` espera 1000 ms por defecto (`vi.useFakeTimers`: a 999 ms no resuelve, a 1000 sí)
- [X] T015 [P] [US1] Escribir las pruebas del reducer en `src/ui/features/register/registerReducer.test.ts` (data-model.md, tabla de transiciones): estado inicial `editing` con valores vacíos y `acceptedTerms: false`; `change` actualiza el campo; `submit` con datos válidos → `submitting`; `submit` estando en `submitting` se ignora (`FR-012`); `result: success` → `success` con `createdName`; `logout`/descartar no aplica en esta historia
- [X] T016 [P] [US1] Escribir las pruebas de componente de `RegisterForm` en `src/ui/features/register/RegisterForm.test.tsx` con un `Register` falso que resuelve `success` y un espía `onRegistered`: `US1-1` al completar nombre, correo, contraseña, confirmación y términos y presionar "Crear cuenta" se llama a `onRegistered` una vez con el nombre ("Diego Martínez"); `US1-2` durante el envío el botón "Crear cuenta" queda deshabilitado con `aria-busy` y muestra "Creando cuenta…", y presionarlo de nuevo no llama al caso de uso por segunda vez; `US1-3` el caso de uso recibe el correo tal como se escribió (la normalización es del caso de uso) y el nombre sin los espacios periféricos; `US1-4` presionar Enter en el campo de confirmación envía el formulario; `UI-1` la estructura cumple contracts/ui-register.md (textos, roles, orden y atributos `autoComplete`)
- [X] T017 [P] [US1] Escribir las pruebas del mensaje de éxito del login: en `src/ui/components/Alert/Alert.test.tsx`, `Alert` con `tone="success"` usa el rol `status` y no tiene violaciones de `axe`; en `src/ui/features/login/LoginForm.test.tsx`, `UI-8`/`FR-013` con la prop `successMessage="¡Cuenta creada, Diego! Ahora puedes iniciar sesión."` el login muestra ese mensaje en un `Alert` de éxito; el mensaje desaparece al escribir en un campo y al enviar el formulario (llamando a `onDismissSuccess`); sin la prop no se muestra nada; sin violaciones de `axe` con el mensaje visible

### Implementation for User Story 1

- [X] T018 [P] [US1] Crear el puerto `src/application/ports/RegistrationGateway.ts` con `register(data: RegistrationData): Promise<RegistrationResult>` (contracts/registration-gateway.md)
- [X] T019 [US1] Implementar `src/application/register.ts` hasta pasar T013: `export type Register = (data: RegistrationData) => Promise<RegistrationResult>` y `createRegister(gateway)` que normaliza el correo con `normalizeEmail`, recorta el nombre, delega en el gateway y devuelve `{ kind: 'unavailable' }` si hay excepción (FR-023)
- [X] T020 [US1] Implementar `src/infrastructure/InMemoryRegistrationGateway.ts` hasta pasar T014: recibe `DemoAccount[] | null` y `{ delayMs }` (1000 por defecto); espera `delayMs`; con cuentas `null` → `unavailable`; si el correo no está en las cuentas → `success` con `displayName` igual al nombre; envuelve todo en `try/catch` → `unavailable`; no agrega la cuenta; el resultado nunca incluye la contraseña (FR-011, FR-016)
- [X] T021 [US1] Implementar `src/ui/features/register/registerReducer.ts` hasta pasar T015, siguiendo el estado de data-model.md (`status`, `values`, `touched`, `fieldErrors`, `serviceError`, `createdName`, `notice`): en esta historia cubre `change`, `submit` (valida con `validateRegistration`; si hay errores queda en `editing`, si no pasa a `submitting`) y `result: success`
- [X] T022 [US1] Implementar `src/ui/features/register/useRegisterForm.ts` (patrón de `useLoginForm`): `useReducer` con `registerReducer`, guarda `inFlight` para impedir envíos dobles y `mounted` para no despachar tras desmontar; `submit()` devuelve los errores para que la vista gestione el foco; recibe el caso de uso `Register`; recibe además el callback `onRegistered(name: string)` y lo invoca una sola vez cuando el resultado es `success` (si el componente sigue montado)
- [X] T023 [P] [US1] Implementar el mensaje de éxito hasta pasar T017: añadir el tono `success` a `src/ui/components/Alert/Alert.tsx` (rol `status`, color de éxito con contraste ≥ 4.5:1: `--success-700` y fondo `--success-50` en `tokens.css` y `Alert.module.css`) y las props opcionales `successMessage?: string` y `onDismissSuccess?: () => void` en `src/ui/features/login/LoginForm.tsx` (se muestra sobre el botón; se invoca `onDismissSuccess` al cambiar un campo y al enviar). `onRegister` se añade en T042
- [X] T024 [US1] Implementar `src/ui/features/register/RegisterForm.tsx` y `RegisterForm.module.css` hasta pasar T016, reutilizando `TextField`, `PasswordField`, `Checkbox`, `Button`, `Divider` y `SocialButton`: título "Crea tu cuenta" (30/36, 700, `var(--neutral-900)`), subtítulo "Completa tus datos para comenzar"; campos "Nombre completo" (`autoComplete="name"`, placeholder "Ej: Diego Martínez"), "Correo electrónico" (`type="email"`, `autoComplete="email"`, placeholder "tucorreo@ejemplo.com"), "Contraseña" y "Confirmar contraseña" (`autoComplete="new-password"`, placeholder "••••••••"); casilla "Acepto los términos y condiciones" con el texto "términos y condiciones" como `Button` de variante `link`; botón "Crear cuenta" con `loading` y `loadingLabel="Creando cuenta…"`; `Divider` "o regístrate con"; `SocialButton` Google y Apple; pie "¿Ya tienes cuenta?" + botón de enlace "Inicia sesión" (su acción se conecta en US5); props `register: Register`, `onRegistered: (name: string) => void` y `onLogin: () => void`; `<form noValidate>`; tras `success` invoca `onRegistered` y no renderiza vista de confirmación (el éxito se muestra en `/login`). Espaciados y medidas del CSS de Figma (campos 400×52, separación vertical de 92 px entre etiquetas, botón 400×52)

**Checkpoint**: US1 funciona y es verificable por sí sola con `RegisterForm` y su callback `onRegistered`; `npm test` en verde

---

## Phase 4: User Story 2 — Validar los campos antes de registrar (Priority: P1)

**Goal**: mostrar al usuario qué datos faltan o son incorrectos antes de crear la cuenta.

**Independent Test**: enviar el formulario vacío y luego con correo mal formado, contraseñas distintas y términos sin marcar; verificar los mensajes junto a cada campo, el foco y que no se llama al caso de uso.

### Tests for User Story 2 ⚠️

- [X] T025 [P] [US2] Ampliar `src/ui/features/register/registerReducer.test.ts`: `FR-009` los errores solo se muestran en campos tocados (`blur`) o al enviar; `submit` con errores marca todos los campos como tocados y no pasa a `submitting` (`FR-010`); corregir un valor oculta el mensaje de ese campo; `UI-4` cambiar la contraseña reevalúa la coincidencia de la confirmación si ya fue tocada; `change` de la casilla de términos oculta su mensaje
- [X] T026 [P] [US2] Ampliar `src/ui/features/register/RegisterForm.test.tsx`: `US2-1` enviar vacío muestra "Ingresa tu nombre completo", "Ingresa tu correo electrónico", "Crea una contraseña" y "Confirma tu contraseña", no llama al caso de uso y el foco va al nombre; `US2-2` "usuario@" y "usuario.com" muestran "Ingresa un correo electrónico válido" al salir del campo o al enviar; `US2-3` contraseña de 7 caracteres → "La contraseña debe tener al menos 8 caracteres"; `US2-4` confirmación distinta → "Las contraseñas no coinciden" al salir del campo; `US2-5` casilla sin marcar → "Debes aceptar los términos y condiciones" junto a la casilla; `US2-6` corregir el valor hace desaparecer el mensaje; `US2-7` cada error se asocia a su campo con `aria-invalid` y `aria-describedby` (nombre accesible con descripción); `UI-3` el foco va al primer campo con error en el orden nombre, correo, contraseña, confirmación, casilla; con todo válido salvo los términos el foco va a la casilla; `FR-004`/`FR-005`/`FR-006` los límites de 100, 254 y 128 caracteres muestran su mensaje
- [X] T027 [P] [US2] Ampliar `src/App.test.tsx` (o crear `src/ui/features/register/RegisterScreen.a11y.test.tsx`): `UI-12` la pantalla de registro con errores visibles no tiene violaciones de `axe`

### Implementation for User Story 2

- [X] T028 [US2] Completar `src/ui/features/register/registerReducer.ts` hasta pasar T025: acciones `blur` y `toggleTerms`; `visibleErrors(values, touched)` calculado con `validateRegistration` que muestra solo los campos tocados; `submit` marca todos como tocados; `change` en `password` reevalúa `confirmPassword` si está tocado
- [X] T029 [US2] Completar `src/ui/features/register/useRegisterForm.ts` con `blur(field)` y `toggleTerms(checked)`
- [X] T030 [US2] Completar `src/ui/features/register/RegisterForm.tsx` hasta pasar T026: pasar `error` a cada `TextField`/`PasswordField`/`Checkbox`, `onBlur` en cada campo y `ref` a cada control; en el envío, mover el foco al primer campo con error (nombre → correo → contraseña → confirmación → casilla)

**Checkpoint**: US1 y US2 funcionan; el formulario nunca llama al caso de uso con datos inválidos

---

## Phase 5: User Story 3 — Rechazar un correo ya registrado (Priority: P2)

**Goal**: avisar cuando el correo ya tiene una cuenta de demostración.

**Independent Test**: registrar el correo de una cuenta existente y verificar "Ya existe una cuenta con este correo", los datos conservados y el foco en el correo.

### Tests for User Story 3 ⚠️

- [X] T031 [P] [US3] Ampliar `src/infrastructure/InMemoryRegistrationGateway.test.ts`: `C2` un correo presente en las cuentas (comparado sin distinguir mayúsculas ni espacios) → `{ kind: 'email-taken' }`
- [X] T032 [P] [US3] Ampliar `src/ui/features/register/registerReducer.test.ts`: `result: email-taken` → `registerError` con el error asociado al campo de correo (`EMAIL_TAKEN`) y contraseña y confirmación vacías, conservando nombre y correo; `result: unavailable` → `registerError` con `serviceError: 'unavailable'` y contraseñas vacías; modificar el correo limpia el error de correo existente (`US3-2`); cualquier `change` en `registerError` vuelve a `editing`
- [X] T033 [P] [US3] Ampliar `src/ui/features/register/RegisterForm.test.tsx` con un `Register` falso: `US3-1` si devuelve `email-taken` se muestra "Ya existe una cuenta con este correo" bajo el campo de correo, se conservan nombre y correo, se vacían las contraseñas, el foco va al correo (`UI-5`) y no se muestra la confirmación; `US3-2` editar el correo hace desaparecer el mensaje; `UI-6` si devuelve `unavailable` se muestra un `Alert` de error "Servicio de registro no disponible. Intenta más tarde." y se vacían las contraseñas; `UI-12` el estado de error no tiene violaciones de `axe`

### Implementation for User Story 3

- [X] T034 [US3] Completar `src/infrastructure/InMemoryRegistrationGateway.ts` hasta pasar T031: devolver `{ kind: 'email-taken' }` si `normalizeEmail` del correo coincide con alguna cuenta
- [X] T035 [US3] Completar `src/ui/features/register/registerReducer.ts` hasta pasar T032: manejar `result: email-taken` y `result: unavailable` con los efectos de data-model.md y limpiar `EMAIL_TAKEN` al cambiar el correo
- [X] T036 [US3] Completar `src/ui/features/register/RegisterForm.tsx` hasta pasar T033: mostrar `EMAIL_TAKEN` como error del campo de correo, un `Alert` de error `REGISTER_UNAVAILABLE` sobre el botón cuando `serviceError === 'unavailable'` y mover el foco al campo de correo tras `email-taken`

**Checkpoint**: US1–US3 funcionan; los tres resultados del puerto están cubiertos de extremo a extremo

---

## Phase 6: User Story 4 — Mostrar u ocultar la contraseña (Priority: P3)

**Goal**: cada campo de contraseña tiene su control independiente de visibilidad.

**Independent Test**: escribir una contraseña, activar su ojo y comprobar que solo ese campo cambia.

### Tests for User Story 4 ⚠️

- [X] T037 [P] [US4] Ampliar `src/ui/features/register/RegisterForm.test.tsx`: `US4-1` activar "Mostrar contraseña" del campo "Contraseña" lo muestra en texto legible y el control pasa a "Ocultar contraseña"; `US4-2` volver a activarlo lo oculta; `US4-3` el control de "Contraseña" no afecta a "Confirmar contraseña" y viceversa (dos botones independientes con `aria-pressed`); `US4-4` los controles son alcanzables y activables solo con teclado (Tab y Enter/Espacio)

### Implementation for User Story 4

- [X] T038 [US4] Verificar que `RegisterForm.tsx` usa `PasswordField` en los dos campos de contraseña (su estado de visibilidad es local, FR-017) y que T037 pasa sin cambios en `PasswordField`; si falla, corregir el uso en `RegisterForm.tsx` sin duplicar el control. Comprobar además que ningún valor de contraseña aparece en `console`, URL ni almacenamiento (`FR-016`) con una prueba en `RegisterForm.test.tsx` que espíe `console` y `localStorage`/`sessionStorage`

**Checkpoint**: US1–US4 funcionan

---

## Phase 7: User Story 5 — Navegar entre registro e inicio de sesión y elementos fuera de alcance (Priority: P3)

**Goal**: conectar las dos pantallas con direcciones reales (`/login` y `/registro`), redirigir tras el registro y avisar en los elementos que no forman parte de la demo.

**Independent Test**: abrir `/`, comprobar que redirige a `/login`; activar "Regístrate" y ver `/registro`; activar "Inicia sesión" y volver a `/login`; usar atrás/adelante; activar Google y Apple y ver el `alert` "Próximamente"; activar el enlace de términos y ver el aviso.

### Tests for User Story 5 ⚠️

- [X] T039 [P] [US5] Ampliar `src/ui/features/login/LoginForm.test.tsx`: `FR-020` activar "Regístrate" llama a la prop `onRegister` y **ya no** muestra el aviso "Función no disponible en esta demostración"; los demás elementos fuera de alcance del login (¿Olvidaste tu contraseña?, Google, Apple) siguen mostrando el aviso (`US5-1` de 001)
- [X] T040 [P] [US5] Ampliar `src/ui/features/register/RegisterForm.test.tsx`: `US5-1` activar "Inicia sesión" llama a la prop `onLogin`; `US5-3`/`FR-021` activar "Google" o "Apple" llama a `window.alert` (espía) con "Próximamente" y conserva los datos ingresados; activar el enlace de "términos y condiciones" muestra el `Alert` informativo "Función no disponible en esta demostración", conserva los datos y no marca ni desmarca la casilla
- [X] T041 [P] [US5] Escribir las pruebas de enrutamiento en `src/ui/routing/routes.test.ts`, `src/ui/routing/useRoute.test.tsx` y ampliar `src/App.test.tsx` (`createAuthStub` y un `Register` falso; antes de cada prueba fijar la dirección con `window.history.replaceState`): `FR-020` `routes` normaliza `/login` y `/registro` y cualquier otra dirección (incluida `/`) a `/login`; `useRoute` devuelve la ruta actual, `navigate` cambia la dirección con `pushState` y la ruta, reacciona a `popstate` (atrás/adelante) y reemplaza con `replaceState` las direcciones desconocidas; `App` en `/` termina en `/login`; en `/login`, activar "Regístrate" muestra el registro (`heading` "Crea tu cuenta") en `/registro`; en `/registro`, activar "Inicia sesión" vuelve a `/login` y atrás/adelante alternan las pantallas; `FR-013`/`US1-1` un registro exitoso navega a `/login` y allí aparece "¡Cuenta creada, {nombre}! Ahora puedes iniciar sesión." (`status`); el mensaje desaparece al escribir en el login y no reaparece tras volver a `/registro` y a `/login`; cada pantalla muestra su propio titular en el panel de marca; `UI-12` el login con el mensaje de éxito y el registro con errores no tienen violaciones de `axe`

### Implementation for User Story 5

- [X] T042 [US5] Modificar `src/ui/features/login/LoginForm.tsx`: añadir la prop `onRegister: () => void` y usarla como acción de "Regístrate" en lugar de `notAvailable`; actualizar las llamadas existentes en `LoginForm.test.tsx` para pasar la prop
- [X] T043 [US5] Completar `src/ui/features/register/RegisterForm.tsx` hasta pasar T040: "Inicia sesión" llama a `onLogin`; Google y Apple llaman a `window.alert(MESSAGES.COMING_SOON)` sin alterar el estado del formulario; el enlace de términos dispara `showNotice(MESSAGES.FEATURE_UNAVAILABLE)` (añadir la acción `showNotice` a `registerReducer.ts` y `useRegisterForm.ts`, que se limpia en el siguiente `submit`) y muestra un `Alert` informativo
- [X] T044 [US5] Crear `src/ui/routing/routes.ts` (tipo `Route = '/login' | '/registro'`, `normalizePath(pathname): Route`) y `src/ui/routing/useRoute.ts` (hook con `useSyncExternalStore` o `useState` + `popstate`; `navigate(route)` con `history.pushState`; al montar reemplaza con `replaceState` si la dirección no es una ruta válida), y modificar `src/App.tsx` hasta pasar T041: props `authenticate` y `register`; estado `successMessage: string | null`; renderiza `AuthScreen` con el titular y tono de cada pantalla (login: textos actuales; registro: `title="Comienza tu camino financiero."`, `subtitle` de ui-register.md y `tone="register"`); `LoginForm` con `onRegister={() => navigate('/registro')}`, `successMessage` y `onDismissSuccess`; `RegisterForm` con `onLogin={() => navigate('/login')}` y `onRegistered={(name) => { setSuccessMessage(MESSAGES.REGISTER_SUCCESS(name)); navigate('/login'); }}`; el mensaje se descarta al navegar a `/registro`. Sin librería de enrutamiento (research.md R1)
- [X] T045 [US5] Modificar `src/main.tsx` (raíz de composición, Constitución 2.5): reutilizar la misma lista `accounts` de `loadDemoAccounts(import.meta.env.VITE_DEMO_USERS)` para crear `createRegister(new InMemoryRegistrationGateway(accounts))` junto al caso de uso de autenticación, y pasar ambos a `App`. Actualizar `index.html` solo si el `<title>` debe dejar de ser específico del login (por ejemplo, `KynWallet`)

**Checkpoint**: las cinco historias funcionan y la navegación entre pantallas es completa

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Calidad transversal, trazabilidad y documentación

- [ ] T046 [P] (CSS implementado; falta verificarlo visualmente en el navegador a esos anchos) Estilos responsivos de `RegisterForm.module.css` y `AuthScreen.module.css` (FR-022, UI-11): sin scroll horizontal desde 320 px, columna única bajo el punto de quiebre de 960 px con el panel de marca del registro oculto por completo (solo formulario en móvil), columna del formulario de 400 px máximo; verificar a 320, 375, 768, 1280 y 1440 px
- [ ] T047 [P] (pendiente: requiere navegador; el agente no tiene herramientas de navegador en esta sesión) Revisión visual frente a `specs/002-registro-billetera/design/registro.png` y los valores de Figma (research.md R5): textos, orden, jerarquía y medidas (campos 400×52, radio 12, panel de 620 px en 1440, tarjeta 360×210, separadores y botones sociales 192×48); registrar las diferencias aceptadas y la desviación de contraste en el PR (SC-006). Revisar en particular las diferencias de research.md R5b: posición del chip y la fecha de la tarjeta (el diseño los pega al borde; la implementación usa el margen del login), posición vertical del titular y del formulario, y confirmar con diseño si son intencionales
- [X] T048 [P] Actualizar `README.md` con la navegación login/registro, el comportamiento de la demo de registro (no persiste la cuenta; detecta correos de `VITE_DEMO_USERS`) y una referencia a `specs/002-registro-billetera/quickstart.md` (Constitución 8.3)
- [X] T049 [P] Actualizar `specs/001-login-billetera/contracts/ui-login.md` con la nota de que "Regístrate" navega al registro (contrato modificado, ver `contracts/ui-register.md`)
- [ ] T050 (pendiente: requiere navegador; cubierto en lo posible por las pruebas automatizadas) Ejecutar los 10 escenarios manuales de `specs/002-registro-billetera/quickstart.md` en el navegador y anotar el resultado de cada uno
- [X] T051 Ejecutar `npm run verify` (lint, formato, tipos, pruebas con cobertura ≥ 80 %, build, auditoría de dependencias y licencias, análisis de secretos) y corregir hallazgos; confirmar que la cobertura global no baja respecto a la línea base de T001 (Constitución 8.1, 9.4)
- [X] T052 Verificar la trazabilidad (Constitución 9.2): cada FR-001…FR-023 y cada escenario de aceptación tiene al menos una prueba cuyo nombre empieza por su ID (buscar con `grep` los IDs en `src/**/*.test.ts(x)`) y corregir los que falten

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Phase 1 y **bloquea** todas las historias.
- **User Stories (Phases 3–7)**: dependen de Phase 2. US1 es la base: US2 a US5 extienden `RegisterForm`, `registerReducer` y `useRegisterForm`, así que se hacen **después de US1** y, por tocar los mismos archivos, en orden de prioridad.
- **Polish (Phase 8)**: depende de las historias deseadas.

### User Story Dependencies

- **US1 (P1)**: tras Phase 2. Sin otras dependencias.
- **US2 (P1)**: tras US1 (extiende el formulario y el reducer).
- **US3 (P2)**: tras US1; independiente de US2 en lo funcional, pero comparte archivos con US1/US2.
- **US4 (P3)**: tras US1 (usa `PasswordField` del formulario).
- **US5 (P3)**: tras US1; modifica además `LoginForm.tsx`, `App.tsx` y `main.tsx`.

### Within Each User Story

- Las pruebas se escriben primero y DEBEN fallar antes de implementar (TDD, Constitución 1.1).
- Dominio → caso de uso/adaptador → reducer → hook → componentes.
- Cada historia termina en un checkpoint con `npm test` en verde antes de pasar a la siguiente.

### Parallel Opportunities

- Phase 2: T002, T003, T004, T005, T008 y T010 son de archivos distintos y pueden ir en paralelo; T007 espera a T006; T009 a T008; T011 a T010; T012 a T011.
- US1: T013–T017 (pruebas) en paralelo; T018 y T023 en paralelo con el resto de la implementación (T023 toca `Alert` y `LoginForm`; T042 añade después `onRegister` en `LoginForm`, así que van en orden).
- US2 a US5: las tareas de pruebas marcadas [P] de una misma historia se escriben en paralelo.
- Polish: T046, T047, T048 y T049 en paralelo.

---

## Parallel Example: User Story 1

```text
# Pruebas de US1 en paralelo (archivos distintos):
T013  src/application/register.test.ts
T014  src/infrastructure/InMemoryRegistrationGateway.test.ts
T015  src/ui/features/register/registerReducer.test.ts
T016  src/ui/features/register/RegisterForm.test.tsx
T017  src/ui/components/Alert/Alert.test.tsx y src/ui/features/login/LoginForm.test.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Completar Phase 1 y Phase 2.
2. Completar Phase 3 (US1): se puede crear una cuenta con datos válidos.
3. Completar Phase 4 (US2): ambas historias P1 completan el requerimiento (validaciones de correo, coincidencia de contraseñas y términos).
4. **Detenerse y validar** con `npm test` y el quickstart (escenarios 2, 4 y 5).

### Incremental Delivery

1. Base + US1 + US2 → MVP del registro.
2. US3 → detección de correos existentes.
3. US4 → verificación de visibilidad independiente de contraseñas.
4. US5 → navegación completa login ↔ registro y avisos fuera de alcance.
5. Polish → responsivo, revisión visual, documentación y `npm run verify`.

### Notes

- [P] = archivos distintos y sin dependencias pendientes.
- Verificar que las pruebas fallan antes de implementar y hacer commit tras cada tarea o grupo lógico.
- No introducir dependencias nuevas; si surge la necesidad, justificarla por escrito (Constitución 7.4).
- La desviación de colores por contraste sigue pendiente de aprobación de diseño (plan.md, Complexity Tracking).
