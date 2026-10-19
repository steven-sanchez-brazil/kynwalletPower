import type { Authenticate } from '@/application/authenticate';
import { AuthLayout } from '@/ui/layout/AuthLayout/AuthLayout';
import { LoginForm } from './LoginForm';

type LoginPageProps = {
  authenticate: Authenticate;
  initialNotice?: string;
};

/** Pantalla de login (Figma, frame `01 · Login`). */
export function LoginPage({ authenticate, initialNotice }: LoginPageProps) {
  return (
    <AuthLayout
      pageTitle="KynWallet · Iniciar sesión"
      brandTitle={
        <>
          Tu dinero,
          <br />
          sin fronteras.
        </>
      }
      brandSubtitle="Envía, recibe y paga en segundos. Una billetera pensada para tu día a día."
    >
      <LoginForm authenticate={authenticate} initialNotice={initialNotice} />
    </AuthLayout>
  );
}
