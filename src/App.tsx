import { useEffect, useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import { Alert } from '@/ui/components/Alert/Alert';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegisterForm } from '@/ui/features/register/RegisterForm';

type AppProps = { authenticate: Authenticate };

export function App({ authenticate }: AppProps) {
  const [path, setPath] = useState(() => window.location.pathname);
  const [registered, setRegistered] = useState(() => window.history.state?.notice === 'registered');

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
      setRegistered(window.history.state?.notice === 'registered');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (next: '/login' | '/registro', success = false) => {
    window.history.pushState({ notice: success ? 'registered' : undefined }, '', next);
    setRegistered(success);
    setPath(next);
  };

  if (path === '/registro') {
    return (
      <LoginScreen registration>
        <RegisterForm
          onSuccess={() => navigate('/login', true)}
          onLogin={() => navigate('/login')}
        />
      </LoginScreen>
    );
  }

  return (
    <LoginScreen>
      {registered && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="info">Registro exitoso (demostración). No se creó una cuenta real.</Alert>
        </div>
      )}
      <LoginForm authenticate={authenticate} onRegister={() => navigate('/registro')} />
    </LoginScreen>
  );
}
