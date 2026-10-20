# Revisión de accesibilidad

## Evidencia automática

Tests de etiquetas, orden de teclado, foco, required, asociación de errores, estado ocupado, contraseñas independientes y aviso de éxito. Axe-core en jsdom para formulario vacío/errores y pantalla completa; contraste se comprueba en Chrome real, no en jsdom.

Chrome headless: revisión a 320/375/768/1024/1440 px, sin desplazamiento horizontal. Capturas y resultados en `browser-evidence/`. Errores en móvil no impiden completar formulario. Se verificó foco en primer control inválido y enlaces conectados.

## Pendientes manuales

No se dispone de una sesión interactiva con NVDA/VoiceOver en esta ejecución. La lectura real de errores y resultados y la revisión humana deben verificarse antes de declarar cumplimiento completo de SC-005. La ampliación de texto al 200 % sí se verificó automáticamente en Chrome: sin overflow horizontal y sin compresión de líneas del enlace de términos; captura en `browser-evidence/register-text-200-320.png`. Las pruebas automáticas no sustituyen la revisión.
