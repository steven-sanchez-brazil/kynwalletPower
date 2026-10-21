/** Textos visibles para el usuario. Fuente única (Constitución, Principio IV). */
export const MESSAGES = {
  EMAIL_REQUIRED: 'Ingresa tu correo electrónico',
  EMAIL_INVALID: 'Ingresa un correo electrónico válido',
  PASSWORD_REQUIRED: 'Ingresa tu contraseña',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORD_TOO_LONG: 'La contraseña no puede superar 128 caracteres',
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos',
  UNAVAILABLE: 'Servicio de acceso no disponible. Intenta más tarde.',
  FEATURE_UNAVAILABLE: 'Función no disponible en esta demostración',
  NAME_REQUIRED: 'Ingresa tu nombre completo',
  NAME_INVALID: 'Ingresa un nombre válido de 2 a 100 caracteres',
  CONFIRM_REQUIRED: 'Confirma tu contraseña',
  CONFIRM_MISMATCH: 'Las contraseñas no coinciden',
  TERMS_REQUIRED: 'Debes aceptar los términos y condiciones',
  REGISTRATION_ERROR: 'No pudimos completar el registro de demostración. Intenta nuevamente.',
  REGISTRATION_SUCCESS: 'Registro de demostración completado. No se creó una cuenta real.',
  COMING_SOON: 'Próximamente',
} as const;
