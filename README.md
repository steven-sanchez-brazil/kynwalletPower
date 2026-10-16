# KynWallet · Inicio de sesión y Registro (demo)

Demostración funcional, solo del lado del cliente, de las pantallas de inicio de sesión (`/login`)
y registro de usuarios (`/register`) de la billetera virtual KynWallet. Reproduce los diseños de Figma
([01 · Login](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=2-2) y
[04 · Registro](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual--Prototipos?node-id=31-2)),
valida los campos en línea y simula la autenticación y el alta de cuentas en memoria durante la
sesión activa del navegador, sin backend ni base de datos.

Especificaciones, planes y tareas:

- Inicio de sesión: [`specs/001-login-billetera/`](specs/001-login-billetera/)
- Registro de usuarios: [`specs/002-registro-usuarios/`](specs/002-registro-usuarios/)

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

## Rutas y flujos disponibles

- **`/login` (por defecto en `/`):** Pantalla de inicio de sesión. Permite autenticarse con las
  cuentas de demostración o con cualquier cuenta creada durante la sesión activa en `/register`.
  El enlace `"Regístrate"` navega a `/register`.
- **`/register`:** Pantalla de registro de usuarios con validación inline de nombre completo,
  correo electrónico, contraseña (mínimo 8 caracteres), confirmación de contraseña y aceptación
  obligatoria de términos y condiciones. Al crear una cuenta muestra un mensaje de éxito durante
  ~1.5 s y redirige automáticamente a `/login`. El enlace `"Inicia sesión"` navega a `/login` y
  los botones de `"Google"` y `"Apple"` muestran el aviso `"Próximamente"`.

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
├── application/     # Casos de uso `authenticate`, `registerAccount` y puerto `AuthGateway`
├── infrastructure/  # `InMemoryAuthGateway` (simulación, 1 s) y `loadDemoAccounts`
├── ui/
│   ├── styles/      # Tokens de Figma (`tokens.css`) y estilos globales
│   ├── components/  # Button, TextField, PasswordField, Checkbox, SocialButton, Divider, Alert
│   ├── layout/      # BrandPanel (incluye tarjeta ilustrativa KynCard)
│   └── features/
│       ├── login/     # LoginScreen, LoginForm, WelcomeView, reducer y hook
│       └── register/  # RegisterForm, registerReducer y useRegisterForm
├── App.tsx          # Enrutamiento ligero (/login ↔ /register) con History API
└── main.tsx         # Raíz de composición (inyección de dependencias)
```

Las pruebas viven junto al código (`*.test.ts(x)`). Cada caso se nombra con el escenario o
requisito que verifica (por ejemplo, `US2-1`, `FR-012`) para mantener la trazabilidad.

## Notas de diseño

- **Contraste (pendiente de aprobación de diseño):** varios colores de Figma no alcanzan
  WCAG 2.1 AA (botón 2.83:1, enlaces 3.56:1, textos secundarios 3.28:1, bordes 1.40:1). Se
  usan variantes más oscuras del mismo tono (`--brand-700`, `--neutral-600`, `--neutral-border`
  en `src/ui/styles/tokens.css`). Detalle en `specs/001-login-billetera/research.md` (R3) y
  `specs/002-registro-usuarios/research.md` (R6).
- Los iconos de Google, Apple y del control de visibilidad son los marcadores de posición del
  diseño de Figma.
- Fuera de alcance: recuperar contraseña, acceso OAuth real con Google/Apple, persistencia de
  "Recordarme" y bloqueo por intentos fallidos. Al activarlos se muestra un aviso informativo.
