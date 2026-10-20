# Contract: Interfaz de registro

**Figma**: `04 · Registro`, nodo `31:2`, archivo `8d93T5F40yvMNXngrH48qt`

## Controles

| Elemento | Rol / nombre | Contrato |
|---|---|---|
| Título | h1 “Crea tu cuenta” | Subtítulo exacto de Figma. |
| Nombre | textbox “Nombre completo” | autocomplete name; placeholder Figma. |
| Correo | textbox “Correo electrónico” | email/autocomplete email. |
| Contraseña | campo “Contraseña” | new-password; oculto. |
| Toggle | botón Mostrar/Ocultar contraseña | aria-pressed; independiente. |
| Confirmación | campo “Confirmar contraseña” | new-password; oculto. |
| Toggle confirmación | botón con nombre específico | Independiente. |
| Términos | checkbox con etiqueta completa | Obligatorio; error asociado. |
| Acción términos | control separado | “Función no disponible en esta demostración”. |
| Enviar | botón “Crear cuenta” | disabled + aria-busy + texto de actividad. |
| Google/Apple | botones | “Próximamente”; no envían ni cambian datos. |
| Login | enlace “Inicia sesión” | href `/login`. |

## Errores, foco y anuncios

Errores junto al control con `aria-invalid` y `aria-describedby`. En submit inválido, foco:
nombre → correo → contraseña → confirmación → términos. Avisos usan `status`; fallo inesperado
`alert`; éxito se anuncia en login con el texto exacto. Ningún anuncio incluye valores.

El orden DOM coincide con el visual; no hay tabindex positivo. Enter envía; controles nativos
aceptan Enter/Espacio; términos/social son `type=button`; todo foco es visible.

## Visual y responsive

- 1440×1024: dos paneles, marca 620 y formulario 400.
- Controles 52 px/radio 12/borde 1.5; social 192×48/gap 16; checkbox 20/radio 6;
  tarjeta 360×210/radio 22; Inter y jerarquía Figma.
- Bajo 960 se oculta promoción y queda identidad + formulario.
- Desde 320: fluido, padding 16, sin overflow, recorte o superposición; scroll vertical permitido.
- Solo los colores que incumplen AA se sustituyen por tokens aprobados.

## Navegación y privacidad

`/register` es la entrada planificada y `/login` el destino. History API + estado transitorio
manejan navegación/flash. Valores no aparecen en URL, storage, cookies, logs ni telemetría.
