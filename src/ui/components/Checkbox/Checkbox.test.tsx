import { createRef, useState } from 'react';
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

  it('002 US2-7: con error se marca inválida y anuncia el mensaje', () => {
    render(
      <Checkbox
        label={
          <>
            Acepto los <strong>términos</strong>
          </>
        }
        checked={false}
        onChange={() => {}}
        error="Debes aceptar"
      />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto los términos' });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription('Debes aceptar');
  });

  it('002 FR-009: acepta un ref al input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Recordarme" checked={false} onChange={() => {}} ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
  });

  it('FR-015: no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Controlled />);
    await expectNoA11yViolations(container);
  });
});
