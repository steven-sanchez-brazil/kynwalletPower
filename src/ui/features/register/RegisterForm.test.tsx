import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './RegisterForm';

describe('RegisterForm', () => {
  it('shows an accessible success confirmation for valid input without exposing the password', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText('Nombre completo'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Correo electrónico'), 'ada@example.com');
    await user.type(screen.getByLabelText('Contraseña', { selector: 'input' }), 'password1');
    await user.type(
      screen.getByLabelText('Confirmar contraseña', { selector: 'input' }),
      'password1',
    );
    await user.click(screen.getByRole('checkbox', { name: /términos y condiciones/i }));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByRole('status')).toHaveTextContent(/registro exitoso/i);
    expect(screen.queryByLabelText('Contraseña', { selector: 'input' })).not.toBeInTheDocument();
    expect(screen.queryByText('password1')).not.toBeInTheDocument();
  });
});
