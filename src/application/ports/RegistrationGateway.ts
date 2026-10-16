import type { DemoAccount, RegisterResult } from '@/domain/auth';

/** Puerto de registro de cuentas (contracts/registration-gateway.md). */
export interface RegistrationGateway {
  register(account: DemoAccount): Promise<RegisterResult>;
}
