# UI Contract: Registro y navegación

**Trazabilidad**: FR-001–FR-019; criterios AC-101–AC-403 de [spec.md](../spec.md). Contrato observable, acompañado de pruebas de integración y revisión en navegador.

## Rutas y entrada

| Acción | Resultado |
| --- | --- |
| Abrir / o /login | login existente; sin aviso de registro salvo llegada exitosa vigente. |
| Abrir /register directamente | registro vacío y aceptación desmarcada. |
| Activar «Regístrate» del login | /register, vacío; sin transferir credenciales y sin placeholder anterior. |
| Activar «¿Ya tienes cuenta? Inicia sesión» | /login, sin datos del registro ni mensaje de éxito. |
| Registro exitoso | replace de /register por /login y aviso de éxito; no sesión ni nuevas credenciales. |
| Atrás/Adelante | render correspondiente a ruta; entradas a registro vacías; no reproducir aviso de éxito consumido. |
| Salir durante envío | cancelar; no navegar luego por un resultado antiguo. |

Usar enlaces con href y foco visible; navegación de la pestaña actual se coordina sin recarga. Click modificado o apertura en otra pestaña mantienen comportamiento nativo y no llevan estado privado. Actualizar título de documento y enfocar encabezado de destino programáticamente. La selección inicial depende de pathname, no de datos de historial. Servidor de alojamiento debe devolver index.html para rutas SPA /login y /register; comprobar en dev/preview y documentar la misma regla para el alojamiento existente, sin desplegar en esta fase.

Contrato mínimo Navigation: getPath(): string; subscribe(listener): función de limpieza; navigate(path, modo push/replace): void. Solo rutas públicas, sin parámetros de formulario. La implementación de navegador notifica también push/replace internos y popstate. App mantiene el aviso aparte; salir de esa llegada o recargar lo elimina.

## Controles y orden

Nombre completo → correo electrónico → contraseña → control de visibilidad de contraseña → confirmar contraseña → control de visibilidad de confirmación → aceptación → Crear cuenta → Google → Apple → Inicia sesión.

Cada campo tiene label visible y obligatoriedad perceptible. Checkbox incluye etiqueta, error asociado y referencia para foco. Contraseñas ocultas por defecto; botones de visibilidad tienen nombres accesibles distintos. Instrucciones/errores se combinan en la descripción accesible sin sobrescribir otras relaciones.

Crear cuenta y Enter siguen la misma validación; Espacio cambia aceptación. El primer control inválido recibe foco al enviar. No hay trampas de teclado. Tras un envío válido, el formulario indica aria-busy, el botón muestra «Creando cuenta…» y evita duplicados; campos/casilla quedan deshabilitados durante el intento. El estado de envío se anuncia mediante una región de estado, no solo un botón deshabilitado.

## Errores, avisos y éxito

- Obligatorios: mensaje claro junto a cada control vacío; aceptación exige «Debes aceptar los términos y condiciones».
- Correo inválido: «Ingresa un correo electrónico válido».
- Contraseña corta: «La contraseña debe tener al menos 8 caracteres»; longitud excesiva: mensaje que indica máximo 128.
- Discrepancia: «Las contraseñas no coinciden» junto a confirmación.
- Nombre o correo excesivos: mensaje con máximo 100 o 254, respectivamente.
- Google/Apple: exactamente «Próximamente», aviso accesible sin envío, navegación ni pérdida de datos.
- Fallo recuperable: «No se pudo completar el registro. Inténtalo de nuevo.»; reintento disponible con valores conservados.
- Éxito en /login: «Registro de demostración completado. Puedes volver al inicio de sesión; no se ha creado una cuenta real.»; anunciado y visible en esa llegada. No insertar nombre, correo o credenciales.

Errores asociados al campo, reconocibles sin depender solo de color y anunciados al aparecer; evitar anuncios duplicados de la misma región. Errores desaparecen al corregir el control; los pendientes permanecen. Enlaces sociales del login conservan su aviso histórico; «Próximamente» aplica a registro.

## Presentación

Registro de 320 a 1023 px: solo formulario; >=1024 px: marca y formulario en dos paneles. Mantener tokens, tipografía y controles existentes; ancho de contenido limitado y espacio suficiente para errores, sin altura fija que recorte. Cambios de ancho no desmontan el formulario ni borran valores. Login conserva su disposición previa. Contraste, zoom 200 %, foco y legibilidad deben revisarse en navegador; axe/jsdom no certifica geometría.

## Pruebas de contrato e integración

AC-101–104: controles, envío, confirmación, limpieza. AC-201–207: reglas, errores y fallo. AC-301–305: diseño/accesibilidad. AC-401–403: social y navegación. EC-007/010/012: duplicados, historial y reentrada. Probar ausencia de fetch/XHR, escrituras persistentes y valores en URL/historial/diagnóstico durante el flujo. Las requests de assets de la aplicación no son transmisiones de formulario.

