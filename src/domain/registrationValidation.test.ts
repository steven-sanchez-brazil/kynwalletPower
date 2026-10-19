import { MESSAGES } from './messages';
import type { RegistrationForm } from './registration';
import { normalizeFullName, validateRegistration } from './registrationValidation';

const valid: RegistrationForm = {
  fullName: 'Diego Martínez',
  email: 'diego@example.test',
  password: 'secreto-123',
  confirmPassword: 'secreto-123',
  acceptedTerms: true,
};

describe('normalizeFullName', () => {
  it('recorta los extremos y colapsa los espacios internos', () => {
    expect(normalizeFullName('  Diego    Martínez ')).toBe('Diego Martínez');
  });
});

describe('validateRegistration (data-model.md)', () => {
  it('formulario válido → {}', () => {
    expect(validateRegistration(valid)).toEqual({});
  });

  it('US2-1: formulario vacío → todos los mensajes de obligatorio', () => {
    expect(
      validateRegistration({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptedTerms: false,
      }),
    ).toEqual({
      fullName: MESSAGES.FULL_NAME_REQUIRED,
      email: MESSAGES.EMAIL_REQUIRED,
      password: MESSAGES.PASSWORD_REQUIRED,
      confirmPassword: MESSAGES.CONFIRM_PASSWORD_REQUIRED,
      acceptedTerms: MESSAGES.TERMS_REQUIRED,
    });
  });

  it('FR-004: nombre solo con espacios → FULL_NAME_REQUIRED', () => {
    expect(validateRegistration({ ...valid, fullName: '   ' }).fullName).toBe(
      MESSAGES.FULL_NAME_REQUIRED,
    );
  });

  it.each(['Diego123', 'Ana_Ruiz', 'J', '<script>', '-Ana'])(
    'FR-004: nombre inválido (%s) → FULL_NAME_INVALID',
    (fullName) => {
      expect(validateRegistration({ ...valid, fullName }).fullName).toBe(
        MESSAGES.FULL_NAME_INVALID,
      );
    },
  );

  it.each(['María José Núñez', "O'Connor", 'Ana-Luz Peña', 'J. R. Tolkien', 'Zoë'])(
    'FR-004: nombre válido (%s)',
    (fullName) => {
      expect(validateRegistration({ ...valid, fullName })).toEqual({});
    },
  );

  it('FR-004: nombre de más de 80 caracteres → FULL_NAME_INVALID', () => {
    expect(validateRegistration({ ...valid, fullName: 'a'.repeat(81) }).fullName).toBe(
      MESSAGES.FULL_NAME_INVALID,
    );
  });

  it('US2-2: correo sin formato válido → EMAIL_INVALID', () => {
    expect(validateRegistration({ ...valid, email: 'usuario@' }).email).toBe(
      MESSAGES.EMAIL_INVALID,
    );
  });

  it('US2-3: contraseña de 7 caracteres → PASSWORD_TOO_SHORT', () => {
    const errors = validateRegistration({
      ...valid,
      password: '1234567',
      confirmPassword: '1234567',
    });
    expect(errors.password).toBe(MESSAGES.PASSWORD_TOO_SHORT);
  });

  it('FR-006: contraseña de más de 128 caracteres → PASSWORD_TOO_LONG', () => {
    const long = 'x'.repeat(129);
    expect(validateRegistration({ ...valid, password: long, confirmPassword: long }).password).toBe(
      MESSAGES.PASSWORD_TOO_LONG,
    );
  });

  it('US2-4: confirmación distinta → PASSWORDS_DO_NOT_MATCH', () => {
    expect(validateRegistration({ ...valid, confirmPassword: 'secreto-124' }).confirmPassword).toBe(
      MESSAGES.PASSWORDS_DO_NOT_MATCH,
    );
  });

  it('las contraseñas no se recortan: un espacio extra no coincide', () => {
    expect(
      validateRegistration({ ...valid, confirmPassword: `${valid.password} ` }).confirmPassword,
    ).toBe(MESSAGES.PASSWORDS_DO_NOT_MATCH);
  });

  it('FR-008: términos sin aceptar → TERMS_REQUIRED', () => {
    expect(validateRegistration({ ...valid, acceptedTerms: false }).acceptedTerms).toBe(
      MESSAGES.TERMS_REQUIRED,
    );
  });
});
