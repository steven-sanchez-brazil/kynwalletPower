import type { RegistrationGateway } from '@/application/ports/RegistrationGateway';
import type { FakeRegistrationResponse, RegistrationRequest } from '@/domain/registration';

export function registrationMode(value: string | undefined): 'success' | 'unavailable' {
  return value === undefined || value === 'success' ? 'success' : 'unavailable';
}
/** API ficticia local: no realiza HTTP ni conserva solicitudes. */
export class FakeRegistrationGateway implements RegistrationGateway {
  constructor(
    private readonly mode: 'success' | 'unavailable' = 'success',
    private readonly delayMs = 500,
  ) {}
  async register(request: RegistrationRequest): Promise<FakeRegistrationResponse> {
    // El payload forma parte del contrato; no se almacena ni se registra.
    void request;
    await new Promise<void>((resolve) => setTimeout(resolve, this.delayMs));
    return this.mode === 'success'
      ? { status: 201, body: { kind: 'created' } }
      : { status: 503, body: { kind: 'unavailable' } };
  }
}
