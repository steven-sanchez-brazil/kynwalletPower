import { useRef, type FormEvent } from 'react';
import { Alert } from '@/ui/components/Alert/Alert';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import { useRegistrationForm } from './useRegistrationForm';
import styles from './RegisterForm.module.css';

export function RegisterForm() {
  const { state, change, blur, setTermsAccepted, submit, succeed, showNotice } =
    useRegistrationForm();
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = submit();
    if (errors.fullName) fullNameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.password) passwordRef.current?.focus();
    else if (errors.confirmPassword) confirmPasswordRef.current?.focus();
    else if (errors.termsAccepted) termsRef.current?.focus();
    else succeed();
  };

  if (state.status === 'success') {
    return (
      <div className={styles.success}>
        <h1 className={styles.title}>¡Registro exitoso!</h1>
        <Alert tone="info">Registro exitoso. Tu registro se completó correctamente.</Alert>
      </div>
    );
  }

  const notifyComingSoon = () => showNotice('Próximamente');

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>Regístrate para comenzar a usar KynWallet</p>
      </div>

      <TextField
        label="Nombre completo"
        ref={fullNameRef}
        type="text"
        name="name"
        autoComplete="name"
        value={state.values.fullName}
        error={state.errors.fullName}
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
        error={state.errors.email}
        onChange={(event) => change('email', event.target.value)}
        onBlur={() => blur('email')}
      />

      <PasswordField
        label="Contraseña"
        ref={passwordRef}
        name="new-password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        value={state.values.password}
        error={state.errors.password}
        onChange={(event) => change('password', event.target.value)}
        onBlur={() => blur('password')}
      />

      <PasswordField
        label="Confirmar contraseña"
        ref={confirmPasswordRef}
        name="confirm-password"
        autoComplete="new-password"
        placeholder="Repite tu contraseña"
        value={state.values.confirmPassword}
        error={state.errors.confirmPassword}
        onChange={(event) => change('confirmPassword', event.target.value)}
        onBlur={() => blur('confirmPassword')}
      />

      <Checkbox
        label="Acepto los términos y condiciones"
        checked={state.termsAccepted}
        error={state.errors.termsAccepted}
        inputRef={termsRef}
        onChange={setTermsAccepted}
        onBlur={() => blur('termsAccepted')}
      />

      {state.notice && <Alert tone="info">{state.notice}</Alert>}

      <Button type="submit">Crear cuenta</Button>

      <Divider>o regístrate con</Divider>

      <div className={styles.social}>
        <SocialButton provider="Google" onClick={notifyComingSoon} />
        <SocialButton provider="Apple" onClick={notifyComingSoon} />
      </div>

      <p className={styles.footer}>
        ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
      </p>
    </form>
  );
}
