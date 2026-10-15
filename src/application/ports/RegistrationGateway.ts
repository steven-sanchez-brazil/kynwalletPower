import type { DemoAccount } from '@/domain/auth';
import type { RegistrationResult } from '@/domain/registration';

/** Puerto de registro (contracts/registration-gateway.md). */
export interface RegistrationGateway {
  register(account: DemoAccount): Promise<RegistrationResult>;
}
