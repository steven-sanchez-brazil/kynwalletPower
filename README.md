# KynWallet · Inicio de sesión y registro (demo)

Demostración funcional, solo del lado del cliente, del inicio de sesión y registro de la
billetera virtual KynWallet. Valida los formularios y permite crear una cuenta ficticia e
iniciar sesión con ella durante la vida de la página, sin backend ni base de datos.

Documentación SDD, con especificación → plan → tareas → pruebas → implementación:

- Login: [`specs/001-login-billetera/`](specs/001-login-billetera/).
- Registro: [`specs/002-registro-usuarios/`](specs/002-registro-usuarios/), basado en
  `taller-registro-kynwallet-v2.pdf` y desarrollado en `feature/registro-henry-ilizarbe`.

## Requisitos

- Node.js 20 LTS o superior y npm 10 o superior.

## Configuración

```bash
npm install
npm run dev
```

Abrir [registro](http://localhost:5173/register) para crear una cuenta ficticia; no requiere
configuración previa. `/` y `/login` presentan el inicio de sesión.

Para cargar cuentas ficticias iniciales, copiar `.env.example` a `.env.local` con
`Copy-Item .env.example .env.local` en PowerShell y definir `VITE_DEMO_USERS`:

```dotenv
VITE_DEMO_USERS=[{"email":"tu.correo@example.com","password":"minimo-8-caracteres","displayName":"Tu Nombre"}]
```

- `password`: de 8 a 128 caracteres. `displayName`: de 1 a 80 caracteres. Los correos no se pueden repetir.
- `.env.local` no se versiona: la Constitución del proyecto (regla 5.3) prohíbe credenciales en el
  código fuente o en archivos versionados.
- ⚠️ Al ser una aplicación solo-cliente, el valor de `VITE_DEMO_USERS` queda incluido en el bundle
  compilado. Usa únicamente cuentas ficticias.
- Si la variable falta o es inválida, login muestra “Servicio de acceso no disponible” hasta
  que se cree una cuenta en esta instancia mediante registro.

## Probar el registro

1. Desde login, activar “Regístrate” o abrir `/register`.
2. Completar nombre, correo, contraseña y confirmación; aceptar términos y condiciones.
3. Pulsar “Crear cuenta”. Los datos inválidos muestran errores antes de enviar; la contraseña
   debe tener 8–128 caracteres y coincidir exactamente con la confirmación.
4. Tras el éxito, comprobar `/login` y el mensaje de cuenta creada. Iniciar sesión con esos
   datos para ver la bienvenida; un correo ya usado se rechaza sin sobrescribir su cuenta.

Google y Apple en registro muestran `Próximamente`. “Inicia sesión” vuelve a `/login`.
En escritorio hay un panel de marca junto al formulario; en móvil solo se muestra el
formulario. Se puede completar con teclado y sus errores se asocian con los campos.

Las cuentas nuevas viven únicamente en memoria: recargar o cerrar la página las elimina.
Usar datos ficticios; no se implementan identidad real, verificación de correo ni
persistencia. Confirmación de contraseña y aceptación de términos se usan para validar y
no se guardan en la cuenta. La guía completa está en
[`quickstart.md`](specs/002-registro-usuarios/quickstart.md).

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

## Arquitectura

Clean Architecture ligera. Las dependencias apuntan hacia el dominio y ESLint lo verifica:

```text
src/
├── domain/          # Tipos, reglas de validación y textos. Sin React.
├── application/     # `authenticate`, `registerAccount` y puertos específicos
├── infrastructure/  # `InMemoryAuthGateway` compartido por login/registro y `loadDemoAccounts`
├── ui/
│   ├── styles/      # Tokens de Figma (`tokens.css`) y estilos globales
│   ├── components/  # Button, TextField, PasswordField, Checkbox, SocialButton, Divider, Alert
│   ├── layout/      # BrandPanel
│   └── features/
│       ├── login/   # LoginScreen, LoginForm, WelcomeView, reducer y hook
│       └── register/ # RegisterScreen, RegisterForm y hook
├── App.tsx
└── main.tsx         # Raíz de composición (inyección de dependencias)
```

Las pruebas viven junto al código (`*.test.ts(x)`). Cada caso se nombra con el escenario o
requisito que verifica (por ejemplo, `US2-1`, `FR-012`, `REG-FR-009`) para mantener la
trazabilidad. La matriz y los resultados reales del registro se documentan en
[`spec.md`](specs/002-registro-usuarios/spec.md) y
[`tasks.md`](specs/002-registro-usuarios/tasks.md).

## Notas de diseño

- **Contraste (pendiente de aprobación de diseño):** varios colores de Figma no alcanzan
  WCAG 2.1 AA (botón 2.83:1, enlaces 3.56:1, textos secundarios 3.28:1, bordes 1.40:1). Se
  usan variantes más oscuras del mismo tono (`--brand-700`, `--neutral-600`, `--neutral-border`
  en `src/ui/styles/tokens.css`). Detalle en `specs/001-login-billetera/research.md` (R3).
- Los iconos de Google, Apple y del control de visibilidad son los marcadores de posición del
  diseño de Figma.
- El registro sigue el frame
  [04 Registro](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2&t=UqXziRdbvr7Ri2f6-4).
  Figma MCP rechazó la lectura de contexto y captura por falta de permisos de edición; se usó
  la captura de la página 1 del taller, alternativa permitida por el tip de la página 4. El panel conserva
  variantes accesibles de color; no se afirma una extracción exacta del frame.
- Fuera de alcance: recuperar contraseña, acceso real con Google/Apple, persistencia de
  “Recordarme” y bloqueo por intentos fallidos. Los controles de recuperación y proveedores
  del login conservan el aviso de función no disponible de la demo.
