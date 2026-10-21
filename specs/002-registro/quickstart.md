# Quickstart de validación: registro

Esta guía se usa después de implementar el plan. El comando `/speckit-plan` solo produce documentación; los escenarios describen el comportamiento esperado.

## Preparación

1. Instalar dependencias existentes con `npm ci` desde la raíz del proyecto.
2. Integrar el acceso al texto local [`terminos-y-condiciones.md`](./terminos-y-condiciones.md), aprobado para la demostración y previsto por FR-008.
3. Iniciar la aplicación con `npm run dev` y abrir `/registro` en el servidor local indicado por Vite.

## Verificación manual

1. A 1440 × 1024, comparar con `specs/002-registro/registro.svg`: panel de marca, formulario, textos, colores, tipografía, espaciados, tarjeta y botones.
2. A 320 px y en otro ancho móvil, verificar que se muestra solo el formulario y no hay desplazamiento horizontal.
3. Pulsar “Crear cuenta” vacío; verificar los cinco errores y foco en “Nombre completo”. Corregir cada valor y comprobar que desaparece solo su error.
4. Probar correo `usuario@`, contraseña de 7 caracteres, confirmación distinta y casilla sin marcar: permanecer en `/registro`.
5. Consultar “términos y condiciones” sin marcar automáticamente la casilla. Marcarla de forma explícita.
6. Activar Google y Apple; cada uno debe mostrar “Próximamente” y conservar el formulario.
7. Completar datos válidos y enviar con botón o Enter. Verificar progreso, una sola simulación, navegación a `/login` en ≤2 s y aviso de éxito que aclara que no existe una cuenta real.
8. Recargar `/login`: el aviso temporal debe desaparecer. Volver a `/registro` y comprobar campos vacíos. Probar ambos enlaces entre login y registro, atrás/adelante y acceso directo a ambas rutas.
9. Repetir con teclado y lector de pantalla: etiquetas, visibilidad de contraseñas, errores, aviso y foco deben anunciarse y operarse correctamente.

## Controles automatizados

Para validar esta pantalla durante el desarrollo, ejecutar `npm run test:registro` desde la raíz. Este comando selecciona las pruebas de registro, incluida la navegación entre `/registro` y `/login`, sin ejecutar las pruebas propias del formulario de login. Antes de integrar, ejecutar `npm run verify`, que conserva la cobertura y los controles generales exigidos por la constitución del proyecto. Las pruebas deben mapear los IDs de [ui-registro.md](./contracts/ui-registro.md) y [registro-simulado.md](./contracts/registro-simulado.md). El umbral de cobertura global es 80 % en líneas, ramas, funciones y sentencias.

## Ejecución de la implementación

- La primera instalación de dependencias encontró errores de certificado y conexión del registro npm. `npm ci` terminó correctamente al usar la CA del sistema; npm informó 0 vulnerabilidades. La demora impidió obtener una línea de base automatizada completa antes del primer cambio de código.
- `npm run typecheck`, `npm run lint`, `npm run format` y `npm run build`: correctos después de integrar el registro.
- Pruebas aisladas: `RegistrationForm.test.tsx` (7/7) y `App.test.tsx` (7/7) correctas. Incluyen validación, error inesperado, consulta de términos, navegación y comprobación automática de accesibilidad.
- El chequeo de formato se ajustó para aceptar los finales de línea existentes en Windows y excluir los paquetes locales de habilidades de agente; los archivos de producto modificados se formatearon con Prettier.
- `npm run verify`: correcto sobre la implementación final (con CA del sistema para la auditoría npm). Incluye 19 archivos y 142 pruebas aprobadas. Cobertura global: 96,59 % de líneas, 93,24 % de ramas, 97,02 % de funciones y 95,71 % de sentencias.
- Auditorías individuales: 0 vulnerabilidades de dependencias; licencias de producción y escaneo de secretos correctos.
- Comparación visual del build a 1440 × 1024 con `registro.svg`: panel de marca de 620 px, formulario de 400 px, jerarquía, saltos de línea y posiciones alineados. Se mantienen tonos más oscuros en botón, bordes y enlaces por el contraste accesible definido para el login; el logo y los iconos sociales reutilizan los recursos existentes del proyecto.
- Vista del build en marcos de 320 y 390 px: solo formulario, orden de controles correcto y `scrollWidth` igual a `clientWidth` en ambos anchos (320/320 y 390/390 px).
- Vitest limita la ejecución a dos trabajadores y usa un tiempo máximo de 15 s por prueba; esto evita los fallos de arranque de procesos observados en Windows al usar el valor predeterminado.
