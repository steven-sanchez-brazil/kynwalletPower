import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAuthStub } from '@/test/authStub';
import { App } from './App';

describe('App · navegación registro', () => {
  beforeEach(() => window.history.replaceState(null, '', '/login'));
  afterEach(() => window.history.replaceState(null, '', '/'));

  it('el enlace de login abre /registro; registro válido vuelve a /login con éxito', async () => {
    const user = userEvent.setup();
    render(<App authenticate={createAuthStub().authenticate} />);
    await user.click(screen.getByRole('button', { name: 'Regístrate' }));
    expect(window.location.pathname).toBe('/registro');
    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez');
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com');
    await user.type(screen.getByLabelText('Contraseña', { exact: true }), 'secreto123');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'secreto123');
    await user.click(screen.getByRole('checkbox', { name: /Acepto los términos/ }));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('status')).toHaveTextContent(/Registro exitoso.*demostración/i);
  });

  it('permite entrar directamente a /registro y navegar al login', async () => {
    window.history.replaceState(null, '', '/registro');
    const user = userEvent.setup();
    render(<App authenticate={createAuthStub().authenticate} />);
    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
  });
});
