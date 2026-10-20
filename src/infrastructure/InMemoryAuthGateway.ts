import type { AccountStore } from '@/application/ports/AccountStore';
import type { AuthGateway } from '@/application/ports/AuthGateway';
import type { AuthResult, DemoAccount, LoginCredentials } from '@/domain/auth';
import { normalizeEmail } from '@/domain/validation';
import { InMemoryAccountStore } from './InMemoryAccountStore';

const DEFAULT_DELAY_MS = 1000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Autenticación simulada en memoria conectada a AccountStore (contracts/registration-gateway.md, research.md R4). */
export class InMemoryAuthGateway implements AuthGateway {
  private readonly store: AccountStore | null;
  private readonly delayMs: number;

  constructor(
    store: AccountStore | readonly DemoAccount[] | null,
    options: { delayMs?: number } = {},
  ) {
    if (store === null) {
      this.store = null;
    } else if ('findByEmail' in store) {
      this.store = store;
    } else {
      this.store = new InMemoryAccountStore(store);
    }
    this.delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  }

  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    await wait(this.delayMs);
    try {
      if (!this.store) return { kind: 'unavailable' };
      const email = normalizeEmail(credentials.email);
      const account = this.store.findByEmail(email);
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
