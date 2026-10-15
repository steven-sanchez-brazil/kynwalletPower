import { MESSAGES } from '@/domain/messages';
import {
  REGISTRATION_FIELDS,
  validateRegistration,
  type RegistrationData,
  type RegistrationErrors,
  type RegistrationField,
  type RegistrationResult,
} from '@/domain/registration';

export type RegisterState = {
  status: 'editing' | 'submitting';
  values: RegistrationData;
  touched: Record<RegistrationField, boolean>;
  fieldErrors: RegistrationErrors;
  emailTaken: boolean;
  failure: boolean;
};

export type RegisterAction =
  | { type: 'change'; field: 'fullName' | 'email' | 'password' | 'confirmPassword'; value: string }
  | { type: 'change'; field: 'acceptTerms'; value: boolean }
  | { type: 'blur'; field: RegistrationField }
  | { type: 'submit' }
  | { type: 'result'; result: RegistrationResult };

const untouched: Record<RegistrationField, boolean> = {
  fullName: false,
  email: false,
  password: false,
  confirmPassword: false,
  acceptTerms: false,
};

export const initialRegisterState: RegisterState = {
  status: 'editing',
  values: { fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
  touched: untouched,
  fieldErrors: {},
  emailTaken: false,
  failure: false,
};

/** Errores visibles: los de campos tocados, más el correo repetido (FR-008, FR-011). */
function visibleErrors(state: Pick<RegisterState, 'values' | 'touched' | 'emailTaken'>) {
  const errors = validateRegistration(state.values);
  const visible: RegistrationErrors = {};
  for (const field of REGISTRATION_FIELDS) {
    const error = errors[field];
    if (state.touched[field] && error) visible[field] = error;
  }
  if (state.emailTaken && !visible.email) visible.email = MESSAGES.EMAIL_TAKEN;
  return visible;
}

const allTouched = Object.fromEntries(REGISTRATION_FIELDS.map((field) => [field, true])) as Record<
  RegistrationField,
  boolean
>;

/** Primer campo, en orden visual, que impide enviar el formulario (FR-009). */
export function firstInvalidField(state: RegisterState): RegistrationField | null {
  const errors = visibleErrors({ ...state, touched: allTouched });
  return REGISTRATION_FIELDS.find((field) => errors[field]) ?? null;
}

function hasContent(value: string | boolean): boolean {
  return typeof value === 'string' ? value.trim() !== '' : value;
}

/** Máquina de estados del formulario de registro (data-model.md › RegisterFormState). */
export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value };
      const emailTaken = action.field === 'email' ? false : state.emailTaken;
      const next = { ...state, values, emailTaken, failure: false };
      return { ...next, fieldErrors: visibleErrors(next) };
    }

    case 'blur': {
      // Salir de un campo vacío sin error previo no lo marca (research R5): evita desplazar
      // el formulario justo cuando el usuario hace clic en otra acción.
      const showing = Boolean(state.fieldErrors[action.field]);
      if (!showing && !hasContent(state.values[action.field])) return state;
      const touched = { ...state.touched, [action.field]: true };
      return { ...state, touched, fieldErrors: visibleErrors({ ...state, touched }) };
    }

    case 'submit': {
      if (state.status === 'submitting') return state;
      const touched = allTouched;
      const fieldErrors = visibleErrors({ ...state, touched });
      // FR-009: no se registra mientras existan errores.
      const status = Object.keys(fieldErrors).length > 0 ? 'editing' : 'submitting';
      return { ...state, status, touched, fieldErrors, failure: false };
    }

    case 'result': {
      if (action.result.kind === 'success') return state;
      if (action.result.kind === 'email-taken') {
        const next = { ...state, status: 'editing' as const, emailTaken: true };
        return { ...next, fieldErrors: visibleErrors(next) };
      }
      return { ...state, status: 'editing', failure: true };
    }
  }
}
