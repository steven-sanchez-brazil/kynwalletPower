import type { RegistrationGateway } from '@/application/ports/RegistrationGateway';
import type { DemoAccount } from '@/domain/auth';
import type { RegistrationResult } from '@/domain/registration';
import { normalizeEmail } from '@/domain/validation';

const DEFAULT_DELAY_MS = 1000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Registro simulado en memoria (contracts/registration-gateway.md, research.md R3).
 * Agrega la cuenta al mismo arreglo que usa InMemoryAuthGateway, así la cuenta nueva puede
 * iniciar sesión. Nada se persiste: las cuentas se pierden al recargar la página.
 */
export class InMemoryRegistrationGateway implements RegistrationGateway {
  private readonly accounts: DemoAccount[] | null;
  private readonly delayMs: number;

  constructor(accounts: DemoAccount[] | null, options: { delayMs?: number } = {}) {
    this.accounts = accounts;
    this.delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  }

  async register(account: DemoAccount): Promise<RegistrationResult> {
    await wait(this.delayMs);
    try {
      if (!this.accounts) return { kind: 'unavailable' };
      const email = normalizeEmail(account.email);
      const taken = this.accounts.some((candidate) => normalizeEmail(candidate.email) === email);
      if (taken) return { kind: 'email-taken' };
      this.accounts.push({ ...account, email });
      return { kind: 'success' };
    } catch {
      return { kind: 'unavailable' };
    }
  }
}
