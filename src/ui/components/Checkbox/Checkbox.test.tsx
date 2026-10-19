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

  it('REG FR-006: con error queda marcado como inválido y asociado al texto del error', () => {
    render(
      <Checkbox
        label="Acepto"
        checked={false}
        onChange={() => {}}
        error="Debes aceptar los términos y condiciones"
      />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto' });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription('Debes aceptar los términos y condiciones');
    expect(screen.getByText('Debes aceptar los términos y condiciones')).toBeVisible();
  });

  it('REG FR-006: sin error no declara aria-invalid ni descripción', () => {
    render(<Checkbox label="Acepto" checked={false} onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto' });
    expect(checkbox).not.toHaveAttribute('aria-invalid');
    expect(checkbox).not.toHaveAttribute('aria-describedby');
  });

  it('REG FR-001: la etiqueta acepta contenido y el nombre accesible es el texto completo', () => {
    render(
      <Checkbox
        label={
          <>
            Acepto los <strong>términos y condiciones</strong>
          </>
        }
        checked={false}
        onChange={() => {}}
      />,
    );
    expect(
      screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }),
    ).toBeInTheDocument();
  });

  it('REG FR-012: con error no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <Checkbox label="Acepto" checked={false} onChange={() => {}} error="Obligatorio" />,
    );
    await expectNoA11yViolations(container);
  });
});
