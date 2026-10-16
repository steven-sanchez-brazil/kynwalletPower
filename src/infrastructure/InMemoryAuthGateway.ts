import type { AuthGateway } from '@/application/ports/AuthGateway';
import type { RegistrationGateway } from '@/application/ports/RegistrationGateway';
import type { AuthResult, DemoAccount, LoginCredentials, RegisterResult } from '@/domain/auth';
import { normalizeEmail } from '@/domain/validation';

const DEFAULT_DELAY_MS = 1000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Autenticación y registro simulados en memoria (contracts/auth-gateway.md,
 * contracts/registration-gateway.md). Las cuentas registradas se pierden al recargar.
 */
export class InMemoryAuthGateway implements AuthGateway, RegistrationGateway {
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
      const account = this.findByEmail(this.accounts, credentials.email);
      // Correo inexistente y contraseña incorrecta producen el mismo resultado (FR-010).
      if (!account || account.password !== credentials.password) {
        return { kind: 'invalid-credentials' };
      }
      return { kind: 'success', displayName: account.displayName };
    } catch {
      return { kind: 'unavailable' };
    }
  }

  async register(account: DemoAccount): Promise<RegisterResult> {
    await wait(this.delayMs);
    try {
      if (!this.accounts) return { kind: 'unavailable' };
      if (this.findByEmail(this.accounts, account.email)) return { kind: 'email-taken' };
      this.accounts.push({ ...account, email: normalizeEmail(account.email) });
      return { kind: 'success' };
    } catch {
      return { kind: 'unavailable' };
    }
  }

  private findByEmail(accounts: readonly DemoAccount[], email: string): DemoAccount | undefined {
    const normalized = normalizeEmail(email);
    return accounts.find((candidate) => normalizeEmail(candidate.email) === normalized);
  }
}
