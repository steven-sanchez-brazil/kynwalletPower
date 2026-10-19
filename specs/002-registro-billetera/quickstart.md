# Quickstart: Pantalla de Registro de KynWallet

Guía para ejecutar la demostración localmente y validar de extremo a extremo el flujo de registro e inicio de sesión.

## Prerrequisitos

- Node.js 20 LTS o superior y npm 10 o superior.

## Configuración

```bash
npm install
cp .env.example .env.local
```

## Ejecutar en modo desarrollo y producción

```bash
npm run dev        # Servidor de desarrollo en http://localhost:5173
npm run build      # Verificación de tipos y build de producción en dist/
npm run preview    # Sirve el build de producción
```

## Verificar calidad y cumplimiento constitucional (Constitución 9.4)

```bash
npm run verify     # lint, format, typecheck, test:coverage, build, audit:deps, audit:licenses, scan:secrets
```

Resultado esperado: todos los controles finalizan con código `0` y la cobertura de pruebas es ≥ 80 %.

## Escenarios de validación manual

| # | Acción | Resultado esperado | Referencia Spec |
|---|---|---|---|
| 1 | En la pantalla de Login, hacer clic en `"Regístrate"` | Se muestra la pantalla de Registro (`"Crea tu cuenta"`) con el botón `"Crear Cuenta"` deshabilitado | US1-1, US1-5 |
| 2 | Marcar y desmarcar el checkbox `"Acepto los términos y condiciones"` | El botón `"Crear Cuenta"` se habilita al marcar (`true`) y se deshabilita al desmarcar (`false`) | US1-1, US1-2, FR-007 |
| 3 | Escribir un correo inválido (`"usuario@"`) en `"Correo electrónico"` | Se muestra inline `"Ingresa un correo electrónico válido"` | US2-2, FR-003 |
| 4 | Escribir una contraseña débil (`"12345678"` o `"abcdefg!"`) en `"Contraseña"` | Se muestra inline `"La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial"` | US2-3, FR-004 |
| 5 | Escribir `"Segura123!"` en `"Contraseña"` y `"Diferente123!"` en `"Confirmar contraseña"` | Se muestra inline `"Las contraseñas no coinciden"` | US2-4, FR-005 |
| 6 | Marcar el checkbox de términos con algún campo vacío o con error y pulsar `"Crear Cuenta"` | No se envía ni redirige; se muestran los errores inline pendientes y el foco pasa al primer campo con error | US2-6, FR-008 |
| 7 | Completar `"Nombres Completos"` (`"Ana Gómez"`), `"Correo electrónico"` (`"ana@ejemplo.com"`), `"Contraseña"` (`"KynWallet2026!"`), `"Confirmar contraseña"` (`"KynWallet2026!"`), marcar términos y pulsar `"Crear Cuenta"` | Se guarda el registro en `localStorage` (`kynwallet.registeredUsers`, sin contraseña en texto plano) y la vista cambia automáticamente a Login | US1-3, FR-010, FR-011 |
| 8 | En Login, ingresar `"ana@ejemplo.com"` y `"KynWallet2026!"` y pulsar `"Iniciar sesión"` | Se muestra la vista `"¡Bienvenido, Ana Gómez!"` | US1-4, FR-012 |
| 9 | En Registro, pulsar el botón `"Google"` o `"Apple"` | Aparece una alerta tipo Toast con el mensaje `"Próximamente"` y se conservan los datos del formulario | US3-1, US3-2, FR-013 |
| 10 | Reducir el ancho de ventana a `320px` | El formulario de registro y el Toast se adaptan sin scroll horizontal | Edge Cases, FR-001 |
