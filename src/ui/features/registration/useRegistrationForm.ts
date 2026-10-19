import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { RegisterAccount } from '@/application/registerAccount';
import type { RegistrationField, RegistrationFieldErrors } from '@/domain/registration';
import { validateRegistration } from '@/domain/registrationValidation';
import { initialRegistrationState, registrationReducer } from './registrationReducer';

export function useRegistrationForm(registerAccount: RegisterAccount, onRegistered: () => void) {
  const [state, dispatch] = useReducer(registrationReducer, initialRegistrationState);
  const inFlight = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const change = useCallback((field: RegistrationField, value: string | boolean) => {
    dispatch({ type: 'change', field, value });
  }, []);

  const blur = useCallback((field: RegistrationField) => dispatch({ type: 'blur', field }), []);

  const showNotice = useCallback(
    (message: string) => dispatch({ type: 'showNotice', message }),
    [],
  );

  /** Valida y, si procede, registra. Devuelve los errores para que la vista gestione el foco. */
  const submit = useCallback((): RegistrationFieldErrors => {
    if (inFlight.current) return {};
    const errors = validateRegistration(state.values);
    dispatch({ type: 'submit' });
    if (Object.keys(errors).length > 0) return errors;

    inFlight.current = true;
    void registerAccount(state.values).then((result) => {
      inFlight.current = false;
      if (!mounted.current) return;
      dispatch({ type: 'result', result });
      if (result.kind === 'success') onRegistered();
    });
    return {};
  }, [onRegistered, registerAccount, state.values]);

  return { state, change, blur, submit, showNotice };
}
