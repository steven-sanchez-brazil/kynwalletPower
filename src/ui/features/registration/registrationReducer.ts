import type { RegisterUserResult } from '@/application/registerUser';
import { MESSAGES } from '@/domain/messages';
import type {
  RegistrationErrors,
  RegistrationField,
  RegistrationValues,
} from '@/domain/registration';
import { validateRegistration } from '@/domain/registrationValidation';

export type RegistrationStatus = 'editing' | 'submitting' | 'submitError';

export type RegistrationState = {
  status: RegistrationStatus;
  values: RegistrationValues;
  touched: Record<RegistrationField, boolean>;
  fieldErrors: RegistrationErrors;
  notice: string | null;
  submitError: string | null;
};

type TextField = Exclude<RegistrationField, 'acceptedTerms'>;

export type RegistrationAction =
  | { type: 'change'; field: TextField; value: string }
  | { type: 'blur'; field: RegistrationField }
  | { type: 'setTerms'; checked: boolean }
  | { type: 'showNotice'; message: string }
  | { type: 'submit' }
  | { type: 'result'; result: RegisterUserResult }
  | { type: 'reset' };

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

const emptyValues: RegistrationValues = {
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  acceptedTerms: false,
};

export const initialRegistrationState: RegistrationState = {
  status: 'editing',
  values: emptyValues,
  touched: untouched,
  fieldErrors: {},
  notice: null,
  submitError: null,
};

function visibleErrors(
  values: RegistrationValues,
  touched: RegistrationState['touched'],
): RegistrationErrors {
  const errors = validateRegistration(values);
  return Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field as RegistrationField]),
  ) as RegistrationErrors;
}

export function registrationReducer(
  state: RegistrationState,
  action: RegistrationAction,
): RegistrationState {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value };
      return {
        ...state,
        status: 'editing',
        values,
        submitError: null,
        notice: null,
        fieldErrors: visibleErrors(values, state.touched),
      };
    }
    case 'blur': {
      const touched = { ...state.touched, [action.field]: true };
      return { ...state, touched, fieldErrors: visibleErrors(state.values, touched) };
    }
    case 'setTerms': {
      const values = { ...state.values, acceptedTerms: action.checked };
      return {
        ...state,
        status: 'editing',
        values,
        submitError: null,
        fieldErrors: visibleErrors(values, state.touched),
      };
    }
    case 'showNotice':
      return { ...state, notice: action.message };
    case 'submit': {
      if (state.status === 'submitting') return state;
      const fieldErrors = validateRegistration(state.values);
      if (Object.keys(fieldErrors).length > 0) {
        return {
          ...state,
          status: 'editing',
          touched: allTouched,
          fieldErrors,
          submitError: null,
          notice: null,
        };
      }
      return {
        ...state,
        status: 'submitting',
        touched: allTouched,
        fieldErrors: {},
        submitError: null,
        notice: null,
      };
    }
    case 'result':
      if (action.result.kind === 'invalid') {
        return {
          ...state,
          status: 'editing',
          touched: allTouched,
          fieldErrors: action.result.errors,
        };
      }
      if (action.result.kind === 'unavailable') {
        return {
          ...state,
          status: 'submitError',
          submitError: MESSAGES.REGISTRATION_UNAVAILABLE,
        };
      }
      return initialRegistrationState;
    case 'reset':
      return initialRegistrationState;
  }
}
