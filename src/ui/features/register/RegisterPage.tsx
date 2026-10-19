import type { RegisterAccount } from '@/application/registerAccount';
import { AuthLayout } from '@/ui/layout/AuthLayout/AuthLayout';
import { RegisterForm } from './RegisterForm';

type RegisterPageProps = {
  registerAccount: RegisterAccount;
  onRegistered: () => void;
};

/** Pantalla de registro (Figma, frame `04 · Registro`, nodo 31:2). */
export function RegisterPage({ registerAccount, onRegistered }: RegisterPageProps) {
  return (
    <AuthLayout
      pageTitle="KynWallet · Crear cuenta"
      brandTitle={
        <>
          Comienza tu
          <br />
          camino financiero.
        </>
      }
      brandSubtitle="Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar."
    >
      <RegisterForm registerAccount={registerAccount} onRegistered={onRegistered} />
    </AuthLayout>
  );
}
