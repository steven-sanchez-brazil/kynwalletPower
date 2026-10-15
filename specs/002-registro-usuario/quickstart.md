# Quickstart: Registro de Usuarios de KynWallet

## Prerrequisitos y configuración

Los mismos de [001](../001-login-billetera/quickstart.md): Node.js 20+, `npm install` y
`.env.local` con `VITE_DEMO_USERS`. Sin esa variable, el login y el registro responden "no
disponible".

## Ejecutar

```bash
npm run dev        # http://localhost:5173/registro
npm run verify     # todos los controles (Constitución 9.4)
```

## Escenarios de validación manual

| # | Pasos | Resultado esperado |
|---|---|---|
| V1 | Abrir `/registro` | Pantalla "Crea tu cuenta"; pestaña "KynWallet · Crear cuenta" |
| V2 | Presionar "Crear cuenta" sin datos | Cinco mensajes de error; foco en "Nombre completo" |
| V3 | Correo `usuario@` y salir del campo | "Ingresa un correo electrónico válido" |
| V4 | Contraseña `1234567` y salir | "La contraseña debe tener al menos 8 caracteres" |
| V5 | Confirmación distinta y salir | "Las contraseñas no coinciden"; al igualarlas desaparece |
| V6 | Presionar "Google" o "Apple" | `alert` "Próximamente"; los datos se conservan |
| V7 | Registrarse con un correo de `VITE_DEMO_USERS` | "Ya existe una cuenta con este correo" |
| V8 | Registrarse con datos válidos | Carga ~1 s, URL `/login` y "Cuenta creada correctamente. Ya puedes iniciar sesión." |
| V9 | Iniciar sesión con la cuenta creada | "¡Bienvenido, {nombre completo}!" |
| V10 | "Inicia sesión" en el registro y "Regístrate" en el login; atrás/adelante | La URL y la pantalla coinciden |
| V11 | Abrir `/otra-ruta` | Redirige a `/login` |
| V12 | Ancho 375 px y 1440 px | Solo formulario y logo / dos paneles; sin scroll horizontal |
| V13 | Completar el registro solo con teclado | Funciona y el foco siempre es visible |
