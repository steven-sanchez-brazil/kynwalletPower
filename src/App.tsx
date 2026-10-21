import { useEffect, useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { RegisterAccount } from '@/application/registerAccount';
import { MESSAGES } from '@/domain/messages';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegistrationForm } from '@/ui/features/registration/RegistrationForm';
import { RegistrationScreen } from '@/ui/features/registration/RegistrationScreen';

type AppProps = {
  authenticate: Authenticate;
  registerAccount: RegisterAccount;
};

function currentRoute() {
  return window.location.pathname === '/registro' ? 'registration' : 'login';
}

export function App({ authenticate, registerAccount }: AppProps) {
  const [route, setRoute] = useState(currentRoute);
  const [registrationNotice, setRegistrationNotice] = useState('');

  useEffect(() => {
    const onPopState = () => {
      setRegistrationNotice('');
      setRoute(currentRoute());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: '/registro' | '/login', success = false) => {
    window.history.pushState(null, '', path);
    setRegistrationNotice(success ? MESSAGES.REGISTRATION_SUCCESS : '');
    setRoute(currentRoute());
  };

  if (route === 'registration') {
    return (
      <RegistrationScreen>
        <RegistrationForm
          registerAccount={registerAccount}
          onSuccess={() => navigate('/login', true)}
          onLogin={() => navigate('/login')}
        />
      </RegistrationScreen>
    );
  }

  return (
    <LoginScreen>
      <LoginForm
        authenticate={authenticate}
        onRegister={() => navigate('/registro')}
        registrationNotice={registrationNotice}
      />
    </LoginScreen>
  );
}
