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

  it('FR-008: consultar el enlace no acepta la casilla y el error se anuncia', async () => {
    const onAction = vi.fn();
    const { container } = render(
      <Checkbox
        label="Acepto los"
        actionLabel="términos y condiciones"
        onAction={onAction}
        checked={false}
        onChange={vi.fn()}
        error="Debes aceptar los términos y condiciones"
      />,
    );
    const box = screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' });
    expect(box).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(box).not.toBeChecked();
    await expectNoA11yViolations(container);
  });
});
