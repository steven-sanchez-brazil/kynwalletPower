import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { expectNoA11yViolations } from '@/test/a11y';
import { TextLink } from './TextLink';

function renderLink() {
  return render(
    <MemoryRouter initialEntries={['/origen']}>
      <Routes>
        <Route path="/origen" element={<TextLink to="/destino">Ir al destino</TextLink>} />
        <Route path="/destino" element={<h1>Vista destino</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('TextLink', () => {
  it('REG FR-010: es un enlace con el destino esperado', () => {
    renderLink();
    expect(screen.getByRole('link', { name: 'Ir al destino' })).toHaveAttribute('href', '/destino');
  });

  it('REG FR-010: al activarlo navega en el cliente, sin recargar el documento', async () => {
    const user = userEvent.setup();
    const { container } = renderLink();
    const marker = container.ownerDocument.body;
    await user.click(screen.getByRole('link', { name: 'Ir al destino' }));
    expect(screen.getByRole('heading', { name: 'Vista destino' })).toBeInTheDocument();
    expect(container.ownerDocument.body).toBe(marker);
  });

  it('REG FR-012: se activa con el teclado', async () => {
    const user = userEvent.setup();
    renderLink();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Ir al destino' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('heading', { name: 'Vista destino' })).toBeInTheDocument();
  });

  it('REG FR-012: no tiene violaciones de accesibilidad', async () => {
    const { container } = renderLink();
    await expectNoA11yViolations(container);
  });
});
