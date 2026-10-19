import type { Authenticate } from '@/application/authenticate';
import type { RegisterAccount } from '@/application/registerAccount';
import { MESSAGES } from '@/domain/messages';
import { LoginPage } from '@/ui/features/login/LoginPage';
import { RegisterPage } from '@/ui/features/register/RegisterPage';
import { navigate, ROUTES, useRoute } from '@/ui/routing/router';

type AppProps = {
  authenticate: Authenticate;
  registerAccount: RegisterAccount;
};

type LoginRouteState = { registered?: boolean } | null;

/** FR-013: tras el registro se vuelve al login con el aviso en el historial, no en la URL. */
const goToLoginAfterRegistration = () => navigate(ROUTES.login, { registered: true });

export function App({ authenticate, registerAccount }: AppProps) {
  const { path, state } = useRoute();

  if (path === ROUTES.register) {
    return (
      <RegisterPage registerAccount={registerAccount} onRegistered={goToLoginAfterRegistration} />
    );
  }

  const registered = (state as LoginRouteState)?.registered === true;
  return (
    <LoginPage
      authenticate={authenticate}
      initialNotice={registered ? MESSAGES.REGISTRATION_SUCCESS : undefined}
    />
  );
}
