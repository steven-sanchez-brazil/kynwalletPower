# Research: Registro de Usuarios de KynWallet

**Feature**: `002-registro-usuario` | **Date**: 2026-10-15

## R1. Reglas de validación del registro

- **Decision**: `validateRegistration(data)` en `src/domain/registration.ts`, función pura que
  devuelve errores por campo. Reutiliza `validateEmail` y `validatePassword` de
  `domain/validation.ts` (se exportan) y mueve el límite de 80 caracteres del nombre
  (`FULL_NAME_MAX_LENGTH`) desde `loadDemoAccounts.ts` al dominio.
- **Rationale**: una sola fuente para las reglas de correo y contraseña (Constitución 4.1); el
  taller pide mínimo 8 caracteres, igual que 001.
- **Alternatives considered**: reglas de complejidad (mayúsculas, números): no las pide el taller
  ni 001 (YAGNI); librerías de formularios (zod, react-hook-form): dependencias innecesarias.

## R2. Rutas `/login` y `/registro`

- **Decision**: módulo `src/ui/routing/router.ts` con `ROUTES`, `navigate(path)` (usa
  `history.pushState` y emite un evento) y el hook `useRoute()` basado en `useSyncExternalStore`,
  que escucha `popstate`. Una ruta desconocida se reemplaza por `/login` con `replaceState`.
- **Rationale**: el taller exige URL reales y "atrás" del navegador debe funcionar. Vite sirve
  `index.html` para cualquier ruta en `dev` y `preview` (`appType: 'spa'`).
- **Alternatives considered**: `react-router` (dependencia y API completas para dos rutas,
  Constitución 4.2 y 7.4); rutas con `#` (URL distinta de `/login`).
- **Despliegue**: un hosting estático debe redirigir las rutas a `index.html` (se anota en el
  README).

## R3. Cuentas creadas y su relación con el login

- **Decision**: `InMemoryRegistrationGateway` recibe el mismo arreglo que `InMemoryAuthGateway`
  (creado en `main.tsx` con `loadDemoAccounts`) y agrega la cuenta nueva con `push`. Comprueba el
  correo repetido sin distinguir mayúsculas. Si la configuración no existe (`null`), responde
  `unavailable`, igual que el login (001 C4). Espera 1 s como el login.
- **Rationale**: la cuenta registrada inicia sesión sin cambiar el adaptador de login ni acoplar
  casos de uso; misma simulación y mismos estados de error.
- **Alternatives considered**: `localStorage` (persistiría contraseñas en el navegador, viola
  FR-018); un repositorio con interfaz propia (capa adicional sin requisito).

## R4. Caso de uso `register`

- **Decision**: `createRegister(gateway)` devuelve `register(data)`, que normaliza el correo y el
  nombre (trim), arma la `DemoAccount` y delega en el puerto; una excepción se convierte en
  `unavailable`. La validación ocurre antes, en el formulario, con la regla del dominio, igual que
  el login de 001.
- **Rationale**: mismo patrón que `createAuthenticate`; la contraseña nunca se transforma.

## R5. Formulario de registro

- **Decision**: `registerReducer` (estado puro y probado) + `useRegisterForm` + `RegisterForm`,
  con el mismo diseño de 001. Diferencias:
  - Al salir de un campo vacío sin error previo no se marca como tocado. El error de obligatorio
    aparece al enviar. Evita que el formulario se desplace y se pierda el clic en "Inicia sesión"
    (caso detectado en una implementación anterior del registro).
  - "Ya existe una cuenta con este correo" se guarda aparte y se borra al cambiar el correo.
  - El foco va al primer campo con error, en el orden visual del formulario.
- **Alternatives considered**: validar solo al enviar (el taller pide validación inline).

## R6. Google y Apple

- **Decision**: `window.alert('Próximamente')`, como pide el taller (requisito 4). Las pruebas
  espían `window.alert`.
- **Alternatives considered**: el aviso `status` de 001 (no es un alert y no cumpliría el texto
  del requisito).

## R7. Diseño (Figma `get_design_context`, nodo `31:2`)

Se usó el MCP de Figma sobre la copia del archivo (`7tRiQkIdJbtbsZHqCam60R`, nodo `31:2`), porque
el archivo original no permite el MCP con permisos de lectura.

- Panel de marca: igual que 001 salvo el titular "Comienza tu / camino financiero." y el texto
  "Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier
  lugar." `BrandPanel` recibe ambos por props, con los valores de 001 por defecto.
- Formulario: ancho 400 px; título 30 px Bold; subtítulo 16 px; etiquetas 14 px Medium; inputs
  52 px; separación de 16 px entre campos (label 24 px sobre el input, siguiente label 16 px bajo
  el input), frente a 22 px del login. Casilla 20 px, texto 14 px Medium con "términos y
  condiciones" 14 px SemiBold en color de marca. Botón 52 px; sociales 48 px; separador "o
  regístrate con".
- Recursos: los SVG del logo, el ojo y el marcador de los botones sociales son los mismos de 001
  (`src/ui/assets/`), por lo que no se descargan de nuevo.
- Contraste: se aplican los tokens accesibles de 001 (R3). Nuevo par para el mensaje de éxito:
  `--success-600: #1b6e35` sobre `--success-50: #e8f5ec` = 5.62:1.

## R8. Mensaje de éxito en `/login`

- **Decision**: `App` guarda el mensaje tras el registro y navega a `/login`; `LoginForm` lo
  recibe como `successMessage` y el reducer lo guarda en su estado inicial. Se muestra arriba del
  formulario con `Alert tone="success"` (`role="status"`) y se borra al enviar el login o al
  cerrar sesión. Navegar con los enlaces de la app descarta el mensaje.
- **Rationale**: no viaja en la URL (FR-018) ni en almacenamiento del navegador.

## R9. Gestión de foco y título

- **Decision**: el título de la pestaña cambia por ruta ("KynWallet · Iniciar sesión",
  "KynWallet · Crear cuenta") (WCAG 2.4.2). Al llegar a `/registro` navegando dentro de la app,
  el foco pasa a "Nombre completo"; en la carga inicial no se fuerza el foco.
