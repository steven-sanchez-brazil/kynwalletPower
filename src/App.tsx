import { useEffect, useRef, useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { Register } from '@/application/register';
import { MESSAGES } from '@/domain/messages';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { LoginScreen } from '@/ui/features/login/LoginScreen';
import { RegistrationForm } from '@/ui/features/registration/RegistrationForm';
import { RegistrationScreen } from '@/ui/features/registration/RegistrationScreen';
import { Alert } from '@/ui/components/Alert/Alert';

type AppProps = { authenticate: Authenticate; register?: Register };
const unavailable: Register = async () => ({ kind: 'unavailable' });
const route = () => (window.location.pathname === '/register' ? '/register' : '/login');
export function App({ authenticate, register = unavailable }: AppProps) {
  const [path, setPath] = useState(route);
  const [notice, setNotice] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => {
      if (!['/', '/login', '/register'].includes(window.location.pathname))
        window.history.replaceState(null, '', '/login');
      setPath(route());
      setNotice(false);
    };
    if (!['/', '/login', '/register'].includes(window.location.pathname))
      window.history.replaceState(null, '', '/login');
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  useEffect(() => {
    if (notice) noticeRef.current?.focus();
  }, [notice]);
  const navigate = (destination: '/register' | '/login', success = false) => {
    window.history.pushState(null, '', destination);
    setPath(destination);
    setNotice(success);
  };
  if (path === '/register')
    return (
      <RegistrationScreen>
        <RegistrationForm
          register={register}
          onSuccess={() => navigate('/login', true)}
          onLogin={() => navigate('/login')}
        />
      </RegistrationScreen>
    );
  return (
    <LoginScreen>
      {notice && (
        <div ref={noticeRef} tabIndex={-1}>
          <Alert tone="info">{MESSAGES.REGISTRATION_SUCCESS}</Alert>
        </div>
      )}
      <LoginForm authenticate={authenticate} onRegister={() => navigate('/register')} />
    </LoginScreen>
  );
}
