import { MESSAGES } from './messages';
import {
  isStrongPassword,
  normalizeEmail,
  validateConfirmPassword,
  validateCredentials,
  validateFullName,
  validateRegistration,
  validateStrongPassword,
} from './validation';

describe('normalizeEmail', () => {
  it('US1-3: recorta espacios periféricos y convierte a minúsculas', () => {
    expect(normalizeEmail('  Demo@Example.COM ')).toBe('demo@example.com');
  });

  it('no altera el contenido interior', () => {
    expect(normalizeEmail('a.b+c@d.com')).toBe('a.b+c@d.com');
  });
});

describe('validateCredentials (data-model.md)', () => {
  const valid = { email: 'ana@example.test', password: 'secreto-123' };

  it('credenciales válidas → {}', () => {
    expect(validateCredentials(valid)).toEqual({});
  });

  it.each(['', '   '])('correo vacío tras trim (%j) → EMAIL_REQUIRED', (email) => {
    expect(validateCredentials({ ...valid, email }).email).toBe(MESSAGES.EMAIL_REQUIRED);
  });

  it.each(['usuario@', 'usuario.com', 'a@b.c', 'a b@c.com'])(
    'US3-2: correo sin formato válido (%s) → EMAIL_INVALID',
    (email) => {
      expect(validateCredentials({ ...valid, email }).email).toBe(MESSAGES.EMAIL_INVALID);
    },
  );

  it('correo de > 254 caracteres → EMAIL_INVALID', () => {
    const email = `${'a'.repeat(245)}@example.test`;
    expect(email.length).toBeGreaterThan(254);
    expect(validateCredentials({ ...valid, email }).email).toBe(MESSAGES.EMAIL_INVALID);
  });

  it('acepta el correo con espacios periféricos', () => {
    expect(validateCredentials({ ...valid, email: '  Ana@Example.test ' })).toEqual({});
  });

  it('contraseña vacía → PASSWORD_REQUIRED', () => {
    expect(validateCredentials({ ...valid, password: '' }).password).toBe(
      MESSAGES.PASSWORD_REQUIRED,
    );
  });

  it('US3-3: contraseña de < 8 caracteres → PASSWORD_TOO_SHORT', () => {
    expect(validateCredentials({ ...valid, password: '1234567' }).password).toBe(
      MESSAGES.PASSWORD_TOO_SHORT,
    );
  });

  it('contraseña de > 128 caracteres → PASSWORD_TOO_LONG', () => {
    expect(validateCredentials({ ...valid, password: 'x'.repeat(129) }).password).toBe(
      MESSAGES.PASSWORD_TOO_LONG,
    );
  });

  it('la contraseña no se recorta: 7 caracteres + espacios cuenta los espacios', () => {
    expect(validateCredentials({ ...valid, password: ' 123456 ' })).toEqual({});
    expect(validateCredentials({ ...valid, password: '        ' })).toEqual({});
  });
});

describe('validateRegistration e isStrongPassword (002-registro-billetera data-model.md)', () => {
  const validInput = {
    fullName: 'Ana Gómez',
    email: 'ana.gomez@example.test',
    password: 'KynWallet2026!',
    confirmPassword: 'KynWallet2026!',
    acceptedTerms: true,
  };

  it('US1-3: datos de registro válidos → {}', () => {
    expect(validateRegistration(validInput)).toEqual({});
    expect(isStrongPassword(validInput.password)).toBe(true);
  });

  it.each(['', '   '])(
    'US2-1 / FR-002: nombres vacíos tras trim (%j) → FULL_NAME_REQUIRED',
    (fullName) => {
      expect(validateFullName(fullName)).toBe(MESSAGES.FULL_NAME_REQUIRED);
      expect(validateRegistration({ ...validInput, fullName }).fullName).toBe(
        MESSAGES.FULL_NAME_REQUIRED,
      );
    },
  );

  it('FR-002: nombres completos de > 80 caracteres → FULL_NAME_TOO_LONG', () => {
    const fullName = 'A'.repeat(81);
    expect(validateFullName(fullName)).toBe(MESSAGES.FULL_NAME_TOO_LONG);
    expect(validateRegistration({ ...validInput, fullName }).fullName).toBe(
      MESSAGES.FULL_NAME_TOO_LONG,
    );
  });

  it.each([
    ['menos de 8 caracteres', 'Ab1!xyz'],
    ['sin mayúscula', 'kynwallet2026!'],
    ['sin minúscula', 'KYNWALLET2026!'],
    ['sin número', 'KynWallet!@#$'],
    ['sin carácter especial', 'KynWallet2026'],
  ])('US2-3 / FR-004: contraseña débil (%s) → PASSWORD_WEAK', (_reason, password) => {
    expect(isStrongPassword(password)).toBe(false);
    expect(validateStrongPassword(password)).toBe(MESSAGES.PASSWORD_WEAK);
    expect(
      validateRegistration({ ...validInput, password, confirmPassword: password }).password,
    ).toBe(MESSAGES.PASSWORD_WEAK);
  });

  it('FR-004: contraseña vacía → PASSWORD_REQUIRED y > 128 caracteres → PASSWORD_TOO_LONG', () => {
    expect(validateStrongPassword('')).toBe(MESSAGES.PASSWORD_REQUIRED);
    const tooLong = `Aa1!${'x'.repeat(125)}`;
    expect(validateStrongPassword(tooLong)).toBe(MESSAGES.PASSWORD_TOO_LONG);
  });

  it('US2-4 / FR-005: confirmar contraseña vacía → CONFIRM_PASSWORD_REQUIRED', () => {
    expect(validateConfirmPassword('KynWallet2026!', '')).toBe(MESSAGES.CONFIRM_PASSWORD_REQUIRED);
  });

  it('US2-4 / FR-005: confirmar contraseña distinta → CONFIRM_PASSWORD_MISMATCH', () => {
    expect(validateConfirmPassword('KynWallet2026!', 'OtraClave2026!')).toBe(
      MESSAGES.CONFIRM_PASSWORD_MISMATCH,
    );
    expect(
      validateRegistration({ ...validInput, confirmPassword: 'OtraClave2026!' }).confirmPassword,
    ).toBe(MESSAGES.CONFIRM_PASSWORD_MISMATCH);
  });

  it('US2-4 / FR-005: confirmar contraseña idéntica pero sin seguridad alta → PASSWORD_WEAK', () => {
    expect(validateConfirmPassword('debil123', 'debil123')).toBe(MESSAGES.PASSWORD_WEAK);
  });

  it('FR-007: acceptedTerms en false → TERMS_REQUIRED', () => {
    expect(validateRegistration({ ...validInput, acceptedTerms: false }).acceptedTerms).toBe(
      MESSAGES.TERMS_REQUIRED,
    );
  });
});
