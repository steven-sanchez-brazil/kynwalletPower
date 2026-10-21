import { validateRegistration, type RegistrationValues } from './registration';

const valid: RegistrationValues = {
  fullName: 'Ana María Pérez',
  email: 'ana@example.com',
  password: 'segura 123',
  confirmPassword: 'segura 123',
  acceptedTerms: true,
};

describe('Registro · validación de datos (FR-003–FR-007)', () => {
  it('acepta nombres Unicode y normaliza espacios periféricos del nombre y correo', () => {
    expect(
      validateRegistration({ ...valid, fullName: '  José D’Ávila  ', email: ' ANA@EXAMPLE.COM ' }),
    ).toEqual({});
  });

  it('rechaza los cinco controles vacíos y términos sin aceptar', () => {
    const errors = validateRegistration({
      fullName: '  ',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    });
    expect(Object.keys(errors)).toEqual([
      'fullName',
      'email',
      'password',
      'confirmPassword',
      'acceptedTerms',
    ]);
  });

  it.each(['A', 'A'.repeat(101), '---', "''", 'Ana 123'])(
    'rechaza nombre inválido %s',
    (fullName) => {
      expect(validateRegistration({ ...valid, fullName }).fullName).toBeTruthy();
    },
  );

  it.each(['usuario@', 'usuario.com', `${'a'.repeat(245)}@example.com`])(
    'rechaza correo inválido o de más de 254 caracteres %s',
    (email) => {
      expect(validateRegistration({ ...valid, email }).email).toBeTruthy();
    },
  );

  it.each(['1234567', 'x'.repeat(129)])(
    'rechaza contraseña fuera de 8–128 caracteres',
    (password) => {
      expect(
        validateRegistration({ ...valid, password, confirmPassword: password }).password,
      ).toBeTruthy();
    },
  );

  it('compara confirmación exactamente sin recortar ni cambiar mayúsculas', () => {
    expect(
      validateRegistration({ ...valid, confirmPassword: 'segura 123 ' }).confirmPassword,
    ).toBeTruthy();
    expect(
      validateRegistration({ ...valid, confirmPassword: 'Segura 123' }).confirmPassword,
    ).toBeTruthy();
  });
});
