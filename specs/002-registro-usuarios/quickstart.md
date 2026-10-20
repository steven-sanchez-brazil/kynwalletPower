# Quickstart: Validación del registro

Este documento guía la validación del registro implementado; resultados y pendientes reales están en validation.md. Referencias: [spec](spec.md), [modelo](data-model.md), [UI](contracts/ui-registration.md) y [caso de uso](contracts/registration-use-case.md).

## Prerrequisitos y preparación

Desde la raíz del repositorio, usar Node/npm compatibles con los engines del package-lock; README indica Node >=20 y npm >=10. Instalar versiones bloqueadas:

    npm ci
    npm run dev -- --host 127.0.0.1

Abrir http://127.0.0.1:5173/login y /register (usar el puerto que imprima Vite si cambia). El registro no necesita variables de entorno. Para comprobar acceso de una cuenta ficticia ya existente, seguir la configuración local del README; no usar datos reales ni agregar credenciales a archivos versionados.

Antes de producción, escribir y ejecutar cada prueba nueva hasta observar el fallo esperado. Registrar rojo → verde → refactor en la evidencia de tareas/PR. No ejecutar solamente la suite final como sustituto de TDD.

## Comandos de verificación

    npm test
    npm run test:coverage
    npm run lint
    npm run format
    npm run typecheck
    npm run build
    npm run audit:deps
    npm run audit:licenses
    npm run scan:secrets

npm run verify agrupa esos controles. audit:licenses verifica producción y desarrollo; el workflow de CI usa npm ci. La auditoría de licencias mantiene un bloqueo pendiente de autorización, descrito en validation.md. No dar por cumplida la Constitution por existir scripts: guardar resultados, revisar mantenimiento de dependencias y obtener revisión/aprobaciones antes de integrar.

Cobertura mínima 80 % en líneas, ramas, funciones y sentencias, sin reducir cobertura global previa. Medir baseline antes del código nuevo; no deshabilitar casos para obtener verde. Todas las pruebas nuevas deben identificar 002/FR, 002/AC o 002/EC. Los controles de red de auditoría requieren conectividad; documentar fallos de entorno y repetir en un entorno autorizado, sin convertirlos en aprobaciones.

## Recorridos verificables

| Recorrido | Pasos y resultado esperado | Referencias |
| --- | --- | --- |
| Entrada | Desde login, activar Regístrate por teclado y puntero; /register vacío, términos desmarcados, sin transferencia de credenciales. | AC-101/403, EC-012 |
| Obligatorios | Enviar vacío: cinco errores, primer campo enfocado, sin procesamiento. | AC-201, EC-001 |
| Correo/nombre | Probar límites y espacios según modelo; a@b.c permitido en registro y a@b..com inválido; login conserva contrato previo. Nombre con acentos/un término permitido. | AC-202/206, EC-002/003 |
| Contraseñas | Probar 7/8/128/129 caracteres, espacios y pegado; modificar original tras validar confirmación; errores junto al campo sin borrar datos. | AC-203–206, EC-004–006/008 |
| Envío | Datos válidos y aceptación: estado perceptible, doble clic/Enter no duplica; <=2 s hasta /login con texto exacto de éxito. | AC-102/103, EC-007, SC-003 |
| Sin cuenta nueva | Registro completado no altera cuentas; no habilita esas credenciales ni crea sesión. | AC-103, SC-007 |
| Opciones | Google y Apple muestran Próximamente y preservan datos. Inicia sesión va a /login sin éxito. | AC-401/402 |
| Reentrada | Abrir directamente /register, recargar y volver tras navegar: siempre vacío; back/forward no repite aviso de éxito. | AC-104/403, EC-010/012 |
| Cancelación | Salir antes de resolver simulación: ninguna redirección tardía ni recuperación del formulario anterior. | FR-017, contrato de caso de uso |
| Fallo | Stub inyectado rechaza: mensaje genérico, datos conservados y reintento; siguiente éxito funciona. | AC-207, EC-011 |
| Privacidad | Espiar fetch/XHR y storage durante el recorrido; revisar URL, history.state, consola y diagnóstico: sin datos del formulario, sin envíos de registro. | FR-017, SC-007 |

Errores/cancelaciones se prueban mediante dependencias inyectadas, sin construir controles de fallo en el producto.

## Navegador, accesibilidad y usabilidad

- Revisar 320, 375, 768, 1024 y 1440 px, orientación y zoom 200 %. Registro solo formulario hasta 1023; dos paneles desde 1024; sin desplazamiento horizontal ni recortes. Redimensionar no borra valores.
- Completar solo con Tab/Shift+Tab, Enter y Espacio. Verificar foco, orden, foco en primer error y encabezado de destino. Repetir con lector de pantalla: etiquetas, errores, envío y éxito anunciados.
- Ejecutar axe en estados inicial, error, envío y llegada exitosa. El helper jsdom omite contraste; medirlo en navegador junto con la revisión visual de tokens, jerarquía y estados.
- Revisar el pendiente de aprobación de diseño ya documentado en README sobre contraste. Mantener tokens accesibles, registrar aprobación antes de integrar si sigue pendiente; no afirmar aprobación inexistente.
- Validar SC-001 con >=5 participantes: >=90 % completa sin ayuda en <2 minutos y reconoce la simulación. Registrar cantidad, proporción y tiempos; no inventar un resultado.
- Probar el build servido con npm run preview y acceso directo a /register y /login. El alojamiento SPA debe resolver esas rutas a index.html; esta fase no despliega.
- Registrar evidencias de SC-001–SC-008 y controles de Constitution en PR, con revisión de otra persona y sin incluir datos sensibles.

## Regresión esperada

Login conserva reglas de acceso, vista de bienvenida/cierre, Recordarme y avisos actuales de Google/Apple/recuperación. Actualizar expectativas del placeholder Regístrate y su rol accesible; ahora es un enlace al registro. Mantener verdes pruebas existentes restantes y actualizar README/contrato de login para referenciar FR-019. No modificar la Constitution.

