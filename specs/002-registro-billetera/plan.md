# Implementation Plan: Pantalla de Registro de Billetera Virtual (KynWallet)

**Branch**: `002-registro-billetera` | **Date**: 2026-10-20 (Actualizado) | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-registro-billetera/spec.md`, actualizada para dar soporte específico a:
1. Botones de registro con Google y Apple que muestren un alert con el texto "Próximamente" sin recargar ni alterar los datos del formulario.
2. Tras la validación exitosa de todos los campos y el registro satisfactorio, redirección automática a la pantalla de inicio de sesión (`login`) desplegando el mensaje de registro exitoso y pre-cargando el correo registrado.

---

## Summary

Implementación y refinamiento de la pantalla web de registro para la Billetera Virtual (KynWallet), reproduciendo con fidelidad el diseño de Figma (`02 · Registro`, nodo `31:2`).

El plan contempla:
1. **Validación integral y registro**: Validación inline de campos obligatorios (Nombre completo, Correo electrónico, Contraseña $\ge 8$, Confirmación idéntica y aceptación de Términos), alternancia de visibilidad de contraseñas y registro simulado desacoplado mediante Clean Architecture (`RegistrationGateway` y `AccountStore` en memoria).
2. **Alertas en botones sociales (Google y Apple)**: Al hacer clic en "Continuar con Google" o "Continuar con Apple", se despliega una notificación de tipo alert accesible (`<Alert tone="info">`) con el texto exacto `"Próximamente"`, manteniendo intactos los datos ya diligenciados en el formulario.
3. **Redirección al Login con mensaje de éxito**: Si todas las validaciones son exitosas y el registro culmina con éxito, el sistema transiciona inmediatamente a la pantalla de inicio de sesión (`LoginForm`), en donde se muestra visiblemente un alert con el mensaje de registro exitoso (`"¡Registro exitoso! Ya puedes iniciar sesión con tu nueva cuenta"` o `MESSAGES.REGISTRATION_SUCCESS`) y el campo de correo aparece pre-completado con la cuenta creada, permitiendo la autenticación inmediata.

---

## Technical Context

**Language/Version**: TypeScript 5.x (`strict`), Node.js $\ge$ 20 LTS para herramientas de desarrollo

**Primary Dependencies**: React 19, Vite 8, `@fontsource-variable/inter` (sin dependencias externas adicionales añadidas, respetando KISS y YAGNI)

**Storage**: Almacén de cuentas en memoria (`AccountStore`) inicializado con las cuentas demo de `VITE_DEMO_USERS` y enriquecido en tiempo de ejecución con las cuentas registradas, reutilizable de forma inmediata por el caso de uso de inicio de sesión (`InMemoryAuthGateway`)

**Testing**: Vitest 5, React Testing Library, `@testing-library/user-event`, jsdom, `axe-core` (accesibilidad automatizada), `@vitest/coverage-v8`

**Target Platform**: Navegadores modernos (Chrome, Firefox, Safari, Edge) en resoluciones desde 320px hasta escritorio

**Project Type**: Single Page Application (SPA), frontend web en React + TypeScript

**Performance Goals**:
- Validación inline y renderizado de retroalimentación en $< 100$ ms tras interacción
- Procesamiento simulado con retardo de ~800–1000 ms e indicador de carga accesible
- Transición fluida a la pantalla de login con renderizado inmediato del alert de registro exitoso

**Constraints**:
- Sin backend ni consumo de APIs de red externas (simulación en memoria desacoplada)
- WCAG 2.1 nivel AA como requisito obligatorio (Constitución 8.4)
- Prohibición estricta de credenciales en código fuente versionado (Constitución 5.3)
- Cero scroll horizontal desde 320px de ancho en dispositivos móviles (FR-016, SC-006)

**Scale/Scope**: 1 pantalla interactiva de registro con adaptación responsiva, integración bidireccional y traspaso de mensajes hacia la pantalla de login, ~8 componentes reutilizables y módulos de caso de uso

---

## Constitution Check

*GATE: Evaluado antes de Phase 0 y re-evaluado tras el diseño de Phase 1.*

| Principio / Regla | Cumplimiento en el diseño | Estado |
|---|---|---|
| **I. TDD (No negociable)** | Todo cambio se inicia con pruebas automatizadas que fallan (Rojo $\rightarrow$ Verde $\rightarrow$ Refactorizar). Se definen pruebas para: (1) Clic en Google/Apple muestra el alert "Próximamente" sin borrar campos; (2) Redirección a login tras registro exitoso mostrando visiblemente la alerta de éxito y el correo pre-cargado; (3) Inicio de sesión con las credenciales registradas. | ✅ APROBADO |
| **II. SOLID** | Componentes modulares con responsabilidad única; contratos desacoplados (`RegistrationGateway`, `AccountStore`); inyección de dependencias y paso limpio de propiedades (`registrationSuccessNotice`) desde `App.tsx` hacia `LoginForm`. | ✅ APROBADO |
| **III. Clean Architecture** | Capas independientes: `domain/` puro con textos centralizados en `messages.ts`; `application/` contiene casos de uso y puertos; `infrastructure/` implementa el almacén y gateways en memoria; `ui/` consume los casos de uso. | ✅ APROBADO |
| **IV. DRY / KISS / YAGNI** | Reutilización directa de componentes existentes (`Alert`, `TextField`, `PasswordField`, `Button`, `Checkbox`, `SocialButton`, `Divider`, `BrandPanel`); sin dependencias de enrutadores pesados para la transferencia del mensaje entre vistas. | ✅ APROBADO |
| **V. Seguridad por Diseño** | Validación estricta en el límite de entrada; contraseñas nunca expuestas en logs, mensajes de alerta ni URLs; soporte de enmascaramiento por defecto; escaneo con `secretlint`. | ✅ APROBADO |
| **VI. BRD / ARD** | No existen BRD ni ARD externos específicos; el diseño se alinea con la Constitución del proyecto. | ✅ APROBADO |
| **7. Gestión de Dependencias** | 0 dependencias nuevas requeridas. El proyecto utiliza las librerías ya instaladas y auditadas (licencias MIT/ISC/Apache). | ✅ APROBADO |
| **8.1 Pruebas Automatizadas** | Pruebas unitarias de dominio, reducer, gateways e integración de componentes con cobertura global $\ge 80\%$. | ✅ APROBADO |
| **8.2 Convenciones de Código** | Formateo con Prettier, linter ESLint 9 (flat config) y TypeScript en modo estricto. | ✅ APROBADO |
| **8.3 Documentación** | Documentación de contratos en `contracts/ui-register.md` y `contracts/registration-gateway.md`, guía paso a paso en `quickstart.md`. | ✅ APROBADO |
| **8.4 Accesibilidad (WCAG AA)** | Etiquetas semánticas, estados accesibles (`aria-invalid`, `aria-describedby`, `aria-busy`), alertas con `role="alert"` / `role="status"` y contrastes verificados ($\ge 4.5:1$ en textos). | ✅ APROBADO |
| **8.6 Sistema de Diseño** | Fidelidad absoluta a los tokens de Figma (`02 · Registro`, nodo `31:2`) con los tokens accesibles derivados documentados. | ✅ APROBADO |
| **9.2 Trazabilidad** | Pruebas nombradas con identificadores de requerimientos (`FR-012`, `FR-014`, `US1-1`, `US4-3`, `US5-1`, etc.). | ✅ APROBADO |
| **9.4 Controles Automatizados** | Verificación integral mediante `npm run verify` previa a la integración. | ✅ APROBADO |

**Resultado del Gate**: APROBADO. El plan respeta íntegramente la Constitución y resuelve los requerimientos solicitados sin complejidad accidental.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-billetera/
├── spec.md                  # Especificación funcional de requerimientos
├── checklists/
│   └── requirements.md      # Lista de verificación de calidad
├── plan.md                  # Este documento (Plan de implementación actualizado)
├── research.md              # Phase 0: Decisiones técnicas y contratos de alertas/redirección
├── data-model.md            # Phase 1: Entidades, modelos, estados de navegación y máquina de estados
├── quickstart.md            # Phase 1: Guía de ejecución local y matriz de validación manual
└── contracts/               # Phase 1: Contratos e interfaces
    ├── registration-gateway.md  # Contrato del puerto de registro y almacén de cuentas
    └── ui-register.md           # Contrato observable de la interfaz de registro y login
```

### Source Code Layout

```text
src/
├── main.tsx                         # Raíz de composición: inicializa AccountStore, gateways y renderiza App
├── App.tsx                          # Orquestador de vistas SPA: gestiona view ('login'|'register'), prefilledEmail y registrationSuccessNotice
├── domain/
│   ├── auth.ts                      # Tipos compartidos (LoginCredentials, DemoAccount, RegistrationData, RegisterResult)
│   ├── validation.ts                # Funciones puras de validación (correo, contraseña, coincidencia, nombre)
│   ├── validation.test.ts           # Pruebas unitarias de validación
│   └── messages.ts                  # Textos y mensajes del sistema (fuente única de verdad: COMING_SOON, REGISTRATION_SUCCESS)
├── application/
│   ├── ports/
│   │   ├── AuthGateway.ts           # Puerto de autenticación
│   │   ├── RegistrationGateway.ts   # Puerto de registro de nuevas cuentas
│   │   └── AccountStore.ts          # Contrato del almacén compartido de cuentas
│   ├── authenticate.ts              # Caso de uso: inicio de sesión
│   ├── register.ts                  # Caso de uso: registro de nuevo usuario
│   └── register.test.ts             # Pruebas unitarias del caso de uso de registro
├── infrastructure/
│   ├── InMemoryAccountStore.ts      # Almacén en memoria compartido para login y registro
│   ├── InMemoryAccountStore.test.ts # Pruebas del almacén de cuentas
│   ├── InMemoryAuthGateway.ts       # Adaptador de autenticación conectado al almacén
│   ├── InMemoryRegistrationGateway.ts # Adaptador de registro conectado al almacén
│   ├── InMemoryRegistrationGateway.test.ts # Pruebas del adaptador de registro
│   └── loadDemoAccounts.ts          # Carga de cuentas iniciales desde VITE_DEMO_USERS
├── ui/
│   ├── styles/
│   │   ├── tokens.css               # Variables de diseño de Figma y tokens accesibles
│   │   └── global.css               # Estilos globales y reseteo
│   ├── components/                  # Componentes base reutilizados
│   │   ├── TextField/
│   │   ├── PasswordField/
│   │   ├── Button/
│   │   ├── Checkbox/
│   │   ├── SocialButton/
│   │   ├── Divider/
│   │   └── Alert/                   # Componente accesible de alertas (tone: 'error' | 'info', role: 'alert' | 'status')
│   ├── layout/
│   │   └── BrandPanel/              # Panel de marca responsivo con isotipo y tarjeta
│   └── features/
│       ├── login/                   # Pantalla y componentes de inicio de sesión
│       │   ├── LoginScreen.tsx
│       │   ├── LoginForm.tsx        # Acepta registrationSuccessNotice e initialEmail y renderiza Alert accesible
│       │   └── LoginForm.test.tsx
│       └── register/                # Pantalla y componentes de registro de cuenta
│           ├── RegisterScreen.tsx   # Layout responsivo: 2 paneles en desktop, 1 en mobile
│           ├── RegisterScreen.module.css
│           ├── RegisterScreen.test.tsx
│           ├── RegisterForm.tsx     # Formulario con validaciones inline, alerta "Próximamente" para Google/Apple
│           ├── RegisterForm.module.css
│           ├── RegisterForm.test.tsx
│           ├── registerReducer.ts   # Reducer puro con la máquina de estados del formulario
│           ├── registerReducer.test.ts
│           └── useRegisterForm.ts   # Hook que expone estado, manejadores y callback onSuccess
└── test/
    ├── setup.ts                     # Configuración de Vitest y jest-dom
    ├── a11y.ts                      # Helper de auditoría de accesibilidad con axe-core
    └── fixtures.ts                  # Fixtures de cuentas y datos de prueba
```

**Structure Decision**: Se mantiene la arquitectura por capas concéntricas (`domain`, `application`, `infrastructure`, `ui`). La comunicación entre `RegisterForm` y `LoginForm` se realiza mediante elevación de estado en `App.tsx`, garantizando simplicidad, ausencia de dependencias de routing complejas y cumplimiento con los principios DRY, KISS y YAGNI.

---

## Detailed Implementation Breakdown for Target Requirements

### 1. Botones de Registro con Google y Apple con Alerta "Próximamente"
- **Componentes involucrados**: `RegisterForm.tsx`, `SocialButton.tsx`, `Alert.tsx`, `registerReducer.ts`.
- **Comportamiento**:
  - Al hacer clic en el botón "Continuar con Google" o "Continuar con Apple", se invoca la acción `showSocialNotice(MESSAGES.COMING_SOON)`.
  - El estado actualiza `socialNotice: 'Próximamente'`.
  - Se renderiza un `<Alert tone="info" role="alert">Próximamente</Alert>` inmediatamente después de los botones sociales.
  - Ningún valor de los campos de texto (`fullName`, `email`, `password`, `confirmPassword`) ni el estado de `termsAccepted` se borra o reinicia.
  - Al escribir en cualquier campo o interactuar con el formulario, la alerta se descarta de forma limpia.

### 2. Validación Exitosa, Registro Exitoso y Redirección al Login con Mensaje
- **Componentes involucrados**: `RegisterForm.tsx`, `useRegisterForm.ts`, `App.tsx`, `LoginForm.tsx`, `Alert.tsx`.
- **Comportamiento**:
  - `RegisterForm` ejecuta `validateRegistration(values)`. Si no hay errores, activa el estado de envío asíncrono (`submitting`) mostrando "Creando cuenta..." y `aria-busy="true"`.
  - El caso de uso `register` persiste la cuenta en `AccountStore` y retorna `{ kind: 'success', account: { email, displayName } }`.
  - `useRegisterForm` dispara el callback `onSuccess(account)`.
  - `App.tsx` maneja el evento en `handleRegisterSuccess`:
    1. Actualiza `prefilledEmail = account.email`.
    2. Establece `registrationSuccessNotice = MESSAGES.REGISTRATION_SUCCESS` (`"¡Registro exitoso! Redirigiendo a iniciar sesión..."` o `"¡Registro exitoso! Ya puedes iniciar sesión con tu nueva cuenta"`).
    3. Cambia la vista activa a `'login'`.
  - En la vista `'login'`, `LoginForm` recibe `registrationSuccessNotice` e `initialEmail`:
    - Muestra de forma destacada en la parte superior del formulario `<Alert tone="info" role="status">{registrationSuccessNotice}</Alert>`.
    - El campo de correo electrónico muestra pre-cargado el correo registrado.
    - El foco o cursor queda listo para ingresar la contraseña y presionar "Iniciar sesión".
    - El usuario puede iniciar sesión inmediatamente con su nueva cuenta sin fricción.

---

## Complexity Tracking

| Decisión de Diseño | Por qué es necesaria | Alternativa más simple rechazada porque |
|---|---|---|
| Elevación de estado en `App.tsx` para `registrationSuccessNotice` | Permite transferir el mensaje de registro exitoso y el correo pre-cargado hacia la pantalla de inicio de sesión (`LoginForm`) tras la redirección. | Instalar una librería externa de enrutamiento (como `react-router` o un bus de eventos global) violaría el Principio IV (KISS/YAGNI) al agregar dependencias pesadas innecesarias para una SPA de dos vistas. |
| Uso del componente `<Alert>` para "Próximamente" en lugar de `window.alert()` | Proporciona una interfaz visual integrada, accesible según WCAG 2.1 AA (`role="alert"`), testeable de forma determinista y sin bloquear el hilo principal de ejecución del navegador ni degradar la experiencia de usuario. | `window.alert()` bloquea la interfaz, no cumple con los tokens de diseño de Figma, no es accesible para lectores de pantalla y rompe la consistencia del sistema de diseño KynWallet. |
| Almacén compartido en memoria (`InMemoryAccountStore`) | Permite que la cuenta registrada se reutilice inmediatamente en el formulario de inicio de sesión sin depender de infraestructura de backend ni servicios de red externos. | Dos almacenes desacoplados impedirían que el usuario recién registrado pudiera iniciar sesión con su nueva cuenta. |
