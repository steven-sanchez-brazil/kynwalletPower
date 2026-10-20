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

  it('asocia el error con la casilla y la marca como inválida', () => {
    render(
      <Checkbox
        label="Acepto los términos y condiciones"
        checked={false}
        description="Lee las condiciones antes de aceptar."
        error="Debes aceptar los términos y condiciones"
        onChange={() => {}}
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Acepto los términos y condiciones',
    });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription(
      'Lee las condiciones antes de aceptar. Debes aceptar los términos y condiciones',
    );
  });
});
