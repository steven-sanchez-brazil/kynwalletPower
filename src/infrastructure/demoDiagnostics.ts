import type { DiagnosticEvent, RegistrationObserver } from '@/domain/registration';
type RecordEvent = DiagnosticEvent & { count: number };
/** Diagnóstico local con lista explícita de atributos, nunca payload de formulario. */
export function createDemoDiagnostics(
  write: (event: RecordEvent) => void = (event) => console.info(event),
  fallback: (event: RecordEvent) => void = (event) => console.warn(event),
): RegistrationObserver {
  let count = 0;
  return (event) => {
    count++;
    const safe = { name: event.name, outcome: event.outcome, durationMs: event.durationMs, count };
    try {
      write(safe);
    } catch {
      fallback({
        name: 'registration.failed',
        outcome: 'diagnostic-unavailable',
        durationMs: 0,
        count,
      });
    }
  };
}
