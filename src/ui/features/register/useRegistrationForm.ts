import { useReducer } from 'react';
import {
  validateRegistration,
  type RegistrationErrorField,
  type RegistrationField,
} from '@/domain/registrationValidation';
import { initialRegistrationState, registrationReducer } from './registrationReducer';

export function useRegistrationForm() {
  const [state, dispatch] = useReducer(registrationReducer, initialRegistrationState);

  const validate = (values = state.values, termsAccepted = state.termsAccepted) =>
    validateRegistration({ ...values, termsAccepted });

  const change = (field: RegistrationField, value: string) => {
    const values = { ...state.values, [field]: value };
    const errors = validate(values);
    dispatch({ type: 'change', field, value, errors });
  };

  const blur = (field: RegistrationErrorField) => {
    dispatch({ type: 'blur', field, errors: validate() });
  };

  const setTermsAccepted = (checked: boolean) => {
    dispatch({
      type: 'terms',
      checked,
      errors: validate(state.values, checked),
    });
  };

  const submit = () => {
    const errors = validate();
    dispatch({ type: 'submit', errors });
    return errors;
  };

  const succeed = () => dispatch({ type: 'success' });
  const showNotice = (message: string) => dispatch({ type: 'showNotice', message });

  return { state, change, blur, setTermsAccepted, submit, succeed, showNotice };
}
