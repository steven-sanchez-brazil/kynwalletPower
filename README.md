# KynWallet · Inicio de sesión y registro (demo)

Demostración funcional, solo del lado del cliente, de las pantallas de inicio de sesión y registro
de la billetera virtual KynWallet. Reproduce el diseño de Figma
([01 · Login](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=2-2)
y `04 · Registro`), valida los campos y simula la autenticación y el alta contra cuentas
ficticias en memoria, sin backend ni base de datos.

Especificación, plan y tareas: [`specs/001-login-billetera/`](specs/001-login-billetera/) y
[`specs/002-registro-usuarios/`](specs/002-registro-usuarios/).

## Rutas

| Ruta        | Vista                                                          |
| ----------- | -------------------------------------------------------------- |
| `/`         | Inicio de sesión (alias de `/login`)                           |
| `/login`    | Inicio de sesión, con el aviso de registro exitoso si procede  |
| `/registro` | Crear una cuenta de demostración                               |
| Otras       | Vista de "Página no encontrada" con enlace al inicio de sesión |

La navegación entre rutas no recarga la página. Un alojamiento estático necesita reescribir
`/login` y `/registro` a `index.html`; el servidor de Vite (`npm run dev`) y `npm run preview` ya
lo hacen.

## Requisitos

- Node.js `^20.19.0 || >=22.12.0` (requisito de Vite 8) y npm 10 o superior.

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
- Si la variable falta o es inválida, el login y el registro muestran un aviso de servicio no
  disponible.
- Las cuentas creadas en `/registro` solo viven en memoria y comparten la colección con el login:
  sirven para iniciar sesión hasta que se recarga la página. No se escribe en `.env.local`, en
  `localStorage` ni en `sessionStorage`.
- Si `npm` falla con `SELF_SIGNED_CERT_IN_CHAIN` detrás de un proxy corporativo, usa
  `NODE_OPTIONS=--use-system-ca` en lugar de desactivar la verificación de certificados.

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
├── domain/          # Tipos, reglas de validación (login y registro) y textos. Sin React.
├── application/     # Casos de uso `authenticate` y `registerAccount`; puertos `AuthGateway` y `RegistrationGateway`
├── infrastructure/  # `InMemoryAuthGateway` (colección compartida, simulación de 1 s), `loadDemoAccounts` y `consoleDiagnostics`
├── ui/
│   ├── styles/      # Tokens de Figma (`tokens.css`) y estilos globales
│   ├── components/  # Button, TextField, PasswordField, Checkbox, SocialButton, Divider, Alert, TextLink
│   ├── layout/      # AuthScreen, BrandPanel y hooks de ruta (foco y título)
│   └── features/    # login, registration y notFound
├── App.tsx          # Rutas
└── main.tsx         # Raíz de composición: una única instancia del gateway se inyecta en ambos casos de uso
```

Las pruebas viven junto al código (`*.test.ts(x)`). Cada caso se nombra con el escenario o
requisito que verifica (por ejemplo, `US2-1`, `FR-012`); las pruebas del registro llevan el
prefijo `REG` porque sus identificadores coinciden con los del login.

## Notas de diseño

- **Contraste:** varios colores de Figma no alcanzan
  WCAG 2.1 AA (botón 2.83:1, enlaces 3.56:1, textos secundarios 3.28:1, bordes 1.40:1). Se
  usan variantes más oscuras del mismo tono (`--brand-700`, `--neutral-600`, `--neutral-border`
  en `src/ui/styles/tokens.css`), aprobadas con el diseño. Detalle en
  `specs/001-login-billetera/research.md` (R3).
- **Panel de marca:** el diseño original usa texto blanco sobre el degradado, que no alcanza AA
  (2.70:1 el titular y 2.40:1 el apoyo; mínimos 3:1 y 4.5:1). Se mantiene el diseño y el
  incumplimiento es una excepción temporal (Constitución 9.1), aprobada el 2026-10-19 y con
  vencimiento el 2027-01-19. Detalle y alternativas en `specs/002-registro-usuarios/research.md`
  (R10).
- Los iconos de Google, Apple y del control de visibilidad son los marcadores de posición del
  diseño de Figma.
- Fuera de alcance: recuperar contraseña, acceso con Google/Apple (muestran "Próximamente" en el
  registro), cuentas persistentes, verificación por correo, persistencia de "Recordarme" y
  bloqueo por intentos fallidos. Los elementos del login fuera de alcance muestran un aviso.
