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

  // Registro de usuario
  FULL_NAME_REQUIRED: 'Ingresa tu nombre completo',
  CONFIRM_PASSWORD_REQUIRED: 'Confirma tu contraseña',
  PASSWORDS_DO_NOT_MATCH: 'Las contraseñas no coinciden',
  TERMS_REQUIRED: 'Debes aceptar los términos y condiciones',
  EMAIL_ALREADY_REGISTERED: 'Este correo electrónico ya se encuentra registrado',
  REGISTRATION_SUCCESS: '¡Registro exitoso! Redirigiendo a iniciar sesión...',
  COMING_SOON: 'Próximamente',
} as const;
