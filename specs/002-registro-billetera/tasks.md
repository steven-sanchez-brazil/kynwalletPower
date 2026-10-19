---

description: "Task list for 002-registro-billetera"
---

# Tasks: Pantalla de Registro de KynWallet

**Input**: Design documents from `/specs/002-registro-billetera/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/registration-gateway.md, contracts/ui-register.md, quickstart.md

**Tests**: OBLIGATORIAS. La Constitución del proyecto (Principio I, TDD — NO NEGOCIABLE, y Estándar 8.1) y `spec.md` (SC-003) exigen iniciar cada cambio de comportamiento con pruebas automatizadas que fallen antes de escribir el código de producción.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions
- Trazabilidad (Constitución 9.2): cada prueba `it(...)` DEBE incluir el identificador del escenario o requisito que verifica (p. ej., `US1-1`, `US2-3`, `FR-011`).

## Path Conventions

- **Single project**: `src/` at repository root; tests co-located alongside source files (`*.test.ts`, `*.test.tsx`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar la configuración compartida del proyecto sin alterar dependencias externas

- [X] T001 Actualizar el título del documento en `index.html` a `KynWallet · Billetera Virtual` y verificar que las reglas de capas de Clean Architecture en `eslint.config.js` cubren los nuevos módulos de registro

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tipos de dominio, constantes de mensajes, puerto de aplicación y utilidades de prueba que todas las historias de usuario necesitan

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Crear los tipos e interfaces del dominio de registro en `src/domain/registration.ts` según `data-model.md` y `contracts/registration-gateway.md`: `RegistrationInput` (`fullName: string`, `email: string`, `password: string`, `confirmPassword: string`, `acceptedTerms: boolean`), `RegistrationCommand` (`fullName: string`, `email: string`, `password: string`, `acceptedTerms: true`), `RegisteredUserRecord` (`email: string`, `displayName: string`, `passwordDigest: string`, `acceptedTerms: true`, `createdAt: string`), `RegistrationResult` (`{ kind: 'success' } | { kind: 'email-already-exists' } | { kind: 'storage-error' }`) y `RegistrationFieldErrors` (`Partial<Record<keyof RegistrationInput, string>>`)
- [X] T003 [P] Ampliar `src/domain/messages.ts` con las constantes de texto únicas (Principio IV) exigidas en `data-model.md` y `contracts/ui-register.md`: `FULL_NAME_REQUIRED: 'Ingresa tus nombres completos'`, `FULL_NAME_TOO_LONG: 'Los nombres completos no pueden superar 80 caracteres'`, `PASSWORD_WEAK: 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial'`, `CONFIRM_PASSWORD_REQUIRED: 'Confirma tu contraseña'`, `CONFIRM_PASSWORD_MISMATCH: 'Las contraseñas no coinciden'`, `TERMS_REQUIRED: 'Debes aceptar los términos y condiciones'`, `EMAIL_ALREADY_EXISTS: 'Este correo electrónico ya está registrado'`, `REGISTRATION_STORAGE_ERROR: 'No se pudo completar el registro en este navegador. Verifica la configuración de almacenamiento.'` y `COMING_SOON: 'Próximamente'`
- [X] T004 [P] Crear el puerto de aplicación `src/application/ports/UserRegistrationGateway.ts` con la interfaz `UserRegistrationGateway { register(command: RegistrationCommand): Promise<RegistrationResult>; }` según `contracts/registration-gateway.md`
- [X] T005 [P] Crear el doble de prueba `src/test/registrationStub.ts` para inyectar implementaciones controladas del caso de uso `RegisterUser` en las pruebas de componentes de UI

**Checkpoint**: Tipos de dominio, textos, puerto y stub listos — el desarrollo de las historias de usuario puede comenzar.

---

## Phase 3: User Story 1 - Registrar una nueva cuenta con datos válidos (Priority: P1) 🎯 MVP

**Goal**: Permitir que un nuevo usuario complete el formulario de registro, active el botón `"Crear Cuenta"` al marcar el checkbox de términos en `True`, almacene de forma segura su registro en `localStorage` y sea redirigido a la pantalla de Login donde puede iniciar sesión con su nueva cuenta.

**Independent Test**: Navegar desde Login a Registro pulsando `"Regístrate"`, verificar que `"Crear Cuenta"` está deshabilitado con términos en `False`, marcar términos en `True`, completar datos válidos, enviar el formulario y comprobar que se guarda el registro en `localStorage` (`kynwallet.registeredUsers`), vuelve a Login y permite iniciar sesión mostrando el nombre completo en la vista de bienvenida (`quickstart.md` escenarios 1, 2, 7 y 8).

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (Constitución, Principio I)**

- [X] T006 [P] [US1] Escribir pruebas unitarias en `src/infrastructure/passwordHash.test.ts` verificando que `hashPassword(email, password)` genera un `"Resumen criptográfico SHA-256 en hexadecimal (sha256(\"${email}:${password}\")); nunca contiene la contraseña en texto plano"` (FR-011, SC-006), es determinista para el mismo correo normalizado y contraseña, y produce resúmenes distintos ante correos o contraseñas diferentes
- [X] T007 [P] [US1] Escribir pruebas de contrato en `src/infrastructure/LocalStorageUserGateway.test.ts` verificando `contracts/registration-gateway.md`: R1 persiste `RegisteredUserRecord` bajo la clave `kynwallet.registeredUsers` con `email` (`"Identificador único normalizado (trim() + minúsculas), formato de correo válido, ≤ 254 caracteres"`), `displayName` (`"fullName.trim(), 1–80 caracteres"`), `passwordDigest`, `acceptedTerms: true` (`"Siempre true para registros completados"`) y `createdAt` (`"Fecha y hora en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)"`); R2 devuelve `{ kind: 'email-already-exists' }` si el correo ya existe en `localStorage` o en `VITE_DEMO_USERS`; R3 nunca guarda la contraseña en texto plano; R4 devuelve `{ kind: 'storage-error' }` sin rechazar la promesa cuando `localStorage.getItem` o `localStorage.setItem` lanza excepción o cuando el JSON previo en `localStorage` es inválido
- [X] T008 [P] [US1] Ampliar `src/infrastructure/InMemoryAuthGateway.test.ts` con pruebas para R5 de `contracts/registration-gateway.md` (FR-012): un usuario previamente persistido en `localStorage` (`kynwallet.registeredUsers`) se autentica exitosamente mediante `InMemoryAuthGateway.authenticate` devolviendo `{ kind: 'success', displayName }` y falla con `{ kind: 'invalid-credentials' }` si la contraseña no coincide
- [X] T009 [P] [US1] Escribir pruebas unitarias del caso de uso en `src/application/registerUser.test.ts`: `createRegisterUser(gateway)` recorta espacios periféricos de `fullName` y normaliza `email` antes de delegar en `gateway.register`, devuelve el `RegistrationResult` del puerto, y captura cualquier excepción inesperada devolviendo `{ kind: 'storage-error' }`
- [X] T010 [P] [US1] Escribir pruebas unitarias de la máquina de estados en `src/ui/features/register/registerReducer.test.ts` para el flujo de US1 (`data-model.md` sección 4): estado inicial `editing` con `acceptedTerms: false`; acción `change` actualiza campos y `toggleTerms` alterna `acceptedTerms`; `submit` con datos válidos y `acceptedTerms: true` transiciona a `submitting` e ignora envíos duplicados; `resolveSuccess` transiciona a `registered`
- [X] T011 [US1] Escribir pruebas de integración en `src/ui/features/register/RegisterForm.test.tsx` y `src/App.test.tsx` para US1: US1-1 el botón `"Crear Cuenta"` está deshabilitado (`disabled`) mientras el checkbox `"Acepto los términos y condiciones"` esté en `false`; US1-2 se habilita cuando el checkbox pasa a `true`; US1-3 al enviar datos válidos y términos en `true` invoca `registerUser` y redirige a la pantalla de Login; US1-4 el usuario registrado puede iniciar sesión en Login y ver `"¡Bienvenido, {displayName}!"`; US1-5 los botones `"Regístrate"` (en Login) e `"Inicia sesión"` (en Registro) alternan entre ambas vistas

### Implementation for User Story 1

- [X] T012 [P] [US1] Implementar `hashPassword(email: string, password: string): Promise<string>` en `src/infrastructure/passwordHash.ts` usando `crypto.subtle.digest('SHA-256', ...)` codificado en hexadecimal hasta pasar T006
- [X] T013 [P] [US1] Implementar `LocalStorageUserGateway` y la función lectora `loadRegisteredUsers` en `src/infrastructure/LocalStorageUserGateway.ts` usando la clave `kynwallet.registeredUsers` y `hashPassword` hasta pasar T007
- [X] T014 [P] [US1] Ampliar `src/infrastructure/InMemoryAuthGateway.ts` para verificar también los usuarios registrados en `localStorage` (`loadRegisteredUsers` + `hashPassword`) además de las cuentas de demostración en memoria, hasta pasar T008
- [X] T015 [US1] Implementar el caso de uso `createRegisterUser` y el tipo `RegisterUser` en `src/application/registerUser.ts` hasta pasar T009
- [X] T016 [US1] Implementar `registerReducer` e `initialRegisterState` en `src/ui/features/register/registerReducer.ts` y el hook `useRegisterForm` en `src/ui/features/register/useRegisterForm.ts` hasta pasar T010
- [X] T017 [US1] Implementar `src/ui/features/register/RegisterForm.tsx` y `src/ui/features/register/RegisterForm.module.css` según Figma (`31:2`) y `contracts/ui-register.md`: encabezado `"Crea tu cuenta"` / `"Completa tus datos para comenzar"`, campos `"Nombres Completos"`, `"Correo electrónico"`, `"Contraseña"` y `"Confirmar contraseña"`, `Checkbox` `"Acepto los términos y condiciones"`, botón `"Crear Cuenta"` (`disabled={!state.values.acceptedTerms}`, `loadingLabel="Creando cuenta…"`), y pie `"¿Ya tienes una cuenta?"` con botón `"Inicia sesión"`
- [X] T018 [US1] Actualizar `src/ui/features/login/LoginForm.tsx` (añadiendo prop `onNavigateToRegister?: () => void` para el botón `"Regístrate"`), `src/App.tsx` (estado de vista `'login' | 'register'` y prop `registerUser?: RegisterUser`) y `src/main.tsx` (instanciación de `LocalStorageUserGateway` e inyección de `registerUser`) hasta pasar T011

**Checkpoint**: User Story 1 es completamente funcional y demostrable de extremo a extremo (Registro → `localStorage` → redirección a Login → inicio de sesión exitoso).

---

## Phase 4: User Story 2 - Validar campos en línea (inline) y antes del envío (Priority: P1)

**Goal**: Proporcionar validación inline inmediata en Correo electrónico, Contraseña (seguridad alta y mínimo 8 caracteres) y Confirmar contraseña (coincidencia exacta y seguridad alta), así como validación obligatoria de Nombres Completos y verificación integral previa al envío al hacer clic en `"Crear Cuenta"`.

**Independent Test**: Ingresar valores inválidos en cada campo (nombres vacíos, correo sin formato email, contraseña sin mayúscula/minúscula/número/carácter especial o menor a 8 caracteres, confirmación distinta) y comprobar que los errores aparecen inline junto al campo correspondiente y que pulsar `"Crear Cuenta"` bloquea el envío y lleva el foco al primer campo con error (`quickstart.md` escenarios 3, 4, 5 y 6).

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T019 [P] [US2] Ampliar `src/domain/validation.test.ts` con pruebas unitarias para `isStrongPassword` y `validateRegistration` verificando todas las restricciones de `data-model.md`: `fullName` `"Vacío tras trim()"` → `"Ingresa tus nombres completos"`, `"Longitud tras trim() > 80 caracteres"` → `"Los nombres completos no pueden superar 80 caracteres"`; `email` `"Vacío tras trim()"` → `"Ingresa tu correo electrónico"`, `"No cumple ^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$ o > 254 caracteres"` → `"Ingresa un correo electrónico válido"`; `password` `"Vacío"` → `"Ingresa tu contraseña"`, `"< 8 caracteres, o no incluye al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"` → `"La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial"`, `"> 128 caracteres"` → `"La contraseña no puede superar 128 caracteres"`; `confirmPassword` `"Vacío"` → `"Confirma tu contraseña"`, `"No coincide exactamente con password (!==)"` → `"Las contraseñas no coinciden"`, `"No cumple seguridad alta (cuando password también es inválida)"` → mensaje de seguridad alta; `acceptedTerms: false` → `"Debes aceptar los términos y condiciones"`
- [X] T020 [P] [US2] Ampliar `src/ui/features/register/registerReducer.test.ts` con pruebas para US2-1 a US2-7: validación inline al escribir (`change`) en `email`, `password` y `confirmPassword` y al salir (`blur`) de cualquier campo; recálculo inmediato del error de `confirmPassword` cuando se edita `password` (US2-5); bloqueo de `submit` cuando existen errores de validación marcando todos los campos como `touched` sin pasar a `submitting` (US2-6, FR-008); desaparición inmediata del error al corregir el campo (US2-7); asignación de `EMAIL_ALREADY_EXISTS` a `fieldErrors.email` cuando el gateway devuelve `email-already-exists` y de `'storage-error'` a `submitError` cuando devuelve `storage-error`
- [X] T021 [US2] Ampliar `src/ui/features/register/RegisterForm.test.tsx` con pruebas de integración para US2-1 a US2-7 y casos límite: errores inline visibles y vinculados por `aria-describedby` y `aria-invalid="true"`; al pulsar `"Crear Cuenta"` con términos aceptados pero algún campo inválido, no se invoca `registerUser`, no se redirige a Login y el foco se mueve al primer campo con error; ante `email-already-exists` muestra `"Este correo electrónico ya está registrado"` en el campo correo y mueve el foco al correo; ante `storage-error` muestra `alert` `"No se pudo completar el registro en este navegador. Verifica la configuración de almacenamiento."`

### Implementation for User Story 2

- [X] T022 [US2] Implementar `FULL_NAME_MAX_LENGTH = 80`, `isStrongPassword`, `validateFullName`, `validateStrongPassword`, `validateConfirmPassword` y `validateRegistration` en `src/domain/validation.ts` hasta pasar T019
- [X] T023 [US2] Ampliar `src/ui/features/register/registerReducer.ts` y `src/ui/features/register/useRegisterForm.ts` con la validación inline en `change` y `blur`, recálculo cruzado de `password`/`confirmPassword` y manejo de `email-already-exists` y `storage-error` hasta pasar T020
- [X] T024 [US2] Ampliar `src/ui/features/register/RegisterForm.tsx` conectando `error` y `onBlur` en los cuatro campos, referencias `useRef` para mover el foco al primer campo con error tras intentar enviar o ante correo duplicado, y componente `Alert` (`tone="error"`) para `storage-error` hasta pasar T021

**Checkpoint**: User Stories 1 y 2 funcionan íntegramente; ningún formulario inválido puede enviarse ni almacenarse.

---

## Phase 5: User Story 3 - Notificación "Próximamente" en botones de Google y Apple (Priority: P2)

**Goal**: Mostrar una alerta temporal tipo Toast con el mensaje `"Próximamente"` al pulsar los botones de Google o Apple en la pantalla de registro, conservando los datos ingresados.

**Independent Test**: Escribir datos parciales en el formulario de registro y hacer clic en `"Google"` y en `"Apple"`, comprobando que aparece el Toast `"Próximamente"` con rol `status` sin limpiar los campos y que se oculta automáticamente tras 3 segundos (`quickstart.md` escenario 9).

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T025 [P] [US3] Escribir pruebas unitarias para el componente `Toast` en `src/ui/components/Toast/Toast.test.tsx`: renderiza el texto dentro de un contenedor con `role="status"` y `aria-live="polite"`, invoca `onDismiss` tras `durationMs` (3000 ms por defecto con `vi.useFakeTimers()`), limpia el temporizador al desmontar, y no presenta violaciones de accesibilidad con `axe` (`expectNoA11yViolations`)
- [X] T026 [US3] Ampliar `src/ui/features/register/RegisterForm.test.tsx` con pruebas para US3-1, US3-2 y US3-3: pulsar el botón `"Google"` o el botón `"Apple"` muestra el Toast con el mensaje `"Próximamente"`, conserva intactos los valores escritos en el formulario, y oculta el Toast automáticamente al cumplirse el tiempo de visualización

### Implementation for User Story 3

- [X] T027 [P] [US3] Implementar el componente reutilizable `src/ui/components/Toast/Toast.tsx` y sus estilos en `src/ui/components/Toast/Toast.module.css` usando los tokens de `src/ui/styles/tokens.css` hasta pasar T025
- [X] T028 [US3] Integrar `Divider` (`"o continúa con"`), `SocialButton` para `"Google"` y `"Apple"` y el componente `Toast` con `MESSAGES.COMING_SOON` (`"Próximamente"`) en `src/ui/features/register/RegisterForm.tsx`, `src/ui/features/register/registerReducer.ts` y `src/ui/features/register/useRegisterForm.ts` hasta pasar T026

**Checkpoint**: User Stories 1, 2 y 3 funcionan de forma independiente y verificable.

---

## Phase 6: User Story 4 - Mostrar u ocultar contraseñas durante el registro (Priority: P3)

**Goal**: Permitir alternar de forma independiente y accesible la visibilidad del texto en los campos `"Contraseña"` y `"Confirmar contraseña"`.

**Independent Test**: Ingresar texto en ambos campos de contraseña y activar sus respectivos botones `"Mostrar contraseña"` / `"Ocultar contraseña"` con ratón y teclado.

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T029 [US4] Ampliar `src/ui/features/register/RegisterForm.test.tsx` con pruebas para US4-1 y US4-2 verificando que los controles de visibilidad de `"Contraseña"` y `"Confirmar contraseña"` alternan de forma independiente entre `type="password"` (`"Mostrar contraseña"`, `aria-pressed="false"`) y `type="text"` (`"Ocultar contraseña"`, `aria-pressed="true"`) y son operables mediante teclado

### Implementation for User Story 4

- [X] T030 [US4] Verificar y ajustar la configuración de ambos componentes `PasswordField` (`name="password"` y `name="confirmPassword"`, `autoComplete="new-password"`) en `src/ui/features/register/RegisterForm.tsx` hasta pasar T029

**Checkpoint**: Las 4 historias de usuario están completas y verificadas con pruebas automatizadas.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Auditoría de accesibilidad WCAG 2.1 AA, pruebas de no exposición de contraseñas, adaptabilidad responsiva, documentación y verificación integral de cumplimiento constitucional

- [X] T031 [P] Ampliar `src/App.test.tsx` y `src/ui/features/register/RegisterForm.test.tsx` con pruebas de accesibilidad `expectNoA11yViolations` (`axe-core`, Constitución 8.4 y SC-005) en la vista de registro inicial, con errores inline visibles y con el Toast `"Próximamente"` activo, y con una prueba de seguridad (Constitución 5.4, FR-011 y SC-006) que verifique que tras registrarse la contraseña en texto plano no figura en `window.localStorage.getItem('kynwallet.registeredUsers')`, `document.body.textContent`, `window.location.href` ni `console.*`
- [X] T032 [P] Ajustar y verificar los estilos responsivos en `src/ui/features/register/RegisterForm.module.css` y `src/ui/components/Toast/Toast.module.css` para garantizar ausencia de desplazamiento horizontal desde `320px` hasta `1440px`
- [X] T033 [P] Actualizar `README.md` en la raíz del proyecto documentando el flujo de registro e inicio de sesión, las reglas de validación inline y seguridad alta de contraseña, el esquema seguro en `localStorage` (`kynwallet.registeredUsers`) y las referencias a `specs/002-registro-billetera/` (Constitución 8.3)
- [X] T034 Ejecutar `npm run verify` (`lint`, `format`, `typecheck`, `test:coverage` ≥ 80 %, `build`, `audit:deps`, `audit:licenses`, `scan:secrets`) y comprobar todos los escenarios de `specs/002-registro-billetera/quickstart.md` (Constitución 9.4)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias — comienza de inmediato.
- **Foundational (Phase 2)**: Depende de Setup — **BLOQUEA** todas las historias de usuario (`T002`–`T005` pueden ejecutarse en paralelo).
- **User Story 1 (Phase 3 - P1 🎯 MVP)**: Depende de Foundational (Phase 2).
- **User Story 2 (Phase 4 - P1)**: Depende de Foundational (Phase 2) y amplía los módulos de formulario creados en US1 (`registerReducer.ts`, `RegisterForm.tsx`).
- **User Story 3 (Phase 5 - P2)**: El componente `Toast` (`T025`, `T027`) solo depende de Foundational y puede desarrollarse en paralelo con US1/US2; su integración en `RegisterForm.tsx` (`T026`, `T028`) se ejecuta tras `T017`.
- **User Story 4 (Phase 6 - P3)**: Depende de `T017` (`RegisterForm.tsx`).
- **Polish (Phase 7)**: Depende de la finalización de todas las historias de usuario (Phases 3–6).

### Within Each User Story (TDD Mandatory)

1. Escribir las pruebas automatizadas de la historia y confirmar que **fallan** (Rojo).
2. Implementar dominio → infraestructura/aplicación → estado/hook → componentes UI hasta que las pruebas **pasen** (Verde).
3. Refactorizar manteniendo todas las pruebas en verde y sin errores de ESLint/TypeScript.

### Parallel Opportunities

- **Foundational (Phase 2)**: `T002`, `T003`, `T004` y `T005` tocan archivos distintos y pueden ejecutarse en paralelo.
- **User Story 1 (Phase 3)**:
  - Pruebas en paralelo: `T006`, `T007`, `T008`, `T009`, `T010`.
  - Implementación en paralelo: `T012`, `T013`, `T014`.
- **User Story 2 (Phase 4)**:
  - Pruebas en paralelo: `T019`, `T020`.
- **User Story 3 (Phase 5)**:
  - `T025` y `T027` (`Toast`) en paralelo con tareas de dominio/infraestructura de US1/US2.
- **Polish (Phase 7)**:
  - `T031`, `T032` y `T033` pueden ejecutarse en paralelo antes de `T034`.

---

## Parallel Example: User Story 1

```bash
# Lanzar en paralelo todas las pruebas unitarias y de contrato de US1 (archivos independientes):
Task: "T006 [P] [US1] Pruebas de hashPassword en src/infrastructure/passwordHash.test.ts"
Task: "T007 [P] [US1] Pruebas de contrato de LocalStorageUserGateway en src/infrastructure/LocalStorageUserGateway.test.ts"
Task: "T008 [P] [US1] Pruebas de integración de InMemoryAuthGateway con localStorage en src/infrastructure/InMemoryAuthGateway.test.ts"
Task: "T009 [P] [US1] Pruebas del caso de uso createRegisterUser en src/application/registerUser.test.ts"
Task: "T010 [P] [US1] Pruebas de registerReducer en src/ui/features/register/registerReducer.test.ts"

# Lanzar en paralelo las implementaciones de infraestructura de US1:
Task: "T012 [P] [US1] Implementar hashPassword en src/infrastructure/passwordHash.ts"
Task: "T013 [P] [US1] Implementar LocalStorageUserGateway en src/infrastructure/LocalStorageUserGateway.ts"
Task: "T014 [P] [US1] Ampliar InMemoryAuthGateway en src/infrastructure/InMemoryAuthGateway.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Completar **Phase 1: Setup** (`T001`) y **Phase 2: Foundational** (`T002`–`T005`).
2. Completar **Phase 3: User Story 1** (`T006`–`T018`) para habilitar el flujo completo de creación de cuenta, persistencia en `localStorage`, redirección a Login e inicio de sesión con la cuenta creada.
3. Completar **Phase 4: User Story 2** (`T019`–`T024`) para asegurar todas las validaciones inline y previas al envío requeridas.
4. **DETENERSE Y VALIDAR**: Ejecutar las pruebas y comprobar los escenarios 1–8 de `quickstart.md`.

### Incremental Delivery

1. **Setup + Foundational** → Contratos, tipos y mensajes listos.
2. **US1 (P1)** → Registro funcional con checkbox de términos obligatorio, persistencia en `localStorage` y redirección a Login.
3. **US2 (P1)** → Validación inline completa (correo, contraseña de seguridad alta, confirmación de contraseña y nombres completos).
4. **US3 (P2)** → Botones de Google y Apple con alerta tipo Toast `"Próximamente"`.
5. **US4 (P3)** → Controles accesibles para mostrar/ocultar ambas contraseñas.
6. **Polish** → Auditoría WCAG 2.1 AA con `axe-core`, verificación de no exposición de secretos y `npm run verify` completo.
