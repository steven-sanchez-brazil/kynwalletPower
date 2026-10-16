# Verificación de Inicio

Fecha: 2026-10-16. Ejecución del agente; aprobación humana final pendiente.

## Automatización

Rojo previo a producción: suites de datos sin módulos; Home ausente y cinco integraciones fallidas; reducer con fallo por credenciales retenidas. Primer verde enfocado: 29 pruebas. Se agregaron pruebas del contrato de navegación para rechazar generaciones anteriores, éxitos en Registro y duplicados sobre sesión abierta.

Primer control completo: 180 pruebas. Segundo: 26 archivos, 182/182 pruebas; statements 99.20 %, branches 97.32 %, functions 100 %, lines 99.68 %. Lint, formato, tipos, build, dependencias (0 vulnerabilidades), licencias y secretos pasaron. Cobertura superior a la base anterior (99.09/96.27/100/99.63).

Después, la prueba de salto al contenido falló antes de corregirlo. Se agregó foco directo al main sin fragmento/historial. Último Verify posterior al ajuste: **26 archivos, 183/183 pruebas**, statements **99.20 %**, branches **97.32 %**, functions **100 %**, lines **99.69 %**. Todos los controles terminaron con código 0. El fixture visual agregado al harness también pasó ESLint específico. Configuración local original restaurada antes del último build.

Comando: `scripts\harness.cmd -Task Verify`, con `VITEST_MAX_WORKERS=2` solo para el proceso, restaurado al terminar. No se modificaron umbrales ni timeouts. Advertencia de jsdom/axe sobre canvas no instalado: no es prueba de contraste renderizado ni fallo de los controles. No se instaló canvas.

## Navegador real: Edge

Conexión autorizada de Edge; sin Playwright externo. Pérdidas ocasionales del debugger se resolvieron con pestañas nuevas.

| Comprobación | Evidencia observada |
| --- | --- |
| Escritorio 1440×1024 | `evidence/inicio-desktop-1440.jpg`; cuatro indicadores, cinco filas, tarjeta y resumen. clientWidth=scrollWidth=1440. |
| Móvil 390×844 | `evidence/inicio-mobile-390.jpg`; cuatro filas, Más y navegación inferior; bloques de escritorio ausentes del árbol accesible. Ajuste posterior de espaciado de 6 px verificado a 320/768. |
| Reflujo 320×844 | `evidence/inicio-mobile-320.jpg`; viewport 320, clientWidth=scrollWidth=305 (scrollbar de 15 px), cuatro filas. |
| Tablet 768×1024 | `evidence/inicio-tablet-768.jpg`; clientWidth=scrollWidth=768. |
| Teclado y avisos | Tab/Enter en Notificaciones; Enter en todas las acciones móviles y adicionales de escritorio. Avisos identifican cada acción; saldo intacto; foco con doble anillo blanco/oscuro. Inicio conserva sesión. |
| Salida y acceso | Cerrar sesión por teclado, atrás, entrada directa y recarga muestran `/login`. Propiedades de ambos inputs vacías (el atributo value no equivale a la propiedad). |
| Salto al contenido | Tras ajuste, Enter enfoca MAIN `wallet-content`, hash vacío, ruta `/inicio` y billetera visible. |
| Nombre máximo | Nombre ficticio de 80 caracteres: ajusta líneas sin tapar notificaciones. Configuración local temporal restaurada por comparación de hash; respaldo ignorado eliminado. No se publican credenciales. |
| Ampliación equivalente al 200 % | Fixture `harness/sdd/verification/inicio-zoom-200.html`: iframe con viewport a la mitad y scale(2), a 1440 y 640 px exteriores (720 y 320 CSS internos). Capturas de nombre largo y final de contenido. Tab/Shift+Tab alcanzan Cerrar sesión por encima de la navegación fija. **Es simulación, no zoom nativo de Edge.** |
| Registro real | En `/registro`, envío válido muestra DOM con aria-busy, botón deshabilitado, texto Creando cuenta y SVG; después vuelve al login con confirmación. Prueba automática afirma espera a 999/1000 ms. |
| Imagen del spinner | `evidence/registro-spinner-fixture-10s.jpg` muestra el mismo RegistrationForm/Button con demora de 10 segundos **solo en fixture de desarrollo**, señalada en pantalla. Permite capturar el fotograma que no resultó fiable en un segundo. No prueba duración de producción: esa se verificó por separado. La aplicación mantiene 1000 ms. |

## Diferencias y límites

Adaptaciones en research: contraste, reflujo de indicadores/descripciones, nombre/titular, descriptor de cuenta ficticia y salida. Barras y valores ilustrativos no conciliados entre sí. Acciones sin pantalla diseñada anuncian disponibilidad futura; no hay operaciones financieras ni backend reales.

Axe/jsdom y comprobaciones DOM no certifican por sí solos WCAG; se complementaron con capturas, teclado, foco, reflujo y contraste calculado. Quedan la aprobación funcional/diseño del usuario y revisión de código independiente antes de integrar. Sin push, PR ni publicación.

## Corrección de colores, sidebar y símbolos solicitada por el usuario

La decisión inicial de texto oscuro sobre gradiente queda sustituida por los blancos de Figma en Inicio. El blanco sobre #ff8a65 tiene contraste 2.314:1: discrepancia documentada por instrucción explícita del usuario, sin declarar conformidad AA completa. No se cambiaron los textos de Login/Registro: allí se solicitó revisar solo el símbolo.

Rojo: BrandPanel 1/3 pruebas fallida por reutilizar el SVG de Login en Registro. Navegador previo a cambios: lateral estático, texto oscuro, perfil inferior en y=873 a 600 px de alto; cabecera/saldo móviles oscuros. Fuente: `evidence/correcciones-antes.json`.

Verde: pruebas enfocadas 16/16 y **Verify completo con 26 archivos, 184/184 pruebas**, statements 99.20 %, branches 97.38 %, functions 100 %, lines 99.69 %. Lint, formato, tipos, build, auditorías y secretos terminaron con código 0; no se relajaron controles.

Edge se reconectó y se completó la comprobación real:

- A 1440×600, sidebar sticky con top=0 y bottom=600; perfil entre y=518 y 576. Al desplazar el documento 306 px, el lateral y perfil conservaron posición. Colores calculados del menú y tarjeta: rgb(255,255,255).
- A 1440×320, nav con clientHeight=99, scrollHeight=276, scrollTop≈177 tras activar Perfil por teclado; perfil entre y=238 y 296. Se desplaza el menú dentro del lateral y se conserva visible el perfil.
- A 390×844 y 320×844, cabecera, saldo y moneda blancos; sin desbordamiento horizontal (a 320, clientWidth=scrollWidth=305 por scrollbar). Fondo compartido de cabecera/saldo, de 260 px en el caso observado, sin margen ni separación en su origen (x=0,y=0).
- SVG de Login 20×44, Registro 18×28 y Home 20×22; geometrías verificadas contra metadatos. Registro conserva la posición del texto y de los demás bloques mientras cambia el símbolo.

Mediciones en `evidence/correcciones-despues.json`; capturas nuevas `sidebar-corregido-1440x600.jpg`, `sidebar-scroll-interno-1440x320.jpg`, `inicio-blancos-mobile-390.jpg`, `inicio-blancos-desktop-1440.jpg` y `simbolo-registro-corregido.jpg`. La revisión anterior se conserva como historial, no como evidencia de los colores actuales.

## Revisión arquitectónica previa a commit y push · 2026-10-16

Comparación y decisiones en `architecture-review.md`. La refactorización de tipos, mensajes y validación de Registro conserva las dependencias del Login original y no modifica la UI ni sus contratos. Las 38 pruebas enfocadas pasan antes y después.

Verify completo posterior a la refactorización: **código 0, 26 archivos y 184/184 pruebas**. Cobertura: **99.20 %** sentencias, **97.38 %** ramas, **100 %** funciones y **99.69 %** líneas, idéntica a la anterior. Lint, formato, tipos, build, auditoría de dependencias (0 vulnerabilidades), licencias y secretos pasan. Se mantuvieron los dos workers temporales y los umbrales existentes. La evidencia visual previa sigue aplicando; no se presenta una nueva ejecución de navegador para este ajuste de organización.

La solicitud del usuario autoriza commit y push al fork en esta etapa, sustituyendo el límite anterior de no publicación. No autoriza todavía abrir el PR ni equivale a una revisión de código independiente.

Entrega comprobada: commit `b09886647439dfd997d6c6f0fcf2d92be76e2ab2`, «feat: agregar registro e inicio con arquitectura alineada al login». Push normal a `origin/feature/registro-pedro-gandola` terminado con código 0. `git ls-remote` confirmó el mismo SHA en el fork `Pedro2798/kynwalletPower`; árbol de trabajo limpio tras publicar. El registro de esta evidencia se entrega en un commit documental posterior. No se abrió PR.
