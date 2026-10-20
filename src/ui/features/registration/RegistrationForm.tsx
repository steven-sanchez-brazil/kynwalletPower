import { useRef, type FormEvent } from 'react';
import type { Register } from '@/application/register';
import type { RegistrationField } from '@/domain/registration';
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

type Props = { register: Register; onSuccess: () => void; onLogin?: () => void };
export function RegistrationForm({ register, onSuccess, onLogin }: Props) {
  const { state, errors, change, blur, submit } = useRegistrationForm(register, onSuccess);
  const formRef = useRef<HTMLFormElement>(null);
  const busy = state.status === 'submitting';
  const showAlert = (message: string) => {
    const trigger = document.activeElement;
    window.alert(message);
    if (trigger instanceof HTMLElement) trigger.focus();
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = submit();
    const order: RegistrationField[] = [
      'fullName',
      'email',
      'password',
      'confirmPassword',
      'acceptedTerms',
    ];
    const first = order.find((field) => invalid[field]);
    if (first) formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
  };
  return (
    <form
      ref={formRef}
      className={styles.form}
      noValidate
      onSubmit={handleSubmit}
      aria-label="Registro de demostración"
    >
      <div className={styles.heading}>
        <h1>Crea tu cuenta</h1>
        <p>Completa tus datos para comenzar</p>
      </div>
      <div className={styles.fields}>
        <TextField
          label="Nombre completo"
          name="fullName"
          required
          autoComplete="name"
          placeholder="Ej: Diego Martínez"
          value={state.values.fullName}
          disabled={busy}
          error={errors.fullName}
          onChange={(event) => change('fullName', event.target.value)}
          onBlur={() => blur('fullName')}
        />
        <TextField
          label="Correo electrónico"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          value={state.values.email}
          disabled={busy}
          error={errors.email}
          onChange={(event) => change('email', event.target.value)}
          onBlur={() => blur('email')}
        />
        <PasswordField
          label="Contraseña"
          name="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={state.values.password}
          disabled={busy}
          error={errors.password}
          onChange={(event) => change('password', event.target.value)}
          onBlur={() => blur('password')}
        />
        <PasswordField
          label="Confirmar contraseña"
          visibilityLabel="confirmar contraseña"
          name="confirmPassword"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={state.values.confirmPassword}
          disabled={busy}
          error={errors.confirmPassword}
          onChange={(event) => change('confirmPassword', event.target.value)}
          onBlur={() => blur('confirmPassword')}
        />
      </div>
      <div className={styles.terms}>
        <Checkbox
          label="Acepto los"
          aria-label="Acepto los términos y condiciones"
          name="acceptedTerms"
          checked={state.values.acceptedTerms}
          required
          disabled={busy}
          error={errors.acceptedTerms}
          onChange={(value) => change('acceptedTerms', value)}
          onBlur={() => blur('acceptedTerms')}
        />
        <Button variant="link" onClick={() => showAlert(MESSAGES.TERMS_UNAVAILABLE)}>
          términos y condiciones
        </Button>
      </div>
      {state.status === 'failed' && <Alert tone="error">{MESSAGES.REGISTRATION_FAILED}</Alert>}
      <Button type="submit" loading={busy} loadingLabel="Creando cuenta…">
        Crear cuenta
      </Button>
      <div className={styles.socialSection}>
        <Divider>o regístrate con</Divider>
        <div className={styles.social}>
          <SocialButton provider="Google" onClick={() => showAlert(MESSAGES.SOCIAL_SOON)} />
          <SocialButton provider="Apple" onClick={() => showAlert(MESSAGES.SOCIAL_SOON)} />
        </div>
      </div>
      <p className={styles.footer}>
        ¿Ya tienes cuenta?{' '}
        <a
          href="/login"
          onClick={(event) => {
            if (
              onLogin &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.shiftKey &&
              !event.altKey &&
              event.button === 0
            ) {
              event.preventDefault();
              onLogin();
            }
          }}
        >
          Inicia sesión
        </a>
      </p>
      <p className={styles.demo}>{MESSAGES.DEMO_NOTICE}</p>
    </form>
  );
}
