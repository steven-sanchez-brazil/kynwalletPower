import type { RegistrationSimulator } from '@/application/ports/RegistrationSimulator';
import type { RegistrationResult } from '@/domain/registration';

type Options = {
  delayMs?: number;
  result?: RegistrationResult;
};

export class InMemoryRegistrationSimulator implements RegistrationSimulator {
  private readonly delayMs: number;
  private readonly result: RegistrationResult;

  constructor({ delayMs = 750, result = 'success' }: Options = {}) {
    this.delayMs = delayMs;
    this.result = result;
  }

  async simulate(): Promise<RegistrationResult> {
    await new Promise<void>((resolve) => setTimeout(resolve, this.delayMs));
    return this.result;
  }
}
