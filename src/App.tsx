import { useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { RegisterUser } from '@/application/registerUser';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegisterForm } from '@/ui/features/register/RegisterForm';

type AppProps = {
  authenticate: Authenticate;
  registerUser?: RegisterUser;
};

export function App({ authenticate, registerUser }: AppProps) {
  const [view, setView] = useState<'login' | 'register'>('login');

  return (
    <LoginScreen>
      {view === 'register' && registerUser ? (
        <RegisterForm registerUser={registerUser} onNavigateToLogin={() => setView('login')} />
      ) : (
        <LoginForm
          authenticate={authenticate}
          onNavigateToRegister={registerUser ? () => setView('register') : undefined}
        />
      )}
    </LoginScreen>
  );
}
