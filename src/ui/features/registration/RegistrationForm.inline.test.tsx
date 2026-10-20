import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from './RegistrationForm';
import { fillRegistration } from '@/test/registrationForm';
describe('002/US2 · inline', () => {
  it('AC-201 cinco errores y foco, sin caso de uso', async () => {
    const user = userEvent.setup();
    const register = vi.fn();
    render(<RegistrationForm register={register} onSuccess={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    for (const text of [
      'Ingresa tu nombre completo',
      'Ingresa tu correo electrónico',
      'Ingresa tu contraseña',
      'Confirma tu contraseña',
      'Debes aceptar los términos y condiciones',
    ])
      expect(screen.getByText(text)).toBeVisible();
    expect(screen.getByLabelText('Nombre completo')).toHaveFocus();
    expect(register).not.toHaveBeenCalled();
  });
  it('AC-202/204 corrección y dependencia sin perder valores', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm register={vi.fn()} onSuccess={vi.fn()} />);
    await fillRegistration(user);
    await user.click(screen.getByLabelText('Correo electrónico'));
    await user.clear(screen.getByLabelText('Correo electrónico'));
    await user.type(screen.getByLabelText('Correo electrónico'), 'persona@');
    await user.tab();
    expect(screen.getByText('Ingresa un correo electrónico válido')).toBeVisible();
    await user.type(screen.getByLabelText('Correo electrónico'), 'example.com');
    expect(screen.queryByText('Ingresa un correo electrónico válido')).not.toBeInTheDocument();
    await user.click(screen.getByLabelText('Confirmar contraseña'));
    await user.tab();
    await user.type(screen.getByLabelText('Contraseña'), 'x');
    expect(screen.getByText('Las contraseñas no coinciden')).toBeVisible();
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Persona');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
  it('foco en términos si es el único inválido', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm register={vi.fn()} onSuccess={vi.fn()} />);
    await fillRegistration(user);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByRole('checkbox')).toHaveFocus();
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
      'Debes aceptar los términos y condiciones',
    );
  });
});
