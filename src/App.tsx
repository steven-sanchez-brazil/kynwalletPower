import { useState, useRef, useCallback, useEffect, useSyncExternalStore } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { Register } from '@/application/register';
import type { Navigation } from '@/ui/navigation/Navigation';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegistrationForm } from '@/ui/features/registration/RegistrationForm';
import { RegistrationScreen } from '@/ui/features/registration/RegistrationScreen';
import { Alert } from '@/ui/components/Alert/Alert';
import { REGISTRATION_MESSAGES } from '@/domain/messages';
type AppProps = { authenticate: Authenticate; register: Register; navigation: Navigation };
export function App({ authenticate, register, navigation }: AppProps) {
  const [arrival, setArrival] = useState(false);
  const successPending = useRef(false);
  const subscribe = useCallback(
    (listener: () => void) =>
      navigation.subscribe(() => {
        if (!successPending.current) setArrival(false);
        listener();
      }),
    [navigation],
  );
  const path = useSyncExternalStore(subscribe, navigation.getPath);
  useEffect(() => {
    document.title =
      path === '/register' ? 'Crear cuenta · KynWallet' : 'Inicia sesión · KynWallet';
    const heading = document.querySelector<HTMLElement>('main h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  }, [path]);
  const onSuccess = () => {
    successPending.current = true;
    setArrival(true);
    navigation.navigate('/login', 'replace');
    successPending.current = false;
  };
  if (path === '/register')
    return (
      <RegistrationScreen>
        <RegistrationForm
          register={register}
          onSuccess={onSuccess}
          onLogin={() => navigation.navigate('/login')}
        />
      </RegistrationScreen>
    );
  return (
    <LoginScreen>
      {arrival && <Alert tone="info">{REGISTRATION_MESSAGES.SUCCESS}</Alert>}
      <LoginForm authenticate={authenticate} onRegister={() => navigation.navigate('/register')} />
    </LoginScreen>
  );
}
