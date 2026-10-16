# Consigna de Specify para Registro

**Estado**: existe un primer borrador; esta es la consigna vigente para su siguiente iteración.
**Resultado**: [spec.md](../../../specs/002-registro-usuarios/spec.md).
El prompt inicial utilizado se conserva en la [bitácora](../registro-usuarios-log.md).

## Prompt para Codex

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/002-registro-usuarios
Revisar y actualizar la spec existente de Registro de Usuarios de KynWallet.
Conservar sus aclaraciones, especialmente el alcance ya confirmado por el usuario:
demo sin backend, envío simulado y sin guardar contraseñas ni crear cuentas reales.
Incluir nombre completo, correo, contraseña, confirmación y aceptación obligatoria
de términos; validaciones inline, correo válido, mínimo de ocho caracteres y
coincidencia de contraseñas. Crear cuenta valida todos los campos antes de enviar.
El éxito lleva a /login con confirmación; el enlace para quienes ya tienen cuenta
también lleva a /login. Google y Apple muestran alert "Próximamente".
En escritorio hay dos paneles; en móvil solo el formulario.
Referencia: Figma, frame 04 Registro, nodo 31:2. Consultar la extracción disponible
en specs/002-registro-usuarios/design/; no inventar medidas ni colores ausentes.
Respetar la Constitución y preservar el funcionamiento del login existente.
Conservar la rama feature/registro-pedro-gandola y la misma carpeta de feature.
Actualizar historias, requisitos, criterios de aceptación y checklist de calidad.
Registrar decisiones y cuestiones pendientes en harness/sdd/registro-usuarios-log.md.
Presentar la spec para revisión antes de Plan. No implementar código.
```
