import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { navigationStub } from '@/test/navigationStub';
import { createAuthStub } from '@/test/authStub';
import { fillRegistration } from '@/test/registrationForm';
import { controlledPromise } from '@/test/registrationStub';
import type { RegistrationResult } from '@/application/register';

describe('002/US4 · enlaces y reentrada', () => {
  it('AC-402/403 login → registro → login sin éxito, vuelve vacío', async () => {
    const navigation = navigationStub();
    render(
      <App
        authenticate={createAuthStub().authenticate}
        register={vi.fn()}
        navigation={navigation}
      />,
    );
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Correo electrónico'), 'privado@example.com');
    await user.click(screen.getByRole('link', { name: 'Regístrate' }));
    expect(navigation.getPath()).toBe('/register');
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('');
    await fillRegistration(user);
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(navigation.getPath()).toBe('/login');
    expect(screen.queryByText(/Registro de demostración/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Regístrate' }));
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
  it('click modificado y botón secundario mantienen comportamiento nativo', () => {
    const navigation = navigationStub();
    render(
      <App
        authenticate={createAuthStub().authenticate}
        register={vi.fn()}
        navigation={navigation}
      />,
    );
    const link = screen.getByRole('link', { name: 'Regístrate' });
    expect(link).toHaveAttribute('href', '/register');
    for (const options of [
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { altKey: true },
      { button: 1 },
    ]) {
      fireEvent.click(link, options);
      expect(navigation.getPath()).toBe('/login');
    }
  });
  it('salir durante envío cancela y no navega cuando resuelve', async () => {
    const navigation = navigationStub('/register');
    const pending = controlledPromise<RegistrationResult>();
    const register = vi.fn<
      (
        ...args: Parameters<import('@/application/register').Register>
      ) => Promise<RegistrationResult>
    >(() => pending.promise);
    render(
      <App
        authenticate={createAuthStub().authenticate}
        register={register}
        navigation={navigation}
      />,
    );
    const user = userEvent.setup();
    await fillRegistration(user);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(register.mock.calls[0]?.[1].aborted).toBe(true);
    await act(async () => pending.resolve({ kind: 'success' }));
    expect(navigation.getPath()).toBe('/login');
    expect(screen.queryByText(/Registro de demostración completado/)).not.toBeInTheDocument();
    await act(async () => navigation.navigate('/register'));
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
  });
});
