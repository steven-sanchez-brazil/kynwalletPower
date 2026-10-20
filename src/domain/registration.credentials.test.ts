import { validateRegistration } from './registration';
import { registrationValues as valid } from '@/test/registrationStub';

describe('002/FR-002/005/006/007 · credenciales', () => {
  it.each([8, 128])('acepta %i caracteres Unicode', (length) => {
    const password = '🦊'.repeat(length);
    expect(validateRegistration({ ...valid, password, confirmPassword: password })).toEqual({});
  });
  it.each([
    ['', 'PASSWORD_REQUIRED'],
    ['x'.repeat(7), 'PASSWORD_TOO_SHORT'],
    ['x'.repeat(129), 'PASSWORD_TOO_LONG'],
  ])('EC-004 límite %j', (password, error) => {
    expect(validateRegistration({ ...valid, password }).password).toBe(error);
  });
  it('conserva espacios y coincidencia exacta', () => {
    const password = '        ';
    expect(validateRegistration({ ...valid, password, confirmPassword: password })).toEqual({});
    expect(validateRegistration({ ...valid, confirmPassword: 'ABCDEFGH' }).confirmPassword).toBe(
      'PASSWORD_MISMATCH',
    );
  });
  it('confirmación requerida antes de coincidencia', () => {
    expect(validateRegistration({ ...valid, confirmPassword: '' }).confirmPassword).toBe(
      'CONFIRM_REQUIRED',
    );
    expect(validateRegistration({ ...valid, confirmPassword: 'x' }).confirmPassword).toBe(
      'PASSWORD_TOO_SHORT',
    );
    expect(
      validateRegistration({ ...valid, confirmPassword: 'x'.repeat(129) }).confirmPassword,
    ).toBe('PASSWORD_TOO_LONG');
  });
  it.each([false, undefined, 'true', 1])('aceptación explícita %j', (acceptedTerms) => {
    expect(validateRegistration({ ...valid, acceptedTerms }).acceptedTerms).toBe('TERMS_REQUIRED');
  });
  it('valida todas las entradas ausentes y tipos incorrectos', () => {
    expect(Object.keys(validateRegistration({}))).toHaveLength(5);
    expect(validateRegistration({ ...valid, password: null, confirmPassword: 1 })).toMatchObject({
      password: 'PASSWORD_REQUIRED',
      confirmPassword: 'CONFIRM_REQUIRED',
    });
  });
});
