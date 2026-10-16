import { MESSAGES } from './messages';
import { normalizeEmail, validateCredentials, validateRegistration } from './validation';

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

describe('validateRegistration (data-model.md, FR-002, FR-003, FR-004)', () => {
  const valid = {
    fullName: 'Steven Luna',
    email: 'steven.luna@example.test',
    password: 'Password123',
    confirmPassword: 'Password123',
    termsAccepted: true,
  };

  it('datos de registro válidos → {}', () => {
    expect(validateRegistration(valid)).toEqual({});
  });

  it.each(['', '   ', 'A', '  A  '])(
    'US2-1: nombre vacío o < 2 caracteres tras trim (%j) → FULL_NAME_REQUIRED',
    (fullName) => {
      expect(validateRegistration({ ...valid, fullName }).fullName).toBe(
        MESSAGES.FULL_NAME_REQUIRED,
      );
    },
  );

  it('Caso límite: nombre > 120 caracteres tras trim → FULL_NAME_TOO_LONG', () => {
    expect(validateRegistration({ ...valid, fullName: 'a'.repeat(121) }).fullName).toBe(
      MESSAGES.FULL_NAME_TOO_LONG,
    );
  });

  it('US2-1, US2-2: correo vacío o inválido → EMAIL_REQUIRED / EMAIL_INVALID', () => {
    expect(validateRegistration({ ...valid, email: '  ' }).email).toBe(MESSAGES.EMAIL_REQUIRED);
    expect(validateRegistration({ ...valid, email: 'usuario@' }).email).toBe(
      MESSAGES.EMAIL_INVALID,
    );
  });

  it('US2-1, US2-3: contraseña vacía, < 8 o > 128 caracteres', () => {
    expect(validateRegistration({ ...valid, password: '', confirmPassword: '' }).password).toBe(
      MESSAGES.PASSWORD_REQUIRED,
    );
    expect(
      validateRegistration({ ...valid, password: '1234567', confirmPassword: '1234567' }).password,
    ).toBe(MESSAGES.PASSWORD_TOO_SHORT);
    expect(
      validateRegistration({
        ...valid,
        password: 'x'.repeat(129),
        confirmPassword: 'x'.repeat(129),
      }).password,
    ).toBe(MESSAGES.PASSWORD_TOO_LONG);
  });

  it('US2-1: confirmar contraseña vacía → CONFIRM_PASSWORD_REQUIRED', () => {
    expect(validateRegistration({ ...valid, confirmPassword: '' }).confirmPassword).toBe(
      MESSAGES.CONFIRM_PASSWORD_REQUIRED,
    );
  });

  it('US2-4: confirmar contraseña distinta de contraseña → PASSWORDS_DO_NOT_MATCH', () => {
    expect(validateRegistration({ ...valid, confirmPassword: 'Password124' }).confirmPassword).toBe(
      MESSAGES.PASSWORDS_DO_NOT_MATCH,
    );
  });

  it('US2-1: termsAccepted false → TERMS_REQUIRED', () => {
    expect(validateRegistration({ ...valid, termsAccepted: false }).termsAccepted).toBe(
      MESSAGES.TERMS_REQUIRED,
    );
  });
});
