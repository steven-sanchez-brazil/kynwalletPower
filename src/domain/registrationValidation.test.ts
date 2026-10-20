import { validateRegistration } from './registrationValidation';

describe('validateRegistration', () => {
  it('accepts valid registration values and normalizes email whitespace', () => {
    expect(
      validateRegistration({
        fullName: ' Ada Lovelace ',
        email: ' ada@example.com ',
        password: 'password1',
        confirmPassword: 'password1',
        termsAccepted: true,
      }),
    ).toEqual({});
  });

  it('requires a non-whitespace full name', () => {
    expect(
      validateRegistration({
        fullName: '   ',
        email: 'ada@example.com',
        password: 'password1',
        confirmPassword: 'password1',
        termsAccepted: true,
      }).fullName,
    ).toBe('Ingresa tu nombre completo');
  });

  it('rejects an invalid email address', () => {
    expect(
      validateRegistration({
        fullName: 'Ada Lovelace',
        email: 'ada@',
        password: 'password1',
        confirmPassword: 'password1',
        termsAccepted: true,
      }).email,
    ).toBe('Ingresa un correo electrónico válido');
  });

  it('requires a password of at least eight characters without trimming it', () => {
    expect(
      validateRegistration({
        fullName: 'Ada Lovelace',
        email: 'ada@example.com',
        password: ' 123456',
        confirmPassword: ' 123456',
        termsAccepted: true,
      }).password,
    ).toBe('La contraseña debe tener al menos 8 caracteres');
  });

  it('requires matching confirmation and accepted terms', () => {
    const errors = validateRegistration({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'password1',
      confirmPassword: 'password2',
      termsAccepted: false,
    });

    expect(errors.confirmPassword).toBe('Las contraseñas no coinciden');
    expect(errors.termsAccepted).toBe('Debes aceptar los términos y condiciones');
  });
});
