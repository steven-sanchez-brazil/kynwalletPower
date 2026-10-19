# Contract: Interfaz de usuario de la pantalla de registro

Contrato observable por el usuario y por las pruebas automatizadas (React Testing Library consulta por rol y nombre accesible). Textos en español alineados con el diseño de Figma (nodo `31:2`) y la especificación funcional.

## Vista de registro (`RegisterForm`)

| Elemento | Rol / nombre accesible | Notas y comportamiento |
|---|---|---|
| Título | `heading` nivel 1 `"Crea tu cuenta"` | Subtítulo `"Completa tus datos para comenzar"` |
| Nombres Completos | `textbox` `"Nombres Completos"` | `type="text"`, `autoComplete="name"`, obligatorio (FR-002) |
| Correo electrónico | `textbox` `"Correo electrónico"` | `type="email"`, `inputMode="email"`, `autoComplete="email"`, validación inline (FR-003) |
| Contraseña | campo con etiqueta `"Contraseña"` | `type="password"` (o `"text"` al alternar), `autoComplete="new-password"`, validación inline de seguridad alta y mín. 8 caracteres (FR-004) |
|Confirmar contraseña | campo con etiqueta `"Confirmar contraseña"` | `type="password"` (o `"text"` al alternar), `autoComplete="new-password"`, validación inline de coincidencia exacta y seguridad alta (FR-005) |
| Controles de visibilidad | `button` `"Mostrar contraseña"` / `"Ocultar contraseña"` | Uno en cada `PasswordField`, con `aria-pressed` |
| Aceptación de términos | `checkbox` `"Acepto los términos y condiciones"` | Desmarcado por defecto (`false`). Mientras sea `false`, el botón `"Crear Cuenta"` tiene `disabled` |
| Botón de envío | `button` `"Crear Cuenta"` | Habilitado solo cuando el checkbox está en `true` (FR-007). En envío: `aria-busy="true"`, `disabled`, texto `"Creando cuenta…"` |
| Separador | texto `"o continúa con"` | Decorativo |
| Botones sociales | `button` `"Google"`, `button` `"Apple"` | Al hacer clic muestran un Toast con `"Próximamente"` (FR-013) |
| Enlace a Login | `button` `"Inicia sesión"` precedido por `"¿Ya tienes una cuenta?"` | Navega a la vista de inicio de sesión (`LoginForm`) (FR-014) |

## Validación inline y errores por campo

- Cada mensaje de error se renderiza debajo de su campo y se vincula mediante `aria-describedby`; el control inválido recibe `aria-invalid="true"`.
- Mensajes exactos de validación inline:
  - `Nombres Completos` vacío: `"Ingresa tus nombres completos"`
  - `Nombres Completos` > 80 caracteres: `"Los nombres completos no pueden superar 80 caracteres"`
  - `Correo electrónico` vacío: `"Ingresa tu correo electrónico"`
  - `Correo electrónico` formato inválido: `"Ingresa un correo electrónico válido"`
  - `Correo electrónico` duplicado: `"Este correo electrónico ya está registrado"`
  - `Contraseña` vacía: `"Ingresa tu contraseña"`
  - `Contraseña` débil o < 8 caracteres: `"La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial"`
  - `Contraseña` > 128 caracteres: `"La contraseña no puede superar 128 caracteres"`
  - `Confirmar contraseña` vacía: `"Confirma tu contraseña"`
  - `Confirmar contraseña` distinta de `Contraseña`: `"Las contraseñas no coinciden"`

## Notificación Toast y alertas globales

| Caso | Rol accesible | Texto exacto |
|---|---|---|
| Clic en botón `"Google"` o `"Apple"` | `status` (`aria-live="polite"`) | `"Próximamente"` |
| Fallo de almacenamiento en `localStorage` | `alert` | `"No se pudo completar el registro en este navegador. Verifica la configuración de almacenamiento."` |

## Navegación entre pantallas

1. En `LoginForm`, activar el botón `"Regístrate"` cambia la vista activa a `RegisterForm`.
2. En `RegisterForm`, activar el botón `"Inicia sesión"` cambia la vista activa a `LoginForm`.
3. En `RegisterForm`, al enviar el formulario con todos los campos válidos y términos aceptados, tras persistir en `localStorage`, la aplicación cambia automáticamente la vista activa a `LoginForm`.
