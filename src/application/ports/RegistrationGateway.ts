import type { DemoAccount } from '@/domain/auth';
import type { AccountCreationResult } from '@/domain/registration';

/** Puerto de alta de cuentas (contracts/registration-gateway.md). Separado de AuthGateway. */
export interface RegistrationGateway {
  register(account: DemoAccount): Promise<AccountCreationResult>;
}
