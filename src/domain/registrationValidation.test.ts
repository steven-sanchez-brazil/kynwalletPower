import { TEST_ACCOUNT } from '@/test/fixtures';
import { validateRegistration } from './registrationValidation';

const valid = {
  fullName: 'Diego Martínez',
  email: 'diego@example.com',
  password: TEST_ACCOUNT.password,
  confirmPassword: TEST_ACCOUNT.password,
  acceptedTerms: true,
};
describe('REG-US2 FR-002–005 dominio', () => {
  it('acepta Unicode y normalización periférica', () => {
    expect(
      validateRegistration({
        ...valid,
        fullName: '  Élodie O’Connor-Pérez  ',
        email: ' DIEGO@EXAMPLE.COM ',
      }),
    ).toEqual({});
  });
  it('rechaza los cinco campos vacíos y tipos incorrectos sin lanzar', () => {
    expect(Object.keys(validateRegistration({}))).toHaveLength(5);
    expect(Object.keys(validateRegistration(null))).toHaveLength(5);
    expect(
      Object.keys(
        validateRegistration({
          fullName: 1,
          email: [],
          password: false,
          confirmPassword: null,
          acceptedTerms: 'true',
        }),
      ),
    ).toHaveLength(5);
  });
  it.each(['usuario@', 'usuario.com', 'a b@example.com'])('rechaza correo %s', (email) => {
    expect(validateRegistration({ ...valid, email }).email).toBeTruthy();
  });
  it('valida límites y espacios con prioridad explícita', () => {
    expect(validateRegistration({ ...valid, fullName: ' '.repeat(4) }).fullName).toBe(
      'Ingresa tu nombre completo',
    );
    expect(validateRegistration({ ...valid, fullName: 'a'.repeat(100) }).fullName).toBeUndefined();
    expect(validateRegistration({ ...valid, fullName: 'a'.repeat(101) }).fullName).toContain('100');
    expect(
      validateRegistration({ ...valid, email: 'a'.repeat(242) + '@example.com' }).email,
    ).toBeUndefined();
    expect(
      validateRegistration({ ...valid, email: 'a'.repeat(243) + '@example.com' }).email,
    ).toContain('254');
    for (const length of [8, 128])
      expect(
        validateRegistration({
          ...valid,
          password: 'a'.repeat(length),
          confirmPassword: 'a'.repeat(length),
        }),
      ).toEqual({});
    for (const length of [7, 129])
      expect(
        validateRegistration({
          ...valid,
          password: 'a'.repeat(length),
          confirmPassword: 'a'.repeat(length),
        }).password,
      ).toBeTruthy();
    expect(validateRegistration({ ...valid, confirmPassword: '' }).confirmPassword).toBe(
      'Confirma tu contraseña',
    );
    expect(
      validateRegistration({ ...valid, password: ' ' + TEST_ACCOUNT.password }).confirmPassword,
    ).toBe('Las contraseñas no coinciden');
    expect(validateRegistration({ ...valid, acceptedTerms: false }).acceptedTerms).toBe(
      'Debes aceptar los términos y condiciones',
    );
  });
});
