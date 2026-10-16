# Contrato observable: Pantalla de registro

**Feature**: `002-registro-usuarios` | **Fecha**: 2026-10-16

## Componentes y navegación

- `RegisterForm` recibe `registerAccount: RegisterAccount` y `onSuccess: () => void`.
- `RegisterScreen` compone el panel de marca con la zona del formulario.
- `BrandPanel` acepta la variante `register` sin alterar los textos del login.
- `App` recibe el caso de uso de registro desde la raíz de composición. Su valor opcional
  de compatibilidad devuelve `unavailable`; `main.tsx` inyecta el caso de uso operativo.
- `/` y `/login` presentan login; `/register` presenta registro. Los enlaces usan destinos
  reales y Atrás/Adelante del navegador respetan la pantalla correspondiente.

## Contenido y acciones

| Elemento               | Comportamiento                                                             |
| ---------------------- | -------------------------------------------------------------------------- |
| Título                 | “Crea tu cuenta”                                                           |
| Apoyo                  | “Completa tus datos para comenzar”                                         |
| Nombre completo        | Campo etiquetado, requerido, autocompletado de nombre                      |
| Correo electrónico     | Campo etiquetado, requerido, entrada de correo                             |
| Contraseña             | Campo requerido, oculto inicialmente, control de visibilidad accesible     |
| Confirmar contraseña   | Campo requerido, oculto inicialmente, visibilidad independiente            |
| Términos y condiciones | Checkbox requerido, inicialmente desmarcado                                |
| Crear cuenta           | Valida todos los valores; durante envío indica progreso y evita repetición |
| Google y Apple         | Botones de tipo `button`; ejecutan `window.alert('Próximamente')`          |
| Inicia sesión          | Enlace con destino `/login`                                                |

## Éxito, errores y accesibilidad

- La entrada inválida muestra errores asociados mediante `aria-describedby` y estado
  `aria-invalid`; el primer control inválido recibe foco, incluido el checkbox si corresponde.
- Los valores corregidos permiten continuar. La confirmación se vuelve a verificar cuando
  cambia la contraseña, evitando errores que dependan del orden de edición.
- La UI anuncia el estado ocupado y los errores globales. Un fallo no deja el formulario
  bloqueado y puede reintentarse.
- `success` llama a `onSuccess`; la aplicación navega a `/login` y muestra una confirmación
  “Cuenta creada exitosamente” con rol `status`; el encabezado del login recibe foco.
  La confirmación se retira al intentar iniciar sesión y no se guarda en el historial.
- Todos los controles funcionan con teclado y conservan foco visible. El formulario usa la
  validación compartida de dominio, sin implementar reglas alternativas en componentes.
- No aparecen datos sensibles en rutas, mensajes de error, consola ni almacenamiento.

## Distribución visual

En escritorio hay dos paneles. La marca y el titular “Comienza tu camino financiero.”
acompañan el texto “Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu
dinero desde cualquier lugar.” En móvil solo permanece el formulario completo. Desde
320 px no debe haber desbordamiento horizontal.

La captura del taller página 1 es la referencia disponible después del rechazo de acceso
MCP a Figma, conforme al tip de la página 4. Los tokens, componentes y ajustes de contraste de KynWallet son reutilizados;
la revisión visual debe registrar cualquier diferencia conocida.

## Verificación

- `RegisterForm.test.tsx`: contenido, validación, envío único, errores, proveedores,
  enlace y accesibilidad automatizada.
- `App.test.tsx`: rutas, enlaces, éxito y login posterior.
- Revisión visual y teclado: escritorio 1440 px, móvil 375 y 320 px.
