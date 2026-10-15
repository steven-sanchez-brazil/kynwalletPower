# KynWallet · Inicio de sesión y registro (demo)

Demostración funcional, solo del lado del cliente, de la pantalla de inicio de sesión de la
billetera virtual KynWallet. Reproduce el diseño de Figma
([01 · Login](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=2-2)),
valida los campos y simula la autenticación contra cuentas ficticias, sin backend ni base de datos.

Incluye también la pantalla de registro
([04 · Registro](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2)):
valida nombre, correo, contraseña, confirmación y términos, y simula la creación de la cuenta.

Especificación, plan y tareas:

- Login: [`specs/001-login-billetera/`](specs/001-login-billetera/)
- Registro: [`specs/002-registro-billetera/`](specs/002-registro-billetera/)

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

## Ejecutar las pantallas

Una sola aplicación con React Router. "Regístrate" y "Inicia sesión" navegan entre las pantallas
sin recargar la página.

| Pantalla | URL                                 |
| -------- | ----------------------------------- |
| Login    | <http://localhost:5173/login>       |
| Registro | <http://localhost:5173/registro>    |
| Otras    | `/` y rutas desconocidas → `/login` |

El registro usa las mismas cuentas de `VITE_DEMO_USERS` solo para detectar correos ya existentes:
registrar el correo de una cuenta de demostración muestra el error "No fue posible crear la
cuenta…"; cualquier otro correo válido redirige a `/login`, donde aparece arriba a la derecha un
aviso emergente "¡Cuenta creada con éxito!" que se oculta a los 5 s (se pausa con el puntero o el
foco y se puede cerrar). La cuenta no se guarda: no permite iniciar sesión.

Los saltos de línea del repositorio son LF en todos los sistemas (`.gitattributes`); en Windows
no hace falta cambiar `core.autocrlf`.

**Despliegue**: `npm run dev` y `npm run preview` ya sirven `index.html` para cualquier ruta. En
otro servidor estático, configura el respaldo de SPA (todas las rutas → `index.html`) para que
`/login` y `/registro` funcionen al recargar.

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
├── application/     # Casos de uso `authenticate` y `register` y sus puertos
├── infrastructure/  # `InMemoryAuthGateway`, `InMemoryRegistrationGateway` (1 s) y `loadDemoAccounts`
├── ui/
│   ├── styles/      # Tokens de Figma (`tokens.css`) y estilos globales
│   ├── components/  # Button, TextField, PasswordField, Checkbox, SocialButton, Divider, Alert, TextLink
│   ├── layout/      # AuthLayout (dos paneles, compartido) y BrandPanel
│   ├── features/login/     # LoginForm, WelcomeView, reducer y hook
│   ├── features/register/  # RegisterForm, reducer y hook
│   ├── pages/       # LoginPage y RegisterPage: título, navegación y mensaje de registro
│   └── routes.ts    # Rutas `/login` y `/registro`
├── App.tsx          # Definición de rutas (React Router)
└── main.tsx         # Raíz de composición (inyección de dependencias) y BrowserRouter
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
- Fuera de alcance: recuperar contraseña, acceso y registro con Google/Apple, términos y
  condiciones, persistencia de "Recordarme" y bloqueo por intentos fallidos. Al activarlos se
  muestra un aviso dentro de la página ("Próximamente" para Google/Apple en el registro).
- En móvil se mantiene la franja con el logo sobre el formulario (decisión registrada en
  `specs/002-registro-billetera/spec.md`, Clarifications 2026-10-15 (b)).
