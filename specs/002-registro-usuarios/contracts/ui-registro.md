# Contract: Interfaz de usuario del registro

Textos exactos según el frame `04 · Registro` y la spec. Las pruebas consultan por rol y nombre
accesible.

## Rutas

| Ruta | Pantalla |
|---|---|
| `/registro` | Registro |
| `/login`, `/` y cualquier otra | Login |

## Vista de registro

| Elemento | Rol / nombre accesible | Notas |
|---|---|---|
| Título | `heading` nivel 1 "Crea tu cuenta" | Subtítulo "Completa tus datos para comenzar" |
| Nombre | `textbox` "Nombre completo" | `autocomplete=name`, placeholder "Ej: Diego Martínez" |
| Correo | `textbox` "Correo electrónico" | `type=email`, `autocomplete=email`, placeholder "tucorreo@ejemplo.com" |
| Contraseña | campo "Contraseña" | `autocomplete=new-password`, con botón "Mostrar contraseña" |
| Confirmación | campo "Confirmar contraseña" | `autocomplete=new-password`, con botón "Mostrar contraseña" |
| Términos | `checkbox` "Acepto los términos y condiciones" | Contiene el `button` "términos y condiciones" (alert "Próximamente") |
| Enviar | `button` "Crear cuenta" | En carga: `aria-busy=true`, deshabilitado, "Creando cuenta…" |
| Separador | texto "o regístrate con" | |
| Google / Apple | `button` "Google", `button` "Apple" | `window.alert('Próximamente')` |
| Ir al login | `link` "Inicia sesión" precedido por "¿Ya tienes cuenta?" | `href=/login` |

**Errores por campo**: texto bajo el control, `aria-invalid=true` y `aria-describedby` (también
en la casilla).

**Mensajes globales**:

| Caso | Rol | Texto |
|---|---|---|
| Correo ya registrado | `alert` | "No pudimos crear la cuenta con este correo. Si ya tienes una cuenta, inicia sesión." |
| No disponible | `alert` | "Servicio de registro no disponible. Intenta más tarde." |
| Éxito (en `/login`) | `status` | "¡Cuenta creada con éxito! Inicia sesión para continuar." |

## Panel de marca

Titular "Comienza tu camino financiero." (salto tras "tu") y texto "Crea tu cuenta en minutos y
empieza a enviar, recibir y administrar tu dinero desde cualquier lugar."; misma tarjeta que el
login. Por debajo de 960 px solo se muestra el logo.

## Teclado

Orden: nombre → correo → contraseña → visibilidad → confirmación → visibilidad → casilla →
términos y condiciones → crear cuenta → Google → Apple → inicia sesión. Enter en un campo de texto
envía el formulario.

## Cambio en el login (001)

"Regístrate" pasa de `button` con aviso a `link` con `href=/registro`.
