import type { DemoAccount, RegisterResult } from '@/domain/auth';
import type { RegistrationData } from '@/domain/registration';
import type { RegistrationGateway } from './ports/RegistrationGateway';
import { createRegister } from './register';

const data: RegistrationData = {
  fullName: '  Diego Martínez ',
  email: '  Diego@Example.TEST ',
  password: ' clave segura ',
  passwordConfirmation: ' clave segura ',
  acceptedTerms: true,
};

function gatewayReturning(result: RegisterResult) {
  const register = vi.fn<(account: DemoAccount) => Promise<RegisterResult>>(async () => result);
  const gateway: RegistrationGateway = { register };
  return { gateway, register };
}

describe('createRegister (contracts/registration-gateway.md)', () => {
  it('US1-1: entrega al puerto la cuenta normalizada y devuelve su resultado', async () => {
    const { gateway, register } = gatewayReturning({ kind: 'success' });

    await expect(createRegister(gateway)(data)).resolves.toEqual({ kind: 'success' });

    expect(register).toHaveBeenCalledWith({
      email: 'diego@example.test',
      password: ' clave segura ',
      displayName: 'Diego Martínez',
    });
  });

  it('US3-1: propaga email-taken', async () => {
    const { gateway } = gatewayReturning({ kind: 'email-taken' });
    await expect(createRegister(gateway)(data)).resolves.toEqual({ kind: 'email-taken' });
  });

  it('FR-023: una excepción del puerto → unavailable', async () => {
    const gateway: RegistrationGateway = { register: () => Promise.reject(new Error('boom')) };
    await expect(createRegister(gateway)(data)).resolves.toEqual({ kind: 'unavailable' });
  });
});
