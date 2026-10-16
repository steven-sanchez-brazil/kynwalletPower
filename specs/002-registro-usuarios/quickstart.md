# Quickstart: Pantalla de Registro de Usuarios de KynWallet

Guía de ejecución y validación de extremo a extremo para la pantalla de Registro (`04 · Registro`, nodo `31:2`) y su integración con Inicio de Sesión (`/login`).

## Prerrequisitos

- Node.js 20 LTS o superior y npm 10 o superior.
- Archivo `.env.local` configurado a partir de `.env.example` con al menos una cuenta ficticia en `VITE_DEMO_USERS`.

## Comandos de Ejecución y Verificación

```bash
npm install
npm run dev          # Inicia el servidor en http://localhost:5173
npm run verify       # Ejecuta lint, typecheck, test:coverage (≥80%), build, audit:deps, audit:licenses y scan:secrets
```

## Escenarios de Validación de Punta a Punta

| # | Escenario | Pasos | Resultado esperado | Referencia |
|---|---|---|---|---|
| 1 | **Navegación desde Login a Registro** | En `/login`, pulsar `"Regístrate"` | La ruta cambia a `/register` y se muestra el formulario `"Crear cuenta"` | US3-2, FR-008 |
| 2 | **Validación de integridad con formulario vacío** | En `/register`, pulsar `"Crear cuenta"` sin llenar campos | Se muestran los 5 mensajes obligatorios inline (`Nombre completo`, `Correo electrónico`, `Contraseña`, `Confirmar contraseña`, `Términos y condiciones`) y el foco se ubica en `"Nombre completo"` | US2-1, FR-004, FR-005 |
| 3 | **Validaciones inline al salir del campo (`blur`)** | Escribir `"usuario@"` en correo, `"1234567"` en contraseña y `"distinta"` en confirmar contraseña | Se muestran inline: `"Ingresa un correo electrónico válido"`, `"La contraseña debe tener al menos 8 caracteres"` y `"Las contraseñas no coinciden"`; al corregir cada valor, su error desaparece inmediatamente | US2-2, US2-3, US2-4, US2-5, FR-003 |
| 4 | **Botones sociales Google y Apple** | Pulsar `"Google"` o `"Apple"` | Aparece el banner `Alert` (`role="status"`) con el texto `"Próximamente"` conservando los datos ingresados | US3-1, FR-007 |
| 5 | **Registro exitoso, redirección automática e inicio de sesión** | Completar datos válidos nuevos, marcar `"Acepto los términos y condiciones"` y pulsar `"Crear cuenta"` | Botón pasa a `"Creando cuenta…"` (`disabled`), luego aparece `"¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…"` durante ~1.5 s, redirige automáticamente a `/login` y permite iniciar sesión inmediatamente con la nueva cuenta | US1-1, US1-2, FR-009, FR-010 |
| 6 | **Responsive Design (Desktop vs. Mobile)** | Inspeccionar en `1440×1024` (`≥ 960 px`) y en `375×812` / `320 px` (`< 960 px`) | En Desktop se muestran 2 paneles (`BrandPanel` con **KynCard** a la izquierda + formulario a la derecha); en Mobile se muestra 1 panel adaptativo (cabecera compacta + formulario, sin **KynCard** y sin scroll horizontal) | US4-1, US4-2, FR-012 |
