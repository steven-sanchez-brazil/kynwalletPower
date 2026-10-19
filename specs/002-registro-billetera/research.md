# Research: Pantalla de Registro de KynWallet

**Feature**: `002-registro-billetera` | **Date**: 2026-10-17

Todas las decisiones técnicas, de diseño visual y de cumplimiento constitucional quedan resueltas y documentadas en este artefacto.

## R1. Stack base y reutilización de arquitectura

- **Decision**: Mantener el stack existente del repositorio: React 19 + TypeScript 5.x (`strict: true`) + Vite 8, sobre Node.js ≥ 20 LTS, extendiendo la estructura de Clean Architecture (`src/domain`, `src/application`, `src/infrastructure`, `src/ui`).
- **Rationale**: Garantiza coherencia total con `001-login-billetera`, cumple los Principios II (SOLID), III (Clean Architecture) y IV (DRY/KISS/YAGNI), y no introduce dependencias externas nuevas (Principio 7).
- **Alternatives considered**: Añadir `react-router-dom` para alternar entre Login y Registro (rechazado por YAGNI: un estado de vista `'login' | 'register'` en `App.tsx` resuelve la navegación entre las dos pantallas sin añadir dependencias).

## R2. Diseño de Figma (nodo `31:2`) y reutilización del sistema de diseño

- **Decision**: Reproducir el frame `02 · Registro` (nodo `31:2` del archivo `f7uDsv8sh6ZOtK2OitTqtg`) reutilizando el layout de dos columnas (`LoginScreen` + `BrandPanel` a la izquierda y panel de formulario centrado de `max-width: 400px` a la derecha) y los componentes base (`TextField`, `PasswordField`, `Checkbox`, `Button`, `Divider`, `SocialButton`, `Alert`) junto con un nuevo componente reutilizable `Toast`.
- **Rationale**: El prototipo de Registro en Figma comparte exactamente la misma rejilla (1440×1024 en escritorio, `BrandPanel` de 620px con degradado `--brand-gradient`, formulario de 400px sobre `--neutral-0`), tipografía (`Inter Variable`) y tokens de color definidos en `src/ui/styles/tokens.css` (Constitución 8.5 y 8.6).
- **Estructura y textos del formulario de Registro (`31:2`)**:
  - Encabezado: Título `h1` `"Crea tu cuenta"` (30px Bold, `--neutral-900`) y subtítulo `"Completa tus datos para comenzar"` (16px Regular, `--neutral-600`).
  - Campo 1: `"Nombres Completos"` (`type="text"`, `autoComplete="name"`, placeholder `"Ej. Juan Pérez"`).
  - Campo 2: `"Correo electrónico"` (`type="email"`, `autoComplete="email"`, placeholder `"tucorreo@ejemplo.com"`).
  - Campo 3: `"Contraseña"` (`PasswordField`, `autoComplete="new-password"`, placeholder `"Mínimo 8 caracteres"`).
  - Campo 4: `"Confirmar contraseña"` (`PasswordField`, `autoComplete="new-password"`, placeholder `"Repite tu contraseña"`).
  - Casilla de verificación: `Checkbox` `"Acepto los términos y condiciones y la política de privacidad"` (desmarcada por defecto; controla la habilitación del botón `"Crear Cuenta"`).
  - Botón primario: `"Crear Cuenta"` (`type="submit"`, deshabilitado cuando el checkbox está en `false` o durante el guardado; texto en carga `"Creando cuenta…"`).
  - Separador: `Divider` con texto `"o regístrate con"` (o `"o continúa con"`).
  - Botones sociales: `"Google"` y `"Apple"` en rejilla de 2 columnas (`gap: 12px`), que al pulsarse disparan un `Toast` con el mensaje `"Próximamente"`.
  - Pie de formulario: `"¿Ya tienes una cuenta?"` + botón de enlace `"Inicia sesión"`, que navega a la vista de Login.
- **Nota sobre el MCP de Figma**: En entornos donde el servidor MCP de Figma no esté activo durante la sesión, se toman como fuente autorizada los tokens extraídos previamente del archivo `f7uDsv8sh6ZOtK2OitTqtg` en `src/ui/styles/tokens.css` y la especificación funcional de `31:2`.

## R3. Contraste WCAG 2.1 AA y estado deshabilitado del botón "Crear Cuenta"

- **Decision**: Reutilizar los tokens accesibles `--brand-700` (`#d04721`), `--neutral-600` (`#73748b`), `--neutral-border` (`#92949c`) y `--danger-600` (`#c62828`) de `tokens.css`. Cuando el botón `"Crear Cuenta"` está deshabilitado (porque el checkbox de términos está en `false`), mantiene `disabled` nativo con opacidad diferenciada y cursor `not-allowed` (WCAG 1.4.3 exime a los controles inactivos del requisito de contraste mínimo, mientras que todos los textos activos superan 4.5:1).
- **Rationale**: Cumple la Constitución 8.4 (WCAG 2.1 AA obligatorio) y mantiene consistencia con `001-login-billetera`.

## R4. Reglas de validación inline: Correo y Contraseña de seguridad alta

- **Decision**:
  1. **Nombres Completos**: obligatorio tras `trim()`, longitud entre 1 y 80 caracteres.
  2. **Correo electrónico (máscara/formato email)**: normalización en línea (recorte de espacios periféricos y conversión a minúsculas), obligatorio, longitud ≤ 254 caracteres y patrón `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` (`inputMode="email"`, `type="email"`).
  3. **Contraseña de seguridad alta**: longitud entre 8 y 128 caracteres (sin recortar espacios) y cumplimiento simultáneo de 4 reglas de complejidad:
     - Al menos una letra mayúscula (`/[A-Z]/`)
     - Al menos una letra minúscula (`/[a-z]/`)
     - Al menos un dígito numérico (`/[0-9]/`)
     - Al menos un carácter especial (`/[^A-Za-z0-9\s]/`)
  4. **Confirmar contraseña**: obligatorio, debe cumplir las mismas reglas de seguridad alta y ser exactamente igual (`===`) a `password`.
  5. **Momento de validación inline**:
     - Al perder el foco (`onBlur`), el campo se marca como `touched` y muestra su error inmediatamente.
     - En los campos con validación inline explícita (`email`, `password`, `confirmPassword`) y en cualquier campo ya tocado (`touched`), cada cambio (`onChange`) recalcula el error en tiempo real.
     - Cambiar `password` recalcula inmediatamente el error de `confirmPassword` si `confirmPassword` ya tiene contenido o fue tocado.
- **Rationale**: Satisface el requisito explícito del usuario de validación inline para correo, contraseña de seguridad alta y confirmación de contraseña, sin bloquear la escritura inicial en campos aún vacíos.
- **Alternatives considered**: Librerías como `zod` o `yup` (rechazadas por Principio IV y 7.4: funciones puras en `src/domain/validation.ts` cubren todas las reglas con cero dependencias).

## R5. Persistencia en `localStorage` y Seguridad por Diseño (Constitución 5.3 y 5.4)

- **Conflicto analizado**: El usuario solicita *"crear un registro de los datos en localStorage del navegador"* al completar el registro, mientras que la Constitución (Principio V, reglas 5.3 y 5.4) establece que los datos sensibles y credenciales deben protegerse en reposo y no exponerse en claro.
- **Decision**:
  - Persistir los usuarios registrados bajo la clave `kynwallet.registeredUsers` en `window.localStorage` como un arreglo JSON de registros `RegisteredUserRecord`.
  - **Nunca almacenar la contraseña en texto plano**: antes de guardar en `localStorage`, la contraseña se transforma mediante un resumen criptográfico unidireccional (`SHA-256` vía Web Crypto API `crypto.subtle.digest` codificado en hexadecimal, con el correo normalizado como *salt* determinista: `sha256("${email}:${password}")`).
  - El objeto almacenado en `localStorage` contiene únicamente:
    ```json
    {
      "email": "usuario@ejemplo.com",
      "displayName": "Juan Pérez",
      "passwordDigest": "<hex-sha256>",
      "acceptedTerms": true,
      "createdAt": "2026-10-17T18:30:00.000Z"
    }
    ```
  - Integrar la lectura de `kynwallet.registeredUsers` en el adaptador de autenticación para que, al ser redirigido a la ventana de Login, el usuario recién registrado pueda iniciar sesión inmediatamente con su correo y contraseña.
- **Rationale**: Cumple al 100 % el requisito funcional del usuario (guardar el registro en `localStorage` y redirigir a Login) y respeta estrictamente el Principio V de la Constitución (sin contraseñas en texto plano en almacenamiento del navegador).
- **Alternatives considered**:
  - Guardar `password` en texto plano en `localStorage` (rechazado: viola frontalmente la Constitución 5.4 y el criterio SC-006).
  - No guardar ningún verificador de contraseña en `localStorage` (rechazado: impediría autenticar con la contraseña correcta al volver al Login tras el registro).

## R6. Componente Toast para botones de Google y Apple

- **Decision**: Crear un componente ligero `Toast` en `src/ui/components/Toast/` con `role="status"` y `aria-live="polite"`, estilizado con los tokens de marca (`--neutral-900` de fondo, `--neutral-0` de texto, radio `12px`, sombra sutil, posicionado flotante en la parte inferior/superior del panel sin desplazar el layout). Al pulsar "Google" o "Apple" en el registro, se muestra el mensaje `"Próximamente"` y se oculta automáticamente tras 3000 ms (limpiando el temporizador al desmontar o reiniciar).
- **Rationale**: Cumple US3 y FR-013 sin dependencias externas y cumple WCAG 2.1 AA (Constitución 8.4).
- **Alternatives considered**: `window.alert` nativo (bloquea el hilo principal, no es estilizable ni cumple el diseño de Toast); librerías como `react-hot-toast` o `sonner` (innecesarias para un aviso simple, violan Principio IV / 7.4).
