import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { WALLET_FIXTURE } from '@/test/walletFixture';
import { WalletHome } from './WalletHome';

function setup(name = 'Persona Demo') {
  const onLogout = vi.fn();
  return {
    ...render(<WalletHome name={name} wallet={WALLET_FIXTURE} onLogout={onLogout} />),
    onLogout,
  };
}

describe('Inicio US1/US2 FR-002/003/004/005/008', () => {
  it('presenta nombre, saldo, movimientos, tarjeta y resumen accesibles', async () => {
    const { container } = setup();
    expect(screen.getByRole('heading', { level: 1, name: /Inicio/ })).toHaveFocus();
    expect(screen.getAllByText('Persona Demo').length).toBeGreaterThan(0);
    expect(screen.getByText('$1,922.90')).toBeInTheDocument();
    expect(screen.getByText('+$4,250.00')).toBeInTheDocument();
    expect(screen.getByText('-$1,840.50')).toBeInTheDocument();
    const movements = screen.getByRole('list', { name: 'Movimientos recientes' });
    expect(within(movements).getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByText('5294 •••• •••• 4827')).toBeInTheDocument();
    expect(screen.getByText('12/29')).toBeInTheDocument();
    expect(screen.getByText('$55.80')).toBeInTheDocument();
    expect(screen.getByText(/datos ficticios/i)).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('FR-004: cada control secundario anuncia su acción sin cambiar saldo ni ruta', async () => {
    const { container } = setup();
    const user = userEvent.setup();
    const originalPath = location.href;
    for (const label of [
      'Enviar',
      'Recibir',
      'Recargar',
      'Pagar',
      'Más',
      'Historial',
      'Tarjetas',
      'Pagos',
      'Perfil',
      'QR',
      'Notificaciones',
      'ver todo →',
    ]) {
      for (const button of screen.getAllByRole('button', { name: label })) {
        await user.click(button);
        expect(screen.getByRole('status')).toHaveTextContent(`${label}: Próximamente`);
        expect(screen.getByText('$1,922.90')).toBeInTheDocument();
        expect(location.href).toBe(originalPath);
      }
    }
    await expectNoA11yViolations(container);
  });

  it('FR-004/008: soporta teclado, repetición y selección de Inicio', async () => {
    setup('N'.repeat(80));
    const user = userEvent.setup();
    const send = screen.getByRole('button', { name: 'Enviar' });
    send.focus();
    await user.keyboard('{Enter}');
    const first = screen.getByRole('status');
    expect(first).toHaveTextContent('Enviar: Próximamente');
    await user.keyboard(' ');
    expect(screen.getByRole('status')).not.toBe(first);
    expect(send).toHaveFocus();
    for (const active of screen.getAllByRole('button', { name: 'Inicio' })) {
      expect(active).toHaveAttribute('aria-current', 'page');
      await user.click(active);
    }
    expect(screen.getByText('$1,922.90')).toBeInTheDocument();
  });

  it('FR-006: cerrar sesión entrega el control al propietario', async () => {
    const { onLogout } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it('FR-008: saltar al contenido mueve el foco sin crear una entrada de historial', async () => {
    setup();
    const originalUrl = location.href;
    await userEvent.click(screen.getByRole('link', { name: 'Ir al contenido' }));
    expect(screen.getByRole('main')).toHaveFocus();
    expect(location.href).toBe(originalUrl);
  });
});
