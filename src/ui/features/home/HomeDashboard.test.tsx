import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { HomeDashboard } from './HomeDashboard';

function setup(name = 'Steven Luna', onLogout = vi.fn()) {
  const user = userEvent.setup();
  const { container } = render(<HomeDashboard name={name} onLogout={onLogout} />);
  return { user, onLogout, container };
}

describe('HomeDashboard · US1 Resumen financiero, privacidad y cierre de sesión', () => {
  it('US1-1 y US1-2: muestra saludo con foco inicial, Kyn Card con titular en mayúsculas, saldo disponible, ingresos y gastos', () => {
    setup('Steven Luna');
    const heading = screen.getByRole('heading', { level: 1, name: '¡Bienvenido, Steven Luna!' });
    expect(heading).toHaveFocus();

    expect(screen.getByText('STEVEN LUNA')).toBeVisible();
    expect(screen.getByText('$2,450.00')).toBeVisible();
    expect(screen.getByText('+$3,200.00')).toBeVisible();
    expect(screen.getByText('-$750.00')).toBeVisible();
  });

  it('US1-3: permite ocultar y volver a mostrar los montos por privacidad', async () => {
    const { user } = setup();
    const toggle = screen.getByRole('button', { name: 'Ocultar saldo' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Mostrar saldo' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.queryByText('$2,450.00')).not.toBeInTheDocument();
    expect(screen.getAllByText('••••••').length).toBeGreaterThanOrEqual(3);

    await user.click(screen.getByRole('button', { name: 'Mostrar saldo' }));
    expect(screen.getByText('$2,450.00')).toBeVisible();
  });

  it('US1-4: "Cerrar sesión" invoca onLogout', async () => {
    const { user, onLogout } = setup();
    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(onLogout).toHaveBeenCalledOnce();
  });
});

describe('HomeDashboard · US2 Explorar y filtrar dinámicamente los movimientos recientes', () => {
  it('US2-1, US2-2 y US2-3: filtra dinámicamente entre Todos, Ingresos y Gastos', async () => {
    const { user } = setup();
    const list = screen.getByRole('list', { name: 'Lista de movimientos' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(5);

    const incomeFilter = screen.getByRole('button', { name: 'Ingresos' });
    await user.click(incomeFilter);
    expect(incomeFilter).toHaveAttribute('aria-pressed', 'true');
    const incomeItems = within(list).getAllByRole('listitem');
    expect(incomeItems).toHaveLength(2);
    incomeItems.forEach((item) => {
      expect(item).toHaveTextContent(/\+\$/);
    });

    const expenseFilter = screen.getByRole('button', { name: 'Gastos' });
    await user.click(expenseFilter);
    expect(expenseFilter).toHaveAttribute('aria-pressed', 'true');
    const expenseItems = within(list).getAllByRole('listitem');
    expect(expenseItems).toHaveLength(3);
    expenseItems.forEach((item) => {
      expect(item).toHaveTextContent(/-\$/);
    });

    await user.click(screen.getByRole('button', { name: 'Todos' }));
    expect(within(list).getAllByRole('listitem')).toHaveLength(5);
  });

  it('US2-4: filtra en tiempo real por texto de búsqueda y muestra estado vacío con opción de restablecer', async () => {
    const { user } = setup();
    const searchbox = screen.getByRole('searchbox', { name: 'Buscar movimiento' });

    await user.type(searchbox, 'nomina');
    const list = screen.getByRole('list', { name: 'Lista de movimientos' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(1);
    expect(list).toHaveTextContent('Pago de Nómina');

    await user.clear(searchbox);
    await user.type(searchbox, 'inexistente-xyz');
    expect(
      screen.getByText('No se encontraron movimientos para los criterios seleccionados'),
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Restablecer filtros' }));
    expect(screen.getByRole('list', { name: 'Lista de movimientos' })).toBeVisible();
  });
});

describe('HomeDashboard · US3 Acciones rápidas dinámicas (Recargar, Enviar, Recibir, Pagar)', () => {
  it('US3-1: "Recargar" incrementa el saldo disponible, los ingresos y agrega el movimiento al inicio', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Recargar' }));

    await user.type(screen.getByLabelText('Concepto'), 'Depósito extra');
    await user.type(screen.getByLabelText('Monto (USD)'), '500');
    await user.click(screen.getByRole('button', { name: 'Confirmar operación' }));

    expect(screen.getByText('$2,950.00')).toBeVisible();
    expect(screen.getByText('+$3,700.00')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Operación realizada con éxito');

    const items = within(screen.getByRole('list', { name: 'Lista de movimientos' })).getAllByRole(
      'listitem',
    );
    expect(items[0]).toHaveTextContent('Depósito extra');
    expect(items[0]).toHaveTextContent('+$500.00');
  });

  it('US3-2 y US3-3: "Enviar" bloquea montos superiores al saldo disponible y descuenta el saldo cuando es válido', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Enviar' }));

    const recipientInput = screen.getByLabelText('Destinatario o concepto');
    const amountInput = screen.getByLabelText('Monto (USD)');

    await user.type(recipientInput, 'Carlos Ruiz');
    await user.type(amountInput, '9000');
    await user.click(screen.getByRole('button', { name: 'Confirmar operación' }));

    expect(amountInput).toHaveAccessibleDescription(
      'Saldo insuficiente para realizar esta operación',
    );
    expect(screen.getByText('$2,450.00')).toBeVisible();

    await user.clear(amountInput);
    await user.type(amountInput, '150');
    await user.click(screen.getByRole('button', { name: 'Confirmar operación' }));

    expect(screen.getByText('$2,300.00')).toBeVisible();
    expect(screen.getByText('-$900.00')).toBeVisible();
    const items = within(screen.getByRole('list', { name: 'Lista de movimientos' })).getAllByRole(
      'listitem',
    );
    expect(items[0]).toHaveTextContent('Carlos Ruiz');
    expect(items[0]).toHaveTextContent('-$150.00');
  });

  it('US3-4: "Recibir" muestra el alias del usuario y copia los datos mostrando confirmación Toast', async () => {
    const { user } = setup('Ana Gómez');
    await user.click(screen.getByRole('button', { name: 'Recibir' }));
    expect(screen.getByText('ana.gomez.kyn')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Copiar alias' }));
    expect(screen.getByRole('status')).toHaveTextContent('Datos copiados al portapapeles');
  });
});

describe('HomeDashboard · US4 Diseño Figma 13:2, Responsive 2 paneles/1 panel y Accesibilidad (SC-004)', () => {
  it('US4-1, US4-3 y US4-4: incluye navegación principal y las opciones Movimientos, Tarjetas y Mi Perfil muestran "Próximamente" mediante Toast Alert superior centrado (top-center)', async () => {
    const { user } = setup();
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' });
    expect(within(nav).getByRole('button', { name: 'Inicio' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    for (const optionName of ['Movimientos', 'Tarjetas', 'Mi Perfil']) {
      await user.click(within(nav).getByRole('button', { name: optionName }));
      const toast = screen.getByRole('status');
      expect(toast).toHaveTextContent('Próximamente');
      expect(toast).toHaveAttribute('data-position', 'top-center');
      expect(toast).toHaveAttribute('data-tone', 'brand');
    }
  });

  it('SC-004: sin violaciones de accesibilidad axe en estado inicial, con saldo oculto y con panel de acción abierto', async () => {
    const { user, container } = setup();
    await expectNoA11yViolations(container);

    await user.click(screen.getByRole('button', { name: 'Ocultar saldo' }));
    await expectNoA11yViolations(container);

    await user.click(screen.getByRole('button', { name: 'Enviar' }));
    await expectNoA11yViolations(container);
  });
});
