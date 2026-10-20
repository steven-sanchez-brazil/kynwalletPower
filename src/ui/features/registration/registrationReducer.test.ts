import { registrationReducer, initialRegistrationState as initial } from './registrationReducer';
import { registrationValues as valid } from '@/test/registrationStub';
describe('002/US2 · feedback de estado', () => {
  it('blur valida solo visitado y corrección limpia su error', () => {
    const blurred = registrationReducer(initial, { type: 'blur', field: 'email' });
    expect(blurred.errors).toEqual({ email: 'EMAIL_REQUIRED' });
    const changed = registrationReducer(blurred, {
      type: 'change',
      field: 'email',
      value: valid.email,
    });
    expect(changed.errors).toEqual({});
    expect(changed.values.fullName).toBe('');
  });
  it('password revalida confirmación visitada sin tocar otros campos', () => {
    const state = { ...initial, values: { ...valid }, touched: { confirmPassword: true } };
    const changed = registrationReducer(state, {
      type: 'change',
      field: 'password',
      value: 'abcdEFGH',
    });
    expect(changed.errors.confirmPassword).toBe('PASSWORD_MISMATCH');
    expect(changed.values.acceptedTerms).toBe(true);
    expect(changed.values.email).toBe(valid.email);
  });
  it('submit marca todos y no revalida campos aún no visitados al editar', () => {
    const changed = registrationReducer(initial, { type: 'change', field: 'email', value: 'no' });
    expect(changed.errors).toEqual({});
    const submitted = registrationReducer(changed, {
      type: 'submit',
      errors: { email: 'EMAIL_INVALID' },
    });
    expect(submitted.touched).toMatchObject({ email: true, acceptedTerms: true });
  });
});
