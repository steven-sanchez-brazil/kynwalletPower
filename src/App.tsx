import { useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { Register } from '@/application/register';
import { MESSAGES } from '@/domain/messages';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegisterForm } from '@/ui/features/register/RegisterForm';
import { RegisterScreen } from '@/ui/features/register/RegisterScreen';

type AppProps = {
  authenticate: Authenticate;
  register?: Register;
};

export function App({ authenticate, register }: AppProps) {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [prefilledEmail, setPrefilledEmail] = useState('');
  const [registrationSuccessNotice, setRegistrationSuccessNotice] = useState<string | null>(null);

  const handleRegisterSuccess = (account: { email: string; displayName: string }) => {
    setPrefilledEmail(account.email);
    setRegistrationSuccessNotice(MESSAGES.REGISTRATION_SUCCESS);
    setView('login');
  };

  if (view === 'register' && register) {
    return (
      <RegisterScreen>
        <RegisterForm
          register={register}
          onNavigateToLogin={() => {
            setRegistrationSuccessNotice(null);
            setView('login');
          }}
          onSuccess={handleRegisterSuccess}
        />
      </RegisterScreen>
    );
  }

  return (
    <LoginScreen>
      <LoginForm
        authenticate={authenticate}
        onNavigateToRegister={() => {
          setRegistrationSuccessNotice(null);
          setView('register');
        }}
        initialEmail={prefilledEmail}
        registrationSuccessNotice={registrationSuccessNotice}
      />
    </LoginScreen>
  );
}
