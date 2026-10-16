# Implementation Plan: Pantalla de Registro de Usuarios de KynWallet

**Branch**: `002-registro-usuarios` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-registro-usuarios/spec.md`

## Summary

Implementación de la pantalla de Registro de Usuarios de KynWallet fiel al diseño de Figma (`04 · Registro`, nodo `31:2`), integrada con la pantalla de Inicio de Sesión existente (`001-login-billetera`). Permite capturar Nombre completo, Correo electrónico, Contraseña, Confirmar contraseña y aceptación obligatoria de Términos y condiciones; aplica validaciones inline en tiempo real y validación integral antes del envío; muestra el aviso `"Próximamente"` (`Alert` con `role="status"`) para Google y Apple; registra la nueva cuenta en el almacén en memoria compartido de la sesión (`InMemoryAuthGateway`), muestra un mensaje de confirmación de éxito durante ~1.5 s y redirige automáticamente a `/login` (donde el usuario puede iniciar sesión de inmediato). Mantiene la arquitectura Clean Architecture ligera en React 19 + TypeScript 5 (`strict`) + Vite 8 + CSS Modules y desarrollo guiado por pruebas (TDD) con Vitest, React Testing Library y `axe-core`.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict`), Node.js ≥ 20 LTS

**Primary Dependencies**: React 19, Vite 8, `@fontsource-variable/inter` (0 dependencias nuevas de runtime)

**Storage**: En memoria durante la sesión del navegador (`InMemoryAuthGateway` compartido entre `/register` y `/login`); sin persistencia en `localStorage` ni servicios backend (FR-011, Constitución 5.3/5.4)

**Testing**: Vitest 5, React Testing Library, `@testing-library/user-event`, `jsdom`, `axe-core` (`src/test/a11y.ts`), `@vitest/coverage-v8` (cobertura ≥ 80 %)

**Target Platform**: Navegadores modernos (Chrome, Firefox, Safari, Edge), adaptable desde `320 px` (Mobile) hasta escritorio (`1440 × 1024 px`)

**Project Type**: Aplicación web de página única (SPA), solo frontend con Clean Architecture en 4 capas (`domain`, `application`, `infrastructure`, `ui`)

**Performance Goals**: Retroalimentación de validaciones inline ≤ 100 ms (SC-002); procesamiento de registro y redirección automática a `/login` ≤ 2 s (SC-003)

**Constraints**: Sin backend ni base de datos; WCAG 2.1 nivel AA obligatorio (0 violaciones `axe-core`); sin credenciales en archivos versionados (`secretlint`); sin desplazamiento horizontal desde `320 px`

**Scale/Scope**: 2 rutas conectadas (`/login` y `/register`), reutilización de los 7 componentes base del sistema de diseño corporativo y del layout `BrandPanel` (con tarjeta **KynCard**)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Regla | Cumplimiento en el diseño | Estado |
|---|---|---|
| **I. TDD (No Negociable)** | Cada historia de usuario inicia con pruebas automatizadas que fallan (dominio `validateRegistration` → caso de uso `registerAccount` → `registerReducer` → `RegisterForm` → navegación `App`) siguiendo el ciclo Rojo → Verde → Refactorizar | ✅ |
| **II. SOLID** | Responsabilidad única por módulo; `Checkbox` y `Alert` extendidos mediante props opcionales sin romper consumidores existentes (OCP); `AuthGateway` inyectado en casos de uso (DIP) | ✅ |
| **III. Clean Architecture** | Reglas de validación (`validateRegistration`) y tipos en `src/domain/`; caso de uso `createRegisterAccount` en `src/application/`; almacén en memoria en `src/infrastructure/InMemoryAuthGateway.ts`; componentes y hooks en `src/ui/`; verificado con `eslint` (`no-restricted-imports`) | ✅ |
| **IV. DRY / KISS / YAGNI** | Reutiliza `validateEmail`, `validatePassword`, `BrandPanel`, `TextField`, `PasswordField`, `Checkbox`, `Button`, `SocialButton`, `Divider` y `Alert`. Navegación `/login` ↔ `/register` con History API nativa sin librerías externas | ✅ |
| **V. Seguridad por Diseño** | Validación estricta en el límite por tipo, formato y longitud máxima (`fullName ≤ 120`, `email ≤ 254`, `password 8–128`); contraseñas nunca registradas ni guardadas en `localStorage`/URLs; `secretlint` activo | ✅ |
| **VI. Conformidad BRD / ARD** | No existen BRD/ARD adicionales; alineado con `spec.md` y clarificaciones aprobadas | ✅ N/A |
| **7. Gestión de Dependencias** | No se añade ninguna dependencia nueva al proyecto; todas las existentes pasan `npm audit` y `audit:licenses` | ✅ |
| **8.1–8.3 Calidad, Estilo y Docs** | Cobertura ≥ 80 %, ESLint + Prettier + `tsc --noEmit`, contratos y `quickstart.md` actualizados | ✅ |
| **8.4 Accesibilidad WCAG 2.1 AA** | Todos los campos e inputs tienen `label` asociado, errores inline con `aria-invalid` y `aria-describedby`, alertas con `role="alert"` / `role="status"` y contraste AA verificado | ✅ |
| **8.5 / 8.6 Reutilización y Diseño** | Reutilización del 100 % de los componentes y tokens de `src/ui/styles/tokens.css` extraídos de Figma (`f7uDsv8sh6ZOtK2OitTqtg`) | ✅ |
| **9.2 / 9.4 Trazabilidad y Controles** | Pruebas etiquetadas por escenario/requisito (`US1-1`, `US2-4`, `FR-003`, etc.) y verificadas con `npm run verify` | ✅ |

**Resultado del Gate (Pre-Phase 0 y Post-Phase 1)**: **APROBADO** sin violaciones nuevas.

---

## Arquitectura Técnica Detallada

### 1. Jerarquía de Componentes UI (`RegisterScreen`, `BrandPanel` con KynCard y `RegisterForm`)

```text
App (enrutador ligero /login ↔ /register + inyección de casos de uso)
├── LoginScreen (ruta: /login)
│   ├── BrandPanel (panel izquierdo en Desktop / cabecera compacta en Mobile)
│   │   ├── Logo KynWallet (SVG + texto)
│   │   ├── Headline ("Tu dinero, sin fronteras." + subtítulo)
│   │   └── KynCard (tarjeta ilustrativa: "Kyn Card", chip, "5294 •••• •••• 4827", "STEVEN LUNA", "12/29")
│   └── LoginForm (con enlace "Regístrate" conectado a navigate('/register'))
│
└── RegisterScreen / LoginScreen (ruta: /register, reutiliza el contenedor de 2 paneles)
    ├── BrandPanel (panel izquierdo en Desktop con KynCard / oculto en Mobile salvo logo)
    └── RegisterForm (panel derecho, max-width: 400px)
        ├── Encabezado (h1 "Crear cuenta" + p "Completa tus datos para comenzar")
        ├── TextField (name="fullName", label="Nombre completo")
        ├── TextField (name="email", label="Correo electrónico", type="email")
        ├── PasswordField (name="password", label="Contraseña", toggle independiente)
        ├── PasswordField (name="confirmPassword", label="Confirmar contraseña", toggle independiente)
        ├── Checkbox (label="Acepto los términos y condiciones", con soporte de error inline)
        ├── Alert (tone="error" para error de registro | tone="success" para éxito previo a redirección)
        ├── Button (type="submit", label="Crear cuenta" / loadingLabel="Creando cuenta…")
        ├── Divider ("o continúa con")
        ├── SocialButtons (SocialButton "Google" + SocialButton "Apple" → Alert tone="info" "Próximamente")
        └── Footer ("¿Ya tienes cuenta?" + Button variant="link" "Inicia sesión" → navigate('/login'))
```

### 2. Estrategia de Manejo de Estado y Hooks de Validación Inline

1. **Capa de Dominio (`src/domain/validation.ts` y `src/domain/messages.ts`)**:
   - Se centralizan las constantes y mensajes de validación en `MESSAGES`:
     - `FULL_NAME_REQUIRED: 'Ingresa tu nombre completo'`
     - `FULL_NAME_TOO_LONG: 'El nombre no puede superar 120 caracteres'`
     - `CONFIRM_PASSWORD_REQUIRED: 'Confirma tu contraseña'`
     - `PASSWORDS_DO_NOT_MATCH: 'Las contraseñas no coinciden'`
     - `TERMS_REQUIRED: 'Debes aceptar los términos y condiciones'`
     - `EMAIL_ALREADY_EXISTS: 'No fue posible crear la cuenta con este correo electrónico.'`
     - `REGISTER_UNAVAILABLE: 'Servicio de registro no disponible. Intenta más tarde.'`
     - `REGISTER_SUCCESS: '¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…'`
     - `COMING_SOON: 'Próximamente'`
   - Función pura `validateRegistration(values: RegistrationData): RegistrationErrors`:
     - **Nombre completo (`fullName`)**: obligatorio tras `trim()`, mínimo 2 y máximo 120 caracteres.
     - **Correo electrónico (`email`)**: reutiliza `validateEmail` (obligatorio, regex `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`, máximo 254 caracteres).
     - **Contraseña (`password`)**: reutiliza `validatePassword` (obligatoria, sin recortar espacios, entre 8 y 128 caracteres).
     - **Confirmar contraseña (`confirmPassword`)**: obligatoria y debe cumplir `confirmPassword === password`.
     - **Términos y condiciones (`termsAccepted`)**: debe ser `true`.

2. **Máquina de Estados Puramente Funcional (`src/ui/features/register/registerReducer.ts`)**:
   - Estado `RegisterState`:
     - `status: 'editing' | 'submitting' | 'registerError' | 'success'`
     - `values: RegistrationData` (`fullName`, `email`, `password`, `confirmPassword`, `termsAccepted`)
     - `touched: Record<RegistrationField, boolean>`
     - `fieldErrors: RegistrationErrors`
     - `registerError: 'email-already-exists' | 'unavailable' | null`
     - `notice: string | null`
   - Función `visibleRegistrationErrors(values, touched)`: filtra el resultado de `validateRegistration(values)` devolviendo únicamente los errores cuyos campos tengan `touched[field] === true`.
   - Al ejecutar `blur(field)`: marca `touched[field] = true` y muestra el error inline de ese campo inmediatamente.
   - Al ejecutar `change(field, value)`: actualiza `values[field]` y recalcula `visibleRegistrationErrors(values, state.touched)`. Si el usuario corrige un campo con error (o si cambia `password` cuando `confirmPassword` ya estaba tocado), el error inline se oculta o actualiza al instante (≤ 100 ms, SC-002).
   - Al ejecutar `submit`: marca los 5 campos como `touched: true`. Si `Object.keys(fieldErrors).length > 0`, permanece en `'editing'` e impide el envío (FR-004).

3. **Hook de Orquestación (`src/ui/features/register/useRegisterForm.ts`)**:
   - Conecta `registerReducer` con el caso de uso inyectado `registerAccount: RegisterAccount` y el callback `onSuccessRedirect: () => void`.
   - Evita envíos concurrentes mediante `inFlight` ref y protege actualizaciones tras desmontaje con `mounted` ref.
   - En `submit()`, devuelve el objeto `RegistrationErrors` sincrónicamente para que `RegisterForm` traslade el foco (`.focus()`) al primer campo inválido siguiendo el orden: `fullNameRef` → `emailRef` → `passwordRef` → `confirmPasswordRef` → `termsRef` (FR-005).

### 3. Flujo de Éxito y Redirección Automática a `/login`

1. Al pulsar `"Crear cuenta"` con todos los datos válidos, el formulario entra en `status: 'submitting'`, deshabilitando el botón y mostrando `"Creando cuenta…"` (`aria-busy="true"`).
2. `registerAccount` delega en `InMemoryAuthGateway.register`, que tras la espera simulada (`delayMs`, por defecto `1000 ms`) verifica unicidad del correo normalizado y guarda la nueva cuenta en el arreglo en memoria compartido con `authenticate`.
3. Al recibir `{ kind: 'success', displayName }`, el reducer transiciona a `status: 'success'`:
   - Se renderiza `<Alert tone="success">¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…</Alert>` (`role="status"`).
   - El botón `"Crear cuenta"` permanece deshabilitado (`disabled`) para bloquear envíos adicionales (FR-010).
   - Un efecto en `useRegisterForm` activa un temporizador (`redirectDelayMs = 1500` ms por defecto, inyectable en pruebas) que invoca `onSuccessRedirect()`, cambiando la ruta a `/login` (Clarificación Q1, FR-009).
4. Una vez en `/login`, el usuario puede ingresar el correo y contraseña recién registrados y acceder inmediatamente a la vista de bienvenida (`WelcomeView`) con su nombre completo.

### 4. Solución de Diseño Responsive (Desktop 2 Paneles vs. Mobile 1 Panel)

- Se reutiliza el layout responsive de `LoginScreen.module.css` y `BrandPanel.module.css`:
  - **Desktop (`@media (min-width: 960px)`)**:
    - El contenedor principal aplica `display: grid; grid-template-columns: 43% 1fr;` (y `grid-template-columns: 620px 1fr;` en `@media (min-width: 1280px)`).
    - **Panel izquierdo (`BrandPanel`)**: visible con altura completa (`min-height: 100dvh`), degradado `var(--brand-gradient)`, titular `"Tu dinero, sin fronteras."` y la tarjeta ilustrativa **KynCard** (`360 × 210 px`, radio `22 px`, borde translúcido).
    - **Panel derecho (`formPanel`)**: fondo blanco `var(--neutral-0)`, centrado con contenedor `.content` de `max-width: 400px`.
  - **Mobile (`< 960 px`, desde `320 px`)**:
    - El contenedor principal aplica `display: flex; flex-direction: column; min-height: 100dvh;`.
    - En `BrandPanel.module.css`, `.headline` y `.card` (**KynCard**) tienen `display: none;` por defecto por debajo de `960 px`, dejando únicamente una cabecera compacta (`padding: 20px 24px`) con el logo KynWallet, y el formulario ocupa un único panel adaptativo (`padding: 32px 16px` en `< 480 px`) sin desplazamiento horizontal.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-usuarios/
├── plan.md              # Este archivo (/speckit-plan)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── register-gateway.md
│   └── ui-register.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root) & Archivos a Crear o Modificar

```text
src/
├── domain/
│   ├── auth.ts                                  # [MODIFICAR] Añadir RegistrationData, RegisterAccountInput, RegisterResult
│   ├── messages.ts                              # [MODIFICAR] Añadir mensajes de validación de registro, éxito y "Próximamente"
│   ├── validation.ts                            # [MODIFICAR] Añadir validateRegistration, FULL_NAME_MIN/MAX_LENGTH, RegistrationErrors
│   └── validation.test.ts                       # [MODIFICAR] Añadir pruebas unitarias de validateRegistration (nombre, correo, contraseña, coincidencia, términos)
├── application/
│   ├── ports/
│   │   └── AuthGateway.ts                       # [MODIFICAR] Añadir método register(input: RegisterAccountInput): Promise<RegisterResult>
│   ├── registerAccount.ts                       # [CREAR] Caso de uso createRegisterAccount(gateway)
│   └── registerAccount.test.ts                  # [CREAR] Pruebas unitarias del caso de uso de registro
├── infrastructure/
│   ├── InMemoryAuthGateway.ts                   # [MODIFICAR] Implementar register() sobre el almacén en memoria compartido con authenticate()
│   └── InMemoryAuthGateway.test.ts              # [MODIFICAR] Añadir pruebas de registro exitoso, correo duplicado y login inmediato post-registro
├── ui/
│   ├── styles/
│   │   └── tokens.css                           # [MODIFICAR] Añadir tokens accesibles de éxito (--success-700, --success-50)
│   ├── components/
│   │   ├── Alert/
│   │   │   ├── Alert.tsx                        # [MODIFICAR] Soportar tone: 'error' | 'info' | 'success'
│   │   │   ├── Alert.module.css                 # [MODIFICAR] Añadir estilo .success con contraste WCAG AA
│   │   │   └── Alert.test.tsx                   # [MODIFICAR] Probar variante tone="success"
│   │   └── Checkbox/
│   │       ├── Checkbox.tsx                     # [MODIFICAR] Soportar props opcionales error, ref, aria-invalid y aria-describedby
│   │       ├── Checkbox.module.css              # [MODIFICAR] Añadir estilos de mensaje de error inline bajo el checkbox
│   │       └── Checkbox.test.tsx                # [MODIFICAR] Probar estado de error accesible del checkbox
│   ├── features/
│   │   ├── login/
│   │   │   ├── LoginForm.tsx                    # [MODIFICAR] Añadir prop opcional onNavigateToRegister en el botón "Regístrate"
│   │   │   └── LoginForm.test.tsx               # [MODIFICAR] Verificar navegación a registro cuando se provee onNavigateToRegister
│   │   └── register/
│   │       ├── registerReducer.ts               # [CREAR] Máquina de estados pura para el formulario de registro
│   │       ├── registerReducer.test.ts          # [CREAR] Pruebas unitarias de transiciones y validaciones inline en blur/change/submit
│   │       ├── useRegisterForm.ts               # [CREAR] Hook de estado, envío asíncrono y temporizador de redirección automática (~1.5 s)
│   │       ├── RegisterForm.tsx                 # [CREAR] Componente de formulario fiel al frame 04 · Registro (nodo 31:2)
│   │       ├── RegisterForm.module.css          # [CREAR] Estilos del formulario de registro con tokens de Figma
│   │       └── RegisterForm.test.tsx            # [CREAR] Pruebas de integración + accesibilidad (axe-core) de todos los escenarios US1–US4
├── test/
│   └── registerStub.ts                          # [CREAR] Stub del caso de uso RegisterAccount para pruebas de UI
├── App.tsx                                      # [MODIFICAR] Enrutamiento ligero /login ↔ /register e inyección de registerAccount
├── App.test.tsx                                 # [MODIFICAR] Pruebas del flujo completo: ir a /register → crear cuenta → redirección a /login → iniciar sesión
└── main.tsx                                     # [MODIFICAR] Instanciar createRegisterAccount compartiendo la misma instancia de InMemoryAuthGateway
```

**Structure Decision**: Se conserva la arquitectura monolítica de frontend en `src/` dividida en `domain/`, `application/`, `infrastructure/` y `ui/`. El nuevo módulo de registro se ubica en `src/ui/features/register/` siguiendo exactamente la convención de `src/ui/features/login/`, reutilizando `BrandPanel` y los componentes atómicos de `src/ui/components/`.

## Complexity Tracking

> No existen violaciones nuevas de la Constitución. Se mantienen las dos decisiones aprobadas en `001-login-billetera`:

| Violación / desviación | Por qué es necesaria | Alternativa más simple rechazada porque |
|---|---|---|
| Tokens de color accesibles (`--brand-700`, `--neutral-600`, `--neutral-border`, `--success-700`) derivados de Figma | Los colores originales de Figma no alcanzan el ratio 4.5:1 sobre blanco exigido por WCAG 2.1 AA (Constitución 8.4) | Usar los colores crudos sin ajuste falla las auditorías de accesibilidad (`axe-core`) y viola 8.4 |
| Almacén de cuentas en memoria inicializado desde `.env.local` sin persistir en `localStorage` | La Constitución 5.3 y 5.4 y FR-011 prohíben almacenar contraseñas en texto plano en archivos versionados o almacenamiento del navegador | Guardar en `localStorage` expondría contraseñas en texto plano en el navegador |
