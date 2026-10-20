import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { navigationStub } from '@/test/navigationStub';
import { createAuthStub } from '@/test/authStub';
import { fillRegistration } from '@/test/registrationForm';
import { createRegister } from '@/application/register';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { createAuthenticate } from '@/application/authenticate';
import { registrationValues as valid } from '@/test/registrationStub';

describe('002/US1 · integración', () => {
  it('AC-103/104 /register → éxito /login y reentrada vacía', async () => {
    const navigation = navigationStub('/register');
    const register = vi.fn().mockResolvedValue({ kind: 'success' });
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
    expect(navigation.getPath()).toBe('/login');
    expect(screen.getByRole('status')).toHaveTextContent('Registro de demostración completado.');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toHaveFocus();
    await act(async () => navigation.navigate('/register'));
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    await act(async () => navigation.navigate('/login'));
    expect(screen.queryByText(/Registro de demostración completado/)).not.toBeInTheDocument();
  });
  it('AC-105/EC-013 autenticación invariable', async () => {
    const account = { email: valid.email, password: valid.password, displayName: valid.fullName };
    const authenticate = createAuthenticate(new InMemoryAuthGateway([account], { delayMs: 0 }));
    const register = createRegister({ complete: async () => {} }, { record: vi.fn() });
    const unknown = { ...valid, email: 'otro@example.com' };
    const before = await Promise.all([authenticate(valid), authenticate(unknown)]);
    await register(valid, new AbortController().signal);
    await register(unknown, new AbortController().signal);
    expect(await Promise.all([authenticate(valid), authenticate(unknown)])).toEqual(before);
    expect(before.map((result) => result.kind)).toEqual(['success', 'invalid-credentials']);
  });
});
