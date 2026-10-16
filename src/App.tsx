import { useEffect, useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { RegisterAccount } from '@/application/registerAccount';
import { REGISTRATION_MESSAGES } from '@/domain/registration';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegisterForm } from '@/ui/features/register/RegisterForm';
import { RegisterScreen } from '@/ui/features/register/RegisterScreen';
import { navigateTo } from '@/ui/navigation';

type AppProps = {
  authenticate: Authenticate;
  registerAccount?: RegisterAccount;
};

const unavailableRegistration: RegisterAccount = async () => ({ kind: 'unavailable' });

export function App({ authenticate, registerAccount = unavailableRegistration }: AppProps) {
  const [route, setRoute] = useState({
    path: window.location.pathname,
    registrationSuccess: false,
  });

  useEffect(() => {
    const update = (event: PopStateEvent) => {
      const state = event.state as { registrationSuccess?: boolean } | null;
      setRoute({
        path: window.location.pathname,
        registrationSuccess: state?.registrationSuccess === true,
      });
    };
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  if (route.path === '/register') {
    return (
      <RegisterScreen>
        <RegisterForm
          registerAccount={registerAccount}
          onSuccess={() => navigateTo('/login', { registrationSuccess: true })}
        />
      </RegisterScreen>
    );
  }

  return (
    <LoginScreen>
      <LoginForm
        authenticate={authenticate}
        successMessage={route.registrationSuccess ? REGISTRATION_MESSAGES.SUCCESS : undefined}
      />
    </LoginScreen>
  );
}
