import { render, screen } from '@testing-library/react';
import { BrandPanel } from './BrandPanel';
it('REG-US5 variante de registro mantiene textos y tarjeta decorativa', () => {
  const { rerender } = render(<BrandPanel variant="registration" />);
  expect(screen.getByText(/Comienza tu/)).toHaveTextContent('Comienza tu camino financiero.');
  expect(screen.getByText('Kyn Card').closest('[aria-hidden]')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  rerender(<BrandPanel />);
  expect(screen.getByText(/Tu dinero,/)).toBeVisible();
});
