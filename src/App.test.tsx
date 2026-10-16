import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAuthenticate } from '@/application/authenticate';
import { createRegisterAccount } from '@/application/registerAccount';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { createRegisterStub } from '@/test/registerStub';
import { App } from './App';

describe('App · accesibilidad de la pantalla completa (FR-013, FR-015, SC-005)', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/login');
  });

  it('vista de login sin violaciones', async () => {
    const { container } = render(<App authenticate={createAuthStub().authenticate} />);
    await expectNoA11yViolations(container);
  });

  it('vista de login con errores visibles sin violaciones', async () => {
    const { container } = render(<App authenticate={createAuthStub().authenticate} />);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await userEvent.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });

  it('vista de bienvenida sin violaciones', async () => {
    const { container } = render(<App authenticate={createAuthStub().authenticate} />);
    await userEvent.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await userEvent.type(screen.getByLabelText('Contraseña'), TEST_ACCOUNT.password);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await screen.findByRole('heading', { name: /Bienvenido,/ });
    await expectNoA11yViolations(container);
  });

  it('US4-1, US4-2, SC-005: vista de registro (/register) con panel KynCard y formulario sin violaciones de accesibilidad (inicial y con errores)', async () => {
    window.history.pushState({}, '', '/register');
    const { container } = render(
      <App
        authenticate={createAuthStub().authenticate}
        registerAccount={createRegisterStub().registerAccount}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByText('KynWallet')).toBeInTheDocument();
    expect(screen.getByText('Kyn Card')).toBeInTheDocument();
    expect(screen.getByText('STEVEN LUNA')).toBeInTheDocument();
    await expectNoA11yViolations(container);

    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await userEvent.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });
});

describe('App · US1 y US3 Navegación bidireccional (/login ↔ /register) y flujo completo', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/login');
  });

  it('US3-2, FR-008: navega de /login a /register al pulsar "Regístrate", soporta popstate y regresa a /login al pulsar "Inicia sesión"', async () => {
    const user = userEvent.setup();
    render(
      <App
        authenticate={createAuthStub().authenticate}
        registerAccount={createRegisterStub().registerAccount}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Regístrate' }));
    expect(window.location.pathname).toBe('/register');
    expect(screen.getByRole('heading', { name: 'Crear cuenta' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();

    act(() => {
      window.history.pushState({}, '', '/register');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('heading', { name: 'Crear cuenta' })).toBeInTheDocument();
  });

  it('US1-1, FR-009: completa el registro en /register, redirige automáticamente a /login y permite iniciar sesión con la nueva cuenta', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/register');
    const gateway = new InMemoryAuthGateway([TEST_ACCOUNT], { delayMs: 0 });
    const authenticate = createAuthenticate(gateway);
    const registerAccount = createRegisterAccount(gateway);

    render(
      <App
        authenticate={authenticate}
        registerAccount={registerAccount}
        registerRedirectDelayMs={20}
      />,
    );

    await user.type(screen.getByLabelText('Nombre completo'), 'Camila Torres');
    await user.type(screen.getByLabelText('Correo electrónico'), 'camila.torres@example.test');
    await user.type(screen.getByLabelText('Contraseña'), 'CamilaPass99');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'CamilaPass99');
    await user.click(screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      '¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…',
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
      expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Correo electrónico'), 'camila.torres@example.test');
    await user.type(screen.getByLabelText('Contraseña'), 'CamilaPass99');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(
      await screen.findByRole('heading', { name: '¡Bienvenido, Camila Torres!' }),
    ).toBeInTheDocument();
  });
});
