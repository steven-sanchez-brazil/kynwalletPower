import { useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import type { Authenticate } from '@/application/authenticate';
import type { RegisterAccount } from '@/application/registerAccount';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { RegistrationScreen } from '@/ui/features/registration/RegistrationScreen';
import { NotFoundScreen } from '@/ui/features/notFound/NotFoundScreen';
import { AuthScreen } from '@/ui/layout/AuthScreen/AuthScreen';
import { useDocumentTitle } from '@/ui/layout/useDocumentTitle';
import { useRouteFocus } from '@/ui/layout/useRouteFocus';

type AppProps = {
  authenticate: Authenticate;
  registerAccount: RegisterAccount;
};

const isLoginPath = (pathname: string) => pathname === '/' || pathname === '/login';

function titleFor(pathname: string) {
  if (isLoginPath(pathname)) return 'KynWallet · Iniciar sesión';
  if (pathname === '/registro') return 'KynWallet · Crear cuenta';
  return 'KynWallet · Página no encontrada';
}

export function App({ authenticate, registerAccount }: AppProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useRouteFocus();
  useDocumentTitle(titleFor(pathname));

  // El aviso vive en memoria, no en `location.state`: el navegador conserva `history.state` al
  // recargar y el mensaje reaparecería (research.md R3). Se descarta al salir del login.
  const [registrationNotice, setRegistrationNotice] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (!isLoginPath(pathname)) setRegistrationNotice(false);
  }

  const login = (
    <AuthScreen>
      <LoginForm
        authenticate={authenticate}
        registrationNotice={registrationNotice}
        onRegistrationNoticeDismiss={() => setRegistrationNotice(false)}
      />
    </AuthScreen>
  );

  const handleRegistered = () => {
    setRegistrationNotice(true);
    void navigate('/login');
  };

  return (
    <Routes>
      <Route path="/" element={login} />
      <Route path="/login" element={login} />
      <Route
        path="/registro"
        element={
          <RegistrationScreen registerAccount={registerAccount} onRegistered={handleRegistered} />
        }
      />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}
