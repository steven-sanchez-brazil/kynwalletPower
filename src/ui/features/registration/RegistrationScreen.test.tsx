import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationScreen } from './RegistrationScreen';
import { RegistrationForm } from './RegistrationForm';
import { createRegistrationStub } from '@/test/registrationStub';
import { expectNoA11yViolations } from '@/test/a11y';
it('REG-US5-3/4 pantalla completa con teclado, etiquetas y axe', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <RegistrationScreen>
      <RegistrationForm
        register={createRegistrationStub().register}
        onSuccess={vi.fn()}
        onLogin={vi.fn()}
      />
    </RegistrationScreen>,
  );
  expect(screen.getByRole('main')).toBeVisible();
  await expectNoA11yViolations(container);
  const order = [
    screen.getByLabelText('Nombre completo'),
    screen.getByLabelText('Correo electrónico'),
    screen.getByLabelText('Contraseña'),
    screen.getByRole('button', { name: 'Mostrar contraseña' }),
    screen.getByLabelText('Confirmar contraseña'),
    screen.getByRole('button', { name: 'Mostrar confirmar contraseña' }),
    screen.getByRole('checkbox'),
    screen.getByRole('button', { name: 'términos y condiciones' }),
    screen.getByRole('button', { name: 'Crear cuenta' }),
    screen.getByRole('button', { name: 'Google' }),
    screen.getByRole('button', { name: 'Apple' }),
    screen.getByRole('link', { name: 'Inicia sesión' }),
  ];
  for (const element of order) {
    await user.tab();
    expect(element).toHaveFocus();
  }
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  await expectNoA11yViolations(container);
});
