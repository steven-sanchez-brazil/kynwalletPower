import { useState } from 'react';
import { createRef } from 'react';
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

  it('FR-008: la etiqueta acepta contenido con un botón-enlace y forma parte del nombre accesible', async () => {
    const onLink = vi.fn();
    const onChange = vi.fn();
    render(
      <Checkbox
        label={
          <>
            Acepto los{' '}
            <button type="button" onClick={onLink}>
              términos y condiciones
            </button>
          </>
        }
        checked={false}
        onChange={onChange}
      />,
    );
    expect(
      screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    expect(onLink).toHaveBeenCalledOnce();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('FR-008: con error muestra el mensaje, aria-invalid y aria-describedby', () => {
    render(<Checkbox label="Acepto" checked={false} onChange={() => {}} error="Debes aceptar" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto' });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription('Debes aceptar');
    expect(screen.getByText('Debes aceptar')).toBeVisible();
  });

  it('FR-008: sin error no hay aria-invalid ni descripción', () => {
    render(<Checkbox label="Acepto" checked={false} onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto' });
    expect(checkbox).not.toHaveAttribute('aria-invalid');
    expect(checkbox).not.toHaveAttribute('aria-describedby');
  });

  it('FR-018: acepta un ref al input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Acepto" checked={false} onChange={() => {}} ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
  });

  it('FR-019: sin violaciones de accesibilidad con error y con enlace en la etiqueta', async () => {
    const { container } = render(
      <Checkbox
        label={
          <>
            Acepto los <button type="button">términos y condiciones</button>
          </>
        }
        checked={false}
        onChange={() => {}}
        error="Debes aceptar"
      />,
    );
    await expectNoA11yViolations(container);
  });
});
