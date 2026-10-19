import { useRef, type FormEvent, type RefObject } from 'react';
import type { RegisterAccount } from '@/application/registerAccount';
import { MESSAGES } from '@/domain/messages';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { Link } from '@/ui/routing/Link';
import { ROUTES } from '@/ui/routing/router';
import type { RegisterField } from './registerReducer';
import { useRegisterForm } from './useRegisterForm';
import styles from './RegisterForm.module.css';

type RegisterFormProps = {
  registerAccount: RegisterAccount;
  onRegistered: () => void;
};

/** Orden de los controles para mover el foco al primer error (FR-010). */
const FIELD_ORDER: readonly RegisterField[] = [
  'fullName',
  'email',
  'password',
  'confirmPassword',
  'acceptedTerms',
];

// FR-015: funciones anunciadas en el diseño pero aún no disponibles.
const comingSoon = () => window.alert(MESSAGES.COMING_SOON);

export function RegisterForm({ registerAccount, onRegistered }: RegisterFormProps) {
  const { state, change, toggleTerms, blur, submit } = useRegisterForm(
    registerAccount,
    onRegistered,
  );
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const acceptedTermsRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();
    const refs: Record<RegisterField, RefObject<HTMLInputElement | null>> = {
      fullName: fullNameRef,
      email: emailRef,
      password: passwordRef,
      confirmPassword: confirmPasswordRef,
      acceptedTerms: acceptedTermsRef,
    };
    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) refs[firstInvalid].current?.focus();
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
          placeholder="Ej: Diego Martínez"
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
          ref={confirmPasswordRef}
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.confirmPassword}
          error={fieldErrors.confirmPassword}
          onChange={(event) => change('confirmPassword', event.target.value)}
          onBlur={() => blur('confirmPassword')}
        />
      </div>

      <Checkbox
        ref={acceptedTermsRef}
        checked={values.acceptedTerms}
        error={fieldErrors.acceptedTerms}
        onChange={toggleTerms}
        label={
          <>
            Acepto los{' '}
            <Button variant="link" className={styles.termsLink} onClick={comingSoon}>
              términos y condiciones
            </Button>
          </>
        }
      />

      {state.submitError && (
        <Alert tone="error">
          {state.submitError === 'email-taken'
            ? MESSAGES.EMAIL_TAKEN
            : MESSAGES.REGISTRATION_UNAVAILABLE}
        </Alert>
      )}

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
        <Link to={ROUTES.login}>Inicia sesión</Link>
      </p>
    </form>
  );
}
