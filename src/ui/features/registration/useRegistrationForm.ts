import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { RegisterUser } from '@/application/registerUser';
import type { RegistrationErrors, RegistrationField } from '@/domain/registration';
import { validateRegistration } from '@/domain/registrationValidation';
import { initialRegistrationState, registrationReducer } from './registrationReducer';

type TextField = Exclude<RegistrationField, 'acceptedTerms'>;

export function useRegistrationForm(registerUser: RegisterUser, onSuccess: () => void) {
  const [state, dispatch] = useReducer(registrationReducer, initialRegistrationState);
  const inFlight = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const change = useCallback(
    (field: TextField, value: string) => dispatch({ type: 'change', field, value }),
    [],
  );
  const blur = useCallback((field: RegistrationField) => dispatch({ type: 'blur', field }), []);
  const setTerms = useCallback((checked: boolean) => dispatch({ type: 'setTerms', checked }), []);
  const showNotice = useCallback(
    (message: string) => dispatch({ type: 'showNotice', message }),
    [],
  );

  const submit = useCallback((): RegistrationErrors => {
    if (inFlight.current) return {};
    const errors = validateRegistration(state.values);
    dispatch({ type: 'submit' });
    if (Object.keys(errors).length > 0) return errors;

    inFlight.current = true;
    void registerUser(state.values)
      .then((result) => {
        if (!mounted.current) return;
        dispatch({ type: 'result', result });
        if (result.kind === 'success') onSuccess();
      })
      .finally(() => {
        inFlight.current = false;
      });
    return {};
  }, [onSuccess, registerUser, state.values]);

  return { state, change, blur, setTerms, showNotice, submit };
}
