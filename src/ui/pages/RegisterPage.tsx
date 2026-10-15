import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { Register } from '@/application/register';
import { RegisterForm } from '@/ui/features/register/RegisterForm';
import { AuthLayout } from '@/ui/layout/AuthLayout/AuthLayout';
import { ROUTES, type LoginRouteState } from '@/ui/routes';
import { useDocumentTitle } from './useDocumentTitle';

type RegisterPageProps = {
  register: Register;
};

/** Ruta /registro (002 FR-023). */
export function RegisterPage({ register }: RegisterPageProps) {
  useDocumentTitle('KynWallet · Crear cuenta');
  const navigate = useNavigate();

  // FR-011/FR-012: solo viaja un indicador, nunca datos del formulario.
  const goToLogin = useCallback(() => {
    const state: LoginRouteState = { registered: true };
    void navigate(ROUTES.login, { state });
  }, [navigate]);

  return (
    <AuthLayout variant="register">
      <RegisterForm register={register} onRegistered={goToLogin} />
    </AuthLayout>
  );
}
