import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link } from './Link';

describe('Link (FR-016)', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renderiza un enlace real con href', () => {
    render(<Link to="/login">Inicia sesión</Link>);
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toHaveAttribute('href', '/login');
  });

  it('un clic simple navega sin recargar la página', async () => {
    const listener = vi.fn();
    window.addEventListener('popstate', listener);
    render(<Link to="/login">Inicia sesión</Link>);
    await userEvent.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(window.location.pathname).toBe('/login');
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener('popstate', listener);
  });

  it('con Ctrl/Meta no intercepta el clic (abrir en otra pestaña)', async () => {
    const user = userEvent.setup();
    render(<Link to="/login">Inicia sesión</Link>);
    await user.keyboard('{Meta>}');
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    await user.keyboard('{/Meta}');
    expect(window.location.pathname).toBe('/');
  });
});
