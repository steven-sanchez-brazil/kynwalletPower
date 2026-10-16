import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { createAuthenticate } from '@/application/authenticate';
import { createRegisterAccount } from '@/application/registerAccount';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { App } from './App';

describe('App · accesibilidad de la pantalla completa (FR-015, SC-005)', () => {
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
});

describe('App · REG-FR-001, 012, 014, 018, 022: registro y navegación', () => {
  beforeEach(() => window.history.replaceState(null, '', '/'));
  afterEach(() => window.history.replaceState(null, '', '/'));

  it('permite abrir registro desde login y regresar mediante un enlace real', async () => {
    const user = userEvent.setup();
    render(<App authenticate={createAuthStub().authenticate} />);
    await user.click(screen.getByRole('link', { name: 'Regístrate' }));
    expect(window.location.pathname).toBe('/register');
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeVisible();
    expect(screen.queryByText('Cuenta creada exitosamente')).not.toBeInTheDocument();
  });

  it('alta válida → /login con confirmación → autenticación en la misma instancia', async () => {
    window.history.replaceState(null, '', '/register');
    const gateway = new InMemoryAuthGateway(null, { delayMs: 0 });
    const user = userEvent.setup();
    const { container } = render(
      <App
        authenticate={createAuthenticate(gateway)}
        registerAccount={createRegisterAccount(gateway)}
      />,
    );
    await user.type(screen.getByLabelText('Nombre completo'), TEST_ACCOUNT.displayName);
    await user.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await user.type(screen.getByLabelText('Contraseña', { exact: true }), TEST_ACCOUNT.password);
    await user.type(screen.getByLabelText('Confirmar contraseña'), TEST_ACCOUNT.password);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Cuenta creada exitosamente');
    expect(window.location.pathname).toBe('/login');
    expect(window.location.search).toBe('');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toHaveFocus();
    await expectNoA11yViolations(container);
    await user.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await user.type(screen.getByLabelText('Contraseña'), TEST_ACCOUNT.password);
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByRole('heading', { name: /Bienvenido, Steven Luna/ })).toBeVisible();
    expect(screen.queryByText('Cuenta creada exitosamente')).not.toBeInTheDocument();
  });

  it('responde a Atrás/Adelante y retira el aviso transitorio', async () => {
    const { act } = await import('@testing-library/react');
    render(<App authenticate={createAuthStub().authenticate} />);
    await act(async () => {
      window.history.replaceState(null, '', '/register');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();
    await act(async () => {
      window.history.replaceState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeVisible();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('sin caso de uso de registro inyectado muestra indisponibilidad sin simular éxito', async () => {
    window.history.replaceState(null, '', '/register');
    const user = userEvent.setup();
    render(<App authenticate={createAuthStub().authenticate} />);
    await user.type(screen.getByLabelText('Nombre completo'), TEST_ACCOUNT.displayName);
    await user.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await user.type(screen.getByLabelText('Contraseña', { exact: true }), TEST_ACCOUNT.password);
    await user.type(screen.getByLabelText('Confirmar contraseña'), TEST_ACCOUNT.password);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo crear la cuenta');
    expect(window.location.pathname).toBe('/register');
  });
});
