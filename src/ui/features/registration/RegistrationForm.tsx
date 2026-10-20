import { followLocalLink } from '@/ui/navigation/link';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { Divider } from '@/ui/components/Divider/Divider';
import { useRef } from 'react';
import type { Register } from '@/application/register';
import { REGISTRATION_MESSAGES } from '@/domain/messages';
import { registrationFields, type RegistrationValues } from '@/domain/registration';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { TextField } from '@/ui/components/TextField/TextField';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { useRegistrationForm } from './useRegistrationForm';
import styles from './RegistrationForm.module.css';
export type RegistrationFormProps = {
  register: Register;
  onSuccess: () => void;
  onLogin?: () => void;
};
export function RegistrationForm({ register, onSuccess, onLogin }: RegistrationFormProps) {
  const { state, change, blur, submit, showNotice } = useRegistrationForm(register, onSuccess);
  const refs = useRef<Partial<Record<keyof RegistrationValues, HTMLInputElement | null>>>({});
  const busy = state.status === 'submitting';
  const error = (field: keyof RegistrationValues) => {
    const code = state.errors[field];
    return code ? REGISTRATION_MESSAGES[code] : undefined;
  };
  return (
    <form
      className={styles.form}
      aria-busy={busy || undefined}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const errors = submit();
        const first = registrationFields.find((field) => errors[field]);
        if (first) refs.current[first]?.focus();
      }}
    >
      <div className={styles.heading}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.subtitle}>Empieza tu camino con KynWallet</p>
        <p className={styles.required}>Todos los campos son obligatorios.</p>
      </div>
      <fieldset disabled={busy} className={styles.fields}>
        <TextField
          label="Nombre completo"
          name="fullName"
          autoComplete="name"
          required
          ref={(node) => {
            refs.current.fullName = node;
          }}
          value={state.values.fullName}
          error={error('fullName')}
          onBlur={() => blur('fullName')}
          onChange={(event) => change('fullName', event.target.value)}
        />
        <TextField
          label="Correo electrónico"
          name="email"
          type="email"
          autoComplete="email"
          required
          ref={(node) => {
            refs.current.email = node;
          }}
          value={state.values.email}
          error={error('email')}
          onBlur={() => blur('email')}
          onChange={(event) => change('email', event.target.value)}
        />
        <PasswordField
          label="Contraseña"
          name="password"
          autoComplete="new-password"
          required
          ref={(node) => {
            refs.current.password = node;
          }}
          value={state.values.password}
          error={error('password')}
          onBlur={() => blur('password')}
          onChange={(event) => change('password', event.target.value)}
        />
        <PasswordField
          label="Confirmar contraseña"
          name="confirmPassword"
          autoComplete="new-password"
          visibilityLabel="confirmación"
          required
          ref={(node) => {
            refs.current.confirmPassword = node;
          }}
          value={state.values.confirmPassword}
          error={error('confirmPassword')}
          onBlur={() => blur('confirmPassword')}
          onChange={(event) => change('confirmPassword', event.target.value)}
        />
        <Checkbox
          label="Acepto los términos y condiciones"
          name="acceptedTerms"
          required
          ref={(node) => {
            refs.current.acceptedTerms = node;
          }}
          error={error('acceptedTerms')}
          onBlur={() => blur('acceptedTerms')}
          checked={state.values.acceptedTerms}
          onChange={(checked) => change('acceptedTerms', checked)}
        />
      </fieldset>
      {busy && (
        <span role="status" className="visually-hidden">
          Creando cuenta…
        </span>
      )}
      {state.status === 'failed' && <Alert tone="error">{REGISTRATION_MESSAGES.UNAVAILABLE}</Alert>}
      <Button type="submit" loading={busy} loadingLabel="Creando cuenta…">
        Crear cuenta
      </Button>
      <Divider>o continúa con</Divider>
      <div className={styles.social}>
        <SocialButton
          provider="Google"
          onClick={() => showNotice(REGISTRATION_MESSAGES.COMING_SOON)}
        />
        <SocialButton
          provider="Apple"
          onClick={() => showNotice(REGISTRATION_MESSAGES.COMING_SOON)}
        />
      </div>
      {state.notice && <Alert tone="info">{state.notice}</Alert>}
      <p className={styles.footer}>
        ¿Ya tienes cuenta?{' '}
        <a
          href="/login"
          className={styles.link}
          onClick={(event) => {
            if (onLogin) followLocalLink(event, onLogin);
          }}
        >
          Inicia sesión
        </a>
      </p>
    </form>
  );
}
