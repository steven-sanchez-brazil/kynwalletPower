import { MESSAGES } from '@/domain/messages';
import { VALID_REGISTRATION } from '@/test/fixtures';
import {
  initialRegisterState,
  registerReducer,
  type RegisterAction,
  type RegisterState,
} from './registerReducer';

function run(actions: RegisterAction[], from: RegisterState = initialRegisterState) {
  return actions.reduce(registerReducer, from);
}

const fillValid: RegisterAction[] = [
  { type: 'change', field: 'fullName', value: VALID_REGISTRATION.fullName },
  { type: 'change', field: 'email', value: VALID_REGISTRATION.email },
  { type: 'change', field: 'password', value: VALID_REGISTRATION.password },
  { type: 'change', field: 'confirmPassword', value: VALID_REGISTRATION.confirmPassword },
  { type: 'toggleTerms', checked: true },
];

describe('registerReducer · US1 flujo feliz', () => {
  it('estado inicial: vacío, sin errores y editando', () => {
    expect(initialRegisterState).toMatchObject({
      status: 'editing',
      values: { fullName: '', email: '', password: '', confirmPassword: '' },
      acceptedTerms: false,
      fieldErrors: {},
      failure: null,
      notice: null,
    });
  });

  it('change actualiza valores', () => {
    const state = run([{ type: 'change', field: 'fullName', value: 'Ana' }]);
    expect(state.values.fullName).toBe('Ana');
  });

  it('US1-2: submit válido → submitting y un segundo submit se ignora', () => {
    const submitting = run([...fillValid, { type: 'submit' }]);
    expect(submitting.status).toBe('submitting');
    expect(registerReducer(submitting, { type: 'submit' })).toBe(submitting);
  });

  it('US1-1: result created → registered y no admite más envíos', () => {
    const state = run([
      ...fillValid,
      { type: 'submit' },
      { type: 'result', result: { kind: 'created', displayName: 'Nueva Persona' } },
    ]);
    expect(state.status).toBe('registered');
    expect(registerReducer(state, { type: 'submit' })).toBe(state);
  });
});

describe('registerReducer · US2 error al crear la cuenta', () => {
  const submitted = run([...fillValid, { type: 'submit' }]);

  it('US2-3: rejected → failure conserva nombre, correo y términos y vacía contraseñas', () => {
    const state = registerReducer(submitted, { type: 'result', result: { kind: 'rejected' } });
    expect(state.status).toBe('failure');
    expect(state.failure).toBe('rejected');
    expect(state.values).toEqual({
      fullName: VALID_REGISTRATION.fullName,
      email: VALID_REGISTRATION.email,
      password: '',
      confirmPassword: '',
    });
    expect(state.acceptedTerms).toBe(true);
  });

  it('US2-4: unavailable → failure', () => {
    const state = registerReducer(submitted, { type: 'result', result: { kind: 'unavailable' } });
    expect(state).toMatchObject({ status: 'failure', failure: 'unavailable' });
  });

  it('US2-2: un change posterior limpia el error', () => {
    const failed = registerReducer(submitted, { type: 'result', result: { kind: 'rejected' } });
    const state = registerReducer(failed, { type: 'change', field: 'email', value: 'otra@x.co' });
    expect(state).toMatchObject({ status: 'editing', failure: null });
  });

  it('result invalid → vuelve a editar mostrando los errores', () => {
    const state = registerReducer(submitted, {
      type: 'result',
      result: { kind: 'invalid', errors: { email: MESSAGES.EMAIL_INVALID } },
    });
    expect(state.status).toBe('editing');
    expect(state.fieldErrors.email).toBe(MESSAGES.EMAIL_INVALID);
  });
});

describe('registerReducer · US3 validación por campo', () => {
  it('los errores solo son visibles en campos tocados', () => {
    const state = run([{ type: 'blur', field: 'email' }]);
    expect(state.fieldErrors).toEqual({ email: MESSAGES.EMAIL_REQUIRED });
  });

  it('FR-009: submit con errores marca todo como tocado y no pasa a submitting', () => {
    const state = run([{ type: 'submit' }]);
    expect(state.status).toBe('editing');
    expect(Object.keys(state.fieldErrors).sort()).toEqual([
      'acceptedTerms',
      'confirmPassword',
      'email',
      'fullName',
      'password',
    ]);
  });

  it('cambiar la contraseña revalida la confirmación ya tocada', () => {
    const state = run([
      { type: 'change', field: 'password', value: 'abc12345' },
      { type: 'change', field: 'confirmPassword', value: 'abc12345' },
      { type: 'blur', field: 'confirmPassword' },
      { type: 'change', field: 'password', value: 'abc12345x' },
    ]);
    expect(state.fieldErrors.confirmPassword).toBe(MESSAGES.CONFIRM_MISMATCH);
  });

  it('US3-7: el mensaje desaparece al corregir el campo', () => {
    const state = run([
      { type: 'blur', field: 'email' },
      { type: 'change', field: 'email', value: 'ana@example.test' },
    ]);
    expect(state.fieldErrors.email).toBeUndefined();
  });

  it('desmarcar los términos tras marcarlos muestra el error', () => {
    const state = run([
      { type: 'toggleTerms', checked: true },
      { type: 'toggleTerms', checked: false },
    ]);
    expect(state.fieldErrors.acceptedTerms).toBe(MESSAGES.TERMS_REQUIRED);
  });
});

describe('registerReducer · US5 avisos', () => {
  it('showNotice conserva valores y estado', () => {
    const before = run(fillValid);
    const after = registerReducer(before, { type: 'showNotice', message: 'Aviso' });
    expect(after).toEqual({ ...before, notice: 'Aviso' });
  });

  it('el aviso se limpia al editar y al enviar', () => {
    const withNotice = run([{ type: 'showNotice', message: 'Aviso' }]);
    expect(registerReducer(withNotice, { type: 'change', field: 'email', value: 'a' }).notice).toBe(
      null,
    );
    expect(registerReducer(withNotice, { type: 'submit' }).notice).toBe(null);
  });
});
