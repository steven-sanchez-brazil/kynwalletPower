# Investigación y decisiones: Registro de usuarios

**Fecha**: 2026-10-16 | **Feature**: `002-registro-usuarios`

## R1 — Fuente de negocio y secuencia SDD

**Decisión**: derivar la nueva funcionalidad de `taller-registro-kynwallet-v2.pdf`, conservar
la Constitución y seguir las plantillas locales en este orden: especificación, plan, tareas,
pruebas en rojo, implementación, verificación.

**Razón**: el taller exige aplicar SDD sobre el proyecto existente. La feature 001 describe
login y había excluido registro; el requerimiento actual amplía ese alcance. No se modifica
la especificación histórica para aparentar que el registro formaba parte del trabajo anterior.
No se encontraron documentos BRD/ARD separados.

## R2 — Referencia visual y evidencia de acceso a Figma

**Fuente**: [frame 04 Registro, nodo 31:2](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2&t=UqXziRdbvr7Ri2f6-4).

El plugin Figma se instaló durante esta sesión. Se leyó su habilidad de diseño a código y
se intentaron las herramientas `get_design_context` y `get_screenshot` para el nodo `31:2`.
Ambas rechazaron la operación por falta de permisos de edición sobre el archivo. El mensaje
indicó que el propietario puede compartir el archivo otorgando acceso de editor.

Identificadores de las llamadas rechazadas: `aea05f23-4d28-4d9c-b6b6-4ab7b26fcb25` y
`f926d87b-5fb1-4744-a602-8e8c732e33cf`.

Después de confirmarse la conexión del plugin, se repitió `get_design_context` para el mismo
frame. El servicio volvió a rechazar la lectura por falta de permisos de edición
(`7dfd9e1f-e8ac-43b4-847c-852494c20db1`); conectar Figma no concedió acceso adicional al archivo.

**Decisión**: emplear la captura de la página 1 del taller, alternativa expresamente permitida
por el tip de la página 4 del PDF. La instrucción del usuario basada en el taller autoriza este fallback.
No se atribuyen mediciones, tokens, assets o fidelidad exacta a un acceso MCP que fue rechazado.

**Textos observables de referencia**:

- Panel: “Comienza tu camino financiero.”
- Descripción: “Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero
  desde cualquier lugar.”
- Formulario: “Crea tu cuenta” y “Completa tus datos para comenzar”.

Se reutiliza la identidad visual disponible de login. Cualquier detalle que no pueda
confirmarse en la captura se resuelve con los componentes y tokens existentes.

## R3 — Validación única y compatible con login

**Decisión**: mantener las reglas de correo y longitud de contraseña existentes como fuente
única, y extender dominio con las reglas específicas de nombre, confirmación y términos.

- Nombre: trim, requerido, máximo 80 caracteres por compatibilidad con `displayName`.
- Correo: trim + minúsculas, patrón y máximo 254 existentes.
- Contraseña: 8–128 caracteres, conservando espacios y mayúsculas.
- Confirmación: requerida e idéntica a contraseña; no se envía al adaptador.
- Términos: exactamente aceptados antes de crear; no se agrega consentimiento persistente
  que la demo no puede auditar de manera adecuada.

**Alternativas descartadas**: repetir expresiones regulares en React; añadir reglas de
complejidad no solicitadas; exigir dos apellidos; añadir una librería de formularios.

## R4 — Alta y autenticación en una instancia en memoria

**Decisión**: ampliar `InMemoryAuthGateway` para implementar `RegistrationGateway` junto al
puerto `AuthGateway`. La raíz de composición comparte esa misma instancia entre
`createAuthenticate` y `createRegisterAccount`.

**Razón**: un registro exitoso debe poder probarse con el login existente. Un adaptador
independiente sin repositorio común perdería la cuenta para autenticación; crear otra capa
solo para conectar dos arrays agregaría complejidad innecesaria.

El caso de uso recibe todos los campos, valida, normaliza nombre/correo y envía al puerto
solo los datos de la cuenta. El adaptador rechaza correos duplicados de manera normalizada.
La confirmación y la aceptación no se conservan.

Si las cuentas configuradas son `null`, el login mantiene inicialmente su resultado
`unavailable`; registrar una cuenta válida habilita esa cuenta en la misma instancia. El
registro no depende de que exista `VITE_DEMO_USERS`.

**Límite**: solo datos ficticios, en memoria volátil. Recargar, cerrar la pestaña o abrir otra
instancia no conserva el alta. Las contraseñas demo no se guardan en almacenamiento del
navegador, logs ni archivos. La solución no es un sistema de identidad de producción.

## R5 — Navegación y confirmación

**Decisión**: resolver `/`, `/login` y `/register` con la API de historial del navegador y
enlaces reales, sin nueva dependencia. `/` conserva login. El éxito cambia a `/login` y lleva
un mensaje de confirmación en el estado de la UI.

**Razón**: hay solo dos pantallas; no se necesita un router externo. El estado transitorio
evita datos personales o contraseñas en URL o almacenamiento persistente. Atrás/Adelante deben
seguir funcionando y la confirmación no se presenta como una sesión autenticada.

## R6 — Reutilización y accesibilidad

**Decisión**: reutilizar `TextField`, `PasswordField`, `Checkbox`, `Button`, `SocialButton`,
`Divider`, `Alert` y `BrandPanel`, ampliando sus contratos solo si registro lo necesita.
`BrandPanel` recibe una variante de registro con textos y gradiente accesible.

La Constitución exige WCAG 2.1 AA. Se conservan tokens accesibles existentes y se revisa el
contraste del texto sobre el panel. Las diferencias respecto de la captura se documentan;
la revisión del responsable de diseño sigue siendo necesaria antes de integrar según 8.6.

**Verificación**: axe en formulario inicial y con errores, teclado, foco visible,
anuncio del mensaje de éxito y revisión visual a 1440, 960, 375 y 320 px. Los resultados reales
están en `tasks.md` y en R9.

## R7 — Controles, cobertura y evidencias

La línea base informada por la ejecución inicial del coordinador es de **111 pruebas en
15 archivos**; cobertura **Statements 98.88 %, Branches 97.58 %, Functions 100 %, Lines 100 %**.
Esta medición antecede al registro y sirve para evaluar la regla de no disminuir cobertura
global. No es un resultado del código nuevo.

**Decisión**: usar los controles existentes (`npm run verify`) y registrar por separado las
fases roja y verde, regresión, cobertura, construcción, seguridad y revisión visual. Un
control no ejecutado, fallido o bloqueado no se marca como aprobado.

## R8 — Formato del checkout Windows

La primera ejecución completa de `verify` se detuvo en Prettier: reportó 46 archivos previos
por finales de línea CRLF en un checkout con `core.autocrlf=true`. Se añadió únicamente
`endOfLine: "auto"` a `.prettierrc.json`, manteniendo las convenciones existentes y evitando
reescrituras masivas de archivos que no forman parte del registro. Tras el ajuste,
`npm run format` pasó. La repetición completa de `verify` terminó con código 0: lint, formato,
tipos, 196 pruebas/20 suites, cobertura, build, dependencias, licencias y secretos aprobados.
La cobertura global final (99.37 %/98.51 %/100 %/100 %) supera o conserva la línea base.

## R9 — Evidencia de navegador

El coordinador ejecutó la aplicación en Edge real con Playwright y revisó capturas de
1440, 960, 375 y 320 px. No encontró desbordamiento horizontal ni recortes. El panel de marca
se ve desde 960 px y se oculta en móvil; la fuente Inter y las cinco imágenes locales cargan
correctamente.

El flujo de registro → confirmación en `/login` con foco en el encabezado → login → bienvenida
→ cierre de sesión funcionó. También funcionaron Atrás/Adelante y ambos diálogos sociales
con el texto exacto. La instrumentación observó cero escrituras en almacenamiento y cero
errores del navegador. Axe con reglas WCAG 2 A/AA y 2.1 AA no detectó infracciones en la vista
móvil con errores.

Las capturas de QA de esta ejecución están en `C:/Codex/DEC/SDD2/tmp/registration-qa/`:
`register-1440.png`, `register-960.png`, `register-375.png`, `register-320.png`,
`register-320-errors.png` y `login-success.png`. Son artefactos locales de la ejecución; no
implican publicación de una rama o pull request.

La revisión de teclado en Edge confirmó once paradas en el orden esperado (cuatro campos,
dos controles de visibilidad, términos, crear cuenta, Google, Apple y enlace al login),
foco en el primer campo inválido y foco en el encabezado tras registro exitoso.

El texto funcional del panel usa blanco sobre los tokens accesibles `brand-700` y
`brand-800`. La tarjeta es una ilustración decorativa con `aria-hidden`; la comprobación
axe no certifica el contraste de sus textos decorativos y no se presenta como tal.
La revisión del responsable de diseño permanece pendiente antes de integrar.
