# Research: Registro de Usuarios

## R1 · Fuente del diseño

- **Decisión**: imagen del frame `04 · Registro` incluida en el enunciado del taller, más los
  tokens ya extraídos de Figma en 001 (`src/ui/styles/tokens.css`).
- **Motivo**: el MCP de Figma no estaba disponible en la sesión; el taller permite usar la imagen.
  El frame comparte layout, tarjeta, logo, controles y colores con `01 · Login`.
- **Medidas observadas**: mismo panel de marca (~43 % del ancho) con el titular centrado
  verticalmente; título "Crea tu cuenta" más compacto que el del login; separación entre campos
  menor que en el login para que entren cuatro campos.

## R2 · Navegación sin dependencias

- **Decisión**: `ui/routing/router.ts` con `navigate(path, state)` (`history.pushState` + evento
  `popstate`) y `useRoute()` sobre `useSyncExternalStore`. `Link` renderiza un `<a href>` real y
  solo intercepta clics sin teclas modificadoras.
- **Alternativas**: `react-router` (dependencia nueva para 2 rutas, rechazada por 4.2 y 7.4);
  rutas hash `#/registro` (URLs distintas a las pedidas).
- **Nota**: Vite sirve `index.html` para cualquier ruta en `dev` y `preview` (`appType: 'spa'`).

## R3 · Mensaje de éxito tras redirigir

- **Decisión**: `navigate('/login', { registered: true })`; el login lee `history.state` y muestra
  el aviso con rol `status`.
- **Motivo**: no exponer datos en la URL (5.4) y sobrevivir a la recarga sin almacenamiento.

## R4 · Cuenta registrada disponible para el login

- **Decisión**: `main.tsx` crea una única lista mutable de cuentas (copia de `VITE_DEMO_USERS`) y
  la entrega a `InMemoryAuthGateway` y a `InMemoryAccountRegistry`.
- **Motivo**: demuestra el flujo completo registro → login sin backend y sin cambiar el gateway
  de 001. Si la configuración falta (`null`), ambos responden "no disponible".

## R5 · Correo duplicado

- **Decisión**: mensaje "No pudimos crear la cuenta con este correo. Si ya tienes una cuenta,
  inicia sesión." como `alert` global, no como error del campo.
- **Motivo**: reduce la enumeración de cuentas (Principio V) manteniendo una salida útil.

## R6 · Nombre completo

- **Decisión**: recortar, colapsar espacios, longitud 2–80 y patrón
  `^\p{L}+(?:[ '.-]\p{L}*)*$` (letras Unicode con separadores espacio, apóstrofo, punto, guion).
- **Motivo**: lista de permitidos (5.1); 80 coincide con el límite de `displayName` de 001.

## R7 · "Próximamente"

- **Decisión**: `window.alert('Próximamente')` para Google, Apple y "términos y condiciones".
- **Motivo**: pedido literal; el diálogo nativo es accesible y no altera el formulario.
