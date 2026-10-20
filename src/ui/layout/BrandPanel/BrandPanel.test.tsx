import { render, screen } from '@testing-library/react';
import { BrandPanel } from './BrandPanel';

describe('BrandPanel', () => {
  it('login: sin props muestra el titular y el subtexto de 001', () => {
    render(<BrandPanel />);
    expect(screen.getByText(/Tu dinero,/)).toBeInTheDocument();
    expect(screen.getByText(/sin fronteras\./)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Envía, recibe y paga en segundos. Una billetera pensada para tu día a día.',
      ),
    ).toBeInTheDocument();
  });

  it('FR-001: con title, subtitle y tone="register" muestra los textos del registro', () => {
    render(
      <BrandPanel
        tone="register"
        title={['Comienza tu', 'camino financiero.']}
        subtitle="Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar."
      />,
    );
    expect(screen.getByText(/Comienza tu/)).toBeInTheDocument();
    expect(screen.getByText(/camino financiero\./)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar.',
      ),
    ).toBeInTheDocument();
  });

  it.each([['login' as const], ['register' as const]])(
    'FR-001/FR-002: tone=%s comparte el logo KynWallet y la tarjeta Kyn Card oculta a asistencia',
    (tone) => {
      render(<BrandPanel tone={tone} />);
      expect(screen.getByText('KynWallet')).toBeInTheDocument();
      const card = screen.getByText('Kyn Card').closest('[aria-hidden="true"]');
      expect(card).not.toBeNull();
    },
  );

  it('FR-022: el tono register marca el panel para ocultarse en móvil (solo formulario)', () => {
    const { container } = render(<BrandPanel tone="register" />);
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'register');
  });

  it('el tono por defecto es login', () => {
    const { container } = render(<BrandPanel />);
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'login');
  });
});
