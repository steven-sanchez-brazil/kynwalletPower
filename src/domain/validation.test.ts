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

// ─── Tests for validateRegistration (US2, T019) ─────────────────────────────

describe('validateRegistration · fullName (US2, data-model.md 1.1)', () => {
  const validBase = {
    fullName: 'Carlos Mendoza',
    email: 'carlos@example.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    termsAccepted: true,
  };

  it('nombre válido → sin error en fullName', () => {
    expect(validateRegistration(validBase).fullName).toBeUndefined();
  });

  it('nombre vacío → FULL_NAME_REQUIRED', () => {
    expect(validateRegistration({ ...validBase, fullName: '' }).fullName).toBe(
      MESSAGES.FULL_NAME_REQUIRED,
    );
  });

  it('nombre de 1 carácter → FULL_NAME_REQUIRED', () => {
    expect(validateRegistration({ ...validBase, fullName: 'A' }).fullName).toBe(
      MESSAGES.FULL_NAME_REQUIRED,
    );
  });

  it('nombre solo espacios → FULL_NAME_REQUIRED', () => {
    expect(validateRegistration({ ...validBase, fullName: '  ' }).fullName).toBe(
      MESSAGES.FULL_NAME_REQUIRED,
    );
  });

  it('nombre de 2 caracteres → sin error', () => {
    expect(validateRegistration({ ...validBase, fullName: 'AB' }).fullName).toBeUndefined();
  });

  it('nombre de 100 caracteres → sin error', () => {
    expect(
      validateRegistration({ ...validBase, fullName: 'A'.repeat(100) }).fullName,
    ).toBeUndefined();
  });
});

describe('validateRegistration · email (US2)', () => {
  const validBase = {
    fullName: 'Carlos Mendoza',
    email: 'carlos@example.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    termsAccepted: true,
  };

  it('correo vacío → EMAIL_REQUIRED', () => {
    expect(validateRegistration({ ...validBase, email: '' }).email).toBe(MESSAGES.EMAIL_REQUIRED);
  });

  it('correo inválido → EMAIL_INVALID', () => {
    expect(validateRegistration({ ...validBase, email: 'no-es-email' }).email).toBe(
      MESSAGES.EMAIL_INVALID,
    );
  });

  it('correo válido → sin error', () => {
    expect(validateRegistration(validBase).email).toBeUndefined();
  });
});

describe('validateRegistration · password (US2)', () => {
  const validBase = {
    fullName: 'Carlos Mendoza',
    email: 'carlos@example.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    termsAccepted: true,
  };

  it('contraseña vacía → PASSWORD_REQUIRED', () => {
    expect(validateRegistration({ ...validBase, password: '', confirmPassword: '' }).password).toBe(
      MESSAGES.PASSWORD_REQUIRED,
    );
  });

  it('contraseña < 8 caracteres → PASSWORD_TOO_SHORT', () => {
    expect(
      validateRegistration({ ...validBase, password: '1234567', confirmPassword: '1234567' })
        .password,
    ).toBe(MESSAGES.PASSWORD_TOO_SHORT);
  });

  it('contraseña válida → sin error', () => {
    expect(validateRegistration(validBase).password).toBeUndefined();
  });
});

describe('validateRegistration · confirmPassword (US2)', () => {
  const validBase = {
    fullName: 'Carlos Mendoza',
    email: 'carlos@example.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    termsAccepted: true,
  };

  it('confirmación vacía → CONFIRM_PASSWORD_REQUIRED', () => {
    expect(validateRegistration({ ...validBase, confirmPassword: '' }).confirmPassword).toBe(
      MESSAGES.CONFIRM_PASSWORD_REQUIRED,
    );
  });

  it('confirmación distinta → PASSWORDS_DO_NOT_MATCH', () => {
    expect(
      validateRegistration({ ...validBase, confirmPassword: 'OtraPassword!' }).confirmPassword,
    ).toBe(MESSAGES.PASSWORDS_DO_NOT_MATCH);
  });

  it('confirmación idéntica → sin error', () => {
    expect(validateRegistration(validBase).confirmPassword).toBeUndefined();
  });
});

describe('validateRegistration · termsAccepted (US2)', () => {
  const validBase = {
    fullName: 'Carlos Mendoza',
    email: 'carlos@example.test',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    termsAccepted: true,
  };

  it('términos no aceptados → TERMS_REQUIRED', () => {
    expect(validateRegistration({ ...validBase, termsAccepted: false }).termsAccepted).toBe(
      MESSAGES.TERMS_REQUIRED,
    );
  });

  it('términos aceptados → sin error', () => {
    expect(validateRegistration(validBase).termsAccepted).toBeUndefined();
  });
});

describe('validateRegistration · datos completamente válidos', () => {
  it('todos los campos válidos → {} (sin errores)', () => {
    const result = validateRegistration({
      fullName: 'Carlos Mendoza',
      email: 'carlos@example.test',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      termsAccepted: true,
    });
    expect(result).toEqual({});
  });
});
