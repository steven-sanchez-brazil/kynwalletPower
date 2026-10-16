import { MESSAGES } from './messages';
import { REGISTRATION_MESSAGES, type RegistrationInput } from './registration';
import { validateRegistration } from './registrationValidation';

const valid: RegistrationInput = {
  fullName: 'Ana Rivera',
  email: 'ana@example.test',
  password: 'fixture-pass-02',
  confirmPassword: 'fixture-pass-02',
  acceptedTerms: true,
};

describe('validateRegistration', () => {
  it('REG-FR-005: admite una solicitud válida sin modificarla', () => {
    const input = Object.freeze({ ...valid });
    expect(validateRegistration(input)).toEqual({});
    expect(input).toEqual(valid);
  });

  it('REG-FR-006: informa todos los campos obligatorios y términos', () => {
    expect(
      validateRegistration({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptedTerms: false,
      }),
    ).toEqual({
      fullName: REGISTRATION_MESSAGES.FULL_NAME_REQUIRED,
      email: MESSAGES.EMAIL_REQUIRED,
      password: MESSAGES.PASSWORD_REQUIRED,
      confirmPassword: REGISTRATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED,
      acceptedTerms: REGISTRATION_MESSAGES.TERMS_REQUIRED,
    });
  });

  it.each(['', '   '])('REG-FR-006: nombre vacío tras trim (%j)', (fullName) => {
    expect(validateRegistration({ ...valid, fullName }).fullName).toBe(
      REGISTRATION_MESSAGES.FULL_NAME_REQUIRED,
    );
  });

  it('REG-FR-006: admite un nombre de 1–80 caracteres tras trim', () => {
    expect(validateRegistration({ ...valid, fullName: ' A ' })).toEqual({});
    expect(validateRegistration({ ...valid, fullName: ` ${'A'.repeat(80)} ` })).toEqual({});
    expect(validateRegistration({ ...valid, fullName: 'A'.repeat(81) }).fullName).toBe(
      REGISTRATION_MESSAGES.FULL_NAME_TOO_LONG,
    );
  });

  it.each(['usuario@', 'usuario.com', 'a@b.c', 'a b@c.com', `${'a'.repeat(245)}@example.test`])(
    'REG-FR-007: rechaza correo inválido o demasiado largo (%s)',
    (email) => {
      expect(validateRegistration({ ...valid, email }).email).toBe(MESSAGES.EMAIL_INVALID);
    },
  );

  it('REG-FR-007: admite el correo con espacios periféricos y mayúsculas', () => {
    expect(validateRegistration({ ...valid, email: '  ANA@Example.test ' })).toEqual({});
  });

  it.each([
    ['1234567', MESSAGES.PASSWORD_TOO_SHORT],
    ['x'.repeat(129), MESSAGES.PASSWORD_TOO_LONG],
  ])('REG-FR-008: aplica la política compartida para contraseña (%s)', (password, message) => {
    expect(validateRegistration({ ...valid, password, confirmPassword: password }).password).toBe(
      message,
    );
  });

  it.each(['12345678', 'x'.repeat(128), ' 123456 '])(
    'REG-FR-008: admite límites y espacios significativos de contraseña (%s)',
    (password) => {
      expect(validateRegistration({ ...valid, password, confirmPassword: password })).toEqual({});
    },
  );

  it.each(['FIXTURE-PASS-02', ' fixture-pass-02 ', 'fixture-pass-03'])(
    'REG-FR-009: la confirmación debe coincidir exactamente (%s)',
    (confirmPassword) => {
      expect(validateRegistration({ ...valid, confirmPassword }).confirmPassword).toBe(
        REGISTRATION_MESSAGES.PASSWORD_MISMATCH,
      );
    },
  );

  it('REG-FR-010: los términos deben aceptarse explícitamente', () => {
    expect(validateRegistration({ ...valid, acceptedTerms: false }).acceptedTerms).toBe(
      REGISTRATION_MESSAGES.TERMS_REQUIRED,
    );
  });

  it('REG-FR-005: rechaza tipos externos incorrectos sin lanzar una excepción', () => {
    const malformed = {
      fullName: 123,
      email: ['ana@example.test'],
      password: 12345678,
      confirmPassword: null,
      acceptedTerms: 'true',
    } as unknown as RegistrationInput;
    expect(validateRegistration(malformed)).toEqual({
      fullName: REGISTRATION_MESSAGES.FULL_NAME_REQUIRED,
      email: MESSAGES.EMAIL_REQUIRED,
      password: MESSAGES.PASSWORD_REQUIRED,
      confirmPassword: REGISTRATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED,
      acceptedTerms: REGISTRATION_MESSAGES.TERMS_REQUIRED,
    });
  });

  it.each([null, undefined])('REG-FR-005: rechaza una solicitud ausente (%j)', (input) => {
    expect(Object.keys(validateRegistration(input as unknown as RegistrationInput))).toHaveLength(
      5,
    );
  });
});
