/** Textos visibles para el usuario. Fuente única (Constitución, Principio IV). */
export const MESSAGES = {
  NAME_REQUIRED: 'Ingresa tu nombre completo',
  NAME_TOO_LONG: 'El nombre completo no puede superar 100 caracteres',
  EMAIL_TOO_LONG: 'El correo electrónico no puede superar 254 caracteres',
  CONFIRM_REQUIRED: 'Confirma tu contraseña',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  TERMS_REQUIRED: 'Debes aceptar los términos y condiciones',
  TERMS_UNAVAILABLE: 'Términos y condiciones no disponibles en esta demostración',
  SOCIAL_SOON: 'Próximamente',
  REGISTRATION_FAILED: 'No se pudo completar la demostración. Intenta de nuevo',
  REGISTRATION_SUCCESS:
    'Registro de demostración exitoso. Puedes iniciar sesión con una cuenta de demostración',
  DEMO_NOTICE: 'Demostración: no se creará una cuenta real. Usa datos ficticios',
  EMAIL_REQUIRED: 'Ingresa tu correo electrónico',
  EMAIL_INVALID: 'Ingresa un correo electrónico válido',
  PASSWORD_REQUIRED: 'Ingresa tu contraseña',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORD_TOO_LONG: 'La contraseña no puede superar 128 caracteres',
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos',
  UNAVAILABLE: 'Servicio de acceso no disponible. Intenta más tarde.',
  FEATURE_UNAVAILABLE: 'Función no disponible en esta demostración',
} as const;
