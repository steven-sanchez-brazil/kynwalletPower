import type { RegisterResult, RegistrationData, RegistrationValidationErrors } from '@/domain/auth';
import { validateRegistration } from '@/domain/validation';

export type RegisterField = keyof RegistrationData;

export type RegisterFormStatus = 'idle' | 'submitting' | 'success';

export interface RegisterFormState {
  readonly values: RegistrationData;
  readonly touched: Record<RegisterField, boolean>;
  readonly errors: RegistrationValidationErrors;
  readonly status: RegisterFormStatus;
  readonly socialNotice: string | null;
  readonly isPasswordVisible: boolean;
  readonly isConfirmPasswordVisible: boolean;
}

export type RegisterAction =
  | { type: 'change'; field: 'fullName' | 'email' | 'password' | 'confirmPassword'; value: string }
  | { type: 'changeTerms'; checked: boolean }
  | { type: 'blur'; field: RegisterField }
  | { type: 'togglePasswordVisibility' }
  | { type: 'toggleConfirmPasswordVisibility' }
  | { type: 'showSocialNotice'; message: string }
  | { type: 'clearSocialNotice' }
  | { type: 'submit' }
  | { type: 'result'; result: RegisterResult }
  | { type: 'reset' };

export const initialRegisterState: RegisterFormState = {
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
  errors: {},
  status: 'idle',
  socialNotice: null,
  isPasswordVisible: false,
  isConfirmPasswordVisible: false,
};

/** Errores visibles: solo aquellos de campos que ya han sido tocados (FR-008, FR-009). */
function computeVisibleErrors(
  values: RegistrationData,
  touched: Record<RegisterField, boolean>,
  existingErrors: RegistrationValidationErrors = {},
): RegistrationValidationErrors {
  const allErrors = validateRegistration(values);
  const visible: RegistrationValidationErrors = {};

  if (touched.fullName && allErrors.fullName) visible.fullName = allErrors.fullName;
  if (touched.email && allErrors.email) visible.email = allErrors.email;
  if (touched.password && allErrors.password) visible.password = allErrors.password;
  if (touched.confirmPassword && allErrors.confirmPassword)
    visible.confirmPassword = allErrors.confirmPassword;
  if (touched.termsAccepted && allErrors.termsAccepted)
    visible.termsAccepted = allErrors.termsAccepted;
  if (existingErrors.global) visible.global = existingErrors.global;
  // Preserve server-side email error (e.g. already-registered) when present in existingErrors
  // and the field passes domain validation (or hasn't been touched).
  // Caller is responsible for clearing it when the email field itself is edited.
  if (!visible.email && existingErrors.email) visible.email = existingErrors.email;

  return visible;
}

/** Máquina de estados del formulario de registro (data-model.md, Section 3). */
export function registerReducer(
  state: RegisterFormState,
  action: RegisterAction,
): RegisterFormState {
  switch (action.type) {
    case 'change': {
      const values: RegistrationData = { ...state.values, [action.field]: action.value };
      // When the user edits the email field, clear any server-side email error (e.g.
      // "already-registered") so it doesn't persist once they start correcting it.
      const existingForCompute: RegistrationValidationErrors =
        action.field === 'email' ? { ...state.errors, email: undefined } : state.errors;
      return {
        ...state,
        values,
        errors: computeVisibleErrors(values, state.touched, existingForCompute),
      };
    }

    case 'changeTerms': {
      const values: RegistrationData = { ...state.values, termsAccepted: action.checked };
      const touched = { ...state.touched, termsAccepted: true };
      return {
        ...state,
        values,
        touched,
        errors: computeVisibleErrors(values, touched, state.errors),
      };
    }

    case 'blur': {
      const touched = { ...state.touched, [action.field]: true };
      return {
        ...state,
        touched,
        errors: computeVisibleErrors(state.values, touched, state.errors),
      };
    }

    case 'togglePasswordVisibility':
      return {
        ...state,
        isPasswordVisible: !state.isPasswordVisible,
      };

    case 'toggleConfirmPasswordVisibility':
      return {
        ...state,
        isConfirmPasswordVisible: !state.isConfirmPasswordVisible,
      };

    case 'showSocialNotice':
      return {
        ...state,
        socialNotice: action.message,
      };

    case 'clearSocialNotice':
      return {
        ...state,
        socialNotice: null,
      };

    case 'submit': {
      if (state.status === 'submitting') return state;

      const allTouched: Record<RegisterField, boolean> = {
        fullName: true,
        email: true,
        password: true,
        confirmPassword: true,
        termsAccepted: true,
      };
      const allErrors = validateRegistration(state.values);

      if (Object.keys(allErrors).length > 0) {
        return {
          ...state,
          status: 'idle',
          touched: allTouched,
          errors: allErrors,
          socialNotice: null,
        };
      }

      return {
        ...state,
        status: 'submitting',
        touched: allTouched,
        errors: {},
        socialNotice: null,
      };
    }

    case 'result': {
      if (action.result.kind === 'success') {
        return {
          ...state,
          status: 'success',
          errors: {},
        };
      }

      if (action.result.kind === 'email-already-registered') {
        return {
          ...state,
          status: 'idle',
          errors: {
            ...state.errors,
            email: action.result.message,
          },
        };
      }

      if (action.result.kind === 'validation-error') {
        return {
          ...state,
          status: 'idle',
          errors: {
            ...state.errors,
            ...action.result.errors,
          },
        };
      }

      return {
        ...state,
        status: 'idle',
        errors: {
          ...state.errors,
          global: action.result.message,
        },
      };
    }

    case 'reset':
      return initialRegisterState;
  }
}
