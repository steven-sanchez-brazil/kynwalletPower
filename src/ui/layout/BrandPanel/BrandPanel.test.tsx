import { render, screen } from '@testing-library/react';
import { BrandPanel } from './BrandPanel';

describe('BrandPanel', () => {
  it('login: muestra el titular de 001', () => {
    render(<BrandPanel />);
    expect(screen.getByText(/Tu dinero.*sin fronteras\./)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Envía, recibe y paga en segundos. Una billetera pensada para tu día a día.',
      ),
    ).toBeInTheDocument();
  });

  it('REG FR-015: registro muestra el titular y el texto de apoyo del frame', () => {
    render(<BrandPanel variant="registration" />);
    expect(screen.getByText(/Comienza tu.*camino financiero\./)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar.',
      ),
    ).toBeInTheDocument();
  });

  it.each(['login', 'registration'] as const)(
    'REG FR-015: %s muestra el logo y la tarjeta ilustrativa oculta a lectores de pantalla',
    (variant) => {
      render(<BrandPanel variant={variant} />);
      expect(screen.getByText('KynWallet')).toBeInTheDocument();
      expect(screen.getByText('Kyn Card').closest('[aria-hidden="true"]')).not.toBeNull();
    },
  );

  it('REG US3-3 / FR-011: solo el registro se oculta por completo en móvil', () => {
    const { container, rerender } = render(<BrandPanel variant="registration" />);
    expect(container.querySelector('header')).toHaveClass('hiddenOnMobile');
    rerender(<BrandPanel variant="login" />);
    expect(container.querySelector('header')).not.toHaveClass('hiddenOnMobile');
  });
});
