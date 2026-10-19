import { screen } from '@testing-library/react';
import { expectNoA11yViolations } from '@/test/a11y';
import { renderWithRouter } from '@/test/renderWithRouter';
import { NotFoundScreen } from './NotFoundScreen';

describe('NotFoundScreen · rutas desconocidas', () => {
  it('REG: muestra un encabezado claro y un enlace de regreso al login', () => {
    renderWithRouter(<NotFoundScreen />, { route: '/nada' });
    expect(screen.getByRole('heading', { level: 1, name: 'Página no encontrada' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Ir a iniciar sesión' })).toHaveAttribute(
      'href',
      '/login',
    );
  });

  it('REG: no se confunde con el formulario de registro', () => {
    renderWithRouter(<NotFoundScreen />, { route: '/nada' });
    expect(screen.queryByRole('heading', { name: 'Crea tu cuenta' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('REG FR-012: está dentro de un main y no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithRouter(<NotFoundScreen />, { route: '/nada' });
    expect(screen.getByRole('main')).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
