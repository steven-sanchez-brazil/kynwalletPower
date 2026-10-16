import { render, screen } from '@testing-library/react';
import { expectNoA11yViolations } from '@/test/a11y';
import { Alert } from './Alert';

describe('Alert', () => {
  it('FR-015: tone="error" usa role="alert"', () => {
    render(<Alert tone="error">Falló</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Falló');
  });

  it('FR-015: tone="info" usa role="status"', () => {
    render(<Alert tone="info">Aviso</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Aviso');
  });

  it('FR-009: tone="success" usa role="status" y aplica estilo de éxito sin violaciones a11y', async () => {
    const { container } = render(<Alert tone="success">Cuenta creada</Alert>);
    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('Cuenta creada');
    expect(alert).toHaveClass('success');
    await expectNoA11yViolations(container);
  });

  it('FR-015: no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Alert tone="error">Falló</Alert>);
    await expectNoA11yViolations(container);
  });
});
