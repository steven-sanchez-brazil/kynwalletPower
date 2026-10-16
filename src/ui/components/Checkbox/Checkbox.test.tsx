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
  it('REG-FR-010/020: admite etiqueta enriquecida, ref, atributos y error asociado', async () => {
    const ref = createRef<HTMLInputElement>();
    const onBlur = vi.fn();
    const { container } = render(
      <Checkbox
        ref={ref}
        name="acceptedTerms"
        label={
          <>
            Acepto los <strong>términos y condiciones</strong>
          </>
        }
        checked={false}
        onChange={() => {}}
        onBlur={onBlur}
        required
        error="Debes aceptar los términos y condiciones"
      />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' });
    expect(ref.current).toBe(checkbox);
    expect(checkbox).toHaveAttribute('name', 'acceptedTerms');
    expect(checkbox).toBeRequired();
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription('Debes aceptar los términos y condiciones');
    await userEvent.click(checkbox);
    await userEvent.tab();
    expect(onBlur).toHaveBeenCalledOnce();
    await expectNoA11yViolations(container);
  });

  it('REG-FR-017: disabled impide alternar durante el envío', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Términos" checked={false} onChange={onChange} disabled />);
    const checkbox = screen.getByRole('checkbox', { name: 'Términos' });
    expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

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
