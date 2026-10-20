# Tasks: Registro de Usuarios de KynWallet

**Input**: documentos de specs/002-registro-usuarios/: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [contratos](contracts/ui-registration.md) y [quickstart.md](quickstart.md).

**Prerequisites**: planificación y aclaración completadas; Constitution v1.0.0 vigente. Rama Git real feature/registro-jorge-velasco; directorio activo independiente de la rama.

**Tests**: obligatorios por Constitution 1.1–1.4, referenciada explícitamente por la spec y el plan. Para cada cambio de comportamiento: escribir prueba, ejecutar y comprobar fallo por el comportamiento ausente, implementar hasta verde, refactorizar manteniendo verde. Registrar evidencia real; un fallo por configuración/importación sin escenario ejecutable no basta. No marcar una tarea completa sin sus evidencias.

**Organization**: historias en orden US1 (P1), US2 (P1), US3 (P1), US4 (P2). Las bases compartidas incluyen validación autoritativa; US2 añade retroalimentación y recuperación sin duplicar las reglas.

## Format: ID, P, Story, Description

Todas las tareas usan checkbox de estado e ID secuencial. [P] significa trabajo en archivos diferentes que puede ejecutarse simultáneamente con otras tareas de la misma oleada después de cumplir sus prerrequisitos; no autoriza omitir TDD. Etiquetas [US1]–[US4] solo en fases de historia. No se solicita delegación automática a agentes.

## Path Conventions

Rutas relativas a la raíz del repositorio. Tests junto al código; variantes con sufijos .inline/.a11y/.registration separan archivos para evitar conflictos. Evidencias documentales en specs/002-registro-usuarios/validation.md, sin datos sensibles; este archivo se creará al implementar. No crear backend, almacenamiento de cuentas, autenticación real ni modificar la Constitution.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: preparar entorno y evidencia sin reinicializar el proyecto.

- [X] T001 Comprobar motores de package.json/package-lock.json, instalar con npm ci si hace falta y ejecutar baseline de npm test y npm run test:coverage antes de cambiar producción; registrar versiones, cuatro métricas de cobertura y fallos preexistentes en specs/002-registro-usuarios/validation.md, preservando el lockfile y sin añadir dependencias.
- [X] T002 Registrar en specs/002-registro-usuarios/validation.md la matriz inicial FR/AC/EC/SC → tareas/pruebas, las reglas TDD/seguridad de .specify/memory/constitution.md y el pendiente heredado de aprobación de contraste descrito en README.md; distinguir evidencia ejecutada de pendiente.
- [X] T003 Preparar src/test/registrationStub.ts y src/test/navigationStub.ts con dobles inyectables de promesa controlable, cancelación, diagnóstico saneado y navegación en memoria según contracts/registration-use-case.md y contracts/ui-registration.md; sin fixtures de credenciales reales o cambios al login.

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: validación y navegación compartidas que bloquean todas las historias. No iniciar historias hasta T010.

- [X] T004 Añadir/confirmar caracterización de validación del login en src/domain/validation.test.ts: conservar rechazo de a@b.c, normalización y longitudes existentes antes de extraer primitivas; documentar que EC-003 aplica al perfil de registro y no modifica el contrato anterior.
- [X] T005 [P] Escribir y ejecutar pruebas fallidas en src/domain/registration.identity.test.ts para fullName: «string, trim para validar; 1–100 caracteres, admite acentos, apóstrofos, guiones y un término.» y email: «string, trim; 1–254 caracteres, un @, parte local no vacía, dominio con al menos dos segmentos no vacíos y sin espacios internos.»; cubrir 0/1/100/101 y 254/255, Unicode, pegado, espacios periféricos, a@b.c permitido y a@b..com rechazado (FR-003/004, AC-202/206, EC-002/003/006).
- [X] T006 [P] Escribir y ejecutar pruebas fallidas en src/domain/registration.credentials.test.ts para password: «string, 8–128 caracteres, sin recortar o alterar espacios/mayúsculas.», confirmPassword: «string, 8–128 y coincidencia exacta con password.» y acceptedTerms: «boolean, inicial false; debe ser true para enviar.»; cubrir vacíos, 7/8/128/129 puntos de código Unicode, espacios, diferencias de mayúsculas, tipos inválidos y prioridad requerido → formato/longitud → coincidencia (FR-002/005/006/007, AC-201/203/204/206, EC-001/004/005).
- [X] T007 Extraer primitivas y constantes de validación en src/domain/validation.ts tras T004–T006: compartir límites/normalización, admitir perfil de correo explícito y conservar el comportamiento del login; ejecutar su caracterización sin regresiones y sin duplicar reglas.
- [X] T008 Implementar tipos RegistrationValues/FieldErrors y validadores autoritativos en src/domain/registration.ts, con textos únicos en src/domain/messages.ts, hasta verde de T005/T006; FieldErrors usa «código de error tipado, sin incluir valores; como máximo un error por control.»; validar tipos antes de normalizar, contar puntos de código, no truncar, no comprobar DNS/duplicidad y no modificar el objeto recibido.
- [X] T009 Escribir y ejecutar pruebas fallidas del contrato de navegación en src/ui/navigation/browserNavigation.test.ts: getPath/subscribe/navigate push y replace, notificación de cambios internos y popstate, limpieza de suscripciones y rutas públicas sin payload de formulario; usar stubs de T003.
- [X] T010 Implementar src/ui/navigation/Navigation.ts y src/ui/navigation/browserNavigation.ts hasta verde de T009, sin librería nueva; exponer ruta actual, suscripción con unsubscribe y navegación push/replace, sin datos personales en URL o history.state. No conectar todavía el enlace Regístrate del login.

**Checkpoint**: reglas tabuladas y navegación verificadas, sin regresión de login. T004 protege comportamiento previo y puede empezar en verde; T005/T006/T009 deben demostrar rojo antes de sus implementaciones.

## Phase 3: User Story 1 — Completar el registro de demostración (Priority: P1)

**Goal**: formulario básico válido → envío único → /login con confirmación, sin cuenta ni credenciales persistidas.

**Independent Test**: abrir /register directamente, completar valores válidos y aceptación, enviar por clic/Enter, ver carga y un único éxito; reabrir o recargar el registro vacío. No requiere implementar opciones sociales o entrada desde login.

### Tests for User Story 1 — FIRST

- [X] T011 [US1] Escribir y ejecutar pruebas fallidas de contrato en src/application/register.test.ts para resultado invalid/success/unavailable/cancelled, validación antes de simular, entradas mal tipadas, ausencia de mutación, cancelación previa/durante/después de resolver y diagnóstico que falla sin bloquear resultado; no devolver datos sensibles (FR-002/010/011/017/018; contrato de caso de uso).
- [X] T012 [P] [US1] Escribir y ejecutar pruebas fallidas en src/infrastructure/LocalRegistrationSimulation.test.ts: complete recibe solo AbortSignal, espera local de 300 ms con reloj controlado, cancela y limpia temporizador/listener; no recibe credenciales, crea cuentas ni hace I/O (FR-010/017, AC-102/103).
- [X] T013 [P] [US1] Escribir y ejecutar pruebas fallidas en src/infrastructure/InMemoryRegistrationDiagnostics.test.ts para «contadores por código y último evento con duración numérica; cantidad acotada, sin payload.»; solo validation_rejected/submission_started/submission_succeeded/submission_failed/submission_cancelled, duraciones no negativas y cero valores de formulario o excepciones crudas (Constitution 5.5/8.7).
- [X] T014 [P] [US1] Escribir y ejecutar pruebas fallidas de contrato UI en src/ui/features/registration/RegistrationForm.test.tsx: cuatro campos, contraseñas ocultas, casilla inicialmente desmarcada, obligatoriedad, botón Crear cuenta, envío válido con Enter/clic, «Creando cuenta…», bloqueo síncrono de doble envío y campos congelados durante procesamiento (FR-001/002/007/010, AC-101/102, EC-007).
- [X] T015 [P] [US1] Escribir y ejecutar pruebas fallidas en src/App.registration.test.tsx: entrada directa /register, llegada /login con texto exacto de AC-103, anuncio y foco de destino, sin sesión automática ni cuentas/credenciales nuevas; incluir AC-105/EC-013 comparando que credenciales admitidas siguen admitidas y no admitidas siguen no admitidas bajo la misma configuración; formulario vacío al reabrir/recargar, aviso ausente en navegación ordinaria y resolución tardía ignorada al salir (FR-011/017, AC-103/104/105, EC-010/013, SC-003/007).
 
### Implementation for User Story 1

- [X] T016 [US1] Definir Register y resultados tipados en src/application/register.ts y puertos mínimos en src/application/ports/RegistrationSimulation.ts y src/application/ports/RegistrationDiagnostics.ts: invalid con códigos por campo, success sin payload, unavailable genérico y cancelled sin efecto; complete(signal): Promise<void> y record con esquema cerrado, sin dependencias de React/navegación.
- [X] T017 [US1] Implementar src/infrastructure/LocalRegistrationSimulation.ts y src/infrastructure/InMemoryRegistrationDiagnostics.ts contra T012/T013 y T016: temporizador cancelable sin formulario y diagnóstico acotado en memoria, sin consola, red, persistencia o retención de excepciones.
- [X] T018 [US1] Completar createRegister en src/application/register.ts hasta verde de T011: validar autoritativamente con dominio antes de efectos, simular mediante puerto inyectado, distinguir cancelación de fallo, registrar solo metadatos permitidos y aislar fallo de diagnóstico sin alterar resultado funcional.
- [X] T019 [US1] Crear src/ui/features/registration/registrationReducer.ts y src/ui/features/registration/useRegistrationForm.ts con «valores de edición, errores actuales y controles visitados/validados.» y status «editing, invalid, submitting o failed; éxito/cancelación son resultados que llevan al desmontaje o descarte.»; inicial vacío, guard síncrono, identidad por intento, cancelación al desmontar, descarte de resultados antiguos y limpieza de referencias, usando los escenarios fallidos de T014/T015.
- [X] T020 [US1] Construir src/ui/features/registration/RegistrationForm.tsx y src/ui/features/registration/RegistrationScreen.tsx con controles existentes, texto accesible de obligatoriedad, etiquetas, aceptación explícita, PasswordField ocultos inicialmente y Button.loading; conectar el caso de uso sin duplicar reglas; habilitar envío básico verificable por T014.
- [X] T021 [US1] Conectar rutas /register y /login en src/App.tsx, componer dependencias en src/main.tsx y presentar éxito en src/ui/features/login/LoginForm.tsx mediante Alert; NavigationArrival es «boolean transitorio en App; sin datos de formulario o identificador personal.»; éxito hace replace, muestra texto de AC-103, enfoca destino y limpia aviso al salir; / conserva login sin cambiar sus reglas.
- [X] T022 [US1] Ejecutar T011–T015 y regresiones del login; verificar AC-101–AC-105/EC-007/EC-010/EC-013 y flujo <=2 s con reloj controlado; registrar rojo/verde y ausencia de creación de cuentas en specs/002-registro-usuarios/validation.md. El tiempo percibido final se comprobará en navegador.

**Checkpoint**: incremento demostrable desde /register. Ya bloquea entradas inválidas con dominio; US2 añade feedback completo. No declararlo listo para entrega final hasta cumplir todas las historias P1.

## Phase 4: User Story 2 — Corregir datos sin perder el progreso (Priority: P1)

**Goal**: validación inline y recuperación de errores conservando datos; errores de cada control y foco en el primero.

**Independent Test**: sobre el formulario de US1, enviar vacío y casos inválidos, corregirlos, modificar contraseña tras confirmarla y simular fallo/reintento sin pérdida de valores.

### Tests for User Story 2 — FIRST

- [X] T023 [US2] Escribir y ejecutar pruebas fallidas en src/ui/features/registration/registrationReducer.test.ts: blur valida control, submit valida todos, touched limita errores prematuros, edición revalida controles ya validados, cambio de password revalida confirmPassword validada y conserva campos/casilla (FR-006/008/009, AC-204/205, EC-008).
- [X] T024 [P] [US2] Escribir y ejecutar pruebas fallidas de feedback en src/ui/features/registration/RegistrationForm.inline.test.tsx: cinco errores al enviar vacío, foco primero inválido, correo inline al salir, corrección que elimina solo error pertinente, mensajes de límites/coincidencia y aceptación, preservación y pegado (FR-002–FR-009, AC-201–AC-206, EC-001–EC-006).
- [X] T025 [P] [US2] Escribir y ejecutar pruebas fallidas aditivas de error/required/ref/onBlur/disabled en src/ui/components/Checkbox/Checkbox.registration.test.tsx, con aria-invalid/aria-describedby y mensaje junto a casilla, manteniendo API actual para Recordarme; verificar foco del consentimiento como primer inválido (FR-007/008/016).
- [X] T026 [P] [US2] Escribir y ejecutar pruebas fallidas en src/App.registration.failure.test.tsx: fallo inesperado produce texto de AC-207 sin detalles internos, conserva valores/aceptación, libera guard/botón y permite siguiente envío; ningún éxito o navegación en fallo ni resultado abandonado (FR-018, AC-207, EC-011, SC-008).
 
### Implementation for User Story 2

- [X] T027 [US2] Extender src/ui/features/registration/registrationReducer.ts y src/ui/features/registration/useRegistrationForm.ts hasta verde de T023: touched, blur, submit global y revalidación dependiente, usando validadores de dominio como única autoridad y sin limpiar datos por errores ajenos.
- [X] T028 [US2] Extender src/ui/components/Checkbox/Checkbox.tsx y src/ui/components/Checkbox/Checkbox.module.css hasta verde de T025: obligatoriedad, ref y atributos accesibles, error asociado y estado disabled; conservar uso existente en login.
- [X] T029 [US2] Integrar mensajes por control, referencias y foco en src/ui/features/registration/RegistrationForm.tsx hasta verde de T024; textos desde src/domain/messages.ts, no usar valores ingresados en avisos ni truncar para evitar errores; orden requerido/formato-longitud/coincidencia según modelo.
- [X] T030 [US2] Completar recuperación de fallo en src/ui/features/registration/useRegistrationForm.ts y src/ui/features/registration/RegistrationForm.tsx hasta verde de T026: estado failed, Alert genérico, valores conservados y reintento con identidad nueva; no introducir un selector de fallos en el producto.
- [X] T031 [US2] Ejecutar tablas de límites de src/domain/registration.identity.test.ts y src/domain/registration.credentials.test.ts junto a tests inline y caracterización del login; registrar resultados 0/1/100/101, 254/255, 7/8/128/129, Unicode y espacios sin alterar semántica previa en specs/002-registro-usuarios/validation.md.
- [X] T032 [US2] Validar AC-201–AC-207 y EC-001–EC-006/EC-008/EC-011 de forma integrada, comprobar preservación y foco incluido checkbox, y registrar evidencia real TDD y SC-002/SC-008 en specs/002-registro-usuarios/validation.md.

**Checkpoint**: US1 y US2 verificables con datos válidos e inválidos; sin dependencia de opciones sociales o navegación de entrada.

## Phase 5: User Story 3 — Distintos dispositivos y teclado (Priority: P1)

**Goal**: diseño coherente con login, solo formulario móvil, dos paneles desktop y experiencia WCAG 2.1 AA.

**Independent Test**: sobre US1, revisar tamaños/zoom y completar solo con teclado y lector; cuando US2 esté integrado, repetir con sus errores visibles. El orden secuencial recomendado evita conflictos en archivos comunes.

### Tests for User Story 3 — FIRST

- [X] T033 [US3] Escribir y ejecutar pruebas fallidas en src/ui/components/TextField/TextField.a11y.test.tsx y src/ui/components/PasswordField/PasswordField.a11y.test.tsx: preservar descripciones externas junto al error, anuncio asociado, hidden inicial y nombres distintos para controles de visibilidad de contraseña y confirmación (FR-001/016, AC-303/304).
- [X] T034 [P] [US3] Escribir y ejecutar pruebas fallidas en src/ui/layout/AuthLayout/AuthLayout.test.tsx: opción que oculta totalmente marca para registro móvil, markup de dos paneles y compatibilidad del login; separar estas aserciones estructurales de la geometría que requiere navegador (FR-014/015, AC-301/302).
- [X] T035 [P] [US3] Escribir y ejecutar pruebas fallidas en src/ui/features/registration/RegistrationForm.a11y.test.tsx: orden Tab/Shift+Tab, Enter, Espacio, etiquetas/obligatoriedad, nombres de visibilidad únicos, envío anunciado y axe inicial/con errores/en envío; incluir llegada a login en src/App.registration.a11y.test.tsx (FR-016, AC-303–AC-305, SC-004).
 
### Implementation for User Story 3

- [X] T036 [US3] Mejorar src/ui/components/TextField/TextField.tsx y src/ui/components/PasswordField/PasswordField.tsx contra T033, conservando compatibilidad, combinando aria-describedby y proporcionando nombres accesibles distintos en las dos instancias del registro sin cambiar el control único del login.
- [X] T037 [US3] Extraer src/ui/layout/AuthLayout/AuthLayout.tsx y src/ui/layout/AuthLayout/AuthLayout.module.css desde src/ui/features/login/LoginScreen.tsx conservando su comportamiento por defecto; activar opción de registro que oculta BrandPanel completamente hasta 1023 px y muestra dos paneles desde 1024 px, contra T034.
- [X] T038 [US3] Adaptar src/ui/features/registration/RegistrationScreen.tsx y src/ui/features/registration/RegistrationForm.module.css con layout de T037, tokens existentes, contenido fluido, espacio para errores y foco visible, sin alturas fijas/scroll horizontal ni desmontaje al redimensionar; conservar disposición anterior del login (FR-014/015, AC-301/302, EC-009).
- [X] T039 [US3] Completar semántica y anuncios en src/ui/features/registration/RegistrationForm.tsx y src/App.tsx hasta verde de T035: autocomplete name/email/new-password, región de envío perceptible, errores vinculados sin anuncios duplicados, foco de destino/título y estados reconocibles sin depender solo del color (FR-016, AC-303–AC-305).
- [ ] T040 [US3] Ejecutar revisión real de 320/375/768/1024/1440 px, orientación, zoom 200 %, teclado, lector y contraste siguiendo specs/002-registro-usuarios/quickstart.md; registrar capturas/evidencia saneada y limitaciones de axe/jsdom en specs/002-registro-usuarios/validation.md, corrigiendo hallazgos con prueba previa cuando automatizable (AC-301–AC-305, EC-009, SC-004/005).
- [X] T041 [US3] Revisar pendiente heredado de diseño de README.md y registrar en specs/002-registro-usuarios/validation.md el estado verificable de la aprobación competente de tokens de contraste, sin afirmar aprobación inexistente ni cambiar la Constitution; si sigue pendiente, dejar condición explícita de integración, sin impedir completar código/pruebas autorizados.
- [X] T042 [US3] Ejecutar tests de controles/layout/registro/login y documentar resultado de AC-301–AC-305 y SC-004/005 en specs/002-registro-usuarios/validation.md; no tratar axe sin contraste como certificación total de WCAG.

**Checkpoint**: todas las historias P1 completas funcionalmente y con validación accesible; cualquier evidencia manual o aprobación aún no obtenida permanece declarada pendiente.

## Phase 6: User Story 4 — Elegir otra vía de acceso (Priority: P2)

**Goal**: entrada desde Regístrate, vuelta al login y acciones Google/Apple informativas.

**Independent Test**: desde login abrir registro; con datos ingresados activar cada opción social y volver a login; repetir con teclado, historial y nueva entrada vacía, sin depender de registrar exitosamente.

### Tests for User Story 4 — FIRST

- [X] T043 [US4] Escribir y ejecutar pruebas fallidas en src/ui/features/registration/RegistrationForm.options.test.tsx: Google/Apple muestran exactamente «Próximamente», conservan datos y aceptación, no envían ni abren autenticación externa; notice es «aviso informativo de opciones futuras; independiente de errores de campo.» (FR-009/012, AC-401, SC-006).
- [X] T044 [P] [US4] Escribir y ejecutar pruebas fallidas de contrato de navegación UI en src/App.registration.navigation.test.tsx: Regístrate abre /register vacío, Inicia sesión abre /login sin éxito, reentrada/back/forward/recarga descartan credenciales y no repiten avisos; click modificado conserva navegación nativa; abandonar envío impide éxito tardío (FR-013/017/019, AC-402/403, EC-010/012).
- [X] T045 [P] [US4] Actualizar primero src/ui/features/login/LoginForm.test.tsx con expectativas nuevas del enlace Regístrate y callback inyectado, retirándolo solo de la tabla de placeholders; comprobar que Google/Apple/recuperación conservan su mensaje y Recordarme/bienvenida/cierre no cambian. Ejecutar hasta observar fallo por navegación ausente (FR-019).
 
### Implementation for User Story 4

- [X] T046 [US4] Integrar SocialButton/Divider y aviso informativo en src/ui/features/registration/RegistrationForm.tsx y src/ui/features/registration/registrationReducer.ts hasta verde de T043; todas las acciones sociales son no-submit y no alteran errores o valores.
- [X] T047 [US4] Sustituir placeholder Regístrate de src/ui/features/login/LoginForm.tsx por enlace a /register mediante callback de navegación inyectado y agregar enlace «¿Ya tienes cuenta? Inicia sesión» en src/ui/features/registration/RegistrationForm.tsx, con href y foco visible; preservar interacción modificada/nueva pestaña y avisos antiguos restantes, contra T045.
- [X] T048 [US4] Completar coordinación de enlaces, reentrada vacía, limpieza de aviso y cancelación en src/App.tsx y src/ui/navigation/browserNavigation.ts hasta verde de T044; no escribir formulario o indicador de éxito en history.state, query o storage; conservar / como entrada al login.
- [X] T049 [US4] Actualizar README.md y specs/001-login-billetera/contracts/ui-login.md para describir registro demo, rutas y sustitución de placeholder por FR-019 de esta feature; enlazar specs/002-registro-usuarios/contracts/ui-registration.md sin reescribir la spec histórica del login.
- [X] T050 [US4] Ejecutar T043–T045 y regresión completa, validar AC-401–AC-403 y EC-010/012 por teclado y puntero y registrar SC-006 y privacidad del recorrido en specs/002-registro-usuarios/validation.md.

**Checkpoint**: recorrido completo login → registro → login, avisos sociales y navegación normal/exitosa diferenciados.

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: controles de seguridad, evidencias y condiciones de integración para todas las historias.

- [X] T051 Escribir/ejecutar pruebas integradas de privacidad en src/App.registration.security.test.tsx y contrato de diagnóstico en src/application/register.test.ts: espiar fetch/XHR/storage/consola/history.state, comprobar que ningún campo llega a efectos/URL/mensajes y que registro no crea/modifica/habilita cuentas o credenciales ni inicia sesión; comparar autenticación antes/después con igual configuración para credenciales admitidas y no admitidas, incluidos AC-105/EC-013; cubrir éxito, inválido, fallo, cancelación y reentrada (FR-017, SC-007).
- [X] T052 Corregir únicamente hallazgos demostrados por T051 y demás validaciones en src/application/register.ts, src/ui/features/registration/useRegistrationForm.ts y src/App.tsx, añadiendo primero reproducción fallida del defecto; si no hay defectos, registrar revisión sin introducir cambios especulativos en specs/002-registro-usuarios/validation.md.
- [ ] T053 Ampliar script audit:licenses de package.json para verificar producción y desarrollo según plan.md, revisar compatibilidad/mantenimiento/uso de dependencias resueltas en package-lock.json y ejecutar auditorías sin agregar paquetes nuevos ni permitir licencias no aprobadas; registrar hallazgos concretos en specs/002-registro-usuarios/validation.md.
- [X] T054 Resolver C1 configurando SAST de seguridad con Semgrep CE en .semgrep.yml y .github/workflows/quality.yml: fijar motor por versión/digest y reglas locales por revisión, verificar origen/licencia/mantenimiento/vulnerabilidades conforme a 7.1–7.4, sin dependencias de aplicación nuevas, cuentas externas o envío de código. Antes del comprobador, escribir y ejecutar pruebas rojas en scripts/checkSastReport.test.mjs y fixtures ficticios seguros/inseguros en tests/security/sast-fixtures/; después implementar scripts/checkSastReport.mjs. Verificar salida JSON además de --strict/--error; hallazgo, error, análisis incompleto o archivo aplicable omitido deben fallar aunque el proceso devuelva cero; fixture seguro debe pasar. Escanear código ejecutable propio (incluido src/main.tsx), sin continue-on-error, supresiones nuevas o excepciones implícitas; documentar alcance, versión/reglas y evidencia saneada en specs/002-registro-usuarios/validation.md (Constitution 5.6/9.4).
- [X] T055 Resolver C2 escribiendo primero pruebas fallidas en scripts/checkCoverage.test.mjs y después scripts/checkCoverage.mjs, usando node:test sin paquetes nuevos: cada archivo ejecutable de producción nuevo o modificado debe alcanzar >=80 % en líneas/ramas/funciones/sentencias, además del umbral global y ausencia de descenso de cada métrica global. Ajustar reportes JSON V8 y exclusiones de vite.config.ts, incluyendo src/main.tsx si cambia y cobertura de los comprobadores propios scripts/checkSastReport.mjs y scripts/checkCoverage.mjs mediante informes comparables de sus tests; obtener base/candidato comparables, diff con merge-base contra rama destino, archivos nuevos locales y renombrados con cambios. Probar global alta con archivo afectado <80 %, archivo sin datos, base/informe ausente y regresión global; todos fallan. Denominador cero se registra no aplicable, sin éxito ficticio. Conectar comandos de pruebas/comprobación en package.json y registrar SHA, métricas y evidencia en specs/002-registro-usuarios/validation.md; no reducir umbrales ni cobertura (Constitution 8.1/9.4).
- [ ] T056 Consolidar .github/workflows/quality.yml con instalación npm ci, npm run verify, tests de comprobadores y jobs obligatorios SAST/cobertura afectada de T054/T055 en pull requests e integración de rama principal detectada del repositorio, Node compatible con lockfile y sin secretos/datos reales; comprobar sintaxis y que fallos de build/tests/cobertura global y afectada/SAST/análisis/secretos/dependencias/licencias fallan el job; usar historia Git suficiente, SHA base/candidato y ejecución comparable de referencia, fallando si falta evidencia; no usar continue-on-error, desplegar ni cambiar políticas remotas.
- [ ] T057 Ejecutar npm run verify y recorrido de build con npm run preview desde package.json según quickstart.md: acceso directo /login y /register, fallback SPA en entorno servido y tiempo real <=2 s; comparar cobertura con baseline T001 y exigir >=80 % en líneas/ramas/funciones/sentencias globalmente y por cada archivo ejecutable nuevo o modificado, sin descenso de ninguna métrica global; ejecutar y conservar resultados de SAST y de los casos positivos/negativos de ambos comprobadores T054/T055; registrar resultados reales en specs/002-registro-usuarios/validation.md.
- [ ] T058 Evaluar SC-001 con >=5 participantes y registrar cantidad/proporción, tiempos y reconocimiento de simulación en specs/002-registro-usuarios/validation.md: >=90 % completa sin asistencia en <2 minutos; preparar protocolo si participantes no están disponibles y mantener resultado pendiente, sin inventar evidencia o detener mejoras independientes.
- [X] T059 Completar matriz bidireccional FR-001–FR-019, AC-101–AC-403, EC-001–EC-013 y SC-001–SC-008 con IDs de pruebas/tareas y evidencias en specs/002-registro-usuarios/validation.md; comprobar todos los escenarios de quickstart.md, límites y contratos, y documentar cualquier resultado manual/auditoría pendiente.
- [X] T060 Preparar revisión final de cumplimiento en specs/002-registro-usuarios/validation.md y actualizar specs/002-registro-usuarios/tasks.md solo con tareas efectivamente completadas; registrar condiciones de aprobación por revisor distinto y competencia de seguridad, aprobación de diseño heredada si aplica y controles de integración, sin solicitar revisiones externas ni publicar/mergear en esta tarea.

## Dependencies & Execution Order

### Phase Dependencies

    Setup T001–T003
        → Foundational T004–T010
            → US1 T011–T022
                → US2 T023–T032
                → US3 T033–T042
                → US4 T043–T050
                    → Polish T051–T060 (tras completar todas las historias)

US2/US3/US4 dependen de la base de formulario y composición de US1; no dependen funcionalmente de completar entre sí sus opciones. El orden secuencial US1 → US2 → US3 → US4 es el recomendado por archivos comunes. US3 se puede validar sobre US1 y luego repetir con errores de US2; no asumir integración simultánea segura sobre Form/App/Checkbox. Polish requiere las cuatro historias, no solo US4.

### Within Each Phase

| Fase | Dependencias concretas |
| --- | --- |
| Setup | T001 → T002 → T003. |
| Fundamentos | T004 → {T005, T006} → T007 → T008 → T009 → T010. |
| US1 | {T011, T012, T013, T014, T015} rojas antes de producción; T016 → T017 → T018 → T019 → T020 → T021 → T022. |
| US2 | {T023, T024, T025, T026} rojas primero; T027 → T028 → T029 → T030 → T031 → T032. |
| US3 | {T033, T034, T035} rojas primero; T036 → T037 → T038 → T039 → T040 → T041 → T042. |
| US4 | {T043, T044, T045} rojas primero; T046 → T047 → T048 → T049 → T050. |
| Cierre | T051 → T052 → T053 → T054 → T055 → T056 → T057 → T058 → T059 → T060. |

En tareas de pruebas que abarcan comportamiento existente y nuevo, distinguir caracterización verde de nuevas aserciones rojas. No implementar un comportamiento antes de comprobar su fallo; las tareas de UI deben usar stubs para aislar contratos y evitar depender de pantallas futuras. Mantener la suite existente verde al terminar cada corte, actualizando solo expectativas sustituidas expresamente por FR-019.

### Parallel Opportunities

Trece tareas marcadas [P] en cinco oleadas, todas en archivos diferentes y sin producción simultánea: T005/T006; T012/T013/T014/T015 junto a T011; T024/T025/T026 junto a T023; T034/T035 junto a T033; T044/T045 junto a T043. Los marcadores expresan oportunidades tras prerrequisitos, no obligación de ejecutar agentes.

## Parallel Example: User Story 1

Tras T010, escribir pruebas del caso de uso (T011), simulación (T012), diagnóstico (T013), formulario (T014) y App (T015) en archivos distintos usando dobles de T003. Confirmar cada fallo antes de T016–T021; no escribir producción compartida simultáneamente.

## Parallel Example: User Story 2

Tras T022, T023 (reducer), T024 (formulario inline), T025 (Checkbox) y T026 (fallo integrado) se pueden preparar independientemente. La implementación T027–T030 se ordena para que el formulario consuma las mejoras del reducer y Checkbox ya verificadas.

## Parallel Example: User Story 3

Tras US1 y bases compartidas, T033 (campos), T034 (layout) y T035 (formulario/App accesibles) utilizan archivos separados. No modificar Form/App mientras otra historia los integra. El contraste y la geometría se revisan después en navegador con T040.

## Parallel Example: User Story 4

Tras US1, T043 (opciones), T044 (navegación App) y T045 (regresión LoginForm) se escriben en paralelo. Integrar secuencialmente T046–T048 porque comparten formulario, App y navegación.

## Implementation Strategy

### MVP First

Completar T001–T022 y demostrar US1 entrando directamente por /register: datos válidos, aceptación, envío único y éxito efímero. Es un MVP de demostración intermedio, no la entrega final: todas las historias P1 y las condiciones constitucionales siguen siendo obligatorias.

### Incremental Delivery

US2 agrega corrección/reintento; US3 completa presentación y accesibilidad; US4 conecta la entrada y las opciones futuras. Cada corte tiene pruebas independientes sobre sus prerrequisitos y conserva lo entregado. No ejecutar despliegue o integración remota desde esta lista sin autorización aplicable.

### Final Readiness

Estado de cierre documental: 55/60 tareas completadas. T040 (auditoría manual/lector), T053 (revisión y autorización de licencias), T056 (validación efectiva del workflow en CI), T057 (verify completo bloqueado por licencias) y T058 (estudio con participantes) permanecen pendientes. T041 y T060 acreditan documentación/preparación, no aprobación humana. Siguen pendientes la aprobación competente de diseño y la revisión por otra persona con competencia de seguridad. No se autoriza integración ni se declara cumplimiento completo. Por instrucción del usuario, no ampliar allowlist, no modificar Constitution ni cambiar/agregar dependencias.

La implementación completa requiere cuatro historias y verificación transversal. Distinguir código terminado, controles automáticos ejecutados, revisión manual, estudio con participantes y aprobaciones humanas. No marcar pendientes externos como hechos ni alterar Constitution para eludirlos.

## Notes

60 tareas: Setup 3, Foundational 7, US1 12, US2 10, US3 10, US4 8, Polish 10. Todos los requisitos tienen cobertura en la matriz siguiente y los resultados se registrarán con evidencia real durante implementación.

| Cobertura | Tareas de referencia |
| --- | --- |
| FR-001; AC-101 | T014, T020, T033, T036 |
| FR-002; AC-201; EC-001 | T006, T008, T011, T024, T029 |
| FR-003/004; AC-202/206; EC-002/003/006 | T005, T007, T008, T024, T031 |
| FR-005/006; AC-203/204; EC-004/005/008 | T006, T008, T023, T027, T031 |
| FR-007; aceptación | T006, T014, T020, T025, T028 |
| FR-008/009; AC-205 | T023–T029, T043, T046 |
| FR-010; AC-102; EC-007 | T011, T012, T014, T017–T020, T022 |
| FR-011; AC-103/105; EC-013 | T015, T018, T021, T022 |
| FR-012/013/019; AC-401/402/403; EC-012 | T043–T050 |
| FR-014/015; AC-301/302; EC-009 | T034, T037, T038, T040 |
| FR-016; AC-303/304/305 | T025, T028, T033–T042 |
| FR-017; AC-104; EC-010/013 | T013, T015, T019, T021, T044, T048, T051 |
| FR-018; AC-207; EC-011 | T011, T018, T026, T030, T032 |
| SC-001 | T058 |
| SC-002 | T031, T032 |
| SC-003 | T022, T057 |
| SC-004/005 | T040–T042 |
| SC-006 | T050 |
| SC-007 | T051, T052 |
| SC-008 | T026, T030, T032 |
| C1 — Constitution 5.6/9.4: SAST independiente y bloqueo verificable | T054, T056, T057 |
| C2 — Constitution 8.1/9.4: cobertura de código afectado y global | T001, T055, T056, T057 |
| Constitution TDD/arquitectura/calidad/seguridad/gobierno | T001, T002, T004–T060 según alcance; síntesis T057–T060 |

Estado actualizado durante implementación; las tareas pendientes conservan su checkbox vacío. La Constitution no se modifica.









## Phase 8: Convergence

Evaluación de spec.md, plan.md, las 60 tareas existentes y Constitution v1.0.0. Esta sección añade siete seguimientos pendientes sin sustituir tareas anteriores; el resumen 55/60 se refiere a T001–T060. No ampliar allowlist, modificar Constitution, cambiar dependencias ni incorporar librerías. Documentar un pendiente humano no lo completa.

El script de prerrequisitos se intentó una vez y falló por ausencia de Bash; los artefactos se verificaron directamente en specs/002-registro-usuarios. No se consultó Git ni historial. No existe .specify/extensions.yml. Se inspeccionaron dominio, aplicación, composición, UI, navegación, adaptadores, tests, comprobadores y workflow. Las 15 pruebas de comprobadores pasan; no se volvió a ejecutar la suite completa ni se acredita ejecución remota de CI.

- [ ] T061 CRITICAL — F1: Mantener pendiente la revisión/autorización humana de las siete licencias bloqueadas y conservar el inventario de 15 paquetes, versiones y cadenas en specs/002-registro-usuarios/validation.md. Registrar una decisión competente solo cuando exista autorización explícita futura y evidencia; no ampliar allowlist, modificar Constitution ni cambiar dependencias. Mantener T053/T057 y la integración bloqueados mientras corresponda, conforme a Constitution 7.1.a/7.3/9.4 y T053/T057 (partial).
- [ ] T062 CRITICAL — F2: Obtener y registrar, cuando esté disponible, revisión competente sobre compatibilidad/autorización corporativa de LGPL-2.1 del motor Semgrep CE, que .github/security-tools.json deja pendiente. Enlazar evidencia en specs/002-registro-usuarios/validation.md; el aislamiento no exime revisión ni autoriza la herramienta. No alterar allowlist, dependencias o Constitution ni acreditar cierre completo de incorporación/integración de T054 sin evidencia, conforme a Constitution 7.1.a/7.4, plan:C1 y T054 (partial).
- [ ] T063 CRITICAL — F3: Completar revisión manual con tecnología de asistencia de obligatoriedad, etiquetas, errores, anuncios de envío/éxito, foco, teclado, orientación y zoom; conservar evidencia de geometría/contraste y registrar resultados reales en specs/002-registro-usuarios/validation.md. Mantener T040 pendiente hasta completar auditoría; reproducir primero con prueba fallida cualquier defecto automatizable antes de corregirlo, conforme a Constitution 8.4, FR-016, AC-303–AC-305, SC-004/005 y T040 (partial).
- [ ] T064 CRITICAL — F4: Registrar en specs/002-registro-usuarios/validation.md aprobación competente de ajustes de contraste/tokens y revisión independiente con competencia de seguridad únicamente cuando existan. Mantener ambas pendientes antes de integrar; T041/T060 acreditan documentación/preparación, no aprobación. No se autoriza solicitar revisiones externas, publicar, mergear o modificar políticas, conforme a Constitution 8.6/9.3, plan:accesibilidad y gobierno, T041/T060 (partial).
- [ ] T065 CRITICAL — F5: Cuando gobierno y licencias permitan cerrar el control, verificar ejecución efectiva de .github/workflows/quality.yml y registrar en specs/002-registro-usuarios/validation.md instalación, build, pruebas, cobertura global/afectada comparable, SAST, secretos, auditorías y bloqueo ante fallos. Mantener T056/T057 pendientes sin evidencia o con audit:licenses fallido; no suprimir controles, usar continue-on-error ni cambiar dependencias/allowlist/políticas para obtener verde, conforme a Constitution 5.6/8.1/9.4, plan:C1/C2 y T056/T057 (partial).
- [ ] T066 HIGH — F6: Escribir y ejecutar primero prueba fallida en src/domain/registration.identity.test.ts para correo de 254 puntos de código: 249 caracteres U+0130 (İ) seguidos de @b.co, válido según EC-003; agregar límite 255 y caracterización de login. Corregir el perfil de registro en src/domain/validation.ts para medir longitud tras trim sin expansión por conversión a minúsculas, preservando login y sin duplicar reglas. Ejecutar pruebas de dominio/integración aplicables y registrar rojo/verde en specs/002-registro-usuarios/validation.md, conforme a FR-004, AC-202/206, EC-003, T007/T008 y Constitution 1.1–1.3 (contradicts).
- [ ] T067 MEDIUM — F7: Mantener pendiente evaluación humana T058; cuando existan al menos cinco participantes y disponibilidad autorizada, aplicar protocolo preparado y registrar cantidad, tiempos, ayuda y reconocimiento de simulación en specs/002-registro-usuarios/validation.md. No inventar resultados, sustituir estudio con tests ni construir funcionalidad adicional; conservar pendiente explícito hasta tener evidencia, conforme a T058 y su criterio de evaluación (partial).

T066 puede implementarse con TDD independientemente de aprobaciones externas. T061–T065/T067 requieren evidencia o intervención humana y no autorizan acciones adicionales. Resultado: tasks_appended; T061–T067, cinco CRITICAL/una HIGH/una MEDIUM; seis partial/una contradicts, cero missing/unrequested demostrados. SC-001 se evalúa como obligación humana de T058, no como trabajo de construcción. No se declara convergencia completa ni autorización de integración.
