import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { Register } from '@/application/register';
import type { RegistrationField } from '@/domain/registration';
import {
  firstInvalidField,
  initialRegisterState,
  registerReducer,
  type RegisterAction,
} from './registerReducer';

type ChangeAction = Extract<RegisterAction, { type: 'change' }>;

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

  const change = useCallback((field: ChangeAction['field'], value: string | boolean) => {
    dispatch({ type: 'change', field, value } as ChangeAction);
  }, []);

  const blur = useCallback((field: RegistrationField) => dispatch({ type: 'blur', field }), []);

  /**
   * Valida y, si procede, registra. Devuelve el primer campo con error (o null) para que la
   * vista mueva el foco (FR-009, US3-1).
   */
  const submit = useCallback(async (): Promise<RegistrationField | null> => {
    if (inFlight.current) return null;
    const invalid = firstInvalidField(state);
    dispatch({ type: 'submit' });
    if (invalid) return invalid;

    inFlight.current = true;
    const result = await register(state.values);
    inFlight.current = false;
    if (!mounted.current) return null;
    dispatch({ type: 'result', result });
    if (result.kind === 'success') onRegistered();
    return result.kind === 'email-taken' ? 'email' : null;
  }, [register, onRegistered, state]);

  return { state, change, blur, submit };
}
