import type {
  RegistrationField,
  RegistrationFieldErrors,
  RegistrationInput,
  RegistrationResult,
} from '@/domain/registration';
import { MESSAGES } from '@/domain/messages';
import { validateRegistration } from '@/domain/registrationValidation';

export type RegistrationState = {
  status: 'editing' | 'submitting' | 'error';
  values: RegistrationInput;
  touched: Record<RegistrationField, boolean>;
  fieldErrors: RegistrationFieldErrors;
  formError: 'unavailable' | 'failure' | null;
  notice: string | null;
};

export type RegistrationAction =
  | { type: 'change'; field: RegistrationField; value: string | boolean }
  | { type: 'blur'; field: RegistrationField }
  | { type: 'submit' }
  | { type: 'result'; result: RegistrationResult }
  | { type: 'showNotice'; message: string };

const untouched: RegistrationState['touched'] = {
  displayName: false,
  email: false,
  password: false,
  confirmPassword: false,
  acceptedTerms: false,
};

export const initialRegistrationState: RegistrationState = {
  status: 'editing',
  values: {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  },
  touched: untouched,
  fieldErrors: {},
  formError: null,
  notice: null,
};

/** Devuelve los errores con el del campo indicado reemplazado o retirado (sin mutar). */
function setError(
  errors: RegistrationFieldErrors,
  field: RegistrationField,
  error: string | undefined,
): RegistrationFieldErrors {
  const rest = Object.fromEntries(
    Object.entries(errors).filter(([key]) => key !== field),
  ) as RegistrationFieldErrors;
  return error ? { ...rest, [field]: error } : rest;
}

/** Máquina de estados del formulario de registro (data-model.md, RegistrationFormState). */
export function registrationReducer(
  state: RegistrationState,
  action: RegistrationAction,
): RegistrationState {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value } as RegistrationInput;
      const validation = validateRegistration(values);
      let fieldErrors = state.fieldErrors;
      // Solo se recalcula el campo editado (y la confirmación si cambia la contraseña): un error
      // de otro campo, como el correo duplicado, se conserva hasta que se corrija (US2-6).
      const refresh = (field: RegistrationField) => {
        fieldErrors = setError(
          fieldErrors,
          field,
          state.touched[field] ? validation[field] : undefined,
        );
      };
      refresh(action.field);
      if (action.field === 'password') refresh('confirmPassword');
      return {
        ...state,
        status: state.status === 'error' ? 'editing' : state.status,
        formError: null,
        values,
        fieldErrors,
      };
    }

    case 'blur': {
      const error = validateRegistration(state.values)[action.field];
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
        fieldErrors: error ? setError(state.fieldErrors, action.field, error) : state.fieldErrors,
      };
    }

    case 'submit': {
      if (state.status === 'submitting') return state;
      const touched = {
        displayName: true,
        email: true,
        password: true,
        confirmPassword: true,
        acceptedTerms: true,
      };
      const fieldErrors = validateRegistration(state.values);
      // FR-006: un envío inválido no crea ninguna cuenta.
      const status = Object.keys(fieldErrors).length > 0 ? 'editing' : 'submitting';
      return { ...state, status, touched, fieldErrors, formError: null, notice: null };
    }

    case 'showNotice':
      return { ...state, notice: action.message };

    case 'result': {
      const { result } = action;
      switch (result.kind) {
        case 'success':
          return initialRegistrationState;
        case 'duplicate-email':
          return {
            ...state,
            status: 'editing',
            touched: { ...state.touched, email: true },
            fieldErrors: { ...state.fieldErrors, email: MESSAGES.EMAIL_TAKEN },
          };
        case 'invalid':
          return { ...state, status: 'editing', fieldErrors: result.errors };
        case 'unavailable':
        case 'failure':
          return { ...state, status: 'error', formError: result.kind };
      }
    }
  }
}
