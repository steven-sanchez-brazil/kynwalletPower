import { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { createAuthStub } from '@/test/authStub';
import { createRegistrationStub } from '@/test/registrationStub';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { WALLET_FIXTURE } from '@/test/walletFixture';

function setup(path = '/login', stub = createAuthStub()) {
  history.replaceState(null, '', path);
  return {
    ...render(
      <StrictMode>
        <App
          authenticate={stub.authenticate}
          register={createRegistrationStub().register}
          wallet={WALLET_FIXTURE}
        />
      </StrictMode>,
    ),
    stub,
  };
}
function submit() {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: TEST_ACCOUNT.email },
  });
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: TEST_ACCOUNT.password },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
}
function pop(path: string) {
  history.replaceState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
afterEach(() => history.replaceState(null, '', '/'));

describe('Inicio US1/US3 FR-001/006/007/009/010', () => {
  it('FR-001/009: login vigente abre Inicio y logout no persiste sesión', async () => {
    const storage = vi.spyOn(Storage.prototype, 'setItem');
    const push = vi.spyOn(history, 'pushState');
    const { stub } = setup();
    submit();
    await screen.findByRole('heading', { level: 1, name: /Inicio/ });
    expect(location.pathname).toBe('/inicio');
    expect(screen.getAllByText('Steven Luna').length).toBeGreaterThan(0);
    expect(screen.queryByLabelText('Contraseña')).not.toBeInTheDocument();
    expect(stub.authenticate).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith(null, '', '/inicio');
    expect(history.state).toBeNull();
    expect(location.search + location.hash).toBe('');
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(location.pathname).toBe('/login');
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
    act(() => pop('/inicio'));
    expect(location.pathname).toBe('/login');
    expect(screen.queryByText('$1,922.90')).not.toBeInTheDocument();
    expect(storage).not.toHaveBeenCalled();
    storage.mockRestore();
    push.mockRestore();
  });
  it('FR-007: entrada directa y remonte no recuperan sesión', async () => {
    const first = setup('/inicio');
    expect(location.pathname).toBe('/login');
    expect(screen.queryByText('$1,922.90')).not.toBeInTheDocument();
    submit();
    await screen.findByRole('heading', { level: 1, name: /Inicio/ });
    first.unmount();
    setup('/inicio');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
    expect(location.pathname).toBe('/login');
  });
  it.each(['popstate', 'pagehide', 'pageshow'])('FR-006: %s revoca la sesión', async (event) => {
    setup();
    submit();
    await screen.findByRole('heading', { level: 1, name: /Inicio/ });
    act(() => {
      const transition = new Event(event);
      if (event === 'pageshow') Object.defineProperty(transition, 'persisted', { value: true });
      window.dispatchEvent(transition);
    });
    expect(location.pathname).toBe('/login');
    expect(screen.queryByText('$1,922.90')).not.toBeInTheDocument();
  });
  it('FR-007: abandonar y resolver en la misma tanda no abre Inicio', async () => {
    const stub = createAuthStub();
    stub.defer();
    setup('/login', stub);
    submit();
    await act(async () => {
      pop('/registro');
      stub.release();
    });
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(location.pathname).toBe('/registro');
    expect(screen.queryByText('$1,922.90')).not.toBeInTheDocument();
  });
  it('FR-007: volver a otro login no acepta éxito de la instancia anterior', async () => {
    const stub = createAuthStub();
    stub.defer();
    setup('/login', stub);
    submit();
    act(() => {
      pop('/registro');
      pop('/login');
    });
    await act(async () => stub.release());
    expect(location.pathname).toBe('/login');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
  });
  it('FR-010: credenciales inválidas no muestran datos', async () => {
    setup('/login', createAuthStub({ kind: 'invalid-credentials' }));
    submit();
    await screen.findByRole('alert');
    expect(location.pathname).toBe('/login');
    expect(screen.queryByText('$1,922.90')).not.toBeInTheDocument();
  });
});
