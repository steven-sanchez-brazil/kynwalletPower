# Bitácora SDD: Inicio de billetera

## 2026-10-16 · autorización y fuentes

Usuario: «Listo ya lo extrajimos, inicia el trabajo». Mantiene autorización previa de ejecutar todas las etapas y revisar al final. Rama `feature/registro-pedro-gandola`. Sin push ni PR.

Fuente: exportación local `figma/vistas-03-04/`; se inspeccionaron capturas escritorio y móvil, inventario, metadatos y contexto. Home real: 03/13:2 y 02/11:2. 04/31:2 es Registro. No se invocó MCP Figma desde esta sesión ni se ejecutó el código de referencia exportado.

## Constitution · revisión

Objetivo: comprobar principios vigentes. Constitución 1.0.0 conservada: TDD, capas, inyección, KISS, privacidad, accesibilidad, controles y revisión humana. No se necesita enmienda. Evaluación de cumplimiento en `specs/003-inicio-billetera/constitution-review.md`.

## Specify · ejecutado

Prompt: `specify/inicio-billetera.md`. Plantilla resuelta mediante `resolve-template.ps1 spec-template -Json`; feature nueva por funcionalidad distinta, siguiente número 003, rama conservada. Resultado: spec con 3 historias, 10 requisitos y 5 criterios; checklist documental 16/16. No es aprobación humana.

## Clarify · ejecutado

Objetivo: resolver ambigüedades antes del plan. Se usan respuestas previas (demo sin backend y revisión final). Sin preguntas críticas pendientes. Supuestos registrados: avisos para destinos inexistentes, identidad personalizada sin correo de personaje, datos estáticos y diferencias de accesibilidad. No se atribuyen al usuario decisiones que no haya tomado.

## Plan · ejecutado

Prompt: `plan/inicio-billetera.md`. Ejecutado `setup-plan.ps1 -Json` después de llenar spec. Investigación delegada de solo lectura según skill: `research_design` y `research_navigation`. Resultado: plan, research, modelo, contrato UI, quickstart y revisión constitucional. Git real conserva `feature/registro-pedro-gandola`; el primer script sin Git en PATH informó el nombre de carpeta como fallback. Se repitieron prerequisitos con Git disponible, sin cambiar rama.

## Tasks · ejecutado

Prompt: `tasks/inicio-billetera.md`. `setup-tasks.ps1 -Json` resolvió plantilla; 15 tareas, agrupadas en US1 (4), US3 (2), US2 (2), preparación/fundación (4) y controles (3). Rojo antes de producción; fases con dependencias y validación independiente.

## Analyze · ejecutado, solo lectura

Prerrequisitos `-RequireSpec -RequireTasks -IncludeTasks`. Inventario: 10 FR y 5 SC, 15 tareas. Cobertura: FR001 T006/T008; FR002/003 T003–008; FR004 T011/012; FR005 T005/007; FR006/007/009 T009/010; FR008 T005/007/013/014; FR010 T013/014. SC001 T006/008/009, SC002 T005/007/014, SC003 T011–014, SC004 T009/010/014, SC005 T014. Sin requisitos ni tareas huérfanos; sin duplicaciones o conflictos críticos/altos. No se editaron artefactos durante el análisis. Checklist 16/16. Revisión humana pendiente.

## Implement · ejecutado

Prompt: `tasks/inicio-billetera.md`. Ignorados y controles existentes comprobados; sin nuevas dependencias. Rojo: dos suites de datos sin módulos; luego Home sin componente y 5/8 integraciones fallidas; reducer 1/15 fallida por retener credenciales. Verde enfocado: 5 archivos, 29 pruebas. Implementación: snapshot único inyectado, Home responsive, callback de acceso, sesión efímera y avisos. Primera verificación completa: 25 archivos, 180 pruebas, build/auditorías/secretos pasan. Se agrega prueba de contrato de guardia síncrona para cubrir ramas de rechazo que el desmontaje del formulario puede ocultar en la integración.

Navegador: capturas reales 1440×1024 y 390×844 guardadas; notificaciones activadas con Tab/Enter y foco conservado. La conexión de Edge es intermitente al cambiar viewport (pérdida de debugger/timeout); controles restantes se registrarán con su resultado real.

## Revisión, ajuste y cierre técnico

Reflujo real 320/390/768/1440 completado; clientWidth=scrollWidth en todas las mediciones (scrollbar vertical de 15 px cuando corresponde). Controles por teclado, avisos, saldo intacto, salida, atrás, ruta directa y recarga comprobados. Nombre ficticio de 80 caracteres y ampliación equivalente al 200 % en iframe escalado revisados; no se atribuye a zoom nativo. Configuración local temporal restaurada por hash y respaldo ignorado eliminado.

El registro real mostró busy/disabled/SVG y confirmó a login; la espera de 999/1000 ms se verifica automáticamente. Para fotografiar el mismo indicador se agregó fixture de desarrollo con demora de 10 s, rotulado en pantalla: `verification/registro-spinner.html`. No cambia el segundo de envío de la aplicación. Imagen observada y guardada en evidencia.

Se agregó T016 al detectar que el salto al contenido mediante fragmento podía revocar sesión por popstate. Rojo: 1/5 pruebas de Home fallida por foco. Corrección: ref a main, preventDefault y foco directo. Comprobación real: MAIN activo, hash vacío, Inicio visible y ruta conservada.

Resultado final: Verify código 0, 26 archivos y 183 pruebas; cobertura 99.20/97.32/100/99.69 % (sentencias/ramas/funciones/líneas), sin degradar la base. ESLint adicional del fixture en verde. Sin nuevas dependencias. Git diff y whitespace revisados, rama original conservada. Documentación de ejecución y fuentes actualizada. Aprobación humana, revisión independiente e integración siguen pendientes.

## Converge · ejecutado

Prompt de cierre: contrastar código actual con spec, plan, tareas y Constitución, sin inferir nuevo alcance. Prerrequisitos de feature ejecutados. Resultado comunicado: sin trabajo técnico restante, 10 requisitos, 5 criterios, 8 escenarios, 16 tareas y decisiones de plan revisados. Sin tareas nuevas ni cambios en tasks.md durante la evaluación (SHA256 `6D79FFA9597EA5D9D462191C9EED7BB41130E6C91304659139BE9E3E3A9DCAC4`). Sin hooks de extensión configurados. Este registro se agrega al cerrar la bitácora, después del paso. No representa aprobación humana.

## Corrección visual posterior solicitada por el usuario

Prompt: restituir el texto blanco del diseño después del login (nombre, moneda, dinero, menú), mantener perfil visible con scroll interno en sidebar de escritorio y revisar solo los símbolos de Login/Registro. «Luego todo ok» no se interpreta como autorización de push o PR.

Se actualizan spec FR-011/012/013, plan/research/contrato y tareas T017–T019. La instrucción de blancos prevalece sobre la preferencia anterior del agente; contraste blanco/#ff8a65 = 2.314:1 documentado, sin afirmar AA completo. El resto de estilos y funcionalidades se conserva.

Rojo antes del cambio: prueba de BrandPanel 1/3 fallida (Registro seguía usando 20×44 de Login); navegador a 1440×600 reporta sidebar estático, perfil inferior en y=873 y texto rgb(22,24,44). A 390×844 cabecera y saldo también oscuros. Mediciones de DOM respaldan la reproducción; jsdom no se usa como prueba de layout.

Implementación: blancos de Figma en Inicio, contenedor naranja dinámico para cabecera/saldo, sidebar sticky 100dvh con nav overflow-y:auto y perfil no contraíble. Login conserva SVG 20×44; Registro usa conjunto 18×28; Inicio conjunto 20×22 con coordenadas de los metadatos. Verde enfocado: 3 archivos, 16 pruebas. Verify y comparación visual final en curso; Edge se desconectó después de las mediciones previas y se solicitó reconexión.

Consulta adicional del usuario sobre estructura: se explicó que la Constitución nativa está en `.specify/memory/constitution.md` y spec/plan/tasks en `specs/<feature>/`; el harness es manual y opcional. No se movieron resultados ni se cambiaron resolutores.

Cierre de la corrección: Edge se reconectó y se completaron las mediciones en verde. A 600 px de alto, perfil y=518–576; después de scroll de documento 306 px no cambia su posición. A 320 px de alto, menú de 99 px para contenido de 276 px, scroll interno≈177 con teclado y perfil y=238–296. Textos del menú y tarjeta blancos; cabecera/saldo móviles blancos a 390/320 sin overflow horizontal. Símbolos de Login/Registro distintos y con dimensiones fuente; Home con geometría 20×22. Capturas y mediciones en verification.md. Verify completo código 0: 184 pruebas, cobertura 99.20/97.38/100/99.69 %. Ajustes de diseño solicitados implementados, sin atribuir aprobación de integración ni conformidad AA de los blancos.

## Revisión de arquitectura y preparación de entrega · 2026-10-16

Prompt del usuario: «revises la arquitectura original planteada y la que nosotros hicimos, me gustaría que quede similar. Luego de eso hacemos el commit y push». Esta solicitud autoriza commit y push al fork; el PR al repositorio original queda para el siguiente paso.

Se contrastaron el plan, modelo, contratos y código del Login original en `bb334ff94b508b538d2e34f809bd3c5a5996a725` con Registro e Inicio. Resultado en `specs/003-inicio-billetera/architecture-review.md`: mismas cuatro capas, dependencias hacia dominio, puertos inyectados desde main, estado local y CSS Modules; sin paquetes adicionales. Diferencias intencionales de demo y herramientas documentadas.

Se alineó Registro con el patrón original: resultado en `domain/registration.ts`, mensajes en `domain/messages.ts` y reglas en `domain/validation.ts`. No cambia comportamiento. Evidencia: 38/38 pruebas enfocadas antes y después; Verify completo final código 0 con 26 archivos y 184/184 pruebas; cobertura 99.20/97.38/100/99.69 %. Lint, formato, tipos, build, auditoría de dependencias (0 vulnerabilidades), licencias y secretos pasan. Se reutiliza la revisión visual anterior porque este ajuste solo redistribuye responsabilidades.

Se revisan staged y exclusiones antes de publicar. La URL corporativa privada del apunte se retira del resumen metodológico. `.env.local`, configuración local de feature, dependencias y artefactos generados permanecen ignorados. Commit/push aún pendientes al registrar este paso; la evidencia de publicación se añadirá tras comprobar el remoto.

Entrega: commit `b09886647439dfd997d6c6f0fcf2d92be76e2ab2`, «feat: agregar registro e inicio con arquitectura alineada al login». Push a la rama elegida del fork con código 0 y upstream configurado; `git ls-remote` confirmó ese SHA y `git status --short` quedó vacío. Se completa T022 después de comprobar la publicación y se versiona este cierre documental por separado. El PR continúa pendiente.
