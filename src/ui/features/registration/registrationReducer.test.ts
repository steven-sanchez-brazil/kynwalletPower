import { MESSAGES } from '@/domain/messages';
import { VALID_REGISTRATION } from '@/test/registrationFixtures';
import { initialRegistrationState, registrationReducer } from './registrationReducer';

describe('registrationReducer', () => {
  it('US1-1/FR-016: un submit válido entra en submitting y el segundo se ignora', () => {
    const ready = { ...initialRegistrationState, values: VALID_REGISTRATION };
    const submitting = registrationReducer(ready, { type: 'submit' });
    expect(submitting.status).toBe('submitting');
    expect(registrationReducer(submitting, { type: 'submit' })).toBe(submitting);
  });

  it('US1-4: unavailable es reintentable y no expone detalles', () => {
    const state = registrationReducer(
      { ...initialRegistrationState, status: 'submitting', values: VALID_REGISTRATION },
      { type: 'result', result: { kind: 'unavailable' } },
    );
    expect(state.status).toBe('submitError');
    expect(state.submitError).toBe(MESSAGES.REGISTRATION_UNAVAILABLE);
    expect(
      registrationReducer(state, { type: 'change', field: 'fullName', value: 'Diego' }).status,
    ).toBe('editing');
  });

  it('US2-1: submit vacío toca todo y conserva el orden de errores', () => {
    const state = registrationReducer(initialRegistrationState, { type: 'submit' });
    expect(state.status).toBe('editing');
    expect(state.touched).toEqual({
      fullName: true,
      email: true,
      password: true,
      passwordConfirmation: true,
      acceptedTerms: true,
    });
    expect(Object.keys(state.fieldErrors)).toEqual([
      'fullName',
      'email',
      'password',
      'passwordConfirmation',
      'acceptedTerms',
    ]);
  });

  it('US2-5: corrige solo el campo editado y conserva errores ajenos', () => {
    let state = registrationReducer(initialRegistrationState, { type: 'submit' });
    state = registrationReducer(state, {
      type: 'change',
      field: 'fullName',
      value: '  Ana María  ',
    });
    expect(state.fieldErrors.fullName).toBeUndefined();
    expect(state.fieldErrors.email).toBe(MESSAGES.EMAIL_REQUIRED);
  });

  it('US3-3: cambiar password revalida confirmación si ya fue tocada', () => {
    let state = { ...initialRegistrationState, values: VALID_REGISTRATION };
    state = registrationReducer(state, { type: 'blur', field: 'passwordConfirmation' });
    state = registrationReducer(state, { type: 'change', field: 'password', value: 'otra clave' });
    expect(state.fieldErrors.passwordConfirmation).toBe(MESSAGES.PASSWORD_MISMATCH);
  });

  it('US4-2: aceptar términos elimina solo su error', () => {
    let state = registrationReducer(initialRegistrationState, { type: 'submit' });
    state = registrationReducer(state, { type: 'setTerms', checked: true });
    expect(state.fieldErrors.acceptedTerms).toBeUndefined();
    expect(state.fieldErrors.fullName).toBeDefined();
  });

  it('US5: los avisos no alteran valores ni errores', () => {
    const state = { ...initialRegistrationState, values: VALID_REGISTRATION };
    const next = registrationReducer(state, { type: 'showNotice', message: MESSAGES.COMING_SOON });
    expect(next.values).toEqual(VALID_REGISTRATION);
    expect(next.notice).toBe(MESSAGES.COMING_SOON);
  });
});
