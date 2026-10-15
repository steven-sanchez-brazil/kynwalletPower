import { MESSAGES } from './messages';
import {
  isValidFullName,
  normalizeEmail,
  normalizeFullName,
  validateCredentials,
  validateRegistration,
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

describe('normalizeFullName / isValidFullName (FR-003)', () => {
  it('recorta y colapsa espacios internos', () => {
    expect(normalizeFullName('  Ana   María  ')).toBe('Ana María');
  });

  it.each(["María Núñez-O'Brien", 'Ana Li', 'Ñandú Pérez'])('acepta "%s"', (name) => {
    expect(isValidFullName(name)).toBe(true);
  });

  it.each(['A', '   ', 'Ana1', 'Ana@', '-Ana', ''])('rechaza %j', (name) => {
    expect(isValidFullName(name)).toBe(false);
  });

  it('rechaza 101 caracteres y acepta 100', () => {
    expect(isValidFullName('a'.repeat(100))).toBe(true);
    expect(isValidFullName('a'.repeat(101))).toBe(false);
  });
});

describe('validateRegistration (data-model.md)', () => {
  const valid = {
    fullName: 'Nueva Persona',
    email: 'nueva.persona@example.test',
    password: 'clave-segura-1',
    confirmPassword: 'clave-segura-1',
    acceptedTerms: true,
  };

  it('solicitud válida → {}', () => {
    expect(validateRegistration(valid)).toEqual({});
  });

  it('FR-003: nombre vacío → NAME_REQUIRED; inválido → NAME_INVALID', () => {
    expect(validateRegistration({ ...valid, fullName: '   ' }).fullName).toBe(
      MESSAGES.NAME_REQUIRED,
    );
    expect(validateRegistration({ ...valid, fullName: 'Ana1' }).fullName).toBe(
      MESSAGES.NAME_INVALID,
    );
  });

  it('FR-004: correo vacío e inválido reutilizan los mensajes de correo', () => {
    expect(validateRegistration({ ...valid, email: '' }).email).toBe(MESSAGES.EMAIL_REQUIRED);
    expect(validateRegistration({ ...valid, email: 'usuario@' }).email).toBe(
      MESSAGES.EMAIL_INVALID,
    );
  });

  it('FR-005: contraseña vacía → requerida', () => {
    const errors = validateRegistration({ ...valid, password: '', confirmPassword: '' });
    expect(errors.password).toBe(MESSAGES.REGISTER_PASSWORD_REQUIRED);
  });

  it.each(['abcdefgh', '12345678', 'short1'])('FR-005: "%s" → contraseña débil', (password) => {
    const errors = validateRegistration({ ...valid, password, confirmPassword: password });
    expect(errors.password).toBe(MESSAGES.REGISTER_PASSWORD_WEAK);
  });

  it('FR-005: > 128 caracteres → PASSWORD_TOO_LONG', () => {
    const password = `a1${'x'.repeat(127)}`;
    const errors = validateRegistration({ ...valid, password, confirmPassword: password });
    expect(errors.password).toBe(MESSAGES.PASSWORD_TOO_LONG);
  });

  it('FR-005: la contraseña no se recorta y admite espacios', () => {
    const password = ' a1 b2 c3 ';
    expect(validateRegistration({ ...valid, password, confirmPassword: password })).toEqual({});
  });

  it('FR-006: confirmación vacía y distinta', () => {
    expect(validateRegistration({ ...valid, confirmPassword: '' }).confirmPassword).toBe(
      MESSAGES.CONFIRM_REQUIRED,
    );
    expect(
      validateRegistration({ ...valid, confirmPassword: 'otra-clave-2' }).confirmPassword,
    ).toBe(MESSAGES.CONFIRM_MISMATCH);
  });

  it('FR-007: términos sin marcar → TERMS_REQUIRED', () => {
    expect(validateRegistration({ ...valid, acceptedTerms: false }).acceptedTerms).toBe(
      MESSAGES.TERMS_REQUIRED,
    );
  });

  it('el login no cambia: validateCredentials sigue aceptando solo letras de 8 caracteres', () => {
    expect(validateCredentials({ email: 'a@b.co', password: 'abcdefgh' })).toEqual({});
  });
});
