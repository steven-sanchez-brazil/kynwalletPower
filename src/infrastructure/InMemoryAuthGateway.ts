import type { AuthGateway } from '@/application/ports/AuthGateway';
import type { RegistrationGateway } from '@/application/ports/RegistrationGateway';
import type { AuthResult, DemoAccount, LoginCredentials } from '@/domain/auth';
import type { RegistrationAccount, RegistrationGatewayResult } from '@/domain/registration';
import { normalizeEmail } from '@/domain/validation';

const DEFAULT_DELAY_MS = 1000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Adaptador demo compartido por registro y login; las cuentas solo viven en esta instancia. */
export class InMemoryAuthGateway implements AuthGateway, RegistrationGateway {
  private accounts: readonly DemoAccount[] | null;
  private readonly delayMs: number;

  constructor(accounts: readonly DemoAccount[] | null, options: { delayMs?: number } = {}) {
    this.accounts = accounts === null ? null : [...accounts];
    this.delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  }

  async register(account: RegistrationAccount): Promise<RegistrationGatewayResult> {
    await wait(this.delayMs);
    try {
      const email = normalizeEmail(account.email);
      const accounts = this.accounts ?? [];
      if (accounts.some((candidate) => normalizeEmail(candidate.email) === email)) {
        return { kind: 'duplicate-email' };
      }

      this.accounts = [
        ...accounts,
        { email, password: account.password, displayName: account.fullName },
      ];
      return { kind: 'success' };
    } catch {
      return { kind: 'unavailable' };
    }
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
}
