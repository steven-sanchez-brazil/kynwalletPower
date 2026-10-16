# KynWallet · Login, Registro e Inicio (demo)

Demostración funcional, solo del lado del cliente, del acceso, registro e Inicio de la
billetera virtual KynWallet. Reproduce el diseño de Figma
([01 · Login](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=2-2)),
valida los campos y simula la autenticación contra cuentas ficticias, sin backend ni base de datos.

Especificación, plan y tareas: [`specs/001-login-billetera/`](specs/001-login-billetera/).

Registro está documentado en [`specs/002-registro-usuarios/`](specs/002-registro-usuarios/).

Inicio está documentado en [`specs/003-inicio-billetera/`](specs/003-inicio-billetera/).
La [revisión de arquitectura frente al original](specs/003-inicio-billetera/architecture-review.md)
explica cómo Registro e Inicio conservan sus capas, composición y componentes.
Un login válido abre `/inicio` con el nombre de la cuenta configurada y los datos
ficticios de la extracción `figma/vistas-03-04/`: vista 03 en escritorio y 02 en móvil.
Incluye saldo, movimientos, acciones y navegación; escritorio agrega indicadores,
tarjeta enmascarada y resumen. Las acciones sin pantalla diseñada anuncian
«Próximamente», sin modificar dinero. **Cerrar sesión** vuelve al login vacío.
La sesión vive solo en memoria: recargar, navegar por el historial o abandonar la
página requiere volver a entrar. Acceder directamente a `/inicio` sin sesión lleva
a `/login`. El registro sigue sin crear cuentas de acceso.

Abrí `/registro` o el enlace **Regístrate** del login. Incluye nombre, correo, contraseña,
confirmación y aceptación obligatoria. El envío espera un segundo y vuelve a `/login`
con una confirmación efímera. No crea cuentas reales ni incorpora los datos a las cuentas
ficticias del login; no guarda contraseñas. `/` sigue mostrando el login.
Google y Apple en Registro muestran «Próximamente». La acción de términos informa que el
texto legal no está disponible en esta demo. Al abandonar el formulario se descartan
sus datos y las respuestas pendientes. En móvil se muestra solo el formulario.

## Requisitos

- Node.js 20 LTS o superior y npm 10 o superior.

## Configuración

```bash
npm install
cp .env.example .env.local
```

Edita `.env.local` y define al menos una cuenta **ficticia** en `VITE_DEMO_USERS`:

```dotenv
VITE_DEMO_USERS=[{"email":"tu.correo@example.com","password":"minimo-8-caracteres","displayName":"Tu Nombre"}]
```

- `password`: de 8 a 128 caracteres. `displayName`: de 1 a 80 caracteres. Los correos no se pueden repetir.
- `.env.local` no se versiona: la Constitución del proyecto (regla 5.3) prohíbe credenciales en el
  código fuente o en archivos versionados.
- ⚠️ Al ser una aplicación solo-cliente, el valor de `VITE_DEMO_USERS` queda incluido en el bundle
  compilado. Usa únicamente cuentas ficticias.
- Si la variable falta o es inválida, la pantalla muestra "Servicio de acceso no disponible".

Para iniciar sesión, usá una de las cuentas ficticias definidas en tu `.env.local`.
El formulario **Crear cuenta** solo demuestra el envío: los datos que ingreses allí no
se incorporan a `VITE_DEMO_USERS` y no sirven como credenciales del login. Tras modificar
`.env.local`, reiniciá Vite si no detecta el cambio automáticamente.

Un registro válido muestra un spinner junto a **Creando cuenta…** durante al menos
un segundo, con el botón deshabilitado, antes de volver al login. Los errores de
validación se muestran sin iniciar esa espera ni simular éxito.

## Scripts

| Comando                           | Descripción                                                                                                                                           |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Servidor de desarrollo en <http://localhost:5173>                                                                                                     |
| `npm run build`                   | Typecheck y build de producción en `dist/`                                                                                                            |
| `npm run preview`                 | Sirve el build de producción                                                                                                                          |
| `npm test`                        | Ejecuta las pruebas una vez                                                                                                                           |
| `npm run test:watch`              | Pruebas en modo observación                                                                                                                           |
| `npm run test:coverage`           | Pruebas con cobertura (umbral: 80 %)                                                                                                                  |
| `npm run lint` / `npm run format` | ESLint / Prettier                                                                                                                                     |
| `npm run verify`                  | Todos los controles de cumplimiento: lint, formato, tipos, pruebas con cobertura, build, auditoría de dependencias y licencias, y escaneo de secretos |

## Trabajo con Codex y spec-kit

Las instrucciones del agente están en [`AGENTS.md`](AGENTS.md). La integración de
spec-kit usa Codex, skills locales en `.agents/skills/` y scripts PowerShell en
`.specify/scripts/powershell/`. La Constitución existente sigue siendo la base.

Las consignas editables del usuario están separadas por etapa en
[`harness/sdd/`](harness/sdd/README.md): `constitution`, `specify`, `plan` y `tasks`.
La bitácora y la consigna para Claude/Figma también están en el harness. Los resultados
de spec-kit permanecen en `.specify/memory/` y en la carpeta de cada feature de `specs/`.

La estructura nativa se conserva: `constitution.md` en `.specify/memory/`, y `spec.md`,
`plan.md` y `tasks.md` juntos en `specs/002-registro-usuarios/`. `harness/sdd/` es una
organización manual para consignas y bitácora, no una carpeta generada por spec-kit.
SDD no exige que cada etapa tenga un archivo o carpeta en la raíz del repositorio.

El harness prepara el entorno de Windows y reutiliza los controles del proyecto:

```powershell
.\scripts\harness.cmd -Task Doctor
.\scripts\harness.cmd -Task Install
.\scripts\harness.cmd -Task Verify
.\scripts\harness.cmd -Task Dev
```

- `Doctor`: comprueba Node, npm, Git y la integración de spec-kit.
- `Install`: instala las versiones del lockfile mediante `npm ci`.
- `Verify`: ejecuta todos los controles de `npm run verify` y falla si alguno falla.
- `Dev`: inicia el servidor de desarrollo.

El lanzador usa `RemoteSigned` únicamente para su proceso PowerShell, respetando las
políticas administradas. Resuelve instalaciones comunes sin modificar el PATH global.
Con Node 22.19+ de la rama 22 o Node 24.6+, activa el almacén de certificados del sistema
para conexiones corporativas; conserva una configuración explícita del usuario y
mantiene la validación TLS. Entorno de preparación: Node 24.20.0 y npm 11.19.0.
El uso del almacén del sistema está descrito en la
[documentación de Node para redes corporativas](https://nodejs.org/learn/http/enterprise-network-configuration#adding-ca-certificates-from-the-system-store).

`.gitattributes` fija LF para los archivos de texto y CRLF para los lanzadores `.cmd`,
para mantener el formato en futuros checkouts de Windows. La normalización inicial
conservó el contenido de la Constitución, las plantillas y el código del login.
Si spec-kit informa diferencias de hash, revisarlas antes de actualizar o sobrescribir
archivos administrados.

El flujo SDD se invoca **en el chat de Codex**, leyendo la skill de cada paso:

```text
$speckit-specify <descripción de la funcionalidad>
$speckit-clarify
$speckit-plan
$speckit-tasks
$speckit-analyze
$speckit-implement
```

Revisar la spec antes del plan y el plan antes de las tareas. Implementar con TDD
después de resolver los hallazgos críticos del análisis. La instalación de spec-kit
no sustituye esas revisiones. Si las skills no aparecen en una sesión que ya estaba
abierta, iniciar una sesión nueva en esta carpeta.

La feature Registro de Usuarios está separada de `001-login-billetera`, en la
rama `feature/registro-pedro-gandola`. El diseño corresponde a
[04 Registro, nodo 31:2](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2).
Figma requiere conexión y autenticación propias; `Doctor` no las verifica. El usuario
informó que Claude Code ya está conectado. La
[consigna de extracción](harness/sdd/figma/registro-usuarios.md) guarda los resultados
en `specs/002-registro-usuarios/design/`. La extracción recibida proviene de una copia
del archivo; el origen y sus límites se documentan allí. La ejecución completa fue
autorizada por el usuario; su revisión y aprobación final siguen pendientes.

## Arquitectura

Clean Architecture ligera. Las dependencias apuntan hacia el dominio y ESLint lo verifica:

```text
src/
├── domain/          # Tipos, reglas de validación y textos. Sin React.
├── application/     # `authenticate`, `register` y sus puertos
├── infrastructure/  # Gateways de autenticación/registro simulado y `loadDemoAccounts`
├── ui/
│   ├── styles/      # Tokens de Figma (`tokens.css`) y estilos globales
│   ├── components/  # Button, TextField, PasswordField, Checkbox, SocialButton, Divider, Alert
│   ├── layout/      # BrandPanel
│   ├── features/     # Login, Registro, reducers y hooks
│   └── navigation/  # Rutas locales y descarte de resultados obsoletos
├── App.tsx
└── main.tsx         # Raíz de composición (inyección de dependencias)
```

Las pruebas viven junto al código (`*.test.ts(x)`). Cada caso se nombra con el escenario o
requisito que verifica (por ejemplo, `US2-1`, `FR-012`) para mantener la trazabilidad.

## Notas de diseño

- **Contraste (pendiente de aprobación de diseño):** varios colores de Figma no alcanzan
  WCAG 2.1 AA (botón 2.83:1, enlaces 3.56:1, textos secundarios 3.28:1, bordes 1.40:1). Se
  usan variantes más oscuras del mismo tono (`--brand-700`, `--neutral-600`, `--neutral-border`
  en `src/ui/styles/tokens.css`). Detalle en `specs/001-login-billetera/research.md` (R3).
- Los iconos de Google, Apple y del control de visibilidad son los marcadores de posición del
  diseño de Figma.
- Registro conserva el gradiente de Figma con texto oscuro en el panel para alcanzar AA.
  Reutiliza los tokens accesibles del login para botones, enlaces, bordes y errores.
  La referencia no incluye móvil ni estados de error; decisiones en
  [`research.md`](specs/002-registro-usuarios/research.md).
- Fuera de alcance: recuperar contraseña, registro real, acceso con Google/Apple, persistencia de
  "Recordarme" y bloqueo por intentos fallidos. Al activarlos se muestra un aviso.
