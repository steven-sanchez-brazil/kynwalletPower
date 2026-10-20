import { useReducer, useRef, useEffect } from 'react';
import type { Register } from '@/application/register';
import { validateRegistration, type RegistrationValues } from '@/domain/registration';
import { initialRegistrationState, registrationReducer } from './registrationReducer';
export function useRegistrationForm(register: Register, onSuccess: () => void) {
  const [state, dispatch] = useReducer(registrationReducer, initialRegistrationState);
  const active = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      active.current?.abort();
      active.current = null;
    },
    [],
  );
  const change = (field: keyof RegistrationValues, value: string | boolean) => {
    if (!active.current) dispatch({ type: 'change', field, value });
  };
  const submit = () => {
    if (active.current) return {};
    const errors = validateRegistration(state.values);
    dispatch({ type: 'submit', errors });
    if (Object.keys(errors).length) return errors;
    const controller = new AbortController();
    active.current = controller;
    void (async () => {
      try {
        const result = await register(state.values, controller.signal);
        if (active.current !== controller || controller.signal.aborted) return;
        active.current = null;
        if (result.kind === 'success') onSuccess();
        else if (result.kind === 'unavailable') dispatch({ type: 'failed' });
        else
          dispatch({
            type: 'result',
            errors: result.kind === 'invalid' ? result.errors : undefined,
          });
      } catch {
        if (active.current !== controller) return;
        active.current = null;
        dispatch({ type: 'failed' });
      }
    })();
    return errors;
  };
  const blur = (field: keyof RegistrationValues) => dispatch({ type: 'blur', field });
  const showNotice = (message: string) => dispatch({ type: 'notice', message });
  return { state, change, blur, submit, showNotice };
}
