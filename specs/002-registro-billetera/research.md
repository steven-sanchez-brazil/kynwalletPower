# Research: Pantalla de Registro de KynWallet

No quedaron `NEEDS CLARIFICATION` en el Technical Context: el stack, las herramientas y las
convenciones se heredan de `001-login-billetera`. Este documento registra las decisiones propias
del registro.

## R1. Navegación entre login y registro

- **Decision**: enrutamiento mínimo propio sobre la API de historial del navegador
  (`history.pushState` + evento `popstate`), con dos rutas: `/login` y `/registro`. Un hook
  `useRoute` entrega la ruta actual y `navigate(ruta)`; `App` elige la pantalla según la ruta. La
  raíz `/` y las direcciones desconocidas se reemplazan por `/login` (`replaceState`). El mensaje de
  éxito tras el registro viaja en el estado de `App` (no en la dirección) y se pierde al recargar.
- **Rationale**: el taller exige que el enlace "lleve a /login" y que el éxito "redirija a /login"
  (requisitos 5 y 6), así que hay direcciones reales y atrás/adelante deben funcionar. Con dos rutas
  y sin parámetros, ~30 líneas propias evitan una dependencia nueva (Constitución 4.2, 7.4).
- **Alternatives considered**: `react-router` (dependencia nueva y API mayor de la necesaria);
  estado de vista sin URL (incumple el requisito de `/login`); hash (`#/login`, no es `/login`).
- **Servidor**: Vite (`dev` y `preview`) ya responde con `index.html` ante rutas de una SPA, por lo
  que recargar en `/registro` funciona sin configuración adicional.

## R2. Reutilización del dominio de validación

- **Decision**: `validateRegistration` compone los validadores de correo y contraseña que ya
  existen en `validation.ts` (que se exportan) y añade nombre (1–100 caracteres tras recortar)
  y coincidencia de confirmación. Los textos nuevos van en `messages.ts`.
- **Rationale**: una sola fuente para "qué es un correo o contraseña válidos" (Principio IV).
  La política de contraseña (8–128, sin recortar) es la misma que la del login (supuesto de la
  spec).
- **Alternatives considered**: duplicar reglas en el módulo de registro (viola DRY).

## R3. Detección de correos existentes y consistencia con el login

- **Decision**: nuevo puerto `RegistrationGateway.register(data)` que devuelve
  `success | email-taken | unavailable`. `InMemoryRegistrationGateway` recibe las mismas
  `DemoAccount[]` que `InMemoryAuthGateway` (cargadas una vez en `main.tsx` con
  `loadDemoAccounts`) y espera 1 s. La cuenta nueva **no** se agrega.
- **Rationale**: clientes separados por puerto (ISP, Constitución 2.4) en lugar de ampliar
  `AuthGateway`; las cuentas siguen viniendo de `VITE_DEMO_USERS` (FR-015, 5.3). No agregar la
  cuenta cumple la suposición de que nada persiste.
- **Alternatives considered**: un único `AuthGateway` con ambos métodos (obliga al login a
  depender de una operación que no usa); guardar la cuenta en memoria (el usuario esperaría poder
  iniciar sesión luego, pero la spec lo excluye).
- **Seguridad**: se acepta revelar que un correo existe (clarificación 2) por ser una demo sin
  datos reales. Queda documentado como decisión explícita, no como descuido (5.4).

## R4. Reutilización y extensión de la UI

- **Decision**:
  - Reutilizar sin cambios: `TextField`, `PasswordField` (su estado de visibilidad es local, así
    que los dos campos son independientes, FR-017), `Button`, `Divider`, `SocialButton`, `Alert`.
  - Extender `Checkbox`: la etiqueta pasa a aceptar contenido (para el enlace "términos y
    condiciones") y admite un mensaje de error asociado con `aria-describedby`.
  - Mover el layout a `layout/AuthScreen` y parametrizar `BrandPanel` (titular, subtexto y tono
    del degradado), porque dos funcionalidades lo comparten.
- **Rationale**: Constitución 8.5 (reutilizar antes de crear) y OCP: el comportamiento del login
  no cambia, cubierto por sus pruebas actuales.
- **Alternatives considered**: copiar `LoginScreen`/`BrandPanel` para el registro (duplicación);
  crear un `TermsCheckbox` aparte (duplica la casilla).

## R5. Tokens del diseño de registro

Del CSS de Figma (nodo `31:2`), los valores coinciden con los tokens existentes salvo el
degradado del panel:

| Elemento | Valor en Figma | Token existente |
|---|---|---|
| Panel de marca | 620 px; `linear-gradient(70.73deg, #FF8A65 31.698%, #EF5226 83.455%)` | **Nuevo** `--brand-gradient-register` |
| Titular / subtexto del panel | 44 px 700 / 17 px 400 (85 % blanco) | `--on-brand-muted` |
| Tarjeta ilustrativa | 360×210, radio 22, fondo 16 %, borde 35 % | `--card-surface`, `--card-border`, `--radius-card` |
| Título del formulario | 30/36, 700, `#16182C` | `--neutral-900` |
| Subtítulo | 16/19, `#8A8BA8` | `--neutral-500` (accesible: `--neutral-600`) |
| Etiquetas | 14/17, 500, `#3D3F5C` | `--neutral-700` |
| Campos | 400×52, borde 1,5 px `#D7D9E6`, radio 12 | `--control-height`, `--radius-control` (borde accesible: `--neutral-border`) |
| Placeholder | 15/18, `#A9ABC2` | `--neutral-400` (accesible: `--neutral-600`) |
| Casilla | 20×20, borde 1,5 px, radio 6 | `--radius-checkbox` |
| Botón principal | 400×52, `#FF6B3D` | `--brand-500` (accesible: `--brand-700`) |
| Enlaces | 14 px 600, `#EF5226` | `--brand-600` (accesible: `--brand-700`) |
| Botones sociales | 192×48, radio 12 | `--social-height` |

- **Decision**: añadir solo `--brand-gradient-register`; para el resto aplicar los mismos
  tokens accesibles derivados que usa el login (R3 de 001).
- **Pendiente**: aprobación del responsable de diseño (8.6), igual que en 001.

## R5b. Comparación con el archivo de Figma (copia `22iIXNQrWthcJ3wTDGNkn8`, nodo `31:2`)

Lectura en solo lectura con `get_design_context` y `get_screenshot`. **Coinciden** con la spec,
el plan y las tareas: todos los textos ("Crea tu cuenta", "Completa tus datos para comenzar",
etiquetas, placeholders, "Acepto los términos y condiciones", "Crear cuenta", "o regístrate
con", Google, Apple, "¿Ya tienes cuenta?", "Inicia sesión", titular y subtexto del panel), todos
los colores (`#16182C`, `#3D3F5C`, `#8A8BA8`, `#A9ABC2`, `#D7D9E6`, `#FF6B3D`, `#EF5226`) y las
medidas de campos (400×52), botones (400×52 y 192×48), casilla (20×20) y tarjeta (360×210).

**Diferencias detectadas y decisión**:

| Diferencia | Decisión |
|---|---|
| Ángulo del degradado: el CSS pegado decía `60deg`; el archivo da `70.73deg` (paradas 31.698 % y 83.455 %) | Usar `70.73deg`, igual que el login usa el valor calculado por Figma |
| Logo: el registro lo compone de dos puntos (10×28 y 14×14, texto en x=78) y el login usa `logo-mark.svg` (20×44) | `BrandPanel` con tono `register` usa los activos del diseño de registro; el login no cambia (tarea T011) |
| Tarjeta: en el registro el chip queda pegado al borde derecho (x=378 de una tarjeta que termina en 416) y la fecha 12 px del borde; en el login ambos tienen 26 px de margen | Reutilizar la tarjeta del login (margen simétrico de 26 px). Se registra como diferencia visual menor aceptada, probable inconsistencia del diseño; confirmar con diseño (tarea T047) |
| Posición vertical: titular del panel en y=400 (login: 346) y formulario desde y=140 (login: centrado en y=250) | Centrar verticalmente el formulario y mantener la composición del panel del login; verificar en T047 |
| Separación entre campos: 92 px (login: 99 px) y entre etiqueta y campo 7 px (login: 8 px) | Usar las medidas del registro en `RegisterForm.module.css` |
| Los iconos del ojo y de Google/Apple son rectángulos de relleno en el diseño | Usar los marcadores de posición ya existentes del login |

## R6. Layout responsivo

- **Decision**: desde 960 px (mismo punto de quiebre del login) el registro muestra dos paneles; por
  debajo, **solo el formulario**: el panel de marca se oculta por completo (requisito 8 del taller).
  La columna del formulario es de 400 px máximo.
- **Rationale**: FR-022. A diferencia del login (que conserva la franja con el logo), el taller pide
  explícitamente "mobile (solo formulario)" para el registro. El login no cambia.

## R7. Foco y anuncios

- **Decision**: tras un envío con errores, el foco va al primer campo con error en el orden nombre →
  correo → contraseña → confirmación → términos. Tras un correo existente, el foco va al campo de
  correo. Tras el éxito se navega a `/login`, que muestra el mensaje de éxito en un `Alert` de tono
  `success` (región viva `status`) para que se anuncie. Los errores de campo se asocian con
  `aria-describedby`; el aviso de términos y los errores de servicio se anuncian con `Alert`.
- **Rationale**: FR-009, FR-013, FR-018, FR-019 y la misma práctica ya probada en el login.

## R8. `alert` "Próximamente" en Google y Apple

- **Decision**: `SocialButton` sigue recibiendo `onClick`; en el registro ese manejador llama a
  `window.alert(MESSAGES.COMING_SOON)` ("Próximamente"). El login conserva su aviso en pantalla.
- **Rationale**: requisito 4 del taller. Las pruebas espían `window.alert`.
- **Alternatives considered**: reemplazar también el aviso del login (fuera del alcance: 001 no lo
  pide y sus pruebas lo fijan).

