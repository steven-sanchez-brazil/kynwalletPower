# Contratos de Registro

## Aplicación e infraestructura

`RegistrationGateway.submit(): Promise<void>` espera o rechaza. No recibe argumentos ni
almacena datos. `createRegister(gateway)` produce `Register(values): Promise<RegistrationResult>`.
Valida antes de llamar al puerto; invalid no llama; éxito devuelve success; rechazo devuelve
unavailable. No expone el error original ni produce logs con valores del formulario.
`SimulatedRegistrationGateway` usa 1000 ms por defecto y permite otra demora para pruebas.

Organización alineada al Login: `RegistrationResult` y los valores/errores pertenecen a
`domain/registration.ts`; las reglas a `domain/validation.ts`; los mensajes a `domain/messages.ts`.
La aplicación importa esos contratos y no exporta resultados de dominio propios.

## Formulario

Durante el envío válido, el Button muestra un spinner decorativo y el nombre accesible
"Creando cuenta…". La composición con el adaptador predeterminado mantiene ese estado
al menos 1000 ms antes de navegar. Con movimiento reducido, el indicador queda estático.

`RegistrationForm` recibe el caso de uso `register`, callback `onSuccess` y navegación opcional.
No conoce implementaciones de infraestructura. Usa TextField, PasswordField, Checkbox,
Button, Divider, SocialButton y Alert existentes. Campos ocupados no se editan durante el
envío; el enlace para volver al login sigue disponible.

Los textos vacíos siguen la extracción: "Crea tu cuenta", "Completa tus datos para comenzar",
"Nombre completo", "Correo electrónico", "Contraseña", "Confirmar contraseña", "Crear cuenta",
"o regístrate con", "¿Ya tienes cuenta?" e "Inicia sesión". El aviso adicional explica que no
se crean cuentas reales. Google/Apple llaman a `window.alert('Próximamente')`; términos muestra
un aviso de texto legal no disponible y no cambia la casilla.

Errores junto a campos, aria-invalid/aria-describedby, labels programáticos y foco en el primer
inválido. Error global usa role alert; confirmación en login usa role status. Contraseñas
ocultas inicialmente, controles independientes con aria-pressed y nombres diferenciados.

## Navegación

`/registro` monta Registro; `/login` y `/` montan login. Enlaces tienen href real y conservan
su comportamiento estándar con modificadores. La navegación normal elimina el aviso. Solo
un callback de éxito vigente activa "Registro de demostración completado. Para iniciar sesión,
usa una cuenta de prueba configurada."
en `/login`. El aviso no sobrevive a historial, recarga o restauración de página.

La sesión se invalida al solicitar navegación, no solo tras desmontar. La finalización de
un formulario abandonado no puede navegar ni confirmar. Los datos no se copian al login,
URL, history.state, Storage ni logs. Login conserva autenticación, bienvenida y cierre de sesión.

## Diseño

Variante registration en layout/panel; default login. A 1440×1024, panel 620 y formulario
400 en x820/y140; debajo de 960 se oculta por completo el panel de marca de Registro.
Desde 320, no hay scroll horizontal. El contenido crece verticalmente con errores o zoom.
Las diferencias de contraste respecto de Figma están enumeradas en research R3 y quedan
pendientes de revisión humana final.
