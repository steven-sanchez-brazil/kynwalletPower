# Implementation Plan: Registro de Usuarios de KynWallet

**Branch**: `002-registro-usuarios` | **Date**: 2026-10-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-registro-usuarios/spec.md`

## Summary

Agregar un flujo de registro a la demo web existente de KynWallet, conservando el login y su
comportamiento. El registro valida nombre, correo, contraseña, confirmación y aceptación de
términos; rechaza correos duplicados; incorpora cuentas válidas solo a la colección compartida
en memoria; y navega al login con una confirmación temporal. La implementación reutiliza React,
TypeScript, los componentes accesibles y los tokens existentes, añade rutas cliente para `/`,
`/login` y `/registro`, y comparte una única instancia del gateway en memoria: `AuthGateway`
(contrato de 001) queda intacto y un puerto nuevo `RegistrationGateway`, implementado por la
misma clase, agrega las cuentas nuevas a la colección que consulta el login. El trabajo sigue
TDD y conserva la ausencia de backend y persistencia.

## Technical Context

**Language/Version**: TypeScript 5.x en modo estricto; Node.js según los requisitos efectivos
de Vite 8 (`^20.19.0 || >=22.12.0`). El `engines` actual (`>=20`) y el prerrequisito "Node
18+" del taller no coinciden con ese requisito; se alinean en la implementación (research R1).

**Primary Dependencies**: React 19, React DOM 19, Vite 8, CSS Modules,
`@fontsource-variable/inter`; React Router `^7.18.4` para las tres rutas cliente (auditoría de
vulnerabilidades y licencias superada en una copia temporal; ver research R3, la instalación real
se hace en la implementación). No añadir bibliotecas de formularios ni validación.

**Storage**: Colección mutable en memoria, inicializada con `VITE_DEMO_USERS` en `.env.local`.
Sin backend, base de datos, cookies, localStorage o sessionStorage. El registro no modifica
`.env.local` ni `.env.example`.

**Testing**: Vitest 5, React Testing Library, `user-event`, jsdom, `axe-core` con el helper
existente y coverage-v8. Pruebas co-localizadas con el código; scripts existentes de lint,
formato, typecheck, cobertura y build.

**Target Platform**: Navegadores modernos soportados por la aplicación; layout adaptable desde
320 px hasta escritorio.

**Project Type**: SPA web solo frontend, proyecto único en la raíz.

**Performance Goals**: La validación es inmediata. El alta reutiliza la espera simulada
configurable del gateway (1 s por defecto, 0 ms en pruebas) para mostrar el estado de carga y
hacer observable la protección contra doble envío (US1-5), igual que el login. La navegación a
`/login` ocurre una sola vez tras un alta satisfactoria y no se procesa un segundo envío.

**Constraints**: Mantener compatibilidad del login en `/` y permitir también `/login`; añadir
`/registro`; preservar cuentas recién registradas al navegar dentro de la sesión y perderlas
al recargar; WCAG 2.1 AA; sin secretos ni datos del formulario en logs, URL o almacenamiento;
no usar como assets de runtime archivos bajo `Docs/`, que está ignorada por Git.

**Scale/Scope**: 1 formulario nuevo y sus rutas, validación, alta simulada, mensaje temporal y
adaptación de panel de marca. Sin registro real, verificación por correo ni autenticación social.

## Constitution Check

*GATE: pasar antes de Phase 0; volver a verificar tras Phase 1.*

| Principio / Regla | Cumplimiento previsto | Estado |
|---|---|---|
| I. TDD | Escribir primero pruebas que fallen por reglas de registro, duplicados, cuenta compartida, rutas, persistencia temporal, errores y accesibilidad. | ✅ Planificado |
| II. SOLID | Casos de uso dependen de puertos; validación pura en dominio; componentes reciben acciones por props. `AuthGateway` no se amplía (2.3, 2.4): `register` vive en el puerto `RegistrationGateway` y una sola clase de infraestructura implementa ambos. | ✅ |
| III. Clean Architecture | Reglas no dependen de React/DOM; el gateway es adaptador de infraestructura; `main.tsx` compone dependencias. La regla del nombre (hoy privada en `loadDemoAccounts`) pasa al dominio como fuente única; el router solo se importa en `ui/` y `main.tsx`, lo que las reglas `no-restricted-imports` existentes ya garantizan. | ✅ |
| IV. DRY/KISS/YAGNI | Reutilizar normalización, validaciones de login y componentes existentes. Agregar solo abstracciones exigidas por compartir cuentas y navegar sin recargar. | ✅ |
| V. Seguridad | Validar entradas en dominio; contraseña solo en memoria y no en URL, logs ni almacenamiento; errores explícitos y seguros sin detalles internos. Cuentas de entorno son ficticias y visibles en el bundle cliente. El duplicado se informa explícitamente porque la spec lo exige (US2-5); es aceptable solo en esta demo sin cuentas reales. | ✅ con límite de demo |
| VI. BRD/ARD | No se identifican BRD/ARD aplicables en el repositorio. | ✅ N/A |
| 7. Dependencias | React Router `^7.18.4`: licencia MIT, publicada el 2026-09-15 con mantenedores identificables, peers `react >=18` (compatible con 19.3.0) y Node `>=20`. En una copia temporal del manifiesto y el lockfile: `npm audit --audit-level=high` con 0 vulnerabilidades y licencias de producción dentro de la lista permitida (6 MIT y 1 OFL-1.1); render con React 19.3.0 correcto. La versión queda acotada y fijada por el lockfile al implementar (7.2). | ✅ verificado; falta repetirlo con el lockfile real |
| 8.1 Pruebas | Unitarias, integración UI y contrato del gateway; coverage global no menor al umbral existente del 80 %. | ✅ |
| 8.2 Convenciones | ESLint, Prettier, TypeScript strict, build y tests existentes. | ✅ |
| 8.3 Documentación | Contratos, modelo de datos, quickstart y README se actualizan junto al comportamiento. | ✅ |
| 8.4 Accesibilidad AA | Errores asociados/anunciados, teclado, foco, axe y medición de contraste. Medido sobre el frame: todos los fallos del panel de formulario se resuelven con los tokens accesibles de 001; el texto blanco del panel de marca sobre el degradado no alcanza AA (2,0–3,1:1), problema que ya existe en 001; se mantiene el diseño original y se registra como excepción temporal (9.1), no como cumplimiento. | ⚠️ excepción aprobada, vence el 2027-01-19 |
| 8.5 Reutilización de componentes | Se reutilizan `TextField`, `PasswordField`, `Checkbox`, `Button`, `Alert`, `Divider`, `SocialButton`, `BrandPanel` y el layout de pantalla. Ajustes compatibles: `error` en `Checkbox`, nombre accesible configurable del botón de visibilidad en `PasswordField`, contenido configurable en `BrandPanel` y un `TextLink` de navegación. | ✅ |
| 8.6 Sistema de diseño | Reutilizar componentes y tokens actuales; verificar valores de control con la referencia exportada y elevar desviaciones de contraste. | ⚠️ aprobación si hay desviación |
| 8.7 Observabilidad | Los fallos inesperados del alta emiten un evento estructurado mínimo (solo código, sin valores del formulario ni contraseña) mediante un reporter inyectado; `no-console` sigue activo en el resto del código. | ✅ detalle en research R4 |
| 9.2 Trazabilidad | Pruebas identificadas con US/FR y tareas con referencias a la spec. | ✅ |
| 9.3/9.4 Revisión y controles | PR revisado y controles `npm run verify`; no integrar si alguno falla. | ✅ |
| 9.5 Verificación de plan | Esta tabla registra conformidad y decisiones pendientes. | ✅ |

**Resultado del gate**: planificación completada. El gate de dependencias (Constitución 7) se
superó para React Router `^7.18.4` en una copia temporal; se repite con el lockfile real al
implementar. La línea 8.5.0 se descarta por exigir Node >=22.22.0, incompatible con el mínimo
Node 20 declarado; Vite 8 requiere en la práctica Node ^20.19.0 o >=22.12.0, y `engines.node` se
alinea en la implementación. Para el contraste del panel de marca se mantiene el texto blanco del
diseño original como excepción temporal (9.1, research R10), aprobada el 2026-10-19 y con
vencimiento el 2027-01-19; no hay autorización para degradar accesibilidad ni versionar credenciales reales.

**Re-check post-diseño (Phase 1)**: resultado tras definir data-model, contratos y quickstart.

- Colección compartida: una instancia creada en `main.tsx` alimenta `createAuthenticate` y
  `createRegisterAccount`. El router se monta dentro de esa composición y navega sin recargar,
  por lo que no recrea el gateway; recargar la descarta (FR-013).
- Contrato de 001 intacto: `AuthGateway` y sus pruebas C1–C6 no cambian.
- No se añaden capas ni dependencias salvo el router condicional; la regla del nombre se
  centraliza en el dominio (DRY).
- Cambio asumido en el login: "Regístrate" navega a `/registro` (ver Complexity Tracking).
- Abiertos sin bloquear el plan: auditoría del router, contraste de los colores del frame de
  registro, tipografía/controles/móvil, textos propuestos y destino de los términos.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-usuarios/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── registration-gateway.md
│   └── ui-registration.md
├── checklists/
│   └── requirements.md
└── tasks.md                 # Phase 2 (/speckit-tasks), aún no generado
```

### Source Code (repository root)

```text
src/
├── main.tsx                         # crea UNA instancia del gateway, la inyecta en ambos casos de uso y monta BrowserRouter
├── App.tsx                          # rutas /, /login, /registro y * (no encontrada); recibe authenticate y registerAccount
├── domain/
│   ├── auth.ts                      # sin cambios (DemoAccount, LoginCredentials, AuthResult)
│   ├── registration.ts              # RegistrationInput, RegistrationFieldErrors, AccountCreationResult, RegistrationResult
│   ├── validation.ts                # + límite y validación del nombre (fuente única, también para loadDemoAccounts)
│   ├── registrationValidation.ts    # validateRegistration: reglas puras y orden de campos
│   └── messages.ts                  # + mensajes de registro (fuente única)
├── application/
│   ├── ports/AuthGateway.ts         # SIN CAMBIOS (contrato de 001)
│   ├── ports/RegistrationGateway.ts # register(account): Promise<AccountCreationResult>
│   └── registerAccount.ts           # caso de uso: normaliza, valida, delega y traduce fallos; recibe un reporter de diagnóstico
├── infrastructure/
│   ├── InMemoryAuthGateway.ts       # implementa AuthGateway y RegistrationGateway sobre la misma colección mutable
│   ├── consoleDiagnostics.ts        # adaptador del reporter; única excepción acotada de no-console
│   └── loadDemoAccounts.ts          # reutiliza la validación de nombre del dominio
├── ui/
│   ├── components/                  # reutilizados; Checkbox (error) y PasswordField (nombre del toggle) ajustados; TextLink nuevo
│   ├── layout/
│   │   ├── BrandPanel/              # contenido configurable (login / registro)
│   │   └── AuthScreen/              # layout compartido (hoy LoginScreen) con panel de marca configurable
│   └── features/
│       ├── login/                   # "Regístrate" pasa a enlace a /registro; recibe el aviso de registro exitoso por props
│       ├── registration/            # RegistrationScreen, RegistrationForm, registrationReducer, useRegistrationForm y pruebas
│       └── notFound/                # NotFoundScreen para rutas desconocidas
│   └── assets/                      # recursos versionados aprobados para runtime (sin importar PNG de Docs/)
└── test/                            # existentes + renderWithRouter, registerStub y fixtures de registro
```

Los nombres concretos de módulos nuevos se ajustan a los patrones existentes durante tasks;
no duplicar componentes o reglas de validación. Las pruebas se ubican junto a cada módulo.
Los PNG exportados bajo `Docs/` sirven como referencia local; cualquier asset que se use se
incorpora a `src/ui/assets/` en el cambio y no se referencia desde `Docs/`.

**Structure Decision**: proyecto único en la raíz y capas actuales. Reutilizar el gateway y
componentes existentes. React Router `^7.18.4` es la solución para las tres URL y la navegación
cliente sin recargar; se incorpora en la implementación tras repetir la auditoría con el
lockfile real.
No crear backend ni un subsistema de estado global. `AuthGateway` no se modifica: el registro
usa el puerto nuevo `RegistrationGateway`, y la misma clase de infraestructura implementa ambos
para compartir la colección.

## Test Strategy y Traceability

Las pruebas siguen el ciclo rojo → verde → refactor (Constitución 1) y viven junto al código.
Los IDs de la spec 002 (`US1-1`, `FR-008`…) coinciden con los de 001; para evitar ambigüedad,
cada prueba nueva se nombra con el prefijo `REG` (por ejemplo, `REG US2-5` o `REG FR-007`).

| Requisito | Verificación automatizada |
|---|---|
| US1-1, FR-008, FR-009 | `registerAccount.test.ts` (alta válida → `success`); `RegistrationForm.test.tsx` (navega y notifica); `App.test.tsx` (registro → `/login` con aviso) |
| US1-2, SC-002 | `App.test.tsx` con el gateway real (`delayMs: 0`): registrar e iniciar sesión → bienvenida con el nombre registrado |
| US1-3, FR-013 | `App.test.tsx`: un gateway/render nuevo (simula recarga) no conoce la cuenta; el formulario no escribe en `Storage` ni en la URL |
| US1-4 | `InMemoryAuthGateway.test.ts`: tras `register`, las cuentas iniciales siguen autenticando |
| US1-5 | `RegistrationForm.test.tsx` con stub diferido: el segundo envío se ignora; `InMemoryAuthGateway.test.ts`: dos `register` simultáneos del mismo correo → un `success` y un `duplicate-email` |
| US2-1, FR-001, FR-006 | `registrationValidation.test.ts`; `RegistrationForm.test.tsx`: errores por campo, foco en el primero, sin llamada al caso de uso |
| US2-2, FR-003, FR-004 | `registrationValidation.test.ts` (formato, 254/128/8) y `RegistrationForm.test.tsx` |
| US2-3, US2-4, FR-005 | `registrationValidation.test.ts` y formulario: confirmación (se revalida al cambiar la contraseña) y términos con error asociado al checkbox |
| US2-5, FR-007 | `registerAccount.test.ts` y `InMemoryAuthGateway.test.ts`: duplicado normalizado (mayúsculas/espacios) sin alterar la cuenta |
| US2-6 | `registrationReducer.test.ts` y formulario: corregir un campo conserva los demás |
| US3-1, FR-010, FR-016 | `App.test.tsx`: "¿Ya tienes cuenta? Inicia sesión" → `/login` y "Regístrate" del login → `/registro`, ambos sin recarga; `LoginForm.test.tsx`: "Regístrate" es un enlace |
| US3-2, FR-010 | `RegistrationForm.test.tsx`: Google/Apple → `status` "Próximamente", datos intactos, sin alta |
| US3-3, FR-011, SC-004 | Pruebas de `BrandPanel`/layout (panel presente o ausente según configuración); el desbordamiento horizontal a 320 px es verificación manual (jsdom no calcula layout) |
| US3-4, FR-012, SC-004 | Orden de tabulación en `RegistrationForm.test.tsx`; `expectNoA11yViolations` en registro, con errores y login con aviso |
| FR-002 | `registrationValidation.test.ts` y `loadDemoAccounts.test.ts` (sin regresión tras mover la regla) |
| FR-014 | `registerAccount.test.ts` (`unavailable`/`failure`) y formulario: mensaje seguro y sin éxito |
| FR-015, SC-005 | Revisión visual manual contra la exportación; tipografía y controles siguen pendientes |
| Rutas `/`, `/login`, `/registro`, `*` | `App.test.tsx` con `MemoryRouter` |

La regresión de 001 se cubre con sus pruebas existentes, con los ajustes de Implementation Notes.

## Complexity Tracking

| Violación / desviación | Por qué es necesaria | Alternativa más simple rechazada porque |
|---|---|---|
| React Router `^7.18.4` como nueva dependencia de runtime | Resuelve `/registro`, `/login`, historial y transición cliente sin reinicializar la colección. Auditoría de vulnerabilidades y licencias superada en una copia temporal (research R3); suma `cookie` y `set-cookie-parser`, ambas MIT. Falta repetirla con el lockfile real (Constitución 7). | Enlaces HTML que recargan destruyen las cuentas registradas; una solución manual duplica la gestión de historial, rutas y accesibilidad. |
| Ajuste de tokens visuales del frame | Medido: los fallos del panel de formulario se resuelven con los tokens accesibles de 001 (`--brand-700`, `--neutral-600`, `--neutral-border`), sin valores nuevos. El texto blanco del panel de marca no alcanza AA; se mantiene el diseño original como excepción temporal (9.1) aprobada el 2026-10-19, con vencimiento el 2027-01-19; también afecta al login porque `BrandPanel` es compartido. La Constitución exige AA (8.4). | Reproducir sin cambios un color que no alcance AA incumple la Constitución; cualquier desviación visual debe justificarse y aprobarse (8.6). |
| Puerto `RegistrationGateway` separado de `AuthGateway` | Mantiene intacto el contrato de 001 y respeta las interfaces específicas (2.3, 2.4): quien solo autentica no depende de `register`. Una sola clase implementa ambos para compartir la colección. | Ampliar `AuthGateway` obliga a actualizar todos sus dobles y expone `register` a consumidores que no lo usan. |
| Reporter de diagnóstico inyectado y `consoleDiagnostics` | 5.5 y 8.7 exigen no silenciar errores y registrar eventos sin datos sensibles, y `no-console` está en error. Requiere una excepción acotada de ESLint en ese único archivo (cambio de configuración a aprobar en la implementación). | Capturar y descartar el error repite lo que hace `authenticate` en 001 (incumple 5.5); `console.*` disperso rompe la regla de lint. |
| El login cambia: "Regístrate" pasa de aviso a enlace a `/registro` | Sin ese enlace, `/registro` solo se alcanzaría escribiendo la URL. Obliga a actualizar las pruebas US5-1 y FR-014 de 001. Quedó como requisito explícito FR-016 de la spec. | Mantener el aviso "Función no disponible" deja el registro inaccesible desde la UI. |
| `TextLink` nuevo y ajustes compatibles en `Checkbox`, `PasswordField` y `BrandPanel` | La navegación debe ser un enlace (`role=link`), el checkbox de términos necesita error asociado y las dos contraseñas necesitan nombres de visibilidad distintos. | Usar `Button` para navegar falla semánticamente; duplicar componentes viola 8.5 y DRY. |

## Implementation Notes

- Los usuarios nuevos y las cuentas iniciales deben autenticarse mediante la misma instancia de
  `InMemoryAuthGateway`, creada una sola vez en `main.tsx`.
- Una ruta `/login` debe representar el mismo formulario que hoy se sirve en `/`; `/` se mantiene
  como alias para no romper el acceso existente.
- La confirmación de registro vive en un estado en memoria de `App` (no en `location.state`): el
  historial del navegador conserva `history.state` al recargar y el mensaje reaparecería, lo que
  contradice la spec. Se muestra en `/login` como `Alert` `status`, se limpia al enviar el login
  o al salir de la ruta, y no contiene datos personales.
- Si un fallo inesperado requiere captura para traducirlo a un resultado de error, se debe
  informar al usuario y emitir solo un código/contexto diagnóstico no sensible a través del
  reporter inyectado (`consoleDiagnostics` en `main.tsx`); nunca se registran credenciales,
  valores del formulario ni el objeto de error si pudiera contenerlos. `no-console` sigue
  activo en todo lo demás.
- La tabla de rutas debe incluir un destino no encontrado que no renderice la vista de registro
  ni altere la colección de cuentas.
- No implementar un link legal con destino inventado: en la demo se muestra la etiqueta del
  checkbox solicitada; el contenido/destino legal sigue fuera de alcance. "términos y
  condiciones" se resalta como en el frame, pero como texto no interactivo.
- Verificar la disponibilidad y exportación de los recursos antes de su inclusión. `Docs/` está
  ignorada; no modificar `.gitignore` como atajo ni depender de recursos que no se versionen.
- Ajustar `engines.node` y la documentación de runtime en la implementación (ver Decisiones).
- Pruebas de 001 que deben actualizarse en el mismo cambio (TDD: primero la prueba roja):
  `App.test.tsx` (envolver en `MemoryRouter` y pasar `registerAccount`), US5-1 de
  `LoginForm.test.tsx` (quitar "Regístrate" de los botones con aviso y probar que es un enlace
  a `/registro`), FR-014 de `LoginForm.test.tsx` (en el orden de tabulación "Regístrate" pasa de
  botón a enlace) y los dobles que implementen el gateway. Las pruebas `C1`–`C6` del gateway no
  cambian; `loadDemoAccounts.test.ts` debe seguir en verde tras mover la regla del nombre.
- `InMemoryAuthGateway` debe copiar el arreglo de cuentas iniciales de forma superficial para no
  mutar el que entrega `loadDemoAccounts`, sin clonar sus elementos en el constructor (la prueba
  `C5` usa un objeto con un getter que lanza) y manteniendo `null` como `unavailable`.
- Alojamiento estático: `/login` y `/registro` requieren una regla de reescritura a `index.html`.
  El servidor de Vite y `vite preview` ya la aplican; el despliegue queda fuera de alcance, pero
  el README debe indicarlo (8.3).
- README: actualizar la descripción, la arquitectura y la nota de "Fuera de alcance" (registro).
- `BrandPanel`: se conserva el texto blanco del diseño original (`--on-brand-muted` en el apoyo).
  El incumplimiento de contraste es una excepción temporal (research R10); las pruebas de jsdom
  no miden contraste sobre degradados, por lo que no hay prueba automática que lo cubra.
- Foco y anuncios en SPA: al cambiar de ruta el foco pasa al encabezado `h1` de la vista nueva
  (ver contracts/ui-registration.md).
- Google/Apple muestran "Próximamente" en una región `status`, no con `window.alert`: el taller
  dice "alert", pero el login de 001 ya resuelve avisos así y es accesible.

## Decisiones (actualizado el 2026-10-19)

Resueltas:

1. **Auditoría del router**: superada en una copia temporal con Node 24.20.0 (0 vulnerabilidades,
   licencias permitidas, render correcto con React 19.3.0; research R3). Al implementar: añadir
   `"react-router": "^7.18.4"`, regenerar el lockfile real y repetir `npm run audit:deps` y
   `npm run audit:licenses`.
2. **`engines.node`**: decisión de documentarlo ahora y aplicarlo en la implementación, con
   `"node": "^20.19.0 || >=22.12.0"` en `package.json` y la corrección de "Node 18+" (taller),
   "20 LTS o superior" (README y quickstart de 001) y del quickstart de 002.
3. **Brecha de la spec**: añadido FR-016 a `spec.md` ("Regístrate" del login navega a
   `/registro`).
4. **Textos**: aprobados los propuestos en `contracts/ui-registration.md`.
5. **Tipografía, controles y móvil**: la geometría y los colores se midieron en el frame (research
   R2 y R6). En móvil, solo formulario sin logo, según el taller. Los PNG de `Docs/` no se
   importan: se reutiliza el `BrandPanel` en CSS.
6. **Términos y condiciones**: solo etiqueta, sin enlace; el texto resaltado no es interactivo.
7. **Excepción de ESLint**: aprobada, acotada a `consoleDiagnostics.ts` (`no-console`).
8. **Contraste del panel de marca**: se mantiene el texto blanco del diseño original (decisión del
   usuario, 2026-10-19). El incumplimiento de AA queda registrado como excepción temporal (9.1,
   research R10): titular 2,70:1 y apoyo 2,40:1 sobre el degradado publicado. Alcanza también al
   login. **Aprobada el 2026-10-19 por el usuario; vence el 2027-01-19.**
9. **Aprobación de diseño** (8.6): el usuario aprobó el diseño tal como está implementado, lo que
   cubre la desviación de contraste heredada de 001 (`--brand-700`, `--neutral-600`,
   `--neutral-border`) y mantiene el degradado CSS publicado.

Abiertas:

- **Vencimiento de la excepción (2027-01-19)**: al llegar, resolver con la opción C o B (research
  R10) o renovarla por escrito. Si el proyecto exige otro responsable de diseño o de
  arquitectura, debe ratificar la aprobación.
- **Degradado CSS de 001 distinto de la exportación**: se mantiene el publicado por la aprobación;
  sigue siendo una diferencia de fidelidad (SC-005) descrita en research R10.
- **Familia, pesos, altura de línea y estados** (hover, foco, error) de los controles: la
  exportación no los muestra; se verifican al implementar con revisión visual.
- **Diseño móvil**: no hay frame que lo confirme; el punto de corte de 960 px de 001 es un
  supuesto.
