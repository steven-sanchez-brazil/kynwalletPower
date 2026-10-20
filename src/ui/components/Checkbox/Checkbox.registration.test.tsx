import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Checkbox } from './Checkbox';
it('REG-US2 casilla con error asociado y foco mediante ref', () => {
  const ref = createRef<HTMLInputElement>();
  render(
    <Checkbox
      label="Acepto los términos y condiciones"
      checked={false}
      onChange={vi.fn()}
      error="Debes aceptar los términos y condiciones"
      required
      ref={ref}
    />,
  );
  expect(screen.getByRole('checkbox')).toBeRequired();
  expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
    'Debes aceptar los términos y condiciones',
  );
  ref.current?.focus();
  expect(screen.getByRole('checkbox')).toHaveFocus();
});
