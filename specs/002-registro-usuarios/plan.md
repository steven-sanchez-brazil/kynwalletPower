# Implementation Plan: Pantalla de Registro de Usuarios de KynWallet

**Branch**: `feature/registro-hebert-chavez` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-registro-usuarios/spec.md`

## Summary

Pantalla de registro de KynWallet fiel al frame `04 · Registro` de Figma (nodo `31:2`), con
nombre completo, correo, contraseña, confirmación y aceptación de términos, validación inline y
registro simulado en memoria. Un registro exitoso lleva a `/login` con un mensaje de éxito, y la
cuenta creada puede iniciar sesión durante la sesión del navegador. Se agrega navegación mínima
entre `/login` y `/registro` sobre la History API del navegador, sin librería de rutas.

Se extiende la arquitectura de `001-login-billetera`: reglas de registro en el dominio, un caso
de uso `register` con su propio puerto (`RegistrationGateway`), el adaptador en memoria existente
ampliado para registrar cuentas, y una feature de UI que reutiliza todos los componentes del
login. El layout de dos paneles se generaliza para servir a ambas pantallas.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict`), Node.js ≥ 20 LTS para herramientas

**Primary Dependencies**: React 19, Vite 8, `@fontsource-variable/inter` (sin dependencias nuevas)

**Storage**: memoria del adaptador `InMemoryAuthGateway` (se pierde al recargar)

**Testing**: Vitest 5, React Testing Library, `@testing-library/user-event`, jsdom, `axe-core`
(helper `src/test/a11y.ts`), `@vitest/coverage-v8`

**Target Platform**: navegadores modernos, de 320 px a escritorio

**Project Type**: aplicación web de página única (SPA), solo frontend

**Performance Goals**: resultado del registro en ≤ 2 s (SC-002), con espera simulada de 1 s

**Constraints**: sin backend ni base de datos; WCAG 2.1 AA; sin credenciales versionadas; sin
scroll horizontal desde 320 px; el servidor de desarrollo y `vite preview` sirven `index.html`
en cualquier ruta (fallback SPA)

**Scale/Scope**: 2 rutas (`/login`, `/registro`), 1 formulario nuevo, ~4 componentes nuevos o
modificados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Regla | Cumplimiento en el diseño | Estado |
|---|---|---|
| I. TDD | Cada historia empieza con pruebas que fallan: dominio → caso de uso → adaptador → reducer → formulario → App | ✅ |
| II. SOLID | `RegistrationGateway` es un puerto separado de `AuthGateway` (ISP); el caso de uso recibe el puerto inyectado (DIP); `Checkbox` y `BrandPanel` se extienden por props (OCP) | ✅ |
| III. Clean Architecture | Reglas de registro en `domain/registration.ts`; caso de uso en `application/`; la UI no conoce el adaptador; la navegación vive en `ui/routing/` | ✅ |
| IV. DRY/KISS/YAGNI | Se reutilizan validadores de correo y contraseña, mensajes, componentes y layout; navegación con History API en ~40 líneas en vez de una librería de rutas (research R1) | ✅ |
| V. Seguridad | Validación en el límite; la contraseña nunca se registra, se muestra ni se persiste fuera de memoria; las cuentas demo siguen en `.env.local` | ✅ (ver research R4 sobre enumeración) |
| VI. BRD/ARD | No existen | ✅ N/A |
| 7. Dependencias | Ninguna dependencia nueva | ✅ |
| 8.1 Pruebas | Unitarias (dominio, caso de uso, adaptador, reducer, router) e integración (formulario, App con adaptador real); cobertura ≥ 80 % | ✅ |
| 8.2 Convenciones | ESLint + Prettier + `tsc --noEmit` | ✅ |
| 8.3 Documentación | README actualizado con las rutas; contratos de UI y puerto documentados | ✅ |
| 8.4 Accesibilidad AA | Contrato de UI con roles y nombres; pruebas `axe-core`; tokens accesibles de 001 | ✅ |
| 8.6 Sistema de diseño | Mismos tokens y componentes que 001 (incluida su desviación de contraste pendiente de aprobación) | ⚠️ hereda desviación de 001 |
| 9.2 Trazabilidad | Pruebas nombradas con ID de escenario/requisito (`US1-1`, `FR-012`…) | ✅ |

**Resultado del gate**: APROBADO. La única desviación es la heredada de 001 (contraste), ya
documentada en su plan.

**Re-check post-diseño (Phase 1)**: data-model y contratos mantienen las mismas conclusiones; no
se agregaron dependencias ni capas.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-usuarios/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── registration-gateway.md   # Puerto de registro y caso de uso
│   └── ui-register.md            # Contrato observable de la UI y de la navegación
├── checklists/
│   └── requirements.md
└── tasks.md                      # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── main.tsx                      # MOD: inyecta también el caso de uso register
├── App.tsx                       # MOD: elige pantalla según la ruta y conecta navegación
├── domain/
│   ├── auth.ts                   # MOD: RegisterResult
│   ├── registration.ts           # NEW: RegistrationData, validateRegistration
│   ├── validation.ts             # MOD: exporta validateEmail/validatePassword, FULL_NAME_MAX_LENGTH
│   └── messages.ts               # MOD: mensajes de registro
├── application/
│   ├── ports/RegistrationGateway.ts  # NEW
│   └── register.ts               # NEW: caso de uso
├── infrastructure/
│   ├── InMemoryAuthGateway.ts    # MOD: implementa también RegistrationGateway
│   └── loadDemoAccounts.ts       # MOD: usa FULL_NAME_MAX_LENGTH del dominio
└── ui/
    ├── routing/
    │   ├── router.ts             # NEW: ROUTES, usePathname, navigate
    │   └── RouteLink.tsx         # NEW: <a> con navegación sin recarga
    ├── components/
    │   ├── Alert/                # MOD: tono success
    │   └── Checkbox/             # MOD: error, ref, contenido adicional junto a la etiqueta
    ├── layout/
    │   ├── AuthLayout/           # NEW (antes features/login/LoginScreen)
    │   └── BrandPanel/           # MOD: titular y texto por props
    └── features/
        ├── login/LoginForm.tsx   # MOD: "Regístrate" navega; muestra éxito de registro
        └── register/             # NEW
            ├── RegisterForm.tsx
            ├── RegisterForm.module.css
            ├── registerReducer.ts
            └── useRegisterForm.ts
```

**Structure Decision**: se mantiene el proyecto único de 001. `LoginScreen` pasa a
`ui/layout/AuthLayout` porque ya no es exclusivo del login. La navegación se ubica en
`ui/routing/` porque es una preocupación de presentación.

## Complexity Tracking

No hay violaciones nuevas que justificar.
