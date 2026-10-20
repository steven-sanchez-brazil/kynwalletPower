import {
  registrationEvents,
  type DiagnosticEvent,
  type RegistrationEvent,
  type RegistrationDiagnostics,
} from '@/application/ports/RegistrationDiagnostics';
export class InMemoryRegistrationDiagnostics implements RegistrationDiagnostics {
  private counters: Partial<Record<RegistrationEvent, number>> = {};
  private lastEvent?: DiagnosticEvent;
  get snapshot() {
    return {
      counters: { ...this.counters },
      lastEvent: this.lastEvent ? { ...this.lastEvent } : undefined,
    };
  }
  record(event: DiagnosticEvent): void {
    if (!registrationEvents.includes(event.code)) throw new Error('Invalid diagnostic code');
    const safe: DiagnosticEvent = { code: event.code };
    if (event.durationMs !== undefined) {
      if (!Number.isFinite(event.durationMs) || event.durationMs < 0)
        throw new Error('Invalid duration');
      safe.durationMs = event.durationMs;
    }
    this.counters[safe.code] = (this.counters[safe.code] ?? 0) + 1;
    this.lastEvent = safe;
  }
}
