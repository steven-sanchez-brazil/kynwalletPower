import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { navigateTo } from '@/ui/navigation';
import { NavigationLink } from './NavigationLink';

describe('NavigationLink · REG-FR-001, 014: navegación en la misma instancia', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
    vi.restoreAllMocks();
  });

  it('conserva href real y notifica la navegación sin recargar', async () => {
    const listener = vi.fn();
    window.addEventListener('popstate', listener);
    render(<NavigationLink href="/register">Regístrate</NavigationLink>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/register');
    await userEvent.click(screen.getByRole('link'));
    expect(window.location.pathname).toBe('/register');
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener('popstate', listener);
  });

  it.each([
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ])('respeta el comportamiento del navegador con %o', (options) => {
    const push = vi.spyOn(window.history, 'pushState');
    render(<NavigationLink href="/login">Inicia sesión</NavigationLink>);
    fireEvent.click(screen.getByRole('link'), options);
    expect(push).not.toHaveBeenCalled();
  });

  it('no intercepta un evento cancelado por el consumidor', () => {
    const push = vi.spyOn(window.history, 'pushState');
    render(
      <NavigationLink href="/login" onClick={(event) => event.preventDefault()}>
        Inicia sesión
      </NavigationLink>,
    );
    fireEvent.click(screen.getByRole('link'));
    expect(push).not.toHaveBeenCalled();
  });

  it('REG-FR-012, 019: el éxito viaja como evento transitorio sin datos en historial o URL', () => {
    const listener = vi.fn();
    window.addEventListener('popstate', listener);
    navigateTo('/login', { registrationSuccess: true });
    expect(window.location.pathname).toBe('/login');
    expect(window.location.search).toBe('');
    expect(window.history.state).toBeNull();
    expect(listener.mock.calls[0]?.[0].state).toEqual({ registrationSuccess: true });
    window.removeEventListener('popstate', listener);
  });
});
