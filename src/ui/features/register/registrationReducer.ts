import type {
  RegistrationErrorField,
  RegistrationErrors,
  RegistrationField,
  RegistrationValues,
} from '@/domain/registrationValidation';

export type RegistrationState = {
  status: 'editing' | 'success';
  values: RegistrationValues;
  termsAccepted: boolean;
  touched: Partial<Record<RegistrationErrorField, boolean>>;
  submitted: boolean;
  errors: RegistrationErrors;
  notice: string | null;
};

export type RegistrationAction =
  | {
      type: 'change';
      field: RegistrationField;
      value: string;
      errors: RegistrationErrors;
    }
  | { type: 'blur'; field: RegistrationErrorField; errors: RegistrationErrors }
  | { type: 'terms'; checked: boolean; errors: RegistrationErrors }
  | { type: 'submit'; errors: RegistrationErrors }
  | { type: 'success' }
  | { type: 'showNotice'; message: string };

export const initialRegistrationState: RegistrationState = {
  status: 'editing',
  values: { fullName: '', email: '', password: '', confirmPassword: '' },
  termsAccepted: false,
  touched: {},
  submitted: false,
  errors: {},
  notice: null,
};

function visibleErrors(
  errors: RegistrationErrors,
  touched: RegistrationState['touched'],
  submitted: boolean,
): RegistrationErrors {
  if (submitted) return errors;
  return Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field as RegistrationErrorField]),
  );
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
        values,
        errors: visibleErrors(action.errors, state.touched, state.submitted),
        notice: null,
      };
    }
    case 'blur': {
      const touched = { ...state.touched, [action.field]: true };
      return {
        ...state,
        touched,
        errors: visibleErrors(action.errors, touched, state.submitted),
      };
    }
    case 'terms':
      return {
        ...state,
        termsAccepted: action.checked,
        errors: visibleErrors(action.errors, state.touched, state.submitted),
        notice: null,
      };
    case 'submit':
      return {
        ...state,
        submitted: true,
        touched: {
          fullName: true,
          email: true,
          password: true,
          confirmPassword: true,
          termsAccepted: true,
        },
        errors: action.errors,
        notice: null,
      };
    case 'success':
      return {
        ...initialRegistrationState,
        status: 'success',
      };
    case 'showNotice':
      return { ...state, notice: action.message };
  }
}
