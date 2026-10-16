import { MESSAGES } from '@/domain/messages';
import {
  initialRegisterState,
  registerReducer,
  type RegisterAction,
  type RegisterState,
} from './registerReducer';

const run = (actions: RegisterAction[], state: RegisterState = initialRegisterState) =>
  actions.reduce(registerReducer, state);

const fillValid: RegisterAction[] = [
  { type: 'change', field: 'fullName', value: 'Diego Martínez' },
  { type: 'change', field: 'email', value: 'diego@example.test' },
  { type: 'change', field: 'password', value: 'clave-segura' },
  { type: 'change', field: 'passwordConfirmation', value: 'clave-segura' },
  { type: 'toggleTerms', checked: true },
];

const submitWith = (kind: 'success' | 'email-taken' | 'unavailable') =>
  run([...fillValid, { type: 'submit' }, { type: 'result', result: { kind } }]);

describe('registerReducer (data-model.md, RegisterFormState)', () => {
  it('US1-1: envío válido → submitting', () => {
    const state = run([...fillValid, { type: 'submit' }]);
    expect(state.status).toBe('submitting');
    expect(state.fieldErrors).toEqual({});
  });

  it('US1-3: un segundo envío durante submitting no cambia el estado', () => {
    const submitting = run([...fillValid, { type: 'submit' }]);
    expect(registerReducer(submitting, { type: 'submit' })).toBe(submitting);
  });

  it('US1-1: resultado success → registered', () => {
    expect(submitWith('success').status).toBe('registered');
  });

  it('US2-1: envío vacío → todos los campos tocados, errores visibles y sigue editando', () => {
    const state = run([{ type: 'submit' }]);
    expect(state.status).toBe('editing');
    expect(Object.keys(state.fieldErrors)).toEqual([
      'fullName',
      'email',
      'password',
      'passwordConfirmation',
      'acceptedTerms',
    ]);
  });

  it('FR-008: los errores solo se muestran en campos tocados', () => {
    const state = run([
      { type: 'change', field: 'email', value: 'usuario@' },
      { type: 'blur', field: 'email' },
    ]);
    expect(state.fieldErrors).toEqual({ email: MESSAGES.EMAIL_INVALID });
  });

  it('US2-5: cambiar la contraseña recalcula el error de la confirmación ya tocada', () => {
    const matching = run([
      { type: 'change', field: 'password', value: 'clave-segura' },
      { type: 'change', field: 'passwordConfirmation', value: 'clave-segura' },
      { type: 'blur', field: 'passwordConfirmation' },
    ]);
    expect(matching.fieldErrors.passwordConfirmation).toBeUndefined();

    const changed = registerReducer(matching, {
      type: 'change',
      field: 'password',
      value: 'clave-distinta',
    });
    expect(changed.fieldErrors.passwordConfirmation).toBe(MESSAGES.PASSWORDS_DO_NOT_MATCH);
  });

  it('US2-6: corregir el valor oculta el mensaje', () => {
    const invalid = run([{ type: 'submit' }]);
    const fixed = registerReducer(invalid, { type: 'change', field: 'fullName', value: 'Diego' });
    expect(fixed.fieldErrors.fullName).toBeUndefined();
  });

  it('FR-007: marcar los términos oculta su error', () => {
    const invalid = run([{ type: 'submit' }]);
    const fixed = registerReducer(invalid, { type: 'toggleTerms', checked: true });
    expect(fixed.fieldErrors).not.toHaveProperty('acceptedTerms');
  });

  it('US3-1: email-taken → vuelve a editar con el error en el correo', () => {
    const state = submitWith('email-taken');
    expect(state.status).toBe('editing');
    expect(state.submitError).toBe('email-taken');
    expect(state.fieldErrors.email).toBe(MESSAGES.EMAIL_TAKEN);
  });

  it('US3-2: editar después de email-taken limpia el error', () => {
    const state = registerReducer(submitWith('email-taken'), {
      type: 'change',
      field: 'email',
      value: 'otro@example.test',
    });
    expect(state.submitError).toBeNull();
    expect(state.fieldErrors.email).toBeUndefined();
  });

  it('FR-023: unavailable → vuelve a editar con el error global', () => {
    const state = submitWith('unavailable');
    expect(state.status).toBe('editing');
    expect(state.submitError).toBe('unavailable');
  });
});
