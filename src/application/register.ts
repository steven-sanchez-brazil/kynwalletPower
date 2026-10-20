import {
  validateRegistration,
  type RegistrationValues,
  type RegistrationErrors,
} from '@/domain/registration';
import type { RegistrationSimulation } from './ports/RegistrationSimulation';
import type { RegistrationDiagnostics, RegistrationEvent } from './ports/RegistrationDiagnostics';
export type RegistrationResult =
  | { kind: 'invalid'; errors: RegistrationErrors }
  | { kind: 'success' | 'unavailable' | 'cancelled' };
export type Register = (
  values: RegistrationValues,
  signal: AbortSignal,
) => Promise<RegistrationResult>;
export function createRegister(
  simulation: RegistrationSimulation,
  diagnostics: RegistrationDiagnostics,
) {
  const fallback = { diagnosticFailures: 0 };
  const record = (code: RegistrationEvent) => {
    try {
      diagnostics.record({ code });
    } catch {
      fallback.diagnosticFailures++;
    }
  };
  const register: Register = async (values, signal) => {
    if (signal.aborted) {
      record('submission_cancelled');
      return { kind: 'cancelled' };
    }
    const errors = validateRegistration(values);
    if (Object.keys(errors).length) {
      record('validation_rejected');
      return { kind: 'invalid', errors };
    }
    record('submission_started');
    try {
      await simulation.complete(signal);
      if (signal.aborted) {
        record('submission_cancelled');
        return { kind: 'cancelled' };
      }
      record('submission_succeeded');
      return { kind: 'success' };
    } catch {
      const kind = signal.aborted ? 'cancelled' : 'unavailable';
      record(kind === 'cancelled' ? 'submission_cancelled' : 'submission_failed');
      return { kind };
    }
  };
  return Object.assign(register, { diagnosticFailureCount: () => fallback.diagnosticFailures });
}
