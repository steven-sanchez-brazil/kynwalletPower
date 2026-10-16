import { WALLET_FIXTURE } from '@/test/walletFixture';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { App } from './App';
import { createRegistrationStub } from '@/test/registrationStub';

describe('App · accesibilidad de la pantalla completa (FR-015, SC-005)', () => {
  it('vista de login sin violaciones', async () => {
    const { container } = render(
      <App
        wallet={WALLET_FIXTURE}
        authenticate={createAuthStub().authenticate}
        register={createRegistrationStub().register}
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('vista de login con errores visibles sin violaciones', async () => {
    const { container } = render(
      <App
        wallet={WALLET_FIXTURE}
        authenticate={createAuthStub().authenticate}
        register={createRegistrationStub().register}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await userEvent.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });

  it('Inicio FR-008 sin violaciones', async () => {
    const { container } = render(
      <App
        wallet={WALLET_FIXTURE}
        authenticate={createAuthStub().authenticate}
        register={createRegistrationStub().register}
      />,
    );
    await userEvent.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await userEvent.type(screen.getByLabelText('Contraseña'), TEST_ACCOUNT.password);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await screen.findByRole('heading', { name: /Inicio/ });
    await expectNoA11yViolations(container);
  });
});
