# Implementation Plan: Registro de usuarios

**Branch**: `feature/registro-miguel-misericordia` | **Date**: 2026-10-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-registro-usuarios/spec.md`

## Summary

Incorporar una pantalla independiente de registro simulado que reproduzca el frame Figma
`04 · Registro` (`31:2`), valide nombre, correo, dos contraseñas y términos, y conduzca a
`/login` con un mensaje de éxito perceptible. La solución extenderá la arquitectura React
existente: reglas puras en dominio, caso de uso y puertos en aplicación, simulación sin datos
personales en infraestructura y una feature UI con reducer/hook y componentes compartidos.
No habrá API, cuenta real, almacenamiento ni dependencia nueva de formularios o routing.

## Technical Context

**Language/Version**: TypeScript 5.9 estricto; Node.js 20+

**Primary Dependencies**: React 19.3, React DOM 19.3, Vite 8.3, Inter local, CSS Modules y CSS custom properties

**Storage**: N/A; valores y avisos transitorios exclusivamente en memoria React

**Testing**: Vitest 5, React Testing Library, user-event, jsdom, axe-core y cobertura V8 (80 % actual)

**Target Platform**: SPA web; referencia 1440 × 1024 y móvil desde 320 px

**Project Type**: aplicación web de un solo proyecto, solo cliente

**Performance Goals**: resultado en máximo 2 s; recorrido válido en menos de 90 s; una operación por envío

**Constraints**: WCAG 2.1 AA; TDD; sin persistencia, red, cuentas reales ni PII en URL,
almacenamiento, telemetría o mensajes; fidelidad a Figma salvo ajustes AA; sin regresión de 001

**Scale/Scope**: una pantalla, dos rutas observables, 7 historias, 30 FR y 10 SC

## Constitution Check

*GATE: verificado antes de Phase 0 y nuevamente después del diseño de Phase 1.*

| Principio / control | Diseño previsto | Pre | Post |
|---|---|---|---|
| I. TDD | Prueba fallida antes de cada conducta; rojo-verde-refactor. | PASS | PASS |
| II. SOLID | Validadores puros, caso de uso, puertos pequeños y dependencias inyectadas. | PASS | PASS |
| III. Clean Architecture | `ui → application → domain`; adaptadores implementan puertos. | PASS | PASS |
| IV. DRY/KISS/YAGNI | Reutilización; reducer propio; History API; sin backend ficticio. | PASS | PASS |
| V. Seguridad | Validación, simulator sin payload, limpieza y resultados sin PII. | PASS | PASS |
| VI. BRD/ARD | No se hallaron BRD/ARD; rigen spec y Constitution. | PASS | PASS |
| 7. Dependencias | No se agrega dependencia; se conservan controles y lockfile. | PASS | PASS |
| 8.1–8.3 Calidad | Unitarias, integración, contrato, cobertura, lint, formato, tipos y documentación. | PASS | PASS |
| 8.4 Accesibilidad | Semántica, foco, anuncios, teclado, axe y revisión manual. | PASS | PASS |
| 8.5 Reutilización | Controles, tokens y layout actuales. | PASS | PASS |
| 8.6 Diseño | Figma `31:2`; colores insuficientes se sustituyen por tokens AA. | PASS condicionado a aprobación de diseño | Igual |
| 8.7 Observabilidad | Eventos categóricos de resultado/duración sin inputs. | PASS | PASS |
| 9.2 Trazabilidad | FR/SC → contratos → pruebas identificables. | PASS | PASS |
| 9.3–9.4 Integración | Revisión independiente y `npm run verify`; sin commit ahora. | PASS | PASS |

La aprobación pendiente no autoriza colores inaccesibles: hasta resolverla, prevalecen WCAG,
la spec y la Constitution.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-usuarios/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── registration-simulator.md
    └── ui-registration.md
```

`tasks.md` pertenece a una fase posterior y no se genera aquí.

### Source Code (repository root)

```text
src/
├── domain/
│   ├── registration.ts
│   ├── registrationValidation.ts
│   └── messages.ts
├── application/
│   ├── registerUser.ts
│   └── ports/
│       ├── RegistrationSimulator.ts
│       └── RegistrationTelemetry.ts
├── infrastructure/
│   ├── InMemoryRegistrationSimulator.ts
│   └── BrowserRegistrationTelemetry.ts
├── ui/
│   ├── components/                 # Reutilizar; ampliar Checkbox
│   ├── layout/
│   │   ├── AuthScreen/             # Layout neutral
│   │   └── BrandPanel/             # Contenido configurable
│   └── features/
│       ├── login/                  # Mantener compatible
│       └── registration/
│           ├── RegistrationScreen.tsx
│           ├── RegistrationForm.tsx
│           ├── RegistrationForm.module.css
│           ├── registrationReducer.ts
│           └── useRegistrationForm.ts
├── App.tsx                         # Frontera /register ↔ /login
└── main.tsx                        # Raíz de composición
```

Las pruebas `*.test.ts[x]` permanecen junto a cada módulo.

**Structure Decision**: extender el único proyecto y sus capas actuales. Registro no importará
internos de `features/login`; ambos consumirán layout neutral. Solo `main.tsx` conocerá
adaptadores concretos.

## Phase 0: Research Decisions

Las decisiones están en [research.md](./research.md): conservar stack; reglas en dominio;
simulador sin PII; reducer y guardia de envío; History API con flash en memoria; componentes
compatibles; Figma verificado y precedencia AA; TDD por capas y revisión visual documentada.

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md): valores, errores, resultado, estado y transiciones.
- [registration-simulator.md](./contracts/registration-simulator.md): caso de uso, simulación y telemetría.
- [ui-registration.md](./contracts/ui-registration.md): interfaz, accesibilidad, navegación y responsive.
- [quickstart.md](./quickstart.md): ejecución y aceptación.

## Estrategia TDD

1. Dominio: límites, espacios, normalización y coincidencia (FR-003–006, FR-010–014; SC-003–004).
2. Aplicación: inválidos no simulan; válidos una vez; throw → unavailable; cero PII al puerto
   (FR-012, FR-016–021; SC-002, SC-008–009).
3. Reducer/hook: blur, corrección aislada, retry, doble envío y limpieza.
4. Componentes: toggles, Checkbox/ref/error, términos y redes (FR-007–009, FR-022, FR-027–028).
5. Integración/rutas: textos, foco, Enter, éxito/error, `/login` y flash (US1–US6).
6. A11y/visual: axe y teclado; contraste, lector, reflujo y overlay a 320/1440 manuales
   (FR-001, FR-024–030; SC-005–007, SC-010).
7. Regresión: toda la suite de login y `npm run verify`.

## Trazabilidad

| Alcance | Requisitos / criterios | Diseño | Verificación |
|---|---|---|---|
| Campos/reglas | FR-002–006, FR-010–014; SC-003–004 | Modelo y validadores | Dominio/reducer |
| Contraseñas | FR-005–007, FR-019–020; SC-004–005, SC-008 | PasswordField + limpieza | Componente/integración |
| Términos/social | FR-008–009, FR-022; SC-003, SC-005 | Checkbox + status | RTL/teclado |
| Simulación | FR-012, FR-016–021; SC-001–002, SC-008–009 | Use case + simulator | Contrato/timers |
| Navegación | FR-017, FR-020, FR-023; SC-001, SC-008 | History + flash | App/rutas/privacidad |
| Visual | FR-001, FR-024–026, FR-029; SC-007, SC-010 | Layout + tokens | 320/1440 + overlay |
| A11y | FR-007, FR-010, FR-013, FR-015, FR-027–029; SC-005–006 | Semántica/foco/anuncios | axe/user-event/manual |
| Total | FR-030 | IDs US/FR/SC | Matriz + verify |

## Complexity Tracking

| Desviación / riesgo | Por qué | Alternativa rechazada |
|---|---|---|
| Tokens AA en vez de colores exactos | Los tonos Figma fallan contraste; requiere aprobación 8.6. | Copiarlos incumple WCAG y FR-029. |
| Layout neutral y BrandPanel configurable | Mismo patrón con contenido distinto sin acoplar features. | Duplicar viola DRY; importar LoginScreen acopla. |
| Puerto de telemetría categórica | Constitution 8.7 y prohibición de PII. | Registrar DTO expone PII; omitir incumple 8.7. |

## Supuestos

- `/register` será la entrada; la spec solo fija explícitamente `/login`.
- `/` conserva el login actual; el flash fijo se pierde al recargar.
- SVG existentes se reutilizan si la comparación confirma equivalencia; nunca se usan URLs MCP
  temporales en runtime.
- No se modifica `specs/001-login-billetera/` ni la Constitution.
