import type { AuthGateway } from '@/application/ports/AuthGateway';
import type { RegistrationGateway } from '@/application/ports/RegistrationGateway';
import type { AuthResult, DemoAccount, LoginCredentials } from '@/domain/auth';
import type { AccountCreationResult } from '@/domain/registration';
import { normalizeEmail } from '@/domain/validation';

const DEFAULT_DELAY_MS = 1000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Colección de cuentas en memoria compartida por autenticación y registro
 * (contracts/auth-gateway.md, contracts/registration-gateway.md y research.md R4/R5).
 */
export class InMemoryAuthGateway implements AuthGateway, RegistrationGateway {
  // Copia superficial: no muta el arreglo recibido. Los elementos no se clonan aquí.
  private readonly accounts: DemoAccount[] | null;
  private readonly delayMs: number;

  constructor(accounts: readonly DemoAccount[] | null, options: { delayMs?: number } = {}) {
    this.accounts = accounts ? [...accounts] : null;
    this.delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  }

  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    await wait(this.delayMs);
    try {
      if (!this.accounts) return { kind: 'unavailable' };
      const email = normalizeEmail(credentials.email);
      const account = this.accounts.find((candidate) => normalizeEmail(candidate.email) === email);
      // Correo inexistente y contraseña incorrecta producen el mismo resultado (FR-010).
      if (!account || account.password !== credentials.password) {
        return { kind: 'invalid-credentials' };
      }
      return { kind: 'success', displayName: account.displayName };
    } catch {
      return { kind: 'unavailable' };
    }
  }

  async register(account: DemoAccount): Promise<AccountCreationResult> {
    await wait(this.delayMs);
    try {
      if (!this.accounts) return { kind: 'unavailable' };
      // Comprobación e inserción en una sola sección síncrona: dos altas simultáneas del
      // mismo correo no pueden tener éxito a la vez.
      const email = normalizeEmail(account.email);
      if (this.accounts.some((candidate) => normalizeEmail(candidate.email) === email)) {
        return { kind: 'duplicate-email' };
      }
      this.accounts.push({ ...account, email });
      return { kind: 'success' };
    } catch {
      return { kind: 'unavailable' };
    }
  }
}
