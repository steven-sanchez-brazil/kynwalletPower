import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { RegisterAccount } from '@/application/registerAccount';
import { validateRegistration, type RegistrationErrors } from '@/domain/registrationValidation';
import {
  initialRegisterState,
  registerReducer,
  type RegisterField,
  type RegisterTextField,
} from './registerReducer';

export function useRegisterForm(registerAccount: RegisterAccount, onRegistered: () => void) {
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const inFlight = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const change = useCallback(
    (field: RegisterTextField, value: string) => dispatch({ type: 'change', field, value }),
    [],
  );

  const toggleTerms = useCallback(
    (checked: boolean) => dispatch({ type: 'toggleTerms', checked }),
    [],
  );

  const blur = useCallback((field: RegisterField) => dispatch({ type: 'blur', field }), []);

  /** Valida y, si procede, registra. Devuelve los errores para que la vista gestione el foco. */
  const submit = useCallback((): RegistrationErrors => {
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
  }, [registerAccount, onRegistered, state.values]);

  return { state, change, toggleTerms, blur, submit };
}
