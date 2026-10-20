import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { Register } from '@/application/register';
import type { RegistrationValidationErrors } from '@/domain/auth';
import { validateRegistration } from '@/domain/validation';
import { initialRegisterState, registerReducer, type RegisterField } from './registerReducer';

interface UseRegisterFormOptions {
  onSuccess?: (account: { email: string; displayName: string }) => void;
}

export function useRegisterForm(register: Register, options: UseRegisterFormOptions = {}) {
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const onSuccessRef = useRef(options.onSuccess);

  useEffect(() => {
    onSuccessRef.current = options.onSuccess;
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const change = useCallback(
    (field: 'fullName' | 'email' | 'password' | 'confirmPassword', value: string) => {
      dispatch({ type: 'change', field, value });
    },
    [],
  );

  const changeTerms = useCallback((checked: boolean) => {
    dispatch({ type: 'changeTerms', checked });
  }, []);

  const blur = useCallback((field: RegisterField) => {
    dispatch({ type: 'blur', field });
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    dispatch({ type: 'togglePasswordVisibility' });
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    dispatch({ type: 'toggleConfirmPasswordVisibility' });
  }, []);

  const showSocialNotice = useCallback((message: string) => {
    dispatch({ type: 'showSocialNotice', message });
  }, []);

  const clearSocialNotice = useCallback(() => {
    dispatch({ type: 'clearSocialNotice' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const submit = useCallback((): RegistrationValidationErrors => {
    if (inFlight.current) return {};
    const errors = validateRegistration(state.values);
    dispatch({ type: 'submit' });

    if (Object.keys(errors).length > 0) {
      return errors;
    }

    inFlight.current = true;
    void register(state.values).then((result) => {
      inFlight.current = false;
      if (mounted.current) {
        dispatch({ type: 'result', result });
        if (result.kind === 'success') {
          onSuccessRef.current?.(result.account);
        }
      }
    });

    return {};
  }, [register, state.values]);

  return {
    state,
    change,
    changeTerms,
    blur,
    submit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    showSocialNotice,
    clearSocialNotice,
    reset,
  };
}
