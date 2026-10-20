# Contrato de UI: Pantalla de registro

Contrato observable que verifican las pruebas de componente y de accesibilidad. Sin detalles de
implementación.

## Estructura

Dirección: `/registro`. Layout de dos paneles (`AuthScreen`) en escritorio (≥ 960 px): panel de
marca y panel de formulario. **En móvil solo se muestra el formulario** (el panel de marca se
oculta).

**Panel de marca**: logo "KynWallet"; titular "Comienza tu camino financiero."; subtexto "Crea tu
cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar."; tarjeta
decorativa "Kyn Card" (oculta a tecnologías de asistencia).

**Formulario** (en este orden, que es también el orden de foco):

| # | Elemento | Rol / etiqueta | Notas |
|---|---|---|---|
| 1 | Encabezado | `heading` nivel 1 "Crea tu cuenta" | Subtítulo "Completa tus datos para comenzar" |
| 2 | Campo de texto | `textbox` "Nombre completo" | Placeholder "Ej: Diego Martínez"; `autoComplete="name"` |
| 3 | Campo de correo | `textbox` "Correo electrónico" | Placeholder "tucorreo@ejemplo.com"; `autoComplete="email"` |
| 4 | Campo de contraseña | "Contraseña" | `autoComplete="new-password"`; botón "Mostrar/Ocultar contraseña" (`aria-pressed`) |
| 5 | Campo de confirmación | "Confirmar contraseña" | `autoComplete="new-password"`; su propio botón de visibilidad independiente |
| 6 | Casilla | `checkbox` "Acepto los términos y condiciones" | La etiqueta contiene el botón-enlace "términos y condiciones"; error asociado con `aria-describedby` |
| 7 | Botón principal | `button` "Crear cuenta" | Tipo `submit`; en carga: deshabilitado, texto "Creando cuenta…" y `aria-busy` |
| 8 | Separador | texto "o regístrate con" | Líneas decorativas ocultas a tecnologías de asistencia |
| 9 | Botones sociales | `button` "Google", `button` "Apple" | Muestran un `alert` del navegador con "Próximamente" |
| 10 | Pie | "¿Ya tienes cuenta?" + enlace "Inicia sesión" | Navega a `/login` |

## Comportamiento

| ID | Comportamiento |
|---|---|
| UI-1 | Envío con Enter desde cualquier campo de texto (US1-4) |
| UI-2 | Error de campo: mensaje bajo el campo, `aria-invalid` y `aria-describedby`; aparece al salir del campo o al enviar y desaparece al corregir (FR-009) |
| UI-3 | Tras un envío con errores, el foco va al primer campo con error: nombre, correo, contraseña, confirmación, casilla |
| UI-4 | Cambiar la contraseña reevalúa la coincidencia de la confirmación si ya fue tocada |
| UI-5 | Correo ya existente: error "Ya existe una cuenta con este correo" bajo el campo de correo; se conservan nombre y correo, se vacían contraseña y confirmación; el foco va al correo |
| UI-6 | Servicio no disponible: `Alert` de error "Servicio de registro no disponible. Intenta más tarde."; se vacían las contraseñas |
| UI-7 | Éxito: se invoca `onRegistered(nombre)` y la aplicación navega a `/login` |
| UI-8 | Login tras el éxito: `Alert` de tono `success` (rol `status`) con "¡Cuenta creada, {nombre}! Ahora puedes iniciar sesión."; desaparece al escribir, al enviar o al navegar, y no persiste al recargar |
| UI-9 | "Inicia sesión" lleva a `/login`; "Regístrate" del login lleva a `/registro`; `/` y direcciones desconocidas redirigen a `/login`; atrás/adelante del navegador muestran la pantalla que corresponde |
| UI-10 | Google y Apple llaman a `window.alert("Próximamente")` y conservan los datos; el enlace de términos muestra `Alert` informativo "Función no disponible en esta demostración" |
| UI-11 | Anchos de 320 px a escritorio sin scroll horizontal; en ancho reducido solo se muestra el formulario |
| UI-12 | Sin violaciones de axe-core en el formulario, con errores visibles y en el login con el mensaje de éxito |

## Contrato modificado del login (001)

El login pasa a vivir en `/login`; su enlace "Regístrate" deja de mostrar el aviso de función no
disponible y navega a `/registro` (UI-9). El login admite un mensaje de éxito opcional (UI-8). Los
demás elementos del login no cambian.
