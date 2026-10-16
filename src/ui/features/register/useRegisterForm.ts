import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { RegisterAccount } from '@/application/registerAccount';
import {
  validateRegistration,
  type RegistrationErrors,
  type RegistrationField,
} from '@/domain/validation';
import { initialRegisterState, registerReducer } from './registerReducer';

const DEFAULT_REDIRECT_DELAY_MS = 1500;

type UseRegisterFormOptions = {
  redirectDelayMs?: number;
  onSuccessRedirect?: () => void;
};

export function useRegisterForm(
  registerAccount: RegisterAccount,
  options: UseRegisterFormOptions = {},
) {
  const { redirectDelayMs = DEFAULT_REDIRECT_DELAY_MS, onSuccessRedirect } = options;
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const onSuccessRedirectRef = useRef(onSuccessRedirect);

  useEffect(() => {
    onSuccessRedirectRef.current = onSuccessRedirect;
  }, [onSuccessRedirect]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (state.status !== 'success') return undefined;
    const timer = setTimeout(() => {
      if (mounted.current) {
        onSuccessRedirectRef.current?.();
      }
    }, redirectDelayMs);
    return () => clearTimeout(timer);
  }, [state.status, redirectDelayMs]);

  const changeText = useCallback(
    (field: 'fullName' | 'email' | 'password' | 'confirmPassword', value: string) => {
      dispatch({ type: 'change', field, value });
    },
    [],
  );

  const changeTerms = useCallback((checked: boolean) => {
    dispatch({ type: 'change', field: 'termsAccepted', value: checked });
  }, []);

  const blur = useCallback((field: RegistrationField) => {
    dispatch({ type: 'blur', field });
  }, []);

  const submit = useCallback((): RegistrationErrors => {
    if (inFlight.current || state.status === 'submitting' || state.status === 'success') {
      return {};
    }
    const errors = validateRegistration(state.values);
    dispatch({ type: 'submit' });
    if (Object.keys(errors).length > 0) return errors;

    inFlight.current = true;
    void registerAccount({
      fullName: state.values.fullName,
      email: state.values.email,
      password: state.values.password,
    }).then((result) => {
      inFlight.current = false;
      if (mounted.current) dispatch({ type: 'result', result });
    });
    return {};
  }, [registerAccount, state.status, state.values]);

  const showNotice = useCallback((message: string) => {
    dispatch({ type: 'showNotice', message });
  }, []);

  return { state, changeText, changeTerms, blur, submit, showNotice };
}
