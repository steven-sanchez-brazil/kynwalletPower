# Quickstart: Ejecución y validación del registro

El registro y sus pruebas están implementados. Esta guía permite ejecutarlos y repetir la validación; la evidencia real y los pendientes se registran en `validation.md` y `browser-evidence/results.json`.

## Preparación local

Requisitos: Node.js 22.12+ (verificar engines del Vite bloqueado), npm compatible y terminal en la raíz del repositorio. Implementación validada con Node 24.22.0 y npm 11.19.1; en esta máquina se encuentran en `C:/nvm4w/nodejs` y puede ser necesario agregar esa ruta al PATH de la terminal.

```powershell
node --version
npm --version
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Copiar `.env.example` solo si `.env.local` no existe; no sobrescribir configuración propia. Usar exclusivamente cuentas ficticias en `VITE_DEMO_USERS`, que solo configura el login y queda expuesta en el bundle del cliente. No se necesita esa variable para registrar; se necesita una cuenta de demostración válida para comprobar que el login conserva su funcionamiento.

Tras implementación, abrir `http://localhost:5173/register`. `/login` y `/` conservan el login. Confirmar puerto real mostrado por Vite si 5173 está ocupado.

## Validación del fake

En `.env.local`:

```dotenv
VITE_DEMO_REGISTRATION_MODE=success
```

Modo ausente también significa éxito. Para simular fallo, cambiar a `unavailable` y reiniciar Vite. No existe API externa ni servidor adicional; no usar correos especiales para activar errores. No introducir datos reales. [Contrato del fake](contracts/registration-api.md) y [modelo](data-model.md) detallan límites y respuestas.

## Escenarios de aceptación

1. Abrir `/login` y activar «Regístrate»: navegar a `/register` sin aviso de indisponibilidad. Comprobar también acceso directo a `/register`: cuatro campos vacíos, contraseñas ocultas, términos desmarcados y aviso de demostración. Enviar vacío: cinco errores inline, foco en nombre y URL sin cambio.
2. Probar correo sin arroba, contraseña de 7, confirmación distinta y aceptación false. Corregir: errores desaparecen al quedar válido; cambiar contraseña original vuelve a evaluar confirmación. Probar límites 100/101, 254/255 y 128/129, espacios y pegado.
3. Con fake success, completar datos ficticios válidos y aceptar términos. Pulsar Enter o «Crear cuenta»: carga breve, envío único aun con clics repetidos, navegación a `/login` y mensaje de éxito en ≤2 s. Credenciales ingresadas no crean una cuenta autenticable.
4. Recargar login, volver al registro y usar atrás/adelante: sin datos ni aviso de éxito recuperados. Salir durante envío: respuesta tardía no cambia la ruta. Login sigue aceptando únicamente su configuración ficticia existente.
5. Con fake unavailable, completar y enviar: error genérico, datos conservados, botón habilitado para reintentar. Probar recuperación error→éxito en integración mediante stub inyectado (sin agregar interruptor técnico a UI).
6. Activar Google y Apple: alert «Próximamente», datos intactos, foco restituido. Términos informa indisponibilidad sin marcar casilla. «Inicia sesión» navega sin éxito.
7. Alternar visibilidad de cada contraseña: independiente y operable con teclado; confirmar nombres accesibles distintos.
8. Revisar DevTools: cero solicitudes HTTP de registro y ningún dato personal en URL, respuestas, logs o almacenamiento; el diagnóstico contiene únicamente resultado/duración/categoría.

## Diseño y accesibilidad

Comparar con `.prompts/registro/04 · Registro.png` a 1440×1024: panel 620 px, formulario 400 px y ritmo de la referencia. Anotar diferencias previstas por aviso de demo y contraste. Validar 320, 375, 768, 1024 y 1440 px: debajo de 1024 solo formulario, sin scroll horizontal ni superposición con errores. Revisar zoom de texto al 200 % y ventana baja.

Completar recorrido solo con teclado y con lector de pantalla (p. ej. NVDA): campos, casilla, errores, alertas, visibilidad y éxito anunciados. Medir contraste sobre fondos reales, incluido gradiente. Registrar aprobación de desviaciones visuales antes de integrar; axe no sustituye revisión manual ni certifica fidelidad.

Para SC-001, realizar sesión con cinco participantes y datos ficticios: al menos cuatro completan en menos de dos minutos sin ayuda y reconocen la demostración. Registrar resultado real, no asumirlo por tests automatizados.

## Comandos de verificación

```powershell
npm test
npm run test:coverage
npm run lint
npm run format
npm run typecheck
npm run build
npm run audit:deps
npm run audit:licenses
npm run scan:secrets
npm run verify
npm run preview
```

Al iniciar implementación, registrar cobertura base. La final debe cumplir 80 % en líneas, funciones, ramas y sentencias y no disminuir cobertura global. Todas las pruebas llevan prefijo `REG-USn-m` o FR correspondiente, evitando colisiones con IDs del login. Ejecutar también regresiones del login tras extender componentes.

`verify` reúne controles del repositorio; para diagnóstico se pueden ejecutar individualmente. Antes de integrar, comprobar también licencias de herramientas de desarrollo, porque el script actual de licencias solo evalúa dependencias de producción; ejecutar `npx --no-install license-checker-rseidelsohn` con la misma lista permitida del script `audit:licenses` y sin `--production`, registrando excepciones si aparecen. No instalar otro auditor.

Prettier excluye `specs/` en la configuración actual: revisar explícitamente los documentos del feature en la fase de documentación. No declarar validados por un check que los omite. Registrar hallazgos previos ajenos al feature y corregir los nuevos, sin relajar controles para ocultarlos.

## README y entrega

Durante implementación actualizar README: objetivo login+registro, `/register`, modo fake, comandos, requisitos de Node, límites de demo, referencias visuales y contrato de navegación. Quitar «registro fuera de alcance» de la descripción general y documentar el recorrido «Regístrate» del login → `/register` → «Inicia sesión» → `/login`; las demás acciones del login conservan su comportamiento.

En hosting estático, configurar fallback a `index.html` para `/register` y `/login`; comprobar apertura directa y recarga con `npm run preview` y en el destino real. No hay despliegue solicitado en este plan. La entrega requiere revisión por otra persona, controles satisfactorios y aprobación de diferencias visuales según Constitución 8.6.
