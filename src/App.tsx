import { Navigate, Route, Routes } from 'react-router';
import type { Authenticate } from '@/application/authenticate';
import type { Register } from '@/application/register';
import { LoginPage } from '@/ui/pages/LoginPage';
import { RegisterPage } from '@/ui/pages/RegisterPage';
import { ROUTES } from '@/ui/routes';

type AppProps = {
  authenticate: Authenticate;
  register: Register;
};

/** Rutas de la aplicación (002 FR-023, research.md R10). El router lo aporta quien la monta. */
export function App({ authenticate, register }: AppProps) {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<LoginPage authenticate={authenticate} />} />
      <Route path={ROUTES.register} element={<RegisterPage register={register} />} />
      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}
