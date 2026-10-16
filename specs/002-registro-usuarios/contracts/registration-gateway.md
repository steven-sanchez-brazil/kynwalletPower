# Contrato: Caso de uso y puerto de registro

**Feature**: `002-registro-usuarios` | **Fecha**: 2026-10-16

Contrato interno TypeScript; no se expone un endpoint HTTP.

## API implementada

```ts
type RegistrationInput = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>;

type RegistrationAccount = {
  fullName: string;
  email: string;
  password: string;
};

type RegistrationGatewayResult =
  { kind: 'success' } | { kind: 'duplicate-email' } | { kind: 'unavailable' };

type RegistrationResult =
  RegistrationGatewayResult | { kind: 'invalid-input'; errors: RegistrationErrors };

interface RegistrationGateway {
  register(account: RegistrationAccount): Promise<RegistrationGatewayResult>;
}

type RegisterAccount = (input: RegistrationInput) => Promise<RegistrationResult>;

// createRegisterAccount(gateway: RegistrationGateway): RegisterAccount
```

## Obligaciones del caso de uso

1. Validar usando `registrationValidation.ts`; si hay errores, devolver `invalid-input` sin
   llamar al puerto (REG-FR-005–010).
2. Eliminar espacios periféricos de nombre y normalizar correo con la función compartida.
3. Conservar la contraseña exacta; no enviar confirmación ni aceptación al puerto.
4. Devolver el resultado de registro y traducir excepciones a `unavailable`.
5. No depender de React, navegador, variables Vite ni adaptadores concretos.

## Obligaciones del adaptador en memoria

- La misma instancia implementa `AuthGateway` y `RegistrationGateway`.
- Comparar correo normalizado con todas las cuentas existentes antes de agregar una.
- Un correo repetido devuelve `duplicate-email` y no modifica cuentas.
- Tras `success`, `authenticate` de esa cuenta devuelve la bienvenida con el nombre.
- Con configuración inicial `null`, login conserva `unavailable` hasta la primera alta;
  registro puede crear esa primera cuenta.
- No persistir ni registrar datos de formulario, ni abrir conexiones de red.

## Verificación

`src/application/registerAccount.test.ts` cubre validación, llamadas, normalización y errores.
`src/infrastructure/InMemoryAuthGateway.test.ts` cubre registro→login y unicidad de correo.
Los casos deben referenciar REG-FR-005, 007, 018, 019 o 021 según el contrato verificado.
