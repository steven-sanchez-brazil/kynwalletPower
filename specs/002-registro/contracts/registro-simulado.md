# Contract: creación de cuenta simulada

## Puerto de aplicación

`RegistrationGateway` representa la operación de demostración y se inyecta en el caso de uso. No realiza red, escritura de archivos ni almacenamiento del navegador.

**Entrada**: ninguna. El caso de uso valida todos los datos y la aceptación antes de invocar el puerto. Al tratarse de una simulación sin creación de cuenta, ningún dato personal necesita cruzar hacia el adaptador. Ningún valor se conserva tras resolver o rechazar la operación.

**Salida**: resolución de éxito sin identificador de cuenta real; o error tipado/inesperado convertido por la aplicación en un resultado genérico seguro. La UI nunca muestra detalles internos.

**Precondición**: `validateRegistration(values)` devuelve cero errores.  
**Postcondición de éxito**: se libera el estado de envío y la UI navega a `/login` con aviso temporal.  
**Postcondición de fallo**: se libera el estado de envío, no hay navegación y se puede reintentar.  
**Invariante**: dos activaciones mientras hay una operación pendiente producen una sola invocación del puerto.

## Pruebas de contrato

1. Una solicitud válida invoca el gateway una vez y devuelve éxito sin crear cuenta persistente.
2. Una solicitud inválida no invoca el gateway.
3. Un rechazo se transforma en aviso genérico sin datos personales ni detalles técnicos.
4. La implementación en memoria no hace llamadas de red ni escrituras persistentes.
5. El adaptador falso de pruebas puede resolver o rechazar de forma determinista para cubrir ambos caminos.
