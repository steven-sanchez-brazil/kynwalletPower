import type { RegistrationResult } from '@/domain/registration';

export interface RegistrationSimulator {
  simulate(): Promise<RegistrationResult>;
}
