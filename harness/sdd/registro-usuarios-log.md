# Registro SDD de Registro de Usuarios

**Inicio**: 2026-10-15 (America/Buenos_Aires).
**Rama de trabajo**: `feature/registro-pedro-gandola`.

Este registro del harness conserva qué buscamos en cada paso, el prompt de trabajo, los supuestos,
las decisiones y las revisiones. Los documentos generados contienen el resultado vigente;
esta bitácora permite entender cómo llegamos a él. Una revisión del agente no equivale a
aprobación del usuario ni a una prueba de implementación. Las consignas vigentes están
separadas por etapa en la [guía del harness](README.md); los bloques históricos de este
registro conservan las entradas utilizadas antes de sus revisiones.

## Estado de los pasos

| Paso         | Documento de resultado                                                                                                                               | Estado                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Constitution | [Constitución existente](../../.specify/memory/constitution.md) y [revisión para Registro](../../specs/002-registro-usuarios/constitution-review.md) | Revisada por Codex; sin enmiendas propuestas   |
| Specify      | [spec.md](../../specs/002-registro-usuarios/spec.md) y [checklist](../../specs/002-registro-usuarios/checklists/requirements.md)                     | Borrador para revisión del usuario             |
| Clarify      | Sección de aclaraciones de `spec.md`                                                                                                                 | Alcance confirmado; revisión general pendiente |
| Plan         | `plan.md`, `research.md`, `data-model.md`, contratos y guía de validación                                                                            | Pendiente; no ejecutado                        |
| Tasks        | `tasks.md`                                                                                                                                           | Pendiente; no ejecutado                        |
| Analyze      | Informe de consistencia y resumen en esta bitácora                                                                                                   | Pendiente; no ejecutado                        |
| Implement    | Código, pruebas y avance de `tasks.md`                                                                                                               | Pendiente; no ejecutado                        |

## Paso 0 Constitution

**Intención**: identificar qué reglas ya rigen el proyecto y cómo afectarán al registro.
Se conserva la Constitución 1.0.0 que viene en el repo; no se genera otra copia normativa.

**Consigna de revisión aplicada**:

> Leer la Constitución existente y registrar las restricciones aplicables a Registro:
> TDD, SOLID, Clean Architecture, reutilización, seguridad, accesibilidad y trazabilidad.
> Identificar lo que habrá que verificar en el plan sin modificar los principios heredados.

**Resultado**: [constitution-review.md](../../specs/002-registro-usuarios/constitution-review.md). La revisión identifica
las comprobaciones que deberá completar el plan y distingue una demo de una cuenta real.

**Decisión de trabajo**: no hay necesidad identificada de enmendar la Constitución.
La conformidad de una implementación todavía no se ha evaluado.

## Paso 1 Specify

**Intención**: convertir los requisitos del taller en comportamientos verificables,
manteniendo separadas las decisiones de arquitectura que corresponden al plan.

**Prompt de trabajo utilizado**: síntesis de la solicitud y el taller; no es una transcripción
literal del mensaje del usuario.

```text
$speckit-specify
Definir la pantalla de Registro de Usuarios de KynWallet a partir del taller.
Incluir nombre completo, correo, contraseña, confirmación y aceptación obligatoria
de términos; validar inline los campos obligatorios, correo, longitud mínima de
ocho caracteres y coincidencia de contraseñas. Crear cuenta valida antes del envío.
El éxito lleva a /login con mensaje de confirmación; el enlace para quienes ya
tienen cuenta también lleva a /login. Google y Apple muestran alert "Próximamente".
En escritorio hay dos paneles; en móvil solo el formulario.
Referencia: Figma, frame 04 Registro, nodo 31:2 del archivo f7uDsv8sh6ZOtK2OitTqtg.
Respetar la Constitución y la base de login existente. Proponer una demostración
sin backend como supuesto del borrador, pendiente de revisión del usuario.
No inventar medidas visuales que aún no se hayan extraído de Figma.
Conservar feature/registro-pedro-gandola y usar specs/002-registro-usuarios.
Generar historias, requisitos y criterios de aceptación sin implementar código.
```

**Ejecución**: se aplicó la skill local `speckit-specify`; se resolvió la plantilla
`spec-template` con la CLI, se verificó que `002` estaba disponible y se conservó la rama.
No hay `.specify/extensions.yml`, por lo que no hay hooks previos o posteriores registrados.

**Resultado**: [spec.md](../../specs/002-registro-usuarios/spec.md), checklist de calidad y selección local de la feature
en `.specify/feature.json` (ignorada por Git).

**Alcance confirmado**: demo sin backend, envío simulado y sin guardar contraseñas.
**Supuestos todavía propuestos**: entrada por `/registro`; acceso desde el enlace de
registro del login; límites de longitud consistentes con la base existente.
Consultar la sección Assumptions de la spec.

**Pregunta enviada al usuario**: ¿demo sin backend o registro real conectado a una API?
Al crear el primer borrador, la demo figuraba como propuesta pendiente de respuesta.

**Respuesta recibida el 2026-10-15**: "Demo sin backend: envío simulado, sin guardar
contraseñas (Recomendado)". Se confirma ese alcance y se incorpora en Clarifications,
FR-019 y A1 de la spec. Esta respuesta no se registra como aprobación integral del
borrador ni de los otros supuestos.

**Revisión de calidad**: el agente contrastó los ocho requisitos del taller con historias
y requisitos verificables. El checklist documenta el resultado; la revisión del usuario
y el contraste con la extracción de Figma siguen pendientes.

## Paso 2 Plan

**Estado**: pendiente. La [consigna de Plan](plan/registro-usuarios.md) es una propuesta
editable del usuario, todavía no ejecutada.

Antes de ejecutarlo se registrará la revisión de la spec. Al terminar se anotarán las
decisiones, alternativas descartadas, archivos generados y revisión del plan.

## Paso 3 Tasks

**Estado**: pendiente. La [consigna de Tasks](tasks/registro-usuarios.md) es una propuesta
editable del usuario, todavía no ejecutada.

Se generará `tasks.md` a partir del plan, conservando la trazabilidad requisito -> tarea
-> prueba. No se marcarán tareas por anticipado.

## Referencia de diseño y coordinación con Claude

El usuario informó el 2026-10-15 que Claude Code ya está conectado al MCP de Figma.
Todavía no se recibieron archivos exportados en el repo.
La [consigna de extracción](figma/registro-usuarios.md) define qué guardar en
`specs/002-registro-usuarios/design/`.
La extracción no cambia la integración de spec-kit del repo, que sigue siendo Codex.

### Intento de extracción desde Claude Code (2026-10-15)

**Prompt utilizado**: el usuario pidió en Claude Code leer la consigna de Figma, ejecutar
el bloque "Consigna para Claude Code" y guardar los archivos en
`specs/002-registro-usuarios/design/`.

**Resultado**: bloqueado. La conexión al MCP funciona (`whoami` responde), pero
`create_session`, `get_design_context`, `get_metadata`, `get_variable_defs`,
`get_screenshot` y `download_assets` devolvieron "no tienes acceso de edición a este
archivo". La cuenta autenticada tiene asiento View en un plan Starter.

**Archivos guardados**: solo [extraction-notes.md](../../specs/002-registro-usuarios/design/extraction-notes.md),
con los Debug UUID, las limitaciones y las opciones para desbloquear. No se crearon
archivos ficticios de contexto, metadata, tokens, captura ni recursos.

**Reintento**: con la URL de la página (`node-id=0-1`) se obtuvo el mismo error; la cuenta
sigue con asiento View.

**Decisión del usuario**: duplicar el archivo en sus borradores. URL de la copia:
`https://www.figma.com/design/pMArqPGrwekkonUVIZLSn4/Billetera-Virtual---Prototipos--copia-`.

**Resultado con la copia**: extracción completa del nodo `31:2` (`04 · Registro`), que
conserva el ID. Se guardaron en `specs/002-registro-usuarios/design/`:
`design-context.md`, `metadata.xml`, `design-tokens.json` (vacío; el frame no usa
variables), `registro-desktop.png` (1440 × 1024), cuatro SVG en `assets/` y
`extraction-notes.md`.

**Hallazgos para la spec y el plan** (interpretaciones del agente):

- No hay frame móvil de Registro.
- El frame muestra solo el estado vacío, sin errores, foco ni éxito.
- Los iconos son formas provisorias.
- Varios pares de color no cumplen el contraste AA, por ejemplo el botón blanco
  sobre `#ff6b3d` (2.83).
- El layout coincide con el del login.

**Pendiente**: recepción en Codex y contraste con la spec. Esto no constituye revisión
humana ni aprobación del diseño.

## Organización del harness acordada el 2026-10-15

El usuario pidió separar las consignas de ejecución de los resultados y organizar las
entradas de Constitution, Specify, Plan y Tasks en carpetas propias. Se trasladó esta
bitácora desde la carpeta de la feature al harness, junto con la consigna de Figma.
Los prompts editables están en sus carpetas de etapa; la Constitución y los documentos
generados conservan las rutas que utiliza spec-kit. No se ejecutó Plan ni Tasks durante
esta reorganización. La siguiente intervención es la extracción de Figma desde Claude.

## Cómo actualizar este registro

## Ejecución completa autorizada — 2026-10-15

**Solicitud vigente**: «Ejecuta todos los pasos de spec-kit», considerando el apunte
SDD del usuario y Figma ya descargado; ejecutar paso a paso y aprobar al final.
Esto autoriza implementación y verificaciones locales, sin push, PR ni aprobación simulada.
Las secciones anteriores describen el estado histórico de preparación, no el actual.

| Paso         | Prompt aplicado y objetivo                                                                        | Resultado y decisiones                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Constitution | Revisar principios existentes contra Registro y consigna de constitution                          | v1.0.0 sigue vigente; constitution-review.md documenta revisión sin duplicación                                                          |
| Specify      | Actualizar Registro con taller, respuesta demo sin backend y extracción Figma                     | 22 requisitos, 5 historias y 6 criterios; misma feature y rama                                                                           |
| Clarify      | Resolver ambigüedades relevantes usando decisiones ya autorizadas                                 | Navegación /registro y /login; éxito efímero, fallo limpia contraseñas, términos informa indisponibilidad; spec registra supuestos       |
| Plan         | Ejecutar consigna plan y distinguir qué de cómo, según apunte                                     | plan/research/data-model/contracts/quickstart; sin paquetes nuevos; puerto sin datos; contraste AA con texto oscuro en panel             |
| Tasks        | Generar tareas atómicas, verificables y trazables desde diseño                                    | 26 tareas; pruebas previas por lote; revisión visual y controles antes de entrega                                                        |
| Analyze      | Comprobar coherencia de spec, plan, tasks y Constitución, sin alterar artefactos durante análisis | 22/22 FR y 6/6 SC cubiertos; sin hallazgos críticos/altos; dos textos históricos por actualizar; analysis.md registra revisión posterior |

**Fuentes**: PDF del taller, Constitución existente, extracción del nodo 31:2 de la
copia de Figma, apunte SharePoint leído sin modificaciones (method-reference.md),
código y pruebas del login. Las skills utilizadas son las locales de cada etapa.
No hay hooks de extensiones configurados. Checklist de calidad: 16/16 satisfechos.

**Implement**: autorizado; se ejecuta Rojo → Verde por lotes y se registrarán resultados
reales. Decisiones visuales de accesibilidad y estados sin frame quedan para revisión final.

### Mantenimiento del registro

### Implementación y controles — 2026-10-15

**Prompt aplicado**: ejecutar las tareas de Registro con TDD, conservar login, capas y
componentes, sin backend ni persistencia; validar contra spec/plan y registrar resultados.

**Rojo**: lote de dominio/contrato/componentes falló en 5 archivos (3 módulos nuevos
ausentes, 2 expectativas de controles y un helper de etiqueta), con 7 pruebas anteriores verdes. Lote UI falló
en 4 archivos (formulario ausente, 9 escenarios App, variante y enlace), con 22 pruebas verdes.
**Verde**: base 25/25; suite completa posterior 163/163 en 21 archivos. Se ajustó una
aserción de foco para esperar el efecto React; se mantuvo la expectativa de foco.

**Resultado funcional**: Registro con validación inline, progreso, error recuperable,
visibilidad independiente, términos informativos, alert social y navegación al login.
El puerto de registro no recibe datos; la respuesta de un formulario abandonado se ignora,
incluso con navegación en la misma tanda o restauración de página.

**Controles**: `harness.cmd -Task Verify` código 0: lint, formato, tipos, cobertura,
build, dependencias (0 vulnerabilidades), licencias y secretos. Cobertura 99,09 % de
sentencias, 96,24 % de ramas, 100 % funciones y 99,63 % líneas. Sin cambios de umbrales.

**Limitación actual**: revisión visual real pendiente. CUA no tiene navegadores disponibles;
se solicitó al usuario habilitar uno o autorizar Playwright local. No se sustituye con jsdom.
La extracción de Figma ya está recibida y contrastada; esto actualiza las entradas históricas.
No se hizo push, PR ni se registró aprobación humana.

**Actualización de navegador**: posteriormente apareció Edge conectado. Se verificaron
1440×1024, 375 y 320, sin scroll horizontal, foco/orden real de 12 controles, validación,
envío con Space/Enter, confirmación en login vacío y ausencia de aviso tras reload.
Se guardaron siete capturas en `specs/002-registro-usuarios/evidence/`.

Los atajos de zoom nativo no cambiaron las medidas mediante la conexión. Se añadió un
harness de verificación con iframe a mitad de viewport y escala 2 para comprobar contenido
ampliado al 200 %, errores, foco y acceso a controles. Esto no se presenta como prueba del
menú de zoom de Edge. La conexión se interrumpió durante la última captura ampliada;
no se inventó esa evidencia. `verification.md` detalla resultados y limitaciones.

**Converge**: 22 FR, 6 SC y 23 escenarios contrastados con código y decisiones del plan.
Un hallazgo bajo de reutilización produjo T027, añadido al final: usar el máximo de
contraseña compartido también en confirmación. Se retomó Implement para refactorizar;
13 pruebas enfocadas pasaron sin alterar casos ni comportamiento. Se repite Verify
por el cambio final de código. Aprobación humana y de diseño permanecen pendientes.

**Segunda pasada de Converge**: sin trabajo de código pendiente; no se añadió una fase
vacía ni se modificaron tareas durante la evaluación. 27 tareas ejecutadas, con resultados
y límites en verification.md. La evidencia de ampliación controlada no se confunde con
el zoom nativo del navegador. Los documentos quedan preparados para revisión del usuario.

**Cierre — 2026-10-16**: segunda ejecución completa de Verify, código 0; 163 pruebas,
misma cobertura, build, auditorías y secretos satisfactorios tras T027. `git diff --check`
sin errores; rama y cambios ajenos conservados. 27/27 tareas ejecutadas. Spec, plan,
contratos, decisiones, pruebas y capturas preparados para aprobación humana final,
que permanece pendiente. El detalle del intento de restaurar el viewport tras la
interrupción de Edge consta en verification.md.

## Ajustes solicitados el 2026-10-16: login, spinner y ubicación

**Solicitud**: el usuario intentó entrar con los datos del registro; pidió un spinner de
al menos un segundo y preguntó por qué las etapas estaban dentro de harness/sdd en vez
de sus rutas nativas. No se interpreta como autorización de backend o persistencia nueva.

**Diagnóstico**: faltaba `.env.local`; el login no tenía cuentas configuradas. El adaptador
ya esperaba 1000 ms, pero Button solo cambiaba el texto, sin spinner visual.

**Decisiones**: configurar una cuenta completamente ficticia solo en `.env.local`
(ignorado por Git; no copiar credenciales a documentos versionados); añadir spinner al
Button compartido, manteniendo su nombre accesible, estado ocupado y movimiento reducido.
Explicar en formulario y confirmación que Registro no crea usuarios del login.

**Rojo observado**: 3 archivos de pruebas fallaron con 4 casos y 37 casos previos verdes:
spinner de Button, duración integrada de 1000 ms, texto de confirmación y aviso de demo.
Tras implementar, dos aserciones apuntaban al title no visible del SVG; se corrigieron
para comprobar la visibilidad del SVG contenedor, manteniendo la misma exigencia visual.

**Estructura verificada**: la skill de Constitution usa `.specify/memory/constitution.md`;
common.ps1 resuelve spec/plan/tasks en `specs/002-registro-usuarios/`. Se conservan esas rutas. `harness/sdd/`
es una organización manual de consignas y bitácora, fuera de la salida de los comandos.
SDD no obliga a tener un archivo de cada etapa en el root; se aclara en ambos README.

**Verde enfocado**: 41/41 pruebas en los tres archivos, incluida la integración real
App + createRegister + SimulatedRegistrationGateway a 999/1000 ms. Vite detectó la
configuración de la cuenta ficticia; comprobado sin registrar sus valores. `.env.local`
está ignorado por Git. Se ejecuta Verify completo después del cambio.

**Revisión visual del ajuste**: la conexión CUA devuelve cero navegadores actualmente.
Se pidió al usuario reconectar Edge o autorizar Playwright local; no se presenta como
completada esta nueva comprobación de navegador por existir capturas de la versión anterior.

**Verify con concurrencia automática**: 149/166 pasaron; ocho timeouts de 5000 ms
afectaron también pruebas existentes, con fallos en cascada del act pendiente en App.
Se repite el mismo comando de controles con `VITEST_MAX_WORKERS=2` solo para el proceso,
opción verificada en el paquete Vitest instalado. Se conservan timeouts, pruebas,
umbrales y configuración del proyecto. La variable previa se restaura al terminar.

**Respuesta del usuario**: «Voy a reconectar Edge». Se verificará acceso real antes de
considerar completada la revisión visual de los ajustes.

**Cierre automatizado del ajuste**: Verify con dos workers, código 0, 166/166 pruebas,
cobertura 99,09 % sentencias / 96,27 % ramas / 100 % funciones / 99,63 % líneas. Pasaron
lint, formato, tipos, build, auditorías (0 vulnerabilidades) y secretos. La configuración
versionada de Vitest permanece intacta y la variable del proceso fue restaurada.

**Nueva observación del usuario**: pudo iniciar sesión, pero esperaba contenido interior
de la billetera. Se explicó que WelcomeView es una bienvenida de la demo y que la
extracción disponible cubre solo Registro (31:2). Se pidió el nodo o nombre del frame
Inicio para preparar la siguiente funcionalidad, sin inventar pantallas o datos.

**Pendiente**: T031 sigue abierto por revisión visual del spinner; el login ya fue
confirmado manualmente por el usuario. La sesión CUA aún devuelve cero navegadores,
también tras refrescar su conexión. No se registra esta limitación como una aprobación.

## Referencias del interior — 2026-10-16

**Respuesta del usuario**: «es la vista 03 y 04 de figma» a la solicitud del frame Inicio.
Se preparó `harness/sdd/figma/vistas-03-04.md` para Claude Code, que tiene la conexión
de Figma. La metadata local anterior solo contiene 31:2, «04 · Registro»; falta verificar
la correspondencia actual entre números, nombres, páginas y node-id.

**Resultado de este paso**: consigna concreta de inventario y extracción, todavía no
ejecutada. Las nuevas fuentes se recibirán en `figma/vistas-03-04/`, como entrada de
diseño compartida, sin sobrescribir Registro ni alterar las rutas o el puntero de spec-kit.
No se inventan pantallas interiores, saldos ni navegación mientras falte esa referencia.

### Ejecución en Claude Code — 2026-10-16

**Prompt utilizado**: el usuario pidió en Claude Code leer
`harness/sdd/figma/vistas-03-04.md` y ejecutar el bloque "Prompt para Claude Code" con
el MCP de Figma.

**Resultado**:

- El archivo `pMArqPGrwekkonUVIZLSn4` tiene una sola página (`0:1`) y un único
  candidato por número, sin ambigüedad:
  - `03 · Home — Desktop` (`13:2`, 1440 × 1024): inicio o dashboard de escritorio.
  - `04 · Registro` (`31:2`): **sigue siendo Registro**, sin diferencias respecto de
    la extracción del 2026-10-15.
- Navegación real, leída con `use_figma` en solo lectura: el flujo empieza en el
  login (`2:2`). Un clic en su `Form Panel` lleva a `13:2`; un arrastre, a `31:2`. No
  hay otras conexiones.
- También existe `02 · Home` (`11:2`, móvil 390 × 844), que no se extrajo por estar
  fuera del alcance pedido.

**Archivos**: `figma/vistas-03-04/` con `inventory.md`, `extraction-notes.md` y una
carpeta por vista (`03-home-desktop-13-2/` y `04-registro-31-2/`). Cada carpeta tiene
contexto, metadata, variables (respuesta vacía real), captura y SVG. No se modificó
`specs/002-registro-usuarios/design/`.

**Hallazgos para la próxima spec** (interpretaciones del agente):

- 03 tiene desbordes: la tarjeta KPI sale del frame y hay textos fuera de sus tarjetas.
- Los datos de ejemplo no son coherentes entre sí.
- Los iconos son provisorios.
- Varios pares de color no cumplen el contraste AA.
- No hay estados ni pantallas secundarias.
- Las acciones y la navegación difieren entre 02 y 03.

**Ampliación pedida por el usuario («si, ok»)**: se extrajo también `02 · Home` (`11:2`,
móvil 390 × 844) en `figma/vistas-03-04/02-home-mobile-11-2/`. Contiene contexto,
metadata, variables vacías, captura y 3 SVG. No está conectado en el prototipo.

Respecto de 03, omite las tarjetas KPI, "Mi tarjeta" y "Resumen del mes", y difiere en:

- la cuarta acción: Más frente a Pagar;
- la navegación: QR frente a Tarjetas y Pagos;
- la cantidad de movimientos: 4 frente a 5;
- el color de las salidas: `#ff6b3d` frente a `#ef5226`.

**Pendiente**: recepción en Codex y decisión del alcance del interior de la billetera.
Esto no constituye revisión humana ni aprobación del diseño.

En cada paso registrar fecha, objetivo, prompt realmente utilizado, fuentes, resultado,
supuestos, decisiones con justificación y respuesta del usuario cuando exista. Distinguir
las propuestas de las decisiones confirmadas. Al cambiar una decisión, conservar aquí el
motivo y actualizar el documento de resultado para que refleje la versión vigente.
