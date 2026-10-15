# Feature Specification: Registro de Usuarios de KynWallet

**Feature Branch**: `feature/registro-juan-zorrilla`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Construir la pantalla de Registro de Usuarios de KynWallet aplicando
Spec Driven Development y usando el diseño de Figma como referencia (frame `04 · Registro`,
https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=31-2).
Requisitos: 1) formulario con nombre completo, correo electrónico, contraseña y confirmar
contraseña; 2) checkbox de aceptación de términos y condiciones; 3) botón 'Crear cuenta' que
valide todos los campos antes de enviar; 4) botones de Google y Apple que muestren alert
'Próximamente'; 5) link '¿Ya tienes cuenta? Inicia sesión' que lleve a /login; 6) registro
exitoso → redirige a /login con mensaje de éxito; 7) validaciones inline: correo válido,
contraseña mínimo 8 caracteres, contraseñas coinciden, todos los campos obligatorios;
8) responsive: desktop (2 paneles) y mobile (solo formulario)."

**Diseño de referencia**: Figma, frame `04 · Registro` (nodo `31:2`). Panel de marca (logo
KynWallet, titular "Comienza tu camino financiero.", texto de apoyo y tarjeta ilustrativa) y panel
de formulario ("Crea tu cuenta", "Completa tus datos para comenzar", campos Nombre completo,
Correo electrónico, Contraseña y Confirmar contraseña con control de visibilidad, casilla "Acepto
los términos y condiciones", botón "Crear cuenta", separador "o regístrate con", botones Google y
Apple, y "¿Ya tienes cuenta? Inicia sesión").

## Clarifications

### Session 2026-10-15

- Q: ¿Qué reglas aplica la contraseña del registro? → A: Las del taller y las del login (001):
  obligatoria y de 8 a 128 caracteres, sin reglas de complejidad adicionales.
- Q: ¿Dónde se guardan las cuentas creadas? → A: En memoria, junto con las cuentas de
  demostración. Se puede iniciar sesión con ellas hasta recargar la página.
- Q: ¿Cómo se muestra el aviso de Google y Apple? → A: Con un `alert` del navegador con el texto
  "Próximamente", tal como pide el taller.
- Q: ¿Cuál es la ruta del registro? → A: `/registro`. El inicio de sesión está en `/login` y
  cualquier otra ruta redirige a `/login`.
- Q: ¿Qué hace "términos y condiciones"? → A: Es parte del texto de la casilla, resaltado como
  en el diseño. No existe una página de términos en esta demostración.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear una cuenta (Priority: P1)

Como persona interesada en KynWallet, quiero registrarme con mi nombre, correo y contraseña, para
tener una cuenta con la que pueda iniciar sesión.

**Why this priority**: es el propósito de la pantalla; sin este flujo no hay registro.

**Independent Test**: se abre `/registro`, se completan los cuatro campos con datos válidos, se
acepta los términos, se presiona "Crear cuenta" y se verifica que la aplicación pasa a `/login`
con el mensaje de éxito; luego se inicia sesión con la cuenta nueva.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro con datos válidos y los términos aceptados, **When** el
   usuario presiona "Crear cuenta", **Then** la aplicación navega a `/login` y muestra el mensaje
   "Cuenta creada correctamente. Ya puedes iniciar sesión."
2. **Given** el registro en curso, **When** el sistema procesa la solicitud, **Then** el botón
   muestra "Creando cuenta…", queda deshabilitado y no admite envíos adicionales.
3. **Given** una cuenta recién creada, **When** el usuario inicia sesión en `/login` con ese
   correo y esa contraseña, **Then** ve la bienvenida con su nombre completo.
4. **Given** el usuario escribió el correo con mayúsculas o espacios periféricos, **When** se
   registra, **Then** la cuenta se guarda con el correo normalizado (sin espacios y en
   minúsculas) y el nombre sin espacios periféricos.
5. **Given** el mensaje de éxito en `/login`, **When** el usuario envía el formulario de inicio de
   sesión, **Then** el mensaje desaparece.

---

### User Story 2 - Corregir los datos antes de enviar (Priority: P1)

Como usuario, quiero saber qué dato falta o está mal en cuanto lo ingreso, para corregirlo antes
de crear la cuenta.

**Why this priority**: el taller exige validaciones inline y que "Crear cuenta" valide todos los
campos; evita cuentas con datos inválidos.

**Independent Test**: se envía el formulario vacío y luego con datos inválidos, y se verifican
los mensajes junto a cada campo y que no se crea la cuenta.

**Acceptance Scenarios**:

1. **Given** el formulario vacío, **When** el usuario presiona "Crear cuenta", **Then** se
   muestran "Ingresa tu nombre completo", "Ingresa tu correo electrónico", "Ingresa tu
   contraseña", "Confirma tu contraseña" y "Debes aceptar los términos y condiciones", no se crea
   la cuenta y el foco pasa al primer campo con error.
2. **Given** un correo sin formato válido (por ejemplo, "usuario@" o "usuario.com"), **When** el
   usuario sale del campo, **Then** se muestra "Ingresa un correo electrónico válido".
3. **Given** una contraseña de menos de 8 caracteres, **When** el usuario sale del campo, **Then**
   se muestra "La contraseña debe tener al menos 8 caracteres".
4. **Given** una confirmación distinta de la contraseña, **When** el usuario sale del campo de
   confirmación, **Then** se muestra "Las contraseñas no coinciden".
5. **Given** el error "Las contraseñas no coinciden", **When** el usuario corrige la contraseña o
   la confirmación para que coincidan, **Then** el error desaparece.
6. **Given** un campo con error, **When** el usuario corrige el valor, **Then** el mensaje de ese
   campo desaparece.
7. **Given** el usuario no aceptó los términos, **When** presiona "Crear cuenta", **Then** se
   muestra "Debes aceptar los términos y condiciones" y la cuenta no se crea; al marcar la
   casilla, el mensaje desaparece.

---

### User Story 3 - Evitar correos repetidos (Priority: P2)

Como usuario, quiero saber si mi correo ya tiene una cuenta, para iniciar sesión en lugar de
registrarme otra vez.

**Why this priority**: protege la unicidad de las cuentas; el flujo principal funciona sin este
caso.

**Independent Test**: se intenta registrar el correo de una cuenta existente y se verifica el
mensaje en el campo de correo.

**Acceptance Scenarios**:

1. **Given** un correo que ya tiene cuenta (sin distinguir mayúsculas), **When** el usuario
   presiona "Crear cuenta", **Then** se muestra "Ya existe una cuenta con este correo" junto al
   campo de correo, el foco pasa a ese campo y los demás datos se conservan.
2. **Given** ese error, **When** el usuario modifica el correo, **Then** el mensaje desaparece.

---

### User Story 4 - Navegar entre registro e inicio de sesión (Priority: P2)

Como usuario, quiero pasar del registro al inicio de sesión y viceversa, para usar la pantalla
que necesito.

**Why this priority**: el taller exige el link a `/login`; conecta las dos pantallas.

**Independent Test**: se navega con los enlaces y con los botones atrás y adelante del navegador,
verificando la URL y la pantalla.

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario presiona "Inicia sesión", **Then** la
   URL cambia a `/login` y se muestra el inicio de sesión.
2. **Given** la pantalla de inicio de sesión, **When** el usuario presiona "Regístrate", **Then**
   la URL cambia a `/registro` y se muestra el registro.
3. **Given** el usuario abre directamente `/registro` o `/login`, **When** carga la página,
   **Then** ve la pantalla correspondiente; cualquier otra ruta lo lleva a `/login`.
4. **Given** el usuario navegó entre pantallas, **When** usa atrás o adelante del navegador,
   **Then** la pantalla corresponde a la URL.
5. **Given** se muestra el registro, **When** carga la pantalla, **Then** el título de la pestaña
   es "KynWallet · Crear cuenta" y el foco está en "Nombre completo" si se llegó navegando
   dentro de la aplicación.

---

### User Story 5 - Acceso con Google y Apple (Priority: P3)

Como usuario, quiero que los botones de Google y Apple me indiquen que llegarán pronto, para no
pensar que la pantalla falló.

**Why this priority**: fidelidad al diseño sin ampliar el alcance (YAGNI).

**Independent Test**: se presiona cada botón y se verifica el `alert` "Próximamente".

**Acceptance Scenarios**:

1. **Given** la pantalla de registro, **When** el usuario presiona "Google" o "Apple", **Then** se
   muestra un `alert` con el texto "Próximamente" y los datos ingresados se conservan.

---

### Edge Cases

- El usuario presiona "Crear cuenta" varias veces seguidas: solo se procesa un registro.
- Nombre o correo con espacios al inicio o al final: se ignoran al validar y al guardar.
- Nombre de solo espacios: equivale a vacío.
- La contraseña y la confirmación se comparan exactamente, con espacios incluidos.
- Textos que exceden los límites (nombre > 80, correo > 254, contraseña > 128 caracteres): se
  rechazan con mensaje de validación.
- Salir de un campo vacío que no tenía error no muestra el error de obligatorio; el error aparece
  al enviar. Así, hacer clic en "Inicia sesión" tras pasar por un campo vacío no mueve el enlace
  y el clic no se pierde.
- La configuración de cuentas de demostración no está disponible: el registro muestra "No pudimos
  crear tu cuenta. Intenta más tarde." sin detalles internos (igual que el login de 001).
- El usuario recarga la página después de registrarse: las cuentas creadas se pierden (no hay
  persistencia).
- Ventana estrecha (móvil): solo el formulario y el logo, sin desplazamiento horizontal desde
  320 px.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La pantalla DEBE reproducir la estructura, textos, colores, tipografía y jerarquía
  visual del frame `04 · Registro` de Figma, con los ajustes de contraste de 001 (research R3).
- **FR-002**: El formulario DEBE tener los campos Nombre completo, Correo electrónico, Contraseña
  y Confirmar contraseña, y la casilla "Acepto los términos y condiciones".
- **FR-003**: El nombre completo DEBE ser obligatorio y tener como máximo 80 caracteres tras
  quitar los espacios periféricos.
- **FR-004**: El correo DEBE ser obligatorio, tener formato válido y como máximo 254 caracteres
  (mismas reglas que el login de 001).
- **FR-005**: La contraseña DEBE ser obligatoria y tener entre 8 y 128 caracteres (mismas reglas
  que el login de 001).
- **FR-006**: La confirmación DEBE ser obligatoria y coincidir exactamente con la contraseña.
- **FR-007**: Los términos y condiciones DEBEN aceptarse para crear la cuenta.
- **FR-008**: Los errores DEBEN mostrarse junto al campo al salir de él (si tiene contenido o ya
  mostraba un error) y al presionar "Crear cuenta", y DEBEN ocultarse cuando el valor se corrija.
- **FR-009**: "Crear cuenta" DEBE validar todos los campos; con errores NO DEBE crear la cuenta y
  DEBE mover el foco al primer campo con error.
- **FR-010**: El registro DEBE simularse en memoria (sin backend ni base de datos), con una espera
  breve (aprox. 1 segundo) e indicador de carga, sin permitir envíos duplicados.
- **FR-011**: Un correo que ya tiene cuenta DEBE rechazarse con "Ya existe una cuenta con este
  correo" junto al campo de correo.
- **FR-012**: Tras un registro exitoso, la aplicación DEBE navegar a `/login` y mostrar "Cuenta
  creada correctamente. Ya puedes iniciar sesión."; la cuenta creada DEBE permitir iniciar sesión
  durante la sesión del navegador.
- **FR-013**: "Inicia sesión" DEBE llevar a `/login`, y "Regístrate" en el login DEBE llevar a
  `/registro`. Las rutas DEBEN funcionar al abrirse directamente y con atrás/adelante del
  navegador; cualquier otra ruta DEBE redirigir a `/login`.
- **FR-014**: Los botones Google y Apple del registro DEBEN mostrar un `alert` con el texto
  "Próximamente".
- **FR-015**: Los campos de contraseña DEBEN ocultar los caracteres por defecto y ofrecer el
  control accesible de visibilidad de 001.
- **FR-016**: La pantalla DEBE mostrar dos paneles (marca y formulario) desde 960 px y solo el
  formulario con el logo en anchos menores, sin desplazamiento horizontal desde 320 px.
- **FR-017**: La pantalla DEBE cumplir WCAG 2.1 AA: etiquetas asociadas, errores vinculados con
  `aria-describedby` y `aria-invalid`, mensajes de resultado anunciados, operación completa por
  teclado, foco visible y un título de pestaña por pantalla.
- **FR-018**: La contraseña NO DEBE mostrarse ni registrarse en mensajes, registros de
  diagnóstico, URL ni almacenamiento del navegador.
- **FR-019**: Los errores inesperados DEBEN mostrarse con "No pudimos crear tu cuenta. Intenta
  más tarde.", sin detalles técnicos.

### Key Entities

- **Solicitud de registro**: datos del formulario: nombre completo, correo, contraseña,
  confirmación y aceptación de términos. No se persiste.
- **Cuenta de demostración** (de 001): correo (único, sin distinguir mayúsculas), contraseña y
  nombre del titular. El registro agrega una cuenta con el nombre completo como nombre del
  titular.
- **Resultado del registro**: cuenta creada, correo ya registrado o servicio no disponible.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario completa el registro en menos de 60 segundos desde que ve la pantalla.
- **SC-002**: El resultado del registro (navegación a `/login` o error) aparece en un máximo de
  2 segundos tras presionar "Crear cuenta".
- **SC-003**: El 100 % de los escenarios de aceptación de las historias P1 y P2 se verifican con
  pruebas automatizadas que pasan.
- **SC-004**: La auditoría automatizada de accesibilidad no reporta incumplimientos WCAG 2.1 AA y
  el flujo se completa solo con teclado.
- **SC-005**: La revisión visual frente al frame de Figma no detecta diferencias en textos, orden
  de elementos ni jerarquía visual, en 1440 px y en 375 px.
- **SC-006**: `npm run verify` termina sin errores y la cobertura global es ≥ 80 %.

## Assumptions

- La demostración sigue siendo solo del lado del cliente; las cuentas creadas viven en memoria
  junto con las de `VITE_DEMO_USERS` y se pierden al recargar.
- El nombre completo se usa como nombre del titular en la bienvenida de 001.
- Mostrar "Ya existe una cuenta con este correo" revela que el correo existe. Se acepta en el
  registro porque es el comportamiento esperado por el usuario; el login de 001 mantiene su
  mensaje genérico.
- Los botones Google y Apple del login (001) mantienen su aviso actual; el `alert` "Próximamente"
  aplica a la pantalla de registro, que es la que pide el taller.
- "términos y condiciones" no enlaza a ninguna página; el texto se resalta según el diseño.
- No existen BRD ni ARD para esta funcionalidad (Constitución, Principio VI).
- El diseño de referencia es de escritorio (1440 × 1024); la versión móvil se deriva del mismo
  diseño, como en 001.
