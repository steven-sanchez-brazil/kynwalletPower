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
  it('Registro FR-002/009/017/021: ref, error asociado y acción separada', async () => {
    const ref = createRef<HTMLInputElement>();
    const change = vi.fn();
    const action = vi.fn();
    render(
      <Checkbox
        label="Acepto los"
        labelSuffix={
          <button type="button" onClick={action}>
            términos y condiciones
          </button>
        }
        ref={ref}
        checked={false}
        onChange={change}
        error="Acepta los términos y condiciones"
        required
      />,
    );
    const box = screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' });
    expect(ref.current).toBe(box);
    ref.current?.focus();
    expect(box).toHaveFocus();
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAccessibleDescription('Acepta los términos y condiciones');
    await userEvent.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    expect(action).toHaveBeenCalledOnce();
    expect(change).not.toHaveBeenCalled();
    await expectNoA11yViolations(document.body);
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
