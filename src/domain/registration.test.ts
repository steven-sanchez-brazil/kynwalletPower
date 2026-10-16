import { MESSAGES } from './messages';
import { validateRegistration, type RegistrationData } from './registration';

const valid: RegistrationData = {
  fullName: 'Diego Martínez',
  email: 'diego@example.test',
  password: 'clave-segura',
  passwordConfirmation: 'clave-segura',
  acceptedTerms: true,
};

describe('validateRegistration (data-model.md, FR-003 a FR-007)', () => {
  it('datos válidos → sin errores', () => {
    expect(validateRegistration(valid)).toEqual({});
  });

  it('US2-1: formulario vacío → un mensaje por cada campo', () => {
    expect(
      validateRegistration({
        fullName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        acceptedTerms: false,
      }),
    ).toEqual({
      fullName: MESSAGES.FULL_NAME_REQUIRED,
      email: MESSAGES.EMAIL_REQUIRED,
      password: MESSAGES.PASSWORD_REQUIRED,
      passwordConfirmation: MESSAGES.PASSWORD_CONFIRMATION_REQUIRED,
      acceptedTerms: MESSAGES.TERMS_REQUIRED,
    });
  });

  it('FR-003: un nombre con solo espacios es vacío', () => {
    expect(validateRegistration({ ...valid, fullName: '   ' }).fullName).toBe(
      MESSAGES.FULL_NAME_REQUIRED,
    );
  });

  it('FR-003: nombre de 80 caracteres sin contar espacios periféricos es válido; 81 no', () => {
    expect(validateRegistration({ ...valid, fullName: ` ${'a'.repeat(80)} ` })).toEqual({});
    expect(validateRegistration({ ...valid, fullName: 'a'.repeat(81) }).fullName).toBe(
      MESSAGES.FULL_NAME_TOO_LONG,
    );
  });

  it('US2-2: correo mal formado', () => {
    expect(validateRegistration({ ...valid, email: 'usuario@' }).email).toBe(
      MESSAGES.EMAIL_INVALID,
    );
  });

  it('US2-3: contraseña de 7 caracteres', () => {
    const errors = validateRegistration({
      ...valid,
      password: '1234567',
      passwordConfirmation: '1234567',
    });
    expect(errors).toEqual({ password: MESSAGES.PASSWORD_TOO_SHORT });
  });

  it('US2-4: confirmación distinta de la contraseña', () => {
    expect(
      validateRegistration({ ...valid, passwordConfirmation: 'clave-segurA' }).passwordConfirmation,
    ).toBe(MESSAGES.PASSWORDS_DO_NOT_MATCH);
  });

  it('Caso límite: la confirmación se compara sin recortar espacios', () => {
    expect(
      validateRegistration({ ...valid, passwordConfirmation: ' clave-segura' })
        .passwordConfirmation,
    ).toBe(MESSAGES.PASSWORDS_DO_NOT_MATCH);
  });

  it('FR-007: términos sin aceptar', () => {
    expect(validateRegistration({ ...valid, acceptedTerms: false })).toEqual({
      acceptedTerms: MESSAGES.TERMS_REQUIRED,
    });
  });
});
