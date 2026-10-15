# Quickstart: Pantalla de Registro de KynWallet

Guía para ejecutar la demo localmente y validar el registro de punta a punta.

## Prerrequisitos

- Node.js 20 LTS o superior y npm 10 o superior.

## Configuración

```bash
npm install
cp .env.example .env.local
```

Define al menos una cuenta **ficticia** en `VITE_DEMO_USERS` (formato en
[001 · auth-gateway](../001-login-billetera/contracts/auth-gateway.md)). Se usa para demostrar el
error de "cuenta ya existente". `.env.local` no se versiona (Constitución 5.3).

## Ejecutar

```bash
npm run dev        # http://localhost:5173/registro (registro) y /login (login)
npm run build      # build de producción en dist/ (ambas pantallas)
npm run preview
npm test           # pruebas
npm run verify     # lint, formato, tipos, cobertura, build, auditorías, secretos
```

Resultado esperado de `verify`: código 0 y cobertura ≥ 80 %.

## Escenarios de validación manual

Sea `<correo-demo>` el correo de una cuenta definida en `.env.local`.

| # | Acción | Resultado esperado | Spec |
|---|---|---|---|
| 1 | Datos válidos, correo nuevo, términos marcados → "Crear cuenta" | Botón en carga ~1 s; redirige a `/login` con el aviso emergente "¡Cuenta creada con éxito!" arriba a la derecha, que se oculta a los ~5 s | US1-1, US1-2, 001 US7 |
| 2 | Recargar `/login` tras el paso 1 | El mensaje de éxito ya no aparece | US1-5 |
| 3 | Correo en mayúsculas y con espacios | Cuenta creada | US1-3 |
| 4 | Enter en el último campo | Se envía el formulario | US1-4 |
| 5 | Datos válidos con `<correo-demo>` | "No fue posible crear la cuenta…"; nombre y correo conservados, contraseñas vacías, foco en correo | US2-1, US2-3 |
| 6 | Modificar un campo tras el error | El mensaje desaparece | US2-2 |
| 7 | Quitar `VITE_DEMO_USERS` y reiniciar; enviar | "Servicio de registro no disponible…" | US2-4 |
| 8 | Enviar vacío | Errores en todos los campos y términos; foco en Nombre | US3-1 |
| 9 | Nombre "A1", correo "usuario@", contraseña "abcdefgh", confirmación distinta | Mensajes específicos por campo | US3-2…5 |
| 10 | Enviar sin marcar términos | "Debes aceptar los términos y condiciones" | US3-6 |
| 11 | Activar cada ojo | Se muestra/oculta solo su campo | US4 |
| 12 | Términos y condiciones | "Función no disponible en esta demostración" | US5-1 |
| 12a | Google, Apple | "Próximamente" dentro de la página (sin diálogo del navegador) | US5-2 |
| 12b | "Inicia sesión" (ratón y Enter) | Navega a `/login` sin recargar, sin mensaje de éxito | US6, FR-022 |
| 12c | "Regístrate" en el login | Navega a `/registro` | 001 US6, FR-020 |
| 12d | Registro exitoso | Redirige a `/login` con "¡Cuenta creada con éxito!"; al recargar desaparece | US1-1, US1-5, FR-011/012 |
| 12e | Abrir `/` o `/abc` | Redirige a `/login` | FR-023 |
| 13 | Reducir a 320 px | Sin scroll horizontal; usable | FR-020 |
| 14 | Recorrer solo con Tab/Enter | Orden de [ui-register.md](./contracts/ui-register.md) | FR-017 |
