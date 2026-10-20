import { render, screen } from '@testing-library/react';
import { AuthLayout } from './AuthLayout';
it.each([true, false])(
  '002/AC-301/302 layout compartido registro %j conserva marca y contenido',
  (registration) => {
    render(
      <AuthLayout registration={registration}>
        <h1>Formulario</h1>
      </AuthLayout>,
    );
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading'));
    expect(screen.getByText('KynWallet')).toBeInTheDocument();
    expect(screen.getByText('Tu dinero,', { exact: false })).toBeInTheDocument();
  },
);
