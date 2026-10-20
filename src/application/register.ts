import type {
  RegistrationValues,
  RegistrationResult,
  RegistrationObserver,
} from '@/domain/registration';
import { validateRegistration } from '@/domain/registrationValidation';
import { normalizeEmail } from '@/domain/validation';
import type { RegistrationGateway } from './ports/RegistrationGateway';

export type Register = (values: RegistrationValues) => Promise<RegistrationResult>;

function isCreated(response: unknown): boolean {
  if (typeof response !== 'object' || response === null) return false;
  const value = response as Record<string, unknown>;
  if (
    Object.keys(value).length !== 2 ||
    value.status !== 201 ||
    typeof value.body !== 'object' ||
    value.body === null
  )
    return false;
  return (
    Object.keys(value.body).length === 1 && 'kind' in value.body && value.body.kind === 'created'
  );
}

export function createRegister(
  gateway: RegistrationGateway,
  observe?: RegistrationObserver,
): Register {
  return async (values) => {
    const errors = validateRegistration(values);
    if (Object.keys(errors).length) return { kind: 'validation-error', errors };
    const started = performance.now();
    let result: Extract<RegistrationResult, { kind: 'created' | 'unavailable' }>;
    try {
      const response = await gateway.register({
        fullName: values.fullName.trim(),
        email: normalizeEmail(values.email),
        password: values.password,
        acceptedTerms: true,
      });
      result = { kind: isCreated(response) ? 'created' : 'unavailable' };
    } catch {
      result = { kind: 'unavailable' };
    }
    try {
      observe?.({
        name: result.kind === 'created' ? 'registration.completed' : 'registration.failed',
        outcome: result.kind,
        durationMs: performance.now() - started,
      });
    } catch {
      // Un fallo del observador se aísla de la operación; no se expone su excepción.
      // La entrega del diagnóstico es responsabilidad del adaptador, no del usuario.
      return result;
    }
    return result;
  };
}
