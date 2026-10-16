import type { RegistrationGateway } from '@/application/ports/RegistrationGateway';

export class SimulatedRegistrationGateway implements RegistrationGateway {
  constructor(private readonly delayMs = 1000) {}

  async submit(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, this.delayMs));
  }
}
