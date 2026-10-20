import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { RegisterForm } from './RegisterForm';

describe('RegisterForm · opciones sociales y navegación', () => {
  it.each(['Google', 'Apple'])(
    'muestra Próximamente al seleccionar %s y conserva los datos',
    async (provider) => {
      render(<RegisterForm />);

      const name = screen.getByLabelText('Nombre completo');
      fireEvent.change(name, { target: { value: 'Ada Lovelace' } });
      fireEvent.click(screen.getByRole('button', { name: provider }));

      expect(screen.getByRole('status')).toHaveTextContent('Próximamente');
      expect(name).toHaveValue('Ada Lovelace');
    },
  );

  it('incluye un enlace semántico al inicio de sesión', () => {
    render(<RegisterForm />);
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login');
  });
});
