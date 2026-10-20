import type { Authenticate } from '@/application/authenticate';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegisterScreen } from '@/ui/features/register/RegisterScreen';

type AppProps = {
  authenticate: Authenticate;
};

export function App({ authenticate }: AppProps) {
  if (window.location.pathname === '/register') {
    return <RegisterScreen />;
  }

  return (
    <LoginScreen>
      <LoginForm authenticate={authenticate} />
    </LoginScreen>
  );
}
