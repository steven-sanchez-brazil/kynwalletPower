import { WALLET_FIXTURE } from '@/test/walletFixture';
import { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAuthStub } from '@/test/authStub';
import { createRegistrationStub, REGISTRATION_FIXTURE as fixture } from '@/test/registrationStub';
import { App } from './App';
import { createRegister } from '@/application/register';
import { SimulatedRegistrationGateway } from '@/infrastructure/SimulatedRegistrationGateway';

function setup(path = '/registro', stub = createRegistrationStub()) {
  history.replaceState(null, '', path);
  const view = render(
    <StrictMode>
      <App
        wallet={WALLET_FIXTURE}
        authenticate={createAuthStub().authenticate}
        register={stub.register}
      />
    </StrictMode>,
  );
  return { ...view, stub, user: userEvent.setup() };
}
function submit() {
  for (const [label, value] of [
    ['Nombre completo', fixture.fullName],
    ['Correo electrónico', fixture.email],
    ['Contraseña', fixture.password],
    ['Confirmar contraseña', fixture.password],
  ] as const) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
}
function pop(path: string) {
  history.replaceState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
afterEach(() => history.replaceState(null, '', '/'));

describe('Registro App US1/US3 FR-011/013/022', () => {
  it('FR-010: el spinner del envío simulado permanece al menos 1000 ms antes de navegar', async () => {
    vi.useFakeTimers();
    try {
      history.replaceState(null, '', '/registro');
      render(
        <App
          wallet={WALLET_FIXTURE}
          authenticate={createAuthStub().authenticate}
          register={createRegister(new SimulatedRegistrationGateway())}
        />,
      );
      submit();
      expect(screen.getByTitle('Cargando').closest('svg')).toBeVisible();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(999);
      });
      expect(location.pathname).toBe('/registro');
      expect(screen.getByTitle('Cargando').closest('svg')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Creando cuenta…' })).toBeDisabled();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(location.pathname).toBe('/login');
      expect(screen.queryByTitle('Cargando')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
  it('US1-3: éxito dirige a login vacío con aviso solo en memoria', async () => {
    const storage = vi.spyOn(Storage.prototype, 'setItem');
    setup();
    submit();
    expect(await screen.findByRole('heading', { name: 'Bienvenido de nuevo' })).toBeVisible();
    expect(location.pathname).toBe('/login');
    expect(location.search + location.hash).toBe('');
    expect(history.state).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Registro de demostración completado. Para iniciar sesión, usa una cuenta de prueba configurada.',
    );
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
    expect(storage).not.toHaveBeenCalled();
    storage.mockRestore();
  });
  it.each(['/', '/login'])('US3-3: %s conserva login y enlace real a registro', async (path) => {
    const { user } = setup(path);
    const link = screen.getByRole('link', { name: 'Regístrate' });
    expect(link).toHaveAttribute('href', '/registro');
    await user.click(link);
    expect(location.pathname).toBe('/registro');
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(location.pathname).toBe('/login');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('US3-2: popstate limpia aviso y remonta registro vacío', async () => {
    setup();
    submit();
    await screen.findByRole('status');
    act(() => pop('/registro'));
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
    act(() => pop('/login'));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('FR-022: recargar/remontar login no recupera aviso', async () => {
    const { unmount } = setup();
    submit();
    await screen.findByRole('status');
    unmount();
    setup('/login');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('US1-5: abandonar mientras espera descarta éxito tardío', async () => {
    const stub = createRegistrationStub();
    stub.defer();
    const { user } = setup('/registro', stub);
    submit();
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    await act(async () => stub.release());
    expect(location.pathname).toBe('/login');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('FR-022: navegación y resolución en la misma tanda no redirigen con aviso', async () => {
    const stub = createRegistrationStub();
    stub.defer();
    setup('/registro', stub);
    submit();
    await act(async () => {
      pop('/login');
      stub.release();
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('FR-022: resultado de instancia anterior no altera una nueva', async () => {
    const stub = createRegistrationStub();
    stub.defer();
    setup('/registro', stub);
    submit();
    act(() => {
      pop('/login');
      pop('/registro');
    });
    await act(async () => stub.release());
    expect(location.pathname).toBe('/registro');
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('FR-022: restauración de página elimina secretos y resultados pendientes', async () => {
    const stub = createRegistrationStub();
    stub.defer();
    setup('/registro', stub);
    submit();
    await act(async () => {
      window.dispatchEvent(new Event('pagehide'));
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
      stub.release();
    });
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
