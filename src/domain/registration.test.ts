import { MESSAGES } from './messages';
import { validateRegistration, type RegistrationData } from './registration';

const valid: RegistrationData = {
  fullName: 'Diego Martínez',
  email: 'diego@example.test',
  password: 'clave-segura-1',
  confirmPassword: 'clave-segura-1',
  acceptTerms: true,
};

describe('validateRegistration (data-model.md)', () => {
  it('datos válidos → {}', () => {
    expect(validateRegistration(valid)).toEqual({});
  });

  it('US2-1: formulario vacío → un error por cada campo obligatorio', () => {
    expect(
      validateRegistration({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
      }),
    ).toEqual({
      fullName: MESSAGES.NAME_REQUIRED,
      email: MESSAGES.EMAIL_REQUIRED,
      password: MESSAGES.PASSWORD_REQUIRED,
      confirmPassword: MESSAGES.CONFIRM_REQUIRED,
      acceptTerms: MESSAGES.TERMS_REQUIRED,
    });
  });

  it('FR-003: nombre de solo espacios → NAME_REQUIRED', () => {
    expect(validateRegistration({ ...valid, fullName: '   ' }).fullName).toBe(
      MESSAGES.NAME_REQUIRED,
    );
  });

  it('FR-003: nombre de 80 caracteres (con espacios periféricos) es válido; 81 no', () => {
    expect(validateRegistration({ ...valid, fullName: ` ${'a'.repeat(80)} ` })).toEqual({});
    expect(validateRegistration({ ...valid, fullName: 'a'.repeat(81) }).fullName).toBe(
      MESSAGES.NAME_TOO_LONG,
    );
  });

  it.each(['usuario@', 'usuario.com'])('US2-2: correo inválido (%s) → EMAIL_INVALID', (email) => {
    expect(validateRegistration({ ...valid, email }).email).toBe(MESSAGES.EMAIL_INVALID);
  });

  it('US2-3: contraseña de 7 caracteres → PASSWORD_TOO_SHORT', () => {
    const data = { ...valid, password: '1234567', confirmPassword: '1234567' };
    expect(validateRegistration(data).password).toBe(MESSAGES.PASSWORD_TOO_SHORT);
  });

  it('FR-005: contraseña de > 128 caracteres → PASSWORD_TOO_LONG', () => {
    const long = 'x'.repeat(129);
    expect(validateRegistration({ ...valid, password: long, confirmPassword: long }).password).toBe(
      MESSAGES.PASSWORD_TOO_LONG,
    );
  });

  it('US2-4: confirmación distinta → PASSWORD_MISMATCH', () => {
    expect(validateRegistration({ ...valid, confirmPassword: 'otra-clave-1' })).toEqual({
      confirmPassword: MESSAGES.PASSWORD_MISMATCH,
    });
  });

  it('FR-006: la comparación es exacta, sin recortar espacios', () => {
    expect(
      validateRegistration({ ...valid, password: ' clave-123 ', confirmPassword: 'clave-123' })
        .confirmPassword,
    ).toBe(MESSAGES.PASSWORD_MISMATCH);
    expect(
      validateRegistration({ ...valid, password: ' clave-123 ', confirmPassword: ' clave-123 ' }),
    ).toEqual({});
  });

  it('US2-7: términos sin aceptar → TERMS_REQUIRED', () => {
    expect(validateRegistration({ ...valid, acceptTerms: false })).toEqual({
      acceptTerms: MESSAGES.TERMS_REQUIRED,
    });
  });
});
