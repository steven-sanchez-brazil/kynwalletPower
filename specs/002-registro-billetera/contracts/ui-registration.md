# Contract: Interfaz y navegación del registro

## Rutas

| Ruta / acción | Resultado |
| --- | --- |
| abrir `/register` | formulario vacío y términos false |
| «Regístrate» en login | navegar a `/register` con formulario vacío, sin aviso de indisponibilidad |
| abrir `/login` o `/` | login existente, sin aviso de registro previo |
| éxito de registro | `/login`, formulario de registro desmontado y aviso de éxito |
| «Inicia sesión» | `/login` sin aviso de éxito |
| atrás/adelante | render correspondiente a pathname; sin restaurar datos de registro o aviso anterior |
| ruta desconocida | replace a `/login` |

El acceso a registro se realiza desde «Regístrate» en el login o mediante URL directa; este cambio sustituye el aviso de indisponibilidad anterior de esa acción y conserva las demás acciones del login. No utilizar query strings ni history.state para transportar datos o éxito. Hosting debe servir index.html en rutas SPA.

## Contenido y componentes

- Panel de marca de registro: KynWallet; «Comienza tu camino financiero.»; «Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar.»; tarjeta decorativa de la referencia, sin representar una cuenta del visitante.
- Encabezado principal «Crea tu cuenta», subtítulo «Completa tus datos para comenzar».
- Campos en orden: «Nombre completo» (placeholder «Ej: Diego Martínez»), «Correo electrónico» («tucorreo@ejemplo.com»), «Contraseña», «Confirmar contraseña». Contraseñas vacías aunque haya placeholder con puntos; autocomplete `new-password` en ambas.
- Casilla etiquetada «Acepto los términos y condiciones»; botón separado para consultar términos, sin activar la casilla implícitamente. Casilla required, con error asociado y foco posible.
- Botón submit «Crear cuenta»; durante envío «Creando cuenta…», deshabilitado y con estado ocupado. Enter en campos envía mediante onSubmit con preventDefault y noValidate, utilizando reglas inline propias.
- Separador «o regístrate con»; Google y Apple son botones type=button, cada uno abre `window.alert('Próximamente')`, no envía ni valida. Restituir foco al cerrar.
- Pie «¿Ya tienes cuenta? Inicia sesión» con enlace real a `/login`; conservar semántica y navegación de teclado.
- Aviso breve «Demostración: no se creará una cuenta real. Usa datos ficticios», visible sin superponer o esconder contenido de referencia.

## Mensajes y accesibilidad

- Textos de validación según US2 y fuente única de mensajes; límites máximos explícitos. Cada mensaje se asocia por aria-describedby; marcar aria-invalid, anunciar errores nuevos sin duplicar innecesariamente todos los anuncios por pulsación.
- Al envío inválido, foco en primer control con error en orden visual, incluida casilla. Ningún éxito ni navegación.
- Controles independientes de visibilidad: «Mostrar contraseña», «Ocultar contraseña», «Mostrar confirmar contraseña», «Ocultar confirmar contraseña»; nombres inequívocos, aria-pressed y type=button.
- Fallo general con role=alert: «No se pudo completar la demostración. Intenta de nuevo». Conservar datos y recuperar envío. No reflejar datos, stack ni excepciones.
- Éxito en login con role=status: «Registro de demostración exitoso. Puedes iniciar sesión con una cuenta de demostración». Ubicar en región visible de App/login, enfocable programáticamente sin cambiar el flujo de autenticación. Una operación finalizada produce un anuncio.
- Términos: aviso «Términos y condiciones no disponibles en esta demostración»; sin navegación o documento legal inventado, preservar datos y foco.
- Etiquetas persistentes, obligatoriedad comunicada, foco visible, orden lógico, contraste AA y zoom 200 %. Evitar usar color como único indicador.

## Layout verificable

Referencia: captura y CSS en `.prompts/registro/`. A 1440×1024, panel izquierdo 620 px, formulario ancho 400 px, inicio x=820 y título y≈140. Campos altos 52 px, sociales 48 px, radios 12 px, tarjeta 22 px y fuente Inter local. Priorizar ritmo y jerarquía con flujo normal; los errores y aviso adicional deben aumentar altura sin solapamiento.

Desde 1024 px, dos paneles; por debajo, ocultar BrandPanel completo. Desde 320 px, márgenes de 16 px y ancho flexible; sociales pueden adaptar su distribución sin recortar nombres ni controles. Cambiar tamaño no reinicia el formulario. Con poca altura o errores, permitir scroll vertical.

No modificar el gradiente/breakpoint global del login para igualar el registro. Aplicar variante con gradiente exportado, evaluar contraste sobre cada región real y registrar cambios AA para aprobación de diseño antes de integrar.

## Evidencia

Pruebas de componentes e integración verifican comportamiento, roles, foco, URL y ausencia de persistencia. Auditoría axe y revisión manual verifican accesibilidad; revisión visual a 1440×1024 y anchos 320/375/768/1024/1440 comprueba layout. jsdom no sustituye esta revisión visual.
