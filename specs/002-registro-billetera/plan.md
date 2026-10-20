# Implementation Plan: Registro de usuarios de KynWallet

**Branch**: `feature/registro-johanrene-garcia` | **Date**: 2026-10-18 | **Spec**: [spec.md](./spec.md)

**Input**: `specs/002-registro-billetera/spec.md`, instrucciones de React, TypeScript, Vite y API ficticia con fakes; referencia técnica [plan del login](../001-login-billetera/plan.md).

## Summary

Añadir una pantalla de registro de demostración fiel a la captura local, con cuatro campos, términos, validaciones inline, contraseñas visibles bajo control, alertas sociales, simulación asíncrona y redirección a `/login`. Mantener la aplicación React existente y su arquitectura ligera por carpetas: dominio puro, caso de uso, puerto pequeño e infraestructura fake inyectada en `main.tsx`. Reutilizar componentes y herramientas ya instaladas; sin backend, base de datos, peticiones HTTP ni dependencias nuevas.

Este documento termina la fase de diseño. El código y las pruebas se escribirán mediante TDD en implementación; no se presenta el diseño como funcionalidad ya ejecutada.

## Technical Context

**Language/Version**: TypeScript ~5.9, modo estricto; React ~19.3; conservar versiones resueltas por `package-lock.json`. Node.js 22.12+ y npm compatibles con los requisitos reales de Vite instalado; el mínimo `>=20` del paquete es demasiado amplio para documentar ejecución fiable.

**Primary Dependencies**: Vite ~8.3, React DOM, Inter Variable local; CSS Modules y tokens existentes. Sin router, gestor global, biblioteca de formularios ni librería de mocking adicionales.

**Storage**: valores y estados en memoria del formulario; aviso de éxito exclusivamente en estado volátil de App. Sin cookies, localStorage, sessionStorage ni datos de formulario en History API.

**Testing**: Vitest ~5, Testing Library, user-event, jsdom, axe-core y cobertura V8 existentes. Pruebas unitarias, de contrato e integración; revisión manual visual, teclado y lector de pantalla.

**Target Platform**: navegadores modernos de escritorio y móvil, desde 320 px; dos paneles desde 1024 px. Acceso directo a `/register` y `/login`, con fallback SPA en el servidor estático.

**Project Type**: SPA frontend existente en la raíz del repositorio.

**Performance Goals**: fake con demora predeterminada de 500 ms; éxito visible en login dentro de 2 s; sin esperas reales en pruebas gracias a temporizadores controlados.

**Constraints**: Constitución 1.0.0, WCAG 2.1 AA, cero cuentas creadas o persistidas, sin datos personales en URL/diagnósticos/respuestas. Respetar el login existente y su autenticación fake. No actualizar dependencias como parte de este trabajo.

**Scale/Scope**: una pantalla nueva y navegación mínima entre dos destinos; adaptar únicamente las capacidades compartidas necesarias.

## Constitution Check

*GATE: revisado antes de investigación y tras diseño. «Conforme en diseño» no certifica ejecución ni permite omitir aprobaciones de integración.*

| Principio / regla | Decisión verificable | Gate inicial / posterior |
| --- | --- | --- |
| I. TDD | Prueba fallida antes de cada comportamiento; dominio, caso de uso, fake, formulario y navegación; defectos con reproducción y regresión | Conforme / Conforme |
| II. SOLID | `Register` inyectado en UI; `RegistrationGateway` en caso de uso; componentes con responsabilidades específicas y props opcionales compatibles | Conforme / Conforme |
| III. Clean Architecture | Mantener carpetas actuales y reglas ESLint; dominio sin React/red; reglas de registro en dominio, invocadas por presentación y caso de uso, sin duplicarlas | Conforme / Conforme |
| IV. DRY/KISS/YAGNI | Reutilizar campos, botones, tokens, fuente y validadores; History API para dos rutas; fake local sin servidor de mocks ni almacenamiento | Conforme / Conforme |
| V. Seguridad | Validación de tipo/formato/longitud al ingresar y del resultado fake; ningún envío HTTP; no conservar confirmación en solicitud; errores genéricos y diagnósticos sin datos personales | Conforme / Conforme |
| VI. BRD/ARD | No se identificaron BRD/ARD; referencia a la spec y Constitución. El plan del login se usa como antecedente, no como norma que sustituye al código actual | Conforme / Conforme |
| 7. Dependencias | Sin nuevas dependencias; lockfile conservado; auditorías de vulnerabilidades/licencias antes de integrar, sin afirmar resultados no ejecutados | Conforme / Conforme |
| 8.1 Calidad de pruebas | Umbrales actuales de 80 % para líneas, ramas, funciones y sentencias; no disminuir cobertura global; contratos de fake y aplicación comprobados | Conforme / Conforme |
| 8.2 Convenciones | TypeScript estricto, ESLint y Prettier; no desactivar controles generales para este feature | Conforme / Conforme |
| 8.3 Documentación | Actualizar README durante implementación con rutas, modo fake, requisitos y comandos; contratos y guía en este directorio | Conforme / Conforme |
| 8.4 Accesibilidad | WCAG 2.1 AA, foco, etiquetas, errores y avisos; axe más revisión manual; colores accesibles se verifican en contexto, incluido gradiente | Conforme / Conforme |
| 8.5 Reutilización | Extender opcionalmente Checkbox, PasswordField y BrandPanel; regresiones del login cubiertas | Conforme / Conforme |
| 8.6 Diseño | Captura y CSS como referencia; conservar tokens originales para decoración; ajustes AA identificados en research. La aprobación de cualquier desviación visual queda como requisito previo de integración, no como aprobación asumida | Conforme condicionado a aprobación antes de integrar / Igual |
| 8.7 Observabilidad | Eventos estructurados con nombre, resultado, duración y contador, sin payload; sink inyectado, diagnóstico local sin servicio externo | Conforme / Conforme |
| 9.1–9.8 Gobernanza | Trazabilidad FR/US → prueba; revisión por otra persona y controles completos; no se modifica Constitución ni se afirma excepción aprobada | Conforme / Conforme |

**Resultado**: se puede completar planificación sin violaciones injustificadas ni incógnitas de diseño. La integración requiere verificar controles y aprobar los cambios visuales de accesibilidad según 8.6; este plan no concede esa aprobación. El repositorio ya es Git, a diferencia de una nota histórica del plan del login.

**Revisión posterior a Phase 1**: `research.md`, `data-model.md` y contratos mantienen los límites. El fake no invoca HTTP ni crea usuarios. El éxito es volátil; ni History API ni respuestas contienen datos personales. Sin nuevas dependencias o excepciones constitucionales.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-billetera/
  spec.md
  plan.md
  research.md
  data-model.md
  quickstart.md
  contracts/
    registration-api.md
    ui-registration.md
  checklists/requirements.md
```

`tasks.md` será generado en la fase posterior mediante `$speckit-tasks`.

### Source Code (repository root)

```text
src/
  main.tsx                             # composición de login, registro y diagnóstico
  App.tsx                              # rutas, éxito volátil y popstate
  domain/
    registration.ts                    # DTO internos, errores y resultados
    registrationValidation.ts          # nombre, confirmación, términos; reglas compartidas
    validation.ts                      # extraer/exportar reglas reutilizadas sin cambiar login
    messages.ts                        # fuente única de mensajes
  application/
    register.ts                        # validar, normalizar, delegar, mapear errores
    ports/RegistrationGateway.ts
  infrastructure/
    FakeRegistrationGateway.ts         # API ficticia local, éxito/error y demora
    demoDiagnostics.ts                 # sink estructurado sin datos personales
  ui/
    components/                        # componentes existentes; cambios compatibles
      Checkbox/
      PasswordField/
      TextField/
      Button/
      Alert/
      SocialButton/
      Divider/
    layout/BrandPanel/                  # variante de contenido/gradiente para registro
    features/login/                    # integrar enlace Regístrate y aviso; autenticación sin cambios
    features/registration/
      RegistrationScreen.tsx
      RegistrationScreen.module.css
      RegistrationForm.tsx
      RegistrationForm.module.css
      useRegistrationForm.ts
      registrationReducer.ts
    styles/tokens.css                  # tokens compartidos y gradiente de registro
  test/registrationStub.ts
README.md                              # ampliar ejecución y validación
```

**Structure Decision**: conservar un proyecto y pruebas colocadas junto a cada módulo. No abstraer prematuramente `LoginScreen`: crear composición pequeña de registro con el mismo BrandPanel configurable, preservando el breakpoint 960 px del login y el 1024 px del registro.

## Complexity Tracking

| Desviación o decisión | Justificación | Alternativa descartada |
| --- | --- | --- |
| Tonos accesibles en textos, botón, enlaces y bordes | Constitución 8.4 y FR-014 prevalecen sobre réplica literal; variantes ya existen en login, pero no se presume su aprobación. Documentar y obtener aprobación de diseño antes de integrar | Copiar colores sin verificar contraste incumple AA |
| Puerto de registro y fake asíncrono | Separación mínima requerida por Constitución II–III y pedido de API ficticia sustituible | Fetch real o servidor de mocks agrega red/infraestructura innecesaria |
| Navegación pequeña con History API | Dos rutas, sin nueva dependencia; cubre carga directa, atrás/adelante y éxito efímero | Router de terceros no se justifica por el alcance actual |

## Implementation Sequence & Validation

1. Fijar pruebas de regresión del login y contratos de reglas compartidas; crear pruebas rojas de validación de registro y tipado de entradas.
2. Implementar reglas y caso de uso con puerto inyectado; fake determinista y diagnóstico; probar éxito, error y excepciones con temporizadores controlados.
3. Extender Checkbox y PasswordField mediante props opcionales; probar etiquetas, foco y compatibilidad del login. Checkbox tendrá etiqueta plana y botón de términos como hermano, evitando interacción anidada dentro de label.
4. Construir reducer/hook/formulario y layout; errores en blur/envío, revalidación cruzada, guardia síncrona contra doble envío y cancelación/ignorancia de respuestas tras desmontaje.
5. Añadir `/register`, `/login`, conservación de `/` como login y fallback de rutas desconocidas a `/login`; aviso de éxito solo en memoria. Conectar «Regístrate» del login con `/register` mediante navegación accesible, sustituyendo su aviso anterior; conservar las demás acciones y cubrir el recorrido login → registro → login con una prueba de integración.
6. Verificar referencia a 1440 × 1024, cinco anchos, ampliación y ayudas de accesibilidad. Documentar cualquier ajuste AA y su aprobación previa a integración.
7. Actualizar README y ejecutar controles existentes; registrar cobertura base y final, resultados y limitaciones. No modificar exclusiones generales de escaneo para ocultar hallazgos.

| Requisitos | Evidencia prevista |
| --- | --- |
| FR-001, FR-013 | revisión visual y responsive según quickstart, regresión del panel compartido |
| FR-002–006 | pruebas de dominio, límites, blur/envío y confirmación cruzada |
| FR-007–009 | caso de uso, contrato fake, integración App, duplicados, desmontaje y recarga |
| FR-010–012, FR-015 | user-event para alertas, enlace, foco y visibilidad independiente |
| FR-014 | axe, teclado, lector de pantalla y revisión de contraste/zoom |
| FR-016 | fake en error, excepción, reintento y comprobación de diagnóstico sin payload |

El setup oficial se ejecutó con Git Bash tras bloqueo del Bash predeterminado. Devolvió rutas válidas de este feature; su campo `BRANCH` contiene el identificador `002-registro-billetera` por resolución de `feature.json`, mientras `git branch --show-current` confirma la rama indicada arriba. No se creó ni cambió rama. Node y npm no están disponibles en el PATH de esta sesión: no se ejecutaron pruebas del producto ni se instalaron dependencias durante planificación.
## Decisión visual — 2026-10-19

El usuario indicó explícitamente mantener en blanco el texto «KynWallet», «Comienza tu camino
financiero.» y el párrafo de apoyo del panel izquierdo de registro, conservando el gradiente
original de la referencia. Se aplica `--neutral-0` (#FFFFFF) a esos tres elementos.

Esta decisión sustituye el ajuste previo a texto oscuro. Conforme a Constitución 8.8, se
prioriza el diseño para este conflicto concreto. Afecta al contraste de FR-014/SC-005: no se
declara cumplimiento completo de WCAG AA para esos textos sobre las zonas claras del gradiente.
La formalización de la excepción de 9.1, incluidos responsables y vencimiento, sigue pendiente
antes de integrar; no se inventan aprobaciones ni se cambia el resto de los requisitos.
