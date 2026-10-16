# Research y decisiones de Registro

**Fecha**: 2026-10-15. Revisión humana final pendiente.
Se inspeccionaron reglas y componentes del login y se despacharon investigaciones de
navegación y diseño conforme a `speckit-plan`. No quedan incógnitas que impidan implementar.

## R1 Alcance, fuentes y metodología

**Decisión**: demo sin backend, con la spec como fuente de verdad y el
[apunte del usuario](../../harness/sdd/method-reference.md) como guía metodológica.
Constitution se conserva en 1.0.0. El usuario autorizó el ciclo completo sin gates humanos
intermedios; su aprobación final sigue pendiente.
**Fuentes**: taller, spec y extracción de Claude del nodo `31:2` de la copia. Ver
[procedencia y límites](design/extraction-notes.md). No existe frame móvil ni estados.
**Alternativas**: no implementar cuenta persistida ni autenticación con los datos del alta.

## R2 Navegación y confirmación

**Decisión**: History API en un hook UI; `/` y `/login` muestran login, `/registro` Registro.
Enlaces reales conservan href y apertura con modificadores; solo clicks primarios sin
modificadores se interceptan para la SPA. `pushState` actualiza también el estado React;
`popstate` lo sincroniza al recorrer el historial.
**Privacidad**: solo rutas y `null` llegan a history; el aviso vive en React, se elimina
en otra navegación, historial o restauración del documento. Nunca se usa query, hash,
storage ni history.state para transportar el resultado o el formulario.
**Carreras**: invalidar sincrónicamente la sesión al navegar; el callback de éxito comprueba
que sigue vigente. El hook del formulario protege intentos y desmontaje. Restauraciones
de página invalidan formulario y aviso. StrictMode usa efectos con limpieza simétrica.
**Alternativas**: router nuevo innecesario; navegación completa pierde el aviso; flash
en history.state reaparece al volver.
**Referencias**: [History API](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-history-pushstate-dev),
[popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event),
[pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event),
[StrictMode](https://react.dev/reference/react/StrictMode).

## R3 Diseño y contraste

**Decisión**: usar la captura 1440 × 1024 recibida y componentes existentes. Columna izquierda
620 px, formulario 400 px en x820/y140 a esa resolución. El login centra en x830; una variante
con padding lateral 24/44 px reproduce x820. Registro oculta todo el panel de marca bajo
960 px; el login mantiene su propia franja móvil. Titular a y400 y tarjeta a y750 en el
frame de referencia; en alturas menores el flujo crece verticalmente sin recortar contenido.

Reutilizar tokens accesibles del login para botón, enlaces, textos secundarios y bordes.
El gradiente de Registro conserva `70.73deg, #ff8a65 31.698%, #ef5226 83.455%` y usa texto
`#16182c` opaco en titular, subtítulo y tarjeta. El logo geométrico es decorativo; el nombre
de marca puede conservar blanco. El resto de la adaptación se limita a Registro.

| Par | Contraste mínimo calculado |
| --- | --- |
| Texto #16182c sobre extremo naranja oscuro | 4.916:1 |
| Texto #16182c sobre tarjeta blanca16% | 5.888:1 |
| Blanco sobre botón #d04721 | 4.560:1 |
| Secundario #73748b sobre blanco | 4.565:1 |
| Borde #92949c sobre blanco | 3.027:1 |
| Error #c62828 sobre blanco | 5.622:1 |

No aplicar opacidades al texto oscuro. El icono de visibilidad requiere una variante con
contraste perceptible; no se añade un logotipo social inexistente en el diseño.
**Alternativas**: blanco original no cumple AA; mantener todo blanco requeriría scrim negro
de al menos .506405 (se calculó .52 con margen), cambiando toda la mitad de pantalla.
**Otras diferencias declaradas**: divisor simétrico y footer centrado en lugar de posiciones
manuales; estados accesibles derivados; aviso de demo adicional tras el footer; checkbox
alineado con su etiqueta. Geometría del logo y tarjeta se reutiliza o ajusta solo en la variante.
**Revisión**: cálculos no sustituyen revisión visual; axe del repo desactiva color-contrast.
Las adaptaciones de diseño se presentan a revisión humana final, no se declaran aprobadas.

## R4 Validación y simulación

**Decisión**: `validateRegistration` reutiliza `validateCredentials` y sus mensajes. Nombre
recortado 1–80, correo normalizado <=254, contraseña sin recortar 8–128, confirmación exacta
y <=128, términos true. Las reglas viven solo en dominio; UI y caso de uso las invocan.
El caso de uso devuelve invalid/success/unavailable y llama a `RegistrationGateway.submit()`
sin datos. El adaptador espera 1000 ms y no guarda ningún formulario. Fallos se prueban con
una dependencia que rechaza; no hay fallos aleatorios ni botón de fallo en la demo.
**Alternativas**: almacenar cuentas o mandar contraseñas al adaptador no aporta valor al taller.

## R5 Componentes e interacción

**Decisión**: ampliar Checkbox con error asociado, ref, onBlur, atributos nativos y una acción
de etiqueta separada; el botón de términos no queda dentro del label. PasswordField permite
nombrar su control de visibilidad; la confirmación tiene nombre distinto. Mantener tipos y
props predeterminados del login. Extender LoginScreen y BrandPanel con variante opt-in.
**Alternativas**: duplicar controles desperdicia validación de accesibilidad; etiquetas con
botón anidado introducen una interacción ambigua de la casilla.

## R6 Verificación

**Decisión**: TDD por lotes de dominio/contrato/UI, con IDs `Registro FR/US` para distinguirlos
del login. Cubrir límites, errores, duplicados, rechazo, abandono, StrictMode, historial,
privacidad, teclado y axe; inspeccionar navegador a 1440/375/320 y zoom 200 %. Ejecutar
`npm run verify` y registrar resultados reales. No añadir infraestructura de pruebas externa
al paquete de la app; las comprobaciones del navegador usan herramientas disponibles.
