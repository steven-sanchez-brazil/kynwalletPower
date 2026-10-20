import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { navigationStub } from '@/test/navigationStub';
import { createAuthStub } from '@/test/authStub';
import { fillRegistration } from '@/test/registrationForm';
import { expectNoA11yViolations } from '@/test/a11y';
it('002/AC-304 · registro y llegada con éxito sin violaciones detectables por axe', async () => {
  const { container } = render(
    <App
      navigation={navigationStub('/register')}
      register={vi.fn().mockResolvedValue({ kind: 'success' })}
      authenticate={createAuthStub().authenticate}
    />,
  );
  await expectNoA11yViolations(container);
  const user = userEvent.setup();
  await fillRegistration(user);
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  await expectNoA11yViolations(container);
  expect(screen.getByRole('status')).toHaveTextContent('Registro de demostración completado');
});
