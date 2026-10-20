# Contract: Registro simulado y observabilidad

## RegisterUser

| Caso | Resultado |
|---|---|
| Algún valor inválido | Errores por campo; cero simulaciones. |
| Valores válidos | Una llamada `simulate()` sin datos. |
| Éxito | `success`, sin payload. |
| Error/throw | `unavailable`, sin detalle. |
| Activación repetida | Una llamada y un resultado. |

## RegistrationSimulator

```ts
interface RegistrationSimulator {
  simulate(): Promise<'success' | 'unavailable'>;
}
```

La implementación no acepta/captura datos, permite resultado/demora controlables, responde
antes de 2 s y no usa red, storage, cookies ni cuentas.

## RegistrationTelemetry

Eventos permitidos:

```text
attempt_started
attempt_finished(result: success | unavailable, durationBucket: under_2s | over_2s)
```

Sin campos libres, DTO, PII, URL, stack trace o causa. Un fallo de telemetría no bloquea el
formulario. Las pruebas verifican cero PII y que `simulate()` recibió cero argumentos.
