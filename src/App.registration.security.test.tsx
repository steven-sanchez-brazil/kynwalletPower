import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { navigationStub } from '@/test/navigationStub';
import { createAuthStub } from '@/test/authStub';
import { fillRegistration } from '@/test/registrationForm';
import { createRegister } from '@/application/register';
import { InMemoryRegistrationDiagnostics } from '@/infrastructure/InMemoryRegistrationDiagnostics';

describe('002/FR-017/SC-007 · no exfiltración ni persistencia', () => {
  it('flujo real con adaptador sin I/O y diagnóstico saneado', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const xhr = vi.spyOn(XMLHttpRequest.prototype, 'open');
    const store = vi.spyOn(Storage.prototype, 'setItem');
    const diagnostics = new InMemoryRegistrationDiagnostics();
    const record = vi.spyOn(diagnostics, 'record');
    const navigation = navigationStub('/register');
    render(
      <App
        navigation={navigation}
        authenticate={createAuthStub().authenticate}
        register={createRegister({ complete: async () => {} }, diagnostics)}
      />,
    );
    const user = userEvent.setup();
    await fillRegistration(user);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByRole('status')).toHaveTextContent('Registro de demostración completado');
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhr).not.toHaveBeenCalled();
    expect(store).not.toHaveBeenCalled();
    const effects = JSON.stringify([
      record.mock.calls,
      diagnostics.snapshot,
      window.location.href,
      window.history.state,
    ]);
    expect(effects).not.toContain('persona@example.com');
    expect(effects).not.toContain('abcdefgh');
    expect(document.body.textContent).not.toContain('abcdefgh');
    await act(async () => navigation.navigate('/register'));
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
    vi.restoreAllMocks();
  });
});
