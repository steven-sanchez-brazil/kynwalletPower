import { useCallback, useState } from 'react';
import type { Authenticate } from '@/application/authenticate';
import type { Register } from '@/application/register';
import { MESSAGES } from '@/domain/messages';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { RegisterForm } from '@/ui/features/register/RegisterForm';
import { AuthScreen } from '@/ui/layout/AuthScreen/AuthScreen';
import { ROUTES } from '@/ui/routing/routes';
import { useRoute } from '@/ui/routing/useRoute';

type AppProps = {
  authenticate: Authenticate;
  register: Register;
};

const REGISTER_TITLE = ['Comienza tu', 'camino financiero.'] as const;
const REGISTER_SUBTITLE =
  'Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar.';

export function App({ authenticate, register }: AppProps) {
  const { route, navigate } = useRoute();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previousRoute, setPreviousRoute] = useState(route);

  // FR-013: el mensaje de éxito se descarta al salir del login por cualquier vía.
  if (route !== previousRoute) {
    setPreviousRoute(route);
    if (route !== ROUTES.login) setSuccessMessage(null);
  }

  const handleRegistered = useCallback(
    (name: string) => {
      setSuccessMessage(MESSAGES.REGISTER_SUCCESS(name));
      navigate(ROUTES.login);
    },
    [navigate],
  );
  const dismissSuccess = useCallback(() => setSuccessMessage(null), []);
  const goToLogin = useCallback(() => navigate(ROUTES.login), [navigate]);
  const goToRegister = useCallback(() => navigate(ROUTES.register), [navigate]);

  if (route === ROUTES.register) {
    return (
      <AuthScreen tone="register" title={REGISTER_TITLE} subtitle={REGISTER_SUBTITLE}>
        <RegisterForm register={register} onRegistered={handleRegistered} onLogin={goToLogin} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <LoginForm
        authenticate={authenticate}
        onRegister={goToRegister}
        successMessage={successMessage ?? undefined}
        onDismissSuccess={dismissSuccess}
      />
    </AuthScreen>
  );
}
