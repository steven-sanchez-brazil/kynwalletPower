import { useEffect, useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { Register } from '@/application/register';
import { MESSAGES } from '@/domain/messages';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { RegisterForm } from '@/ui/features/register/RegisterForm';
import { AuthLayout } from '@/ui/layout/AuthLayout/AuthLayout';
import { navigate, ROUTES, usePathname } from '@/ui/routing/router';

type AppProps = {
  authenticate: Authenticate;
  register: Register;
};

const TITLES = {
  login: 'KynWallet · Iniciar sesión',
  register: 'KynWallet · Crear cuenta',
};

export function App({ authenticate, register }: AppProps) {
  const pathname = usePathname();
  const isRegister = pathname === ROUTES.register;
  const isKnownRoute = isRegister || pathname === ROUTES.login;
  const [justRegistered, setJustRegistered] = useState(false);

  // research.md R2: el aviso de éxito solo vive hasta que se vuelve a /registro.
  if (isRegister && justRegistered) setJustRegistered(false);

  // FR-016: la raíz y las rutas desconocidas llevan a /login sin agregar historial.
  useEffect(() => {
    if (!isKnownRoute) navigate(ROUTES.login, { replace: true });
  }, [isKnownRoute]);

  useEffect(() => {
    document.title = isRegister ? TITLES.register : TITLES.login;
  }, [isRegister]);

  if (isRegister) {
    const handleRegistered = () => {
      setJustRegistered(true);
      navigate(ROUTES.login);
    };
    return (
      <AuthLayout
        brandTitle={
          <>
            Comienza tu
            <br />
            camino financiero.
          </>
        }
        brandSubtitle="Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar."
      >
        <RegisterForm register={register} onRegistered={handleRegistered} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      brandTitle={
        <>
          Tu dinero,
          <br />
          sin fronteras.
        </>
      }
      brandSubtitle="Envía, recibe y paga en segundos. Una billetera pensada para tu día a día."
    >
      <LoginForm
        authenticate={authenticate}
        notice={justRegistered ? MESSAGES.REGISTER_SUCCESS : undefined}
      />
    </AuthLayout>
  );
}
