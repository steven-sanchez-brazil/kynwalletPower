import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from './RegistrationForm';
import { fillRegistration } from '@/test/registrationForm';
it.each(['Google', 'Apple'])(
  '002/AC-401 %s informa sin procesar ni perder datos',
  async (provider) => {
    const register = vi.fn();
    render(<RegistrationForm register={register} onSuccess={vi.fn()} />);
    const user = userEvent.setup();
    await fillRegistration(user);
    await user.click(screen.getByRole('button', { name: provider }));
    expect(screen.getByRole('status')).toHaveTextContent('Próximamente');
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Persona');
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(register).not.toHaveBeenCalled();
  },
);
