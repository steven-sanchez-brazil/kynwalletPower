import type { RegistrationResult } from '@/domain/registration';

/** Puerto de registro (contracts/registration-gateway.md). */
export interface RegistrationGateway {
  register(request: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<RegistrationResult>;
}
