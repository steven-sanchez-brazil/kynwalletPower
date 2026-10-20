import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  isValidEmail,
  normalizeEmail,
} from './validation';

export type RegistrationValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationValues, string>>;

/** Validaciones del registro de demostración (sin backend). */
export function validateRegistration(values: RegistrationValues): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const name = values.fullName.trim();
  if (!name) errors.fullName = 'Ingresa tu nombre completo';
  else if (name.length > 80) errors.fullName = 'El nombre no debe superar 80 caracteres';

  if (!normalizeEmail(values.email)) errors.email = 'Ingresa tu correo electrónico';
  else if (normalizeEmail(values.email).length > EMAIL_MAX_LENGTH || !isValidEmail(values.email)) {
    errors.email = 'Ingresa un correo electrónico válido';
  }

  if (!values.password) errors.password = 'Ingresa una contraseña';
  else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  } else if (values.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = 'La contraseña no debe superar 128 caracteres';
  }

  if (!values.confirmPassword) errors.confirmPassword = 'Confirma tu contraseña';
  else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  if (!values.acceptedTerms) errors.acceptedTerms = 'Debes aceptar los términos y condiciones';
  return errors;
}
