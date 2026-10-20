import type { RegistrationValues } from '@/domain/registration';

export const VALID_REGISTRATION: RegistrationValues = {
  fullName: 'Diego Martínez',
  email: 'diego.martinez@example.test',
  password: 'fixture pass 01',
  passwordConfirmation: 'fixture pass 01',
  acceptedTerms: true,
};
