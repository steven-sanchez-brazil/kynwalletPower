import type { RegistrationSimulator } from './ports/RegistrationSimulator';
import type { RegistrationTelemetry } from './ports/RegistrationTelemetry';
import type { RegistrationErrors, RegistrationValues } from '@/domain/registration';
import { validateRegistration } from '@/domain/registrationValidation';

export type RegisterUserResult =
  { kind: 'invalid'; errors: RegistrationErrors } | { kind: 'success' } | { kind: 'unavailable' };

export type RegisterUser = (values: RegistrationValues) => Promise<RegisterUserResult>;

export function createRegisterUser(
  simulator: RegistrationSimulator,
  telemetry: RegistrationTelemetry,
): RegisterUser {
  return async (values) => {
    const errors = validateRegistration(values);
    if (Object.keys(errors).length > 0) return { kind: 'invalid', errors };

    const startedAt = performance.now();
    try {
      try {
        telemetry.record({ type: 'attempt_started' });
      } catch {
        // La observabilidad nunca bloquea la experiencia.
      }
      const result = await simulator.simulate();
      try {
        telemetry.record({
          type: 'attempt_finished',
          result,
          durationBucket: performance.now() - startedAt < 2000 ? 'under_2s' : 'over_2s',
        });
      } catch {
        // La observabilidad nunca bloquea la experiencia.
      }
      return { kind: result };
    } catch {
      try {
        telemetry.record({
          type: 'attempt_finished',
          result: 'unavailable',
          durationBucket: performance.now() - startedAt < 2000 ? 'under_2s' : 'over_2s',
        });
      } catch {
        // La observabilidad nunca bloquea la experiencia.
      }
      return { kind: 'unavailable' };
    }
  };
}
