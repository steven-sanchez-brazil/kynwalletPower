import type { FakeRegistrationResponse, RegistrationRequest } from '@/domain/registration';

export interface RegistrationGateway {
  register(request: RegistrationRequest): Promise<FakeRegistrationResponse>;
}
