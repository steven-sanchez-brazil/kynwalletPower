import { useEffect, useRef, type FormEvent } from 'react';
import type { Register } from '@/application/register';
import { MESSAGES } from '@/domain/messages';
import type { RegistrationField } from '@/domain/registration';
import { EMAIL_MAX_LENGTH, FULL_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '@/domain/validation';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import loginStyles from '@/ui/features/login/LoginForm.module.css';
import { useRegisterForm } from './useRegisterForm';
import styles from './RegisterForm.module.css';

type RegisterFormProps = {
  register: Register;
  /** Se llama tras crear la cuenta; App navega a /login con el mensaje (FR-012). */
  onRegistered: () => void;
  onGoToLogin: () => void;
  /** true al llegar navegando dentro de la app (research R9). */
  focusOnMount?: boolean;
};

export function RegisterForm({
  register,
  onRegistered,
  onGoToLogin,
  focusOnMount = false,
}: RegisterFormProps) {
  const { state, change, blur, submit } = useRegisterForm(register, onRegistered);
  const { values, fieldErrors } = state;
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnMount) nameRef.current?.focus();
  }, [focusOnMount, nameRef]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = await submit();
    if (!invalid) return;
    // FR-009 y US3-1: el foco va al primer campo con error.
    const targets: Record<RegistrationField, HTMLInputElement | null> = {
      fullName: nameRef.current,
      email: emailRef.current,
      password: passwordRef.current,
      confirmPassword: confirmRef.current,
      acceptTerms: termsRef.current,
    };
    targets[invalid]?.focus();
  };

  // FR-014: acceso con proveedores externos fuera del alcance.
  const comingSoon = () => window.alert(MESSAGES.COMING_SOON);

  return (
    <form
      className={`${loginStyles.form} ${styles.form}`}
      aria-label="Crear cuenta"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className={loginStyles.heading}>
        <h1 className={loginStyles.title}>Crea tu cuenta</h1>
        <p className={loginStyles.subtitle}>Completa tus datos para comenzar</p>
      </div>

      <TextField
        label="Nombre completo"
        ref={nameRef}
        name="name"
        autoComplete="name"
        placeholder="Ej: Diego Martínez"
        maxLength={FULL_NAME_MAX_LENGTH}
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
        maxLength={EMAIL_MAX_LENGTH}
        value={values.email}
        error={fieldErrors.email}
        onChange={(event) => change('email', event.target.value)}
        onBlur={() => blur('email')}
      />

      <PasswordField
        label="Contraseña"
        ref={passwordRef}
        name="new-password"
        autoComplete="new-password"
        placeholder="••••••••"
        maxLength={PASSWORD_MAX_LENGTH}
        value={values.password}
        error={fieldErrors.password}
        onChange={(event) => change('password', event.target.value)}
        onBlur={() => blur('password')}
      />

      <PasswordField
        label="Confirmar contraseña"
        showLabel="Mostrar confirmación"
        hideLabel="Ocultar confirmación"
        ref={confirmRef}
        name="confirm-password"
        autoComplete="new-password"
        placeholder="••••••••"
        maxLength={PASSWORD_MAX_LENGTH}
        value={values.confirmPassword}
        error={fieldErrors.confirmPassword}
        onChange={(event) => change('confirmPassword', event.target.value)}
        onBlur={() => blur('confirmPassword')}
      />

      <Checkbox
        ref={termsRef}
        label={
          <>
            Acepto los <span className={styles.terms}>términos y condiciones</span>
          </>
        }
        checked={values.acceptTerms}
        error={fieldErrors.acceptTerms}
        onChange={(checked) => change('acceptTerms', checked)}
      />

      {state.failure && <Alert tone="error">{MESSAGES.REGISTER_UNAVAILABLE}</Alert>}

      <Button type="submit" loading={state.status === 'submitting'} loadingLabel="Creando cuenta…">
        Crear cuenta
      </Button>

      <Divider>o regístrate con</Divider>

      <div className={loginStyles.social}>
        <SocialButton provider="Google" onClick={comingSoon} />
        <SocialButton provider="Apple" onClick={comingSoon} />
      </div>

      <p className={loginStyles.footer}>
        ¿Ya tienes cuenta?
        <Button variant="link" onClick={onGoToLogin}>
          Inicia sesión
        </Button>
      </p>
    </form>
  );
}
