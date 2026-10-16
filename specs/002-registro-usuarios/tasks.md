---

description: "Task list for 002-registro-usuarios"
---

# Tasks: Pantalla de Registro de Usuarios de KynWallet

**Input**: Design documents from `/specs/002-registro-usuarios/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/register-gateway.md`, `contracts/ui-register.md`, `quickstart.md`

**Tests**: OBLIGATORIAS. La Constitución (Principio I, TDD) exige escribir las pruebas automatizadas antes del código de producción, verificar que fallen (Rojo) y luego implementar el código mínimo hasta pasarlas (Verde) y refactorizar.

**Organization**: Las tareas están agrupadas por historia de usuario (US1 a US4) para permitir la implementación, prueba e integración incremental de cada historia.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos diferentes, sin dependencias bloqueantes en curso)
- **[Story]**: Historia de usuario a la que pertenece la tarea (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Las rutas son relativas a la raíz del repositorio (`src/...`). Las pruebas se ubican junto al código (`*.test.ts` / `*.test.tsx`).
- **Trazabilidad (Constitución 9.2)**: cada bloque `it(...)` DEBE iniciar con el identificador del escenario o requisito que verifica (por ejemplo, `it('US1-1: registra una cuenta válida y redirige a /login…')`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verificar el estado base del proyecto `kynwalletPower` y añadir los tokens de estilo accesibles requeridos por la pantalla de registro.

- [X] T001 Verificar que la línea base del proyecto existente pasa todos los controles ejecutando `npm test` y `npm run typecheck` desde `package.json`
- [X] T002 [P] Añadir los tokens accesibles de estado de éxito (`--success-700: #1b5e20` con ratio ≥ 4.5:1 sobre blanco y `--success-50: #e8f5e9`) en `src/ui/styles/tokens.css`

**Checkpoint**: El entorno base compila sin errores y cuenta con los tokens de diseño necesarios.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tipos de dominio, mensajes centralizados, puerto `AuthGateway`, adaptador en memoria compartido y extensiones accesibles de `Alert` y `Checkbox` que bloquean las historias de usuario.

**⚠️ CRITICAL**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [X] T003 [P] Ampliar `src/domain/auth.ts` con los tipos de registro según `data-model.md` y `contracts/register-gateway.md`: `RegistrationData = { fullName: string; email: string; password: string; confirmPassword: string; termsAccepted: boolean }`, `RegisterAccountInput = { fullName: string; email: string; password: string }` y `RegisterResult = { kind: 'success'; displayName: string } | { kind: 'email-already-exists' } | { kind: 'unavailable' }`
- [X] T004 [P] Ampliar `src/domain/messages.ts` con los textos únicos de validación, error, éxito y aviso de registro (`FULL_NAME_REQUIRED: 'Ingresa tu nombre completo'`, `FULL_NAME_TOO_LONG: 'El nombre no puede superar 120 caracteres'`, `CONFIRM_PASSWORD_REQUIRED: 'Confirma tu contraseña'`, `PASSWORDS_DO_NOT_MATCH: 'Las contraseñas no coinciden'`, `TERMS_REQUIRED: 'Debes aceptar los términos y condiciones'`, `EMAIL_ALREADY_EXISTS: 'No fue posible crear la cuenta con este correo electrónico.'`, `REGISTER_UNAVAILABLE: 'Servicio de registro no disponible. Intenta más tarde.'`, `REGISTER_SUCCESS: '¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…'`, `COMING_SOON: 'Próximamente'`)
- [X] T005 Ampliar el puerto `src/application/ports/AuthGateway.ts` añadiendo el método opcional `register?(input: RegisterAccountInput): Promise<RegisterResult>` conforme a `contracts/register-gateway.md`
- [X] T006 [P] Escribir las pruebas (que deben fallar) para la variante `tone="success"` en `src/ui/components/Alert/Alert.test.tsx`: renderiza con `role="status"`, aplica la clase `success` y no presenta violaciones de `axe`
- [X] T007 [P] Escribir las pruebas (que deben fallar) para el soporte de error inline y `ref` en `src/ui/components/Checkbox/Checkbox.test.tsx`: cuando se pasa `error="Debes aceptar los términos y condiciones"`, el input tiene `aria-invalid="true"`, `aria-describedby` apunta al nodo del mensaje de error visible, permite recibir `ref` para gestión de foco y pasa `axe` sin violaciones
- [X] T008 [P] Implementar la variante `tone: 'error' | 'info' | 'success'` en `src/ui/components/Alert/Alert.tsx` y `src/ui/components/Alert/Alert.module.css` (usando `--success-700` y `--success-50`) hasta pasar T006
- [X] T009 [P] Implementar las props opcionales `error?: string` y `ref?: Ref<HTMLInputElement>` en `src/ui/components/Checkbox/Checkbox.tsx` y `src/ui/components/Checkbox/Checkbox.module.css` (asociando `aria-invalid` y `aria-describedby` al mensaje de error en `--danger-600`) hasta pasar T007

**Checkpoint**: Tipos de dominio, mensajes, puerto `AuthGateway` y componentes base `Alert` y `Checkbox` listos y con pruebas en verde.

---

## Phase 3: User Story 1 - Crear cuenta con datos válidos y redirigir al inicio de sesión (Priority: P1) 🎯 MVP

**Goal**: Permitir que un nuevo usuario complete el formulario de registro con datos válidos, almacene la cuenta en el almacén en memoria de la sesión, visualice el mensaje de éxito en la pantalla de registro y sea redirigido automáticamente a `/login` tras ~1.5 s, pudiendo iniciar sesión de inmediato.

**Independent Test**: Completar Nombre completo, Correo electrónico, Contraseña, Confirmar contraseña, marcar la casilla de Términos y condiciones y presionar `"Crear cuenta"`; verificar el estado de carga `"Creando cuenta…"`, la alerta `"¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…"`, la redirección automática a `/login` y el inicio de sesión exitoso con las nuevas credenciales (`quickstart.md` escenario 5).

### Tests for User Story 1 ⚠️

> **NOTE: Escribir estas pruebas PRIMERO y confirmar que FALLAN antes de implementar**

- [X] T010 [P] [US1] Ampliar `src/infrastructure/InMemoryAuthGateway.test.ts` con las pruebas de contrato R1, R3, R4, R5 y R6 (`contracts/register-gateway.md`): `register` con datos válidos devuelve `{ kind: 'success', displayName: fullName.trim() }` tras `delayMs`; seguidamente `authenticate` con ese correo (sin distinguir mayúsculas ni espacios periféricos) y contraseña exacta devuelve `{ kind: 'success', displayName }`; si `accounts === null` devuelve `{ kind: 'unavailable' }`; nunca expone la contraseña
- [X] T011 [P] [US1] Crear las pruebas unitarias del caso de uso en `src/application/registerAccount.test.ts`: recorta `fullName`, normaliza `email` (`trim` + minúsculas), conserva `password` intacta, delega en `gateway.register` y devuelve `{ kind: 'unavailable' }` si el gateway no implementa `register` o lanza una excepción
- [X] T012 [P] [US1] Crear `src/test/registerStub.ts` y las pruebas del reducer en `src/ui/features/register/registerReducer.test.ts` para el flujo exitoso (`data-model.md` `RegisterFormState`): estado inicial `editing` con `fullName: ''`, `email: ''`, `password: ''`, `confirmPassword: ''`, `termsAccepted: false`; `submit` con datos válidos pasa a `submitting`; un segundo `submit` en `submitting` o `success` se ignora (FR-010); `result` con `success` pasa a `status: 'success'`
- [X] T013 [US1] Crear las pruebas de integración de `RegisterForm` para US1 en `src/ui/features/register/RegisterForm.test.tsx`: US1-1 al ingresar datos válidos, marcar términos y enviar, invoca `registerAccount`, muestra alerta `status` `"¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…"` y tras `redirectDelayMs` invoca `onSuccessRedirect`; US1-2 durante `submitting` el botón muestra `"Creando cuenta…"`, tiene `aria-busy="true"` y `disabled`, y permanece `disabled` en `status: 'success'`; US1-3 recorta espacios periféricos en nombre y correo y normaliza mayúsculas en correo; US1-4 presionar Enter en un campo envía el formulario

### Implementation for User Story 1

- [X] T014 [P] [US1] Implementar `register(input: RegisterAccountInput): Promise<RegisterResult>` en `src/infrastructure/InMemoryAuthGateway.ts` almacenando las cuentas en un arreglo interno mutable compartido con `authenticate` hasta pasar T010
- [X] T015 [P] [US1] Implementar `createRegisterAccount(gateway: AuthGateway): RegisterAccount` en `src/application/registerAccount.ts` hasta pasar T011
- [X] T016 [P] [US1] Implementar la validación base `validateRegistration` en `src/domain/validation.ts` (requerida por el reducer para habilitar el envío válido) y la máquina de estados `registerReducer` en `src/ui/features/register/registerReducer.ts` hasta pasar T012
- [X] T017 [US1] Implementar el hook `src/ui/features/register/useRegisterForm.ts` con soporte de `redirectDelayMs` (por defecto `1500` ms), control `inFlight`, limpieza de `setTimeout` al desmontar e invocación de `onSuccessRedirect` al completar el registro exitoso
- [X] T018 [US1] Implementar `src/ui/features/register/RegisterForm.tsx` y `src/ui/features/register/RegisterForm.module.css` reproduciendo la jerarquía y estilos de Figma (`04 · Registro`, nodo `31:2`, `contracts/ui-register.md`) hasta pasar T013

**Checkpoint**: User Story 1 es completamente funcional y verificable mediante pruebas automatizadas.

---

## Phase 4: User Story 2 - Validar campos en línea y verificar integridad antes del envío (Priority: P1)

**Goal**: Proporcionar validaciones inline inmediatas al salir de cada campo (`blur`), al corregir valores (`change`) y al presionar `"Crear cuenta"` (`submit`), bloqueando el envío si existen errores, trasladando el foco al primer campo inválido y manejando el error de correo duplicado.

**Independent Test**: Enviar el formulario vacío verificando los 5 mensajes de obligatoriedad y el foco en `"Nombre completo"`; ingresar correo inválido (`"usuario@"`), contraseña de 7 caracteres (`"1234567"`) y confirmación distinta verificando los errores inline y su desaparición inmediata al corregirlos (`quickstart.md` escenarios 2 y 3).

### Tests for User Story 2 ⚠️

> **NOTE: Escribir estas pruebas PRIMERO y confirmar que FALLAN antes de implementar**

- [X] T019 [P] [US2] Ampliar `src/domain/validation.test.ts` con pruebas exhaustivas de `validateRegistration` citando las reglas de `data-model.md`: `fullName` vacío tras `trim()` o `< 2` caracteres → `"Ingresa tu nombre completo"`, `> 120` caracteres → `"El nombre no puede superar 120 caracteres"`; `email` vacío → `"Ingresa tu correo electrónico"`, formato inválido o `> 254` caracteres → `"Ingresa un correo electrónico válido"`; `password` vacía → `"Ingresa tu contraseña"`, `< 8` caracteres → `"La contraseña debe tener al menos 8 caracteres"`, `> 128` caracteres → `"La contraseña no puede superar 128 caracteres"`; `confirmPassword` vacía → `"Confirma tu contraseña"`, distinta de `password` → `"Las contraseñas no coinciden"`; `termsAccepted === false` → `"Debes aceptar los términos y condiciones"`; datos válidos → `{}`
- [X] T020 [P] [US2] Ampliar `src/infrastructure/InMemoryAuthGateway.test.ts` con la prueba de contrato R2 (`contracts/register-gateway.md`): intentar registrar un correo ya existente (sin distinguir mayúsculas ni espacios periféricos) devuelve `{ kind: 'email-already-exists' }` sin duplicar ni sobrescribir la cuenta
- [X] T021 [P] [US2] Ampliar `src/ui/features/register/registerReducer.test.ts` para US2: `blur` en cada campo marca `touched[field] = true` y expone solo su error inline; `change` en `password` cuando `confirmPassword` ya fue tocado actualiza de inmediato el error `"Las contraseñas no coinciden"`; `submit` con errores marca los 5 campos como `touched`, permanece en `editing` y no pasa a `submitting`; `result` con `email-already-exists` o `unavailable` pasa a `registerError`, conserva `fullName` y `email` y limpia `password` y `confirmPassword`
- [X] T022 [US2] Ampliar `src/ui/features/register/RegisterForm.test.tsx` con los escenarios US2-1 a US2-6: US2-1 envío vacío muestra los 5 mensajes obligatorios, no invoca `registerAccount` y mueve el foco al primer campo con error (`fullName`, o al siguiente si los previos son válidos); US2-2 correo inválido en `blur` muestra `"Ingresa un correo electrónico válido"`; US2-3 contraseña `< 8` caracteres en `blur` muestra `"La contraseña debe tener al menos 8 caracteres"`; US2-4 confirmación distinta en `blur` muestra `"Las contraseñas no coinciden"`; US2-5 corregir cualquier campo o marcar el checkbox elimina inmediatamente su mensaje de error; US2-6 correo ya registrado muestra `alert` `"No fue posible crear la cuenta con este correo electrónico."`, conserva nombre y correo y limpia ambas contraseñas

### Implementation for User Story 2

- [X] T023 [P] [US2] Completar todas las reglas de `validateRegistration` y constantes `FULL_NAME_MIN_LENGTH = 2` y `FULL_NAME_MAX_LENGTH = 120` en `src/domain/validation.ts` hasta pasar T019
- [X] T024 [P] [US2] Asegurar la verificación de correo existente en `src/infrastructure/InMemoryAuthGateway.ts` devolviendo `{ kind: 'email-already-exists' }` hasta pasar T020
- [X] T025 [US2] Completar el manejo de `blur`, recálculo reactivo en `change`, bloqueo en `submit` y transición `registerError` en `src/ui/features/register/registerReducer.ts` hasta pasar T021
- [X] T026 [US2] Completar en `src/ui/features/register/RegisterForm.tsx` la gestión de foco por orden de prioridad (`fullNameRef` → `emailRef` → `passwordRef` → `confirmPasswordRef` → `termsRef`) al fallar `submit`, el foco en `emailRef` tras `email-already-exists` y la visualización de `Alert` de error hasta pasar T022

**Checkpoint**: Todas las validaciones inline y de integridad antes del envío (US1 y US2) funcionan y pasan sus pruebas.

---

## Phase 5: User Story 3 - Navegar al inicio de sesión y consultar opciones de autenticación social (Priority: P2)

**Goal**: Mostrar el aviso `"Próximamente"` (`Alert` con `role="status"`) al pulsar los botones sociales `"Google"` y `"Apple"` conservando los datos del formulario, y habilitar la navegación bidireccional entre `/register` (`"¿Ya tienes cuenta? Inicia sesión"`) y `/login` (`"Regístrate"`).

**Independent Test**: Pulsar `"Google"` y `"Apple"` en `/register` comprobando que aparece el aviso `"Próximamente"` sin borrar los campos; pulsar `"Inicia sesión"` en `/register` comprobando que navega a `/login`, y pulsar `"Regístrate"` en `/login` comprobando que navega a `/register` (`quickstart.md` escenarios 1 y 4).

### Tests for User Story 3 ⚠️

> **NOTE: Escribir estas pruebas PRIMERO y confirmar que FALLAN antes de implementar**

- [X] T027 [P] [US3] Ampliar `src/ui/features/register/RegisterForm.test.tsx` para US3: US3-1 al pulsar `"Google"` o `"Apple"` se muestra el banner `Alert` (`role="status"`) con el texto `"Próximamente"` conservando intactos los valores escritos en el formulario; US3-2 al pulsar `"Inicia sesión"` junto a `"¿Ya tienes cuenta?"` se invoca `onNavigateToLogin`
- [X] T028 [P] [US3] Ampliar `src/ui/features/login/LoginForm.test.tsx`: cuando se proporciona la prop `onNavigateToRegister`, pulsar `"Regístrate"` invoca `onNavigateToRegister` en lugar de mostrar el aviso de función no disponible (manteniendo el aviso por defecto si la prop no se pasa)
- [X] T029 [US3] Ampliar `src/App.test.tsx` con pruebas de navegación e integración extremo a extremo: navegar de `/login` a `/register` pulsando `"Regístrate"`, volver a `/login` pulsando `"Inicia sesión"`, y completar un registro válido en `/register` verificando la redirección automática a `/login` y el posterior inicio de sesión exitoso con la nueva cuenta creada

### Implementation for User Story 3

- [X] T030 [P] [US3] Añadir la prop opcional `onNavigateToRegister?: () => void` en `src/ui/features/login/LoginForm.tsx` para que el botón `"Regístrate"` invoque `onNavigateToRegister` cuando esté definida hasta pasar T028
- [X] T031 [P] [US3] Conectar en `src/ui/features/register/RegisterForm.tsx` los botones `SocialButton` (`"Google"`, `"Apple"`) a `showNotice(MESSAGES.COMING_SOON)` y el botón-enlace `"Inicia sesión"` a `onNavigateToLogin` hasta pasar T027
- [X] T032 [US3] Actualizar `src/App.tsx` y `src/main.tsx` para inyectar `registerAccount = createRegisterAccount(gateway)` compartiendo la misma instancia de `InMemoryAuthGateway` con `authenticate`, e implementar el enrutamiento ligero con History API (`/login` ↔ `/register`) hasta pasar T029

**Checkpoint**: La navegación bidireccional `/login` ↔ `/register`, el flujo completo Registro → Redirección → Login y los avisos `"Próximamente"` de Google/Apple funcionan de extremo a extremo.

---

## Phase 6: User Story 4 - Visualizar diseño adaptativo en Desktop y Mobile y controlar visibilidad de contraseñas (Priority: P3)

**Goal**: Garantizar la fidelidad visual con el frame `04 · Registro` (nodo `31:2`) de Figma en Desktop (2 paneles: `BrandPanel` con tarjeta **KynCard** a la izquierda y `RegisterForm` a la derecha) y Mobile (1 panel adaptativo con el formulario y sin scroll horizontal), así como el control independiente de mostrar/ocultar caracteres en `"Contraseña"` y `"Confirmar contraseña"`.

**Independent Test**: Verificar que los controles `"Mostrar contraseña"` / `"Ocultar contraseña"` alternan de forma independiente cada campo de contraseña con teclado y puntero, y comprobar la disposición de 2 paneles con **KynCard** en Desktop (`≥ 960 px`) y 1 panel adaptativo en Mobile (`< 960 px`, hasta `320 px`) (`quickstart.md` escenario 6).

### Tests for User Story 4 ⚠️

> **NOTE: Escribir estas pruebas PRIMERO y confirmar que FALLAN antes de implementar**

- [X] T033 [P] [US4] Ampliar `src/ui/features/register/RegisterForm.test.tsx` para US4-3: verificar que ambos campos (`"Contraseña"` y `"Confirmar contraseña"`) ocultan sus caracteres por defecto (`type="password"`) y que al activar el control de visibilidad de uno de ellos cambia únicamente ese campo a `type="text"` (`aria-pressed="true"`) manteniendo el otro oculto, además de validar el orden completo de tabulación por teclado según `contracts/ui-register.md`
- [X] T034 [P] [US4] Ampliar `src/App.test.tsx` para US4-1 y US4-2: en la ruta `/register`, verificar que se renderizan la estructura de 2 paneles con `BrandPanel` (incluyendo el logo `"KynWallet"`, el titular `"Tu dinero, sin fronteras."` y la tarjeta ilustrativa `"Kyn Card"`) y el panel principal con el formulario `"Crear cuenta"`, y que supera la auditoría `expectNoA11yViolations` (`axe-core`) tanto en estado inicial como con los 5 errores de validación inline activos

### Implementation for User Story 4

- [X] T035 [US4] Ajustar estilos y atributos de accesibilidad en `src/ui/features/register/RegisterForm.tsx` y `src/ui/features/register/RegisterForm.module.css` (espaciados, tipografía `Inter`, geometría de `52 px` en inputs/botón y `48 px` en botones sociales, y adaptación móvil `< 960 px` / `< 480 px` junto a `LoginScreen.module.css` y `BrandPanel.module.css`) hasta pasar T033 y T034

**Checkpoint**: Las 4 historias de usuario (US1, US2, US3 y US4) están completas, probadas y cumplen accesibilidad WCAG 2.1 AA.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Pruebas transversales de seguridad (Principio V), actualización de documentación y ejecución completa del pipeline de cumplimiento (`npm run verify`).

- [X] T036 [P] Añadir prueba de seguridad en `src/ui/features/register/RegisterForm.test.tsx` verificando que tras un registro fallido o exitoso la contraseña y su confirmación nunca aparecen en `document.body.textContent`, `window.location.href`, llamadas a `console.*` ni `Storage.prototype.setItem` (FR-011, Constitución 5.3 y 5.4)
- [X] T037 [P] Actualizar `README.md` documentando la nueva pantalla de Registro (`/register`), la navegación bidireccional con `/login` y el enlace a `specs/002-registro-usuarios/` (Constitución 8.3)
- [X] T038 Ejecutar `npm run verify` (`lint`, `format`, `typecheck`, `test:coverage` ≥ 80 %, `build`, `audit:deps`, `audit:licenses`, `scan:secrets`) y corregir cualquier observación de formato o cobertura hasta que todos los controles terminen con código `0` (Constitución 9.4, SC-004, SC-005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sin dependencias; puede ejecutarse inmediatamente.
- **Phase 2 (Foundational)**: Depende de Phase 1 y **BLOQUEA** todas las historias de usuario (T003–T009).
- **Phase 3 (User Story 1 - P1 MVP)**: Depende de Phase 2.
- **Phase 4 (User Story 2 - P1)**: Depende de Phase 2 y amplía los módulos creados en Phase 3 (`validation.ts`, `registerReducer.ts`, `RegisterForm.tsx`).
- **Phase 5 (User Story 3 - P2)**: Depende de Phase 3 y Phase 4; integra la navegación `/login` ↔ `/register` en `App.tsx` y `main.tsx`.
- **Phase 6 (User Story 4 - P3)**: Depende de Phase 5; valida el layout de 2 paneles con **KynCard** vs. 1 panel móvil, controles independientes de visibilidad de contraseña y accesibilidad integral.
- **Phase 7 (Polish)**: Depende de completar las fases de todas las historias de usuario (Phases 3–6).

### User Story Dependencies

- **US1 (P1 - Flujo exitoso y redirección)**: Independiente tras completar Phase 2 (Foundational). Constituye el incremento **MVP**.
- **US2 (P1 - Validaciones inline e integridad)**: Se construye directamente sobre el formulario y reducer de US1.
- **US3 (P2 - Botones sociales y navegación `/login` ↔ `/register`)**: Conecta `RegisterForm` (US1/US2) con `LoginForm` y `App`.
- **US4 (P3 - Responsive 2 paneles / 1 panel y visibilidad de contraseñas)**: Verifica y refina el comportamiento responsive y de accesibilidad del conjunto.

### Parallel Opportunities

- **Phase 2**: T003, T004, T006 y T007 pueden ejecutarse en paralelo; T008 y T009 pueden ejecutarse en paralelo.
- **Phase 3 (US1)**: Las pruebas T010, T011 y T012 pueden ejecutarse en paralelo; las implementaciones T014, T015 y T016 pueden ejecutarse en paralelo.
- **Phase 4 (US2)**: Las pruebas T019, T020 y T021 pueden ejecutarse en paralelo; las implementaciones T023 y T024 pueden ejecutarse en paralelo.
- **Phase 5 (US3)**: Las pruebas T027 y T028 pueden ejecutarse en paralelo; las implementaciones T030 y T031 pueden ejecutarse en paralelo.
- **Phase 6 (US4)**: Las pruebas T033 y T034 pueden ejecutarse en paralelo.
- **Phase 7 (Polish)**: T036 y T037 pueden ejecutarse en paralelo antes de T038.

---

## Parallel Example: User Story 1 & User Story 2

```bash
# Lanzar en paralelo las pruebas de capa de dominio, infraestructura y aplicación de US1:
Task: "T010 [P] [US1] Ampliar src/infrastructure/InMemoryAuthGateway.test.ts con las pruebas de contrato R1, R3, R4, R5 y R6"
Task: "T011 [P] [US1] Crear las pruebas unitarias del caso de uso en src/application/registerAccount.test.ts"
Task: "T012 [P] [US1] Crear src/test/registerStub.ts y las pruebas del reducer en src/ui/features/register/registerReducer.test.ts"

# Lanzar en paralelo las pruebas de validación y contrato de US2:
Task: "T019 [P] [US2] Ampliar src/domain/validation.test.ts con pruebas exhaustivas de validateRegistration"
Task: "T020 [P] [US2] Ampliar src/infrastructure/InMemoryAuthGateway.test.ts con la prueba de contrato R2"
Task: "T021 [P] [US2] Ampliar src/ui/features/register/registerReducer.test.ts para US2"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2 Core P1)

1. Completar **Phase 1: Setup** y **Phase 2: Foundational**.
2. Completar **Phase 3: User Story 1 (P1)** para habilitar la creación de cuentas en memoria, alerta de éxito y redirección automática tras ~1.5 s.
3. Completar **Phase 4: User Story 2 (P1)** para asegurar todas las validaciones inline y la verificación de integridad del botón `"Crear cuenta"`.
4. **DETENERSE Y VALIDAR**: Ejecutar `npm test` para verificar que el núcleo P1 funciona de forma aislada.

### Incremental Delivery

1. **Setup + Foundational** → Extensiones de dominio, `AuthGateway`, `Alert` y `Checkbox` listas.
2. **US1 (P1)** → Alta de cuenta, mensaje de éxito (~1.5 s) y redirección automática.
3. **US2 (P1)** → Validaciones inline (nombre, correo, longitud de contraseña, coincidencia y términos) y bloqueo de envíos inválidos.
4. **US3 (P2)** → Botones Google/Apple con `"Próximamente"` y navegación bidireccional `/register` ↔ `/login`.
5. **US4 (P3)** → Verificación responsive (2 paneles con **KynCard** en Desktop / 1 panel en Mobile), toggles independientes de contraseña y auditoría `axe-core`.
6. **Polish** → Pruebas de no exposición de secretos y `npm run verify` al 100 %.
