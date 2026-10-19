# KynWallet · Inicio de sesión, Registro y Dashboard Home (demo)

Demostración funcional, solo del lado del cliente, de las pantallas de **inicio de sesión**, **registro de usuarios** y **Dashboard Home financiero** de la billetera virtual KynWallet. Reproduce los diseños de Figma:

- [01 · Login](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=2-2)
- [02 · Registro](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2)
- [03 · Home / Dashboard (`13:2`)](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2)

Valida los campos en línea, permite registrar cuentas nuevas en `localStorage` del navegador (protegiendo la contraseña mediante hash `SHA-256`), simula la autenticación y habilita el panel de control financiero tras iniciar sesión, sin backend ni base de datos.

Especificaciones, planes y tareas:

- [`specs/001-login-billetera/`](specs/001-login-billetera/)
- [`specs/002-registro-billetera/`](specs/002-registro-billetera/)
- [`specs/003-home-billetera/`](specs/003-home-billetera/)

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
- `.env.local` no se versiona: la Constitución del proyecto (regla 5.3) prohíbe credenciales en el código fuente o en archivos versionados.
- ⚠️ Al ser una aplicación solo-cliente, el valor de `VITE_DEMO_USERS` queda incluido en el bundle compilado. Usa únicamente cuentas ficticias.
- Si la variable falta o es inválida y no existen usuarios registrados en `localStorage`, la pantalla de Login muestra `"Servicio de acceso no disponible"`.

## Pantalla de Registro (`002-registro-billetera`)

- **Nombres Completos**: obligatorio (1 a 80 caracteres tras recortar espacios).
- **Correo electrónico**: obligatorio, validación inline con formato estándar (`usuario@dominio.ext`, máx. 254 caracteres) y verificación de correo no duplicado.
- **Contraseña**: obligatoria, validación inline de **seguridad alta** (entre 8 y 128 caracteres, al menos una letra mayúscula, una minúscula, un número y un carácter especial).
- **Confirmar contraseña**: obligatoria, validación inline exigiendo coincidencia exacta con la contraseña y cumplimiento de seguridad alta.
- **Aceptación de términos**: el botón `"Crear Cuenta"` permanece deshabilitado mientras el checkbox esté en `False` y se habilita cuando pasa a `True`.
- **Persistencia en `localStorage` y redirección**: al hacer clic en `"Crear Cuenta"` con todos los campos válidos, se guarda el registro bajo la clave `kynwallet.registeredUsers` en `localStorage` (almacenando únicamente `passwordDigest` SHA-256 en lugar de la contraseña en texto plano, conforme al Principio V de la Constitución) y se redirige a la ventana de **Login**, donde la nueva cuenta puede iniciar sesión inmediatamente.
- **Botones sociales (Google y Apple)**: en la vista de registro muestran una alerta temporal tipo **Toast** con el mensaje `"Próximamente"`.

## Pantalla Home / Dashboard Financiero (`003-home-billetera`)

- **Acceso post-login**: se habilita automáticamente tras iniciar sesión correctamente y muestra el saludo personalizado con el nombre del titular y su tarjeta virtual **Kyn Card**.
- **Resumen financiero y privacidad**: presenta el **Saldo disponible**, **Ingresos del mes**, **Gastos del mes** y una barra dinámica de proporción de flujo positivo, junto con el botón `"Ocultar saldo"` / `"Mostrar saldo"` (`••••••`).
- **Acciones rápidas dinámicas**:
  - **Recargar**: añade fondos e incrementa el saldo disponible y los ingresos del mes en tiempo real.
  - **Enviar** y **Pagar**: validan que el monto sea positivo y no supere el saldo disponible (`"Saldo insuficiente para realizar esta operación"`), descontando el importe y sumándolo a los gastos del mes.
  - **Recibir**: presenta el alias KynWallet del titular y permite copiarlo al portapapeles con confirmación tipo **Toast** (`"Datos copiados al portapapeles"`).
- **Movimientos recientes interactivos**: filtrado instantáneo por categoría (`Todos`, `Ingresos`, `Gastos`) y búsqueda en tiempo real por concepto o categoría (insensible a mayúsculas y tildes).
- **Opciones `Movimientos`, `Tarjetas` y `Mi Perfil`**: envían exclusivamente una alerta tipo **Toast** (`role="status"`) con el mensaje `"Próximamente"`.
- **Notificaciones Toast estilo `react-toastify` (`top-center`)**: todos los mensajes tipo Toast (`"Próximamente"`, `"Operación realizada con éxito"` y `"Datos copiados al portapapeles"`) se muestran flotantes en la **parte superior centrada (`top-center`)** con fondo de color de la paleta actual (`--brand-700` y `--success-700`), botón de cierre y barra de progreso temporal.
- **Diseño único Figma (`13:2`) y comportamiento Responsive sin distorsión**: reproduce el prototipo de Figma `13:2` estructurado en **2 paneles en Desktop (`≥ 960px`: barra lateral + contenido)** y **1 solo panel en Mobile (`< 960px`, desde `320px`: solo formulario/contenido centrado)** sin distorsión al redimensionar la ventana.

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
├── domain/          # Tipos (auth, registration, wallet), reglas de validación y textos. Sin React.
├── application/     # Casos de uso (`authenticate`, `registerUser`) y puertos (`AuthGateway`, `UserRegistrationGateway`)
├── infrastructure/  # `InMemoryAuthGateway`, `LocalStorageUserGateway`, `passwordHash` y `loadDemoAccounts`
├── ui/
│   ├── styles/      # Tokens de Figma (`tokens.css`) y estilos globales
│   ├── components/  # Button, TextField, PasswordField, Checkbox, SocialButton, Divider, Alert, Toast
│   ├── layout/      # BrandPanel
│   └── features/
│       ├── login/     # LoginScreen, LoginForm, WelcomeView, loginReducer y useLoginForm
│       ├── register/  # RegisterForm, registerReducer y useRegisterForm
│       └── home/      # HomeDashboard, homeReducer y useHomeDashboard
├── App.tsx
└── main.tsx         # Raíz de composición (inyección de dependencias)
```

Las pruebas viven junto al código (`*.test.ts(x)`). Cada caso se nombra con el escenario o requisito que verifica (por ejemplo, `US1-3`, `US2-4`, `FR-011`) para mantener la trazabilidad.

## Notas de diseño

- **Contraste (pendiente de aprobación de diseño):** varios colores de Figma no alcanzan WCAG 2.1 AA (botón 2.83:1, enlaces 3.56:1, textos secundarios 3.28:1, bordes 1.40:1). Se usan variantes más oscuras del mismo tono (`--brand-700`, `--neutral-600`, `--neutral-border`, `--success-700` en `src/ui/styles/tokens.css`). Detalle en `specs/001-login-billetera/research.md` (R3), `specs/002-registro-billetera/research.md` (R3) y `specs/003-home-billetera/research.md` (R3).
- Los iconos de Google, Apple y del control de visibilidad son los marcadores de posición del diseño de Figma.
