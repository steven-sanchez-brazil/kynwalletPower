/** Puerto de la demostración: no recibe datos personales ni crea cuentas. */
export interface RegistrationGateway {
  simulate(): Promise<void>;
}
