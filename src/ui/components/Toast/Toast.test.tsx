import { act, fireEvent, render, screen } from '@testing-library/react';
import { expectNoA11yViolations } from '@/test/a11y';
import { Toast, TOAST_DURATION_MS } from './Toast';

function setup(message: string | null = '¡Hecho!') {
  const onClose = vi.fn();
  const view = render(<Toast message={message} onClose={onClose} />);
  return { onClose, ...view };
}

const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe('Toast (research R11, 001 US7)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('la región role="status" existe siempre y está vacía sin mensaje', () => {
    setup(null);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('US7-1: muestra el mensaje en la región de estado sin mover el foco', () => {
    setup();
    expect(screen.getByRole('status')).toHaveTextContent('¡Hecho!');
    expect(document.body).toHaveFocus();
  });

  it('US7-2: se cierra a los 5 s y no antes', () => {
    const { onClose } = setup();
    expect(TOAST_DURATION_MS).toBe(5000);
    advance(4999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('US7-3: el puntero encima detiene el tiempo y al salir continúa con el restante', () => {
    const { onClose } = setup();
    const toast = screen.getByText('¡Hecho!').closest('[data-toast]') as HTMLElement;
    advance(3000);
    fireEvent.mouseEnter(toast);
    advance(10_000);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseLeave(toast);
    advance(1999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('US7-3: el foco en "Cerrar aviso" detiene el tiempo hasta que sale', () => {
    const { onClose } = setup();
    const close = screen.getByRole('button', { name: 'Cerrar aviso' });
    act(() => close.focus());
    advance(10_000);
    expect(onClose).not.toHaveBeenCalled();
    act(() => close.blur());
    advance(5000);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('US7-3: "Cerrar aviso" lo cierra de inmediato', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar aviso' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('no tiene violaciones de accesibilidad', async () => {
    vi.useRealTimers();
    const { container } = setup();
    await expectNoA11yViolations(container);
  });
});
