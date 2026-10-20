import { MESSAGES } from '@/domain/messages';
import { REGISTRATION_DATA } from '@/test/fixtures';
import { initialRegisterState, registerReducer, type RegisterState } from './registerReducer';

const validValues = {
  name: REGISTRATION_DATA.name,
  email: REGISTRATION_DATA.email,
  password: REGISTRATION_DATA.password,
  confirmPassword: REGISTRATION_DATA.password,
  acceptedTerms: true,
};

const filled: RegisterState = { ...initialRegisterState, values: validValues };

describe('registerReducer · US1 (data-model.md, transiciones)', () => {
  it('estado inicial: editing, valores vacíos y términos sin aceptar', () => {
    expect(initialRegisterState.status).toBe('editing');
    expect(initialRegisterState.values).toEqual({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    });
  });

  it('change actualiza el campo indicado', () => {
    const next = registerReducer(initialRegisterState, {
      type: 'change',
      field: 'name',
      value: 'Diego',
    });
    expect(next.values.name).toBe('Diego');
    expect(next.values.email).toBe('');
  });

  it('toggleTerms actualiza la aceptación de los términos', () => {
    const next = registerReducer(initialRegisterState, { type: 'toggleTerms', checked: true });
    expect(next.values.acceptedTerms).toBe(true);
  });

  it('US1-1: submit con datos válidos → submitting', () => {
    expect(registerReducer(filled, { type: 'submit' }).status).toBe('submitting');
  });

  it('FR-010: submit con datos inválidos → permanece en editing', () => {
    expect(registerReducer(initialRegisterState, { type: 'submit' }).status).toBe('editing');
  });

  it('FR-012: submit estando en submitting se ignora', () => {
    const submitting = registerReducer(filled, { type: 'submit' });
    expect(registerReducer(submitting, { type: 'submit' })).toBe(submitting);
  });

  it('US1-1: result success → success con el nombre creado', () => {
    const submitting = registerReducer(filled, { type: 'submit' });
    const next = registerReducer(submitting, {
      type: 'result',
      result: { kind: 'success', displayName: 'Diego Martínez' },
    });
    expect(next.status).toBe('success');
    expect(next.createdName).toBe('Diego Martínez');
  });
});

describe('registerReducer · US2 validación inline', () => {
  it('FR-009: change no muestra errores de campos que aún no se tocaron', () => {
    const next = registerReducer(initialRegisterState, {
      type: 'change',
      field: 'email',
      value: 'usuario@',
    });
    expect(next.fieldErrors).toEqual({});
  });

  it('FR-009: blur muestra el error de ese campo y solo de ese campo', () => {
    const typed = registerReducer(initialRegisterState, {
      type: 'change',
      field: 'email',
      value: 'usuario@',
    });
    const next = registerReducer(typed, { type: 'blur', field: 'email' });
    expect(next.fieldErrors).toEqual({ email: MESSAGES.EMAIL_INVALID });
  });

  it('FR-010: submit con errores marca todos los campos y muestra todos los errores', () => {
    const next = registerReducer(initialRegisterState, { type: 'submit' });
    expect(next.status).toBe('editing');
    expect(Object.keys(next.fieldErrors).sort()).toEqual(
      ['confirmPassword', 'email', 'name', 'password', 'terms'].sort(),
    );
  });

  it('US2-6: corregir el valor oculta el mensaje de ese campo', () => {
    const failed = registerReducer(initialRegisterState, { type: 'submit' });
    const next = registerReducer(failed, { type: 'change', field: 'name', value: 'Diego' });
    expect(next.fieldErrors.name).toBeUndefined();
    expect(next.fieldErrors.email).toBe(MESSAGES.EMAIL_REQUIRED);
  });

  it('UI-4: cambiar la contraseña reevalúa la coincidencia si la confirmación ya se tocó', () => {
    let state = registerReducer(initialRegisterState, {
      type: 'change',
      field: 'password',
      value: 'secreto-123',
    });
    state = registerReducer(state, {
      type: 'change',
      field: 'confirmPassword',
      value: 'secreto-123',
    });
    state = registerReducer(state, { type: 'blur', field: 'confirmPassword' });
    expect(state.fieldErrors.confirmPassword).toBeUndefined();
    state = registerReducer(state, { type: 'change', field: 'password', value: 'secreto-1234' });
    expect(state.fieldErrors.confirmPassword).toBe(MESSAGES.PASSWORD_MISMATCH);
  });

  it('US2-5: marcar los términos tras un envío fallido oculta su mensaje', () => {
    const failed = registerReducer(initialRegisterState, { type: 'submit' });
    expect(failed.fieldErrors.terms).toBe(MESSAGES.TERMS_REQUIRED);
    const next = registerReducer(failed, { type: 'toggleTerms', checked: true });
    expect(next.fieldErrors.terms).toBeUndefined();
  });
});

describe('registerReducer · US3 resultados del registro', () => {
  const submitting = registerReducer(filled, { type: 'submit' });

  it('US3-1: result email-taken → error en el correo, datos conservados y contraseñas vacías', () => {
    const next = registerReducer(submitting, {
      type: 'result',
      result: { kind: 'email-taken' },
    });
    expect(next.status).toBe('registerError');
    expect(next.serviceError).toBe('email-taken');
    expect(next.fieldErrors.email).toBe(MESSAGES.EMAIL_TAKEN);
    expect(next.values.name).toBe(validValues.name);
    expect(next.values.email).toBe(validValues.email);
    expect(next.values.password).toBe('');
    expect(next.values.confirmPassword).toBe('');
  });

  it('UI-6: result unavailable → registerError con el error de servicio y contraseñas vacías', () => {
    const next = registerReducer(submitting, { type: 'result', result: { kind: 'unavailable' } });
    expect(next.status).toBe('registerError');
    expect(next.serviceError).toBe('unavailable');
    expect(next.values.password).toBe('');
    expect(next.values.confirmPassword).toBe('');
  });

  it('US3-2: modificar el correo limpia el error de correo existente y vuelve a editing', () => {
    const taken = registerReducer(submitting, { type: 'result', result: { kind: 'email-taken' } });
    const next = registerReducer(taken, {
      type: 'change',
      field: 'email',
      value: 'otro@example.test',
    });
    expect(next.serviceError).toBeNull();
    expect(next.fieldErrors.email).toBeUndefined();
    expect(next.status).toBe('editing');
  });

  it('US3-1: escribir las contraseñas no oculta el error de correo existente', () => {
    const taken = registerReducer(submitting, { type: 'result', result: { kind: 'email-taken' } });
    const next = registerReducer(taken, {
      type: 'change',
      field: 'password',
      value: 'nueva-clave-1',
    });
    expect(next.serviceError).toBe('email-taken');
    expect(next.fieldErrors.email).toBe(MESSAGES.EMAIL_TAKEN);
    expect(next.status).toBe('registerError');
  });

  it('UI-6: cualquier cambio tras un error de servicio vuelve a editing', () => {
    const unavailable = registerReducer(submitting, {
      type: 'result',
      result: { kind: 'unavailable' },
    });
    const next = registerReducer(unavailable, { type: 'change', field: 'name', value: 'Diego' });
    expect(next.serviceError).toBeNull();
    expect(next.status).toBe('editing');
  });
});
