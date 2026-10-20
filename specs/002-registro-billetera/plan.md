# Implementation Plan: Pantalla de Registro de KynWallet

**Branch**: `feature/registro-julio-oria` (directorio de spec `002-registro-billetera`) | **Date**: 2026-10-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-registro-billetera/spec.md`

## Summary

Segunda pantalla de la demo solo-cliente de KynWallet, fiel al diseño de Figma (`04 · Registro`,
nodo `31:2`, captura en `design/registro.png`). Permite ingresar nombre, correo, contraseña y
confirmación, aceptar los términos, valida los campos y simula el registro: detecta correos que
ya existen en las cuentas de demostración, redirige a `/login` con un mensaje de éxito y no
persiste nada. Se construye **sobre la base del login (001)** con la misma Clean
Architecture ligera: se extiende el dominio con las reglas del registro, se añade un caso de uso
con el puerto `RegistrationGateway` y un adaptador en memoria que reutiliza las cuentas ya
cargadas, y se reutilizan los componentes de UI del login (`TextField`, `PasswordField`,
`Button`, `Divider`, `SocialButton`, `Alert`, `BrandPanel`). Cada pantalla tiene su dirección
(`/login` y `/registro`), resuelta con un enrutador mínimo propio sobre la API de historial del
navegador (sin librería de enrutamiento), como exige el taller (`taller-registro-kynwallet-v2.pdf`).
Google y Apple muestran un `alert` "Próximamente". Desarrollo guiado por pruebas con Vitest +
Testing Library.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict`), Node.js ≥ 20 LTS (sin cambios respecto a 001)

**Primary Dependencies**: React 19, Vite 8, `@fontsource-variable/inter` — **sin dependencias
nuevas**

**Storage**: N/A (estado en memoria; la cuenta creada no se persiste)

**Testing**: Vitest 5, React Testing Library, `@testing-library/user-event`, jsdom, helper
`expectNoA11yViolations` (axe-core) ya existente

**Target Platform**: Navegadores modernos (dos últimas versiones de Chrome, Firefox, Safari y
Edge), de 320 px a escritorio

**Project Type**: Aplicación web de página única (SPA), solo frontend — la misma de 001

**Performance Goals**: resultado del intento en ≤ 2 s (SC-002), con una espera simulada de 1 s

**Constraints**: sin backend, base de datos ni APIs externas; WCAG 2.1 AA; sin credenciales en
archivos versionados; sin scroll horizontal desde 320 px; sin registrar ni mostrar contraseñas

**Scale/Scope**: 1 pantalla nueva (registro), 1 hook de enrutamiento y 2 ampliaciones de
componentes compartidos (casilla con error y mensaje de éxito); modificación menor del login
(enlace "Regístrate" y mensaje de éxito)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Regla | Cumplimiento en el diseño | Estado |
|---|---|---|
| I. TDD | Cada historia empieza con pruebas que fallan (dominio → caso de uso → adaptador → componentes → pantalla); pruebas nombradas con el ID del escenario | ✅ |
| II. SOLID | `RegistrationGateway` como abstracción inyectada (DIP); componentes de una sola responsabilidad; `BrandPanel` se extiende por props sin modificar su comportamiento actual (OCP) | ✅ |
| III. Clean Architecture | Reglas de registro en `domain/`; `application/` depende solo de `domain/`; adaptador en `infrastructure/`; regla verificada por el ESLint ya configurado | ✅ |
| IV. DRY/KISS/YAGNI | Validaciones de correo y contraseña reutilizadas de `validation.ts`; textos en `messages.ts`; mismas cuentas y mismo `loadDemoAccounts`; enrutador mínimo propio en vez de librería, sin librería de formularios, sin estado global | ✅ |
| V. Seguridad | Validación en el límite; contraseña y confirmación nunca se registran ni se persisten ni salen del formulario hacia el resultado; cuentas desde `.env.local`; `secretlint` ya activo. Revelar "correo ya existe" es una decisión aceptada y documentada (clarificación 2) | ✅ con decisión documentada |
| VI. BRD/ARD | No existen (supuesto de la spec) | ✅ N/A |
| 7. Dependencias | Ninguna nueva | ✅ |
| 8.1 Pruebas | Unitarias (dominio, reducer, adaptador, caso de uso) e integración de componentes y pantalla; cobertura ≥ 80 % global (umbral ya configurado) | ✅ |
| 8.2 Convenciones | ESLint + Prettier + `tsc --noEmit` mediante `npm run verify` | ✅ |
| 8.3 Documentación | README actualizado con la navegación login/registro; contratos documentados | ✅ |
| 8.4 Accesibilidad AA | Etiquetas, errores con `aria-describedby`, foco gestionado, casilla de términos con error asociado, axe en pantalla y vista de confirmación; contraste ajustado | ⚠️ desviación de colores heredada de 001 (ver Complexity Tracking) |
| 8.5 Reutilización | Se reutilizan los componentes del login; solo se extienden `Checkbox` y `BrandPanel` | ✅ |
| 8.6 Sistema de diseño | Tokens de Figma ya existentes; el diseño de registro usa los mismos valores; se añade solo el degradado propio de la pantalla | ⚠️ misma desviación pendiente de aprobación que 001 |
| 9.2 Trazabilidad | Pruebas nombradas `US1-1`, `FR-007`…; tareas que referencian FR/US | ✅ |
| 9.3/9.4 Revisión y controles | `npm run verify` ya cubre construcción, pruebas, cobertura, análisis estático, secretos, dependencias y licencias; el repositorio ya es git | ✅ |

**Resultado del gate**: APROBADO. Las únicas desviaciones son las ya registradas en 001 (contraste
de colores del diseño, pendiente de aprobación de diseño); no se añade ninguna nueva.

**Re-check post-diseño (Phase 1)**: data-model, contratos y quickstart mantienen las mismas
conclusiones; no se introdujeron dependencias, capas ni librerías adicionales.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-billetera/
├── plan.md              # Este archivo
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── design/
│   └── registro.png     # Captura de referencia de Figma
├── contracts/
│   ├── registration-gateway.md  # Puerto de registro
│   └── ui-register.md           # Contrato observable de la UI
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

Se muestra solo lo que **cambia**; el resto de `src/` queda como en 001. `(+)` archivo nuevo,
`(~)` archivo modificado.

```text
src/
├── main.tsx                     (~) crea también el caso de uso de registro con las mismas cuentas
├── App.tsx                      (~) elige la pantalla según la ruta y guarda el mensaje de éxito
├── App.test.tsx                 (~) cubre la navegación entre pantallas
├── domain/
│   ├── auth.ts                  (~) + RegistrationData, RegistrationResult
│   ├── validation.ts            (~) + validateRegistration, límites de nombre; exporta los
│   │                                validadores de correo y contraseña ya existentes
│   ├── validation.test.ts       (~)
│   └── messages.ts              (~) + textos del registro (fuente única)
├── application/
│   ├── ports/RegistrationGateway.ts   (+)
│   ├── register.ts                    (+) caso de uso: normaliza y delega en el gateway
│   └── register.test.ts               (+)
├── infrastructure/
│   ├── InMemoryRegistrationGateway.ts       (+) detecta correos existentes; no persiste
│   └── InMemoryRegistrationGateway.test.ts  (+)
├── ui/
│   ├── components/
│   │   │   ├── Checkbox/            (~) etiqueta como contenido y mensaje de error asociado
│   │   ├── Alert/               (~) nuevo tono `success` (mensaje de éxito en el login)
│   │   └── Button/              (sin cambios; la variante `link` ya existe)
│   ├── routing/
│   │   ├── routes.ts            (+) rutas `/login` y `/registro` y normalización de direcciones
│   │   └── useRoute.ts          (+) ruta actual, `navigate` y reacción a atrás/adelante
│   ├── layout/
│   │   ├── AuthScreen/          (+) layout de dos paneles; reemplaza a LoginScreen
│   │   └── BrandPanel/          (~) recibe titular, subtexto y tono del degradado por props
│   ├── features/login/
│   │   ├── LoginScreen.tsx      (−) se mueve a layout/AuthScreen (refactor sin cambio visual)
│   │   └── LoginForm.tsx        (~) "Regístrate" navega mediante `onRegister`; muestra el
│   │                                mensaje de éxito recibido en `successMessage`
│   ├── features/register/
│   │   ├── RegisterForm.tsx           (+)
│   │   ├── registerReducer.ts         (+)
│   │   ├── useRegisterForm.ts         (+)
│   │   └── *.test.ts(x)               (+)
│   └── styles/tokens.css        (~) + degradado del panel de registro
└── test/
    └── fixtures.ts              (~) + datos de registro de prueba
```

**Structure Decision**: se extiende el proyecto único de 001 sin paquetes nuevos. El layout de dos
paneles pasa de `features/login/LoginScreen` a `layout/AuthScreen` porque ahora lo comparten dos
funcionalidades (DRY, 8.5); es un movimiento sin cambio de comportamiento, cubierto por las
pruebas existentes. Las pruebas siguen junto al código, como en 001.

## Complexity Tracking

| Violación / desviación | Por qué es necesaria | Alternativa más simple rechazada porque |
|---|---|---|
| Colores de texto, botón, enlaces y bordes distintos a los de Figma (`--brand-700`, `--neutral-600`, `--neutral-border`), igual que en el login | El diseño de registro usa los mismos tokens que ya incumplen WCAG AA (ver `specs/001-login-billetera/research.md` R3); la Constitución 8.4 es OBLIGATORIA. **Sigue requiriendo aprobación del responsable de diseño (8.6).** | Reproducir los colores exactos incumple 8.4 y SC-005 |
| Se modifica la funcionalidad 001 (enlace "Regístrate", movimiento del layout, ruta `/login` y mensaje de éxito) | Clarificación 3 y requisitos 5 y 6 del taller: sin esa navegación y ese mensaje, el registro sería inalcanzable y no podría confirmar su éxito | Dejar el login intacto deja el registro aislado y contradice FR-013 y FR-020 |
| Enrutador propio mínimo en lugar de una librería | El taller exige direcciones reales (`/login`); con 2 rutas, una librería sería una dependencia nueva (7.4) sin beneficio | `react-router`: nueva dependencia con su costo de licencia, auditoría y mantenimiento |

## Implementation Notes

- La rama de trabajo es `feature/registro-julio-oria`; los scripts de Spec Kit resuelven la
  feature desde `.specify/feature.json`, por eso reportan `002-registro-billetera`.
- Requisitos del taller que prevalecen sobre decisiones previas: éxito → redirige a `/login` con
  mensaje; Google/Apple → `alert` "Próximamente"; rutas reales `/login` y `/registro`; en móvil solo
  el formulario (el panel de marca se oculta). El resto del contrato del login no cambia.
- El diseño de registro usa un degradado propio (`70.73deg`, `#FF8A65 31.698%` → `#EF5226 83.455%`)
  distinto al del login; se conserva cada uno mediante una prop de tono en `BrandPanel`.
- Los iconos del ojo y de Google/Apple siguen siendo los marcadores de posición del diseño ya
  usados en 001 (`eye.svg`, `social-placeholder.svg`).
