# Quickstart: validar el registro

Guía de ejecución y validación. Las herramientas y scripts son los de
[001](../001-login-billetera/quickstart.md); aquí solo lo específico del registro.

## Requisitos

- Node.js ≥ 20 y dependencias instaladas (`npm install`).
- `.env.local` con `VITE_DEMO_USERS` definido a partir de `.env.example` (cuentas ficticias).
  Formato y advertencias en [contracts/registration-gateway.md](./contracts/registration-gateway.md).

## Ejecutar

```bash
npm run dev
```

Abrir la URL que indica Vite (por defecto `http://localhost:5173`).

## Escenarios de validación manual

| # | Pasos | Resultado esperado |
|---|---|---|
| 1 | Abrir `/` y luego, desde el login, activar "Regístrate" | `/` redirige a `/login`; "Regístrate" abre `/registro` (UI-9) |
| 2 | Completar nombre, un correo que no esté en `VITE_DEMO_USERS`, contraseña de 8+ caracteres, la misma en la confirmación, marcar términos y presionar "Crear cuenta" | Botón en carga ~1 s y luego redirige a `/login` (US1-1, US1-2) |
| 3 | Tras el paso 2 | Redirige a `/login` y muestra "¡Cuenta creada, {nombre}! Ahora puedes iniciar sesión."; al escribir en el login el mensaje desaparece (US1-1, US1-5) |
| 4 | Enviar el formulario vacío | Mensajes en los cuatro campos y en la casilla; foco en el nombre (US2-1) |
| 5 | Correo "usuario@", contraseña de 7 caracteres, confirmación distinta | Mensajes de correo inválido, contraseña corta y no coincidentes (US2-2 a 2-4) |
| 6 | Registrarse con el correo de una cuenta de `VITE_DEMO_USERS` | "Ya existe una cuenta con este correo" bajo el correo; contraseñas vacías (US3-1) |
| 7 | Activar el ojo de "Contraseña" | Solo ese campo cambia; el de confirmación sigue oculto (US4-3) |
| 8 | Activar "Google" o "Apple"; activar "términos y condiciones" | `alert` del navegador "Próximamente"; aviso "Función no disponible en esta demostración" para los términos (US5-3) |
| 9 | Reducir la ventana a 320 px y usar atrás/adelante del navegador | Solo se ve el formulario, sin scroll horizontal; atrás/adelante cambian entre `/login` y `/registro` (UI-9, UI-11) |
| 10 | Comparar con `design/registro.png` | Mismos textos, orden y jerarquía (SC-006) |

## Verificación automatizada

```bash
npm test               # pruebas unitarias y de componentes
npm run test:coverage  # cobertura ≥ 80 %
npm run verify         # lint, formato, tipos, pruebas, build, auditoría, licencias, secretos
```

Todas las pruebas del registro se nombran con el ID del escenario o requisito (`US1-1`,
`FR-007`, `C2`, `UI-5`…) para la trazabilidad (Constitución 9.2). `npm run verify` DEBE terminar
sin errores antes de integrar.
