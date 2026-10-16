# Contrato UI y puertos: Inicio

## Entradas

App recibe authenticate, register y wallet (snapshot readonly). Composición crea adaptador WalletGateway y ejecuta readWalletOverview. Sin HTTP ni backend.

LoginForm acepta onAuthenticated opcional `(displayName: string) => void`; solo invoca con resultado exitoso vigente y montado. El formulario borra sus credenciales al éxito. App agrega guardia de generación antes de abrir Home.

Home recibe name, wallet y onLogout. Enfoca el h1 al montar. Un único estado live anuncia «{acción}: Próximamente. Esta acción no está disponible en la demostración.»; no modifica datos ni URL. Inicio mantiene aria-current="page". Notificaciones tiene nombre accesible.

## Contenido

Fuente exacta: `figma/vistas-03-04/03-home-desktop-13-2/design-context.md` y `02-home-mobile-11-2/design-context.md`, secciones de textos. Se conserva formato monetario fuente. Identidad usa nombre autenticado y descriptor de demo. Tarjeta siempre enmascarada, sin acción de revelado.

Escritorio: Inicio/Historial/Tarjetas/Pagos/Perfil; Enviar/Recibir/Recargar/Pagar; cinco filas con categoría y fecha. Móvil: Inicio/Historial/QR/Perfil; Enviar/Recibir/Recargar/Más; primeras cuatro filas, solo fecha. Los elementos ocultos por CSS no pertenecen al árbol accesible del navegador.

Corrección visual del usuario: blancos en zonas naranjas de Inicio; sidebar de alto visible con perfil al pie y menú de scroll interno. La cabecera móvil y el saldo comparten un contenedor de fondo que crece con nombres largos. Símbolos SVG específicos de Login, Registro e Inicio según cada frame; el texto de marca no cambia.

## Salida

Cerrar sesión visible en ambos tamaños, vuelve a login vacío. `/inicio` sin sesión reemplaza URL por `/login`. No se guarda nombre ni credenciales en history.state, query, hash, localStorage o sessionStorage. La sesión de demo no constituye autenticación de servidor.
