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

  it('FR-015: no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Controlled />);
    await expectNoA11yViolations(container);
  });
});

describe('Checkbox · registro (002)', () => {
  const termsLabel = (
    <>
      Acepto los <button type="button">términos y condiciones</button>
    </>
  );

  it('FR-003: acepta una etiqueta con contenido enriquecido', () => {
    render(<Checkbox label={termsLabel} checked={false} onChange={() => {}} />);
    expect(
      screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }),
    ).not.toBeChecked();
  });

  it('US4-2: activar un botón dentro de la etiqueta no cambia la casilla', async () => {
    const onChange = vi.fn();
    render(<Checkbox label={termsLabel} checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('US2-6: con error, la casilla queda inválida y describe el mensaje', () => {
    render(<Checkbox label="Acepto" checked={false} onChange={() => {}} error="Obligatorio" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto' });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription('Obligatorio');
  });

  it('acepta un ref al input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Acepto" checked={false} onChange={() => {}} ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('checkbox', { name: 'Acepto' }));
  });

  it('FR-020: con error no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <Checkbox label={termsLabel} checked={false} onChange={() => {}} error="Obligatorio" />,
    );
    await expectNoA11yViolations(container);
  });
});
