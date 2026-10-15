# Implementation Plan: Pantalla de Registro de KynWallet

**Branch**: `002-registro-billetera` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-registro-billetera/spec.md`

## Summary

Segunda pantalla de la demo solo-cliente de KynWallet: formulario de registro (nombre completo,
correo, contraseña, confirmación y términos) con validación, creación de cuenta simulada y vista
de bienvenida o mensaje de error. Se construye **sobre el proyecto existente** de la feature 001
(React 19 + TypeScript + Vite 8, Clean Architecture ligera) reutilizando sus componentes de UI,
tokens, panel de marca, reglas de validación de correo y carga de cuentas de demostración. Se
añade un caso de uso `register` con el puerto `RegistrationGateway`, un adaptador en memoria que
rechaza correos ya existentes, y una segunda entrada de la app (`register.html`) para no
introducir un enrutador (YAGNI). TDD con Vitest + Testing Library.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict`), Node.js ≥ 20 LTS (igual que 001)

**Primary Dependencies**: React 19, Vite 8, `@fontsource-variable/inter` — **sin dependencias
nuevas**

**Storage**: N/A (memoria; nada se persiste)

**Testing**: Vitest 5, React Testing Library, `user-event`, jsdom, `axe-core` (helper existente),
cobertura v8 ≥ 80 %

**Target Platform**: Navegadores modernos, de 320 px a escritorio

**Project Type**: SPA solo frontend (proyecto único en la raíz del repositorio)

**Performance Goals**: resultado en ≤ 2 s (SC-002), espera simulada de 1 s

**Constraints**: sin backend ni APIs externas; WCAG 2.1 AA; sin credenciales en archivos
versionados; sin scroll horizontal desde 320 px

**Scale/Scope**: 1 pantalla con 2 vistas (formulario y bienvenida); 1 componente de UI nuevo
(ajuste a `Checkbox`) y reutilización del resto

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Regla | Cumplimiento en el diseño | Estado |
|---|---|---|
| I. TDD | Pruebas primero por capa: dominio → caso de uso/adaptador → reducer → componentes; nombradas con IDs `US#-#` / `FR-###` | ✅ |
| II. SOLID | `RegistrationGateway` como puerto inyectado; `register` no conoce el adaptador; interfaz específica (una operación) | ✅ |
| III. Clean Architecture | Nuevas reglas en `domain/`, caso de uso en `application/`, adaptador en `infrastructure/`, UI en `ui/features/register/`; regla de dependencias vigilada por ESLint existente | ✅ |
| IV. DRY/KISS/YAGNI | Reutiliza `normalizeEmail`, `isValidEmail`, `loadDemoAccounts`, componentes y tokens; sin router, sin librería de formularios (R1, R5) | ✅ |
| V. Seguridad | Validación en el límite; error genérico que no confirma existencia de cuentas; contraseñas nunca registradas ni persistidas; cuentas de `.env.local` | ✅ |
| VI. BRD/ARD | No existen (supuesto de la spec) | ✅ N/A |
| 7. Dependencias | Ninguna nueva en el plan inicial. Revisión 2026-10-15 (b): `react-router ~8.4.0` (MIT), justificada en research R10 y en Complexity Tracking | ✅ con justificación |
| 8.1 Pruebas / 8.2 Convenciones | Mismos controles `npm run verify` | ✅ |
| 8.3 Documentación | README actualizado con ejecución local de ambas pantallas | ✅ |
| 8.4 Accesibilidad AA | `aria-invalid`/`aria-describedby`, errores anunciados, `axe-core` en pruebas de componentes; tokens accesibles derivados de 001 | ⚠️ desviación de colores heredada (ver Complexity Tracking) |
| 8.5/8.6 Reutilización y diseño | Componentes y tokens de 001; diseño de Figma pendiente de consulta (R6) | ⚠️ ver R6 |
| 9.2 Trazabilidad | IDs de escenarios/FR en nombres de pruebas y tareas | ✅ |
| 9.3/9.4 Revisión y controles | Repositorio git ya inicializado; `verify` con todos los controles | ✅ |

**Resultado del gate**: APROBADO con las desviaciones ya aprobadas/pendientes de 001 (contraste) y
una acción previa: consultar Figma (nodo `31:2`) al inicio de la implementación.

**Re-check post-diseño (Phase 1)**: data-model, contratos y quickstart no añaden dependencias,
capas ni abstracciones adicionales; mismas conclusiones.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-billetera/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── registration-gateway.md   # puerto y caso de uso
│   └── ui-register.md            # contrato observable de la UI
├── checklists/requirements.md
└── tasks.md                      # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

Solo se listan archivos nuevos (N) o modificados (M); el resto de 001 no cambia.

```text
register.html                         # N: segunda entrada de Vite (sin router)
vite.config.ts                        # M: build.rollupOptions.input con index.html y register.html
src/
├── registerMain.tsx                  # N: raíz de composición del registro
├── RegisterApp.tsx                   # N: LoginScreen (layout) + RegisterForm
├── domain/
│   ├── registration.ts               # N: RegistrationRequest, RegistrationResult
│   ├── validation.ts                 # M: validateRegistration, isValidFullName, política de contraseña
│   └── messages.ts                   # M: textos de registro (fuente única)
├── application/
│   ├── ports/RegistrationGateway.ts  # N
│   └── register.ts                   # N: caso de uso (normaliza y delega; error → 'unavailable')
├── infrastructure/
│   └── InMemoryRegistrationGateway.ts # N: duplicado → 'rejected'; reutiliza loadDemoAccounts
├── ui/
│   ├── components/Checkbox/          # M: props opcionales error / describedBy
│   └── features/register/            # N
│       ├── RegisterForm.tsx
│       ├── RegisterWelcomeView.tsx
│       ├── registerReducer.ts
│       └── useRegisterForm.ts
└── test/fixtures.ts, registerStub.ts # M/N: datos ficticios y caso de uso falso
```

**Structure Decision**: se extiende el proyecto único existente. Dos entradas HTML (`index.html`
para el login, `register.html` para el registro) comparten componentes, tokens y dominio. Las
pruebas viven junto al código (`*.test.ts(x)`), como en 001.

## Complexity Tracking

| Violación / desviación | Por qué es necesaria | Alternativa más simple rechazada porque |
|---|---|---|
| Colores accesibles distintos a Figma (`--brand-700`, `--neutral-600`, `--neutral-border`), heredados de 001 | WCAG AA es OBLIGATORIO (8.4); requiere aprobación del responsable de diseño (8.6), ya solicitada en 001 | Copiar colores exactos incumple 8.4 |
| Cuentas de demostración en `.env.local` (no "en el código") | Constitución 5.3 y FR-014 | Arreglo en el código requeriría excepción 9.1 |
| ~~Segunda entrada HTML en lugar de una sola SPA con enrutador~~ (sustituida 2026-10-15 (b)) | Evitaba una dependencia mientras no había requisito de rutas | — |
| Dependencia nueva `react-router ~8.4.0` (2026-10-15 (b)) | Requisitos del responsable del producto: rutas `/login` y `/registro` y redirección con mensaje de éxito sin persistir datos (research R10) | `/?registro=exitoso` no cumple la ruta `/login` y expone el indicador en la URL; un enrutador propio duplica una librería madura (IV, 8.5) |
| Desviación del requisito "mobile: solo formulario" | Decisión del responsable del producto: se mantiene la franja con el logo (FR-018 de 001) | Quitarla cambiaría también el login, cuyo FR-018 exige el logo visible |

## Open Items

- **Figma** (resuelto 2026-10-15): el nodo `31:2` se consultó en una copia del archivo; textos,
  medidas y tokens quedaron en `research.md` R6. Único token nuevo: `--brand-gradient-register`.
- **Pendiente**: ejecución manual interactiva de los 14 escenarios de `quickstart.md` (T039).
- **Cambio de alcance 2026-10-15**: "Inicia sesión" y "Regístrate" navegan entre las dos
  pantallas (002 US6/FR-022, 001 US6/FR-020). Re-check de la Constitución: sin dependencias ni
  capas nuevas (4.2, 7.4); enlaces con rol `link` (8.4); pruebas primero (I); trazabilidad en
  Phase 9 de `tasks.md` (9.2). La decisión "sin enrutador" se mantiene (research R1, R9).
- **Cambio de alcance 2026-10-15 (b)** — requisitos funcionales del responsable del producto:
  React Router (`/login`, `/registro`), registro exitoso → `/login` con mensaje, Google/Apple →
  "Próximamente", reglas de validación estrictas sin cambios y franja del logo en móvil sin
  cambios. Sustituye la nota anterior sobre "sin enrutador". Re-check de la Constitución:
  dependencia justificada (7.4, research R10); sin capas nuevas: el enrutado vive en la UI y en la
  raíz de composición (III); pruebas primero (I); trazabilidad en Phase 10 de `tasks.md` (9.2).

- **2026-10-15 (c)**: el mensaje de registro exitoso pasa a un aviso emergente temporal (toast)
  propio, sin dependencias (research R11). Re-check: componente reutilizable en `ui/components`
  (8.5), WCAG AA documentado (8.4), pruebas primero (I), Phase 11 de `tasks.md` (9.2). Se elimina
  la prop `initialNotice` de `LoginForm`, que queda sin uso (4.4).
- **Formato**: `.gitattributes` (`* text=auto eol=lf`) fija LF en todas las copias de trabajo;
  `core.autocrlf=true` de Git para Windows hacía fallar `npm run format`. Sin cambios de código.

### Estructura tras 2026-10-15 (b)

```text
index.html                 # única entrada (se elimina register.html)
src/main.tsx               # única raíz de composición: authenticate + register + BrowserRouter
src/App.tsx                # Routes: /login, /registro, * → /login
src/ui/routes.ts           # ROUTES = { login: '/login', register: '/registro' }
src/ui/pages/              # LoginPage, RegisterPage: título del documento, navegación y mensaje
src/ui/components/TextLink # usa Link de React Router
# Se eliminan: register.html, src/registerMain.tsx, src/RegisterApp.tsx,
# src/ui/features/register/RegisterWelcomeView.tsx
```
