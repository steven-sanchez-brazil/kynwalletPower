# Modelo de datos de Registro

## RegistrationValues

Solo estado transitorio de UI y argumento del caso de uso; no se serializa.

| Campo | Tipo | Restricción |
| --- | --- | --- |
| fullName | string | 1–80 caracteres después de trim; acentos admitidos |
| email | string | obligatorio; normalización trim/minúsculas; <=254; regla del login |
| password | string | 8–128 caracteres; sin trim |
| confirmPassword | string | obligatorio; <=128; igualdad exacta con password |
| termsAccepted | boolean | true antes de enviar; false inicialmente |

`RegistrationErrors` asocia un mensaje a cada campo inválido. Los campos tocados controlan
la visibilidad de errores; un envío inválido los marca todos y enfoca el primero.

## RegistrationResult

- `invalid` con errores de campo: el caso de uso no invoca el puerto.
- `success`: la espera simulada terminó; no representa cuenta persistida.
- `unavailable`: rechazo manejado sin detalles internos.

## Formulario y navegación

Formulario: editing -> submitting -> éxito/navegación o editing/error. Un bloqueo inmediato
impide dobles envíos antes del siguiente render. Ante fallo se vacían ambas contraseñas;
nombre, correo y aceptación se conservan. Ante éxito o abandono se descarta el formulario.
Cada intento y sesión de pantalla se invalida al desmontar/navegar; resultados viejos se ignoran.

Navegación: ruta + número de sesión + indicador de aviso. El aviso solo se activa por éxito
de la sesión vigente de Registro; otra navegación, popstate o restauración lo elimina.
History recibe únicamente rutas constantes y `null`; nunca datos personales ni el aviso.

## Persistencia

No hay cuenta de Registro, tabla, almacenamiento local, cookie ni nueva variable de entorno.
Las cuentas ficticias de autenticación existentes no se alteran. El puerto de envío no
recibe `RegistrationValues` ni contraseñas.
