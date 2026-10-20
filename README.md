# KynWallet · Login y registro (demo)

Demostración funcional, solo del lado del cliente, de la pantalla de inicio de sesión de la
billetera virtual KynWallet. Reproduce el diseño de Figma
([01 · Login](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=2-2)),
valida los campos y simula la autenticación contra cuentas ficticias, sin backend ni base de datos.

Especificación, plan y tareas: [`specs/001-login-billetera/`](specs/001-login-billetera/).

## Requisitos

- Node.js 22.12+ y npm compatible (validado con Node 24.22.0 y npm 11.19.1).

## Configuración

```bash
npm ci
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
├── application/     # Caso de uso `authenticate` y puerto `AuthGateway`
├── infrastructure/  # `InMemoryAuthGateway` (simulación, 1 s) y `loadDemoAccounts`
├── ui/
│   ├── styles/      # Tokens de Figma (`tokens.css`) y estilos globales
│   ├── components/  # Button, TextField, PasswordField, Checkbox, SocialButton, Divider, Alert
│   ├── layout/      # BrandPanel
│   └── features/login/  # LoginScreen, LoginForm, WelcomeView, reducer y hook
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
- Fuera de alcance: recuperar contraseña, acceso real con Google/Apple, persistencia de
  "Recordarme" y bloqueo por intentos fallidos. Al activarlos se muestra un aviso.

## Registro de demostración

Abre <http://localhost:5173/register> o activa **Regístrate** en el login. **Inicia sesión** vuelve a `/login`; `/` sigue mostrando el login. Los cuatro campos y los términos son obligatorios, el correo debe ser válido y ambas contraseñas deben coincidir (8–128 caracteres). Los errores aparecen junto al campo; el nombre admite 1–100 caracteres y el correo hasta 254.

El registro usa una API ficticia local con demora de 500 ms: **no envía peticiones, no crea cuentas y no guarda datos**. Al terminar navega a `/login` con confirmación temporal. Para iniciar sesión se siguen utilizando las cuentas ficticias de `VITE_DEMO_USERS`; las credenciales del registro no habilitan acceso.

Para demostrar un fallo, añade en `.env.local` y reinicia Vite:

```dotenv
VITE_DEMO_REGISTRATION_MODE=unavailable
```

Cámbialo a `success` (valor predeterminado si no se define) para demostrar éxito. Un valor no reconocido produce indisponibilidad controlada. Google y Apple muestran «Próximamente»; términos informa que su documento no está disponible. No uses datos reales ni secretos.

El formulario reutiliza componentes del login, con dominio de validación puro, caso de uso `register`, puerto `RegistrationGateway` y `FakeRegistrationGateway` inyectado en `main.tsx`. El estado es local; navegación mediante History API y éxito solo en memoria. La pantalla muestra dos paneles desde 1024 px y solo el formulario por debajo, desde 320 px.

Diseño: `.prompts/registro/04 · Registro.png` y `styles.css`. Se conservan tipografía y geometría; se adaptan tonos para accesibilidad. Los ajustes y revisiones pendientes se documentan en [`design-review.md`](specs/002-registro-billetera/design-review.md). No se afirma haber accedido al archivo remoto Figma.

Pruebas unitarias, contratos fake e integración con Vitest/Testing Library/axe-core: `npm test` y `npm run test:coverage`. Para una compilación local: `npm run build` y `npm run preview`. En hosting estático configura fallback de `/register` y `/login` a `index.html` para acceso directo y recarga. No se requiere backend ni API externa.

Guía y evidencia: [`quickstart.md`](specs/002-registro-billetera/quickstart.md), [`validation.md`](specs/002-registro-billetera/validation.md) y [`tasks.md`](specs/002-registro-billetera/tasks.md).
