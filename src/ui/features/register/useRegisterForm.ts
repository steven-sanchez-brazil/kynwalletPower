import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { RegisterUser } from '@/application/registerUser';
import type { RegistrationFieldErrors } from '@/domain/registration';
import { validateRegistration } from '@/domain/validation';
import { initialRegisterState, registerReducer, type RegisterTextField } from './registerReducer';

export function useRegisterForm(registerUser: RegisterUser, onRegistered: () => void) {
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const inFlight = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const change = useCallback((field: RegisterTextField, value: string) => {
    dispatch({ type: 'change', field, value });
  }, []);

  const blur = useCallback((field: RegisterTextField) => {
    dispatch({ type: 'blur', field });
  }, []);

  const toggleTerms = useCallback((checked: boolean) => {
    dispatch({ type: 'toggleTerms', checked });
  }, []);

  const showToast = useCallback((message: string) => {
    dispatch({ type: 'showToast', message });
  }, []);

  const dismissToast = useCallback(() => {
    dispatch({ type: 'dismissToast' });
  }, []);

  /** Valida todos los campos antes de enviar (FR-008) y persiste si es válido (FR-010). */
  const submit = useCallback((): RegistrationFieldErrors => {
    if (inFlight.current) return {};
    const errors = validateRegistration(state.values);
    dispatch({ type: 'submit' });
    if (Object.keys(errors).length > 0 || !state.values.acceptedTerms) {
      return errors;
    }

    inFlight.current = true;
    void registerUser({
      fullName: state.values.fullName,
      email: state.values.email,
      password: state.values.password,
      acceptedTerms: true,
    }).then((result) => {
      inFlight.current = false;
      if (!mounted.current) return;
      dispatch({ type: 'submitResult', result });
      if (result.kind === 'success') {
        onRegistered();
      }
    });

    return {};
  }, [onRegistered, registerUser, state.values]);

  return {
    state,
    change,
    blur,
    toggleTerms,
    showToast,
    dismissToast,
    submit,
  };
}
