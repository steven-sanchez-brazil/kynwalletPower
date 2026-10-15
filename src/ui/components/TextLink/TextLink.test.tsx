import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { expectNoA11yViolations } from '@/test/a11y';
import { TextLink } from './TextLink';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/origen" element={<TextLink to="/destino">Ir</TextLink>} />
        <Route path="/destino" element={<p>Llegaste</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('TextLink (research R10)', () => {
  it('es un enlace con el nombre y el destino indicados', () => {
    renderAt('/origen');
    expect(screen.getByRole('link', { name: 'Ir' })).toHaveAttribute('href', '/destino');
  });

  it('navega sin recargar la página, también con el teclado', async () => {
    const user = userEvent.setup();
    renderAt('/origen');
    await user.tab();
    expect(screen.getByRole('link', { name: 'Ir' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Llegaste')).toBeInTheDocument();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderAt('/origen');
    await expectNoA11yViolations(container);
  });
});
