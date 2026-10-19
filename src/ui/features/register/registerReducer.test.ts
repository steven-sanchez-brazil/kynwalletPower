import { MESSAGES } from '@/domain/messages';
import { initialRegisterState, registerReducer } from './registerReducer';

describe('registerReducer · US1 Flujo de registro y estados (data-model.md)', () => {
  it('US1-1: estado inicial editing con campos vacíos y acceptedTerms en false', () => {
    expect(initialRegisterState).toEqual({
      status: 'editing',
      values: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptedTerms: false,
      },
      touched: {
        fullName: false,
        email: false,
        password: false,
        confirmPassword: false,
      },
      fieldErrors: {},
      submitError: null,
      toastMessage: null,
    });
  });

  it('US1-2: toggleTerms alterna acceptedTerms', () => {
    const next = registerReducer(initialRegisterState, { type: 'toggleTerms', checked: true });
    expect(next.values.acceptedTerms).toBe(true);
  });

  it('US1-3: submit con todos los campos válidos y acceptedTerms=true pasa a submitting e ignora envíos duplicados', () => {
    let state = initialRegisterState;
    state = registerReducer(state, { type: 'change', field: 'fullName', value: 'Ana Gómez' });
    state = registerReducer(state, {
      type: 'change',
      field: 'email',
      value: 'ana.gomez@example.test',
    });
    state = registerReducer(state, {
      type: 'change',
      field: 'password',
      value: 'KynWallet2026!',
    });
    state = registerReducer(state, {
      type: 'change',
      field: 'confirmPassword',
      value: 'KynWallet2026!',
    });
    state = registerReducer(state, { type: 'toggleTerms', checked: true });

    const submitting = registerReducer(state, { type: 'submit' });
    expect(submitting.status).toBe('submitting');
    expect(submitting.fieldErrors).toEqual({});

    // Un segundo submit en submitting se ignora
    expect(registerReducer(submitting, { type: 'submit' })).toBe(submitting);

    const registered = registerReducer(submitting, {
      type: 'submitResult',
      result: { kind: 'success' },
    });
    expect(registered.status).toBe('registered');
  });
});

describe('registerReducer · US2 Validación inline y previa al envío', () => {
  it('US2-2 / US2-3 / US2-4: valida inline al escribir en email, password y confirmPassword', () => {
    const afterEmail = registerReducer(initialRegisterState, {
      type: 'change',
      field: 'email',
      value: 'usuario@',
    });
    expect(afterEmail.fieldErrors.email).toBe(MESSAGES.EMAIL_INVALID);

    const afterPass = registerReducer(afterEmail, {
      type: 'change',
      field: 'password',
      value: 'debil',
    });
    expect(afterPass.fieldErrors.password).toBe(MESSAGES.PASSWORD_WEAK);

    const afterConfirm = registerReducer(afterPass, {
      type: 'change',
      field: 'confirmPassword',
      value: 'otra',
    });
    expect(afterConfirm.fieldErrors.confirmPassword).toBe(MESSAGES.CONFIRM_PASSWORD_MISMATCH);
  });

  it('US2-1: blur marca el campo como tocado y calcula su error', () => {
    const blurred = registerReducer(initialRegisterState, { type: 'blur', field: 'fullName' });
    expect(blurred.touched.fullName).toBe(true);
    expect(blurred.fieldErrors.fullName).toBe(MESSAGES.FULL_NAME_REQUIRED);
  });

  it('US2-5: editar password recalcula inmediatamente el error de confirmPassword si ya tenía valor', () => {
    let state = initialRegisterState;
    state = registerReducer(state, {
      type: 'change',
      field: 'password',
      value: 'KynWallet2026!',
    });
    state = registerReducer(state, {
      type: 'change',
      field: 'confirmPassword',
      value: 'KynWallet2026!',
    });
    expect(state.fieldErrors.confirmPassword).toBeUndefined();

    state = registerReducer(state, {
      type: 'change',
      field: 'password',
      value: 'KynWallet2027!',
    });
    expect(state.fieldErrors.confirmPassword).toBe(MESSAGES.CONFIRM_PASSWORD_MISMATCH);
  });

  it('US2-6: submit con errores marca todos los campos como tocados y permanece en editing', () => {
    const withTerms = registerReducer(initialRegisterState, {
      type: 'toggleTerms',
      checked: true,
    });
    const attempted = registerReducer(withTerms, { type: 'submit' });
    expect(attempted.status).toBe('editing');
    expect(attempted.touched).toEqual({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    expect(attempted.fieldErrors).toEqual({
      fullName: MESSAGES.FULL_NAME_REQUIRED,
      email: MESSAGES.EMAIL_REQUIRED,
      password: MESSAGES.PASSWORD_REQUIRED,
      confirmPassword: MESSAGES.CONFIRM_PASSWORD_REQUIRED,
    });
  });

  it('US2-7: corregir un campo con error limpia su mensaje inmediatamente', () => {
    const invalid = registerReducer(initialRegisterState, {
      type: 'change',
      field: 'email',
      value: 'invalido',
    });
    expect(invalid.fieldErrors.email).toBe(MESSAGES.EMAIL_INVALID);

    const fixed = registerReducer(invalid, {
      type: 'change',
      field: 'email',
      value: 'ana@example.test',
    });
    expect(fixed.fieldErrors.email).toBeUndefined();
  });

  it('FR-009 / FR-017: maneja email-already-exists y storage-error tras el envío', () => {
    let state = initialRegisterState;
    state = registerReducer(state, { type: 'change', field: 'fullName', value: 'Ana Gómez' });
    state = registerReducer(state, { type: 'change', field: 'email', value: 'ana@example.test' });
    state = registerReducer(state, {
      type: 'change',
      field: 'password',
      value: 'KynWallet2026!',
    });
    state = registerReducer(state, {
      type: 'change',
      field: 'confirmPassword',
      value: 'KynWallet2026!',
    });
    state = registerReducer(state, { type: 'toggleTerms', checked: true });
    state = registerReducer(state, { type: 'submit' });

    const duplicate = registerReducer(state, {
      type: 'submitResult',
      result: { kind: 'email-already-exists' },
    });
    expect(duplicate.status).toBe('submitError');
    expect(duplicate.fieldErrors.email).toBe(MESSAGES.EMAIL_ALREADY_EXISTS);

    const storageErr = registerReducer(state, {
      type: 'submitResult',
      result: { kind: 'storage-error' },
    });
    expect(storageErr.status).toBe('submitError');
    expect(storageErr.submitError).toBe('storage-error');
  });
});

describe('registerReducer · US3 Toast Próximamente', () => {
  it('US3-1 / US3-3: showToast establece toastMessage y dismissToast lo limpia', () => {
    const shown = registerReducer(initialRegisterState, {
      type: 'showToast',
      message: MESSAGES.COMING_SOON,
    });
    expect(shown.toastMessage).toBe('Próximamente');

    const dismissed = registerReducer(shown, { type: 'dismissToast' });
    expect(dismissed.toastMessage).toBeNull();
  });
});
