import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { RegisterForm } from './RegisterForm';

describe('RegisterForm · validación inline', () => {
  it('muestra errores de todos los campos obligatorios y enfoca el primero al enviar vacío', async () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(screen.getByText('Ingresa tu nombre completo')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu correo electrónico')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu contraseña')).toBeInTheDocument();
    expect(screen.getByText('Confirma tu contraseña')).toBeInTheDocument();
    expect(screen.getByText('Debes aceptar los términos y condiciones')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toHaveFocus();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('valida correo y contraseña al salir del campo y elimina el error al corregirlo', async () => {
    render(<RegisterForm />);

    const email = screen.getByLabelText('Correo electrónico');
    fireEvent.change(email, { target: { value: 'no-es-correo' } });
    fireEvent.blur(email);
    expect(screen.getByText('Ingresa un correo electrónico válido')).toBeInTheDocument();

    fireEvent.change(email, { target: { value: 'ada@example.com' } });
    expect(screen.queryByText('Ingresa un correo electrónico válido')).not.toBeInTheDocument();

    const password = screen.getByLabelText('Contraseña', { selector: 'input' });
    fireEvent.change(password, { target: { value: 'short' } });
    fireEvent.blur(password);
    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
  });

  it('revalida la confirmación al cambiar la contraseña y enfoca el primer campo inválido al enviar', async () => {
    render(<RegisterForm />);

    const name = screen.getByLabelText('Nombre completo');
    const email = screen.getByLabelText('Correo electrónico');
    const password = screen.getByLabelText('Contraseña', { selector: 'input' });
    const confirmation = screen.getByLabelText('Confirmar contraseña', { selector: 'input' });

    fireEvent.change(name, { target: { value: 'Ada Lovelace' } });
    fireEvent.change(email, { target: { value: 'ada@example.com' } });
    fireEvent.change(password, { target: { value: 'password1' } });
    fireEvent.change(confirmation, { target: { value: 'password1' } });
    fireEvent.blur(confirmation);

    fireEvent.change(password, { target: { value: 'password2' } });
    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(confirmation).toHaveFocus();
  });
});
