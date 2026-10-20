# Implementation Plan: Registro de Usuarios de KynWallet

**Branch**: feature/registro-jorge-velasco | **Date**: 2026-10-20 | **Spec**: [spec.md](spec.md)

**Input**: specs/002-registro-usuarios/spec.md, incluida la aclaración de entrada desde «Regístrate».

## Summary

Agregar el registro simulado y la navegación login → registro → login con confirmación. Reutilizar React, estilos y controles actuales; mantener reglas en dominio, coordinación en aplicación, efectos en adaptadores e inyección en src/main.tsx. Sin dependencias de aplicación nuevas, cuentas persistidas ni servicios remotos. Los controles constitucionales incorporan una herramienta SAST aislada en CI conforme a la política de dependencias. TDD para todo cambio de comportamiento; conservar el login excepto el cambio aprobado de «Regístrate».

El directorio activo es specs/002-registro-usuarios. setup-plan.sh informa 002-registro-usuarios como identificador de feature; git branch --show-current confirma la rama real feature/registro-jorge-velasco. No cambiar ni crear rama.

## Technical Context

**Language/Version**: TypeScript ^5.9.3, strict, objetivo ES2022; CSS Modules. Versiones declaradas en package.json y resueltas mediante package-lock.json.

**Primary Dependencies**: React/React DOM ^19.3.0, Vite ^8.3.4, Inter local; ninguna dependencia de aplicación nueva. Herramienta de seguridad de CI: Semgrep CE, fijada y validada conforme a 7.1–7.4, sin incorporarse al bundle. Reutilizar Button, TextField, PasswordField, Checkbox, SocialButton, Alert, Divider, BrandPanel y tokens.

**Storage**: ninguno para registro; formulario solo en estado del componente montado. Aviso de éxito transitorio sin datos personales y fuera del historial.

**Testing**: Vitest ^5.0.4, Testing Library, user-event, jsdom, axe-core y cobertura V8. Tests junto al código; navegador real para geometría, contraste, zoom y lector de pantalla.

**Target Platform**: navegadores de escritorio y móvil, 320–1440 px y zoom al 200 %. Node/npm compatibles con los motores de las dependencias resueltas; README indica Node >=20 y npm >=10, pero también deben respetarse los engines del lockfile.

**Project Type**: aplicación web cliente existente, sin backend.

**Performance Goals**: simulación y llegada a /login con confirmación en <=2 s; adaptador local con espera cancelable de 300 ms para mostrar envío. Reloj controlado en tests y comprobación final en navegador.

**Constraints**: WCAG 2.1 AA; sin transmisión ni persistencia de datos; sin credenciales en URL, logs o historial; un envío concurrente y ningún resultado tardío tras abandonar la pantalla.

**Scale/Scope**: un formulario por pestaña, cuatro campos y aceptación. Rutas /login y /register; / conserva la entrada al login. Sin servidor, verificación de unicidad ni integración social real.

## Constitution Check

*GATE: revisado antes de investigación y después del diseño. PASS de diseño: no se propone ninguna violación nueva ni excepción. Implementación e integración deben demostrar los controles siguientes; no se certifican pruebas ejecutadas.*

| Principio / reglas | Comprobación inicial | Comprobación posterior al diseño |
| --- | --- | --- |
| I. TDD, 1.1–1.4 | Prueba fallida antes de producción. | Secuencia reglas → caso de uso → controles → navegación/formulario; rojo, verde y refactor registrados, sin pruebas omitidas. |
| II. SOLID, 2.1–2.5 | Responsabilidades separadas. | Caso de uso recibe simulador y diagnóstico por interfaces; UI recibe caso de uso y navegación. Solo composición construye adaptadores. |
| III. Clean Architecture, 3.1–3.5 | Conservar capas y restricciones ESLint existentes. | Dominio sin React/DOM; aplicación solo depende de dominio y puertos. UI no importa infraestructura. Efectos concretos en adaptadores. |
| IV. DRY/KISS/YAGNI, 4.1–4.4 | Reutilizar controles y reglas, sin paquetes nuevos. | Primitivas compartidas con políticas explícitas para no cambiar el login. Layout compartido con opción móvil; sin repositorio de cuentas o plataforma genérica. |
| V. Seguridad, 5.1–5.6 | Validar tipos/formato/límites antes de efectos. | Caso de uso valida autoritativamente; simulador no recibe datos. Eventos con códigos y contadores sin valores, excepciones crudas o credenciales. Descartar datos al salir; SAST de seguridad con informe verificado y escaneo de secretos antes de integrar, además de lint. No hay operaciones protegidas nuevas. |
| VI. BRD/ARD, 6.1–6.5 | No se identificaron documentos aplicables en el repositorio revisado. | Spec vigente gobierna funcionalidad; revisar documentos añadidos antes de implementar. FR-019 sustituye solo el placeholder «Regístrate» del login. |
| Dependencias, 7.1–7.5 | Sin dependencias de aplicación nuevas; lockfile existente. Herramienta SAST aislada en CI y sujeta a los mismos controles. | Instalación reproducible y auditoría de vulnerabilidades/licencias de producción y desarrollo. Revisar mantenimiento y paquetes sin uso antes de integrar; no afirmar auditoría ya pasada. |
| Calidad, 8.1–8.3 | Unidad, contrato e integración con trazabilidad. | >=80 % por cada archivo ejecutable nuevo o modificado en líneas, ramas, funciones y sentencias, además de >=80 % global y sin descenso de ninguna métrica global frente a referencia comparable. Actualizar README y contratos de login afectados. |
| Accesibilidad/diseño, 8.4–8.6 | Reutilizar tokens y controles corporativos. | Checkbox y errores accesibles; axe más revisión de contraste, zoom y lector. Mantener visible la aprobación de diseño pendiente de tokens del login documentada en README y obtenerla antes de integrar si sigue pendiente; no introducir otra desviación. |
| Observabilidad, 8.7 y 5.5 | Diagnóstico sin datos personales. | Puerto con eventos cerrados y contadores, adaptador local en memoria; sin consola, red ni persistencia. Tests del esquema y saneamiento; sin panel técnico para el usuario. |
| Gobierno, 9.1–9.8 | Sin enmiendas ni excepciones constitucionales. | IDs de feature en tareas/tests/PR. Revisión por otra persona y competencia de seguridad. Añadir automatización de controles 9.4 en CI, incluyendo jobs obligatorios de SAST y cobertura afectada: no existe workflow en el árbol revisado. |

Revisión posterior: PASS del diseño con las mismas condiciones de integración. No quedan decisiones técnicas bloqueantes. Las pruebas, auditorías, revisión de PR y aprobación heredada son evidencias pendientes de implementación/integración, no resultados obtenidos. No modificar la Constitution para resolverlas.

## Project Structure

### Documentation (this feature)

    specs/002-registro-usuarios/
    ├── spec.md
    ├── plan.md
    ├── research.md
    ├── data-model.md
    ├── quickstart.md
    ├── contracts/
    │   ├── ui-registration.md
    │   └── registration-use-case.md
    └── checklists/requirements.md

tasks.md se generará con $speckit-tasks; no se crea en esta fase.

### Source Code (repository root)

Archivos y ajustes propuestos para implementar; no representan código ya creado:

    src/
    ├── domain/
    │   ├── validation.ts                  # primitivas compartidas, preservar login
    │   ├── registration.ts                # tipos, reglas y errores de registro
    │   └── messages.ts                    # catálogo único de textos
    ├── application/
    │   ├── register.ts                    # caso de uso y resultado tipado
    │   └── ports/
    │       ├── RegistrationSimulation.ts
    │       └── RegistrationDiagnostics.ts
    ├── infrastructure/
    │   ├── LocalRegistrationSimulation.ts
    │   └── InMemoryRegistrationDiagnostics.ts
    ├── ui/
    │   ├── navigation/                    # contrato e integración History API
    │   ├── layout/AuthLayout/             # extracción mínima de LoginScreen
    │   ├── components/                    # mejoras aditivas de accesibilidad
    │   └── features/
    │       ├── login/                     # entrada a registro y aviso de llegada
    │       └── registration/
    │           ├── RegistrationScreen.tsx
    │           ├── RegistrationForm.tsx
    │           ├── registrationReducer.ts
    │           ├── useRegistrationForm.ts
    │           └── RegistrationForm.module.css
    ├── App.tsx
    └── main.tsx
    scripts/
    ├── checkSastReport.mjs
    ├── checkSastReport.test.mjs
    ├── checkCoverage.mjs
    └── checkCoverage.test.mjs
    tests/security/sast-fixtures/           # casos seguros/inseguros ficticios
    .semgrep.yml                           # reglas de seguridad versionadas
    .github/workflows/quality.yml           # verify + SAST + cobertura afectada

**Structure Decision**: extender las capas actuales con tests adyacentes. Mantener LoginScreen compatible al extraer AuthLayout. Navegación es adaptador de presentación; no entra en dominio/aplicación. Puertos de simulación y diagnóstico mínimos justifican inyección, cancelación determinista, fallos verificables y reglas 2.5/3.4/8.7.

## Phase 0 — Research

[research.md](research.md) consolida inspección local y revisión independiente de un agente de investigación, solicitada por la habilidad: navegación, validación, responsive, accesibilidad y controles. Sin dependencias nuevas o dudas técnicas sin resolver.

## Phase 1 — Design & Contracts

[data-model.md](data-model.md) define datos efímeros y transiciones; [contrato UI](contracts/ui-registration.md) define navegación y accesibilidad; [contrato de caso de uso](contracts/registration-use-case.md) define entradas y efectos; [quickstart.md](quickstart.md) permite validar el resultado.

| Corte | Trazabilidad | Validación prevista |
| --- | --- | --- |
| Dominio | FR-002–FR-008; AC-201–AC-206; EC-001–EC-006/008 | Tablas de límites/tipos/correo/espacios, coincidencia y caracterización del login antes de extraer reglas. |
| Aplicación/efectos | FR-010/011/017/018; AC-102–AC-104/207; EC-007/010/011 | Contratos de simulación, fallo, cancelación, diagnóstico y ausencia de datos en efectos. |
| Formulario | FR-001/007–FR-010/012/016; AC-101/201/205/301–305/401 | Blur, corrección, foco, Enter, doble envío, preservación y axe en estados relevantes. |
| Navegación | FR-011/013/017/019; AC-103/104/105/402/403; EC-010/012/013 | App, back/forward, recarga, salida durante envío y aviso no repetido. |
| Aceptación | FR-014–FR-016; SC-001–SC-008 | Navegador, geometría, contraste, lector, tiempo real y usabilidad. |

Usar identificadores 002/FR-..., 002/AC-... en tests para distinguirlos del login. Actualizar solo expectativas de «Regístrate» y su rol de enlace. Google, Apple y recuperación del login conservan su aviso actual.

### Controles de integración para C1 y C2

Estos controles amplían la verificación prevista en investigación y quickstart; no se considera que npm run verify por sí solo los cubra hasta integrarlos. No se ejecutan ni implementan en esta corrección documental.

**C1 — Seguridad estática (5.6 y 9.4).** Añadir un job independiente SAST con Semgrep Community Edition, sin cuenta ni envío de código: motor fijado a versión y digest inmutables, reglas de seguridad JS/TS versionadas en .semgrep.yml y revisadas por origen, licencia, mantenimiento y vulnerabilidades según 7.1–7.4. No usar configuración remota mutable ni auto; desactivar métricas y comprobación remota de versión. Escanear código fuente y scripts/configuración ejecutables propios, incluido src/main.tsx, con reglas para inyección, ejecución dinámica peligrosa, manipulación insegura del DOM y exposición de información sensible; lint, secretos y auditoría de dependencias permanecen como controles separados.

La política es bloquear ante cualquier hallazgo de las reglas de seguridad habilitadas, error de ejecución, configuración inválida o análisis incompleto; no ignorar hallazgos preexistentes ni aplicar autofix. Usar salida JSON y un comprobador scripts/checkSastReport.mjs que compruebe resultados, errores y cobertura de análisis, además del código de salida (--strict y --error). Verificar con pruebas que el job falla incluso si el motor devuelve cero con un informe que contiene errores, hallazgos o archivos aplicables sin analizar. Las exclusiones se limitan a dependencias, generados y fixtures deliberadamente inseguros; estos fixtures se analizan aparte como pruebas positivas, sin credenciales reales. Archivar evidencia saneada de versión/reglas, ficheros analizados, hallazgos y resultado. Sin continue-on-error, supresiones nuevas ni excepciones implícitas. Referencia de invocación: [documentación oficial de Semgrep CLI](https://docs.semgrep.dev/cli-reference); comprobar la versión fijada durante implementación antes de incorporarla.

**C2 — Cobertura del código afectado (8.1 y 9.4).** Conservar umbral global >=80 % en las cuatro métricas. Añadir un control por cada archivo ejecutable de producción nuevo o modificado: >=80 % en líneas, ramas, funciones y sentencias sobre todo el archivo afectado, para impedir que código ajeno compense cobertura insuficiente. Determinar archivos contra el merge-base con la rama destino y registrar los SHA base y candidato. En ejecución local anterior al primer commit, incluir cambios de trabajo y archivos nuevos; en CI utilizar los SHA efectivos del cambio, sin base fija asumida. Incluir archivos renombrados con cambios y src/main.tsx si se modifica, retirando para el informe de cumplimiento cualquier exclusión genérica que lo omita. El alcance incluye código ejecutable propio de aplicación y de los comprobadores de verificación: combinar sus reportes de cobertura cuando procedan de runners distintos, sin omitir scripts propios. Tests, declaraciones y recursos no ejecutables quedan fuera con justificación explícita, no archivos ejecutables por conveniencia.

Generar informes V8 JSON completos para candidato y referencia base en entornos comparables (mismo Node, proveedor/versión y opciones de instrumentación; anotar diferencias justificadas). scripts/checkCoverage.mjs debe comprobar porcentajes sin redondear, umbral por archivo afectado y ausencia de descenso de cada métrica global frente a la referencia. Para métrica con denominador cero, registrar «no aplicable», nunca éxito ficticio al 100 %. Si falta base Git, ejecución de referencia, un informe, mapas o cobertura de un archivo aplicable, el control falla; no interpretar dato ausente como cero archivos cambiados. Si no hay cambios ejecutables, justificar no aplicabilidad con diff verificable; los controles globales siguen vigentes.

Probar antes de implementar ambos comprobadores: caso conforme, hallazgo SAST, error del motor/informe, cobertura global alta con archivo nuevo <80 %, archivo modificado <80 %, archivo sin datos, base ausente, renombrado con cambios y disminución global. scripts/checkSastReport.test.mjs y scripts/checkCoverage.test.mjs usarán node:test sin dependencias de aplicación nuevas. CI ejecutará unitarios de controles, verify, SAST y cobertura afectada como condiciones obligatorias antes de integrar; nunca marcar aprobado lo que no se ejecutó. No modificar políticas remotas desde la implementación sin autorización.

**Autenticación invariable (FR-011/SC-007).** Comparar antes/después con la misma configuración: credenciales admitidas siguen admitidas y no admitidas siguen no admitidas, incluso si se ingresaron en un registro simulado válido. No rechazar cuentas existentes, comprobar duplicidad, agregar cuentas o iniciar sesión como consecuencia del registro; cubrir AC-105/EC-013.

## Complexity Tracking

Sin violaciones propuestas. Sin dependencias nuevas de aplicación, backend ni persistencia. El motor SAST aislado en CI y los comprobadores sin paquetes nuevos cubren las obligaciones 5.6/8.1/9.4; sus versiones, reglas y licencias requieren verificación antes de incorporación. Los dos puertos cubren efectos actuales y obligaciones constitucionales; no se introduce un sistema genérico de registro o telemetría.



