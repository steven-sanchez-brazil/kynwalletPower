import { useEffect, useRef, type FormEvent } from 'react';
import type { Register } from '@/application/register';
import { MESSAGES } from '@/domain/messages';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { TextLink } from '@/ui/components/TextLink/TextLink';
import { ROUTES } from '@/ui/routes';
import { useRegisterForm } from './useRegisterForm';
import styles from './RegisterForm.module.css';

type RegisterFormProps = {
  register: Register;
  /** Se invoca tras un registro exitoso; la página decide a dónde redirigir (FR-011). */
  onRegistered: () => void;
};

export function RegisterForm({ register, onRegistered }: RegisterFormProps) {
  const { state, change, blur, toggleTerms, submit, showNotice } = useRegisterForm(
    register,
    onRegistered,
  );
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  // US2-3: tras un registro fallido, el foco vuelve al correo.
  useEffect(() => {
    if (state.failure) emailRef.current?.focus();
  }, [state.failure]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();
    // US3-1: el foco va al primer campo con error, en orden visual.
    if (errors.fullName) fullNameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.password) passwordRef.current?.focus();
    else if (errors.confirmPassword) confirmRef.current?.focus();
    else if (errors.acceptedTerms) termsRef.current?.focus();
  };

  // FR-019: elementos del diseño fuera del alcance; avisos dentro de la página, sin diálogos.
  const notAvailable = () => showNotice(MESSAGES.FEATURE_UNAVAILABLE);
  const comingSoon = () => showNotice(MESSAGES.COMING_SOON);

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.subtitle}>Completa tus datos para comenzar</p>
      </div>

      <TextField
        label="Nombre completo"
        ref={fullNameRef}
        name="fullName"
        autoComplete="name"
        placeholder="Ej: Diego Martínez"
        value={state.values.fullName}
        error={state.fieldErrors.fullName}
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
            Acepto los{' '}
            <Button variant="link" className={styles.termsLink} onClick={notAvailable}>
              términos y condiciones
            </Button>
          </>
        }
        checked={state.acceptedTerms}
        error={state.fieldErrors.acceptedTerms}
        onChange={toggleTerms}
      />

      {state.failure && (
        <Alert tone="error">
          {state.failure === 'rejected'
            ? MESSAGES.REGISTRATION_REJECTED
            : MESSAGES.REGISTRATION_UNAVAILABLE}
        </Alert>
      )}

      <Button
        type="submit"
        loading={state.status === 'submitting' || state.status === 'registered'}
        loadingLabel="Creando cuenta…"
      >
        Crear cuenta
      </Button>

      <Divider>o regístrate con</Divider>

      <div className={styles.social}>
        <SocialButton provider="Google" onClick={comingSoon} />
        <SocialButton provider="Apple" onClick={comingSoon} />
      </div>

      {state.notice && <Alert tone="info">{state.notice}</Alert>}

      <p className={styles.footer}>
        ¿Ya tienes cuenta?
        {/* US6, FR-022: navega a la pantalla de inicio de sesión. */}
        <TextLink to={ROUTES.login}>Inicia sesión</TextLink>
      </p>
    </form>
  );
}
