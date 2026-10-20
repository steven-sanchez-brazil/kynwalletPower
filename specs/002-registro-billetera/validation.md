# Validación de implementación

## Entorno y línea base

Node detectado en `C:/nvm4w/nodejs`: v24.22.0; npm 11.19.1. Instalación mediante `npm ci` con lockfile existente; en curso. Checklist de requisitos: 16/16, sin modificaciones. Sin hooks registrados.

La primera instalación en sandbox falló ENOTCACHED; se solicitó ejecución con red. No se ha ejecutado aún la suite base ni se afirma cobertura. No hay cambios de producción de registro en esta etapa.

## Pendientes externos

SC-001 requiere cinco participantes reales. La revisión manual con lector de pantalla y la aprobación de diferencias de diseño deberán registrarse con evidencia real; no se simulan.

## Línea base verificada

Antes de cambios funcionales: 15 archivos, 111 pruebas pasan. Cobertura: statements 98.88 %, branches 97.58 %, functions 100 %, lines 100 %. Vitest requirió ejecución fuera de sandbox por spawn EPERM. npm ci: 586 paquetes, 0 vulnerabilidades reportadas.

El control inicial de formato reportó archivos existentes con formato discrepante (incluye habilidades, referencias exportadas y fuentes); no se reformatean artefactos de referencia ni habilidades. La primera prueba de dominio de registro falló por módulo aún inexistente, confirmando rojo antes de implementación.

## Fundamentos y TDD

T001–T014 (preparación, contratos, dominio, fake y caso de uso): las reglas de dominio y contratos pasan 31 pruebas dirigidas junto a regresiones de validación del login. Los tests de formulario/hook fallaron por módulos aún no creados antes de implementación. Las pruebas del fake y caso de uso también fallaron por módulos faltantes antes de escribir producción. T006 reutilizó la suite existente de reglas compartidas sin cambiar esas reglas.

## Resultado funcional y verificaciones

Implementadas las cinco historias: registro válido, validación inline, diseño adaptable/accesibilidad, navegación login↔registro/alertas y visibilidad de contraseñas. Se mantuvo autenticación anterior; la creación es ficticia, sin HTTP ni persistencia. Se ampliaron únicamente componentes compartidos necesarios.

Suite completa verificada: 26 archivos, 161 pruebas; statements 99.43 %, branches 98.03 %, functions 100 %, lines 100 %. Supera umbral 80 % y no disminuye ninguna métrica global frente a la línea base 98.88/97.58/100/100. La prueba adicional de entrada con apariencia ejecutable también pasa, cerrando la verificación automática de FR-016.

- `npm run build`: correcto, Vite 8.3.4.
- `npm run lint`: correcto, incluidas reglas de capas.
- `npm run typecheck`: correcto.
- Prettier sobre todos los archivos de código nuevos/modificados, README, package.json y ESLint: correcto.
- `npm run audit:deps`: 0 vulnerabilidades.
- `npm run audit:licenses` (producción): correcto.
- `npm run scan:secrets`: correcto. Solo se excluyó la caché generada de npm, igual que node_modules; no se ocultaron archivos de aplicación.
- Auditoría adicional de licencias de desarrollo: falla por `@azu/style-format@1.0.1` (WTFPL), dependencia preexistente; no se introdujeron librerías nuevas. Requiere decisión de política o sustitución en un cambio aprobado, sin modificar la lista permitida.
- `npm run verify`: se detiene en formato global de archivos preexistentes (habilidades, referencias exportadas y código ajeno al cambio). No se modificaron esos artefactos ni se agregaron exclusiones para convertir ese resultado en aprobado. Las comprobaciones restantes se ejecutaron individualmente.

Chrome real, preview compilado: cinco anchos sin overflow horizontal, dos paneles desde 1024; heading a x=820/y=140 y formulario de 400 px a 1440. Axe con contraste real no encuentra infracciones en escritorio vacío/errores ni móvil con errores. Éxito observado en aproximadamente 0.55 s; cero solicitudes de registro por red; sin datos en History API ni almacenamiento. Evidencia en `browser-evidence/results.json` y capturas.

La ampliación de texto a 200 % detectó altura fija del enlace de términos: primero falló una aserción de navegador, se cambió a line-height relativa y se repite el control sobre build final. Esta comprobación automatizada no sustituye una sesión manual con lector de pantalla.

## Límites y pendientes de entrega

T036: lector de pantalla/revisión humana pendiente. T050: control global de formato y licencia de desarrollo preexistentes impiden marcar el gate integral como cumplido. T052: cinco participantes reales no disponibles. T053: aprobación del responsable de diseño sobre diferencias de contraste y revisión externa no constan. No se realiza merge, publicación ni se atribuyen aprobaciones al usuario.

Pruebas agrupadas en archivos dedicados `App.registration.test.tsx` y `Checkbox.registration.test.tsx` mantienen regresiones anteriores separadas. Los nombres accesibles configurables de PasswordField se cubren desde la integración de las dos instancias del formulario en lugar de duplicar ese recorrido en otro test unitario.

## Cierre de validación visual

Build final y browser-smoke pasaron tras corregir line-height relativa: vacío/errores desktop y errores mobile sin infracciones axe, texto 200 % sin overflow ni líneas comprimidas, formulario a x=820/y=140 en escritorio y registro completado en 563 ms. Se conservan capturas y JSON reproducible. El encabezado/logo oscuros son la diferencia AA explícita; no hay aprobación de diseño registrada.

## Actualización de color — 2026-10-19

Por instrucción explícita del usuario, KynWallet, el titular y el párrafo del panel izquierdo de registro vuelven a blanco (#FFFFFF). La evidencia de contraste y las capturas anteriores corresponden a texto oscuro y son históricas; no se presentan como validación AA del color actual. La decisión y la excepción pendiente de formalización se registran en spec.md, plan.md y design-review.md. No se alteran pruebas para ocultar el contraste conocido.
