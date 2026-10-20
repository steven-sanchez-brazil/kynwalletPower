# UI Contract: Pantalla de Registro de KynWallet

**Feature**: `002-registro-billetera` | **Date**: 2026-10-20 (Actualizado)

Este contrato define la interfaz de usuario observable, los elementos de formulario, estados visuales, interacción de alertas sociales ("Próximamente"), redirección al login con mensaje de éxito, y requisitos de accesibilidad conforme a WCAG 2.1 AA y al prototipo de Figma (`02 · Registro`, nodo `31:2`).

---

## 1. Disposición y Jerarquía Visual

### 1.1. Escritorio ($\ge 1024$px)
- **Estructura**: Dos columnas con altura mínima del 100% de la ventana (`min-height: 100vh`).
  - **Panel Izquierdo (`BrandPanel`)**: Ancho 620px (o 43% en pantallas intermedias). Fondo con degradado de marca `var(--brand-gradient)`. Contiene el isotipo/logotipo de KynWallet en blanco, el titular "Tu dinero, sin fronteras.", texto de apoyo y la tarjeta ilustrativa traslúcida con chip decorativo.
  - **Panel Derecho**: Contenedor centrado horizontal y verticalmente con ancho máximo de 400px–420px y padding lateral generoso. Contiene el formulario completo de registro.

### 1.2. Dispositivo Móvil / Ventana Estrecha ($< 768$px)
- **Estructura**: Únicamente el panel de formulario centrado, ocupando el 100% del ancho con padding lateral de 16px–24px.
- **Restricción**: Cero barras de desplazamiento horizontal (`overflow-x: hidden`), completamente utilizable desde 320px de ancho.

---

## 2. Elementos del Formulario de Registro

| Elemento | Tipo / Componente | Etiqueta / Texto visible | Rol Accesible / Atributos | Estado y Comportamiento |
|---|---|---|---|---|
| Título principal | `<h1>` | "Crea tu cuenta" | `role="heading"` level 1 | Encabezado principal del panel |
| Subtítulo | `<p>` | "Únete a KynWallet y gestiona tus finanzas." | Texto secundario accesible | Apoyo visual y contextual |
| Nombre completo | `TextField` | "Nombre completo" | `<input type="text">`, `aria-required="true"` | Error debajo: `"Ingresa tu nombre completo"` |
| Correo electrónico | `TextField` | "Correo electrónico" | `<input type="email">`, `aria-required="true"` | Error debajo: `"Ingresa tu correo electrónico"` o `"Ingresa un correo electrónico válido"` |
| Contraseña | `PasswordField` | "Contraseña" | `<input type="password">` con botón de visibilidad | Error debajo: `"Ingresa tu contraseña"` o `"La contraseña debe tener al menos 8 caracteres"` |
| Confirmar contraseña | `PasswordField` | "Confirmar contraseña" | `<input type="password">` con botón de visibilidad | Error debajo: `"Confirma tu contraseña"` o `"Las contraseñas no coinciden"` |
| Términos y condiciones | `Checkbox` | "Acepto los términos y condiciones" | `<input type="checkbox">`, `aria-required="true"` | Error debajo: `"Debes aceptar los términos y condiciones"` |
| Botón principal | `Button` | "Crear cuenta" / "Creando cuenta..." | `<button type="submit">`, `aria-busy="true"` en carga | Valida todos los campos; deshabilitado durante el envío asíncrono |
| Separador | `Divider` | "o continúa con" | Presentacional accesible | Línea divisoria semántica |
| Botón Google | `SocialButton` | "Continuar con Google" | `<button type="button">` | Al hacer clic: muestra un alert con el texto `"Próximamente"` sin afectar los datos del formulario |
| Botón Apple | `SocialButton` | "Continuar con Apple" | `<button type="button">` | Al hacer clic: muestra un alert con el texto `"Próximamente"` sin afectar los datos del formulario |
| Alerta Social | `Alert` | "Próximamente" | `role="alert"` o `role="status"` | Se despliega tras pulsar Google o Apple |
| Enlace de retorno | Enlace / Botón texto | "¿Ya tienes cuenta? Inicia sesión" | `<button type="button">` o `<a>` accesible | Al activar: navega inmediatamente a la pantalla de login |

---

## 3. Estados Observables y Flujos Clave

### 3.1. Alerta de Botones de Registro con Google y Apple
- **Condición**: El usuario hace clic en el botón "Continuar con Google" o en el botón "Continuar con Apple".
- **Comportamiento observable**:
  1. Se despliega de forma inmediata una alerta accesible (`<Alert tone="info">`) con el texto exacto: `"Próximamente"`.
  2. Todos los campos del formulario (`fullName`, `email`, `password`, `confirmPassword`, `termsAccepted`) conservan intactos sus valores.
  3. No se produce recarga ni navegación de página.
  4. La alerta desaparece de manera fluida si el usuario continúa interactuando con otros campos del formulario.

### 3.2. Validación Exitosa, Registro Exitoso y Redirección al Login con Mensaje
- **Condición**: Todos los campos del formulario cumplen las reglas de validación obligatorias, el checkbox de términos está marcado, y el usuario presiona "Crear cuenta" (o presiona Enter).
- **Comportamiento observable**:
  1. El botón "Crear cuenta" cambia su estado a carga con el indicador visual y `aria-busy="true"` ("Creando cuenta..."), bloqueando envíos concurrentes.
  2. Tras completarse la operación asíncrona de registro con éxito, el sistema redirige automáticamente al usuario hacia la pantalla de inicio de sesión (`Login`).
  3. **En la pantalla de Login redirigida**:
     - Se muestra de manera destacada y accesible una alerta de confirmación (`<Alert tone="info" role="status">` o `role="alert"`) con el mensaje de registro exitoso (ej. `"¡Registro exitoso! Ya puedes iniciar sesión con tu nueva cuenta"` o `MESSAGES.REGISTRATION_SUCCESS`).
     - El campo de correo electrónico en el formulario de Login aparece automáticamente pre-completado con el correo registrado (`prefilledEmail`).
     - El foco o cursor queda dispuesto para que el usuario ingrese su contraseña e inicie sesión de inmediato con la cuenta recién creada.

---

## 4. Requisitos de Accesibilidad (WCAG 2.1 Nivel AA)

1. **Etiquetas y Descripciones**:
   - Cada campo interactivo posee un `<label>` explícitamente asociado mediante `htmlFor` e `id`.
   - Los mensajes de error inline están asociados al campo correspondiente mediante `aria-describedby` y el campo refleja su estado con `aria-invalid="true"`.
2. **Alertas Accesibles**:
   - Tanto la alerta `"Próximamente"` como la alerta de registro exitoso en el Login se anuncian apropiadamente a lectores de pantalla mediante roles semánticos (`role="alert"` / `role="status"`).
3. **Navegación por Teclado**:
   - Todo el formulario es operable sin ratón. El orden de tabulación (`Tab` / `Shift+Tab`) sigue la secuencia lógica visual.
   - La tecla `Enter` en cualquier campo de texto ejecuta el envío del formulario.
4. **Foco Visible**:
   - Todos los elementos enfocables exhiben el anillo de foco visible `var(--focus-ring)`.
5. **Contraste de Color**:
   - Todos los textos cumplen un contraste mínimo de 4.5:1 contra el fondo blanco (`--brand-700`, `--neutral-600`, `--neutral-900`, `--danger-600`).
   - Los bordes de inputs cumplen un contraste mínimo de 3.0:1 (`--neutral-border`).
