# Revisión de diseño de registro

Referencia inspeccionada: `.prompts/registro/04 · Registro.png` y `styles.css`. Capturas de la aplicación en [browser-evidence](browser-evidence/), generadas con Chrome headless a 320, 375, 768, 1024 y 1440 px; formulario vacío y errores a 320 px. Sin datos personales reales.

Se conservan Inter local, dos paneles, ancho proporcional izquierdo 620/1440, formulario de 400 px, campos 52 px, radios de 12 px, tarjeta y contenido. Solo formulario debajo de 1024 px. El aviso de demostración añade una línea prevista por especificación. El chip/iconos reutilizan los assets del proyecto, sin nuevas imágenes externas.

## Diferencias explícitas por accesibilidad

- Texto principal, párrafo de apoyo y palabra KynWallet del panel de registro: `#FFFFFF`, por decisión explícita del usuario del 2026-10-19; se conserva el gradiente original. El ajuste anterior a `#16182C` queda sustituido. El blanco sobre `#FF8A65` no alcanza contraste AA, incluso para texto grande. La tarjeta sigue siendo decorativa y se excluye del árbol accesible.
- Botón/enlaces: `--brand-700` (`#D04721`) y hover `--brand-800` en lugar de naranja original.
- Textos secundarios/placeholder: `--neutral-600` (`#73748B`). Bordes: `--neutral-border` (`#92949C`). Se reutilizan tonos AA existentes, sin afirmar aprobación anterior.
- Distribución usa flujo adaptable; errores y texto ampliado aumentan altura sin superposición. No se copian posiciones absolutas del CSS exportado.

La auditoría axe y las capturas previas (results.json) corresponden a la versión anterior con texto oscuro; no acreditan el contraste de la versión actual con texto blanco. La suite jsdom omite contraste por limitaciones del entorno y no sustituye medición real.

**Aprobación del responsable de diseño (Constitución 8.6): pendiente.** Este archivo describe una propuesta implementada y revisable, no acredita aprobación ni revisión humana de diseño.
## Decisión visual — 2026-10-19

El usuario indicó explícitamente mantener en blanco el texto «KynWallet», «Comienza tu camino
financiero.» y el párrafo de apoyo del panel izquierdo de registro, conservando el gradiente
original de la referencia. Se aplica `--neutral-0` (#FFFFFF) a esos tres elementos.

Esta decisión sustituye el ajuste previo a texto oscuro. Conforme a Constitución 8.8, se
prioriza el diseño para este conflicto concreto. Afecta al contraste de FR-014/SC-005: no se
declara cumplimiento completo de WCAG AA para esos textos sobre las zonas claras del gradiente.
La formalización de la excepción de 9.1, incluidos responsables y vencimiento, sigue pendiente
antes de integrar; no se inventan aprobaciones ni se cambia el resto de los requisitos.
