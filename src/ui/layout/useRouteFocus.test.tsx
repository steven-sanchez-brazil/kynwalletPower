import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, useLocation } from 'react-router';
import { useRouteFocus } from './useRouteFocus';

function Page() {
  useRouteFocus();
  const { pathname } = useLocation();
  return (
    <main>
      <h1>Vista {pathname}</h1>
      <Link to="/otra">Ir a otra</Link>
    </main>
  );
}

describe('useRouteFocus', () => {
  it('REG FR-012: no roba el foco en la carga inicial', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Page />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1 })).not.toHaveFocus();
  });

  it('REG US3-4 / FR-012: tras un cambio de ruta enfoca el encabezado de la vista nueva', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Page />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('link', { name: 'Ir a otra' }));
    const heading = screen.getByRole('heading', { level: 1, name: 'Vista /otra' });
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(heading).toHaveFocus();
  });
});
