import type { RegistrationGateway } from '@/application/ports/RegistrationGateway';
import type { DemoAccount, RegistrationData, RegistrationResult } from '@/domain/auth';
import { normalizeEmail } from '@/domain/validation';

const DEFAULT_DELAY_MS = 1000;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Registro simulado en memoria (contracts/registration-gateway.md, research.md R3).
 * No persiste la cuenta creada.
 */
export class InMemoryRegistrationGateway implements RegistrationGateway {
  private readonly accounts: readonly DemoAccount[] | null;
  private readonly delayMs: number;

  constructor(accounts: readonly DemoAccount[] | null, options: { delayMs?: number } = {}) {
    this.accounts = accounts;
    this.delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  }

  async register(data: RegistrationData): Promise<RegistrationResult> {
    await wait(this.delayMs);
    try {
      if (!this.accounts) return { kind: 'unavailable' };
      const email = normalizeEmail(data.email);
      const taken = this.accounts.some((account) => normalizeEmail(account.email) === email);
      if (taken) return { kind: 'email-taken' };
      return { kind: 'success', displayName: data.name };
    } catch {
      return { kind: 'unavailable' };
    }
  }
}
