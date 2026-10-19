import type { DemoAccount } from '@/domain/auth';
import type { RegistrationResult } from '@/domain/registration';

/** Puerto de registro de cuentas (contracts/account-registry.md). */
export interface AccountRegistry {
  register(account: DemoAccount): Promise<RegistrationResult>;
}
