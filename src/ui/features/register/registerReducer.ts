import { MESSAGES } from '@/domain/messages';
import type {
  RegistrationFieldErrors,
  RegistrationInput,
  RegistrationResult,
} from '@/domain/registration';
import { validateRegistration } from '@/domain/validation';

export type RegisterTextField = 'fullName' | 'email' | 'password' | 'confirmPassword';

export type RegisterFormState = {
  status: 'editing' | 'submitting' | 'submitError' | 'registered';
  values: RegistrationInput;
  touched: Record<RegisterTextField, boolean>;
  fieldErrors: RegistrationFieldErrors;
  submitError: 'storage-error' | null;
  toastMessage: string | null;
};

export type RegisterAction =
  | { type: 'change'; field: RegisterTextField; value: string }
  | { type: 'blur'; field: RegisterTextField }
  | { type: 'toggleTerms'; checked: boolean }
  | { type: 'showToast'; message: string }
  | { type: 'dismissToast' }
  | { type: 'submit' }
  | { type: 'submitResult'; result: RegistrationResult };

export const initialRegisterState: RegisterFormState = {
  status: 'editing',
  values: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  },
  touched: {
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  },
  fieldErrors: {},
  submitError: null,
  toastMessage: null,
};

function computeVisibleErrors(
  values: RegistrationInput,
  touched: RegisterFormState['touched'],
): RegistrationFieldErrors {
  const allErrors = validateRegistration(values);
  const visible: RegistrationFieldErrors = {};

  if (touched.fullName && allErrors.fullName) visible.fullName = allErrors.fullName;
  if (touched.email && allErrors.email) visible.email = allErrors.email;
  if (touched.password && allErrors.password) visible.password = allErrors.password;
  if (touched.confirmPassword && allErrors.confirmPassword) {
    visible.confirmPassword = allErrors.confirmPassword;
  }

  return visible;
}

/** Máquina de estados e inline validation del formulario de registro (data-model.md). */
export function registerReducer(
  state: RegisterFormState,
  action: RegisterAction,
): RegisterFormState {
  switch (action.type) {
    case 'change': {
      const values: RegistrationInput = { ...state.values, [action.field]: action.value };
      // Validación inline inmediata para email, password y confirmPassword (FR-003, FR-004, FR-005, FR-006)
      const isInlineField =
        action.field === 'email' ||
        action.field === 'password' ||
        action.field === 'confirmPassword';
      const touched: RegisterFormState['touched'] = {
        ...state.touched,
        ...(isInlineField ? { [action.field]: true } : {}),
        ...(action.field === 'password' && state.values.confirmPassword !== ''
          ? { confirmPassword: true }
          : {}),
      };

      return {
        ...state,
        status: state.status === 'submitError' ? 'editing' : state.status,
        submitError: null,
        values,
        touched,
        fieldErrors: computeVisibleErrors(values, touched),
      };
    }

    case 'blur': {
      const touched = { ...state.touched, [action.field]: true };
      return {
        ...state,
        touched,
        fieldErrors: computeVisibleErrors(state.values, touched),
      };
    }

    case 'toggleTerms': {
      const values = { ...state.values, acceptedTerms: action.checked };
      const fieldErrors = { ...state.fieldErrors };
      delete fieldErrors.acceptedTerms;
      return {
        ...state,
        values,
        fieldErrors,
      };
    }

    case 'showToast':
      return { ...state, toastMessage: action.message };

    case 'dismissToast':
      return { ...state, toastMessage: null };

    case 'submit': {
      if (state.status === 'submitting') return state;
      const touched: RegisterFormState['touched'] = {
        fullName: true,
        email: true,
        password: true,
        confirmPassword: true,
      };
      const allErrors = validateRegistration(state.values);
      const visible = computeVisibleErrors(state.values, touched);
      const hasErrors = Object.keys(allErrors).length > 0;

      return {
        ...state,
        status: hasErrors ? 'editing' : 'submitting',
        touched,
        fieldErrors: visible,
        submitError: null,
      };
    }

    case 'submitResult': {
      if (action.result.kind === 'success') {
        return {
          ...state,
          status: 'registered',
          submitError: null,
        };
      }
      if (action.result.kind === 'email-already-exists') {
        return {
          ...state,
          status: 'submitError',
          submitError: null,
          fieldErrors: {
            ...state.fieldErrors,
            email: MESSAGES.EMAIL_ALREADY_EXISTS,
          },
        };
      }
      return {
        ...state,
        status: 'submitError',
        submitError: 'storage-error',
      };
    }
  }
}
