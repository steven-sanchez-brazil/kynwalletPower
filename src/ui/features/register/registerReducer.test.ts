import { MESSAGES } from '@/domain/messages';
import { initialRegisterState, registerReducer, type RegisterState } from './registerReducer';

const filled: RegisterState = {
  ...initialRegisterState,
  values: {
    fullName: 'Diego Martínez',
    email: 'diego@example.test',
    password: 'clave-segura-1',
    confirmPassword: 'clave-segura-1',
    acceptTerms: true,
  },
};

describe('registerReducer (data-model.md › RegisterFormState)', () => {
  it('estado inicial vacío y sin errores', () => {
    expect(initialRegisterState.status).toBe('editing');
    expect(initialRegisterState.fieldErrors).toEqual({});
  });

  it('Edge Case: salir de un campo vacío sin error previo no muestra el error', () => {
    const state = registerReducer(initialRegisterState, { type: 'blur', field: 'fullName' });
    expect(state.touched.fullName).toBe(false);
    expect(state.fieldErrors).toEqual({});
  });

  it('US2-2: salir de un campo con contenido inválido muestra su error', () => {
    const typed = registerReducer(initialRegisterState, {
      type: 'change',
      field: 'email',
      value: 'usuario@',
    });
    const state = registerReducer(typed, { type: 'blur', field: 'email' });
    expect(state.fieldErrors).toEqual({ email: MESSAGES.EMAIL_INVALID });
  });

  it('FR-008: un campo que ya mostraba error sigue validándose al vaciarse y salir', () => {
    const submitted = registerReducer(initialRegisterState, { type: 'submit' });
    const state = registerReducer(submitted, { type: 'blur', field: 'fullName' });
    expect(state.fieldErrors.fullName).toBe(MESSAGES.NAME_REQUIRED);
  });

  it('US2-5: cambiar la contraseña recalcula la coincidencia con la confirmación', () => {
    let state = registerReducer(filled, {
      type: 'change',
      field: 'confirmPassword',
      value: 'otra-clave-1',
    });
    state = registerReducer(state, { type: 'blur', field: 'confirmPassword' });
    expect(state.fieldErrors.confirmPassword).toBe(MESSAGES.PASSWORD_MISMATCH);
    state = registerReducer(state, { type: 'change', field: 'password', value: 'otra-clave-1' });
    expect(state.fieldErrors.confirmPassword).toBeUndefined();
  });

  it('US2-1: submit con errores marca todo como tocado y no envía', () => {
    const state = registerReducer(initialRegisterState, { type: 'submit' });
    expect(state.status).toBe('editing');
    expect(Object.keys(state.fieldErrors)).toEqual([
      'fullName',
      'email',
      'password',
      'confirmPassword',
      'acceptTerms',
    ]);
  });

  it('US1-2: submit válido pasa a submitting y un segundo submit no cambia nada', () => {
    const submitting = registerReducer(filled, { type: 'submit' });
    expect(submitting.status).toBe('submitting');
    expect(registerReducer(submitting, { type: 'submit' })).toBe(submitting);
  });

  it('US3-1 / US3-2: email-taken se muestra en el correo y se borra al cambiarlo', () => {
    const taken = registerReducer(registerReducer(filled, { type: 'submit' }), {
      type: 'result',
      result: { kind: 'email-taken' },
    });
    expect(taken.status).toBe('editing');
    expect(taken.fieldErrors.email).toBe(MESSAGES.EMAIL_TAKEN);
    const otherField = registerReducer(taken, { type: 'change', field: 'fullName', value: 'D' });
    expect(otherField.fieldErrors.email).toBe(MESSAGES.EMAIL_TAKEN);
    const edited = registerReducer(taken, { type: 'change', field: 'email', value: 'x@y.co' });
    expect(edited.fieldErrors.email).toBeUndefined();
  });

  it('FR-019: unavailable muestra el error inesperado hasta el siguiente cambio', () => {
    const failed = registerReducer(registerReducer(filled, { type: 'submit' }), {
      type: 'result',
      result: { kind: 'unavailable' },
    });
    expect(failed.failure).toBe(true);
    expect(registerReducer(failed, { type: 'change', field: 'fullName', value: 'D' }).failure).toBe(
      false,
    );
  });

  it('US1-1: success no altera el estado (la vista navega a /login)', () => {
    const submitting = registerReducer(filled, { type: 'submit' });
    expect(registerReducer(submitting, { type: 'result', result: { kind: 'success' } })).toBe(
      submitting,
    );
  });
});
