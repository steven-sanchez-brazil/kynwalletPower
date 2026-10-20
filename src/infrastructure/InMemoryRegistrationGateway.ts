import type { AccountStore } from '@/application/ports/AccountStore';
import type { RegistrationGateway } from '@/application/ports/RegistrationGateway';
import type { RegisterResult, RegistrationData } from '@/domain/auth';
import { MESSAGES } from '@/domain/messages';
import { normalizeEmail } from '@/domain/validation';

const DEFAULT_DELAY_MS = 800;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Adaptador de registro simulado en memoria conectado a AccountStore (contracts/registration-gateway.md). */
export class InMemoryRegistrationGateway implements RegistrationGateway {
  private readonly store: AccountStore;
  private readonly delayMs: number;

  constructor(store: AccountStore, options: { delayMs?: number } = {}) {
    this.store = store;
    this.delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  }

  async register(data: RegistrationData): Promise<RegisterResult> {
    await wait(this.delayMs);
    try {
      const email = normalizeEmail(data.email);
      const existing = this.store.findByEmail(email);
      if (existing) {
        return {
          kind: 'email-already-registered',
          message: MESSAGES.EMAIL_ALREADY_REGISTERED,
        };
      }

      this.store.saveAccount({
        email,
        password: data.password,
        displayName: data.fullName.trim(),
        createdAt: new Date().toISOString(),
      });

      return {
        kind: 'success',
        account: {
          email,
          displayName: data.fullName.trim(),
        },
      };
    } catch {
      return {
        kind: 'unavailable',
        message: MESSAGES.UNAVAILABLE,
      };
    }
  }
}
