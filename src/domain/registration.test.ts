import { validateRegistration } from './registration';

const valid = {
  fullName: 'Ana Pérez',
  email: 'ana@example.com',
  password: 'secreto123',
  confirmPassword: 'secreto123',
  acceptedTerms: true,
};

describe('Registro · validaciones', () => {
  it('acepta datos válidos', () => {
    expect(validateRegistration(valid)).toEqual({});
  });

  it('exige todos los campos y términos', () => {
    const errors = validateRegistration({
      fullName: '', email: '', password: '', confirmPassword: '', acceptedTerms: false,
    });
    expect(Object.keys(errors)).toHaveLength(5);
  });

  it('valida correo, contraseña corta y confirmación', () => {
    const errors = validateRegistration({
      ...valid, email: 'correo', password: '1234567', confirmPassword: 'diferente',
    });
    expect(errors.email).toMatch(/correo electrónico válido/);
    expect(errors.password).toMatch(/8 caracteres/);
    expect(errors.confirmPassword).toMatch(/no coinciden/);
  });

  it('valida límites, sin recortar ni modificar contraseñas', () => {
    const errors = validateRegistration({
      ...valid, fullName: 'x'.repeat(81), email: 'a'.repeat(251) + '@x.io',
      password: 'x'.repeat(129), confirmPassword: 'x'.repeat(129),
    });
    expect(errors.fullName).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
    expect(errors.confirmPassword).toBeUndefined();
  });
});
