# Contract: Interfaz de usuario del registro

Contrato observable por el usuario y por las pruebas (RTL consulta por rol y nombre accesible).
Textos exactos del frame `04 · Registro` (nodo `31:2`) y de la spec.

## Pantalla `/registro`

| Elemento | Rol / nombre accesible | Notas |
|---|---|---|
| Título | `heading` nivel 1 "Crea tu cuenta" | Subtítulo "Completa tus datos para comenzar" |
| Formulario | `form` "Crear cuenta" | `noValidate` |
| Nombre | `textbox` "Nombre completo" | `autocomplete=name`, placeholder "Ej: Diego Martínez", `maxLength=80` |
| Correo | `textbox` "Correo electrónico" | `type=email`, `autocomplete=email`, placeholder "tucorreo@ejemplo.com" |
| Contraseña | campo "Contraseña" | `autocomplete=new-password`, placeholder "••••••••" |
| Confirmación | campo "Confirmar contraseña" | `autocomplete=new-password`, placeholder "••••••••" |
| Visibilidad | `button` "Mostrar contraseña" / "Ocultar contraseña" y "Mostrar confirmación" / "Ocultar confirmación" | `aria-pressed` |
| Términos | `checkbox` "Acepto los términos y condiciones" | Con error: `aria-invalid` y `aria-describedby` |
| Enviar | `button` "Crear cuenta" | En carga: `aria-busy=true`, deshabilitado, texto "Creando cuenta…" |
| Separador | texto "o regístrate con" | |
| Google / Apple | `button` "Google", `button` "Apple" | `alert('Próximamente')` |
| Login | `button` "Inicia sesión" precedido por "¿Ya tienes cuenta?" | Navega a `/login` |

**Errores por campo**: texto bajo el campo (o la casilla), vinculado con `aria-describedby`;
el control lleva `aria-invalid=true`.

**Mensajes globales**:

| Caso | Rol | Texto |
|---|---|---|
| Error inesperado | `alert` | "No pudimos crear tu cuenta. Intenta más tarde." |
| Éxito (en `/login`) | `status` | "Cuenta creada correctamente. Ya puedes iniciar sesión." |

## Panel de marca

Igual que 001 con el titular "Comienza tu camino financiero." y el texto "Crea tu cuenta en
minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar." Por debajo de
960 px solo se muestra el logo.

## Teclado

Orden de tabulación: nombre → correo → contraseña → visibilidad → confirmación → visibilidad →
términos → crear cuenta → Google → Apple → inicia sesión. Enter en cualquier campo envía.
