import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { Register } from '@/application/register';
import type { RegistrationErrors } from '@/domain/registration';
import { validateRegistration } from '@/domain/validation';
import { initialRegisterState, registerReducer, type Field } from './registerReducer';

/** `onRegistered` se invoca tras un registro exitoso para que la página redirija (FR-011). */
export function useRegisterForm(register: Register, onRegistered: () => void) {
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const inFlight = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const change = useCallback((field: Field, value: string) => {
    dispatch({ type: 'change', field, value });
  }, []);

  const blur = useCallback(
    (field: Field | 'acceptedTerms') => dispatch({ type: 'blur', field }),
    [],
  );

  const toggleTerms = useCallback(
    (checked: boolean) => dispatch({ type: 'toggleTerms', checked }),
    [],
  );

  /** Valida y, si procede, registra. Devuelve los errores para que la vista gestione el foco. */
  const submit = useCallback((): RegistrationErrors => {
    if (inFlight.current) return {};
    const request = { ...state.values, acceptedTerms: state.acceptedTerms };
    const errors = validateRegistration(request);
    dispatch({ type: 'submit' });
    if (Object.keys(errors).length > 0) return errors;

    inFlight.current = true;
    void register(request).then((result) => {
      inFlight.current = false;
      if (!mounted.current) return;
      dispatch({ type: 'result', result });
      if (result.kind === 'created') onRegistered();
    });
    return {};
  }, [register, onRegistered, state.values, state.acceptedTerms]);

  const showNotice = useCallback(
    (message: string) => dispatch({ type: 'showNotice', message }),
    [],
  );

  return { state, change, blur, toggleTerms, submit, showNotice };
}
