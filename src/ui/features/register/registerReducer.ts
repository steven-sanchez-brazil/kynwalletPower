import type { RegistrationForm, RegistrationResult } from '@/domain/registration';
import { validateRegistration, type RegistrationErrors } from '@/domain/registrationValidation';

export type RegisterField = keyof RegistrationForm;
export type RegisterTextField = Exclude<RegisterField, 'acceptedTerms'>;

export type RegisterState = {
  status: 'editing' | 'submitting' | 'submitError' | 'registered';
  values: RegistrationForm;
  touched: Record<RegisterField, boolean>;
  fieldErrors: RegistrationErrors;
  submitError: 'email-taken' | 'unavailable' | null;
};

export type RegisterAction =
  | { type: 'change'; field: RegisterTextField; value: string }
  | { type: 'toggleTerms'; checked: boolean }
  | { type: 'blur'; field: RegisterField }
  | { type: 'submit' }
  | { type: 'result'; result: RegistrationResult };

const untouched: Record<RegisterField, boolean> = {
  fullName: false,
  email: false,
  password: false,
  confirmPassword: false,
  acceptedTerms: false,
};

export const initialRegisterState: RegisterState = {
  status: 'editing',
  values: { fullName: '', email: '', password: '', confirmPassword: '', acceptedTerms: false },
  touched: untouched,
  fieldErrors: {},
  submitError: null,
};

/** Errores visibles: solo los de campos ya tocados (FR-009). */
function visibleErrors(
  values: RegistrationForm,
  touched: Record<RegisterField, boolean>,
): RegistrationErrors {
  const errors = validateRegistration(values);
  return Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field as RegisterField]),
  ) as RegistrationErrors;
}

/** Aplica nuevos valores y tocados; un error de envío previo se descarta al editar. */
function edit(
  state: RegisterState,
  values: RegistrationForm,
  touched: Record<RegisterField, boolean>,
): RegisterState {
  return {
    ...state,
    status: state.status === 'submitError' ? 'editing' : state.status,
    submitError: null,
    values,
    touched,
    fieldErrors: visibleErrors(values, touched),
  };
}

/** Máquina de estados del formulario de registro (data-model.md, RegisterFormState). */
export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case 'change':
      return edit(state, { ...state.values, [action.field]: action.value }, state.touched);

    case 'toggleTerms':
      return edit(
        state,
        { ...state.values, acceptedTerms: action.checked },
        { ...state.touched, acceptedTerms: true },
      );

    case 'blur': {
      const touched = { ...state.touched, [action.field]: true };
      return { ...state, touched, fieldErrors: visibleErrors(state.values, touched) };
    }

    case 'submit': {
      if (state.status === 'submitting') return state;
      const touched = Object.fromEntries(
        Object.keys(untouched).map((field) => [field, true]),
      ) as Record<RegisterField, boolean>;
      const fieldErrors = visibleErrors(state.values, touched);
      // FR-010: no se registra mientras existan errores de validación.
      const status = Object.keys(fieldErrors).length > 0 ? 'editing' : 'submitting';
      return { ...state, status, touched, fieldErrors, submitError: null };
    }

    case 'result':
      if (action.result.kind === 'success') return { ...state, status: 'registered' };
      // Las contraseñas se vacían y vuelven a "no tocadas" para no mostrar errores de inmediato.
      return {
        ...state,
        status: 'submitError',
        submitError: action.result.kind,
        values: { ...state.values, password: '', confirmPassword: '' },
        touched: { ...state.touched, password: false, confirmPassword: false },
        fieldErrors: {},
      };
  }
}
