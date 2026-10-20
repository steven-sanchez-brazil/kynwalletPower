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

describe('validateRegistration (data-model.md)', () => {
  const valid = {
    name: 'Diego Martínez',
    email: 'diego@example.test',
    password: 'secreto-123',
    confirmPassword: 'secreto-123',
    acceptedTerms: true,
  };

  it('datos totalmente válidos → {}', () => {
    expect(validateRegistration(valid)).toEqual({});
  });

  it.each(['', '   '])('FR-004: nombre vacío tras recortar (%j) → NAME_REQUIRED', (name) => {
    expect(validateRegistration({ ...valid, name }).name).toBe(MESSAGES.NAME_REQUIRED);
  });

  it('FR-004: nombre de > 100 caracteres → NAME_TOO_LONG y de exactamente 100 → válido', () => {
    expect(validateRegistration({ ...valid, name: 'a'.repeat(101) }).name).toBe(
      MESSAGES.NAME_TOO_LONG,
    );
    expect(validateRegistration({ ...valid, name: 'a'.repeat(100) }).name).toBeUndefined();
  });

  it('FR-004: los espacios periféricos del nombre no cuentan para el límite', () => {
    expect(validateRegistration({ ...valid, name: `  ${'a'.repeat(100)}  ` }).name).toBeUndefined();
  });

  it('FR-005: correo vacío → EMAIL_REQUIRED', () => {
    expect(validateRegistration({ ...valid, email: '' }).email).toBe(MESSAGES.EMAIL_REQUIRED);
  });

  it.each(['usuario@', 'usuario.com'])('FR-005: correo inválido (%s) → EMAIL_INVALID', (email) => {
    expect(validateRegistration({ ...valid, email }).email).toBe(MESSAGES.EMAIL_INVALID);
  });

  it('FR-005: correo de > 254 caracteres → EMAIL_INVALID', () => {
    const email = `${'a'.repeat(245)}@example.test`;
    expect(validateRegistration({ ...valid, email }).email).toBe(MESSAGES.EMAIL_INVALID);
  });

  it('FR-006: contraseña vacía → PASSWORD_CREATE_REQUIRED', () => {
    expect(validateRegistration({ ...valid, password: '', confirmPassword: '' }).password).toBe(
      MESSAGES.PASSWORD_CREATE_REQUIRED,
    );
  });

  it('FR-006: contraseña de < 8 caracteres → PASSWORD_TOO_SHORT', () => {
    expect(
      validateRegistration({ ...valid, password: '1234567', confirmPassword: '1234567' }).password,
    ).toBe(MESSAGES.PASSWORD_TOO_SHORT);
  });

  it('FR-006: contraseña de > 128 caracteres → PASSWORD_TOO_LONG', () => {
    const password = 'x'.repeat(129);
    expect(validateRegistration({ ...valid, password, confirmPassword: password }).password).toBe(
      MESSAGES.PASSWORD_TOO_LONG,
    );
  });

  it('FR-006: la contraseña no se recorta (los espacios cuentan)', () => {
    const password = ' 123456 ';
    expect(
      validateRegistration({ ...valid, password, confirmPassword: password }).password,
    ).toBeUndefined();
  });

  it('FR-007: confirmación vacía → CONFIRM_REQUIRED', () => {
    expect(validateRegistration({ ...valid, confirmPassword: '' }).confirmPassword).toBe(
      MESSAGES.CONFIRM_REQUIRED,
    );
  });

  it('FR-007: confirmación distinta → PASSWORD_MISMATCH (comparación exacta, sin recortar)', () => {
    expect(
      validateRegistration({ ...valid, confirmPassword: 'otra-clave-1' }).confirmPassword,
    ).toBe(MESSAGES.PASSWORD_MISMATCH);
    expect(
      validateRegistration({ ...valid, confirmPassword: 'secreto-123 ' }).confirmPassword,
    ).toBe(MESSAGES.PASSWORD_MISMATCH);
  });

  it('FR-008: términos no aceptados → TERMS_REQUIRED', () => {
    expect(validateRegistration({ ...valid, acceptedTerms: false }).terms).toBe(
      MESSAGES.TERMS_REQUIRED,
    );
  });

  it('FR-009: todos los campos vacíos reportan un error por cada clave', () => {
    const errors = validateRegistration({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    });
    expect(Object.keys(errors).sort()).toEqual(
      ['confirmPassword', 'email', 'name', 'password', 'terms'].sort(),
    );
  });
});
