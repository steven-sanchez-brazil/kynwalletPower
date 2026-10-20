import { render, screen } from '@testing-library/react';
import { expectNoA11yViolations } from '@/test/a11y';
import { RegisterScreen } from './RegisterScreen';

describe('RegisterScreen', () => {
  it('presenta un formulario con encabezado accesible', async () => {
    const { container } = render(<RegisterScreen />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
