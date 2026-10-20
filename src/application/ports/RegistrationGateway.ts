import type { RegistrationData, RegistrationResult } from '@/domain/auth';

/** Puerto de registro (specs/002-registro-billetera/contracts/registration-gateway.md). */
export interface RegistrationGateway {
  register(data: RegistrationData): Promise<RegistrationResult>;
}
