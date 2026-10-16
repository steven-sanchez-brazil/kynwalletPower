# KynWallet: instrucciones para Codex

## Contexto y fuentes

Este repositorio contiene la demo de login de KynWallet. El siguiente trabajo es el
registro de usuarios del taller SDD + Figma MCP. Leer antes de cambiar comportamiento:

Actualización 2026-10-16: Registro ya está implementado. La feature activa adicional es
Inicio, `specs/003-inicio-billetera/`, fuente local `figma/vistas-03-04/`: escritorio
03 (`13:2`), móvil 02 (`11:2`); 04 sigue siendo Registro. Mantener la rama del taller.
Para Inicio, seleccionar su carpeta en `.specify/feature.json` y usar la bitácora
`harness/sdd/inicio-billetera-log.md`. Las restricciones de selección de Registro
indicadas más abajo aplican al ejecutar esa feature, no a esta ampliación autorizada.

- `.specify/memory/constitution.md`: principios y controles del proyecto.
- `README.md` y `package.json`: ejecución y comandos vigentes.
- Los documentos de la feature activa en `specs/` y sus contratos.
- Las instrucciones de la skill de spec-kit correspondiente en `.agents/skills/`.

El PDF del taller aporta requisitos y una captura de referencia. Sus comandos de
entrega no autorizan por sí solos un push o un PR: seguir el alcance solicitado por
el usuario. Las decisiones revisadas se registran en los documentos SDD.

## Flujo SDD

La CLI global ya está instalada. La integración local es `codex`, con scripts
PowerShell. Invocar las skills en el chat de Codex, no como comandos de PowerShell:

1. `$speckit-specify`: describir qué necesita el usuario y los criterios de aceptación.
2. `$speckit-clarify`: resolver ambigüedades relevantes y registrar supuestos.
3. Revisar `spec.md` con el usuario antes de planificar, salvo autorización previa.
4. `$speckit-plan`: reutilización, arquitectura, contratos, decisiones y verificación
   de la Constitución. Revisar el plan antes de generar tareas, salvo autorización previa.
5. `$speckit-tasks`: tareas trazables por historia, con pruebas antes de implementación.
6. `$speckit-analyze`: comprobar consistencia entre spec, plan y tareas; resolver
   hallazgos críticos antes de implementar.
7. `$speckit-implement`: ejecutar las tareas siguiendo Rojo -> Verde -> Refactorizar.
8. Ejecutar los controles de calidad y la revisión visual; actualizar tareas y documentos.

Las consignas del usuario están fuera de `specs/`, separadas por etapa en
`harness/sdd/constitution/`, `harness/sdd/specify/`, `harness/sdd/plan/` y
`harness/sdd/tasks/`. Consultar `harness/sdd/README.md` y la consigna de Registro antes
de ejecutar cada paso. La consigna de extracción para Claude está en `harness/sdd/figma/`.

Para Registro, mantener `harness/sdd/registro-usuarios-log.md` en cada paso. Registrar
el prompt utilizado, objetivo, resultado, supuestos, decisiones y respuestas del usuario.
Conservar la distinción entre consignas propuestas y pasos ejecutados. Los resultados
permanecen en `specs/002-registro-usuarios/`; la Constitución común permanece en
`.specify/memory/constitution.md`. Su revisión se registra en `constitution-review.md`
dentro de la feature, sin duplicar el texto normativo.

No marcar tareas, pruebas, revisión humana o verificaciones visuales como completadas
sin evidencia. No presentar la existencia de los documentos como aprobación humana.
La fase de preparación del harness no implica implementar el registro.

## Feature y rama

Conservar la rama de trabajo elegida por el usuario. Para este taller es
`feature/registro-pedro-gandola`; no crear otra rama numerada automáticamente.
Los nombres de rama y de carpeta de spec son independientes.

El login está documentado en `specs/001-login-billetera/` y Registro en
`specs/002-registro-usuarios/`. Actualizar la feature de Registro existente; no crear
otra carpeta numerada para iterar la misma funcionalidad ni sobrescribir la del login.

Al generar la spec, registrar su carpeta en `.specify/feature.json` mediante el flujo
de spec-kit. Ese puntero es local y ya está ignorado por Git. Para selección explícita:

```powershell
$env:SPECIFY_FEATURE_DIRECTORY = 'specs/002-registro-usuarios'
```

No establecer ese valor para otra feature ni ejecutar `setup-plan.ps1` antes de tener
la spec correspondiente: el script crea el plan desde una plantilla.

## Figma y alcance del taller

Referencia: [04 Registro](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2),
nodo `31:2`. El login existente utiliza el nodo `2:2`.

Si Figma está autorizado y conectado, consultar contexto y captura del nodo de registro
antes de fijar layout y tokens. Verificar el acceso real con sus herramientas; una
entrada de configuración no prueba que exista conexión. No registrar tokens en el repo.
Respetar restricciones del administrador. Si no hay acceso, el taller permite usar
la captura del PDF; registrar esa fuente y los detalles visuales aún no verificables.

El alcance funcional que deberá desarrollar la spec incluye:

- Nombre completo, correo, contraseña y confirmación; todos obligatorios.
- Aceptación obligatoria de términos y condiciones antes del envío.
- Correo válido, contraseña de al menos ocho caracteres y confirmación coincidente,
  con mensajes inline.
- Botón "Crear cuenta"; éxito con redirección a `/login` y mensaje de confirmación.
- Enlace para volver a `/login`; Google y Apple muestran alert "Próximamente".
- Dos paneles en escritorio y solo formulario en móvil.

El usuario confirmó demo sin backend, envío simulado y sin guardar contraseñas. El
usuario también informó que Claude Code ya está conectado a Figma; la extracción local
se recibió desde una copia del nodo 31:2 y está en la feature. No asumir que esta sesión
de Codex tiene esa conexión.

## Implementación y verificación

- Reutilizar componentes y tokens existentes antes de introducir dependencias.
- Mantener las capas `domain`, `application`, `infrastructure` y `ui`; dependencias
  hacia el dominio e inyección de los puertos desde la composición.
- Escribir y ejecutar primero una prueba que falle para cada cambio de comportamiento.
  Nombrar pruebas con IDs de requisitos o escenarios para mantener trazabilidad.
- Respetar TypeScript estricto, accesibilidad WCAG 2.1 AA y los umbrales de cobertura
  existentes del 80 %. Documentar discrepancias entre Figma y accesibilidad.
- Usar cuentas ficticias y configuración local; no registrar datos personales,
  contraseñas, credenciales o secretos. No versionar `.env.local`.
- Ejecutar pruebas enfocadas durante el desarrollo y `npm run verify` antes de entregar
  código para integrar. El harness reutiliza ese comando, sin sustituir sus controles.
- Revisar responsive y teclado en navegador. Las pruebas de jsdom no prueban layout.
- Conservar cambios ajenos; revisar `git diff` antes de terminar. Informar fallos
  preexistentes y bloqueos sin desactivar controles para obtener un resultado verde.

## Comandos de preparación

Desde la raíz del repo en PowerShell, usar el lanzador para Windows:

```powershell
.\scripts\harness.cmd -Task Doctor
.\scripts\harness.cmd -Task Install
.\scripts\harness.cmd -Task Verify
.\scripts\harness.cmd -Task Dev
```

`Doctor` revisa herramientas e integración; `Install` ejecuta `npm ci`; `Verify`
ejecuta `npm run verify`; `Dev` inicia Vite. El lanzador aplica `RemoteSigned` solo al
proceso hijo; no cambia la política del usuario o del equipo ni prevalece sobre GPO.
El script resuelve instalaciones comunes de Windows y, en versiones compatibles de
Node, habilita las CA de confianza del sistema conservando la validación TLS. Restaura
el PATH, la opción de CA y el directorio de trabajo al terminar.
