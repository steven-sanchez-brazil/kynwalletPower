import type { RegistrationResult } from '@/domain/auth';
import { MESSAGES } from '@/domain/messages';
import {
  validateRegistration,
  type RegistrationErrors,
  type RegistrationFormValues,
} from '@/domain/validation';

export type TextField = 'name' | 'email' | 'password' | 'confirmPassword';

type TouchedField = TextField | 'terms';

export type RegisterState = {
  status: 'editing' | 'submitting' | 'registerError' | 'success';
  values: RegistrationFormValues;
  touched: Record<TouchedField, boolean>;
  fieldErrors: RegistrationErrors;
  serviceError: 'email-taken' | 'unavailable' | null;
  createdName: string | null;
  notice: string | null;
};

export type RegisterAction =
  | { type: 'change'; field: TextField; value: string }
  | { type: 'blur'; field: TextField }
  | { type: 'toggleTerms'; checked: boolean }
  | { type: 'showNotice'; message: string }
  | { type: 'submit' }
  | { type: 'result'; result: RegistrationResult };

export const initialRegisterState: RegisterState = {
  status: 'editing',
  values: { name: '', email: '', password: '', confirmPassword: '', acceptedTerms: false },
  touched: { name: false, email: false, password: false, confirmPassword: false, terms: false },
  fieldErrors: {},
  serviceError: null,
  createdName: null,
  notice: null,
};

/** Errores visibles: solo los de campos ya tocados (FR-009). */
function visibleErrors(
  values: RegistrationFormValues,
  touched: RegisterState['touched'],
): RegistrationErrors {
  const errors = validateRegistration(values);
  const visible: RegistrationErrors = {};
  for (const key of Object.keys(errors) as (keyof RegistrationErrors)[]) {
    const field: TouchedField = key === 'terms' ? 'terms' : key;
    if (touched[field]) visible[key] = errors[key];
  }
  return visible;
}

/**
 * Recalcula los errores tras un cambio. El error de correo existente solo se limpia al editar el
 * correo (US3-2); el error de servicio se limpia con cualquier cambio.
 */
function afterEdit(
  state: RegisterState,
  values: RegistrationFormValues,
  touched: RegisterState['touched'],
  editedField?: TextField,
): RegisterState {
  const keepTaken = state.serviceError === 'email-taken' && editedField !== 'email';
  const fieldErrors = visibleErrors(values, touched);
  if (keepTaken) fieldErrors.email = MESSAGES.EMAIL_TAKEN;
  return {
    ...state,
    values,
    touched,
    fieldErrors,
    serviceError: keepTaken ? 'email-taken' : null,
    status: keepTaken
      ? 'registerError'
      : state.status === 'registerError'
        ? 'editing'
        : state.status,
  };
}

/** Máquina de estados del formulario (data-model.md, RegisterFormState). */
export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case 'change':
      return afterEdit(
        state,
        { ...state.values, [action.field]: action.value },
        state.touched,
        action.field,
      );

    case 'blur':
      return afterEdit(state, state.values, { ...state.touched, [action.field]: true });

    case 'toggleTerms':
      return afterEdit(state, { ...state.values, acceptedTerms: action.checked }, state.touched);

    case 'showNotice':
      return { ...state, notice: action.message };

    case 'submit': {
      if (state.status === 'submitting') return state;
      const touched = {
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        terms: true,
      };
      const fieldErrors = visibleErrors(state.values, touched);
      // FR-010: no se registra mientras existan errores de validación.
      const valid = Object.keys(fieldErrors).length === 0;
      return {
        ...state,
        touched,
        fieldErrors,
        status: valid ? 'submitting' : 'editing',
        serviceError: null,
        notice: null,
      };
    }

    case 'result':
      if (action.result.kind === 'success') {
        return { ...state, status: 'success', createdName: action.result.displayName };
      }
      // El registro no se completó: se conservan nombre y correo y se vacían las contraseñas.
      return {
        ...state,
        status: 'registerError',
        serviceError: action.result.kind,
        values: { ...state.values, password: '', confirmPassword: '' },
        fieldErrors:
          action.result.kind === 'email-taken'
            ? { ...state.fieldErrors, email: MESSAGES.EMAIL_TAKEN }
            : state.fieldErrors,
      };
  }
}
