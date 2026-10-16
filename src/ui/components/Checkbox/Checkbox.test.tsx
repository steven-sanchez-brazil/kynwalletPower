import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { Checkbox } from './Checkbox';

function Controlled() {
  const [checked, setChecked] = useState(false);
  return <Checkbox label="Recordarme" checked={checked} onChange={setChecked} />;
}

describe('Checkbox', () => {
  it('US5-2: casilla con etiqueta que alterna su estado', async () => {
    render(<Controlled />);
    const checkbox = screen.getByRole('checkbox', { name: 'Recordarme' });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await userEvent.click(screen.getByText('Recordarme'));
    expect(checkbox).not.toBeChecked();
  });

  it('FR-015: no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Controlled />);
    await expectNoA11yViolations(container);
  });
});

describe('Checkbox · error, nombre accesible y contenido adicional (002, research.md R6)', () => {
  it('FR-021: con error, la casilla es inválida y describe el mensaje', () => {
    render(
      <Checkbox
        label="Acepto los"
        ariaLabel="Acepto los términos y condiciones"
        checked={false}
        onChange={() => {}}
        error="Debes aceptar los términos y condiciones"
      />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription('Debes aceptar los términos y condiciones');
  });

  it('sin error, la casilla no es inválida', () => {
    render(<Checkbox label="Recordarme" checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
  });

  it('activar el contenido adicional no cambia la casilla', async () => {
    const onChange = vi.fn();
    const onAddon = vi.fn();
    render(
      <Checkbox
        label="Acepto los"
        checked={false}
        onChange={onChange}
        addon={
          <button type="button" onClick={onAddon}>
            términos y condiciones
          </button>
        }
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    expect(onAddon).toHaveBeenCalledOnce();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('expone la casilla mediante ref para mover el foco', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox label="Recordarme" checked={false} onChange={() => {}} ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
  });

  it('FR-021: con error y contenido adicional no tiene violaciones', async () => {
    const { container } = render(
      <Checkbox
        label="Acepto los"
        ariaLabel="Acepto los términos y condiciones"
        checked={false}
        onChange={() => {}}
        error="Debes aceptar los términos y condiciones"
        addon={<button type="button">términos y condiciones</button>}
      />,
    );
    await expectNoA11yViolations(container);
  });
});
