import { render, screen } from '@testing-library/react';
import { BrandPanel } from './BrandPanel';

describe('BrandPanel', () => {
  it('regresión 001: conserva contenido de login por defecto', () => {
    render(<BrandPanel />);
    expect(screen.getByText(/Tu dinero,/)).toBeInTheDocument();
    expect(screen.getByText(/Envía, recibe y paga/)).toBeInTheDocument();
  });

  it('US7-2: acepta contenido y variante de registro', () => {
    const { container } = render(
      <BrandPanel
        variant="registration"
        title={'Comienza tu\ncamino financiero.'}
        subtitle="Crea tu cuenta en minutos"
      />,
    );
    expect(screen.getByText(/Comienza tu/)).toBeInTheDocument();
    expect(screen.getByText('Crea tu cuenta en minutos')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('registration');
  });
});
