import type { RegistrationGateway } from '@/application/ports/RegistrationGateway';

/** Simula una espera local; no recibe datos ni realiza operaciones externas. */
export class InMemoryRegistrationGateway implements RegistrationGateway {
  constructor(
    private readonly delayMs = 350,
    private readonly shouldReject = false,
  ) {}

  async simulate(): Promise<void> {
    await new Promise<void>((resolve) => window.setTimeout(resolve, this.delayMs));
    if (this.shouldReject) throw new Error('Simulated registration failure');
  }
}
