import { useEffect, useRef, useState } from 'react';
import type { RegisterAccount } from '@/application/registerAccount';
import {
  REGISTRATION_MESSAGES,
  type RegistrationErrors,
  type RegistrationInput,
} from '@/domain/registration';
import { validateRegistration } from '@/domain/registrationValidation';

const initialValues: RegistrationInput = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
};

const allTouched = {
  fullName: true,
  email: true,
  password: true,
  confirmPassword: true,
  acceptedTerms: true,
};

type Field = keyof RegistrationInput;

/** La UI controla interacción; las reglas se evalúan exclusivamente en el dominio. */
export function useRegisterForm(registerAccount: RegisterAccount, onSuccess: () => void) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<RegistrationErrors>({});
  const [submissionError, setSubmissionError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const validationErrors = validateRegistration(values);
  const fieldErrors: RegistrationErrors = { ...serverErrors };
  for (const field of Object.keys(validationErrors) as Field[]) {
    if (touched[field]) fieldErrors[field] = validationErrors[field];
  }

  function change<K extends Field>(field: K, value: RegistrationInput[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setServerErrors({});
    setSubmissionError(undefined);
  }

  function blur(field: Field) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  /** Devuelve errores sincrónicos para que el formulario sitúe el foco inmediatamente. */
  function submit(): RegistrationErrors {
    if (inFlight.current) return {};
    const errors = validateRegistration(values);
    setTouched(allTouched);
    setServerErrors({});
    setSubmissionError(undefined);
    if (Object.keys(errors).length > 0) return errors;

    inFlight.current = true;
    setSubmitting(true);
    void (async () => {
      try {
        const result = await registerAccount(values);
        if (!mounted.current) return;
        switch (result.kind) {
          case 'success':
            onSuccess();
            break;
          case 'invalid-input':
            setServerErrors(result.errors);
            break;
          case 'duplicate-email':
            setSubmissionError(REGISTRATION_MESSAGES.DUPLICATE_EMAIL);
            break;
          case 'unavailable':
            setSubmissionError(REGISTRATION_MESSAGES.UNAVAILABLE);
            break;
        }
      } catch {
        if (mounted.current) setSubmissionError(REGISTRATION_MESSAGES.UNAVAILABLE);
      } finally {
        inFlight.current = false;
        if (mounted.current) setSubmitting(false);
      }
    })();
    return {};
  }

  return { values, fieldErrors, submissionError, submitting, change, blur, submit };
}
