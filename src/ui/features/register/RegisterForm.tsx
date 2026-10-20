import { useEffect, useRef, type FormEvent } from 'react';
import type { Register } from '@/application/register';
import { MESSAGES } from '@/domain/messages';
import eyeRegister from '@/ui/assets/eye-register.svg';
import socialRegister from '@/ui/assets/social-register.svg';
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
  register: Register;
  /** Se invoca una vez con el nombre ingresado cuando el registro tiene éxito (FR-013). */
  onRegistered: (name: string) => void;
  onLogin: () => void;
};

export function RegisterForm({ register, onRegistered, onLogin }: RegisterFormProps) {
  const { state, change, blur, toggleTerms, showNotice, submit } = useRegisterForm(
    register,
    onRegistered,
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  // US3-1: con un correo ya registrado, el foco vuelve al campo de correo.
  useEffect(() => {
    if (state.serviceError === 'email-taken') emailRef.current?.focus();
  }, [state.serviceError]);

  // FR-021: Google y Apple avisan con un alert del navegador.
  const comingSoon = () => window.alert(MESSAGES.COMING_SOON);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();
    // UI-3: el foco va al primer campo con error, en el orden del formulario.
    if (errors.name) nameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.password) passwordRef.current?.focus();
    else if (errors.confirmPassword) confirmRef.current?.focus();
    else if (errors.terms) termsRef.current?.focus();
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
        value={state.values.name}
        error={state.fieldErrors.name}
        onChange={(event) => change('name', event.target.value)}
        onBlur={() => blur('name')}
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
        icon={eyeRegister}
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
        icon={eyeRegister}
        value={state.values.confirmPassword}
        error={state.fieldErrors.confirmPassword}
        onChange={(event) => change('confirmPassword', event.target.value)}
        onBlur={() => blur('confirmPassword')}
      />

      <div className={styles.terms}>
        <Checkbox
          label={
            <>
              Acepto los{' '}
              <Button variant="link" onClick={() => showNotice(MESSAGES.FEATURE_UNAVAILABLE)}>
                términos y condiciones
              </Button>
            </>
          }
          ref={termsRef}
          checked={state.values.acceptedTerms}
          error={state.fieldErrors.terms}
          onChange={toggleTerms}
        />
      </div>

      {state.serviceError === 'unavailable' && (
        <Alert tone="error">{MESSAGES.REGISTER_UNAVAILABLE}</Alert>
      )}

      <Button type="submit" loading={state.status === 'submitting'} loadingLabel="Creando cuenta…">
        Crear cuenta
      </Button>

      <div className={styles.divider}>
        <Divider>o regístrate con</Divider>
      </div>

      <div className={styles.social}>
        <SocialButton provider="Google" icon={socialRegister} onClick={comingSoon} />
        <SocialButton provider="Apple" icon={socialRegister} onClick={comingSoon} />
      </div>

      {state.notice && <Alert tone="info">{state.notice}</Alert>}

      <p className={styles.footer}>
        ¿Ya tienes cuenta?
        <Button variant="link" onClick={onLogin}>
          Inicia sesión
        </Button>
      </p>
    </form>
  );
}
