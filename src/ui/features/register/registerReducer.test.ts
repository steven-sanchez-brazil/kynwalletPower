import { initialRegisterState, registerReducer, type RegisterState } from './registerReducer';

const validValues: RegisterState['values'] = {
  fullName: 'Steven Luna',
  email: 'steven.luna@example.test',
  password: 'Password123',
  confirmPassword: 'Password123',
  termsAccepted: true,
};

function fillValid(state = initialRegisterState): RegisterState {
  let next = state;
  next = registerReducer(next, { type: 'change', field: 'fullName', value: validValues.fullName });
  next = registerReducer(next, { type: 'change', field: 'email', value: validValues.email });
  next = registerReducer(next, { type: 'change', field: 'password', value: validValues.password });
  next = registerReducer(next, {
    type: 'change',
    field: 'confirmPassword',
    value: validValues.confirmPassword,
  });
  next = registerReducer(next, {
    type: 'change',
    field: 'termsAccepted',
    value: validValues.termsAccepted,
  });
  return next;
}

describe('registerReducer · US1 Flujo de registro exitoso', () => {
  it('US1-1: estado inicial editing con todos los campos vacíos y termsAccepted en false', () => {
    expect(initialRegisterState).toEqual({
      status: 'editing',
      values: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false,
      },
      touched: {
        fullName: false,
        email: false,
        password: false,
        confirmPassword: false,
        termsAccepted: false,
      },
      fieldErrors: {},
      registerError: null,
      notice: null,
    });
  });

  it('US1-1, US1-2: submit con todos los valores válidos pasa a submitting y limpia avisos previos', () => {
    let state = fillValid();
    state = registerReducer(state, { type: 'showNotice', message: 'Próximamente' });
    state = registerReducer(state, { type: 'submit' });
    expect(state.status).toBe('submitting');
    expect(state.fieldErrors).toEqual({});
    expect(state.notice).toBeNull();
  });

  it('FR-010: un segundo submit mientras está en submitting o success se ignora', () => {
    const submitting = registerReducer(fillValid(), { type: 'submit' });
    expect(registerReducer(submitting, { type: 'submit' })).toBe(submitting);

    const succeeded = registerReducer(submitting, {
      type: 'result',
      result: { kind: 'success', displayName: 'Steven Luna' },
    });
    expect(succeeded.status).toBe('success');
    expect(registerReducer(succeeded, { type: 'submit' })).toBe(succeeded);
  });

  it('US1-1, FR-009: result con success pasa a status="success"', () => {
    const submitting = registerReducer(fillValid(), { type: 'submit' });
    const next = registerReducer(submitting, {
      type: 'result',
      result: { kind: 'success', displayName: 'Steven Luna' },
    });
    expect(next.status).toBe('success');
    expect(next.registerError).toBeNull();
  });
});

describe('registerReducer · US2 Validaciones inline e integridad antes del envío', () => {
  it('US2-1, FR-004: submit con formulario vacío marca los 5 campos como tocados, expone sus errores y permanece en editing', () => {
    const state = registerReducer(initialRegisterState, { type: 'submit' });
    expect(state.status).toBe('editing');
    expect(state.touched).toEqual({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      termsAccepted: true,
    });
    expect(state.fieldErrors).toEqual({
      fullName: 'Ingresa tu nombre completo',
      email: 'Ingresa tu correo electrónico',
      password: 'Ingresa tu contraseña',
      confirmPassword: 'Confirma tu contraseña',
      termsAccepted: 'Debes aceptar los términos y condiciones',
    });
  });

  it('US2-2, US2-3, US2-4, FR-003: blur en un campo muestra únicamente el error de ese campo', () => {
    let state = registerReducer(initialRegisterState, {
      type: 'change',
      field: 'email',
      value: 'invalido@',
    });
    expect(state.fieldErrors).toEqual({});
    state = registerReducer(state, { type: 'blur', field: 'email' });
    expect(state.fieldErrors).toEqual({
      email: 'Ingresa un correo electrónico válido',
    });
  });

  it('Caso límite: cambiar password cuando confirmPassword ya fue tocado actualiza de inmediato el error de coincidencia', () => {
    let state = fillValid();
    state = registerReducer(state, { type: 'blur', field: 'confirmPassword' });
    expect(state.fieldErrors.confirmPassword).toBeUndefined();

    state = registerReducer(state, { type: 'change', field: 'password', value: 'OtraClave999' });
    expect(state.fieldErrors.confirmPassword).toBe('Las contraseñas no coinciden');

    state = registerReducer(state, {
      type: 'change',
      field: 'confirmPassword',
      value: 'OtraClave999',
    });
    expect(state.fieldErrors.confirmPassword).toBeUndefined();
  });

  it('US2-6: result con email-already-exists o unavailable pasa a registerError, conserva nombre y correo y limpia contraseñas', () => {
    const submitting = registerReducer(fillValid(), { type: 'submit' });
    const errored = registerReducer(submitting, {
      type: 'result',
      result: { kind: 'email-already-exists' },
    });
    expect(errored.status).toBe('registerError');
    expect(errored.registerError).toBe('email-already-exists');
    expect(errored.values.fullName).toBe('Steven Luna');
    expect(errored.values.email).toBe('steven.luna@example.test');
    expect(errored.values.password).toBe('');
    expect(errored.values.confirmPassword).toBe('');

    const edited = registerReducer(errored, {
      type: 'change',
      field: 'email',
      value: 'nuevo@example.test',
    });
    expect(edited.status).toBe('editing');
    expect(edited.registerError).toBeNull();
  });
});
