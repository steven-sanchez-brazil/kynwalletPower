import { useEffect, useReducer, useRef } from 'react';
import type { Register } from '@/application/register';
import type { RegistrationField, RegistrationErrors } from '@/domain/registration';
import { validateRegistration } from '@/domain/registrationValidation';
import { initialRegistrationState, registrationReducer } from './registrationReducer';

export function useRegistrationForm(register: Register, onSuccess: () => void) {
  const [state, dispatch] = useReducer(registrationReducer, undefined, initialRegistrationState);
  const active = useRef(true);
  const pending = useRef(false);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const allErrors = validateRegistration(state.values);
  const errors: RegistrationErrors = {};
  for (const field of Object.keys(allErrors) as RegistrationField[]) {
    if (state.submitted || state.touched[field]) errors[field] = allErrors[field];
  }
  const change = (field: RegistrationField, value: string | boolean) => {
    if (!pending.current) dispatch({ type: 'change', field, value });
  };
  const blur = (field: RegistrationField) => dispatch({ type: 'blur', field });
  const submit = (): RegistrationErrors => {
    if (pending.current) return {};
    dispatch({ type: 'submit' });
    const invalid = validateRegistration(state.values);
    if (Object.keys(invalid).length) return invalid;
    pending.current = true;
    dispatch({ type: 'pending' });
    void register(state.values).then(
      (result) => {
        if (!active.current) return;
        pending.current = false;
        if (result.kind === 'created') {
          dispatch({ type: 'reset' });
          onSuccess();
        } else dispatch({ type: 'failed' });
      },
      () => {
        if (active.current) {
          pending.current = false;
          dispatch({ type: 'failed' });
        }
      },
    );
    return {};
  };
  return { state, errors, change, blur, submit };
}
