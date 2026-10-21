import { useCallback, useEffect, useRef, useState } from 'react';
import type { RegisterAccount } from '@/application/registerAccount';
import {
  validateRegistration,
  type RegistrationErrors,
  type RegistrationValues,
} from '@/domain/registration';

type Field = keyof RegistrationValues;
type Status = 'editing' | 'submitting' | 'failure';

const initialValues: RegistrationValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
};

export function useRegistrationForm(registerAccount: RegisterAccount, onSuccess: () => void) {
  const [values, setValues] = useState<RegistrationValues>(initialValues);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [status, setStatus] = useState<Status>('editing');
  const [notice, setNotice] = useState('');
  const inFlight = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const change = useCallback(
    <K extends Field>(field: K, value: RegistrationValues[K]) => {
      const next = { ...values, [field]: value };
      setValues(next);
      setNotice('');
      if (status === 'failure') setStatus('editing');
      if (errors[field] || (field === 'password' && errors.confirmPassword)) {
        const fresh = validateRegistration(next);
        setErrors((previous) => ({
          ...previous,
          [field]: fresh[field],
          ...(field === 'password' && previous.confirmPassword
            ? { confirmPassword: fresh.confirmPassword }
            : {}),
        }));
      }
    },
    [errors, status, values],
  );

  const blur = useCallback(
    (field: Field) => {
      const current = validateRegistration(values);
      setErrors((previous) => ({ ...previous, [field]: current[field] }));
    },
    [values],
  );

  const submit = useCallback((): RegistrationErrors => {
    if (inFlight.current) return {};
    const current = validateRegistration(values);
    setErrors(current);
    setNotice('');
    if (Object.keys(current).length > 0) return current;

    inFlight.current = true;
    setStatus('submitting');
    void registerAccount(values)
      .then((result) => {
        inFlight.current = false;
        if (!mounted.current) return;
        if (result.kind === 'success') onSuccess();
        else if (result.kind === 'invalid') {
          setErrors(result.errors);
          setStatus('editing');
        } else {
          setValues((previous) => ({ ...previous, password: '', confirmPassword: '' }));
          setStatus('failure');
        }
      })
      .catch(() => {
        inFlight.current = false;
        if (mounted.current) {
          setValues((previous) => ({ ...previous, password: '', confirmPassword: '' }));
          setStatus('failure');
        }
      });
    return {};
  }, [onSuccess, registerAccount, values]);

  return { values, errors, status, notice, change, blur, submit, setNotice };
}
