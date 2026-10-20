import { screen } from '@testing-library/react';
import type userEvent from '@testing-library/user-event';
export async function fillRegistration(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nombre completo'), 'Persona');
  await user.type(screen.getByLabelText('Correo electrónico'), 'persona@example.com');
  await user.type(screen.getByLabelText('Contraseña'), 'abcdefgh');
  await user.type(screen.getByLabelText('Confirmar contraseña'), 'abcdefgh');
  await user.click(screen.getByRole('checkbox'));
}
