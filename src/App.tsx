import { useCallback, useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { Register } from '@/application/register';
import { MESSAGES } from '@/domain/messages';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { RegisterForm } from '@/ui/features/register/RegisterForm';
import { AuthLayout } from '@/ui/layout/AuthLayout/AuthLayout';
import { navigate, ROUTES, useRoute } from '@/ui/routing/router';

type AppProps = {
  authenticate: Authenticate;
  register: Register;
};

const REGISTER_BRAND = {
  title: (
    <>
      Comienza tu
      <br />
      camino financiero.
    </>
  ),
  subtitle:
    'Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar.',
};

export function App({ authenticate, register }: AppProps) {
  const route = useRoute();
  // Mensaje de cuenta creada para /login (research R8). No viaja en la URL ni se persiste.
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // El foco solo se mueve al navegar dentro de la app, no en la carga inicial (research R9).
  const [navigated, setNavigated] = useState(false);

  const goTo = useCallback((target: typeof route, message: string | null = null) => {
    setNavigated(true);
    setSuccessMessage(message);
    navigate(target);
  }, []);

  const goToLogin = useCallback(() => goTo(ROUTES.login), [goTo]);
  const goToRegister = useCallback(() => goTo(ROUTES.register), [goTo]);
  const onRegistered = useCallback(() => goTo(ROUTES.login, MESSAGES.REGISTER_SUCCESS), [goTo]);

  if (route === ROUTES.register) {
    return (
      <AuthLayout {...REGISTER_BRAND}>
        <RegisterForm
          register={register}
          onRegistered={onRegistered}
          onGoToLogin={goToLogin}
          focusOnMount={navigated}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <LoginForm
        authenticate={authenticate}
        onGoToRegister={goToRegister}
        successMessage={successMessage}
      />
    </AuthLayout>
  );
}
