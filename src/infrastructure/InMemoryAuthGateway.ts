import type { AuthGateway } from '@/application/ports/AuthGateway';
import type { AuthResult, DemoAccount, LoginCredentials } from '@/domain/auth';
import { normalizeEmail } from '@/domain/validation';
import { loadRegisteredUsers } from './LocalStorageUserGateway';
import { hashPassword } from './passwordHash';

const DEFAULT_DELAY_MS = 1000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Autenticación simulada en memoria y sobre registros de localStorage (contracts/auth-gateway.md, FR-012). */
export class InMemoryAuthGateway implements AuthGateway {
  private readonly accounts: readonly DemoAccount[] | null;
  private readonly delayMs: number;

  constructor(accounts: readonly DemoAccount[] | null, options: { delayMs?: number } = {}) {
    this.accounts = accounts;
    this.delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  }

  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    await wait(this.delayMs);
    try {
      const registeredUsers = loadRegisteredUsers();
      if (!this.accounts && registeredUsers.length === 0) {
        return { kind: 'unavailable' };
      }

      const email = normalizeEmail(credentials.email);
      const demoAccount = this.accounts?.find(
        (candidate) => normalizeEmail(candidate.email) === email,
      );
      if (demoAccount && demoAccount.password === credentials.password) {
        return { kind: 'success', displayName: demoAccount.displayName };
      }

      const registeredAccount = registeredUsers.find(
        (candidate) => normalizeEmail(candidate.email) === email,
      );
      if (registeredAccount) {
        const digest = await hashPassword(email, credentials.password);
        if (registeredAccount.passwordDigest === digest) {
          return { kind: 'success', displayName: registeredAccount.displayName };
        }
      }

      // Correo inexistente y contraseña incorrecta producen el mismo resultado (FR-010).
      return { kind: 'invalid-credentials' };
    } catch {
      return { kind: 'unavailable' };
    }
  }
}
