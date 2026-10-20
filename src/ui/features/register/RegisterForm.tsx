import { useRef, useState, type FormEvent } from 'react';
import { validateRegistration, type RegistrationErrors, type RegistrationValues } from '@/domain/registration';
import { Button } from '@/ui/components/Button/Button';
import { Checkbox } from '@/ui/components/Checkbox/Checkbox';
import { Divider } from '@/ui/components/Divider/Divider';
import { PasswordField } from '@/ui/components/PasswordField/PasswordField';
import { SocialButton } from '@/ui/components/SocialButton/SocialButton';
import { TextField } from '@/ui/components/TextField/TextField';
import styles from './RegisterForm.module.css';

const initial: RegistrationValues = {
  fullName: '', email: '', password: '', confirmPassword: '', acceptedTerms: false,
};

type FormField = Exclude<keyof RegistrationValues, 'acceptedTerms'>;

export function RegisterForm({ onSuccess, onLogin }: {
  onSuccess: () => void;
  onLogin: () => void;
}) {
  const [values, setValues] = useState<RegistrationValues>(initial);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof RegistrationValues, value: string | boolean) => {
    const next = { ...values, [field]: value } as RegistrationValues;
    setValues(next);
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateRegistration(next)[field] }));
    }
  };

  const onBlur = (field: FormField) => {
    setErrors((current) => ({ ...current, [field]: validateRegistration(values)[field] }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateRegistration(values);
    setErrors(result);
    if (Object.keys(result).length > 0) {
      if (result.fullName) fullNameRef.current?.focus();
      else if (result.email) emailRef.current?.focus();
      else if (result.password) passwordRef.current?.focus();
      else if (result.confirmPassword) confirmRef.current?.focus();
      return;
    }
    // Solo valida y navega: no guarda cuentas ni contraseñas.
    onSuccess();
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.subtitle}>Completa tus datos para comenzar</p>
      </div>
      <TextField
        ref={fullNameRef} label="Nombre completo" name="fullName" autoComplete="name"
        placeholder="Tu nombre completo" value={values.fullName} error={errors.fullName}
        onChange={(event) => update('fullName', event.target.value)} onBlur={() => onBlur('fullName')}
      />
      <TextField
        ref={emailRef} label="Correo electrónico" name="email" type="email" autoComplete="email"
        placeholder="tucorreo@ejemplo.com" value={values.email} error={errors.email}
        onChange={(event) => update('email', event.target.value)} onBlur={() => onBlur('email')}
      />
      <PasswordField
        ref={passwordRef} label="Contraseña" name="password" autoComplete="new-password"
        placeholder="••••••••" value={values.password} error={errors.password}
        onChange={(event) => update('password', event.target.value)} onBlur={() => onBlur('password')}
      />
      <PasswordField
        ref={confirmRef} label="Confirmar contraseña" name="confirmPassword" autoComplete="new-password"
        placeholder="••••••••" value={values.confirmPassword} error={errors.confirmPassword}
        onChange={(event) => update('confirmPassword', event.target.value)} onBlur={() => onBlur('confirmPassword')}
      />
      <div className={styles.terms}>
        <Checkbox
          label="Acepto los términos y condiciones" checked={values.acceptedTerms}
          onChange={(checked) => update('acceptedTerms', checked)} error={errors.acceptedTerms}
        />
      </div>
      <Button type="submit">Crear cuenta</Button>
      <Divider>o regístrate con</Divider>
      <div className={styles.social}>
        <SocialButton provider="Google" onClick={() => window.alert('Próximamente')} />
        <SocialButton provider="Apple" onClick={() => window.alert('Próximamente')} />
      </div>
      <p className={styles.footer}>
        ¿Ya tienes cuenta? <Button variant="link" onClick={onLogin}>Inicia sesión</Button>
      </p>
    </form>
  );
}
