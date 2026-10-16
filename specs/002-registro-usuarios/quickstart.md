# Probar el registro de KynWallet

**Feature**: `002-registro-usuarios`

## Preparación

Usar Node.js 20 o superior y npm 10 o superior. Desde la raíz de `kynwalletPower`:

```bash
npm install
npm run dev
```

Abrir [registro local](http://localhost:5173/register). El registro puede crear una cuenta
demo aunque no se haya configurado `VITE_DEMO_USERS`. Para probar cuentas preconfiguradas de
login, copiar `.env.example` a `.env.local` y definir únicamente cuentas ficticias según el
README. No versionar ese archivo.

## Demostración funcional

1. Abrir `/` o `/login`; activar “Regístrate” y comprobar `/register`.
2. Pulsar “Crear cuenta” con el formulario vacío. Comprobar errores y foco en el primer dato.
3. Probar correo inválido, contraseña de 7 caracteres, confirmación diferente y términos sin
   aceptar. Ningún caso debe crear una cuenta.
4. Escribir un nombre ficticio y un correo nuevo, contraseña de al menos 8 caracteres y su
   confirmación exacta; aceptar términos y pulsar “Crear cuenta”.
5. Comprobar la navegación a `/login` con mensaje de cuenta creada. Iniciar sesión con esos
   mismos datos y comprobar la bienvenida con el nombre.
6. Cerrar sesión y volver a registro. El mismo correo debe ser rechazado como duplicado.
7. Activar Google y Apple: cada uno debe mostrar un diálogo con `Próximamente`.
8. Probar “Inicia sesión” y Atrás/Adelante del navegador.

Las cuentas nuevas y la confirmación son temporales. Recargar la página elimina las cuentas
registradas en esta demo; solo se recargan las cuentas ficticias de configuración, si existen.
Usar exclusivamente datos ficticios: no hay backend, verificación de correo ni identidad real.

## Revisión responsive y accesible

- A 1440 px, comprobar panel de marca y formulario en dos columnas.
- A 375 y 320 px, comprobar que solo aparece el formulario y todos los controles se pueden
  alcanzar sin desplazamiento horizontal.
- Recorrer campos, visibilidad de contraseñas, términos, botones y enlaces con Tab/Shift+Tab,
  Enter y Espacio; comprobar etiquetas, foco, errores y anuncio del resultado.

## Controles automatizados

```bash
npm test
npm run test:coverage
npm run verify
```

Estos comandos son instrucciones de reproducción; sus resultados reales se documentan en
[`tasks.md`](./tasks.md). `verify` incluye lint, formato, tipos, pruebas con cobertura, build,
auditorías de dependencias/licencias y escaneo de secretos.

## Entrega remota

Este trabajo deja los cambios locales sobre `feature/registro-henry-ilizarbe`. Los pasos del
taller de commit, push y pull request quedan para publicación después de revisar el diff y
los controles. No se da por publicada la rama ni por creado un pull request.
