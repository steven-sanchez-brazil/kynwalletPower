import { useEffect, useRef, type FormEvent, type RefObject } from 'react';
import type { Register } from '@/application/register';
import { MESSAGES } from '@/domain/messages';
import { REGISTRATION_FIELDS, type RegistrationField } from '@/domain/registration';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { RouteLink } from '@/ui/routing/RouteLink';
import { ROUTES } from '@/ui/routing/router';
import { useRegisterForm } from './useRegisterForm';
import styles from './RegisterForm.module.css';

type RegisterFormProps = {
  register: Register;
  onRegistered: () => void;
};

// FR-014 y research.md R5: opciones del diseño fuera del alcance de la demostración.
const comingSoon = () => window.alert(MESSAGES.COMING_SOON);

/** Formulario del frame "04 · Registro" (contracts/ui-register.md). */
export function RegisterForm({ register, onRegistered }: RegisterFormProps) {
  const { state, change, toggleTerms, blur, submit } = useRegisterForm(register, onRegistered);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  // US3-1: ante un correo ya registrado, el foco vuelve al correo.
  useEffect(() => {
    if (state.submitError === 'email-taken') emailRef.current?.focus();
  }, [state.submitError]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();
    // FR-009: el foco va al primer campo con error, en el orden del formulario.
    const firstInvalid = REGISTRATION_FIELDS.find((field) => errors[field]);
    if (!firstInvalid) return;
    const refs: Record<RegistrationField, RefObject<HTMLInputElement | null>> = {
      fullName: fullNameRef,
      email: emailRef,
      password: passwordRef,
      passwordConfirmation: confirmationRef,
      acceptedTerms: termsRef,
    };
    refs[firstInvalid].current?.focus();
  };

  const { values, fieldErrors } = state;

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.subtitle}>Completa tus datos para comenzar</p>
      </div>

      <div className={styles.fields}>
        <TextField
          label="Nombre completo"
          ref={fullNameRef}
          name="fullName"
          autoComplete="name"
          placeholder="Ej. Diego Martínez"
          value={values.fullName}
          error={fieldErrors.fullName}
          onChange={(event) => change('fullName', event.target.value)}
          onBlur={() => blur('fullName')}
        />

        <TextField
          label="Correo electrónico"
          ref={emailRef}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          value={values.email}
          error={fieldErrors.email}
          onChange={(event) => change('email', event.target.value)}
          onBlur={() => blur('email')}
        />

        <PasswordField
          label="Contraseña"
          ref={passwordRef}
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.password}
          error={fieldErrors.password}
          onChange={(event) => change('password', event.target.value)}
          onBlur={() => blur('password')}
        />

        <PasswordField
          label="Confirmar contraseña"
          ref={confirmationRef}
          name="passwordConfirmation"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.passwordConfirmation}
          error={fieldErrors.passwordConfirmation}
          onChange={(event) => change('passwordConfirmation', event.target.value)}
          onBlur={() => blur('passwordConfirmation')}
        />

        <Checkbox
          label="Acepto los"
          ariaLabel="Acepto los términos y condiciones"
          ref={termsRef}
          checked={values.acceptedTerms}
          error={fieldErrors.acceptedTerms}
          onChange={toggleTerms}
          addon={
            <Button variant="link" className={styles.termsLink} onClick={comingSoon}>
              términos y condiciones
            </Button>
          }
        />
      </div>

      {state.submitError === 'unavailable' && <Alert tone="error">{MESSAGES.UNAVAILABLE}</Alert>}

      <Button type="submit" loading={state.status === 'submitting'} loadingLabel="Creando cuenta…">
        Crear cuenta
      </Button>

      <Divider>o regístrate con</Divider>

      <div className={styles.social}>
        <SocialButton provider="Google" onClick={comingSoon} />
        <SocialButton provider="Apple" onClick={comingSoon} />
      </div>

      <p className={styles.footer}>
        ¿Ya tienes cuenta?
        <RouteLink to={ROUTES.login}>Inicia sesión</RouteLink>
      </p>
    </form>
  );
}
