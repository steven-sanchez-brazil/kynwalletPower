import type { RegistrationValues } from './registration';
import { validateRegistration } from './validation';

const valid: RegistrationValues = {
  fullName: '  Persona Demo  ',
  email: 'demo@example.test',
  password: 'sample-pass-01',
  confirmPassword: 'sample-pass-01',
  termsAccepted: true,
};

describe('Registro FR-001–007 reglas', () => {
  it('acepta datos válidos y espacios significativos en contraseñas', () => {
    expect(validateRegistration(valid)).toEqual({});
    expect(
      validateRegistration({ ...valid, password: '        ', confirmPassword: '        ' }),
    ).toEqual({});
  });
  it('exige los cinco campos', () => {
    expect(
      Object.keys(
        validateRegistration({
          fullName: '  ',
          email: '',
          password: '',
          confirmPassword: '',
          termsAccepted: false,
        }),
      ),
    ).toEqual(['email', 'password', 'fullName', 'confirmPassword', 'termsAccepted']);
  });
  it.each([1, 80])('nombre de %i caracteres tras trim válido', (n) => {
    expect(
      validateRegistration({ ...valid, fullName: ` ${'a'.repeat(n)} ` }).fullName,
    ).toBeUndefined();
  });
  it('rechaza nombre largo y correo inválido o mayor a 254', () => {
    expect(validateRegistration({ ...valid, fullName: 'a'.repeat(81) }).fullName).toBeTruthy();
    for (const email of ['usuario@', 'a b@example.test', `${'a'.repeat(246)}@test.test`]) {
      expect(validateRegistration({ ...valid, email }).email).toBeTruthy();
    }
    expect(
      validateRegistration({ ...valid, email: `  ${'a'.repeat(244)}@test.test  ` }).email,
    ).toBeUndefined();
  });
  it.each([8, 128])('contraseña de %i caracteres válida', (n) => {
    expect(
      validateRegistration({ ...valid, password: 'p'.repeat(n), confirmPassword: 'p'.repeat(n) }),
    ).toEqual({});
  });
  it.each([7, 129])('contraseña de %i caracteres inválida', (n) => {
    expect(validateRegistration({ ...valid, password: 'p'.repeat(n) }).password).toBeTruthy();
  });
  it('confirmación exacta, obligatoria y limitada, términos estrictos', () => {
    for (const confirmPassword of ['', 'sample-pass-01 ', 'p'.repeat(129)]) {
      expect(validateRegistration({ ...valid, confirmPassword }).confirmPassword).toBeTruthy();
    }
    expect(validateRegistration({ ...valid, termsAccepted: false }).termsAccepted).toBeTruthy();
  });
});
