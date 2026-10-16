import { useEffect, useRef, type FormEvent } from 'react';
import type { RegisterAccount } from '@/application/registerAccount';
import { MESSAGES } from '@/domain/messages';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { useRegisterForm } from './useRegisterForm';
import styles from './RegisterForm.module.css';

type RegisterFormProps = {
  registerAccount: RegisterAccount;
  redirectDelayMs?: number;
  onSuccessRedirect?: () => void;
  onNavigateToLogin?: () => void;
};

export function RegisterForm({
  registerAccount,
  redirectDelayMs,
  onSuccessRedirect,
  onNavigateToLogin,
}: RegisterFormProps) {
  const { state, changeText, changeTerms, blur, submit, showNotice } = useRegisterForm(
    registerAccount,
    { redirectDelayMs, onSuccessRedirect },
  );

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.registerError === 'email-already-exists') {
      emailRef.current?.focus();
    }
  }, [state.registerError]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();
    if (errors.fullName) fullNameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.password) passwordRef.current?.focus();
    else if (errors.confirmPassword) confirmPasswordRef.current?.focus();
    else if (errors.termsAccepted) termsRef.current?.focus();
  };

  const handleComingSoon = () => showNotice(MESSAGES.COMING_SOON);

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>Completa tus datos para comenzar</p>
      </div>

      <TextField
        label="Nombre completo"
        ref={fullNameRef}
        type="text"
        name="fullName"
        autoComplete="name"
        placeholder="Ej. Steven Luna"
        value={state.values.fullName}
        error={state.fieldErrors.fullName}
        onChange={(event) => changeText('fullName', event.target.value)}
        onBlur={() => blur('fullName')}
      />

      <TextField
        label="Correo electrónico"
        ref={emailRef}
        type="email"
        name="email"
        autoComplete="email"
        placeholder="tucorreo@ejemplo.com"
        value={state.values.email}
        error={state.fieldErrors.email}
        onChange={(event) => changeText('email', event.target.value)}
        onBlur={() => blur('email')}
      />

      <PasswordField
        label="Contraseña"
        ref={passwordRef}
        name="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        value={state.values.password}
        error={state.fieldErrors.password}
        onChange={(event) => changeText('password', event.target.value)}
        onBlur={() => blur('password')}
      />

      <PasswordField
        label="Confirmar contraseña"
        ref={confirmPasswordRef}
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Repite tu contraseña"
        value={state.values.confirmPassword}
        error={state.fieldErrors.confirmPassword}
        onChange={(event) => changeText('confirmPassword', event.target.value)}
        onBlur={() => blur('confirmPassword')}
      />

      <Checkbox
        ref={termsRef}
        label="Acepto los términos y condiciones"
        checked={state.values.termsAccepted}
        error={state.fieldErrors.termsAccepted}
        onChange={changeTerms}
        onBlur={() => blur('termsAccepted')}
      />

      {state.registerError && (
        <Alert tone="error">
          {state.registerError === 'email-already-exists'
            ? MESSAGES.EMAIL_ALREADY_EXISTS
            : MESSAGES.REGISTER_UNAVAILABLE}
        </Alert>
      )}

      {state.status === 'success' && <Alert tone="success">{MESSAGES.REGISTER_SUCCESS}</Alert>}

      <Button
        type="submit"
        loading={state.status === 'submitting'}
        loadingLabel="Creando cuenta…"
        disabled={state.status === 'success'}
      >
        Crear cuenta
      </Button>

      <Divider>o continúa con</Divider>

      <div className={styles.social}>
        <SocialButton provider="Google" onClick={handleComingSoon} />
        <SocialButton provider="Apple" onClick={handleComingSoon} />
      </div>

      {state.notice && <Alert tone="info">{state.notice}</Alert>}

      <p className={styles.footer}>
        ¿Ya tienes cuenta?
        <Button variant="link" onClick={onNavigateToLogin}>
          Inicia sesión
        </Button>
      </p>
    </form>
  );
}
