import type { RegistrationData, RegisterResult } from '@/domain/auth';

/**
 * Puerto para procesar el registro de nuevos usuarios en la billetera virtual.
 */
export interface RegistrationGateway {
  /**
   * Procesa la solicitud de registro de un usuario.
   *
   * @param data Datos validados del formulario de registro.
   * @returns Promesa con el resultado de la operación (éxito, error de duplicado o indisponibilidad).
   */
  register(data: RegistrationData): Promise<RegisterResult>;
}
