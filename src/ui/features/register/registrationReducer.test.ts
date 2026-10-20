import { initialRegistrationState, registrationReducer } from './registrationReducer';

describe('registrationReducer', () => {
  it('updates a value and transitions to local success', () => {
    const filled = registrationReducer(initialRegistrationState, {
      type: 'change',
      field: 'fullName',
      value: 'Ada Lovelace',
      errors: {},
    });

    expect(filled.values.fullName).toBe('Ada Lovelace');

    const success = registrationReducer(filled, { type: 'success' });
    expect(success.status).toBe('success');
    expect(success.values).toEqual({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  });

  it('retains a notice without changing entered values', () => {
    const filled = registrationReducer(initialRegistrationState, {
      type: 'change',
      field: 'email',
      value: 'ada@example.com',
      errors: {},
    });

    const withNotice = registrationReducer(filled, {
      type: 'showNotice',
      message: 'Próximamente',
    });

    expect(withNotice.notice).toBe('Próximamente');
    expect(withNotice.values.email).toBe('ada@example.com');
  });
});
