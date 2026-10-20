import { useRef, type FormEvent, type MouseEvent } from 'react';
import type { RegisterUser } from '@/application/registerUser';
import { MESSAGES } from '@/domain/messages';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { useRegistrationForm } from './useRegistrationForm';
import styles from './RegistrationForm.module.css';

type RegistrationFormProps = {
  registerUser: RegisterUser;
  onSuccess: () => void;
  onNavigateLogin: () => void;
};

export function RegistrationForm({
  registerUser,
  onSuccess,
  onNavigateLogin,
}: RegistrationFormProps) {
  const { state, change, blur, setTerms, showNotice, submit } = useRegistrationForm(
    registerUser,
    onSuccess,
  );
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();
    if (errors.fullName) fullNameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.password) passwordRef.current?.focus();
    else if (errors.passwordConfirmation) confirmationRef.current?.focus();
    else if (errors.acceptedTerms) termsRef.current?.focus();
  };

  const handleLogin = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigateLogin();
  };

  const notice = (message: string) => () => showNotice(message);

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.subtitle}>Completa tus datos para comenzar</p>
      </div>

      <TextField
        ref={fullNameRef}
        label="Nombre completo"
        name="fullName"
        autoComplete="name"
        placeholder="Ej: Diego Martínez"
        value={state.values.fullName}
        error={state.fieldErrors.fullName}
        onChange={(event) => change('fullName', event.target.value)}
        onBlur={() => blur('fullName')}
      />
      <TextField
        ref={emailRef}
        label="Correo electrónico"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="tucorreo@ejemplo.com"
        value={state.values.email}
        error={state.fieldErrors.email}
        onChange={(event) => change('email', event.target.value)}
        onBlur={() => blur('email')}
      />
      <PasswordField
        ref={passwordRef}
        label="Contraseña"
        name="password"
        autoComplete="new-password"
        placeholder="••••••••"
        value={state.values.password}
        error={state.fieldErrors.password}
        onChange={(event) => change('password', event.target.value)}
        onBlur={() => blur('password')}
      />
      <PasswordField
        ref={confirmationRef}
        label="Confirmar contraseña"
        visibilityLabel="confirmación de contraseña"
        name="passwordConfirmation"
        autoComplete="new-password"
        placeholder="••••••••"
        value={state.values.passwordConfirmation}
        error={state.fieldErrors.passwordConfirmation}
        onChange={(event) => change('passwordConfirmation', event.target.value)}
        onBlur={() => blur('passwordConfirmation')}
      />

      <div className={styles.terms}>
        <Checkbox
          ref={termsRef}
          label="Acepto los"
          ariaLabel="Acepto los términos y condiciones"
          checked={state.values.acceptedTerms}
          onChange={setTerms}
          error={state.fieldErrors.acceptedTerms}
        />
        <Button
          variant="link"
          onClick={notice(MESSAGES.FEATURE_UNAVAILABLE)}
          aria-label="términos y condiciones"
        >
          términos y condiciones
        </Button>
      </div>

      {state.submitError && <Alert tone="error">{state.submitError}</Alert>}
      <Button type="submit" loading={state.status === 'submitting'} loadingLabel="Creando cuenta…">
        Crear cuenta
      </Button>

      <Divider>o regístrate con</Divider>
      <div className={styles.social}>
        <SocialButton provider="Google" onClick={notice(MESSAGES.COMING_SOON)} />
        <SocialButton provider="Apple" onClick={notice(MESSAGES.COMING_SOON)} />
      </div>
      {state.notice && <Alert tone="info">{state.notice}</Alert>}

      <p className={styles.footer}>
        ¿Ya tienes cuenta?
        <a className={styles.loginLink} href="/login" onClick={handleLogin}>
          Inicia sesión
        </a>
      </p>
    </form>
  );
}
