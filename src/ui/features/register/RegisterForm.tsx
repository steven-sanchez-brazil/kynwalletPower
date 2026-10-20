import { useRef, type FormEvent } from 'react';
import type { Register } from '@/application/register';
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

export interface RegisterFormProps {
  register: Register;
  onNavigateToLogin: () => void;
  onSuccess?: (account: { email: string; displayName: string }) => void;
}

export function RegisterForm({ register, onNavigateToLogin, onSuccess }: RegisterFormProps) {
  const {
    state,
    change,
    changeTerms,
    blur,
    submit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    showSocialNotice,
  } = useRegisterForm(register, { onSuccess });

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();

    // US2: Tras intento de envío con errores, traslada el foco al primer campo inválido.
    if (errors.fullName) fullNameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.password) passwordRef.current?.focus();
    else if (errors.confirmPassword) confirmPasswordRef.current?.focus();
    else if (errors.termsAccepted) termsRef.current?.focus();
  };

  const handleSocialClick = () => {
    showSocialNotice(MESSAGES.COMING_SOON);
  };

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.subtitle}>Únete a KynWallet y gestiona tus finanzas.</p>
      </div>

      <TextField
        label="Nombre completo"
        ref={fullNameRef}
        name="fullName"
        autoComplete="name"
        placeholder="Ej. Carlos Mendoza"
        value={state.values.fullName}
        error={state.errors.fullName}
        disabled={state.status === 'submitting'}
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
        value={state.values.email}
        error={state.errors.email}
        disabled={state.status === 'submitting'}
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
        error={state.errors.password}
        disabled={state.status === 'submitting'}
        visible={state.isPasswordVisible}
        onToggleVisibility={togglePasswordVisibility}
        onChange={(event) => change('password', event.target.value)}
        onBlur={() => blur('password')}
      />

      <PasswordField
        label="Confirmar contraseña"
        ref={confirmPasswordRef}
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="••••••••"
        value={state.values.confirmPassword}
        error={state.errors.confirmPassword}
        disabled={state.status === 'submitting'}
        visible={state.isConfirmPasswordVisible}
        onToggleVisibility={toggleConfirmPasswordVisibility}
        onChange={(event) => change('confirmPassword', event.target.value)}
        onBlur={() => blur('confirmPassword')}
      />

      <Checkbox
        ref={termsRef}
        label="Acepto los términos y condiciones"
        checked={state.values.termsAccepted}
        error={state.errors.termsAccepted}
        onChange={changeTerms}
      />

      {state.errors.global && <Alert tone="error">{state.errors.global}</Alert>}

      {state.status === 'success' && (
        <Alert tone="info" role="alert">
          {MESSAGES.REGISTRATION_SUCCESS}
        </Alert>
      )}

      <Button
        type="submit"
        loading={state.status === 'submitting'}
        loadingLabel="Creando cuenta..."
      >
        Crear cuenta
      </Button>

      <Divider>o continúa con</Divider>

      <div className={styles.social}>
        <SocialButton provider="Google" onClick={handleSocialClick} />
        <SocialButton provider="Apple" onClick={handleSocialClick} />
      </div>

      {state.socialNotice && (
        <Alert tone="info" role="alert">
          {state.socialNotice}
        </Alert>
      )}

      <p className={styles.footer}>
        ¿Ya tienes cuenta?{' '}
        <Button variant="link" onClick={onNavigateToLogin}>
          Inicia sesión
        </Button>
      </p>
    </form>
  );
}
