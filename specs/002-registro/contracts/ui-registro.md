# UI contract: registro y navegación

**Rutas**: `/registro` muestra el registro; `/login` muestra el login existente; `/` conserva la entrada actual al login. Abrir una ruta directamente o usar atrás/adelante debe renderizar la pantalla correcta.

## Vista de registro

- Escritorio (desde 960 px): panel de marca a la izquierda y formulario a la derecha conforme a `registro.svg`. A 1440 px, el panel izquierdo mide 620 px y el formulario central tiene 400 px de ancho.
- Móvil (menos de 960 px): solo formulario, ancho fluido, márgenes utilizables y sin scroll horizontal desde 320 px.
- Título “Crea tu cuenta” y subtítulo “Completa tus datos para comenzar”.
- Campos en orden: “Nombre completo”, “Correo electrónico”, “Contraseña”, “Confirmar contraseña”. Las dos contraseñas están ocultas por defecto y disponen de controles independientes de visibilidad.
- Casilla inicialmente desmarcada: “Acepto los términos y condiciones”; “términos y condiciones” abre el contenido aprobado para la demostración de [`terminos-y-condiciones.md`](../terminos-y-condiciones.md) o su versión accesible en la aplicación sin marcar la casilla.
- Acción primaria “Crear cuenta”. Con valores válidos indica progreso, impide un segundo envío y al completarse abre `/login`.
- Divisor “o regístrate con”; botones “Google” y “Apple”. Ambos muestran exactamente “Próximamente”, sin navegar ni limpiar el formulario.
- Pie “¿Ya tienes cuenta?” con vínculo “Inicia sesión” hacia `/login`.

## Validación y mensajes

| Caso | Resultado observable |
|---|---|
| Campo obligatorio vacío | Error junto al campo; sin simulación ni navegación |
| Correo inválido o mayor a 254 | Error junto al correo |
| Contraseña fuera de 8–128 | Error junto a la contraseña |
| Confirmación diferente | Error junto a la confirmación |
| Términos desmarcados | Error asociado a la casilla |
| Primer envío con errores | Foco en primer control inválido |
| Corrección de un campo | Desaparece su error sin borrar los demás valores |
| Fallo inesperado de simulación | Aviso global genérico, permanece en `/registro`, permite reintentar |
| Éxito | `/login` con aviso temporal de éxito que aclara el carácter demostrativo |

Los errores de campo deben estar relacionados mediante `aria-describedby`, el control inválido debe indicar `aria-invalid`, el aviso global debe anunciarse y todo debe ser operable con teclado. React debe renderizar el texto de entrada escapado. Los valores sensibles nunca se incluyen en ruta, aviso, registro de diagnóstico o almacenamiento.

## Trazabilidad principal

| Escenario | Requisitos |
|---|---|
| Envío válido y redirección | US1-1, US1-2, US1-3, FR-010, FR-011, FR-013 |
| Errores en línea y foco | US2-1 a US2-7, FR-003 a FR-009, FR-015 |
| Contraseñas y condiciones | US3-1 a US3-3, FR-007, FR-008, FR-014 |
| Navegación entre pantallas | US4-1, US4-2, FR-016 |
| Google y Apple | US5-1, FR-018 |
| Diseño y accesibilidad | FR-001, FR-002, FR-017, SC-005, SC-006 |
