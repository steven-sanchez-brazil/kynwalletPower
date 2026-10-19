/** Valores del formulario de registro antes de normalizar (data-model.md, RegistrationInput). */
export type RegistrationInput = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export type RegistrationField = keyof RegistrationInput;

export type RegistrationFieldErrors = Partial<Record<RegistrationField, string>>;

/** Resultado que devuelve el puerto RegistrationGateway. */
export type AccountCreationResult =
  { kind: 'success' } | { kind: 'duplicate-email' } | { kind: 'unavailable' };

/** Resultado del caso de uso: añade los casos que produce la aplicación. */
export type RegistrationResult =
  | AccountCreationResult
  | { kind: 'invalid'; errors: RegistrationFieldErrors }
  | { kind: 'failure' };
