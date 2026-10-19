import { MESSAGES } from '@/domain/messages';
import { NEW_REGISTRATION } from '@/test/fixtures';
import {
  initialRegistrationState,
  registrationReducer,
  type RegistrationState,
} from './registrationReducer';

const filled: RegistrationState = {
  ...initialRegistrationState,
  values: { ...NEW_REGISTRATION },
};

describe('registrationReducer · US1 Crear una cuenta de demostración', () => {
  it('estado inicial: formulario vacío, sin errores y sin enviar', () => {
    expect(initialRegistrationState).toMatchObject({
      status: 'editing',
      values: {
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptedTerms: false,
      },
      fieldErrors: {},
      notice: null,
    });
  });

  it('change actualiza un valor sin tocar los demás', () => {
    const next = registrationReducer(initialRegistrationState, {
      type: 'change',
      field: 'email',
      value: 'a@example.test',
    });
    expect(next.values.email).toBe('a@example.test');
    expect(next.values.displayName).toBe('');
  });

  it('change admite el valor booleano de los términos', () => {
    const next = registrationReducer(initialRegistrationState, {
      type: 'change',
      field: 'acceptedTerms',
      value: true,
    });
    expect(next.values.acceptedTerms).toBe(true);
  });

  it('REG US1-1: un submit con datos válidos pasa a submitting', () => {
    const next = registrationReducer(filled, { type: 'submit' });
    expect(next.status).toBe('submitting');
    expect(next.fieldErrors).toEqual({});
  });

  it('REG US1-5: un segundo submit durante el envío se ignora', () => {
    const submitting = registrationReducer(filled, { type: 'submit' });
    expect(registrationReducer(submitting, { type: 'submit' })).toBe(submitting);
  });

  it('REG US1-1: el resultado success reinicia el formulario', () => {
    const submitting = registrationReducer(filled, { type: 'submit' });
    const next = registrationReducer(submitting, { type: 'result', result: { kind: 'success' } });
    expect(next).toEqual(initialRegistrationState);
  });
});

describe('registrationReducer · US2 Corregir datos y evitar duplicados', () => {
  it('blur marca el campo como tocado y muestra su error', () => {
    const next = registrationReducer(initialRegistrationState, { type: 'blur', field: 'email' });
    expect(next.touched.email).toBe(true);
    expect(next.fieldErrors).toEqual({ email: MESSAGES.EMAIL_REQUIRED });
  });

  it('un campo sin tocar no muestra errores mientras se escribe', () => {
    const next = registrationReducer(initialRegistrationState, {
      type: 'change',
      field: 'email',
      value: 'usuario@',
    });
    expect(next.fieldErrors).toEqual({});
  });

  it('REG US2-1 / FR-006: un submit inválido muestra todos los errores y no envía', () => {
    const next = registrationReducer(initialRegistrationState, { type: 'submit' });
    expect(next.status).toBe('editing');
    expect(Object.keys(next.fieldErrors)).toEqual([
      'displayName',
      'email',
      'password',
      'confirmPassword',
      'acceptedTerms',
    ]);
  });

  it('REG US2-6: corregir un campo retira solo su error y conserva los demás valores', () => {
    const invalid = registrationReducer(
      { ...initialRegistrationState, values: { ...NEW_REGISTRATION, email: 'usuario@' } },
      { type: 'submit' },
    );
    expect(invalid.fieldErrors.email).toBe(MESSAGES.EMAIL_INVALID);
    const fixed = registrationReducer(invalid, {
      type: 'change',
      field: 'email',
      value: 'diego@example.test',
    });
    expect(fixed.fieldErrors).toEqual({});
    expect(fixed.values.displayName).toBe(NEW_REGISTRATION.displayName);
    expect(fixed.values.password).toBe(NEW_REGISTRATION.password);
  });

  it('caso límite: cambiar la contraseña invalida una confirmación que ya no coincide', () => {
    const confirmed = registrationReducer(filled, { type: 'blur', field: 'confirmPassword' });
    expect(confirmed.fieldErrors).toEqual({});
    const next = registrationReducer(confirmed, {
      type: 'change',
      field: 'password',
      value: 'otra-clave-99',
    });
    expect(next.fieldErrors.confirmPassword).toBe(MESSAGES.CONFIRM_MISMATCH);
  });

  it('REG US2-5: duplicate-email marca el correo y conserva los datos', () => {
    const submitting = registrationReducer(filled, { type: 'submit' });
    const next = registrationReducer(submitting, {
      type: 'result',
      result: { kind: 'duplicate-email' },
    });
    expect(next.status).toBe('editing');
    expect(next.fieldErrors.email).toBe(MESSAGES.EMAIL_TAKEN);
    expect(next.values).toEqual(filled.values);
  });

  it('REG US2-5: el error de duplicado solo se retira al cambiar el correo', () => {
    const duplicated = registrationReducer(registrationReducer(filled, { type: 'submit' }), {
      type: 'result',
      result: { kind: 'duplicate-email' },
    });
    const otherField = registrationReducer(duplicated, {
      type: 'change',
      field: 'displayName',
      value: 'Otro Nombre',
    });
    expect(otherField.fieldErrors.email).toBe(MESSAGES.EMAIL_TAKEN);
    const email = registrationReducer(otherField, {
      type: 'change',
      field: 'email',
      value: 'nuevo.correo@example.test',
    });
    expect(email.fieldErrors.email).toBeUndefined();
  });

  it.each(['unavailable', 'failure'] as const)(
    'REG FR-014: %s deja un error general, conserva los datos y se descarta al editar',
    (kind) => {
      const submitting = registrationReducer(filled, { type: 'submit' });
      const failed = registrationReducer(submitting, { type: 'result', result: { kind } });
      expect(failed.status).toBe('error');
      expect(failed.formError).toBe(kind);
      expect(failed.values).toEqual(filled.values);
      const edited = registrationReducer(failed, {
        type: 'change',
        field: 'displayName',
        value: 'Diego',
      });
      expect(edited.status).toBe('editing');
      expect(edited.formError).toBeNull();
    },
  );

  it('invalid muestra los errores recibidos', () => {
    const submitting = registrationReducer(filled, { type: 'submit' });
    const next = registrationReducer(submitting, {
      type: 'result',
      result: { kind: 'invalid', errors: { email: MESSAGES.EMAIL_INVALID } },
    });
    expect(next.status).toBe('editing');
    expect(next.fieldErrors).toEqual({ email: MESSAGES.EMAIL_INVALID });
  });
});

describe('registrationReducer · US3 Navegar y conocer las opciones disponibles', () => {
  it('REG US3-2: showNotice guarda el aviso sin tocar los datos del formulario', () => {
    const next = registrationReducer(filled, { type: 'showNotice', message: MESSAGES.COMING_SOON });
    expect(next.notice).toBe('Próximamente');
    expect(next.values).toEqual(filled.values);
    expect(next.status).toBe('editing');
  });

  it('REG US3-2: el aviso se descarta al enviar', () => {
    const withNotice = registrationReducer(filled, {
      type: 'showNotice',
      message: MESSAGES.COMING_SOON,
    });
    expect(registrationReducer(withNotice, { type: 'submit' }).notice).toBeNull();
  });
});
