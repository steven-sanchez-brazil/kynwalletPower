import type { RegistrationAccount, RegistrationGatewayResult } from '@/domain/registration';

/** Puerto de creación de cuentas (002-registro-usuarios/contracts/registration-gateway.md). */
export interface RegistrationGateway {
  register(account: RegistrationAccount): Promise<RegistrationGatewayResult>;
}
