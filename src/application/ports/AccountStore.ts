import type { DemoAccount } from '@/domain/auth';

/**
 * Almacén en memoria compartido para cuentas de demostración y usuarios registrados.
 */
export interface AccountStore {
  /**
   * Obtiene la lista de cuentas disponibles.
   */
  getAccounts(): readonly DemoAccount[];

  /**
   * Busca una cuenta por su correo electrónico (búsqueda normalizada e insensible a mayúsculas).
   */
  findByEmail(email: string): DemoAccount | undefined;

  /**
   * Registra una nueva cuenta en el almacén.
   * @throws Error si ya existe una cuenta con el mismo correo.
   */
  saveAccount(account: DemoAccount): void;
}
