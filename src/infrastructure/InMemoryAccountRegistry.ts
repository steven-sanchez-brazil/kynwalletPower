import type { AccountRegistry } from '@/application/ports/AccountRegistry';
import type { DemoAccount } from '@/domain/auth';
import type { RegistrationResult } from '@/domain/registration';
import { normalizeEmail } from '@/domain/validation';

const DEFAULT_DELAY_MS = 1000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Registro simulado en memoria (contracts/account-registry.md, research.md R4). Agrega la cuenta a
 * la misma lista que lee `InMemoryAuthGateway`, por lo que sirve para iniciar sesión.
 */
export class InMemoryAccountRegistry implements AccountRegistry {
  private readonly accounts: DemoAccount[] | null;
  private readonly delayMs: number;

  constructor(accounts: DemoAccount[] | null, options: { delayMs?: number } = {}) {
    this.accounts = accounts;
    this.delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  }

  async register(account: DemoAccount): Promise<RegistrationResult> {
    await wait(this.delayMs);
    if (!this.accounts) return { kind: 'unavailable' };
    const email = normalizeEmail(account.email);
    if (this.accounts.some((existing) => normalizeEmail(existing.email) === email)) {
      return { kind: 'email-taken' };
    }
    this.accounts.push({ ...account, email });
    return { kind: 'success' };
  }
}
