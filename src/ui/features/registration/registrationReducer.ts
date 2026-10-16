import {
  type RegistrationErrors,
  type RegistrationField,
  type RegistrationValues,
} from '@/domain/registration';
import { validateRegistration } from '@/domain/validation';

export type RegistrationState = {
  values: RegistrationValues;
  touched: Partial<Record<RegistrationField, boolean>>;
  errors: RegistrationErrors;
  status: 'idle' | 'submitting';
  unavailable: boolean;
};

export function initialRegistrationState(): RegistrationState {
  return {
    values: { fullName: '', email: '', password: '', confirmPassword: '', termsAccepted: false },
    touched: {},
    errors: {},
    status: 'idle',
    unavailable: false,
  };
}

type Action =
  | { type: 'change'; field: RegistrationField; value: string | boolean }
  | { type: 'blur'; field: RegistrationField }
  | { type: 'validate'; errors: RegistrationErrors }
  | { type: 'submit' }
  | { type: 'failure' }
  | { type: 'reset' };

function visibleErrors(
  values: RegistrationValues,
  touched: RegistrationState['touched'],
): RegistrationErrors {
  return Object.fromEntries(
    Object.entries(validateRegistration(values)).filter(
      ([field]) => touched[field as RegistrationField],
    ),
  );
}

export function registrationReducer(state: RegistrationState, action: Action): RegistrationState {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value };
      return { ...state, values, errors: visibleErrors(values, state.touched), unavailable: false };
    }
    case 'blur': {
      const touched = { ...state.touched, [action.field]: true };
      return { ...state, touched, errors: visibleErrors(state.values, touched) };
    }
    case 'validate':
      return {
        ...state,
        status: 'idle',
        touched: {
          fullName: true,
          email: true,
          password: true,
          confirmPassword: true,
          termsAccepted: true,
        },
        errors: action.errors,
        unavailable: false,
      };
    case 'submit':
      return { ...state, status: 'submitting', errors: {}, unavailable: false };
    case 'failure':
      return {
        ...state,
        status: 'idle',
        values: { ...state.values, password: '', confirmPassword: '' },
        errors: {},
        unavailable: true,
      };
    case 'reset':
      return initialRegistrationState();
  }
}
