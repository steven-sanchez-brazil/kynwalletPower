import type {
  RegistrationErrors,
  RegistrationRequest,
  RegistrationResult,
} from '@/domain/registration';
import { validateRegistration } from '@/domain/validation';

export type Field = 'fullName' | 'email' | 'password' | 'confirmPassword';
type Touchable = keyof RegistrationRequest;

export type RegisterState = {
  status: 'editing' | 'submitting' | 'failure' | 'registered';
  values: Record<Field, string>;
  acceptedTerms: boolean;
  touched: Record<Touchable, boolean>;
  fieldErrors: RegistrationErrors;
  failure: 'rejected' | 'unavailable' | null;
  notice: string | null;
};

export type RegisterAction =
  | { type: 'change'; field: Field; value: string }
  | { type: 'blur'; field: Touchable }
  | { type: 'toggleTerms'; checked: boolean }
  | { type: 'showNotice'; message: string }
  | { type: 'submit' }
  | { type: 'result'; result: RegistrationResult };

const untouched: RegisterState['touched'] = {
  fullName: false,
  email: false,
  password: false,
  confirmPassword: false,
  acceptedTerms: false,
};

const allTouched: RegisterState['touched'] = {
  fullName: true,
  email: true,
  password: true,
  confirmPassword: true,
  acceptedTerms: true,
};

export const initialRegisterState: RegisterState = {
  status: 'editing',
  values: { fullName: '', email: '', password: '', confirmPassword: '' },
  acceptedTerms: false,
  touched: untouched,
  fieldErrors: {},
  failure: null,
  notice: null,
};

/** Errores visibles: solo los de campos ya tocados (FR-008). */
function visibleErrors(
  values: RegisterState['values'],
  acceptedTerms: boolean,
  touched: RegisterState['touched'],
): RegistrationErrors {
  const errors = validateRegistration({ ...values, acceptedTerms });
  const visible: RegistrationErrors = {};
  for (const field of Object.keys(errors) as Touchable[]) {
    if (touched[field]) visible[field] = errors[field];
  }
  return visible;
}

/** Máquina de estados del formulario (data-model.md, RegisterState). */
export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value };
      return {
        ...state,
        status: state.status === 'failure' ? 'editing' : state.status,
        failure: null,
        notice: null,
        values,
        // Al cambiar la contraseña, la confirmación ya tocada se revalida.
        fieldErrors: visibleErrors(values, state.acceptedTerms, state.touched),
      };
    }

    case 'blur': {
      const touched = { ...state.touched, [action.field]: true };
      return {
        ...state,
        touched,
        fieldErrors: visibleErrors(state.values, state.acceptedTerms, touched),
      };
    }

    case 'toggleTerms': {
      const touched = { ...state.touched, acceptedTerms: true };
      return {
        ...state,
        status: state.status === 'failure' ? 'editing' : state.status,
        failure: null,
        notice: null,
        acceptedTerms: action.checked,
        touched,
        fieldErrors: visibleErrors(state.values, action.checked, touched),
      };
    }

    case 'showNotice':
      return { ...state, notice: action.message };

    case 'submit': {
      if (state.status === 'submitting' || state.status === 'registered') return state;
      const fieldErrors = visibleErrors(state.values, state.acceptedTerms, allTouched);
      // FR-009: no se envía mientras existan errores de validación.
      const status = Object.keys(fieldErrors).length > 0 ? 'editing' : 'submitting';
      return { ...state, status, touched: allTouched, fieldErrors, failure: null, notice: null };
    }

    case 'result': {
      const { result } = action;
      // La redirección a /login la hace la página (data-model.md, FR-011).
      if (result.kind === 'created') return { ...state, status: 'registered' };
      if (result.kind === 'invalid') {
        return { ...state, status: 'editing', touched: allTouched, fieldErrors: result.errors };
      }
      return {
        ...state,
        status: 'failure',
        failure: result.kind,
        values: { ...state.values, password: '', confirmPassword: '' },
      };
    }
  }
}
