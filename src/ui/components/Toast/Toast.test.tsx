import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MESSAGES } from '@/domain/messages';
import { expectNoA11yViolations } from '@/test/a11y';
import { Toast } from './Toast';

describe('Toast (US3, US4-4, FR-013, FR-016)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('US3-1 / US4-4: renderiza el mensaje flotante superior centrado (top-center) con role="status", aria-live="polite" y tono brand por defecto', () => {
    render(<Toast message={MESSAGES.COMING_SOON} onDismiss={vi.fn()} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Próximamente');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('data-position', 'top-center');
    expect(status).toHaveAttribute('data-tone', 'brand');
  });

  it('US4-4 / FR-013: aplica tono success de la paleta actual en mensajes de confirmación manteniendo el texto establecido', () => {
    const { rerender } = render(<Toast message={MESSAGES.OPERATION_SUCCESS} onDismiss={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'success');
    expect(screen.getByRole('status')).toHaveTextContent('Operación realizada con éxito');

    rerender(<Toast message={MESSAGES.ALIAS_COPIED} onDismiss={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'success');
    expect(screen.getByRole('status')).toHaveTextContent('Datos copiados al portapapeles');

    rerender(<Toast message={MESSAGES.COMING_SOON} tone="success" onDismiss={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'success');
  });

  it('US4-4: permite cerrar manualmente la notificación estilo react-toastify', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Toast message={MESSAGES.COMING_SOON} onDismiss={onDismiss} />);

    await user.click(screen.getByRole('button', { name: 'Cerrar notificación' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('US3-3: se oculta automáticamente tras durationMs (3000 ms por defecto)', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast message="Próximamente" onDismiss={onDismiss} />);
    vi.advanceTimersByTime(2999);
    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('FR-016 / SC-004: sin violaciones de accesibilidad axe en ambos tonos de color de la paleta', async () => {
    const { container, rerender } = render(
      <Toast message={MESSAGES.COMING_SOON} onDismiss={vi.fn()} />,
    );
    await expectNoA11yViolations(container);

    rerender(<Toast message={MESSAGES.OPERATION_SUCCESS} onDismiss={vi.fn()} />);
    await expectNoA11yViolations(container);
  });
});
