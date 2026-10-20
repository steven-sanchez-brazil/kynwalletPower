# Contract: RegistrationGateway & AccountStore

**Feature**: `002-registro-billetera` | **Date**: 2026-10-19

Este contrato define la interfaz pública para el puerto de registro de cuentas (`RegistrationGateway`) y el repositorio/almacén compartido de cuentas (`AccountStore`), respetando los principios de Clean Architecture (Principio III) y DIP (Principio II).

---

## 1. Puerto `RegistrationGateway`

Ubicación del contrato en código: `src/application/ports/RegistrationGateway.ts`

```ts
import type { RegistrationData, RegisterResult } from '@/domain/auth';

/**
 * Puerto para procesar el registro de nuevos usuarios en la billetera virtual.
 */
export interface RegistrationGateway {
  /**
   * Procesa la solicitud de registro de un usuario.
   *
   * @param data Datos validados del formulario de registro.
   * @returns Promesa con el resultado de la operación (éxito, error de duplicado o indisponibilidad).
   */
  register(data: RegistrationData): Promise<RegisterResult>;
}
```

### 1.1. Invariantes del Puerto

1. **Aislamiento de Infraestructura**: El puerto no expone detalles de persistencia, red o base de datos.
2. **Normalización de Correo**: El email se normaliza (recorte de espacios y minúsculas) antes de verificar unicidad y registrar.
3. **No Retención de Contraseñas en Texto Claro en Registro**: Las contraseñas se gestionan solo en memoria para la simulación y nunca se emiten en eventos ni trazas de logging (Constitución 5.3).
4. **Idempotencia y Concurrencia**: Si se reciben solicitudes simultáneas con el mismo correo, únicamente una resulta en `{ kind: 'success' }` y la subsiguiente en `{ kind: 'email-already-registered' }`.

---

## 2. Contrato `AccountStore`

Ubicación del contrato en código: `src/application/ports/AccountStore.ts`

```ts
import type { DemoAccount } from '@/domain/auth';

/**
 * Almacén en memoria compartido para cuentas de demostración y usuarios registrados.
 */
export interface AccountStore {
  /**
   * Obtiene la lista de cuentas disponibles.
   */
  getAccounts(): readonly DemoAccount[];

  /**
   * Busca una cuenta por su correo electrónico (búsqueda normalizada e insensible a mayúsculas).
   */
  findByEmail(email: string): DemoAccount | undefined;

  /**
   * Registra una nueva cuenta en el almacén.
   * @throws Error si ya existe una cuenta con el mismo correo.
   */
  saveAccount(account: DemoAccount): void;
}
```

---

## 3. Implementación de Infraestructura: `InMemoryRegistrationGateway`

Ubicación: `src/infrastructure/InMemoryRegistrationGateway.ts`

- **Dependencias inyectadas**:
  - `store: AccountStore`: Almacén donde se persisten las cuentas.
  - `options?: { delayMs?: number }`: Retardo simulado (por defecto 800–1000 ms; configurable en tests a 0 ms).
- **Comportamiento**:
  - Espera el tiempo `delayMs`.
  - Verifica si `store.findByEmail(data.email)` existe. Si existe, retorna `{ kind: 'email-already-registered', message: 'Este correo electrónico ya se encuentra registrado' }`.
  - Si no existe, invoca `store.saveAccount({ email: data.email, password: data.password, displayName: data.fullName })` y retorna `{ kind: 'success', account: { email: data.email, displayName: data.fullName } }`.

---

## 4. Adaptador de Autenticación Actualizado: `InMemoryAuthGateway`

- `InMemoryAuthGateway` se actualiza para recibir el mismo `AccountStore`.
- Al consultar las credenciales durante el login, busca en `AccountStore.findByEmail(email)`.
- Esto garantiza de manera inmediata que cualquier cuenta creada en la pantalla de registro es autenticable en la pantalla de login.
