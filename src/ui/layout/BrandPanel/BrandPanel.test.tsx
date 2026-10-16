import { render, screen } from '@testing-library/react';
import { BrandPanel } from './BrandPanel';

describe('BrandPanel', () => {
  it('conserva el mensaje de login por defecto', () => {
    render(<BrandPanel />);
    expect(screen.getByText(/Tu dinero,/)).toHaveTextContent('Tu dinero,sin fronteras.');
    expect(screen.getByText('KynWallet')).toBeInTheDocument();
  });

  it('REG-US3-1: comparte marca y tarjeta con el texto de registro', () => {
    render(<BrandPanel variant="register" />);
    expect(screen.getByText('Comienza tu camino financiero.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('KynWallet')).toBeInTheDocument();
    expect(screen.getByText('Kyn Card').closest('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
