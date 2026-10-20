# Evidencia de implementación · Registro

## Referencia T001

2026-10-20, Windows, Node 24.20.0, dependencias ya instaladas del lockfile. npm.cmd run test:coverage: 15 archivos, 111 pruebas pasan. Líneas 100 %, funciones 100 %, ramas 97.58 % (121/124), sentencias 98.88 % (177/179). No se modificó la política de PowerShell; se utiliza npm.cmd.

## Reglas de trabajo T002

TDD obligatorio (1.1–1.4); capas y dependencias hacia dominio (2/3); ningún dato personal en efectos/URL/persistencia (5); controles antes de integración (5.6/8.1/9.4). La matriz FR/AC/EC/SC → tareas está en tasks.md y se completará con resultados. Checklist requirements.md: 16/16, solo lectura.

## Pendientes externos

Aprobación de diseño heredada sobre tokens: no acreditada. Revisión por otra persona y estudio de usabilidad con participantes: pendientes, no se presume su realización.


## Fundamentos y US1
T003: dobles en src/test. T004: caracterización de login pasa. T005/T006: 23 fallos de aserción con export vacío, luego 48 pruebas de dominio verdes (incluido login). T009: ruta permanecía / en rojo; T010 notifica push/replace/popstate y limpia suscripciones, verde.
T011–T013: 9 fallos de contrato antes de efectos; T014/T015: formulario inexistente y selección de pantalla ausente en rojo. Tras implementación y extracción del helper de pruebas para evitar registrar suites duplicadas: 9 archivos/52 pruebas pasan (dominio, navegación, casos de uso, adaptadores, formulario, App y regresión App). AC-105/EC-013 compara autenticación real de demostración antes/después sin mutación.

## US2
T023–T026: 9 pruebas fallaron por ausencia de blur/errores/foco/mensaje de recuperación. T027–T030: implementación de feedback por control y Checkbox compatible; bloque integrado de 7 archivos/16 pruebas pasa. T031/T032: límites Unicode se mantienen verdes y errores/foco/aceptación conservados. Se corrigió el tipado del mock Register detectado por TypeScript (firma de argumentos de la prueba, sin cambio de comportamiento).

## US3 y US4
T033–T035: seis pruebas inicialmente rojas (descripciones externas, visibilidad distinguible, layout y envío anunciado). T036–T039: 18 archivos/46 pruebas verdes con axe, semántica y presentación compartida. T042 completada para pruebas automatizadas y documentación; T040 permanece pendiente de revisión manual completa y lector, aunque geometría y contraste ya tienen evidencia posterior. No se confunde axe con certificación WCAG. T041: pendiente de aprobación heredada documentado, sin excepción o aprobación inferida.
T043–T045: siete fallos esperados por ausencia de enlaces/opciones; T046–T050: 3 archivos/28 pruebas verdes. README y contrato de login actualizados solo para comportamiento aprobado. Avisos del login y autenticación previa conservados.

## Revisión en navegador

Edge headless: anchos 320/375/768/1024/1440 sin overflow; panel oculto en los tres primeros y dos columnas en desktop. Submit vacío: cinco controles inválidos, foco en fullName. Axe móvil sin violaciones; desktop dejó contraste incompleto por el gradiente. Comprobación explícita de contraste sobre extremos y alfa del texto encontró 2.0475:1–2.9525:1 (fallo antes del ajuste). Se reutilizan tonos accesibles brand-700/800 y blanco opaco, preservando coherencia entre pantallas. Aprobación de diseño aún pendiente, sin excepción constitucional.

C1/C2: 14 pruebas de controles fallaron antes de implementación y luego pasaron con node:test. Se usan los mismos contratos bajo Vitest para instrumentar los comprobadores sin duplicar su lógica de prueba. Semgrep 1.177.0 (CE) instalado aisladamente con uv; primer análisis bloqueó configuración por BOM UTF-8, sin considerarlo éxito. Se corrige codificación, no se suprime el control.

## Cierre automático y revisión preparada

Resultado final: 204 pruebas en 37 archivos pasan; los controles propios tienen 15 casos positivos/negativos. Lint, formato, tipos y build pasan. npm audit devuelve cero vulnerabilidades. SAST: 88 archivos, cuatro reglas locales, cero hallazgos y errores; fixture seguro pasa y el inseguro bloquea con las cuatro reglas. El comprobador verifica inventario completo además del código de salida. Motor Semgrep CE 1.177.0 aislado, procedencia/licencia y digest documentados en .github/security-tools.json. Sin dependencia de aplicación nueva.

Cobertura candidata: líneas 100 % (388/388), funciones 100 % (123/123), ramas 98.54 % (338/343), sentencias 99.56 % (459/461). Los 23 archivos ejecutables afectados cumplen cada umbral del 80 %. La referencia HEAD se ejecutó con la misma instrumentación, incluyendo main.tsx: 111 pruebas; líneas 96.71 % (147/152), funciones 100 %, ramas 96.03 % (121/126), sentencias 96.19 % (177/184). Ninguna métrica global disminuye, tampoco frente al baseline inicial. Inventario local identifica HEAD y candidato HEAD con worktree; CI calcula SHA base/candidato y trata renombrados. Denominadores cero se registran como no aplicables. Informes locales ignorados en artifacts/ y coverage/.

Workflow quality.yml validado como YAML, con acciones y contenedor fijados, jobs separados, sin continue-on-error. No se ha ejecutado en GitHub ni se han alterado políticas remotas. Build servido con preview: acceso directo a /register y llegada a /login, éxito en 328 ms; foco en encabezado, almacenamiento local/sesión vacíos, sin datos del formulario en solicitudes, reentrada vacía y sin repetir éxito. Reflow equivalente a zoom 200 % comprobado a 720/320/160 CSS px sin overflow tras apilar opciones sociales estrechas. Contraste corregido: 4.56:1–6.02:1. Árbol accesible incluye los cinco nombres de controles. Esto no sustituye lector de pantalla ni aprobación humana.

### Bloqueo de licencias (T053/T057)

npm run verify pasa hasta audit:licenses y termina con error por @azu/style-format@1.0.1 (WTFPL). No se amplía la política sin autorización. El escaneo de secretos se ejecuta por separado porque verify se detiene antes. La lista original sigue vigente. La auditoría ahora incluye desarrollo, revelando licencias ya presentes en el lockfile, sin agregar dependencias.

Estado por instrucción del usuario: **pendiente de revisión/autorización humana; no ampliar la allowlist, no cambiar dependencias ni introducir librerías, no modificar la Constitution**. La propuesta anterior de ampliar licencias no está autorizada y no se aplica. Se conserva únicamente como antecedente la simulación local que pasó con una lista extendida; ese resultado no constituye aprobación ni un control válido bajo la política vigente. Constitution 7.1.a exige autorización previa de licencias no aprobadas. No se declara cumplimiento completo mientras exista este bloqueo.

La comparación contra bb334ff94b508b538d2e34f809bd3c5a5996a725 (login anterior a la feature) confirma dependencies/devDependencies idénticos y ningún cambio en package-lock.json. Los 15 paquetes son heredados y están marcados dev: true. Se detectaron al retirar --production de la auditoría, no por incorporar dependencias durante esta feature. Inventario contrastado con npm ls --all y el lockfile:

| Licencia | Paquetes bloqueados y versiones | Dependencias directas / cadenas principales |
| --- | --- | --- |
| WTFPL | @azu/style-format@1.0.1 | secretlint → @secretlint/formatter → @textlint/linter-formatter → @azu/style-format |
| MIT-0 | @csstools/color-helpers@6.1.2; @csstools/css-syntax-patches-for-csstree@1.1.15 | jsdom → @asamuzakjp/css-color → @csstools/css-color-parser → color-helpers; jsdom → css-syntax-patches-for-csstree |
| Python-2.0 | argparse@2.0.1 | eslint → @eslint/eslintrc → js-yaml → argparse; secretlint → @secretlint/formatter → @textlint/linter-formatter → js-yaml → argparse |
| MPL-2.0 | axe-core@4.14.0; lightningcss@1.33.0; lightningcss-win32-x64-msvc@1.33.0 | axe-core directa y eslint-plugin-jsx-a11y → axe-core; vite → lightningcss → binario opcional de Windows |
| Artistic-2.0 | istextorbinary@9.5.0; binaryextensions@6.11.0; textextensions@6.11.0; editions@6.22.0; version-range@4.15.0 | secretlint → @secretlint/node → @secretlint/source-creator → istextorbinary → binaryextensions/textextensions/editions; binaryextensions y textextensions también → editions → version-range |
| CC-BY-4.0 | caniuse-lite@1.0.30001816 | eslint-plugin-react-hooks → @babel/core → @babel/helper-compilation-targets → browserslist → caniuse-lite |
| CC-BY-3.0 | spdx-exceptions@2.5.0; spdx-ranges@2.1.1 (MIT AND CC-BY-3.0) | license-checker-rseidelsohn → spdx-expression-parse/spdx-correct/spdx-satisfies → spdx-exceptions; spdx-satisfies → spdx-ranges (también mediante spdx-compare); secretlint → read-pkg → normalize-package-data → validate-npm-package-license → spdx-expression-parse → spdx-exceptions |

Ninguno es dependencia de runtime del producto: sirven al build, pruebas, accesibilidad, lint, secretos o auditoría. Existen además conexiones peer con vite/jsdom vía vitest, con vite vía @vitejs/plugin-react, con vitest vía @vitest/coverage-v8 y con eslint vía plugins/typescript-eslint. Quitar una declaración directa no garantiza eliminar el transitivo.

Recomendación para revisión futura, sin ejecutar cambios: evaluar primero la cadena de secretlint y después el auditor de licencias, conservando controles equivalentes; evaluar separadamente ESLint/Hooks, jsdom/axe y Vite por su mayor superficie de regresión. No se ha verificado una versión alternativa que elimine los bloqueos. No borrar transitivas manualmente, omitir desarrollo de la auditoría ni desactivar controles para obtener verde.

## Matriz de trazabilidad ejecutada

Las rutas siguientes son relativas a src/, salvo indicación. Cada fila enlaza con las tareas que figuran en la matriz de tasks.md; los tests identifican escenarios 002/FR, AC o EC. Las referencias agrupadas comparten el mismo conjunto de pruebas, sin omitir IDs.

| Requisitos / aceptación / límite | Pruebas y evidencia | Tareas |
| --- | --- | --- |
| FR-001; AC-101 | ui/features/registration/RegistrationForm.test.tsx; App.registration.test.tsx | T014–T022 |
| FR-002/007; AC-201; EC-001 | domain/registration.credentials.test.ts; RegistrationForm.inline.test.tsx; components/Checkbox/Checkbox.registration.test.tsx (bajo ui/) | T006/008/024/025/028 |
| FR-003/004; AC-202/206; EC-002/003/006 | domain/registration.identity.test.ts; domain/validation.test.ts; ui/features/registration/RegistrationForm.inline.test.tsx | T004–T008/024/031 |
| FR-005/006; AC-203/204; EC-004/005/008 | domain/registration.credentials.test.ts; ui/features/registration/registrationReducer.test.ts; RegistrationForm.inline.test.tsx en la misma carpeta | T006/008/023/027/031 |
| FR-008/009; AC-205 | ui/features/registration/RegistrationForm.inline.test.tsx y RegistrationForm.options.test.tsx | T023–T029/043/046 |
| FR-010; AC-102; EC-007 | application/register.test.ts; infrastructure/LocalRegistrationSimulation.test.ts; App.registration.test.tsx; preview 328 ms | T011/012/017–T022 |
| FR-011; AC-103/105; EC-013 | App.registration.test.tsx; App.registration.security.test.tsx: mismas credenciales aceptadas/rechazadas antes/después | T015/018/021/022/051 |
| FR-012/013/019; AC-401/402/403; EC-012 | ui/features/registration/RegistrationForm.options.test.tsx; App.registration.navigation.test.tsx; ui/features/login/LoginForm.test.tsx | T043–T050 |
| FR-014/015; AC-301/302; EC-009 | ui/layout/AuthLayout/AuthLayout.test.tsx; geometría y reflow en navegador indicados arriba | T034/037/038/040 |
| FR-016; AC-303/304/305 | App.registration.a11y.test.tsx; ui/features/registration/RegistrationForm.a11y.test.tsx; componentes TextField/PasswordField *.a11y.test.tsx; axe y árbol accesible | T025/028/033–T042; lector pendiente |
| FR-017; AC-104; EC-010 | App.registration.security.test.tsx; App.registration.navigation.test.tsx; application/register.test.ts; infrastructure/InMemoryRegistrationDiagnostics.test.ts | T013/019/021/044/048/051 |
| FR-018; AC-207; EC-011 | App.registration.failure.test.tsx; application/register.test.ts; cancelación y resolución tardía en App.registration.test.tsx | T011/018/026/030/032 |
| SC-001 | Protocolo humano siguiente, resultado pendiente | T058 |
| SC-002 | Validación de dominio e inline anteriores | T031/032 |
| SC-003 | Simulación real en preview: 328 ms; suites de envío | T022/057; cierre verify pendiente |
| SC-004/005 | Geometría, contraste, axe y foco; lector/aprobación pendientes | T040–T042 |
| SC-006 | Regresión de login y enlaces anteriores | T050 |
| SC-007 | Privacidad y equivalencia de autenticación antes/después | T051/052 |
| SC-008 | Fallo/reintento/cancelación anteriores | T026/030/032 |
| C1/C2 | scripts/controls.cases.mjs, checkSastReport.test.mjs, checkCoverage.test.mjs; src/test/controlCoverage.test.ts | T054–T057 |

## Pendientes humanos y protocolo SC-001

T040 sigue pendiente para lector de pantalla y auditoría manual completa. No hay certificación WCAG, aprobación de diseño, revisión por una persona distinta ni evaluación de competencia de seguridad acreditadas. T058 requiere al menos cinco participantes reales. Protocolo preparado: pedir abrir registro desde login y completar la demo sin ayuda con datos ficticios; cronometrar desde entrada hasta éxito; preguntar qué ocurrió con la cuenta y si puede autenticarse con esos datos. Registrar únicamente identificador anónimo, tiempo, ayuda, finalización y reconocimiento de simulación. Aprobar cuando al menos el 90 % complete en menos de dos minutos sin ayuda y reconozca la simulación (con cinco participantes, deben cumplir los cinco). No se han reclutado participantes ni inventado resultados.

T060 acredita solamente la preparación de la revisión: revisar este informe, diff, contratos, pruebas rojas/verdes y controles; obtener aprobación de diseño y revisor distinto con competencia de seguridad antes de integrar, resolver licencias, ejecutar verify completo y CI real. T041 acredita registrar el pendiente de diseño, no su aprobación. No se publica, despliega, solicita revisión externa ni modifica la Constitution. T053/T057 permanecen abiertos por el bloqueo de licencias; T040/T058 por evidencia humana pendiente. T056 se mantiene abierta: configuración y sintaxis revisadas, pero ejecución real del workflow y comprobación integral de sus bloqueos en CI aún pendientes. Estado: 55/60 tareas completadas, sin declarar cierre integral de la feature.
