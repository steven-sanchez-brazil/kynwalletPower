import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { createAuthStub } from '@/test/authStub';
import { createRegistrationStub, REGISTRATION_VALUES } from '@/test/registrationStub';

beforeEach(() => window.history.replaceState(null, '', '/register'));
afterEach(() => window.history.replaceState(null, '', '/'));
it('REG-US1-2/4/5 éxito efímero, login no adquiere cuenta', async () => {
  const stub = createRegistrationStub();
  const auth = createAuthStub();
  const { unmount } = render(<App authenticate={auth.authenticate} register={stub.register} />);
  for (const [label, value] of [
    ['Nombre completo', REGISTRATION_VALUES.fullName],
    ['Correo electrónico', REGISTRATION_VALUES.email],
    ['Contraseña', REGISTRATION_VALUES.password],
    ['Confirmar contraseña', REGISTRATION_VALUES.confirmPassword],
  ] as const)
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole('checkbox'));
  await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  expect(window.location.pathname).toBe('/login');
  expect(screen.getByRole('status')).toHaveTextContent(
    'Registro de demostración exitoso. Puedes iniciar sesión con una cuenta de demostración',
  );
  expect(screen.getByLabelText('Correo electrónico')).toHaveValue('');
  expect(window.history.state).toBeNull();
  expect(auth.authenticate).not.toHaveBeenCalled();
  unmount();
  render(<App authenticate={auth.authenticate} register={stub.register} />);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
it('REG-US3-1/4 navegación por enlaces conectados y popstate sin restaurar datos', async () => {
  window.history.replaceState(null, '', '/login');
  render(
    <App
      authenticate={createAuthStub().authenticate}
      register={createRegistrationStub().register}
    />,
  );
  await userEvent.click(screen.getByRole('link', { name: 'Regístrate' }));
  expect(window.location.pathname).toBe('/register');
  await userEvent.type(screen.getByLabelText('Nombre completo'), 'Diego');
  await userEvent.click(screen.getByRole('link', { name: 'Inicia sesión' }));
  expect(window.location.pathname).toBe('/login');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  act(() => {
    window.history.replaceState(null, '', '/register');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
});
it('REG-US1 ruta desconocida normaliza a login', () => {
  window.history.replaceState(null, '', '/missing');
  render(
    <App
      authenticate={createAuthStub().authenticate}
      register={createRegistrationStub().register}
    />,
  );
  expect(window.location.pathname).toBe('/login');
  expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeVisible();
});

it('REG-US1 registro sin dependencia configurada informa indisponibilidad', async () => {
  render(<App authenticate={createAuthStub().authenticate} />);
  for (const [label, value] of [
    ['Nombre completo', REGISTRATION_VALUES.fullName],
    ['Correo electrónico', REGISTRATION_VALUES.email],
    ['Contraseña', REGISTRATION_VALUES.password],
    ['Confirmar contraseña', REGISTRATION_VALUES.confirmPassword],
  ] as const)
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole('checkbox'));
  await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  expect(screen.getByRole('alert')).toHaveTextContent('No se pudo completar la demostración');
  expect(window.location.pathname).toBe('/register');
});

it('REG-US1 historial con ruta desconocida normaliza también al navegar atrás/adelante', () => {
  render(
    <App
      authenticate={createAuthStub().authenticate}
      register={createRegistrationStub().register}
    />,
  );
  act(() => {
    window.history.replaceState(null, '', '/unknown-history');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  expect(window.location.pathname).toBe('/login');
});
