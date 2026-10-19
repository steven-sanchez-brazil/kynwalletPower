# Implementation Plan: Pantalla de Registro de Usuarios de KynWallet

**Branch**: `feature/registro-luciano-baez` | **Date**: 2026-10-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-registro-usuarios/spec.md`

## Summary

Pantalla de registro solo-cliente, fiel al frame `04 · Registro` de Figma, construida sobre la
base de 001 (React 19 + TypeScript + Vite, Clean Architecture ligera, TDD). Las reglas de
validación del registro viven en el dominio y reutilizan las de correo y contraseña de 001. Un
caso de uso `registerAccount` delega en un puerto `AccountRegistry`; su adaptador en memoria
agrega la cuenta a la **misma** lista que lee `InMemoryAuthGateway`, de modo que la cuenta
recién creada sirve para iniciar sesión. La navegación entre `/login` y `/registro` se resuelve
con un enrutador mínimo sobre la History API (sin dependencias nuevas). El layout de dos paneles
de 001 se generaliza para recibir el titular del panel de marca de cada pantalla.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict`), Node.js ≥ 20 LTS para herramientas

**Primary Dependencies**: React 19, Vite 8, `@fontsource-variable/inter` (sin dependencias nuevas)

**Storage**: N/A (lista de cuentas en memoria compartida entre login y registro)

**Testing**: Vitest 5, React Testing Library, `@testing-library/user-event`, jsdom, `axe-core`

**Target Platform**: navegadores modernos, de 320 px a escritorio

**Project Type**: SPA solo frontend

**Performance Goals**: resultado del registro en ≤ 2 s (SC-002) con espera simulada de 1 s

**Constraints**: sin backend; WCAG 2.1 AA; contraseñas fuera de URL, consola y almacenamiento;
sin scroll horizontal desde 320 px

**Scale/Scope**: 1 pantalla nueva (registro), 2 rutas, cambios menores en login y layout

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Regla | Cumplimiento en el diseño | Estado |
|---|---|---|
| I. TDD | Cada tarea de implementación va precedida de su prueba que falla: dominio → caso de uso → adaptador → reducer → componentes → App | ✅ |
| II. SOLID | `AccountRegistry` es un puerto separado de `AuthGateway` (ISP); se inyecta desde `main.tsx` (DIP); `AuthLayout` y `BrandPanel` se extienden por props (OCP) | ✅ |
| III. Clean Architecture | Reglas en `domain/registration*.ts`; caso de uso en `application/`; adaptador en `infrastructure/`; enrutador en `ui/routing/`; la regla ESLint por capas no cambia | ✅ |
| IV. DRY/KISS/YAGNI | Se reutilizan `validateEmail`/`validatePassword` (se exportan), `TextField`, `PasswordField`, `Button`, `SocialButton`, `Divider`, `Alert`, `BrandPanel`; enrutador de ~30 líneas en vez de `react-router` (R2) | ✅ |
| V. Seguridad | Validación por lista de permitidos del nombre; correo normalizado; mensaje de correo duplicado no afirma que el correo existe; contraseñas se vacían tras error; éxito en `history.state`, no en la URL | ✅ |
| VI. BRD/ARD | No existen (supuesto de la spec) | ✅ N/A |
| 7. Dependencias | Ninguna nueva | ✅ |
| 8.1 Pruebas | Unitarias (dominio, caso de uso, adaptador, reducer, router) e integración (RegisterForm, App); cobertura ≥ 80 % | ✅ |
| 8.2 Convenciones | ESLint + Prettier + `tsc --noEmit` | ✅ |
| 8.3 Documentación | README actualizado (rutas y registro); contratos en `contracts/` | ✅ |
| 8.4 Accesibilidad AA | Etiquetas, `aria-invalid`/`aria-describedby` (también en la casilla), foco al primer error, axe en las pruebas | ✅ |
| 8.6 Sistema de diseño | Mismos tokens de 001, incluidas sus variantes accesibles ya documentadas | ⚠️ hereda la desviación de contraste de 001 |
| 9.2 Trazabilidad | Pruebas nombradas con IDs de escenario/requisito (`US2-4`, `FR-015`); tareas referencian US/FR | ✅ |

**Resultado del gate**: APROBADO. La única desviación (colores accesibles) es la ya registrada en
001 y no se amplía.

**Re-check post-diseño (Phase 1)**: data-model y contratos no agregan dependencias ni capas; se
mantiene el resultado.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-usuarios/
├── spec.md
├── plan.md              # Este archivo
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── contracts/
│   ├── account-registry.md  # Puerto de registro
│   └── ui-registro.md       # Contrato observable de la UI y rutas
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2
```

### Source Code (cambios sobre 001)

```text
src/
├── main.tsx                         # MOD: lista de cuentas compartida + registerAccount
├── App.tsx                          # MOD: elige pantalla según la ruta
├── domain/
│   ├── messages.ts                  # MOD: textos del registro
│   ├── validation.ts                # MOD: exporta validateEmail / validatePassword
│   ├── registration.ts              # NEW: RegistrationForm, RegistrationResult
│   └── registrationValidation.ts    # NEW: validateRegistration, normalizeFullName
├── application/
│   ├── ports/AccountRegistry.ts     # NEW
│   └── registerAccount.ts           # NEW: caso de uso
├── infrastructure/
│   └── InMemoryAccountRegistry.ts   # NEW: agrega a la lista compartida (espera de 1 s)
└── ui/
    ├── routing/
    │   ├── router.ts                # NEW: ROUTES, navigate, useRoute (History API)
    │   └── Link.tsx (+ .module.css) # NEW: <a> con navegación sin recarga
    ├── components/Checkbox/         # MOD: label ReactNode, error, ref
    ├── layout/
    │   ├── BrandPanel/              # MOD: titular y texto por props
    │   └── AuthLayout/              # NEW (antes features/login/LoginScreen)
    └── features/
        ├── login/                   # MOD: "Regístrate" navega; aviso inicial de éxito
        └── register/                # NEW: RegisterForm, registerReducer, useRegisterForm
```

**Structure Decision**: se mantiene el proyecto único. `LoginScreen` pasa a ser
`layout/AuthLayout` porque ahora lo comparten dos pantallas (DRY); el panel de marca recibe sus
textos por props.

## Complexity Tracking

| Violación / desviación | Por qué es necesaria | Alternativa más simple rechazada porque |
|---|---|---|
| Enrutador propio sobre la History API | El enunciado exige rutas `/login` y `/registro` y no hay router | `react-router` agrega una dependencia (Constitución 7.4) para dos rutas; un `useState` sin URL no cumple "lleve a /login" ni Atrás/Adelante |
| `window.alert` para "Próximamente" | Pedido literal del enunciado (clarificación 2026-10-19) | El `Alert` en línea de 001 no es un "alert"; ambos son accesibles |
