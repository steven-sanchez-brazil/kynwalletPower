import type { RegistrationValues, RegistrationResult } from '@/domain/registration';
import type { Register } from '@/application/register';
import { TEST_ACCOUNT } from './fixtures';

export const REGISTRATION_VALUES: RegistrationValues = {
  fullName: 'Diego Martínez',
  email: 'diego@example.com',
  password: TEST_ACCOUNT.password,
  confirmPassword: TEST_ACCOUNT.password,
  acceptedTerms: true,
};
export function createRegistrationStub(result: RegistrationResult = { kind: 'created' }) {
  const register = vi.fn<Register>().mockResolvedValue(result);
  return { register };
}
