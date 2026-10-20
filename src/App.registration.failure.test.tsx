import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { navigationStub } from '@/test/navigationStub';
import { createAuthStub } from '@/test/authStub';
import { fillRegistration } from '@/test/registrationForm';
describe('002/AC-207 · fallo y recuperación', () => {
  it.each(['result', 'throw'])('fallo %s conserva y reintenta', async (mode) => {
    const register = vi.fn();
    if (mode === 'result') register.mockResolvedValueOnce({ kind: 'unavailable' });
    else register.mockRejectedValueOnce(new Error('private internal details'));
    register.mockResolvedValueOnce({ kind: 'success' });
    const navigation = navigationStub('/register');
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
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo completar el registro. Inténtalo de nuevo.',
    );
    expect(document.body.textContent).not.toContain('private internal');
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Persona');
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(navigation.getPath()).toBe('/register');
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(navigation.getPath()).toBe('/login');
  });
});
