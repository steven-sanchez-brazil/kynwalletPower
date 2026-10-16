import type { Authenticate } from '@/application/authenticate';
import type { Register } from '@/application/register';
import type { WalletOverview } from '@/domain/wallet';
import { WalletHome } from '@/ui/features/home/WalletHome';
import { REGISTRATION_MESSAGES } from '@/domain/messages';
import { Alert } from '@/ui/components/Alert/Alert';
import { RegistrationForm } from '@/ui/features/registration/RegistrationForm';
import { useNavigation } from '@/ui/navigation/useNavigation';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';

type AppProps = {
  authenticate: Authenticate;
  register: Register;
  wallet: WalletOverview;
};

export function App({ authenticate, register, wallet }: AppProps) {
  const { route, navigate, registrationCompleted, loginCompleted, logout } = useNavigation();
  if (route.path === '/inicio' && route.displayName) {
    return <WalletHome name={route.displayName} wallet={wallet} onLogout={logout} />;
  }
  if (route.path === '/registro') {
    return (
      <LoginScreen variant="registration">
        <RegistrationForm
          key={route.session}
          register={register}
          onSuccess={() => registrationCompleted(route.session)}
          onNavigate={navigate}
        />
      </LoginScreen>
    );
  }
  return (
    <LoginScreen>
      {route.registrationNotice && <Alert tone="info">{REGISTRATION_MESSAGES.SUCCESS}</Alert>}
      <LoginForm
        key={route.session}
        authenticate={authenticate}
        onNavigate={navigate}
        onAuthenticated={(name) => loginCompleted(route.session, name)}
      />
    </LoginScreen>
  );
}
