import { useEffect, useRef, type FormEvent } from 'react';
import type { RegisterAccount } from '@/application/registerAccount';
import { MESSAGES } from '@/domain/messages';
import type { RegistrationField } from '@/domain/registration';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { TextLink } from '@/ui/components/TextLink/TextLink';
import { useRegistrationForm } from './useRegistrationForm';
import styles from './RegistrationForm.module.css';

type RegistrationFormProps = {
  registerAccount: RegisterAccount;
  onRegistered: () => void;
};

/** Orden de los campos: define el recorrido del foco hacia el primer error. */
const FIELD_ORDER: RegistrationField[] = [
  'displayName',
  'email',
  'password',
  'confirmPassword',
  'acceptedTerms',
];

export function RegistrationForm({ registerAccount, onRegistered }: RegistrationFormProps) {
  const { state, change, blur, submit, showNotice } = useRegistrationForm(
    registerAccount,
    onRegistered,
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  // US2-5: tras un correo duplicado, el foco vuelve al campo del correo.
  const emailError = state.fieldErrors.email;
  useEffect(() => {
    if (emailError === MESSAGES.EMAIL_TAKEN) emailRef.current?.focus();
  }, [emailError]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();
    // US2-1: el foco va al primer campo con error, en el orden del formulario.
    const first = FIELD_ORDER.find((field) => errors[field]);
    if (!first) return;
    const targets = {
      displayName: nameRef,
      email: emailRef,
      password: passwordRef,
      confirmPassword: confirmRef,
      acceptedTerms: termsRef,
    };
    targets[first].current?.focus();
  };

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.subtitle}>Completa tus datos para comenzar</p>
      </div>

      <TextField
        label="Nombre completo"
        ref={nameRef}
        name="name"
        autoComplete="name"
        placeholder="Ej: Diego Martínez"
        value={state.values.displayName}
        error={state.fieldErrors.displayName}
        onChange={(event) => change('displayName', event.target.value)}
        onBlur={() => blur('displayName')}
      />

      <TextField
        label="Correo electrónico"
        ref={emailRef}
        type="email"
        name="email"
        autoComplete="username"
        placeholder="tucorreo@ejemplo.com"
        value={state.values.email}
        error={state.fieldErrors.email}
        onChange={(event) => change('email', event.target.value)}
        onBlur={() => blur('email')}
      />

      <PasswordField
        label="Contraseña"
        ref={passwordRef}
        name="password"
        autoComplete="new-password"
        placeholder="••••••••"
        value={state.values.password}
        error={state.fieldErrors.password}
        onChange={(event) => change('password', event.target.value)}
        onBlur={() => blur('password')}
      />

      <PasswordField
        label="Confirmar contraseña"
        ref={confirmRef}
        visibilityLabel="confirmación de contraseña"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="••••••••"
        value={state.values.confirmPassword}
        error={state.fieldErrors.confirmPassword}
        onChange={(event) => change('confirmPassword', event.target.value)}
        onBlur={() => blur('confirmPassword')}
      />

      <Checkbox
        ref={termsRef}
        label={
          <>
            Acepto los <span className={styles.highlight}>términos y condiciones</span>
          </>
        }
        checked={state.values.acceptedTerms}
        error={state.fieldErrors.acceptedTerms}
        onChange={(checked) => change('acceptedTerms', checked)}
      />

      {state.formError && (
        <Alert tone="error">
          {state.formError === 'unavailable'
            ? MESSAGES.REGISTER_UNAVAILABLE
            : MESSAGES.REGISTER_FAILED}
        </Alert>
      )}

      <Button type="submit" loading={state.status === 'submitting'} loadingLabel="Creando cuenta…">
        Crear cuenta
      </Button>

      <Divider>o regístrate con</Divider>

      <div className={styles.social}>
        <SocialButton provider="Google" onClick={() => showNotice(MESSAGES.COMING_SOON)} />
        <SocialButton provider="Apple" onClick={() => showNotice(MESSAGES.COMING_SOON)} />
      </div>

      {state.notice && <Alert tone="info">{state.notice}</Alert>}

      <p className={styles.footer}>
        ¿Ya tienes cuenta?
        <TextLink to="/login">Inicia sesión</TextLink>
      </p>
    </form>
  );
}
