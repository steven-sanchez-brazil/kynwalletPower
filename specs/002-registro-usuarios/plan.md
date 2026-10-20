# Implementation Plan: Registro de Usuarios de KynWallet

**Rama**: `feature/registro-hector-najarro`  
**Especificación**: [spec.md](./spec.md)  
**Alcance confirmado**: **frontend de demostración, sin backend ni persistencia**.

## Objetivo

Crear la pantalla `04 · Registro` del taller, conservando el login existente de KynWallet. Pantalla de escritorio con panel naranja y formulario; móvil con **solo formulario**. Al completar los campos y aceptar términos, navegar a `/login` con aviso visible «Registro exitoso (demostración)»; no se crea ni almacena una cuenta real.

## Contexto técnico

- **Stack existente**: React 19, TypeScript, Vite; sin nuevas dependencias.
- **UI existente**: `TextField`, `PasswordField`, `Checkbox`, `Button`, `SocialButton`, `Divider`, `Alert` y tokens CSS.
- **Dominio**: reutilizar `normalizeEmail`, `isValidEmail`, `PASSWORD_MIN_LENGTH` y límites definidos en `src/domain/validation.ts`.
- **Rutas**: `/registro` y `/login` usando `history.pushState` y el evento `popstate`; `/` continúa mostrando el login.
- **Seguridad**: no almacenar contraseñas ni datos personales en URL, logs, localStorage, sessionStorage o una API.
- **Diseño**: tomar Figma frame `04 · Registro` como referencia, o la captura del PDF cuando no se disponga del MCP.

## Arquitectura y archivos

| Responsabilidad | Archivo |
|---|---|
| Validar nombre, correo, contraseña, confirmación, términos | `src/domain/registration.ts` |
| Pruebas de validación | `src/domain/registration.test.ts` |
| Formulario y feedback inline, Google/Apple | `src/ui/features/register/RegisterForm.tsx` |
| Estilos del formulario | `src/ui/features/register/RegisterForm.module.css` |
| Pruebas de interacción del formulario | `src/ui/features/register/RegisterForm.test.tsx` |
| Navegación e indicador de éxito en login | `src/App.tsx`, `src/App.registration.test.tsx` |
| Enlace «Regístrate» del login | `src/ui/features/login/LoginForm.tsx` |
| Panel naranja adaptado al registro | `src/ui/layout/BrandPanel/BrandPanel.tsx`, `LoginScreen.tsx` y CSS |
| Error accesible para términos | `src/ui/components/Checkbox/Checkbox.tsx` y CSS |

**Regla de negocio**: el único «envío» es una acción local de demostración. No es necesaria una capa artificial de infraestructura ni un gateway para un backend inexistente. Las reglas de validación quedan aisladas en dominio; la UI solo recoge datos y presenta los errores.

## Diseño del comportamiento

1. **Validación**: nombre no vacío (máx. 80), correo válido (máx. 254), contraseña con al menos 8 caracteres (máx. 128), confirmación idéntica, términos aceptados. Errores al salir de un campo y al intentar enviar.
2. **Resultado positivo**: navegar a `/login`, mostrando aviso de éxito **de demostración**, sin credenciales en URL ni almacenamiento.
3. **Google / Apple**: `window.alert('Próximamente')` literalmente.
4. **Navegación**: enlace desde registro a `/login`, enlace desde login a `/registro`, soporte atrás/adelante de navegador.
5. **Responsive**: usar el diseño y tokens existentes; ocultar por completo el panel de marca móvil únicamente en registro.

## Constitution check

- **TDD**: las pruebas están junto a la nueva validación, formulario y navegación; verificar rojo → verde al desarrollar.
- **SOLID / Clean Architecture**: reglas del formulario independientes de React en dominio; componentes UI reutilizables.
- **KISS / DRY**: reutilizar los campos, botones, divisores, panel y validadores existentes; no agregar router ni backend para dos pantallas.
- **Seguridad**: ningún secreto se persiste, transmite ni registra; los mensajes no contienen contraseñas.
- **BRD / ARD**: no se encontraron documentos adicionales en el ZIP proporcionado.
- **Accesibilidad y diseño**: asociación de etiquetas, `aria-invalid`, `aria-describedby`, teclado, contraste y comparación visual con captura PDF.
- **Trazabilidad**: pruebas referenciadas en `tasks.md`, verificación y Pull Request al repositorio original.

## Comprobación manual y automatizada

```powershell
npm install
npm run test
npm run build
npm run dev
```

Visitar `http://localhost:5173/registro`; probar todos los errores, un envío válido, el enlace a `/login`, los dos botones sociales y vistas de escritorio/móvil. Si hay tiempo, ejecutar `npm run verify` y resolver cualquier control fallido antes de integrar.

## Entrega

Marcar como terminadas las tareas de `tasks.md` únicamente después de verificarlas. Crear commit en `feature/registro-hector-najarro`, subir al fork y abrir Pull Request hacia `steven-sanchez-brazil/kynwalletPower`.
