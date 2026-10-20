import {
  emptyRegistration,
  registrationFields,
  validateRegistration,
  type RegistrationValues,
  type RegistrationErrors,
} from '@/domain/registration';
export type RegistrationState = {
  values: RegistrationValues;
  errors: RegistrationErrors;
  touched: Partial<Record<keyof RegistrationValues, boolean>>;
  status: 'editing' | 'invalid' | 'submitting' | 'failed';
  notice: string;
};
export const initialRegistrationState: RegistrationState = {
  values: { ...emptyRegistration },
  errors: {},
  touched: {},
  status: 'editing',
  notice: '',
};
export type RegistrationAction =
  | { type: 'change'; field: keyof RegistrationValues; value: string | boolean }
  | { type: 'notice'; message: string }
  | { type: 'blur'; field: keyof RegistrationValues }
  | { type: 'submit'; errors: RegistrationErrors }
  | { type: 'failed' }
  | { type: 'result'; errors?: RegistrationErrors };
function visitedErrors(values: RegistrationValues, touched: RegistrationState['touched']) {
  const all = validateRegistration(values);
  const errors: RegistrationErrors = {};
  for (const field of registrationFields) {
    const error = all[field];
    if (touched[field] && error) errors[field] = error;
  }
  return errors;
}
export function registrationReducer(
  state: RegistrationState,
  action: RegistrationAction,
): RegistrationState {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value };
      return { ...state, values, errors: visitedErrors(values, state.touched), status: 'editing' };
    }
    case 'blur': {
      const touched = { ...state.touched, [action.field]: true };
      return { ...state, touched, errors: visitedErrors(state.values, touched) };
    }
    case 'submit':
      return {
        ...state,
        errors: action.errors,
        touched: Object.fromEntries(registrationFields.map((field) => [field, true])),
        status: Object.keys(action.errors).length ? 'invalid' : 'submitting',
        notice: '',
      };
    case 'notice':
      return { ...state, notice: action.message };
    case 'failed':
      return { ...state, status: 'failed' };
    case 'result':
      return {
        ...state,
        errors: action.errors ?? {},
        status: action.errors ? 'invalid' : 'editing',
      };
  }
}
