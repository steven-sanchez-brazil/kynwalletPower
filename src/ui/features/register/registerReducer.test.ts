import { MESSAGES } from '@/domain/messages';
import { initialRegisterState, registerReducer, type RegisterState } from './registerReducer';

const filled: RegisterState = {
  ...initialRegisterState,
  values: {
    fullName: 'Diego Martínez',
    email: 'diego@example.test',
    password: 'secreto-123',
    confirmPassword: 'secreto-123',
    acceptedTerms: true,
  },
};

describe('registerReducer · validación (US2)', () => {
  it('estado inicial: editing, valores vacíos y términos sin aceptar (FR-003)', () => {
    expect(initialRegisterState.status).toBe('editing');
    expect(initialRegisterState.values).toEqual({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    });
  });

  it('FR-009: blur marca el campo como tocado y muestra solo su error', () => {
    const next = registerReducer(initialRegisterState, { type: 'blur', field: 'email' });
    expect(next.touched.email).toBe(true);
    expect(next.fieldErrors).toEqual({ email: MESSAGES.EMAIL_REQUIRED });
  });

  it('change en un campo no tocado no muestra errores todavía', () => {
    const next = registerReducer(initialRegisterState, {
      type: 'change',
      field: 'email',
      value: 'a',
    });
    expect(next.values.email).toBe('a');
    expect(next.fieldErrors).toEqual({});
  });

  it('US2-5: change en un campo tocado oculta el error al corregirlo', () => {
    const touched = registerReducer(initialRegisterState, { type: 'blur', field: 'email' });
    const next = registerReducer(touched, { type: 'change', field: 'email', value: 'a@b.co' });
    expect(next.fieldErrors.email).toBeUndefined();
  });

  it('US2-5: cambiar la contraseña revalida la confirmación ya tocada', () => {
    const touched = registerReducer(filled, { type: 'blur', field: 'confirmPassword' });
    expect(touched.fieldErrors.confirmPassword).toBeUndefined();
    const next = registerReducer(touched, {
      type: 'change',
      field: 'password',
      value: 'otra-clave-1',
    });
    expect(next.fieldErrors.confirmPassword).toBe(MESSAGES.PASSWORDS_DO_NOT_MATCH);
  });

  it('FR-008: toggleTerms cambia el valor, marca la casilla y recalcula su error', () => {
    const submitted = registerReducer(initialRegisterState, { type: 'submit' });
    expect(submitted.fieldErrors.acceptedTerms).toBe(MESSAGES.TERMS_REQUIRED);
    const next = registerReducer(submitted, { type: 'toggleTerms', checked: true });
    expect(next.values.acceptedTerms).toBe(true);
    expect(next.fieldErrors.acceptedTerms).toBeUndefined();
  });

  it('FR-010: submit con errores marca todo y sigue en editing', () => {
    const next = registerReducer(initialRegisterState, { type: 'submit' });
    expect(next.status).toBe('editing');
    expect(Object.values(next.touched).every(Boolean)).toBe(true);
    expect(Object.keys(next.fieldErrors)).toEqual([
      'fullName',
      'email',
      'password',
      'confirmPassword',
      'acceptedTerms',
    ]);
  });
});

describe('registerReducer · envío (US1)', () => {
  it('US1-1: submit válido → submitting', () => {
    expect(registerReducer(filled, { type: 'submit' }).status).toBe('submitting');
  });

  it('US1-2: un segundo submit en submitting se ignora', () => {
    const submitting = registerReducer(filled, { type: 'submit' });
    expect(registerReducer(submitting, { type: 'submit' })).toBe(submitting);
  });

  it('US1-1: result success → registered', () => {
    const submitting = registerReducer(filled, { type: 'submit' });
    const next = registerReducer(submitting, { type: 'result', result: { kind: 'success' } });
    expect(next.status).toBe('registered');
  });

  it('FR-014: email-taken → submitError, conserva nombre y correo y vacía las contraseñas', () => {
    const submitting = registerReducer(filled, { type: 'submit' });
    const next = registerReducer(submitting, { type: 'result', result: { kind: 'email-taken' } });
    expect(next.status).toBe('submitError');
    expect(next.submitError).toBe('email-taken');
    expect(next.values).toEqual({
      ...filled.values,
      password: '',
      confirmPassword: '',
    });
    // Las contraseñas vacías no muestran errores hasta que el usuario vuelva a interactuar.
    expect(next.fieldErrors).toEqual({});
  });

  it('FR-022: unavailable → submitError unavailable', () => {
    const submitting = registerReducer(filled, { type: 'submit' });
    const next = registerReducer(submitting, { type: 'result', result: { kind: 'unavailable' } });
    expect(next.submitError).toBe('unavailable');
  });

  it('editar un campo tras un error de envío oculta el mensaje', () => {
    const failed: RegisterState = { ...filled, status: 'submitError', submitError: 'unavailable' };
    const next = registerReducer(failed, { type: 'change', field: 'fullName', value: 'Diego M' });
    expect(next.status).toBe('editing');
    expect(next.submitError).toBeNull();
  });
});
