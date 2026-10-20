import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordField } from './PasswordField';
it('002/AC-303 distingue controles de contraseña y confirmación', async () => {
  render(
    <>
      <PasswordField label="Contraseña" />
      <PasswordField label="Confirmar contraseña" visibilityLabel="confirmación" />
    </>,
  );
  const user = userEvent.setup();
  const control = screen.getByRole('button', { name: 'Mostrar confirmación' });
  await user.click(control);
  expect(screen.getByLabelText('Confirmar contraseña')).toHaveAttribute('type', 'text');
  expect(screen.getByRole('button', { name: 'Ocultar confirmación' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
  await user.click(screen.getByRole('button', { name: 'Ocultar confirmación' }));
  expect(screen.getByLabelText('Confirmar contraseña')).toHaveAttribute('type', 'password');
});
