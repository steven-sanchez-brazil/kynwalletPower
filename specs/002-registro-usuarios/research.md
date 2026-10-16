# Research: Pantalla de Registro de Usuarios de KynWallet

**Feature**: `002-registro-usuarios` | **Date**: 2026-10-15

Todas las decisiones técnicas para implementar la pantalla de Registro de Usuarios (`04 · Registro`, nodo `31:2`) sobre la base de `kynwalletPower` quedan documentadas aquí.

## R1. Alineación con la arquitectura y stack existente

- **Decision**: Mantener exactamente el stack de `001-login-billetera`: React 19 + TypeScript 5.x (`strict`) + Vite 8 + CSS Modules + Vitest + React Testing Library + `axe-core`, preservando la estructura en 4 capas de Clean Architecture (`domain/`, `application/`, `infrastructure/`, `ui/`).
- **Rationale**: Garantiza cumplimiento con la Constitución (Principios I, II, III, IV y Estándar 8.5 de reutilización de componentes corporativos) sin introducir ninguna dependencia externa nueva.
- **Alternatives considered**: Añadir `react-router-dom` o `react-hook-form` (descartados por Principio IV YAGNI/KISS y Gestión de Dependencias 7.4, ya que solo existen dos rutas `/login` y `/register` y las validaciones residen en el dominio).

## R2. Navegación bidireccional (`/login` ↔ `/register`) sin dependencias externas

- **Decision**: Implementar navegación ligera basada en la History API nativa del navegador (`window.location.pathname`, `window.history.pushState` y evento `popstate`) encapsulada en `App.tsx` (o en un pequeño hook de navegación de UI), soportando las rutas `/login` (ruta por defecto si es `/`) y `/register`. Además, pasar callbacks opcionales `onNavigateToRegister` a `LoginForm` y `onNavigateToLogin` a `RegisterForm` para facilitar las pruebas de componentes de forma aislada e integrada.
- **Rationale**: Cumple FR-008 y FR-009 (redirección a `/login` y navegación recíproca desde "Regístrate" en `/login`) con 0 dependencias nuevas y máxima facilidad de prueba en `jsdom`.
- **Alternatives considered**: `react-router` (añade una dependencia externa pesada para solo alternar dos pantallas).

## R3. Almacén compartido en memoria y extensión de `AuthGateway`

- **Decision**: Extender el puerto `AuthGateway` (o añadir el método `register(input: RegisterAccountInput): Promise<RegisterResult>` en `AuthGateway` e `InMemoryAuthGateway`) y crear el caso de uso `createRegisterAccount(gateway)` en `src/application/registerAccount.ts`. `InMemoryAuthGateway` mantendrá una lista mutable interna inicializada a partir de las cuentas de `loadDemoAccounts`. Cuando `register` tiene éxito, agrega la nueva `DemoAccount` (`email` normalizado, `password`, `displayName` = `fullName.trim()`) en memoria durante la sesión activa, permitiendo que el usuario inicie sesión inmediatamente tras ser redirigido a `/login` (Clarificación Q3). Si el correo ya existe en el almacén, devuelve `{ kind: 'email-already-exists' }`.
- **Rationale**: Mantiene una única fuente de verdad de cuentas en memoria durante la sesión (`InMemoryAuthGateway`), respeta la Inversión de Dependencias (SOLID 2.5) y evita exponer o persistir contraseñas en `localStorage` o URLs (Constitución 5.3 y 5.4).
- **Alternatives considered**: Almacenar cuentas en `localStorage` (viola FR-011 y Constitución 5.3/5.4 al guardar contraseñas en texto plano en almacenamiento del navegador).

## R4. Validaciones de dominio y manejo de estado del formulario (`useRegisterForm` + `registerReducer`)

- **Decision**:
  1. **Dominio (`src/domain/validation.ts` y `src/domain/messages.ts`)**: Añadir la función pura `validateRegistration(data: RegistrationData): RegistrationErrors` que reutiliza `validateEmail` y `validatePassword` y agrega:
     - `fullName`: obligatorio tras `trim()` (`"Ingresa tu nombre completo"`), longitud entre 2 (`"Ingresa tu nombre completo"`) y 120 caracteres (`"El nombre no puede superar 120 caracteres"`).
     - `confirmPassword`: obligatorio (`"Confirma tu contraseña"`) e idéntico a `password` (`"Las contraseñas no coinciden"`).
     - `termsAccepted`: booleano obligatorio `true` (`"Debes aceptar los términos y condiciones"`).
  2. **Estado UI (`registerReducer.ts` y `useRegisterForm.ts`)**: Máquina de estados explícita (`'editing' | 'submitting' | 'registerError' | 'success'`) gestionada con `useReducer`.
     - En `blur(field)`: marca el campo como `touched` y calcula errores visibles en línea (`visibleRegistrationErrors`).
     - En `change(field, value)`: actualiza el valor y recalcula en tiempo real los errores de los campos ya `touched` (incluyendo revalidar `confirmPassword` cuando cambia `password`).
     - En `submit`: marca todos los campos como `touched` (`fullName`, `email`, `password`, `confirmPassword`, `termsAccepted`). Si hay errores, permanece en `'editing'` y devuelve el mapa de errores para que `RegisterForm` mueva el foco al primer control inválido en orden de tabulación.
- **Rationale**: Sigue exactamente el patrón probado de `loginReducer.ts` y `useLoginForm.ts`, manteniendo las reglas de negocio en `src/domain/` (Principio III Clean Architecture) y logrando validaciones inline ≤ 100 ms (SC-002).
- **Alternatives considered**: Estado disperso con múltiples `useState` en el componente (dificulta pruebas unitarias de transiciones y duplica lógica).

## R5. Simulación de mensaje de éxito y redirección automática a `/login`

- **Decision**: Cuando `registerAccount` resuelve `{ kind: 'success' }`, el reducer pasa a `status: 'success'`. En este estado:
  - El botón `"Crear cuenta"` permanece deshabilitado para impedir envíos duplicados (FR-010).
  - Se renderiza un componente `Alert` (`tone="success"` o `tone="info"` con `role="status"`) mostrando `"¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…"`.
  - Un `useEffect` en `useRegisterForm` (o `RegisterForm`) programa un temporizador configurable (`redirectDelayMs = 1500` ms por defecto) que invoca `onSuccessRedirect()` hacia `/login` y se limpia automáticamente al desmontar el componente (Clarificación Q1, FR-009, SC-003).
- **Rationale**: Cumple la clarificación Q1 acordada con el usuario, permite pruebas deterministas con `vi.useFakeTimers()` o `redirectDelayMs` inyectado y evita fugas de memoria al desmontar.
- **Alternatives considered**: Redirigir sin pausa (impide leer el mensaje de éxito en la vista de registro).

## R6. Extensión accesible de `Checkbox` y `Alert`

- **Decision**:
  - Extender `Checkbox` (`src/ui/components/Checkbox/Checkbox.tsx`) con las props opcionales `error?: string` y `ref?: Ref<HTMLInputElement>` (en React 19 `ref` es prop estándar). Cuando `error` está definido, `input` recibe `aria-invalid={true}` y `aria-describedby={errorId}`, y se muestra el mensaje de error inline bajo la casilla, igual que en `TextField` y `PasswordField`.
  - Extender `Alert` (`src/ui/components/Alert/Alert.tsx`) añadiendo la variante `tone: 'error' | 'info' | 'success'` con estilos accesibles WCAG 2.1 AA en `tokens.css` (`--success-700: #1b5e20`, `--success-50: #e8f5e9`), manteniendo `role="status"` para `info` y `success` y `role="alert"` para `error`.
- **Rationale**: Reutiliza los componentes corporativos existentes (Constitución 8.5) de forma abierta/cerrada (SOLID 2.2) sin romper las pruebas existentes de Login y garantizando 0 violaciones en `axe-core` (Constitución 8.4).
- **Alternatives considered**: Crear un componente `TermsCheckbox` duplicado (viola DRY, Principio IV).

## R7. Diseño Responsive (2 paneles en Desktop vs. 1 panel en Mobile) y tarjeta KynCard

- **Decision**: Reutilizar `BrandPanel` (`src/ui/layout/BrandPanel/BrandPanel.tsx`) que ya implementa la tarjeta ilustrativa **KynCard** (`"Kyn Card"`, chip dorado, `"5294  ••••  ••••  4827"`, `"STEVEN LUNA"`, `"12/29"`) y el layout de dos paneles (`LoginScreen` / `AuthLayout`):
  - **Desktop (`≥ 960 px`)**: CSS Grid de 2 columnas (`43% 1fr` entre `960 px` y `1279 px`, y `620px 1fr` en `≥ 1280 px`), mostrando a la izquierda el `BrandPanel` completo con degradado y **KynCard**, y a la derecha el panel del formulario (`max-width: 400px`).
  - **Mobile (`< 960 px`, desde `320 px`)**: disposición de 1 panel adaptativo donde `BrandPanel` oculta el titular y la tarjeta **KynCard** (mostrando únicamente la barra superior compacta de marca) y el panel del formulario ocupa el flujo principal sin scroll horizontal.
- **Rationale**: Garantiza paridad visual 1:1 con el frame `04 · Registro` (nodo `31:2`) de Figma y reutiliza la estructura probada de `001-login-billetera` (DRY).
- **Alternatives considered**: Duplicar `BrandPanel` dentro de `features/register` (viola Principio IV DRY y Estándar 8.5).
