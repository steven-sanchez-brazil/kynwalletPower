export type RegistrationTelemetryEvent =
  | { type: 'attempt_started' }
  | {
      type: 'attempt_finished';
      result: 'success' | 'unavailable';
      durationBucket: 'under_2s' | 'over_2s';
    };

export interface RegistrationTelemetry {
  record(event: RegistrationTelemetryEvent): void;
}
