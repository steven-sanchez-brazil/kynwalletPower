import { describe, expect, it } from 'vitest';
import { initialRegisterState, registerReducer, type RegisterFormState } from './registerReducer';
import { TEST_REGISTRATION_DATA } from '@/test/fixtures';

// ─── US1: Flujo de envío exitoso ────────────────────────────────────────────

describe('registerReducer · US1 Flujo de envío exitoso', () => {
  it('inicia en estado idle con valores vacíos y visibilidad oculta', () => {
    expect(initialRegisterState.status).toBe('idle');
    expect(initialRegisterState.values.fullName).toBe('');
    expect(initialRegisterState.values.email).toBe('');
    expect(initialRegisterState.values.password).toBe('');
    expect(initialRegisterState.values.confirmPassword).toBe('');
    expect(initialRegisterState.values.termsAccepted).toBe(false);
    expect(initialRegisterState.isPasswordVisible).toBe(false);
    expect(initialRegisterState.isConfirmPasswordVisible).toBe(false);
    expect(initialRegisterState.socialNotice).toBeNull();
  });

  it('pasa a submitting cuando todos los campos son válidos y se envía el formulario', () => {
    let state = initialRegisterState;
    state = registerReducer(state, {
      type: 'change',
      field: 'fullName',
      value: TEST_REGISTRATION_DATA.fullName,
    });
    state = registerReducer(state, {
      type: 'change',
      field: 'email',
      value: TEST_REGISTRATION_DATA.email,
    });
    state = registerReducer(state, {
      type: 'change',
      field: 'password',
      value: TEST_REGISTRATION_DATA.password,
    });
    state = registerReducer(state, {
      type: 'change',
      field: 'confirmPassword',
      value: TEST_REGISTRATION_DATA.confirmPassword,
    });
    state = registerReducer(state, { type: 'changeTerms', checked: true });
    state = registerReducer(state, { type: 'submit' });
    expect(state.status).toBe('submitting');
  });

  it('no pasa a submitting si ya se encuentra en submitting', () => {
    let state: RegisterFormState = {
      ...initialRegisterState,
      status: 'submitting' as const,
      values: TEST_REGISTRATION_DATA,
    };
    state = registerReducer(state, { type: 'submit' });
    expect(state.status).toBe('submitting');
  });

  it('transiciona a success cuando la operación de registro responde con éxito', () => {
    let state: RegisterFormState = {
      ...initialRegisterState,
      status: 'submitting' as const,
      values: TEST_REGISTRATION_DATA,
    };
    state = registerReducer(state, {
      type: 'result',
      result: {
        kind: 'success',
        account: {
          email: TEST_REGISTRATION_DATA.email,
          displayName: TEST_REGISTRATION_DATA.fullName,
        },
      },
    });
    expect(state.status).toBe('success');
  });

  it('transiciona a idle y refleja error si el correo ya está registrado', () => {
    let state: RegisterFormState = {
      ...initialRegisterState,
      status: 'submitting' as const,
      values: TEST_REGISTRATION_DATA,
    };
    state = registerReducer(state, {
      type: 'result',
      result: {
        kind: 'email-already-registered',
        message: 'Este correo electrónico ya se encuentra registrado',
      },
    });
    expect(state.status).toBe('idle');
    expect(state.errors.email).toBe('Este correo electrónico ya se encuentra registrado');
  });
});

// ─── US2: Validación inline y errores ────────────────────────────────────────

describe('registerReducer · US2 Validación inline', () => {
  it('SET_VALUE (change): actualiza el valor del campo y recalcula errores si está tocado', () => {
    let state = registerReducer(initialRegisterState, { type: 'blur', field: 'email' });
    state = registerReducer(state, { type: 'change', field: 'email', value: 'no-es-email' });
    expect(state.errors.email).toBeDefined();

    state = registerReducer(state, {
      type: 'change',
      field: 'email',
      value: 'carlos@example.test',
    });
    expect(state.errors.email).toBeUndefined();
  });

  it('SET_BLUR (blur): marca el campo como tocado y muestra error si aplica', () => {
    const state = registerReducer(initialRegisterState, { type: 'blur', field: 'fullName' });
    expect(state.touched.fullName).toBe(true);
    expect(state.errors.fullName).toBeDefined();
  });

  it('los errores desaparecen al corregir el dato del campo tocado', () => {
    let state = registerReducer(initialRegisterState, { type: 'blur', field: 'password' });
    expect(state.errors.password).toBeDefined();

    state = registerReducer(state, { type: 'change', field: 'password', value: 'Password123!' });
    expect(state.errors.password).toBeUndefined();
  });

  it('al enviar con campos vacíos, todos los touched se activan y se muestran todos los errores', () => {
    const state = registerReducer(initialRegisterState, { type: 'submit' });
    expect(state.status).toBe('idle');
    expect(state.touched.fullName).toBe(true);
    expect(state.touched.email).toBe(true);
    expect(state.touched.password).toBe(true);
    expect(state.touched.confirmPassword).toBe(true);
    expect(state.touched.termsAccepted).toBe(true);
    expect(state.errors.fullName).toBeDefined();
    expect(state.errors.email).toBeDefined();
    expect(state.errors.password).toBeDefined();
    expect(state.errors.confirmPassword).toBeDefined();
    expect(state.errors.termsAccepted).toBeDefined();
  });

  it('changeTerms marca touched termsAccepted y muestra error si no está marcado', () => {
    const state = registerReducer(initialRegisterState, { type: 'changeTerms', checked: false });
    expect(state.touched.termsAccepted).toBe(true);
    expect(state.errors.termsAccepted).toBeDefined();
  });

  it('changeTerms elimina el error al marcar los términos', () => {
    let state = registerReducer(initialRegisterState, { type: 'changeTerms', checked: false });
    state = registerReducer(state, { type: 'changeTerms', checked: true });
    expect(state.errors.termsAccepted).toBeUndefined();
  });

  it('error de correo ya registrado persiste hasta que el campo es editado', () => {
    let state: RegisterFormState = {
      ...initialRegisterState,
      status: 'idle' as const,
      errors: { email: 'Este correo electrónico ya se encuentra registrado' },
    };
    // al editar otro campo no borra el error de email
    state = registerReducer(state, { type: 'change', field: 'fullName', value: 'Carlos' });
    expect(state.errors.email).toBeDefined();

    // al editar el campo email sí borra el error
    state = registerReducer(state, { type: 'change', field: 'email', value: 'nuevo@example.test' });
    expect(state.errors.email).toBeUndefined();
  });
});

// ─── US3: Alternancia de visibilidad ─────────────────────────────────────────

describe('registerReducer · US3 Alternancia de visibilidad de contraseñas', () => {
  it('togglePasswordVisibility alterna isPasswordVisible de forma independiente', () => {
    let state = registerReducer(initialRegisterState, { type: 'togglePasswordVisibility' });
    expect(state.isPasswordVisible).toBe(true);
    expect(state.isConfirmPasswordVisible).toBe(false);

    state = registerReducer(state, { type: 'togglePasswordVisibility' });
    expect(state.isPasswordVisible).toBe(false);
  });

  it('toggleConfirmPasswordVisibility alterna isConfirmPasswordVisible de forma independiente', () => {
    const state = registerReducer(initialRegisterState, {
      type: 'toggleConfirmPasswordVisibility',
    });
    expect(state.isConfirmPasswordVisible).toBe(true);
    expect(state.isPasswordVisible).toBe(false);
  });

  it('ambas visibilidades son independientes entre sí', () => {
    let state = registerReducer(initialRegisterState, { type: 'togglePasswordVisibility' });
    state = registerReducer(state, { type: 'toggleConfirmPasswordVisibility' });
    expect(state.isPasswordVisible).toBe(true);
    expect(state.isConfirmPasswordVisible).toBe(true);
  });
});
