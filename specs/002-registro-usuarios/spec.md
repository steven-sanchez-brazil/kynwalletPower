# Especificación: Registro de usuarios de KynWallet

**Rama de implementación**: `feature/registro-henry-ilizarbe`  
**Identificador SDD**: `002-registro-usuarios`  
**Fecha**: 2026-10-16  
**Estado**: implementada y verificada localmente; revisión humana previa a integración pendiente

**Entrada**: `taller-registro-kynwallet-v2.pdf`, entregado junto al repositorio. La sección de
requerimientos funcionales y validaciones del taller es la fuente de negocio; el frame
**04 Registro** de [Figma](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2&t=UqXziRdbvr7Ri2f6-4)
y su captura en el PDF son la referencia visual. La metodología sigue las plantillas de
`.specify/templates/` y la [Constitución](../../.specify/memory/constitution.md).

## Alcance y supuestos

- Se añade registro a la demo React existente sin introducir un backend, una base de datos ni
  autenticación real. El usuario utiliza datos ficticios.
- La cuenta recién creada permite probar el login en la misma pestaña mientras no se recargue
  la página. No se almacena en `localStorage`, `sessionStorage`, cookies, URLs ni archivos.
- El PDF sustituye el supuesto anterior de que registro estaba fuera de alcance de la feature
  `001-login-billetera`; el resto del comportamiento del login se conserva.
- No hay BRD ni ARD separados en el repositorio. La arquitectura existente y la Constitución
  son la referencia técnica; el taller es el documento de requerimientos aplicable.
- Google y Apple muestran exactamente `Próximamente`; no se integra OAuth.
- El taller no suministra un documento legal de términos ni exige su pantalla. La aceptación
  del checkbox es obligatoria; no se inventa contenido legal ni una ruta ajena al alcance.
- Se conserva la política existente de contraseña de 8–128 caracteres y correo hasta 254.
  El nombre completo admite de 1 a 80 caracteres después de quitar espacios periféricos,
  compatible con `DemoAccount.displayName`; no se impone un número arbitrario de apellidos.
- La captura del PDF se usa como referencia si el frame no puede leerse mediante MCP. Esa
  alternativa no equivale a una extracción de medidas o tokens de Figma.

## Escenarios de usuario y aceptación

### REG-US1 — Crear una cuenta válida (P1)

Como visitante quiero registrar mi nombre completo, correo y contraseña, aceptar los términos
y volver al login con una confirmación para poder iniciar sesión.

**Valor**: es el flujo principal solicitado en el taller.

**Prueba independiente**: abrir `/register`, completar el formulario con datos ficticios y
aceptar términos; después de crear la cuenta, comprobar `/login`, el mensaje y el acceso.

1. **REG-US1-1**: Dado el formulario vacío, cuando lo abro, veo nombre completo, correo,
   contraseña, confirmación, términos y el botón “Crear cuenta”.
2. **REG-US1-2**: Dados valores válidos y términos aceptados, cuando pulso “Crear cuenta”, se
   procesa una única solicitud y se muestra un estado ocupado mientras termina.
3. **REG-US1-3**: Dado un registro exitoso, cuando termina la operación, la ruta es `/login`
   y aparece una confirmación perceptible de creación de cuenta, sin contraseña ni otros
   datos sensibles en la URL.
4. **REG-US1-4**: Dada la cuenta creada, cuando inicio sesión con esas credenciales en la
   misma pestaña, veo la bienvenida con el nombre registrado.

### REG-US2 — Corregir datos antes de enviar (P1)

Como visitante quiero mensajes claros junto a cada campo inválido para corregir mis datos sin
crear una cuenta incompleta.

**Prueba independiente**: enviar combinaciones inválidas usando un doble del caso de uso y
comprobar que ninguna llega al puerto de registro.

1. **REG-US2-1**: Dado el formulario vacío, cuando intento enviarlo, aparecen errores para
   todos los campos obligatorios y términos; el foco identifica el primer campo inválido.
2. **REG-US2-2**: Dado un correo sin formato válido, una contraseña de menos de 8 caracteres,
   o una confirmación diferente, cuando intento enviar, veo el error correspondiente y no se
   solicita la creación de cuenta.
3. **REG-US2-3**: Dados todos los campos válidos y los términos sin aceptar, cuando intento
   enviar, veo el error de aceptación y no se crea la cuenta.
4. **REG-US2-4**: Dado un error corregible, cuando actualizo el dato y vuelvo a enviar,
   desaparece el error resuelto y el formulario puede continuar.
5. **REG-US2-5**: Dado un correo ya registrado, cuando lo envío con otros datos válidos, veo
   un error comprensible; no se sobrescribe la cuenta existente.
6. **REG-US2-6**: Dado un fallo inesperado, cuando envío datos válidos, veo un error genérico
   de registro y puedo reintentar sin exponer detalles internos.

### REG-US3 — Navegar y usar la pantalla en distintos dispositivos (P2)

Como visitante quiero una pantalla coherente con KynWallet, adaptable y accesible, con acceso
al login y avisos claros para los proveedores sociales.

**Prueba independiente**: renderizar la pantalla, activar sus enlaces y proveedores; revisar
la distribución a 1440 px y 375 px, y completar el formulario con teclado.

1. **REG-US3-1**: Dado un escritorio, cuando abro registro, veo dos paneles: marca y mensaje
   a la izquierda, formulario a la derecha, siguiendo el frame 04 Registro.
2. **REG-US3-2**: Dada una pantalla móvil, cuando abro registro, veo solo el formulario, con
   todos sus controles utilizables y sin desplazamiento horizontal desde 320 px.
3. **REG-US3-3**: Cuando activo “Google” o “Apple”, se ejecuta `window.alert('Próximamente')`
   y no se envía el formulario.
4. **REG-US3-4**: Cuando activo “Inicia sesión”, navego a `/login`; desde el enlace de registro
   del login puedo volver a `/register`.
5. **REG-US3-5**: Al operar con teclado, cada campo tiene etiqueta, el foco es visible, los
   errores se asocian con su campo y la confirmación de registro se anuncia.

## Requisitos funcionales

| ID         | Requisito verificable                                                                                                    | Origen                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| REG-FR-001 | Ofrecer registro en `/register` y navegación desde el login existente.                                                   | Taller: navegación                     |
| REG-FR-002 | Mostrar campos de nombre completo, correo, contraseña y confirmación.                                                    | Taller: formulario                     |
| REG-FR-003 | Mostrar checkbox de aceptación de términos y condiciones, inicialmente desmarcado.                                       | Taller: formulario                     |
| REG-FR-004 | Incluir “Crear cuenta”, Google, Apple y “Inicia sesión”.                                                                 | Taller: acciones                       |
| REG-FR-005 | Validar todos los campos y aceptación antes de invocar la creación de cuenta; un formulario inválido no llega al puerto. | Taller: validaciones                   |
| REG-FR-006 | Exigir nombre no vacío tras trim, correo, contraseña y confirmación.                                                     | Taller: obligatorios                   |
| REG-FR-007 | Validar formato del correo usando la regla compartida con login; normalizar trim y minúsculas antes de comparar.         | Taller: correo válido; compatibilidad  |
| REG-FR-008 | Exigir contraseña de al menos 8 caracteres; conservar máximo de 128 y sin recortarla.                                    | Taller: contraseña; política existente |
| REG-FR-009 | Exigir que confirmación coincida exactamente con contraseña.                                                             | Taller: coincidencia                   |
| REG-FR-010 | Impedir crear cuenta sin aceptar términos.                                                                               | Taller: aceptación obligatoria         |
| REG-FR-011 | Mostrar errores claros junto a los campos correspondientes y permitir corregirlos.                                       | Taller: mensajes claros                |
| REG-FR-012 | Tras éxito, redirigir a `/login` y mostrar una confirmación de registro perceptible.                                     | Taller: flujo exitoso                  |
| REG-FR-013 | En Google y Apple ejecutar `window.alert('Próximamente')`.                                                               | Taller: proveedores sociales           |
| REG-FR-014 | El enlace “Inicia sesión” lleva a `/login`.                                                                              | Taller: navegación                     |
| REG-FR-015 | Mostrar dos paneles en escritorio y solo formulario en móvil.                                                            | Taller: responsive                     |
| REG-FR-016 | Reutilizar el estilo de KynWallet y los textos del frame 04 Registro.                                                    | Taller: Figma                          |
| REG-FR-017 | Evitar solicitudes duplicadas durante el envío e indicar progreso.                                                       | Robustez del flujo                     |
| REG-FR-018 | Permitir login de la cuenta creada durante la vida de la página; rechazar correos duplicados sin sobrescribir cuentas.   | Demo funcional coherente               |
| REG-FR-019 | Mantener datos de registro solo en memoria, nunca en logs, URL o almacenamiento persistente.                             | Constitución V                         |
| REG-FR-020 | Etiquetas, teclado, foco visible, errores asociados y anuncio de resultado compatibles con WCAG 2.1 AA.                  | Constitución 8.4                       |
| REG-FR-021 | Ante fallo de registro mostrar un error genérico y permitir reintentar.                                                  | Constitución 5.5                       |
| REG-FR-022 | Conservar autenticación, bienvenida y cierre de sesión existentes.                                                       | Compatibilidad con feature 001         |

### Casos límite

- Nombre de solo espacios; nombre mayor de 80 caracteres; correo mayor de 254.
- Contraseñas de 7, 8, 128 y 129 caracteres; espacios significativos en contraseña.
- Confirmación vacía o que difiere solo en mayúsculas, acentos o espacios.
- Correo duplicado con espacios periféricos o diferencias de mayúsculas.
- Doble clic, Enter repetido, cambio de ruta durante envío y fallo del adaptador.
- Recarga tras crear cuenta: se pierde la cuenta y el mensaje transitorio, según el alcance demo.
- Configuración de cuentas de login ausente: el registro debe poder usarse sin credenciales
  preconfiguradas; las cuentas nuevas pertenecen a la instancia en memoria de esta página.

## Entidades principales

- **Datos de registro**: nombre completo, correo, contraseña, confirmación y aceptación de
  términos, usados para validar una solicitud.
- **Cuenta demo**: correo normalizado, contraseña y nombre para el login en memoria.
- **Resultado de registro**: éxito, correo duplicado o servicio temporalmente no disponible.
- **Errores de campo**: mensajes indexados por el campo de registro que requiere corrección.

## Criterios de éxito

- **REG-SC-001**: todos los escenarios de validación impiden invocar el puerto cuando hay
  errores y tienen al menos una prueba automatizada trazable.
- **REG-SC-002**: una cuenta válida termina en `/login` con confirmación y permite iniciar
  sesión en la misma instancia de la aplicación.
- **REG-SC-003**: a 1440 px hay dos paneles; a 375 px solo formulario; desde 320 px no hay
  desplazamiento horizontal ni controles inaccesibles.
- **REG-SC-004**: Google y Apple muestran el aviso exacto; los enlaces resuelven las rutas
  especificadas; el login previo mantiene sus pruebas.
- **REG-SC-005**: las pruebas automatizadas de accesibilidad no detectan infracciones en
  formulario inicial y con errores, y la revisión de teclado y visual no encuentra bloqueos.
- **REG-SC-006**: se registran los resultados reales de construcción, pruebas y controles en
  `tasks.md`; no se atribuyen verificaciones a herramientas que no estuvieron disponibles.

## Trazabilidad

| Requisitos                         | Historia    | Pruebas y revisión                                                     |
| ---------------------------------- | ----------- | ---------------------------------------------------------------------- |
| REG-FR-006–010                     | REG-US2     | `src/domain/registrationValidation.test.ts`                            |
| REG-FR-005, 019, 021               | REG-US1/2   | `src/application/registerAccount.test.ts`                              |
| REG-FR-007, 018                    | REG-US1/2   | `src/infrastructure/InMemoryAuthGateway.test.ts`                       |
| REG-FR-002–004, 011, 013, 017, 020 | REG-US1/2/3 | `src/ui/features/register/RegisterForm.test.tsx`                       |
| REG-FR-001, 012, 014, 022          | REG-US1/3   | `src/App.test.tsx` y regresión de login                                |
| REG-FR-015, 016, 020               | REG-US3     | Prueba de accesibilidad y revisión visual/teclado a 1440, 375 y 320 px |

Los módulos de esta tabla coinciden con la implementación revisada. La evidencia real de
196 pruebas aprobadas, cobertura, controles globales y revisión responsive/visual se registra
en `tasks.md`. No se sustituye la revisión humana previa a integrar.
