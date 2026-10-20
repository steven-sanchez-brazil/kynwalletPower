# Research: Registro de usuarios de KynWallet

**Fecha**: 2026-10-18. Investigación basada en código actual, plan del login, captura y CSS locales; revisión delegada de reutilización. Sin acceso directo al archivo de Figma.

## R1 — Stack y requisitos de ejecución

**Decision**: conservar React, TypeScript, Vite y lockfile existentes. Documentar Node 22.12+ para ejecución; confirmar `engines` de los paquetes bloqueados al instalar.

**Rationale**: el proyecto ya dispone del stack solicitado y pruebas; reconstruirlo o actualizarlo no aporta valor. El mínimo amplio del README anterior no basta: [Vite documenta requisitos de Node](https://vite.dev/guide/).

**Alternatives considered**: proyecto nuevo, actualización de librerías o cambio de framework, descartados por alcance y DRY. No se verificó instalación: Node/npm no aparecen en PATH.

## R2 — Componentes y estado

**Decision**: reutilizar TextField, PasswordField, Button, SocialButton, Divider y Alert. Extender Checkbox con `ref`, `error`, `required`, `onBlur`, `disabled` y asociación de error; conservar su API previa. PasswordField admitirá un nombre de control distinguible para confirmación. Un reducer y hook locales coordinarán valores, touched, errores, envío y recuperación.

**Rationale**: código inspeccionado y revisión delegada confirman estas capacidades y carencias. Los campos controlados deben actualizar su estado en `onChange`; las etiquetas se asocian explícitamente, como explica la [documentación de React](https://react.dev/reference/react-dom/components/input). Las reglas viven en dominio; touched y foco pertenecen a presentación.

**Alternatives considered**: duplicar campos, bibliotecas de formularios o estado global, descartados por ausencia de necesidad. No anidar un enlace/botón de términos en la etiqueta de la casilla: será un control hermano independiente.

## R3 — Fake de API sin red

**Decision**: `RegistrationGateway` representa el alta ficticia. `FakeRegistrationGateway` modela un POST lógico a `/api/demo/register` mediante una promesa local; no existe endpoint HTTP real ni se llama fetch. Opciones inyectadas: demora de 500 ms y resultado `created` o `unavailable`. Variable pública opcional `VITE_DEMO_REGISTRATION_MODE=success|unavailable` selecciona el fake desde composición; ausente significa éxito y valor inválido significa indisponibilidad controlada.

**Rationale**: permite demostrar los estados solicitados de manera reproducible, sin red, datos persistidos ni credenciales especiales. El fake no necesita clientes HTTP o servidores; no devuelve nombre, correo, contraseña, token ni identificador de cuenta. El caso de uso valida antes de invocar y maneja respuestas inválidas y excepciones como indisponibilidad. La confirmación solo existe en el formulario, no en la solicitud.

**Alternatives considered**: MSW, JSON Server, fetch interceptado, datos hardcoded que fallen según correo o aleatoriedad. Añaden dependencias/red, filtran reglas a datos personales o hacen pruebas inestables. En pruebas se inyectan secuencias error→éxito; no se agrega un selector técnico a la interfaz del producto.

## R4 — Navegación y éxito

**Decision**: `/register` abre registro; `/login` y `/` abren login. App escucha `popstate` y centraliza navegación con `pushState(null, '', path)` y actualización explícita del estado. Desconocidas se normalizan con replace a `/login`. Aviso de éxito vive en App, nunca en URL, history.state ni almacenamiento. Limpiarlo al salir de login o recargar.

**Rationale**: App actual monta login incondicionalmente; no basta cambiar URL. La composición necesita desmontar registro, descartar valores e ignorar respuestas pendientes. La aclaración del usuario confirma que «Regístrate» debe abrir `/register`, sustituyendo el aviso anterior. También se admite acceso directo a esa ruta; la autenticación y las demás acciones del login conservan su comportamiento.

**Alternatives considered**: nuevo router, navegación por hash o recarga completa con query de éxito; añaden complejidad o no cumplen el destino/efimeridad. Documentar fallback SPA para rutas directas en hosting.

## R5 — Diseño y contraste

**Decision**: tomar como referencia primaria `.prompts/registro/04 · Registro.png` y `styles.css`: lienzo 1440×1024, panel 620 px, formulario 400 px con título en x=820/y=140, campos 52 px, radio 12 px, Inter, sociales 192×48 px, gradiente `60deg, #FF8A65 31.7%, #EF5226 83.46%`. Layout flexible, no copiar posiciones absolutas. En móvil ocultar todo el BrandPanel; conservarlo sin cambio visual en login mediante variante.

**Rationale**: el gradiente de login es diferente y su versión móvil deja logo visible. El CSS exportado no incluye errores, carga ni adaptación. Replicar medidas base y permitir crecimiento vertical por mensajes y aviso de demo.

El botón naranja con texto blanco, enlaces y grises originales requieren revisión: ya existen tokens accesibles derivados en el proyecto. Usarlos donde corresponda, medir todos los fondos reales y documentar diferencias. El blanco del texto sobre gradiente también debe auditarse: no asumir que el tamaño grande lo vuelve conforme. [WCAG exige contraste mínimo según tamaño y peso](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html); preservar decoración y proponer ajustes puntuales donde falle. La aprobación de diseño exigida por 8.6 no consta y deberá registrarse antes de integrar.

**Alternatives considered**: réplica literal de todos los colores, incompatible con AA; reemplazo global del tema del login, fuera de alcance. No usar CSS exportado como stylesheet ejecutable: es una sucesión de propiedades de elementos distintos, no reglas reutilizables.

## R6 — Validación y seguridad

**Decision**: aprovechar constantes y funciones de `domain/validation.ts`, haciendo exportaciones/refactorizaciones compatibles donde sea preciso. Validar nombre Unicode de 1–100 caracteres tras trim, correo ≤254 y contraseña/confirmación de 8–128. Prioridad obligatorio→formato/longitud→coincidencia; no truncar con `maxLength` antes de que el usuario conozca el error. Definir longitud con la misma semántica de cadenas JavaScript existente para no cambiar el login en esta entrega.

**Rationale**: un solo origen de reglas previene divergencias. El caso de uso confirma tipos y aceptación, normaliza nombre/correo, no recorta contraseñas y omite confirmación del DTO. React renderiza texto; no usar HTML sin sanear. No cuentas reales, no almacenamiento ni payload en diagnósticos. Configuración de cuentas del login se conserva y solo admite datos ficticios.

**Alternatives considered**: validadores copiados al hook, expresiones que excluyan nombres internacionales, inferir usuarios ya registrados o persistir alta, contrarios a requisitos.

## R7 — Pruebas y diagnóstico

**Decision**: reutilizar Vitest/Testing Library/axe-core; `vi.useFakeTimers` para demora y guardia de duplicados según [guía de temporizadores de Vitest](https://vitest.dev/guide/mocking/timers). Fake contractual probado en éxito, fallo, respuesta no válida y sin referencias retenidas. Observador inyectado emite eventos estructurados `registration.completed`/`registration.failed`, resultado y duración; contadores derivados sin payload. Sink local de infraestructura admite consola únicamente en ese archivo con regla ESLint acotada, sin desactivar `no-console` en el resto del código.

**Rationale**: permite detectar fallos y medir duración sin exponer datos. Un callback pequeño evita plataforma de telemetría y mantiene dominio sin efectos. Capturar eventos en pruebas para comprobar contenido permitido. No reutilizar excepciones crudas como mensajes/logs.

**Alternatives considered**: servicios externos de observabilidad, registros del objeto completo, o ignorar excepciones; aumentan alcance o incumplen Constitución. Auditoría manual sigue siendo necesaria: jsdom/axe no certifica contraste real, distribución ni lectura completa.

## Resolución

No quedan incógnitas técnicas bloqueantes. Pendientes de ejecución: instalación local, pruebas, controles de seguridad/licencia, revisión visual y aprobación de diferencias de contraste. Son verificaciones de entrega, no resultados ya obtenidos.
