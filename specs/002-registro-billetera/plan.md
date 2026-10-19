# Implementation Plan: Pantalla de Registro de KynWallet

**Branch**: `002-registro-billetera` | **Date**: 2026-10-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-registro-billetera/spec.md`

## Summary

Demostración funcional del lado del cliente para la pantalla de registro de nuevos usuarios de la billetera virtual KynWallet, fiel al diseño de Figma (`02 · Registro`, nodo `31:2`). Permite ingresar Nombres Completos (obligatorio), Correo electrónico (obligatorio, formato de email con validación inline), Contraseña (obligatoria, mínimo 8 caracteres y seguridad alta con validación inline) y Confirmar contraseña (coincidencia exacta y seguridad alta con validación inline). El botón `"Crear Cuenta"` permanece deshabilitado mientras el checkbox de aceptación de términos esté en `false`. Al hacer clic en `"Crear Cuenta"`, se validan todos los campos; si son válidos, se almacena el registro en `localStorage` (con resumen criptográfico `SHA-256` de la contraseña para cumplir el Principio V de la Constitución) y se redirige a la pantalla de Login, donde la nueva cuenta queda habilitada para iniciar sesión. Los botones de Google y Apple muestran una notificación tipo Toast con el mensaje `"Próximamente"`.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict: true`), Node.js ≥ 20 LTS

**Primary Dependencies**: React 19, Vite 8, `@fontsource-variable/inter` (cero dependencias nuevas añadidas)

**Storage**: `window.localStorage` bajo la clave `kynwallet.registeredUsers` (solo datos del perfil y `passwordDigest` SHA-256; nunca contraseñas en texto plano)

**Testing**: Vitest 5, React Testing Library, `@testing-library/user-event`, jsdom, `axe-core` (`src/test/a11y.ts`), `@vitest/coverage-v8`

**Target Platform**: Navegadores modernos de escritorio y móviles (320px a 1440px+)

**Project Type**: Aplicación web de página única (SPA), solo frontend

**Performance Goals**: Validación inline en < 100 ms (SC-002); transición a Login inmediata tras persistir en `localStorage`

**Constraints**: Sin backend ni base de datos externa; cumplimiento obligatorio de WCAG 2.1 nivel AA; prohibición de almacenar o registrar contraseñas en texto plano (Constitución 5.3 y 5.4); sin desplazamiento horizontal desde 320px

**Scale/Scope**: 2 pantallas conectadas (Login y Registro), 1 nuevo componente reutilizable (`Toast`), ampliación de dominio, aplicación e infraestructura

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Regla | Cumplimiento en el diseño | Estado |
|---|---|---|
| I. TDD (No Negociable) | Cada historia de usuario inicia con pruebas automatizadas que fallan (dominio → caso de uso/adaptador → reducer → componentes UI) antes de implementar el código de producción | ✅ |
| II. SOLID | Responsabilidad única por módulo; `UserRegistrationGateway` y `AuthGateway` como abstracciones inyectadas desde `main.tsx` (DIP); componentes UI reutilizables y abiertos a extensión por props | ✅ |
| III. Clean Architecture | `src/domain/` puro (sin React ni APIs de almacenamiento); `src/application/` depende solo de `src/domain/`; `src/infrastructure/` encapsula `localStorage` y `crypto.subtle`; `src/ui/` depende solo de `application` y `domain`; verificado con ESLint `no-restricted-imports` | ✅ |
| IV. DRY/KISS/YAGNI | Se reutilizan `TextField`, `PasswordField`, `Checkbox`, `Button`, `Divider`, `SocialButton`, `BrandPanel`, `LoginScreen` y `tokens.css`; navegación entre Login y Registro con estado simple en `App.tsx` sin instalar librerías de ruteo ni de formularios | ✅ |
| V. Seguridad por Diseño | Validación estricta de longitud y formato en todos los campos; las contraseñas nunca se guardan en texto plano en `localStorage` (se guarda `passwordDigest` SHA-256, ver research R5); manejo explícito de errores de `localStorage` sin exponer trazas internas | ✅ |
| VI. BRD/ARD | No existen documentos BRD/ARD independientes; la especificación y la Constitución rigen el diseño | ✅ N/A |
| 7. Dependencias | No se añade ninguna dependencia externa nueva (`package.json` sin cambios) | ✅ |
| 8.1 Pruebas automatizadas | Pruebas unitarias de dominio, casos de uso, adaptador de `localStorage`, reducer y pruebas de integración y accesibilidad de componentes; cobertura ≥ 80 % | ✅ |
| 8.2 Convenciones de código | ESLint 9 (`strict` + `jsx-a11y`) + Prettier + `tsc --noEmit` | ✅ |
| 8.3 Documentación | Actualización de `README.md` y artefactos en `specs/002-registro-billetera/` | ✅ |
| 8.4 Accesibilidad WCAG 2.1 AA | Etiquetas asociadas, errores inline con `aria-invalid` y `aria-describedby`, Toast con `role="status"` y `aria-live="polite"`, pruebas automatizadas con `axe-core` | ✅ |
| 8.5 / 8.6 Reutilización y Sistema de Diseño | Reutilización de los componentes y tokens existentes de Figma (`tokens.css`) | ✅ |
| 9.2 Trazabilidad | Casos de prueba identificados con el código de Historia de Usuario / Requisito Funcional (`US1-1`, `US2-3`, `FR-011`, etc.) | ✅ |
| 9.4 Controles de cumplimiento | Verificación completa mediante `npm run verify` | ✅ |

**Resultado del gate**: **APROBADO**. Todas las reglas de la Constitución se cumplen sin introducir nuevas excepciones.

**Re-check post-diseño (Phase 1)**: `data-model.md`, `contracts/` y `quickstart.md` respetan la separación de capas de Clean Architecture y las restricciones de Seguridad por Diseño.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-billetera/
├── plan.md                             # Este archivo (/speckit.plan)
├── research.md                         # Decisiones técnicas y de diseño (Phase 0)
├── data-model.md                       # Entidades, validaciones y estados (Phase 1)
├── quickstart.md                       # Guía de ejecución y validación (Phase 1)
├── contracts/
│   ├── registration-gateway.md         # Contrato del puerto UserRegistrationGateway
│   └── ui-register.md                  # Contrato observable de la UI de registro
├── checklists/
│   └── requirements.md                 # Checklist de calidad de la especificación
└── tasks.md                            # Lista de tareas (/speckit.tasks - Phase 2)
```

### Source Code (repository root)

```text
src/
├── main.tsx                            # Raíz de composición: inyecta authenticate y registerUser
├── App.tsx                             # Alterna entre las vistas 'login' y 'register' dentro de LoginScreen
├── domain/
│   ├── auth.ts                         # LoginCredentials, AuthResult, DemoAccount
│   ├── registration.ts                 # RegistrationInput, RegistrationCommand, RegisteredUserRecord, RegistrationResult
│   ├── validation.ts                   # Validaciones de login y registro (incl. isStrongPassword, validateRegistration)
│   └── messages.ts                     # Textos únicos de validación, error y Toast ("Próximamente")
├── application/
│   ├── ports/
│   │   ├── AuthGateway.ts
│   │   └── UserRegistrationGateway.ts  # Puerto de persistencia de nuevos usuarios
│   ├── authenticate.ts
│   └── registerUser.ts                 # Caso de uso de registro de usuario
├── infrastructure/
│   ├── InMemoryAuthGateway.ts          # Autentica cuentas demo y usuarios registrados en localStorage
│   ├── LocalStorageUserGateway.ts      # Implementa UserRegistrationGateway sobre localStorage con hash SHA-256
│   ├── passwordHash.ts                 # Función de resumen SHA-256 unidireccional para proteger contraseñas
│   └── loadDemoAccounts.ts
├── ui/
│   ├── styles/
│   │   ├── tokens.css                  # Tokens de Figma + tokens accesibles WCAG AA
│   │   └── global.css
│   ├── components/
│   │   ├── TextField/
│   │   ├── PasswordField/
│   │   ├── Button/
│   │   ├── Checkbox/
│   │   ├── SocialButton/
│   │   ├── Divider/
│   │   ├── Alert/
│   │   └── Toast/                      # Nuevo componente reutilizable para notificación tipo Toast ("Próximamente")
│   ├── layout/
│   │   └── BrandPanel/
│   └── features/
│       ├── login/
│       │   ├── LoginScreen.tsx
│       │   ├── LoginForm.tsx           # Conecta el botón "Regístrate" con la navegación a RegisterForm
│       │   ├── WelcomeView.tsx
│       │   ├── loginReducer.ts
│       │   └── useLoginForm.ts
│       └── register/
│           ├── RegisterForm.tsx        # Formulario de registro fiel a Figma (nodo 31:2)
│           ├── RegisterForm.module.css
│           ├── registerReducer.ts      # Máquina de estados e inline validation
│           └── useRegisterForm.ts      # Hook de coordinación de estado, Toast y envío
└── test/
    ├── setup.ts
    ├── a11y.ts
    ├── fixtures.ts
    └── authStub.ts
```

**Structure Decision**: Se mantiene la arquitectura de proyecto único en la raíz con separación estricta de capas (`domain`, `application`, `infrastructure`, `ui`) verificada por ESLint (`eslint.config.js`), agregando la funcionalidad de registro como un nuevo módulo vertical (`src/ui/features/register/`, `src/domain/registration.ts`, `src/application/registerUser.ts`, `src/infrastructure/LocalStorageUserGateway.ts`) y reutilizando los componentes de UI existentes.

## Complexity Tracking

| Violación / desviación | Por qué es necesaria | Alternativa más simple rechazada porque |
|---|---|---|
| Transformación de la contraseña a `passwordDigest` (SHA-256) antes de guardar en `localStorage` | El usuario solicitó guardar el registro en `localStorage`, pero la Constitución (5.3 y 5.4) prohíbe almacenar credenciales en texto claro en reposo | Guardar la contraseña en texto plano en `localStorage` incumple la Constitución (Principio V) y SC-006 |
| Uso de tokens de color accesibles (`--brand-700`, `--neutral-600`, `--neutral-border`) heredados de `001-login-billetera` | Los tonos base de Figma no alcanzan el ratio 4.5:1 sobre blanco exigido por la Constitución 8.4 (WCAG 2.1 AA) | Usar los colores sin ajuste de luminosidad hace fallar la auditoría de contraste AA |
