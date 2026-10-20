export interface RegistrationSimulation {
  complete(signal: AbortSignal): Promise<void>;
}
