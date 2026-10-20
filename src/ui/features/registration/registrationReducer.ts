import type { RegistrationValues, RegistrationField } from '@/domain/registration';
export type RegistrationState = {
  values: RegistrationValues;
  touched: Partial<Record<RegistrationField, boolean>>;
  submitted: boolean;
  status: 'editing' | 'submitting' | 'failed';
};
export const initialRegistrationState = (): RegistrationState => ({
  values: { fullName: '', email: '', password: '', confirmPassword: '', acceptedTerms: false },
  touched: {},
  submitted: false,
  status: 'editing',
});
type Action =
  | { type: 'change'; field: RegistrationField; value: string | boolean }
  | { type: 'blur'; field: RegistrationField }
  | { type: 'submit' | 'pending' | 'failed' | 'reset' };
export function registrationReducer(state: RegistrationState, action: Action): RegistrationState {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        status: 'editing',
      };
    case 'blur':
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case 'submit':
      return { ...state, submitted: true };
    case 'pending':
      return { ...state, status: 'submitting' };
    case 'failed':
      return { ...state, status: 'failed' };
    case 'reset':
      return initialRegistrationState();
  }
}
