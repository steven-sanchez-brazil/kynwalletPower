import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { RouteLink } from './RouteLink';

describe('RouteLink', () => {
  it('es un enlace real con href', () => {
    render(<RouteLink to="/registro">Regístrate</RouteLink>);
    expect(screen.getByRole('link', { name: 'Regístrate' })).toHaveAttribute('href', '/registro');
  });

  it('FR-016: el clic navega sin recargar la página', async () => {
    render(<RouteLink to="/registro">Regístrate</RouteLink>);
    await userEvent.click(screen.getByRole('link', { name: 'Regístrate' }));
    expect(window.location.pathname).toBe('/registro');
  });

  it('el clic con Ctrl no se intercepta (abrir en otra pestaña)', () => {
    render(<RouteLink to="/registro">Regístrate</RouteLink>);
    let preventedByLink: boolean | undefined;
    // Se observa el evento al final de la propagación y se cancela para que jsdom no navegue.
    const observe = (event: Event) => {
      preventedByLink = event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener('click', observe);
    fireEvent.click(screen.getByRole('link', { name: 'Regístrate' }), { ctrlKey: true });
    document.removeEventListener('click', observe);

    expect(preventedByLink).toBe(false);
    expect(window.location.pathname).toBe('/');
  });

  it('FR-021: no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<RouteLink to="/login">Inicia sesión</RouteLink>);
    await expectNoA11yViolations(container);
  });
});
