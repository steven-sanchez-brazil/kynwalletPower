export const registrationEvents = [
  'validation_rejected',
  'submission_started',
  'submission_succeeded',
  'submission_failed',
  'submission_cancelled',
] as const;
export type RegistrationEvent = (typeof registrationEvents)[number];
export type DiagnosticEvent = { code: RegistrationEvent; durationMs?: number };
export interface RegistrationDiagnostics {
  record(event: DiagnosticEvent): void;
}
