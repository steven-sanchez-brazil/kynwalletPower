# Quickstart: validar el registro de usuarios

## Requisitos

Node.js ≥ 20 y `.env.local` con `VITE_DEMO_USERS` (ver [README](../../README.md)).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # pruebas automatizadas
npm run verify     # todos los controles de la Constitución
```

## Escenarios manuales

| # | Pasos | Resultado esperado |
|---|---|---|
| 1 | Abrir `http://localhost:5173/` | Redirige a `/login` |
| 2 | En `/login`, pulsar "Regístrate" | Se abre `/registro` sin recargar |
| 3 | Pulsar "Crear cuenta" con todo vacío | Cinco mensajes de error; foco en "Nombre completo" |
| 4 | Correo `usuario@`, contraseña `1234`, confirmación `12345` | "Ingresa un correo electrónico válido", "La contraseña debe tener al menos 8 caracteres", "Las contraseñas no coinciden" |
| 5 | Registrar el correo de una cuenta de `VITE_DEMO_USERS` | "Ya existe una cuenta con este correo" |
| 6 | Pulsar Google, Apple o "términos y condiciones" | Alerta "Próximamente"; los datos se conservan |
| 7 | Registrar `nueva@example.com` / `clave-segura` con términos aceptados | Indicador "Creando cuenta…", luego `/login` con "¡Cuenta creada con éxito! Ya puedes iniciar sesión." |
| 8 | Iniciar sesión con `nueva@example.com` / `clave-segura` | "¡Bienvenido, {nombre registrado}!" |
| 9 | Botón atrás del navegador | Vuelve a la pantalla anterior |
| 10 | Ventana de 375 px | Solo el formulario (con barra de logo), sin scroll horizontal |
| 11 | Ventana de 1440 px | Dos paneles: marca "Comienza tu camino financiero." y formulario |

Contratos: [ui-register.md](./contracts/ui-register.md),
[registration-gateway.md](./contracts/registration-gateway.md). Modelo:
[data-model.md](./data-model.md).

## Despliegue

Al ser una SPA con rutas reales, el servidor estático debe responder `index.html` para `/login`
y `/registro` (fallback SPA). `npm run dev` y `npm run preview` ya lo hacen.
