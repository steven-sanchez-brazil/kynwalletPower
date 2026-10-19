# Contract: Interfaz de usuario de registro

Contrato observable para pruebas de UI. Nombres y textos corresponden al frame exportado y al
taller, con mensajes de error definidos por el producto antes de implementar.

## Vista de registro

| Elemento | Rol / nombre accesible | Notas |
|---|---|---|
| Panel marca | `header`/complementary; decorativo excluido del árbol si aplica | Logo KynWallet; "Comienza tu camino financiero." y texto de apoyo, todo en blanco como en el diseño original (excepción de contraste, research R10); tarjeta ilustrativa. |
| Título | `heading` nivel 1 "Crea tu cuenta" | Subtítulo "Completa tus datos para comenzar". |
| Nombre | `textbox` "Nombre completo" | Placeholder "Ej: Diego Martínez"; `autoComplete=name`. |
| Correo | `textbox` "Correo electrónico" | Placeholder "tucorreo@ejemplo.com"; `type=email`; `autoComplete=username`. |
| Contraseña | campo "Contraseña" | Oculto por defecto; botón "Mostrar contraseña"/"Ocultar contraseña"; `autoComplete=new-password`. |
| Confirmación | campo "Confirmar contraseña" | Botón independiente "Mostrar confirmación de contraseña"/"Ocultar confirmación de contraseña" (nombre distinto del anterior). |
| Términos | `checkbox` con etiqueta "Acepto los términos y condiciones" | Obligatorio; admite error asociado. Solo etiqueta: "términos y condiciones" se resalta como en el frame, pero es texto no interactivo (no es un enlace, porque no hay destino). |
| Crear cuenta | `button` "Crear cuenta" | Estado de carga ("Creando cuenta…") sin doble envío. |
| Separador | texto "o regístrate con" | Decorativo. |
| Google / Apple | botones con nombres "Google" y "Apple" | `status` "Próximamente" (no `window.alert`); no vacía el formulario. |
| Login | texto "¿Ya tienes cuenta?" seguido del `link` "Inicia sesión" | `TextLink` a `/login`; navega en cliente. Igual que el pie del login de 001, donde "Regístrate" es el enlace. |

**Errores**: vinculados al control mediante `aria-describedby` y `aria-invalid=true`; el envío
inválido enfoca el primer error en el orden nombre, correo, contraseña, confirmación, términos.

**Textos aprobados** (el taller no los define; aprobados el 2026-10-19):

| Caso | Texto |
|---|---|
| Nombre vacío | "Ingresa tu nombre completo" |
| Nombre > 80 | "El nombre no puede superar 80 caracteres" |
| Correo vacío / inválido, contraseña vacía / corta / larga | Los de login (`MESSAGES`) |
| Confirmación vacía | "Confirma tu contraseña" |
| Confirmación distinta | "Las contraseñas no coinciden" |
| Términos sin aceptar | "Debes aceptar los términos y condiciones" |
| Correo duplicado | "Este correo ya está registrado" |
| Servicio no disponible | "Servicio de registro no disponible. Intenta más tarde." |
| Fallo inesperado | "No pudimos crear tu cuenta. Inténtalo de nuevo." |
| Éxito (en `/login`) | "Cuenta creada. Ya puedes iniciar sesión." |
| Ruta no encontrada | "Página no encontrada" con enlace "Ir a iniciar sesión" |

**Estados**:

- Servicio no disponible o fallo inesperado: `alert` con texto genérico; los datos se conservan.
- Correo duplicado: error asociado al campo de correo mediante `aria-describedby`, foco en ese
  campo, sin exponer datos de la cuenta existente.
- Registro exitoso: navegación a `/login` y `Alert` `status` en esa vista, anunciado una sola
  vez y que no reaparece al recargar.
- Social no disponible: `status` "Próximamente".

## Cambios en el login (contrato de 001)

- "Regístrate" pasa de `button` con aviso a `link` "Regístrate" que navega a `/registro`.
  Sustituye el escenario US5-1 de 001 para ese elemento (FR-016); los demás elementos fuera de
  alcance conservan su aviso.
- En el orden de tabulación el elemento sigue en su misma posición, ahora como enlace.
- La vista `/login` puede mostrar el aviso de registro exitoso encima del formulario.

## Rutas

| Ruta | Vista |
|---|---|
| `/` | Login existente, alias retrocompatible (misma vista, la URL no cambia). |
| `/login` | Login existente y posible aviso de registro exitoso. |
| `/registro` | Formulario de registro. |
| Otra ruta | Vista de ruta no encontrada con enlace a `/login`; no se confunde con éxito ni con el registro, ni altera cuentas. |

La navegación entre rutas no recarga el documento. Al cambiar de ruta, el foco pasa al `h1`
de la vista nueva (`tabIndex=-1`) para teclado y lectores de pantalla.

## Responsive y teclado

- A escritorio: panel de marca de referencia 620 px y formulario sobre panel blanco en el frame
  de 1440 × 1024 px.
- En móvil: solo formulario, sin cabecera de logo (literal del taller; el login de 001 conserva
  la suya); usable desde 320 px sin scroll horizontal. El punto de corte de 960 px de 001 es un
  supuesto sin verificar.
- Orden de tabulación según el orden visual: nombre, correo, contraseña y su botón de
  visibilidad, confirmación y su botón, términos, "Crear cuenta", Google, Apple y el enlace al
  login.
- Errores, avisos y éxito se anuncian; foco visible con contraste suficiente.

## Referencia visual medida y pendientes

Medido en `Docs/04 · Registro.png` (research R2 y R6): inputs y botón principal de 400 × 52 px,
botones sociales de ≈192 × 48 px con ≈16 px de separación, checkbox de 20 × 20 px, radio ≈12 px
y colores iguales a los tokens de 001, por lo que se reutilizan los tokens y las variantes
accesibles existentes.

Pendiente: familia, pesos y altura de línea tipográficos, estados hover, foco y error de los
controles, y el diseño móvil; no aparecen en la exportación y no se fijan aquí.

Panel de marca: el titular y el texto de apoyo se mantienen en blanco, como en el diseño original.
No alcanzan WCAG AA sobre el degradado (research R10); el incumplimiento es una excepción
temporal aprobada el 2026-10-19 (Constitución 9.1); vence el 2027-01-19. Aplica también al login, que comparte
`BrandPanel`.
