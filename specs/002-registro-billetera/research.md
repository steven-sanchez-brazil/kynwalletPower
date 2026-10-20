# Research: Pantalla de Registro de Billetera Virtual (KynWallet)

**Feature**: `002-registro-billetera` | **Date**: 2026-10-20 (Actualizado)

Este documento consolida las decisiones técnicas, patrones arquitectónicos y resolución de incógnitas para la implementación de la pantalla de registro de KynWallet, con foco específico en las opciones sociales ("Próximamente") y el flujo de redirección al login con mensaje de registro exitoso.

---

## R1. Stack tecnológico y compatibilidad

- **Decisión**: React 19 + TypeScript 5.x (modo `strict`) + Vite 8, ejecutado sobre Node.js $\ge$ 20 LTS.
- **Justificación**: Es el stack unificado del proyecto y solicitado por el usuario. Permite compilación ultrarrápida, tipado estricto de contratos entre capas (Principio III) y compatibilidad directa con los componentes reutilizables ya construidos en `specs/001-login-billetera`.
- **Alternativas consideradas**:
  - *Next.js / Remix*: Descartados por requerir SSR y enrutamiento complejo innecesario para una SPA ligera solo frontend (viola YAGNI).
  - *React Hook Form + Zod*: Descartados por añadir dependencias externas prescindibles; un reducer puro con funciones de validación de dominio cubre el 100% de las necesidades con cero dependencias (KISS/YAGNI).

---

## R2. Tokens de diseño de Figma y fidelidad visual (Nodo 31:2)

- **Decisión**: Utilizar CSS Modules por componente y reutilizar el sistema de tokens existente en `src/ui/styles/tokens.css`, derivado del archivo Figma `f7uDsv8sh6ZOtK2OitTqtg` (frame `02 · Registro`, nodo `31:2`).
- **Tokens y dimensiones extraídas**:
  - `--neutral-0` (`#ffffff`): Fondo de inputs y del panel de formulario.
  - `--neutral-300` (`#d7d9e6`): Bordes de campos y divisores.
  - `--neutral-400` (`#a9abc2`): Placeholder.
  - `--neutral-500` (`#8a8ca8`): Textos secundarios y leyendas.
  - `--neutral-700` (`#3d3f5c`): Etiquetas de campos.
  - `--neutral-900` (`#16182c`): Título "Crea tu cuenta" y texto de botones sociales.
  - `--brand-500` (`#ff6b3d`): Identidad visual de marca.
  - `--brand-600` (`#ef5226`): Enlaces interactivos.
  - Panel de marca: degradado `linear-gradient(121.19deg, #ff8a65 0%, #ef5226 70.71%)`, tarjeta ilustrativa con radio de 22px y bordes traslúcidos.
  - Dimensiones de controles: altura de inputs y botón principal en 52px; botones sociales en 48px; radios de borde en 12px; ancho máximo del contenedor de formulario en 400px–420px.
- **Justificación**: Máxima consistencia visual, DRY (fuente única de estilos) y fidelidad pixel-perfect con el prototipo de Figma.

---

## R3. Accesibilidad y contraste de color (WCAG 2.1 AA)

- **Decisión**: Mantener los tokens accesibles derivados definidos en `tokens.css`:
  - `--brand-700: #d04721` (ratio 4.56:1 sobre blanco): Aplicado al botón principal "Crear cuenta" y enlaces activos.
  - `--neutral-600: #73748b` (ratio 4.57:1 sobre blanco): Textos secundarios y placeholders legibles.
  - `--neutral-border: #92949c` (ratio 3.03:1 sobre blanco): Bordes de controles interactivos (WCAG 1.4.11).
  - `--danger-600: #c62828` (ratio 5.62:1 sobre blanco): Mensajes de error inline.
- **Justificación**: La Constitución del proyecto (Regla 8.4) establece el cumplimiento de WCAG 2.1 AA como OBLIGATORIO. El ajuste de luminosidad conserva el matiz cromático exacto del diseño de Figma al tiempo que garantiza el cumplimiento normativo.

---

## R4. Persistencia y reutilización del registro simulado para el login

- **Problema**: El usuario requiere: *"Implementa un registro simulado ficticio, el cual debe poder reutilizarse para la pantalla de login, sin consumir APIs externas"*.
- **Decisión**: Implementar un almacén de cuentas en memoria con soporte de sesión (`AccountStore` o repositorio en memoria compartido) que alimenta tanto al caso de uso de autenticación (`InMemoryAuthGateway`) como al caso de uso de registro (`InMemoryRegistrationGateway`).
  - Al iniciar la aplicación, el almacén se inicializa con las cuentas de demostración base (definidas en configuración externa `.env.local` / `VITE_DEMO_USERS` conforme a la Constitución 5.3).
  - Al completar un registro exitoso, la nueva cuenta creada (`{ email, password, displayName }`) se incorpora dinámicamente al almacén en memoria.
  - Cuando el usuario es redirigido a la pantalla de login, `InMemoryAuthGateway` consulta el mismo almacén, permitiendo iniciar sesión inmediatamente con el correo y contraseña recién registrados.
- **Justificación**: Resuelve el requerimiento funcional de extremo a extremo sin recurrir a backend ni servicios externos, preservando la separación de capas de Clean Architecture (Principio III) y facilitando pruebas unitarias aisladas.

---

## R5. Alerta para botones de registro social (Google y Apple) ("Próximamente")

- **Problema**: Requisito explícito: *"Los Botones de registro con Google y Apple que muestren un alert que diga 'Próximamente'"*.
- **Decisión**:
  - Al pulsar cualquiera de los botones de autenticación social ("Continuar con Google" o "Continuar con Apple"), se dispara una notificación de tipo Alert visible y accesible (`<Alert tone="info" role="alert">` o `role="status"`) que presenta exactamente el texto `"Próximamente"`.
  - **Preservación de formulario**: La activación del alert social no recarga la página, no envía el formulario ni altera ni borra los datos ya ingresados en los campos de texto o la casilla de términos.
  - **Desaparición no intrusiva**: El alert se muestra en el área inferior de los botones sociales y se retira limpiamente cuando el usuario continúa interactuando con los campos del formulario.
  - **Por qué componente `<Alert>` y no `window.alert()`**:
    - `window.alert()` es bloqueante, no personalizable visualmente, degrada severamente la experiencia de usuario en móviles y navegadores modernos, y genera dificultades en pruebas automatizadas de accesibilidad (WCAG 2.1 AA, Constitución 8.4).
    - El componente `Alert` integrado cumple con atributos semánticos de accesibilidad (`role="alert"` o `role="status"` y región en vivo para lectores de pantalla), respetando los tokens visuales del sistema de diseño KynWallet.
- **Justificación**: Cumple con la especificación de diseño y accesibilidad WCAG 2.1 AA sin romper el flujo del usuario.

---

## R6. Redirección al login con mensaje de registro exitoso

- **Problema**: Requisito explícito: *"Si todas las validaciones son exitosas, y el registro es exitoso, debe redirigir al login con el mensaje de registro exitoso"*.
- **Decisión**:
  - Tras verificar que todas las validaciones de los campos son conformes y tras recibir confirmación exitosa del caso de uso `register`, la aplicación debe transicionar a la pantalla de inicio de sesión (`login`) transportando el mensaje de éxito.
  - **Mecanismo de traspaso en la SPA (`App.tsx`)**:
    - `App.tsx` mantiene el estado de navegación (`view: 'login' | 'register'`), el correo registrado (`prefilledEmail`) y el mensaje informativo de éxito de registro (`registrationSuccessNotice: string | null`).
    - Al dispararse `onSuccess({ email, displayName })` desde `RegisterForm`, `App.tsx`:
      1. Establece `prefilledEmail = email`.
      2. Establece `registrationSuccessNotice = MESSAGES.REGISTRATION_SUCCESS` (o `"¡Registro exitoso! Ya puedes iniciar sesión con tu nueva cuenta"`).
      3. Cambia la vista activa a `'login'`.
  - **Renderizado en `LoginForm`**:
    - `LoginForm` recibe la propiedad opcional `registrationSuccessNotice?: string`.
    - Cuando `registrationSuccessNotice` está presente, `LoginForm` renderiza de forma prioritaria en la parte superior del formulario una alerta accesible (`<Alert tone="info" role="status">` o `role="alert"`) indicando el éxito del registro.
    - El campo de correo electrónico ya aparece pre-cargado con el correo registrado, permitiendo al usuario ingresar inmediatamente su contraseña y pulsar "Iniciar sesión".
    - El mensaje se limpia si el usuario envía el login o tras una acción de reseteo.
- **Justificación**: Satisface plenamente el requisito del usuario de proporcionar feedback claro e inequívoco en la pantalla de destino (login), garantizando que el usuario sepa que su cuenta está lista para ser utilizada.

---

## R7. Gestión de estado del formulario de registro (`useRegisterForm`)

- **Decisión**: Crear un hook especializado `useRegisterForm` basado en `useReducer` (`registerReducer`), con una máquina de estados determinista y validaciones puras del dominio.
- **Estructura del estado**:
  ```ts
  type RegisterFormState = {
    values: {
      fullName: string;
      email: string;
      password: string;
      confirmPassword: string;
      termsAccepted: boolean;
    };
    errors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      termsAccepted?: string;
      global?: string;
    };
    touched: {
      fullName: boolean;
      email: boolean;
      password: boolean;
      confirmPassword: boolean;
      termsAccepted: boolean;
    };
    status: 'idle' | 'submitting' | 'success';
    socialNotice: string | null;
    isPasswordVisible: boolean;
    isConfirmPasswordVisible: boolean;
  };
  ```
- **Justificación**: Arquitectura simple, predecible y 100% testeable sin renderizar componentes de React.

---

## R8. Reglas de validación y mensajes del dominio

- **Decisión**: Centralizar las validaciones como funciones puras en `src/domain/validation.ts` y los textos en `src/domain/messages.ts`.
- **Reglas**:
  - `fullName`: Obligatorio. Longitud entre 2 y 100 caracteres. Mensaje: `"Ingresa tu nombre completo"`.
  - `email`: Obligatorio. Formato válido según regex `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`. Longitud $\le 254$. Normalizado con trim y minúsculas. Mensaje: `"Ingresa tu correo electrónico"` o `"Ingresa un correo electrónico válido"`.
  - `password`: Obligatorio. Longitud $\ge 8$ y $\le 128$. Mensaje: `"Ingresa tu contraseña"` o `"La contraseña debe tener al menos 8 caracteres"`.
  - `confirmPassword`: Obligatorio. Debe coincidir exactamente con `password`. Mensaje: `"Confirma tu contraseña"` o `"Las contraseñas no coinciden"`.
  - `termsAccepted`: Obligatorio (debe ser `true`). Mensaje: `"Debes aceptar los términos y condiciones"`.
- **Justificación**: Cumple estrictamente con el Principio IV (DRY) y Principio I (TDD), permitiendo pruebas unitarias exhaustivas del dominio con cobertura del 100%.

---

## R9. Adaptación responsiva (Desktop vs. Mobile)

- **Decisión**:
  - En escritorio ($\ge 1024$px): Layout de dos columnas. Columna izquierda: `BrandPanel` con identidad KynWallet (logo, titular, tarjeta ilustrativa). Columna derecha: formulario centrado.
  - En tablet y móvil ($< 768$px): Se oculta el `BrandPanel` y se despliega exclusivamente el formulario de registro ocupando el ancho disponible con padding lateral de 16px–24px, garantizando 0 scroll horizontal desde 320px de ancho.
- **Justificación**: Satisface con precisión el requerimiento del usuario y los criterios SC-006 / FR-016 de la especificación.

---

## R10. Estrategia de pruebas y calidad

- **Decisión**:
  - Pruebas unitarias de dominio (`validation.test.ts`, `messages.ts`).
  - Pruebas unitarias de aplicación e infraestructura (`register.test.ts`, `InMemoryAccountStore.test.ts`).
  - Pruebas unitarias de reducer y hooks (`registerReducer.test.ts`).
  - Pruebas de integración de componentes (`RegisterForm.test.tsx`, `RegisterScreen.test.tsx`, `App.test.tsx`, `LoginForm.test.tsx`).
  - Pruebas específicas para los dos requisitos clave:
    1. Clic en botones Google y Apple muestra la alerta con "Próximamente" sin modificar el formulario.
    2. Envío exitoso con validaciones correctas redirige al Login y en el Login se visualiza la alerta con el mensaje de registro exitoso.
  - Pruebas de accesibilidad automatizada con `axe-core`.
  - Umbral de cobertura global $\ge 80\%$.
- **Justificación**: Garantiza cumplimiento estricto del Principio I (TDD) y Regla 8.1 de la Constitución.
