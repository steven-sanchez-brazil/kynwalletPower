import type { RegisterResult, RegistrationData } from '@/domain/auth';
import {
  validateRegistration,
  type RegistrationErrors,
  type RegistrationField,
} from '@/domain/validation';

export type { RegistrationField, RegistrationErrors };

export type RegisterState = {
  status: 'editing' | 'submitting' | 'registerError' | 'success';
  values: RegistrationData;
  touched: Record<RegistrationField, boolean>;
  fieldErrors: RegistrationErrors;
  registerError: 'email-already-exists' | 'unavailable' | null;
  notice: string | null;
};

export type RegisterAction =
  | { type: 'change'; field: 'fullName' | 'email' | 'password' | 'confirmPassword'; value: string }
  | { type: 'change'; field: 'termsAccepted'; value: boolean }
  | { type: 'blur'; field: RegistrationField }
  | { type: 'showNotice'; message: string }
  | { type: 'submit' }
  | { type: 'result'; result: RegisterResult };

export const initialRegisterState: RegisterState = {
  status: 'editing',
  values: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  },
  touched: {
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    termsAccepted: false,
  },
  fieldErrors: {},
  registerError: null,
  notice: null,
};

const ALL_TOUCHED: Record<RegistrationField, boolean> = {
  fullName: true,
  email: true,
  password: true,
  confirmPassword: true,
  termsAccepted: true,
};

/** Errores visibles: solo los de campos ya tocados (FR-003). */
function visibleRegistrationErrors(
  values: RegistrationData,
  touched: Record<RegistrationField, boolean>,
): RegistrationErrors {
  const errors = validateRegistration(values);
  const visible: RegistrationErrors = {};
  if (touched.fullName && errors.fullName) visible.fullName = errors.fullName;
  if (touched.email && errors.email) visible.email = errors.email;
  if (touched.password && errors.password) visible.password = errors.password;
  if (touched.confirmPassword && errors.confirmPassword) {
    visible.confirmPassword = errors.confirmPassword;
  }
  if (touched.termsAccepted && errors.termsAccepted) {
    visible.termsAccepted = errors.termsAccepted;
  }
  return visible;
}

/** Máquina de estados del formulario de registro (data-model.md, RegisterFormState). */
export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value } as RegistrationData;
      return {
        ...state,
        status: state.status === 'registerError' ? 'editing' : state.status,
        registerError: null,
        values,
        fieldErrors: visibleRegistrationErrors(values, state.touched),
      };
    }

    case 'blur': {
      const touched = { ...state.touched, [action.field]: true };
      return {
        ...state,
        touched,
        fieldErrors: visibleRegistrationErrors(state.values, touched),
      };
    }

    case 'showNotice':
      return { ...state, notice: action.message };

    case 'submit': {
      if (state.status === 'submitting' || state.status === 'success') return state;
      const fieldErrors = visibleRegistrationErrors(state.values, ALL_TOUCHED);
      const status = Object.keys(fieldErrors).length > 0 ? 'editing' : 'submitting';
      return {
        ...state,
        status,
        touched: ALL_TOUCHED,
        fieldErrors,
        registerError: null,
        notice: null,
      };
    }

    case 'result':
      if (action.result.kind === 'success') {
        return {
          ...state,
          status: 'success',
          registerError: null,
        };
      }
      return {
        ...state,
        status: 'registerError',
        registerError: action.result.kind,
        values: {
          ...state.values,
          password: '',
          confirmPassword: '',
        },
      };
  }
}
