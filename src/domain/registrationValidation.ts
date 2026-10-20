import { isValidEmail, normalizeEmail } from './validation';

export type RegistrationValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegistrationInput = RegistrationValues & {
  termsAccepted: boolean;
};

export type RegistrationField = keyof RegistrationValues;
export type RegistrationErrorField = RegistrationField | 'termsAccepted';
export type RegistrationErrors = Partial<Record<RegistrationErrorField, string>>;

export function validateRegistration(input: RegistrationInput): RegistrationErrors {
  const errors: RegistrationErrors = {};

  if (!input.fullName.trim()) {
    errors.fullName = 'Ingresa tu nombre completo';
  }

  const normalizedEmail = normalizeEmail(input.email);
  if (!normalizedEmail) {
    errors.email = 'Ingresa tu correo electrónico';
  } else if (!isValidEmail(normalizedEmail)) {
    errors.email = 'Ingresa un correo electrónico válido';
  }

  if (!input.password) {
    errors.password = 'Ingresa tu contraseña';
  } else if (input.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  if (!input.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña';
  } else if (input.confirmPassword !== input.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  if (!input.termsAccepted) {
    errors.termsAccepted = 'Debes aceptar los términos y condiciones';
  }

  return errors;
}
