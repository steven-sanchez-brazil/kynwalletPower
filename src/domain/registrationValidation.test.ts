import { MESSAGES } from './messages';
import type { RegistrationInput } from './registration';
import { validateRegistration } from './registrationValidation';

const valid: RegistrationInput = {
  displayName: 'Diego Martínez',
  email: 'diego@example.test',
  password: 'secreto-123',
  confirmPassword: 'secreto-123',
  acceptedTerms: true,
};

describe('validateRegistration (data-model.md)', () => {
  it('entrada válida → {}', () => {
    expect(validateRegistration(valid)).toEqual({});
  });

  it('REG US2-1: formulario vacío → un error por campo, en el orden del formulario', () => {
    const errors = validateRegistration({
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    });
    expect(Object.keys(errors)).toEqual([
      'displayName',
      'email',
      'password',
      'confirmPassword',
      'acceptedTerms',
    ]);
    expect(errors).toEqual({
      displayName: MESSAGES.NAME_REQUIRED,
      email: MESSAGES.EMAIL_REQUIRED,
      password: MESSAGES.PASSWORD_REQUIRED,
      confirmPassword: MESSAGES.CONFIRM_REQUIRED,
      acceptedTerms: MESSAGES.TERMS_REQUIRED,
    });
  });

  describe('REG FR-002: displayName "Obligatorio, trim y 1–80 caracteres"', () => {
    it.each(['', '   '])('vacío tras trim (%j) → NAME_REQUIRED', (displayName) => {
      expect(validateRegistration({ ...valid, displayName }).displayName).toBe(
        MESSAGES.NAME_REQUIRED,
      );
    });

    it('81 caracteres → NAME_TOO_LONG', () => {
      expect(validateRegistration({ ...valid, displayName: 'a'.repeat(81) }).displayName).toBe(
        MESSAGES.NAME_TOO_LONG,
      );
    });

    it('80 caracteres, también con espacios periféricos → válido', () => {
      expect(validateRegistration({ ...valid, displayName: 'a'.repeat(80) })).toEqual({});
      expect(validateRegistration({ ...valid, displayName: ` ${'a'.repeat(80)} ` })).toEqual({});
    });
  });

  describe('REG FR-003: email "Obligatorio, formato válido, máximo 254 caracteres"', () => {
    it.each(['', '   '])('vacío tras trim (%j) → EMAIL_REQUIRED', (email) => {
      expect(validateRegistration({ ...valid, email }).email).toBe(MESSAGES.EMAIL_REQUIRED);
    });

    it.each(['usuario@', 'usuario.com', 'a@b.c', 'a b@c.com'])(
      'REG US2-2: formato inválido (%s) → EMAIL_INVALID',
      (email) => {
        expect(validateRegistration({ ...valid, email }).email).toBe(MESSAGES.EMAIL_INVALID);
      },
    );

    it('254 caracteres es válido y 255 no', () => {
      const domain = '@example.test';
      const at254 = `${'a'.repeat(254 - domain.length)}${domain}`;
      expect(at254).toHaveLength(254);
      expect(
        validateRegistration({ ...valid, email: at254, confirmPassword: valid.password }),
      ).toEqual({});
      expect(validateRegistration({ ...valid, email: `a${at254}` }).email).toBe(
        MESSAGES.EMAIL_INVALID,
      );
    });

    it('acepta el correo con mayúsculas y espacios periféricos', () => {
      expect(validateRegistration({ ...valid, email: '  Diego@Example.test ' })).toEqual({});
    });
  });

  describe('REG FR-004: password "Obligatorio, 8–128 caracteres" sin recortar', () => {
    it('vacía → PASSWORD_REQUIRED', () => {
      expect(validateRegistration({ ...valid, password: '' }).password).toBe(
        MESSAGES.PASSWORD_REQUIRED,
      );
    });

    it('REG US2-2: 7 caracteres → PASSWORD_TOO_SHORT', () => {
      const errors = validateRegistration({
        ...valid,
        password: '1234567',
        confirmPassword: '1234567',
      });
      expect(errors).toEqual({ password: MESSAGES.PASSWORD_TOO_SHORT });
    });

    it('129 caracteres → PASSWORD_TOO_LONG; 128 es válida', () => {
      const long = 'x'.repeat(129);
      expect(
        validateRegistration({ ...valid, password: long, confirmPassword: long }).password,
      ).toBe(MESSAGES.PASSWORD_TOO_LONG);
      const max = 'x'.repeat(128);
      expect(validateRegistration({ ...valid, password: max, confirmPassword: max })).toEqual({});
    });

    it('los espacios cuentan: 8 espacios son válidos', () => {
      const spaces = '        ';
      expect(validateRegistration({ ...valid, password: spaces, confirmPassword: spaces })).toEqual(
        {},
      );
    });
  });

  describe('REG FR-005: confirmPassword "Obligatorio; coincidencia exacta con password"', () => {
    it('vacía → CONFIRM_REQUIRED', () => {
      expect(validateRegistration({ ...valid, confirmPassword: '' }).confirmPassword).toBe(
        MESSAGES.CONFIRM_REQUIRED,
      );
    });

    it('REG US2-3: distinta → CONFIRM_MISMATCH', () => {
      expect(validateRegistration({ ...valid, confirmPassword: 'secreto-124' })).toEqual({
        confirmPassword: MESSAGES.CONFIRM_MISMATCH,
      });
    });

    it('no recorta ni cambia mayúsculas al comparar', () => {
      expect(
        validateRegistration({ ...valid, confirmPassword: ' secreto-123' }).confirmPassword,
      ).toBe(MESSAGES.CONFIRM_MISMATCH);
      expect(
        validateRegistration({ ...valid, confirmPassword: 'SECRETO-123' }).confirmPassword,
      ).toBe(MESSAGES.CONFIRM_MISMATCH);
    });

    it('cambiar la contraseña invalida una confirmación que ya no coincide', () => {
      expect(validateRegistration({ ...valid, password: 'otra-clave-9' }).confirmPassword).toBe(
        MESSAGES.CONFIRM_MISMATCH,
      );
    });
  });

  it('REG US2-4: acceptedTerms "Debe ser true" → TERMS_REQUIRED', () => {
    expect(validateRegistration({ ...valid, acceptedTerms: false })).toEqual({
      acceptedTerms: MESSAGES.TERMS_REQUIRED,
    });
  });
});
