import { useEffect, useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { RegisterAccount } from '@/application/registerAccount';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegisterForm } from '@/ui/features/register/RegisterForm';

type AppProps = {
  authenticate: Authenticate;
  registerAccount?: RegisterAccount;
  registerRedirectDelayMs?: number;
};

export function App({ authenticate, registerAccount, registerRedirectDelayMs }: AppProps) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: '/login' | '/register') => {
    window.history.pushState({}, '', to);
    setPath(to);
  };

  return (
    <LoginScreen>
      {path === '/register' && registerAccount ? (
        <RegisterForm
          registerAccount={registerAccount}
          redirectDelayMs={registerRedirectDelayMs}
          onSuccessRedirect={() => navigate('/login')}
          onNavigateToLogin={() => navigate('/login')}
        />
      ) : (
        <LoginForm authenticate={authenticate} onNavigateToRegister={() => navigate('/register')} />
      )}
    </LoginScreen>
  );
}
