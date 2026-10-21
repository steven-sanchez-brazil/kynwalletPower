import { useRef, useState, type FormEvent } from 'react';
import type { RegisterAccount } from '@/application/registerAccount';
import { MESSAGES } from '@/domain/messages';
import type { RegistrationErrors } from '@/domain/registration';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { TermsView } from './TermsView';
import { useRegistrationForm } from './useRegistrationForm';
import styles from './RegistrationForm.module.css';

type Props = {
  registerAccount: RegisterAccount;
  onSuccess: () => void;
  onLogin?: () => void;
};

export function RegistrationForm({ registerAccount, onSuccess, onLogin }: Props) {
  const { values, errors, status, notice, change, blur, submit, setNotice } = useRegistrationForm(
    registerAccount,
    onSuccess,
  );
  const [showTerms, setShowTerms] = useState(false);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const refs = {
    fullName: fullNameRef,
    email: emailRef,
    password: passwordRef,
    confirmPassword: confirmRef,
    acceptedTerms: termsRef,
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found: RegistrationErrors = submit();
    const first = (Object.keys(refs) as Array<keyof RegistrationErrors>).find(
      (field) => found[field],
    );
    if (first) refs[first].current?.focus();
  };

  return (
    <>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Crea tu cuenta</h1>
          <p className={styles.subtitle}>Completa tus datos para comenzar</p>
        </div>
        <TextField
          label="Nombre completo"
          ref={fullNameRef}
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Ej: Diego Martínez"
          value={values.fullName}
          error={errors.fullName}
          onChange={(event) => change('fullName', event.target.value)}
          onBlur={() => blur('fullName')}
        />
        <TextField
          label="Correo electrónico"
          ref={emailRef}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          value={values.email}
          error={errors.email}
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
          error={errors.password}
          onChange={(event) => change('password', event.target.value)}
          onBlur={() => blur('password')}
        />
        <PasswordField
          label="Confirmar contraseña"
          ref={confirmRef}
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={(event) => change('confirmPassword', event.target.value)}
          onBlur={() => blur('confirmPassword')}
        />
        <Checkbox
          label="Acepto los"
          actionLabel="términos y condiciones"
          onAction={() => setShowTerms(true)}
          ref={termsRef}
          checked={values.acceptedTerms}
          error={errors.acceptedTerms}
          onChange={(checked) => change('acceptedTerms', checked)}
        />
        {status === 'failure' && <Alert tone="error">{MESSAGES.REGISTRATION_ERROR}</Alert>}
        <Button type="submit" loading={status === 'submitting'} loadingLabel="Creando cuenta…">
          Crear cuenta
        </Button>
        <Divider>o regístrate con</Divider>
        <div className={styles.social}>
          <SocialButton provider="Google" onClick={() => setNotice(MESSAGES.COMING_SOON)} />
          <SocialButton provider="Apple" onClick={() => setNotice(MESSAGES.COMING_SOON)} />
        </div>
        {notice && <Alert tone="info">{notice}</Alert>}
        <p className={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <a
            href="/login"
            onClick={(event) => {
              if (onLogin) {
                event.preventDefault();
                onLogin();
              }
            }}
          >
            Inicia sesión
          </a>
        </p>
      </form>
      {showTerms && <TermsView onClose={() => setShowTerms(false)} />}
    </>
  );
}
