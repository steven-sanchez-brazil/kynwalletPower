# Validación de Registro

## Preparación

Desde la raíz del repo:

```powershell
.\scripts\harness.cmd -Task Doctor
.\scripts\harness.cmd -Task Install
.\scripts\harness.cmd -Task Dev
```

Abrir `http://localhost:5173/registro`. Registro no requiere cuentas ni backend. Para probar
la autenticación del login, configurar solo cuentas ficticias en `.env.local` según README.

## Recorridos y resultados esperados

1. Vacío: cuatro campos y casilla sin errores iniciales; contraseñas ocultas y aviso de demo.
2. Enviar vacío: errores asociados, foco en nombre y ningún envío.
3. Nombre solo espacios, correo inválido, contraseña de 7 y confirmación distinta: no éxito;
   corregir elimina el error. Probar límites de 80/254/128 en pruebas del dominio.
4. Datos válidos y términos sin aceptar: foco y error en casilla, sin envío.
5. Datos ficticios válidos y términos aceptados: spinner y estado "Creando cuenta…" durante al menos 1000 ms, sin doble envío;
   luego `/login`, aviso de éxito y login vacío. No existe una cuenta nueva utilizable.
6. Mostrar/ocultar contraseña y confirmación: se alternan por separado con teclado y ratón.
7. Google y Apple: alert "Próximamente"; términos: aviso de texto no disponible, sin marcar la casilla.
8. Ir al login por enlace: sin envío ni éxito. "Regístrate" abre la pantalla nueva. `/` conserva login.
9. Durante envío, volver al login y esperar: ninguna confirmación tardía. Volver a Registro: vacío.
10. Tras éxito, atrás/adelante y recarga: no se conserva aviso ni datos. Restauración de página: igual.
11. Login con cuenta ficticia existente: conserva validación, bienvenida y cierre de sesión.
12. Teclado: Tab/Shift+Tab, Enter/Espacio, foco visible, errores legibles y controles con nombres.
13. Navegador a 1440×1024, 375 y 320: escritorio dos paneles; móvil solo formulario; sin scroll horizontal.
14. Zoom 200 % y errores largos: no hay solapamientos ni controles inaccesibles.
15. Comparar con PNG de Figma: textos, tamaños y distribución; comprobar adaptaciones declaradas R3.

El rechazo del envío se reproduce en pruebas con un puerto que rechaza; no hay un botón
de fallo artificial en la pantalla de demostración. Debe conservar datos no secretos y
descartar ambas contraseñas, permitiendo reintentar.

Para repetir la ampliación controlada usada en esta revisión, abrir
`http://localhost:5173/harness/sdd/verification/zoom-200.html` con viewport 1440×1024.
Muestra la app con viewport CSS 720×512 y escala 2. Verifica contenido al doble de tamaño;
para certificar el zoom nativo del navegador, repetir también desde su menú de zoom.

## Controles

```powershell
.\scripts\harness.cmd -Task Verify
```

La verificación incluye lint, formato, tipos, pruebas con cobertura, build, vulnerabilidades,
licencias y secretos. Ejecución del 2026-10-15: control completo satisfactorio, 163 pruebas;
resultados y límites de revisión visual en [verification.md](verification.md) y la bitácora.
La aprobación humana y cualquier integración/publicación quedan fuera de estos controles automáticos.

El ajuste del 2026-10-16 pasó el control completo con 166 pruebas y dos workers. En un
equipo con carga alta se puede definir `$env:VITEST_MAX_WORKERS = '2'` en la sesión de
PowerShell antes de ejecutar el lanzador; limita concurrencia sin cambiar timeouts ni
umbrales. En esta ejecución se restauró la variable previa al finalizar.
