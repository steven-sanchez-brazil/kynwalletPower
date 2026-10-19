import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAuthenticate } from '@/application/authenticate';
import { createRegisterAccount } from '@/application/registerAccount';
import type { DemoAccount } from '@/domain/auth';
import { InMemoryAccountRegistry } from '@/infrastructure/InMemoryAccountRegistry';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { createRegisterStub } from '@/test/registerStub';
import { App } from './App';

function renderApp(path = '/') {
  window.history.replaceState(null, '', path);
  return render(
    <App
      authenticate={createAuthStub().authenticate}
      registerAccount={createRegisterStub().registerAccount}
    />,
  );
}

/** App con los casos de uso y adaptadores reales sobre una lista compartida (research.md R4). */
function renderRealApp(path: string) {
  window.history.replaceState(null, '', path);
  const accounts: DemoAccount[] = [TEST_ACCOUNT];
  render(
    <App
      authenticate={createAuthenticate(new InMemoryAuthGateway(accounts, { delayMs: 0 }))}
      registerAccount={createRegisterAccount(new InMemoryAccountRegistry(accounts, { delayMs: 0 }))}
    />,
  );
}

describe('App · accesibilidad de la pantalla completa (FR-015, SC-005)', () => {
  it('vista de login sin violaciones', async () => {
    const { container } = renderApp();
    await expectNoA11yViolations(container);
  });

  it('vista de login con errores visibles sin violaciones', async () => {
    const { container } = renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await userEvent.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });

  it('vista de bienvenida sin violaciones', async () => {
    const { container } = renderApp();
    await userEvent.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await userEvent.type(screen.getByLabelText('Contraseña'), TEST_ACCOUNT.password);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await screen.findByRole('heading', { name: /Bienvenido,/ });
    await expectNoA11yViolations(container);
  });

  it('002 SC-004: vista de registro sin violaciones', async () => {
    const { container } = renderApp('/registro');
    await expectNoA11yViolations(container);
  });
});

describe('App · rutas (002 US3)', () => {
  it('US3-4: /registro muestra la pantalla de registro con su panel de marca', () => {
    renderApp('/registro');
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(screen.getByText(/Comienza tu/)).toBeInTheDocument();
  });

  it.each(['/', '/login', '/otra'])('FR-017: %s muestra el login', (path) => {
    renderApp(path);
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
  });

  it.each([
    ['/registro', 'KynWallet · Crear cuenta'],
    ['/login', 'KynWallet · Iniciar sesión'],
  ])('FR-020: %s actualiza el título del documento', (path, title) => {
    renderApp(path);
    expect(document.title).toBe(title);
  });

  it('US3-1: "Inicia sesión" navega a /login sin mensajes', async () => {
    renderApp('/registro');
    await userEvent.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('US3-2 y US3-3: "Regístrate" navega a /registro y Atrás vuelve al login', async () => {
    renderApp('/login');
    await userEvent.click(screen.getByRole('link', { name: 'Regístrate' }));
    expect(window.location.pathname).toBe('/registro');
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();

    act(() => {
      window.history.replaceState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
  });
});

describe('App · flujo completo registro → login (002 US1)', () => {
  const NEW_USER = {
    fullName: '  Diego   Martínez ',
    email: 'Diego.Martinez@Example.test',
    password: 'fixture-pass-02',
  };

  it('US1-1 y US1-3: registra, redirige a /login con éxito y permite iniciar sesión', async () => {
    const user = userEvent.setup();
    renderRealApp('/registro');

    await user.type(screen.getByLabelText('Nombre completo'), NEW_USER.fullName);
    await user.type(screen.getByLabelText('Correo electrónico'), NEW_USER.email);
    await user.type(screen.getByLabelText('Contraseña'), NEW_USER.password);
    await user.type(screen.getByLabelText('Confirmar contraseña'), NEW_USER.password);
    await user.click(screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      '¡Cuenta creada con éxito! Inicia sesión para continuar.',
    );
    expect(window.location.pathname).toBe('/login');
    expect(window.location.href).not.toContain('registered');

    await user.type(screen.getByLabelText('Correo electrónico'), NEW_USER.email);
    await user.type(screen.getByLabelText('Contraseña'), NEW_USER.password);
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(
      await screen.findByRole('heading', { name: '¡Bienvenido, Diego Martínez!' }),
    ).toBeVisible();
  });

  it('FR-014: un correo ya registrado no navega y muestra el mensaje genérico', async () => {
    const user = userEvent.setup();
    renderRealApp('/registro');

    await user.type(screen.getByLabelText('Nombre completo'), 'Steven Luna');
    await user.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await user.type(screen.getByLabelText('Contraseña'), NEW_USER.password);
    await user.type(screen.getByLabelText('Confirmar contraseña'), NEW_USER.password);
    await user.click(screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/No pudimos crear la cuenta/);
    expect(window.location.pathname).toBe('/registro');
  });
});
