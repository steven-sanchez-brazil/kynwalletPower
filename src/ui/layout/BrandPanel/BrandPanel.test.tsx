import { render, screen } from '@testing-library/react';
import { BrandPanel } from './BrandPanel';

describe('Registro FR-015/016 variante de marca', () => {
  it('mantiene login por defecto', () => {
    render(<BrandPanel />);
    expect(screen.getByText(/Tu dinero,/)).toBeInTheDocument();
  });
  it('usa textos de Registro y tarjeta decorativa', () => {
    const { container } = render(<BrandPanel variant="registration" />);
    expect(screen.getByText(/Comienza tu/)).toBeInTheDocument();
    expect(screen.getByText(/Crea tu cuenta en minutos/)).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden=true]')).toHaveTextContent('Kyn Card');
  });
  it('Inicio FR-013: conserva el símbolo distinto de cada frame de login y Registro', () => {
    const { container, rerender } = render(<BrandPanel />);
    const loginSymbol = container.querySelector('img')?.getAttribute('src');
    expect(loginSymbol).toBeTruthy();
    rerender(<BrandPanel variant="registration" />);
    const registrationSymbol = container.querySelector('img');
    expect(registrationSymbol).toHaveAttribute('width', '18');
    expect(registrationSymbol).toHaveAttribute('height', '28');
    expect(registrationSymbol?.getAttribute('src')).not.toBe(loginSymbol);
    expect(registrationSymbol).toHaveAttribute('alt', '');
  });
});
