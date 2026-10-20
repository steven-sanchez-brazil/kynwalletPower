import type {
  RegistrationTelemetry,
  RegistrationTelemetryEvent,
} from '@/application/ports/RegistrationTelemetry';

export const REGISTRATION_TELEMETRY_EVENT = 'kynwallet:registration-telemetry';

export class BrowserRegistrationTelemetry implements RegistrationTelemetry {
  record(event: RegistrationTelemetryEvent): void {
    window.dispatchEvent(
      new CustomEvent<RegistrationTelemetryEvent>(REGISTRATION_TELEMETRY_EVENT, {
        detail: event,
      }),
    );
  }
}
