# Verificación de Registro

Fecha de ejecución: 2026-10-15. Agente: Codex. Aprobación humana: **pendiente**.

Los resultados de la primera entrega se conservan como historial. Los ajustes del
2026-10-16 y su comprobación se registran al final de este documento.

## Evidencia TDD

| Lote | Rojo observado antes de producción | Verde / seguimiento |
| --- | --- | --- |
| Dominio, caso de uso, adaptador y componentes | 5 archivos fallaron: 3 módulos inexistentes, 2 expectativas de controles y 1 helper que buscaba la etiqueta anterior; 7 pruebas anteriores pasaron | Helper corregido para usar la etiqueta recibida; 5 archivos, 25 pruebas pasaron |
| Formulario, navegación, variante y compatibilidad | 4 archivos fallaron: formulario inexistente, 9 escenarios App, 1 variante y enlace antiguo; 22 pruebas pasaron | Primera ejecución: 59/60; tras sincronizar la aserción de foco, suite completa 163/163 |

Se corrigió la sincronización de la prueba de foco con `waitFor`, sin relajar la
expectativa de foco ni cambiar el comportamiento. Los límites y escenarios de UI
se escribieron antes del código de producción del formulario/navegación.
Las pruebas colocalizadas conservan IDs FR/US para distinguir Registro del login.
La prueba de nombre diferenciado de visibilidad se escribió antes de producción;
su primera ejecución se detuvo en el helper de etiqueta, no en la aserción final.
Se conserva esta precisión al interpretar la evidencia Rojo/Verde del lote.

## Matriz de trazabilidad

| Requisito | Tareas | Evidencia automatizada o visual |
| --- | --- | --- |
| FR-001–007 | T003–006/T013–014 | registration.test.ts, register.test.ts, RegistrationForm.test.tsx; campos, límites, igualdad, términos y envío inválido |
| FR-008–009 | T007–008/T013–014 | blur, corrección, foco en primer error, asociación de errores y checkbox |
| FR-010 | T009–010 | doble submit en misma tanda, controles ocupados, StrictMode |
| FR-011–012 | T009–012 | éxito único, fallo genérico, reintento, limpieza de contraseñas; App.registration.test.tsx |
| FR-013 | T015–016 | enlaces href reales, rutas / y /login; compatibilidad en LoginForm.test.tsx |
| FR-014 | T019–020 | alert nativo exacto de Google y Apple, sin envío |
| FR-015–017 | T017–018/T022 | axe vacío/error/ocupado, orden Tab y variante; revisión real en Edge, capturas y medidas abajo |
| FR-018–019 | T005–006/T021 | puerto sin argumentos; sin fetch/Storage/logs/URL/history.state con datos; adaptador temporizado |
| FR-020–021 | T007–008/T017/T019–020 | visibilidad independiente, términos no cambia casilla; componentes compartidos |
| FR-022 | T011–012/T015/T021 | abandono, resolución misma tanda, remonte, popstate, pagehide/pageshow persistido |
| SC-001–003 | T003–021 | suites de historias y contratos de envío/éxito |
| SC-004–005 | T017/T022 | axe y contraste R3; revisión de escritorio/móvil y contenido ampliado controlado |
| SC-006 | T021/T023 | privacidad, regresión del login y controles completos |

## Calidad y revisión visual

`scripts/harness.cmd -Task Verify` terminó con código 0. Resultados:

- ESLint, Prettier y TypeScript estricto: satisfactorios.
- Vitest: 21 archivos y 163 pruebas satisfactorias; ninguna omitida.
- Cobertura: sentencias 99,09 %; ramas 96,24 %; funciones 100 %; líneas 99,63 %.
  Supera los cuatro umbrales existentes del 80 % sin cambiar configuración.
- Build de producción: satisfactorio, 58 módulos; JS 240,28 kB (gzip 74,99 kB).
- Auditoría de dependencias: cero vulnerabilidades; licencias de producción permitidas.
- Secretlint: satisfactorio. No se incorporaron dependencias ni se cambió el lockfile.
- `git diff --check`: satisfactorio; rama conservada `feature/registro-pedro-gandola`.

## Revisión real en Edge

Inicialmente CUA no tenía navegadores. Después apareció Edge conectado y se utilizó
esa conexión, sin instalar ni ejecutar un navegador alternativo. Los controles se hicieron
sobre `http://localhost:5173/registro`, sin cambiar la configuración global del equipo.

| Recorrido | Evidencia y resultado |
| --- | --- |
| Escritorio 1440 × 1024 | Panel 620 px; formulario 400 px en x820/y140, medidos en DOM; scrollWidth 1440 = viewport; dos paneles visibles |
| Móvil 375 × 812 | Panel de marca display none; scrollWidth 375 = viewport; campos y pie sin solapamientos |
| Móvil 320 × 812 | Solo formulario; sin scroll horizontal. Con errores, ancho útil 305 por scrollbar vertical, sin desborde |
| Teclado real | 12 controles en orden esperado; foco visible en controles, TextField mediante focus-within; Space acepta casilla y Enter envía |
| Validación real | Cinco errores inline al recorrer campos vacíos; datos válidos sin aceptar términos enfoca exclusivamente casilla |
| Envío desde móvil | «Creando cuenta…», campos deshabilitados, luego /login con confirmación y credenciales vacías |
| Recarga del login | El aviso no reaparece; contador de role status = 0 tras reload |
| Ampliación controlada 200 % | Harness HTML con iframe 720 × 512 escalado a 1440 × 1024; campos/errores/foco sin solapamientos; desplazamiento vertical permite acceder a controles |
| Contraseñas al ampliar | Enter sobre visibilidad de confirmación deja contraseña type password y confirmación type text; después se volvió a ocultar |

Capturas guardadas, inspeccionadas durante la ejecución:

- [Escritorio](evidence/registro-desktop.jpg)
- [Móvil 375](evidence/registro-mobile-375.jpg) y [móvil 320](evidence/registro-mobile-320.jpg)
- [Errores a 320](evidence/registro-errors-320.jpg)
- [Confirmación en login](evidence/registro-success-login-320.jpg)
- [Contenido ampliado 200 %](evidence/registro-zoom-200.jpg) y [errores ampliados](evidence/registro-zoom-200-errors.jpg)

**Límite de la ampliación**: los atajos de zoom nativo no modificaron las medidas del
navegador mediante esta conexión. Se usó `harness/sdd/verification/zoom-200.html`, que
duplica el contenido y reduce a la mitad su viewport CSS; verifica ampliación y reflow,
pero no certifica el menú de zoom nativo de Edge. El último envío ampliado encontró el
heading de login en el diagnóstico del selector; la conexión se interrumpió antes de
guardar su captura, por lo que no se utiliza como evidencia visual adicional de éxito.
La confirmación completa sí se verificó y capturó en el recorrido móvil normal.

No se detectaron discrepancias nuevas que requieran modificar el código tras esta revisión.
El juicio de aprobación de diseño del usuario sigue pendiente.

## Diferencias de diseño declaradas

- Colores accesibles existentes en botón, enlaces, texto secundario, errores y bordes.
- Texto oscuro opaco en panel de Registro y tarjeta, conservando el gradiente extraído.
- Icono de visibilidad oscurecido en Registro para contraste de control.
- Aviso explícito de demo añadido después del pie; no existe en el frame.
- Móvil, estados de error/espera y foco se derivan de requisitos; Figma solo entrega escritorio vacío.
- Se reutilizan los marcadores geométricos de iconos del diseño y componentes del login.

Research R3 conserva los cálculos y alternativas. Estas decisiones están implementadas
para revisión; no constituyen aprobación de diseño por el usuario.

## Convergencia y paquete de revisión

Primera pasada `$speckit-converge`: 22 FR, 6 SC, 23 escenarios, seis decisiones R1–R6
y los controles de Constitución. Un hallazgo bajo de reutilización: el máximo de
confirmación era el literal 128, en lugar de la constante compartida. Se añadió T027
al final de tareas, sin reescribir spec/plan ni las tareas existentes.

`$speckit-implement` retomó T027 como refactorización con suite verde: reutiliza
`PASSWORD_MAX_LENGTH`. Las 13 pruebas enfocadas de dominio/caso de uso volvieron a pasar.
No cambió ningún comportamiento ni se ajustaron pruebas para aceptar reglas distintas.

Segunda pasada de Converge: cero hallazgos pendientes de código (missing/partial/
contradicts/unrequested = 0); seis decisiones del plan y seis principios centrales
contrastados, junto a controles de calidad/gobierno. No se añadió una fase vacía ni
se alteró tasks.md durante esta pasada. Las 27 tareas tienen evidencia de ejecución.

Paquete para aprobación: [spec](spec.md), [plan](plan.md), [research](research.md),
[modelo](data-model.md), [contratos](contracts/registration.md), [tasks](tasks.md),
[revisión constitucional](constitution-review.md), [análisis previo](analysis.md),
esta matriz y siete capturas. Prompts, autorizaciones y decisiones están en la
[bitácora](../../harness/sdd/registro-usuarios-log.md). Los marcadores de tareas describen
ejecución del agente; no aprobación humana.
No se creó cuenta real, backend, dependencia, ticket, commit, push ni PR en este ciclo.

**Cierre del 2026-10-16**: segundo `harness.cmd -Task Verify` terminó con código 0
después de T027: mismas 163 pruebas y métricas, build, auditorías y escaneo satisfactorios.
La pasada final de `git diff --check` también pasó. El cambio queda local, preparado
para la revisión y aprobación humana solicitadas.

Se intentó restaurar el viewport tras reconectar Edge; la conexión volvió a interrumpirse
antes de ejecutar reset. El ajuste de viewport se aplicó como emulación temporal de la
herramienta; no se modificó configuración global ni se utilizó un navegador alternativo.

## Ajuste de login y spinner — 2026-10-16

Solicitud del usuario: poder usar el login, ver un spinner durante al menos un segundo
y conservar los documentos SDD donde los generan los comandos.

- Se configuró una cuenta ficticia únicamente en `.env.local`, ignorado por Git.
  Vite detecta la configuración; no se copian sus credenciales a este informe.
- Registro sigue sin crear cuentas de login ni guardar los datos enviados. Mensajes
  del formulario y confirmación ahora lo explican; spec y contrato reflejan el cambio.
- Button muestra un SVG giratorio con el estado ocupado, manteniendo su nombre accesible;
  con movimiento reducido, el indicador queda estático.
- El adaptador conserva su espera predeterminada de 1000 ms. Nueva prueba de App con
  caso de uso y adaptador reales: spinner y ruta Registro a 999 ms, login a 1000 ms.
- Rojo: cuatro fallos esperados en tres archivos, 37 pruebas previas verdes. Luego se
  corrigió la aserción de visibilidad para apuntar al SVG y no a su title no visible.
  Verde: 41/41 pruebas enfocadas.
- Rutas nativas verificadas: `.specify/memory/constitution.md` y
  `specs/002-registro-usuarios/{spec.md,plan.md,tasks.md}`. `harness/sdd/` contiene
  consignas y registro manuales; no se reubicó ninguna salida de spec-kit.

Verify completo en ejecución. Nueva revisión visual pendiente de conexión de navegador;
CUA devuelve inventario vacío. No se reutilizan capturas antiguas como prueba del spinner.

La primera ejecución completa del ajuste terminó con 149/166 pruebas satisfactorias:
hubo timeouts de 5000 ms en ocho pruebas y nueve fallos posteriores al quedar pendiente
el act del primer timeout. También afectó pruebas previas del login. Se vuelve a ejecutar
el mismo Verify con `VITEST_MAX_WORKERS=2`, una opción comprobada en el Vitest instalado.
Se limita solo la concurrencia del proceso: no se cambian timeouts, casos, aserciones,
cobertura, paquetes ni configuración versionada. La variable se restaura al terminar.

**Resultado final automatizado del ajuste**: Verify con dos workers terminó con código 0.
21 archivos, **166/166 pruebas**; cobertura de sentencias 99,09 %, ramas 96,27 %, funciones
100 % y líneas 99,63 %. Lint, formato, tipos, build, dependencias (0 vulnerabilidades),
licencias y secretos satisfactorios. Build JS 240,79 kB (gzip 75,24 kB).

**Confirmación del usuario**: informó que pudo iniciar sesión con la cuenta de prueba.
Se registra como prueba manual de acceso, no como aprobación de diseño. Observó que
solo se muestra una bienvenida: esa es la vista existente de la demo de login, sin
interior de billetera implementado. La extracción recibida incluye solo Registro 31:2;
se solicitó el frame Inicio para definir la siguiente funcionalidad con su propio SDD.

**Pendiente de este ajuste**: comprobación visual del nuevo spinner en navegador. CUA
sigue sin conexión disponible incluso después de refrescar su sesión; el usuario indicó
que reconectaría Edge. T031 permanece abierto por esa parte, aunque sus controles
automáticos y el login manual ya estén verificados. No se inventan capturas nuevas.
