import type { RegistrationCommand, RegistrationResult } from '@/domain/registration';

export interface UserRegistrationGateway {
  register(command: RegistrationCommand): Promise<RegistrationResult>;
}
