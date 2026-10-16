import { useEffect, useReducer, useRef } from 'react';
import type { Register } from '@/application/register';
import {
  type RegistrationErrors,
  type RegistrationField,
  type RegistrationValues,
} from '@/domain/registration';
import { validateRegistration } from '@/domain/validation';
import { initialRegistrationState, registrationReducer } from './registrationReducer';

export function useRegistrationForm(register: Register, onSuccess: () => void) {
  const [state, dispatch] = useReducer(registrationReducer, undefined, initialRegistrationState);
  const mounted = useRef(false);
  const attempt = useRef(0);
  const inFlight = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      attempt.current += 1;
    };
  }, []);

  const submit = (): RegistrationErrors => {
    if (inFlight.current) return {};
    const errors = validateRegistration(state.values);
    dispatch({ type: 'validate', errors });
    if (Object.keys(errors).length) return errors;
    inFlight.current = true;
    const currentAttempt = ++attempt.current;
    dispatch({ type: 'submit' });
    const isCurrent = () => mounted.current && attempt.current === currentAttempt;
    void (async () => {
      try {
        const result = await register({ ...state.values });
        if (!isCurrent()) return;
        if (result.kind === 'success') {
          dispatch({ type: 'reset' });
          onSuccess();
        } else if (result.kind === 'invalid') dispatch({ type: 'validate', errors: result.errors });
        else dispatch({ type: 'failure' });
      } catch {
        if (isCurrent()) dispatch({ type: 'failure' });
      } finally {
        if (isCurrent()) inFlight.current = false;
      }
    })();
    return {};
  };

  return {
    state,
    submit,
    change: <K extends RegistrationField>(field: K, value: RegistrationValues[K]) => {
      if (!inFlight.current) dispatch({ type: 'change', field, value });
    },
    blur: (field: RegistrationField) => {
      if (!inFlight.current) dispatch({ type: 'blur', field });
    },
  };
}
