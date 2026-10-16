import { useEffect, useRef, type FormEvent } from 'react';
import type { Register } from '@/application/register';
import type { RegistrationField } from '@/domain/registration';
import { REGISTRATION_MESSAGES } from '@/domain/messages';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { NavigationLink, type Navigate } from '@/ui/components/NavigationLink/NavigationLink';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { useRegistrationForm } from './useRegistrationForm';
import styles from './RegistrationForm.module.css';

export function RegistrationForm({
  register,
  onSuccess,
  onNavigate,
}: {
  register: Register;
  onSuccess: () => void;
  onNavigate?: Navigate;
}) {
  const { state, change, blur, submit } = useRegistrationForm(register, onSuccess);
  const fullName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const termsAccepted = useRef<HTMLInputElement>(null);
  const busy = state.status === 'submitting';
  useEffect(() => {
    if (state.unavailable) password.current?.focus();
  }, [state.unavailable]);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();
    const refs = { fullName, email, password, confirmPassword, termsAccepted };
    const first = (Object.keys(refs) as RegistrationField[]).find((field) => errors[field]);
    if (first) refs[first].current?.focus();
  };
  const socialNotice = () => window.alert('Próximamente');
  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.subtitle}>Completa tus datos para comenzar</p>
      </div>
      <div className={styles.fields}>
        <TextField
          label="Nombre completo"
          ref={fullName}
          name="fullName"
          autoComplete="name"
          placeholder="Ej: Diego Martínez"
          required
          disabled={busy}
          value={state.values.fullName}
          error={state.errors.fullName}
          onChange={(e) => change('fullName', e.target.value)}
          onBlur={() => blur('fullName')}
        />
        <TextField
          label="Correo electrónico"
          ref={email}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          required
          disabled={busy}
          value={state.values.email}
          error={state.errors.email}
          onChange={(e) => change('email', e.target.value)}
          onBlur={() => blur('email')}
        />
        <PasswordField
          label="Contraseña"
          ref={password}
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          disabled={busy}
          value={state.values.password}
          error={state.errors.password}
          onChange={(e) => change('password', e.target.value)}
          onBlur={() => blur('password')}
        />
        <PasswordField
          label="Confirmar contraseña"
          ref={confirmPassword}
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          visibilityLabels={{ show: 'Mostrar confirmación', hide: 'Ocultar confirmación' }}
          required
          disabled={busy}
          value={state.values.confirmPassword}
          error={state.errors.confirmPassword}
          onChange={(e) => change('confirmPassword', e.target.value)}
          onBlur={() => blur('confirmPassword')}
        />
      </div>
      <div className={styles.terms}>
        <Checkbox
          label="Acepto los"
          ref={termsAccepted}
          name="termsAccepted"
          required
          disabled={busy}
          checked={state.values.termsAccepted}
          error={state.errors.termsAccepted}
          onChange={(value) => change('termsAccepted', value)}
          onBlur={() => blur('termsAccepted')}
          labelSuffix={
            <Button
              variant="link"
              onClick={() => window.alert(REGISTRATION_MESSAGES.TERMS_UNAVAILABLE)}
            >
              términos y condiciones
            </Button>
          }
        />
      </div>
      {state.unavailable && <Alert tone="error">{REGISTRATION_MESSAGES.UNAVAILABLE}</Alert>}
      <Button type="submit" loading={busy} loadingLabel="Creando cuenta…">
        Crear cuenta
      </Button>
      <div className={styles.divider}>
        <Divider>o regístrate con</Divider>
      </div>
      <div className={styles.social}>
        <SocialButton provider="Google" onClick={socialNotice} />
        <SocialButton provider="Apple" onClick={socialNotice} />
      </div>
      <p className={styles.footer}>
        ¿Ya tienes cuenta?{' '}
        <NavigationLink href="/login" onNavigate={onNavigate}>
          Inicia sesión
        </NavigationLink>
      </p>
      <p className={styles.demo}>
        Demostración: este registro no crea usuarios para iniciar sesión ni guarda contraseñas.
      </p>
    </form>
  );
}
