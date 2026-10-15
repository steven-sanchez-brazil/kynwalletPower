import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { Authenticate } from '@/application/authenticate';
import { MESSAGES } from '@/domain/messages';
import { Toast } from '@/ui/components/Toast/Toast';
import { LoginForm } from '@/ui/features/login/LoginForm';
import { AuthLayout } from '@/ui/layout/AuthLayout/AuthLayout';
import type { LoginRouteState } from '@/ui/routes';
import { useDocumentTitle } from './useDocumentTitle';

type LoginPageProps = {
  authenticate: Authenticate;
};

function cameFromRegistration(state: unknown): boolean {
  return (state as Partial<LoginRouteState> | null)?.registered === true;
}

/** Ruta /login (001 FR-021). */
export function LoginPage({ authenticate }: LoginPageProps) {
  useDocumentTitle('KynWallet · Iniciar sesión');
  const location = useLocation();
  const navigate = useNavigate();
  // El aviso de registro se lee una sola vez (002 FR-012).
  const [registered] = useState(() => cameFromRegistration(location.state));
  const [toastOpen, setToastOpen] = useState(registered);
  const closeToast = useCallback(() => setToastOpen(false), []);

  // Se borra el estado del historial para que el aviso no reaparezca al recargar (002 US1-5).
  useEffect(() => {
    if (registered) void navigate(location.pathname, { replace: true, state: null });
  }, [registered, navigate, location.pathname]);

  return (
    <>
      <AuthLayout>
        <LoginForm authenticate={authenticate} />
      </AuthLayout>
      <Toast message={toastOpen ? MESSAGES.REGISTRATION_SUCCESS : null} onClose={closeToast} />
    </>
  );
}
