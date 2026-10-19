import { useEffect, useRef, type FormEvent } from 'react';
import type { RegisterUser } from '@/application/registerUser';
import { MESSAGES } from '@/domain/messages';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { Toast } from '@/ui/components/Toast/Toast';
import { useRegisterForm } from './useRegisterForm';
import styles from './RegisterForm.module.css';

export type RegisterFormProps = {
  registerUser: RegisterUser;
  onNavigateToLogin: () => void;
};

/** Formulario de registro de KynWallet (Figma nodo 31:2, contracts/ui-register.md). */
export function RegisterForm({ registerUser, onNavigateToLogin }: RegisterFormProps) {
  const { state, change, blur, toggleTerms, showToast, dismissToast, submit } = useRegisterForm(
    registerUser,
    onNavigateToLogin,
  );

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // FR-009: si el correo ya existe tras enviar, el foco va al campo de correo.
  useEffect(() => {
    if (
      state.status === 'submitError' &&
      state.fieldErrors.email === MESSAGES.EMAIL_ALREADY_EXISTS
    ) {
      emailRef.current?.focus();
    }
  }, [state.status, state.fieldErrors.email]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();
    // FR-008: el foco se mueve al primer campo con error.
    if (errors.fullName) fullNameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.password) passwordRef.current?.focus();
    else if (errors.confirmPassword) confirmPasswordRef.current?.focus();
  };

  // FR-013: los botones de Google y Apple muestran un Toast con "Próximamente".
  const handleSocialClick = () => showToast(MESSAGES.COMING_SOON);

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.subtitle}>Completa tus datos para comenzar</p>
      </div>

      <TextField
        label="Nombres Completos"
        ref={fullNameRef}
        type="text"
        name="fullName"
        autoComplete="name"
        placeholder="Ej. Juan Pérez"
        value={state.values.fullName}
        error={state.fieldErrors.fullName}
        onChange={(event) => change('fullName', event.target.value)}
        onBlur={() => blur('fullName')}
      />

      <TextField
        label="Correo electrónico"
        ref={emailRef}
        type="email"
        inputMode="email"
        name="email"
        autoComplete="email"
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
        placeholder="Mínimo 8 caracteres"
        value={state.values.password}
        error={state.fieldErrors.password}
        onChange={(event) => change('password', event.target.value)}
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
        onChange={(event) => change('confirmPassword', event.target.value)}
        onBlur={() => blur('confirmPassword')}
      />

      <div className={styles.terms}>
        <Checkbox
          label="Acepto los términos y condiciones"
          checked={state.values.acceptedTerms}
          onChange={toggleTerms}
        />
      </div>

      {state.submitError === 'storage-error' && (
        <Alert tone="error">{MESSAGES.REGISTRATION_STORAGE_ERROR}</Alert>
      )}

      <Button
        type="submit"
        disabled={!state.values.acceptedTerms}
        loading={state.status === 'submitting'}
        loadingLabel="Creando cuenta…"
      >
        Crear Cuenta
      </Button>

      <Divider>o continúa con</Divider>

      <div className={styles.social}>
        <SocialButton provider="Google" onClick={handleSocialClick} />
        <SocialButton provider="Apple" onClick={handleSocialClick} />
      </div>

      {state.toastMessage && <Toast message={state.toastMessage} onDismiss={dismissToast} />}

      <p className={styles.footer}>
        ¿Ya tienes una cuenta?
        <Button variant="link" onClick={onNavigateToLogin}>
          Inicia sesión
        </Button>
      </p>
    </form>
  );
}
