import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { Checkbox } from './Checkbox';
it('002/FR-007/008 Checkbox requerido, error, ref y blur', () => {
  const ref = createRef<HTMLInputElement>();
  const blur = vi.fn();
  const change = vi.fn();
  render(
    <Checkbox
      label="Aceptación"
      required
      name="acceptedTerms"
      ref={ref}
      checked={false}
      onChange={change}
      onBlur={blur}
      error="Acepta términos"
    />,
  );
  const box = screen.getByRole('checkbox');
  expect(box).toBeRequired();
  expect(box).toHaveAccessibleDescription('Acepta términos');
  expect(box).toHaveAttribute('aria-invalid', 'true');
  expect(ref.current).toBe(box);
  fireEvent.blur(box);
  expect(blur).toHaveBeenCalled();
  fireEvent.click(box);
  expect(change).toHaveBeenCalledWith(true);
});
