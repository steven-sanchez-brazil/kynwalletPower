import { useRef, type FormEvent } from 'react';
import type { RegisterAccount } from '@/application/registerAccount';
import { REGISTRATION_MESSAGES } from '@/domain/registration';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { NavigationLink } from '@/ui/components/NavigationLink/NavigationLink';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { useRegisterForm } from './useRegisterForm';
import styles from './RegisterForm.module.css';

type RegisterFormProps = {
  registerAccount: RegisterAccount;
  onSuccess: () => void;
};

export function RegisterForm({ registerAccount, onSuccess }: RegisterFormProps) {
  const { values, fieldErrors, submissionError, submitting, change, blur, submit } =
    useRegisterForm(registerAccount, onSuccess);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = submit();
    const fields = [
      ['fullName', fullNameRef],
      ['email', emailRef],
      ['password', passwordRef],
      ['confirmPassword', confirmationRef],
      ['acceptedTerms', termsRef],
    ] as const;
    for (const [field, ref] of fields) {
      if (errors[field]) {
        ref.current?.focus();
        break;
      }
    }
  }

  const comingSoon = () => window.alert(REGISTRATION_MESSAGES.COMING_SOON);

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
        placeholder="Ej. Diego Martínez"
        required
        disabled={submitting}
        value={values.fullName}
        error={fieldErrors.fullName}
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
        required
        disabled={submitting}
        value={values.email}
        error={fieldErrors.email}
        onChange={(event) => change('email', event.target.value)}
        onBlur={() => blur('email')}
      />
      <PasswordField
        ref={passwordRef}
        label="Contraseña"
        name="password"
        autoComplete="new-password"
        placeholder="••••••••"
        required
        disabled={submitting}
        value={values.password}
        error={fieldErrors.password}
        onChange={(event) => change('password', event.target.value)}
        onBlur={() => blur('password')}
      />
      <PasswordField
        ref={confirmationRef}
        label="Confirmar contraseña"
        toggleLabel="confirmación de contraseña"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="••••••••"
        required
        disabled={submitting}
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
        name="acceptedTerms"
        required
        disabled={submitting}
        checked={values.acceptedTerms}
        error={fieldErrors.acceptedTerms}
        onChange={(checked) => change('acceptedTerms', checked)}
        onBlur={() => blur('acceptedTerms')}
      />

      {submissionError && <Alert tone="error">{submissionError}</Alert>}

      <Button type="submit" loading={submitting} loadingLabel="Creando cuenta…">
        Crear cuenta
      </Button>
      <Divider>o regístrate con</Divider>
      <div className={styles.social}>
        <SocialButton provider="Google" onClick={comingSoon} />
        <SocialButton provider="Apple" onClick={comingSoon} />
      </div>
      <p className={styles.footer}>
        <span>¿Ya tienes cuenta?</span>
        <NavigationLink href="/login" className={styles.loginLink}>
          Inicia sesión
        </NavigationLink>
      </p>
    </form>
  );
}
