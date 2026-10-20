# KynWallet · Acceso y registro (demo)

Demostración funcional, solo del lado del cliente, de las pantallas de inicio de sesión y registro de la
billetera virtual KynWallet. Reproduce el diseño de Figma
([01 · Login](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=2-2)),
valida los campos y simula la autenticación contra cuentas ficticias, sin backend ni base de datos.

Especificación, plan y tareas: [`specs/001-login-billetera/`](specs/001-login-billetera/).

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

Desde el login, «Regístrate» abre /register. El formulario exige nombre, correo, contraseña/confirmación y aceptación. Valida inline, conserva datos durante corrección, cancela al salir y vuelve a /login con confirmación. No crea cuentas ni habilita credenciales; la autenticación de las cuentas ficticias existentes permanece igual antes/después (002/FR-011, AC-105).

En registro, Google y Apple muestran «Próximamente». El enlace Inicia sesión vuelve sin éxito. Las rutas /login y /register requieren fallback SPA a index.html en el alojamiento; Vite dev/preview lo ofrecen para validación local. Registro móvil solo muestra formulario; desde 1024 px muestra marca y formulario.

Especificación y trazabilidad: [registro](specs/002-registro-usuarios/spec.md), [tareas](specs/002-registro-usuarios/tasks.md) y [evidencia](specs/002-registro-usuarios/validation.md). El registro de demostración no requiere configurar cuentas.

### Contraste del panel compartido

La revisión real de registro de 2026-10-20 detectó contraste insuficiente sobre el gradiente original: texto de apoyo blanco al 85 % daba ratios 2.05:1–2.95:1. Se reutilizan --brand-700/800 para el gradiente y blanco opaco en el texto de apoyo, en login y registro para conservar coherencia y cumplir AA. El pendiente de aprobación de diseño mencionado arriba incluye este ajuste; no se afirma una aprobación no recibida. Evidencia y revisión en specs/002-registro-usuarios/validation.md.
