# Contract: Interfaz de usuario de la pantalla de registro

Contrato observable por el usuario y por las pruebas (RTL consulta por rol y nombre accesible).
Textos tal como figuran en el frame `04 · Registro` de Figma y en la spec.

## Formulario (`/registro`)

| Elemento | Rol / nombre accesible | Notas |
|---|---|---|
| Título | `heading` nivel 1 "Crea tu cuenta" | Subtítulo "Completa tus datos para comenzar" |
| Nombre | `textbox` "Nombre completo" | `autocomplete=name`, placeholder "Ej. Diego Martínez" |
| Correo | `textbox` "Correo electrónico" | `type=email`, `autocomplete=email`, placeholder "tucorreo@ejemplo.com" |
| Contraseña | campo "Contraseña" | `autocomplete=new-password`, placeholder "••••••••" |
| Confirmación | campo "Confirmar contraseña" | `autocomplete=new-password`, placeholder "••••••••" |
| Visibilidad | dos `button` "Mostrar contraseña" / "Ocultar contraseña" | Independientes; `aria-pressed` |
| Términos | `checkbox` "Acepto los términos y condiciones" | Etiqueta visible "Acepto los" + botón |
| Enlace de términos | `button` "términos y condiciones" | `alert("Próximamente")` |
| Enviar | `button` "Crear cuenta" | En carga: `aria-busy=true`, deshabilitado, texto "Creando cuenta…" |
| Separador | texto "o regístrate con" | Decorativo |
| Google / Apple | `button` "Google", `button` "Apple" | `alert("Próximamente")` |
| Login | `link` "Inicia sesión" (`href=/login`) precedido por "¿Ya tienes cuenta?" | Navega sin recargar |

**Errores por campo**: texto bajo el campo (o bajo la casilla), vinculado con
`aria-describedby`; el control lleva `aria-invalid=true`. El error de correo duplicado
("Ya existe una cuenta con este correo") se muestra igual en el campo de correo.

**Mensaje global**: servicio no disponible → `alert` "Servicio de acceso no disponible. Intenta
más tarde."

## Cambios en el inicio de sesión (`/login`)

| Elemento | Antes | Ahora |
|---|---|---|
| "Regístrate" | `button` que mostraba aviso | `link` con `href=/registro` |
| Mensaje de éxito | — | `status` "¡Cuenta creada con éxito! Ya puedes iniciar sesión." tras registrarse |

## Panel de marca

| Pantalla | Titular | Texto de apoyo |
|---|---|---|
| Login | "Tu dinero, sin fronteras." | "Envía, recibe y paga en segundos. Una billetera pensada para tu día a día." |
| Registro | "Comienza tu camino financiero." | "Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar." |

Desde 960 px: dos paneles. Por debajo: solo la barra con el logo y el formulario.

## Teclado

Orden de tabulación: nombre → correo → contraseña → visibilidad → confirmación → visibilidad →
casilla → términos → crear cuenta → Google → Apple → inicia sesión. Enter en un campo envía.

## Título del documento

`KynWallet · Iniciar sesión` en `/login` y `KynWallet · Crear cuenta` en `/registro`.
