# Implementation Plan: Registro de Usuarios de KynWallet

**Branch**: `feature/registro-juan-zorrilla` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-registro-usuario/spec.md`

## Summary

Pantalla de registro de KynWallet fiel al frame `04 · Registro` de Figma (nodo `31:2`), sobre la
base de 001. Agrega reglas de validación del registro al dominio, un caso de uso `register` con
el puerto `RegistrationGateway`, un adaptador en memoria que comparte el arreglo de cuentas con
`InMemoryAuthGateway` (así la cuenta nueva puede iniciar sesión) y un enrutador mínimo sobre la
History API para `/login` y `/registro`. La UI reutiliza los componentes de 001 y generaliza la
maqueta de dos paneles en `AuthLayout`. TDD con Vitest + Testing Library.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict`), Node.js ≥ 20 LTS para herramientas

**Primary Dependencies**: React 19, Vite 8, `@fontsource-variable/inter` (sin dependencias nuevas)

**Storage**: N/A (arreglo de cuentas en memoria, compartido por login y registro)

**Testing**: Vitest 5, React Testing Library, `@testing-library/user-event`, jsdom, `axe-core`
(helper `src/test/a11y.ts`), `@vitest/coverage-v8`

**Target Platform**: Navegadores modernos, de 320 px a escritorio

**Project Type**: SPA solo frontend

**Performance Goals**: resultado del registro en ≤ 2 s (SC-002), con una espera simulada de 1 s

**Constraints**: sin backend; WCAG 2.1 AA; sin credenciales en archivos versionados; sin scroll
horizontal desde 320 px; rutas reales `/login` y `/registro` sin librería de enrutamiento

**Scale/Scope**: 2 pantallas (login con bienvenida y registro), ~4 componentes nuevos o ampliados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Regla | Cumplimiento en el diseño | Estado |
|---|---|---|
| I. TDD | Pruebas primero por historia: dominio → caso de uso → adaptador → reducer → componentes → App; nombradas con el ID del escenario | ✅ |
| II. SOLID | `RegistrationGateway` separado de `AuthGateway` (ISP); caso de uso con el puerto inyectado (DIP); `Checkbox` y `BrandPanel` extendidos por props sin cambiar su uso actual (OCP) | ✅ |
| III. Clean Architecture | Reglas del registro en `domain/registration.ts`; caso de uso en `application/`; adaptador en `infrastructure/`; enrutamiento en `ui/routing/`; la regla ESLint de capas se mantiene | ✅ |
| IV. DRY/KISS/YAGNI | Se reutilizan las reglas de correo y contraseña de 001 y el límite de 80 caracteres del nombre pasa al dominio (fuente única); enrutador propio de ~40 líneas en vez de una librería (R2); sin persistencia | ✅ |
| V. Seguridad | Validación en el límite; contraseña nunca registrada ni en la URL; cuentas nuevas solo en memoria; `secretlint` sin hallazgos | ✅ |
| VI. BRD/ARD | No existen | ✅ N/A |
| 7. Dependencias | Ninguna nueva | ✅ |
| 8.1 Pruebas | Unitarias (dominio, caso de uso, adaptador, reducer, router) e integración de componentes y App; cobertura ≥ 80 % | ✅ |
| 8.2 Convenciones | ESLint + Prettier + `tsc --noEmit` | ✅ |
| 8.3 Documentación | README, contratos y spec 001 actualizados en el mismo cambio | ✅ |
| 8.4 Accesibilidad AA | Contrato de UI por rol; `axe` en pruebas; tokens accesibles de 001 y nuevo par de éxito (5.62:1) | ✅ |
| 8.6 Sistema de diseño | Tokens de Figma de 001; mismas desviaciones de contraste ya documentadas (001 R3) | ⚠️ desviación heredada, pendiente de aprobación de diseño |
| 9.2 Trazabilidad | Tareas referencian FR/US; pruebas con IDs; PR referencia spec y tareas | ✅ |
| 9.3/9.4 Revisión y controles | `npm run verify` antes del PR; PR hacia el repositorio original | ✅ |

**Resultado del gate**: APROBADO. Sin violaciones nuevas; se hereda la desviación de contraste de
001.

**Re-check post-diseño (Phase 1)**: data-model y contratos mantienen las conclusiones. El cambio
de "Regístrate" (de aviso a navegación) y de `LoginScreen` a `AuthLayout` se refleja en la spec y
el contrato de 001.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-usuario/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── registration-gateway.md
│   ├── routing.md
│   └── ui-registro.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── main.tsx                         # + RegistrationGateway con el mismo arreglo de cuentas
├── App.tsx                          # rutas /login y /registro, mensaje de éxito
├── domain/
│   ├── registration.ts              # NUEVO: RegistrationData, RegistrationResult, validateRegistration
│   ├── validation.ts                # exporta validateEmail/validatePassword y FULL_NAME_MAX_LENGTH
│   └── messages.ts                  # + textos del registro
├── application/
│   ├── ports/RegistrationGateway.ts # NUEVO
│   └── register.ts                  # NUEVO: caso de uso
├── infrastructure/
│   ├── InMemoryRegistrationGateway.ts  # NUEVO
│   └── loadDemoAccounts.ts          # usa FULL_NAME_MAX_LENGTH del dominio
├── ui/
│   ├── routing/router.ts            # NUEVO: rutas, navigate, useRoute
│   ├── layout/AuthLayout/           # NUEVO (antes LoginScreen): dos paneles
│   ├── layout/BrandPanel/           # titular y texto por props
│   ├── components/Alert/            # + tono success
│   ├── components/Checkbox/         # + label ReactNode, error y ref
│   ├── features/login/              # LoginForm: onGoToRegister y mensaje de éxito
│   └── features/register/           # NUEVO: RegisterForm, registerReducer, useRegisterForm
└── test/registrationStub.ts         # NUEVO
```

**Structure Decision**: se mantiene el proyecto único de 001 con pruebas junto al código. El
registro es un nuevo feature de UI y un nuevo caso de uso.

## Complexity Tracking

| Violación / desviación | Por qué es necesaria | Alternativa más simple rechazada porque |
|---|---|---|
| Enrutador propio sobre la History API | El taller exige rutas reales (`/login`); dos rutas no justifican una dependencia (7.4) | `react-router` agrega una dependencia y API para dos rutas; un estado sin URL incumple el requisito 5 |
| Arreglo de cuentas compartido y mutable entre dos adaptadores | La cuenta registrada debe poder iniciar sesión (US1-3) sin acoplar los casos de uso | Un repositorio con interfaz propia agrega una capa sin necesidad hoy (YAGNI) |
