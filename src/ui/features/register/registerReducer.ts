import type { RegisterResult } from '@/domain/auth';
import { MESSAGES } from '@/domain/messages';
import {
  REGISTRATION_FIELDS,
  validateRegistration,
  type RegistrationData,
  type RegistrationErrors,
  type RegistrationField,
} from '@/domain/registration';

export type TextField = Exclude<RegistrationField, 'acceptedTerms'>;

export type RegisterState = {
  status: 'editing' | 'submitting' | 'registered';
  values: RegistrationData;
  touched: Record<RegistrationField, boolean>;
  fieldErrors: RegistrationErrors;
  submitError: 'email-taken' | 'unavailable' | null;
};

export type RegisterAction =
  | { type: 'change'; field: TextField; value: string }
  | { type: 'toggleTerms'; checked: boolean }
  | { type: 'blur'; field: RegistrationField }
  | { type: 'submit' }
  | { type: 'result'; result: RegisterResult };

const untouched: Record<RegistrationField, boolean> = {
  fullName: false,
  email: false,
  password: false,
  passwordConfirmation: false,
  acceptedTerms: false,
};

const allTouched: Record<RegistrationField, boolean> = {
  fullName: true,
  email: true,
  password: true,
  passwordConfirmation: true,
  acceptedTerms: true,
};

export const initialRegisterState: RegisterState = {
  status: 'editing',
  values: {
    fullName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    acceptedTerms: false,
  },
  touched: untouched,
  fieldErrors: {},
  submitError: null,
};

/** Errores visibles: solo los de campos ya tocados (FR-008). */
function visibleErrors(
  values: RegistrationData,
  touched: RegisterState['touched'],
): RegistrationErrors {
  const errors = validateRegistration(values);
  const visible: RegistrationErrors = {};
  for (const field of REGISTRATION_FIELDS) {
    if (touched[field] && errors[field]) visible[field] = errors[field];
  }
  return visible;
}

/** Cualquier edición descarta el error del último envío (data-model.md). */
function withValues(state: RegisterState, values: RegistrationData): RegisterState {
  return {
    ...state,
    values,
    submitError: null,
    fieldErrors: visibleErrors(values, state.touched),
  };
}

/** Máquina de estados del formulario de registro (data-model.md, RegisterFormState). */
export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case 'change':
      return withValues(state, { ...state.values, [action.field]: action.value });

    case 'toggleTerms':
      return withValues(state, { ...state.values, acceptedTerms: action.checked });

    case 'blur': {
      const touched = { ...state.touched, [action.field]: true };
      const fieldErrors = visibleErrors(state.values, touched);
      // El error de correo duplicado se conserva hasta que el usuario edite (US3-2).
      if (state.submitError === 'email-taken') fieldErrors.email = MESSAGES.EMAIL_TAKEN;
      return { ...state, touched, fieldErrors };
    }

    case 'submit': {
      if (state.status === 'submitting') return state;
      const fieldErrors = visibleErrors(state.values, allTouched);
      // FR-009: no se registra mientras existan errores de validación.
      const status = Object.keys(fieldErrors).length > 0 ? 'editing' : 'submitting';
      return { ...state, status, touched: allTouched, fieldErrors, submitError: null };
    }

    case 'result':
      if (action.result.kind === 'success') return { ...state, status: 'registered' };
      return {
        ...state,
        status: 'editing',
        submitError: action.result.kind,
        fieldErrors:
          action.result.kind === 'email-taken'
            ? { ...state.fieldErrors, email: MESSAGES.EMAIL_TAKEN }
            : state.fieldErrors,
      };
  }
}
