import { useCallback, useEffect, useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { RegisterUser } from '@/application/registerUser';
import { MESSAGES } from '@/domain/messages';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegistrationScreen } from '@/ui/features/registration/RegistrationScreen';

type AppProps = {
  authenticate: Authenticate;
  registerUser?: RegisterUser;
};

const unavailableRegisterUser: RegisterUser = async () => ({ kind: 'unavailable' });

export function App({ authenticate, registerUser = unavailableRegisterUser }: AppProps) {
  const [path, setPath] = useState(() => window.location.pathname);
  const [loginFlash, setLoginFlash] = useState<string | null>(null);

  useEffect(() => {
    const syncPath = () => {
      setPath(window.location.pathname);
      setLoginFlash(null);
    };
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  const navigate = useCallback((nextPath: string) => {
    window.history.pushState(null, '', nextPath);
    setPath(nextPath);
  }, []);

  if (path === '/register') {
    return (
      <RegistrationScreen
        registerUser={registerUser}
        onSuccess={() => {
          setLoginFlash(MESSAGES.REGISTRATION_SUCCESS);
          navigate('/login');
        }}
        onNavigateLogin={() => {
          setLoginFlash(null);
          navigate('/login');
        }}
      />
    );
  }

  return (
    <LoginScreen>
      <LoginForm authenticate={authenticate} successMessage={loginFlash} />
    </LoginScreen>
  );
}
