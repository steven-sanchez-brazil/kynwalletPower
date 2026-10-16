/** Datos del formulario; confirmación y términos solo participan en la validación. */
export type RegistrationInput = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>;

/** Cuenta mínima entregada al puerto, sin confirmación ni aceptación de términos. */
export type RegistrationAccount = Pick<RegistrationInput, 'fullName' | 'email' | 'password'>;

export type RegistrationGatewayResult =
  { kind: 'success' } | { kind: 'duplicate-email' } | { kind: 'unavailable' };

export type RegistrationResult =
  RegistrationGatewayResult | { kind: 'invalid-input'; errors: RegistrationErrors };

/** Textos de registro compartidos por validación y presentación (Principio IV). */
export const REGISTRATION_MESSAGES = {
  FULL_NAME_REQUIRED: 'Ingresa tu nombre completo',
  FULL_NAME_TOO_LONG: 'El nombre completo no puede superar 80 caracteres',
  CONFIRM_PASSWORD_REQUIRED: 'Confirma tu contraseña',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  TERMS_REQUIRED: 'Debes aceptar los términos y condiciones',
  DUPLICATE_EMAIL: 'Este correo ya está registrado. Inicia sesión.',
  UNAVAILABLE: 'No se pudo crear la cuenta. Intenta más tarde.',
  SUCCESS: 'Cuenta creada exitosamente',
  COMING_SOON: 'Próximamente',
} as const;
