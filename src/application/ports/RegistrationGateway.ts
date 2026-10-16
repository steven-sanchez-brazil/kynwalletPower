/** La demo solo simula una espera: ningún dato del formulario cruza este puerto. */
export interface RegistrationGateway {
  submit(): Promise<void>;
}
