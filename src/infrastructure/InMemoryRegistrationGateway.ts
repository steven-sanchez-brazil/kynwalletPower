import type { RegistrationGateway } from '@/application/ports/RegistrationGateway';
import type { DemoAccount } from '@/domain/auth';
import type { RegistrationResult } from '@/domain/registration';
import { normalizeEmail } from '@/domain/validation';

const DEFAULT_DELAY_MS = 1000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Registro simulado en memoria (contracts/registration-gateway.md, research.md R3). No guarda nada. */
export class InMemoryRegistrationGateway implements RegistrationGateway {
  private readonly accounts: readonly DemoAccount[] | null;
  private readonly delayMs: number;

  constructor(accounts: readonly DemoAccount[] | null, options: { delayMs?: number } = {}) {
    this.accounts = accounts;
    this.delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  }

  async register(request: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<RegistrationResult> {
    await wait(this.delayMs);
    try {
      if (!this.accounts) return { kind: 'unavailable' };
      const email = normalizeEmail(request.email);
      const exists = this.accounts.some((account) => normalizeEmail(account.email) === email);
      // El mismo resultado para cualquier duplicado evita confirmar qué cuentas existen (R3).
      if (exists) return { kind: 'rejected' };
      return { kind: 'created', displayName: request.fullName };
    } catch {
      return { kind: 'unavailable' };
    }
  }
}
