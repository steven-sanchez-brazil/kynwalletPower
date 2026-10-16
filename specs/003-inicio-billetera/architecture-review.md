# Revisión de arquitectura frente al proyecto original

**Fecha**: 2026-10-16. **Alcance**: Login original, Registro e Inicio de esta rama.
**Solicitud**: revisar la arquitectura planteada y la implementada, mantenerlas similares y después hacer commit y push al fork.

## Base de comparación

Repositorio original `steven-sanchez-brazil/kynwalletPower`, rama `main`, commit
`bb334ff94b508b538d2e34f809bd3c5a5996a725`, coincidente con la base local y la rama remota del fork al iniciar la revisión.
Fuentes normativas: `.specify/memory/constitution.md`, `specs/001-login-billetera/plan.md`, modelo y contratos del Login, reglas de ESLint y código de ese commit.

La base plantea Clean Architecture ligera, React/TypeScript/Vite, cuatro carpetas de capas,
casos de uso con puertos inyectados, UI con hooks/reducer, CSS Modules, pruebas junto al código
y estado en memoria. No propone un backend, router externo ni almacén global.

## Comparación y resultado

| Aspecto | Original | Implementación revisada | Resultado |
| --- | --- | --- | --- |
| Dominio | `auth.ts` con datos/resultados; `validation.ts` con reglas; `messages.ts` con textos | Registro usa `registration.ts` para valores/errores/resultado; mismas ubicaciones compartidas de validación y mensajes. `wallet.ts` define snapshot readonly | Alineado tras ajuste |
| Aplicación | `createAuthenticate(AuthGateway)` normaliza el correo, delega al puerto y maneja sus fallos | `createRegister(RegistrationGateway)` valida y maneja fallos; `readWalletOverview(WalletGateway)` consulta el snapshot local | Mismas dependencias hacia dominio |
| Infraestructura | `InMemoryAuthGateway` y carga de cuentas de configuración local | Se añaden `SimulatedRegistrationGateway` y `DemoWalletGateway`; no se instancian desde UI | Alineado |
| Composición | `main.tsx` crea adaptadores y entrega casos de uso a App | La misma raíz compone acceso, registro y snapshot | Alineado |
| UI | `ui/components`, `ui/layout`, `ui/features/login`, hooks/reducer y CSS Modules | Registro reutiliza controles y layout mediante variantes; Inicio agrega su propia composición; navegación en `ui/navigation` | Extensión de las mismas carpetas |
| Estado | Local al formulario, sin persistencia | Formulario local y sesión efímera con nombre; descarte de resultados tardíos | Mismo criterio, ampliado al nuevo flujo |
| Dependencias | React, Vite, TypeScript, herramientas de calidad existentes | `package.json` y lockfile sin dependencias adicionales | Alineado |
| Pruebas | Unitarias, integración, axe y cobertura >=80 % | Se conservan y amplían pruebas por FR/US; misma verificación completa | Alineado |
| SDD | Constitución común en `.specify/memory`; artefactos por feature en `specs/` | Se conservan 001 y se añaden 002/003 con spec/plan/tasks y evidencia | Misma estructura nativa |
| Herramientas | Spec-kit con integración Claude y scripts Bash | Adaptación solicitada a Codex/PowerShell y harness de Windows; se conservan los scripts Bash | Cambio de herramientas de desarrollo, sin cambiar arquitectura de la aplicación |

## Ajuste realizado

La revisión encontró tres diferencias de organización en Registro respecto del patrón de Login:

1. `RegistrationResult` estaba definido en `application/register.ts`. Ahora pertenece al modelo de dominio, igual que `AuthResult`.
2. `REGISTRATION_MESSAGES` estaba mezclado con tipos/reglas. Ahora está en `domain/messages.ts`, junto a los textos de Login.
3. `validateRegistration` estaba en el modelo. Ahora está en `domain/validation.ts`, reutilizando `validateCredentials` y `PASSWORD_MAX_LENGTH`.

Se ajustaron los imports de aplicación, UI y pruebas. Los contratos observables, mensajes,
límites, envío simulado, rutas y diseños se conservan. Es una refactorización sin cambio de comportamiento;
las 38 pruebas enfocadas pasaron antes y después de mover las responsabilidades.

## Diferencias intencionales que se conservan

- El puerto de Registro no recibe datos del formulario: simula una espera sin transmitir o almacenar contraseñas. Lo requiere el alcance de demo confirmado.
- La consulta del snapshot de Inicio es síncrona y se resuelve en composición. No se agrega una promesa, carga o error remoto ficticio para imitar al login.
- Los importes del snapshot son textos de muestra de Figma. No se introducen cálculo financiero, repositorios persistentes o modelos de dinero para operaciones inexistentes.
- Home usa composición propia; los formularios comparten componentes. No se fuerza el panel de Login a funcionar como dashboard.
- La selección de blancos del diseño fue solicitada explícitamente y su discrepancia de contraste está documentada. No representa conformidad AA completa.

## Verificación y entrega

ESLint comprueba las fronteras existentes de capas. La revisión de imports confirma dominio sin
React, Vite, red o UI; aplicación sin infraestructura/UI; UI sin adaptadores concretos; adaptadores creados en composición.
No se añadieron paquetes, capas, router, store ni backend.

Antes de publicar se ejecuta Verify completo, se revisa el contenido staged y se excluyen `.env.local`,
el puntero de feature, node_modules, builds y cobertura. La referencia metodológica conserva el resumen
del apunte del usuario y omite su URL corporativa privada de la entrega pública.

El usuario autoriza commit y push a `origin/feature/registro-pedro-gandola`. El destino es el fork
`Pedro2798/kynwalletPower`; no se escribe en el repositorio original ni se abre un PR en este paso.
