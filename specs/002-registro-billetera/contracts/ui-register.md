# Contrato de UI: Pantalla de Registro

**Feature**: `002-registro-billetera` | Contrato observable por pruebas (roles y nombres
accesibles). Los textos exactos se confirman contra Figma `31:2` (plan, R6).

## Vista de formulario

| Elemento | Rol / nombre accesible | Notas |
|---|---|---|
| Nombre completo | `textbox` "Nombre completo" | `autocomplete="name"` |
| Correo | `textbox` "Correo electrónico" | `type="email"`, `autocomplete="email"` |
| Contraseña | campo "Contraseña" | `autocomplete="new-password"` |
| Confirmar contraseña | campo "Confirmar contraseña" | `autocomplete="new-password"` |
| Mostrar/ocultar (×2) | `button` "Mostrar contraseña" / "Ocultar contraseña", `aria-pressed` | uno por campo, independientes |
| Términos | `checkbox` "Acepto los términos y condiciones" | enlace/botón "términos y condiciones" → aviso |
| Enviar | `button` "Crear cuenta" | cargando: deshabilitado + `aria-busy` |
| Google / Apple | `button` | → aviso "Próximamente" (`role="status"`), sin diálogo del navegador (FR-019, 2026-10-15 (b)) |
| "Inicia sesión" | `link` | `href="/login"`: navega sin recarga (React Router) (US6, FR-022) |

## Rutas (FR-023)

| Ruta | Contenido | Título del documento |
|---|---|---|
| `/registro` | Pantalla de registro | "KynWallet · Crear cuenta" |
| `/login` | Pantalla de inicio de sesión (001) | "KynWallet · Iniciar sesión" |
| `/`, cualquier otra | Redirige a `/login` (`replace`) | — |

Registro exitoso → `navigate('/login', { state: { registered: true } })`. El estado solo lleva un
indicador booleano, nunca datos del formulario (FR-012, FR-015).

## Orden de foco

Nombre → Correo → Contraseña → ojo → Confirmar → ojo → Términos (casilla) → enlace términos →
Crear cuenta → Google → Apple → Inicia sesión.

## Mensajes (fuente: `domain/messages.ts`)

| Condición | Texto |
|---|---|
| Nombre vacío / inválido | "Ingresa tu nombre completo" / "Ingresa un nombre válido" |
| Correo vacío / inválido | "Ingresa tu correo electrónico" / "Ingresa un correo electrónico válido" |
| Contraseña vacía / débil | "Ingresa una contraseña" / "La contraseña debe tener al menos 8 caracteres, una letra y un número" |
| Contraseña > 128 | "La contraseña no puede superar 128 caracteres" |
| Confirmación vacía / distinta | "Confirma tu contraseña" / "Las contraseñas no coinciden" |
| Términos sin marcar | "Debes aceptar los términos y condiciones" |
| Cuenta rechazada | "No fue posible crear la cuenta. Verifica tus datos e inténtalo de nuevo." |
| Servicio no disponible | "Servicio de registro no disponible. Intenta más tarde." |
| Términos y condiciones | "Función no disponible en esta demostración" |
| Google / Apple | "Próximamente" |
| Registro exitoso (en `/login`) | "¡Cuenta creada con éxito!" |

## Accesibilidad

- Cada error de campo: `aria-invalid="true"` + `aria-describedby` hacia un elemento con el texto;
  anunciado con `role="alert"` o región `aria-live`.
- Error general y aviso en `Alert` (`role="alert"` / `role="status"` respectivamente).
- ~~Vista de bienvenida~~ (eliminada 2026-10-15 (b)): el éxito se anuncia en `/login` con
  `role="status"`.
- Cumple WCAG 2.1 AA (verificado con `axe-core` en pruebas de componente).

## Responsivo

Mismos puntos de corte que 001 (R10): < 960 px el panel de marca se reduce al logo; < 480 px
padding lateral de 16 px; sin scroll horizontal desde 320 px.
