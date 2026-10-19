import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAuthenticate } from '@/application/authenticate';
import { createRegisterAccount } from '@/application/registerAccount';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { NEW_REGISTRATION, TEST_ACCOUNT } from '@/test/fixtures';
import { createRegisterStub } from '@/test/registerStub';
import { renderWithRouter } from '@/test/renderWithRouter';
import { App } from './App';

function renderApp(route = '/', auth = createAuthStub()) {
  return renderWithRouter(
    <App authenticate={auth.authenticate} registerAccount={createRegisterStub().registerAccount} />,
    { route },
  );
}

/** Aplicación con el gateway real en memoria; una instancia nueva equivale a recargar la página. */
function renderRealApp(route = '/registro') {
  const gateway = new InMemoryAuthGateway([TEST_ACCOUNT], { delayMs: 0 });
  return renderWithRouter(
    <App
      authenticate={createAuthenticate(gateway)}
      registerAccount={createRegisterAccount(gateway, vi.fn())}
    />,
    { route },
  );
}

const SUCCESS_NOTICE = 'Cuenta creada. Ya puedes iniciar sesión.';

async function registerNewAccount(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nombre completo'), NEW_REGISTRATION.displayName);
  await user.type(screen.getByLabelText('Correo electrónico'), NEW_REGISTRATION.email);
  await user.type(screen.getByLabelText('Contraseña'), NEW_REGISTRATION.password);
  await user.type(screen.getByLabelText('Confirmar contraseña'), NEW_REGISTRATION.confirmPassword);
  await user.click(screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }));
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
}

async function signIn(user: ReturnType<typeof userEvent.setup>, email: string, password: string) {
  await user.type(screen.getByLabelText('Correo electrónico'), email);
  await user.type(screen.getByLabelText('Contraseña'), password);
  await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
}

describe('App · rutas del login (REG alias de ruta, FR-015)', () => {
  it.each(['/', '/login'])('REG: %s muestra el mismo login', (route) => {
    renderApp(route);
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });
});

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
});

describe('App · REG US1 Crear una cuenta de demostración (flujo completo)', () => {
  it('REG US1-1: registrar una cuenta nueva vuelve al login con el aviso de éxito', async () => {
    const user = userEvent.setup();
    renderRealApp();
    await registerNewAccount(user);
    expect(await screen.findByRole('heading', { name: 'Bienvenido de nuevo' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(SUCCESS_NOTICE);
  });

  it('REG US1-2 / SC-002: la cuenta nueva inicia sesión de inmediato con su nombre', async () => {
    const user = userEvent.setup();
    renderRealApp();
    await registerNewAccount(user);
    await screen.findByRole('heading', { name: 'Bienvenido de nuevo' });
    await signIn(user, NEW_REGISTRATION.email, NEW_REGISTRATION.password);
    expect(
      await screen.findByRole('heading', { name: '¡Bienvenido, Diego Martínez!' }),
    ).toBeVisible();
  });

  it('REG US1-4: la cuenta inicial sigue iniciando sesión después de registrar otra', async () => {
    const user = userEvent.setup();
    renderRealApp();
    await registerNewAccount(user);
    await screen.findByRole('heading', { name: 'Bienvenido de nuevo' });
    await signIn(user, TEST_ACCOUNT.email, TEST_ACCOUNT.password);
    expect(await screen.findByRole('heading', { name: '¡Bienvenido, Steven Luna!' })).toBeVisible();
  });

  it('REG US1-3 / FR-013: al recargar la cuenta nueva ya no existe y no queda el aviso', async () => {
    const user = userEvent.setup();
    const first = renderRealApp();
    await registerNewAccount(user);
    await screen.findByRole('heading', { name: 'Bienvenido de nuevo' });
    first.unmount();

    renderRealApp('/login');
    expect(screen.queryByText(SUCCESS_NOTICE)).not.toBeInTheDocument();
    await signIn(user, NEW_REGISTRATION.email, NEW_REGISTRATION.password);
    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos');
  });

  it('REG FR-009: el aviso desaparece al enviar el formulario de login', async () => {
    const user = userEvent.setup();
    renderRealApp();
    await registerNewAccount(user);
    expect(await screen.findByRole('status')).toHaveTextContent(SUCCESS_NOTICE);
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.queryByText(SUCCESS_NOTICE)).not.toBeInTheDocument();
  });
});

describe('App · REG US2 duplicados y envíos repetidos', () => {
  function renderWithGateway() {
    const gateway = new InMemoryAuthGateway([TEST_ACCOUNT], { delayMs: 0 });
    const register = vi.spyOn(gateway, 'register');
    renderWithRouter(
      <App
        authenticate={createAuthenticate(gateway)}
        registerAccount={createRegisterAccount(gateway, vi.fn())}
      />,
      { route: '/registro' },
    );
    return { gateway, register };
  }

  it('REG US2-5 / FR-007 / SC-003: un duplicado de una cuenta inicial no altera esa cuenta', async () => {
    const user = userEvent.setup();
    const { gateway } = renderWithGateway();
    await user.type(screen.getByLabelText('Nombre completo'), 'Intruso');
    await user.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email.toUpperCase());
    await user.type(screen.getByLabelText('Contraseña'), 'otra-clave-99');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'otra-clave-99');
    await user.click(screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByText('Este correo ya está registrado')).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Bienvenido de nuevo' })).not.toBeInTheDocument();
    await expect(
      gateway.authenticate({ email: TEST_ACCOUNT.email, password: TEST_ACCOUNT.password }),
    ).resolves.toMatchObject({ kind: 'success', displayName: 'Steven Luna' });
    await expect(
      gateway.authenticate({ email: TEST_ACCOUNT.email, password: 'otra-clave-99' }),
    ).resolves.toEqual({ kind: 'invalid-credentials' });
  });

  it('REG US1-5 / SC-003: dos envíos válidos seguidos crean una sola cuenta', async () => {
    const user = userEvent.setup();
    const { register } = renderWithGateway();
    await user.type(screen.getByLabelText('Nombre completo'), NEW_REGISTRATION.displayName);
    await user.type(screen.getByLabelText('Correo electrónico'), NEW_REGISTRATION.email);
    await user.type(screen.getByLabelText('Contraseña'), NEW_REGISTRATION.password);
    await user.type(
      screen.getByLabelText('Confirmar contraseña'),
      NEW_REGISTRATION.confirmPassword,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }));
    await user.dblClick(screen.getByRole('button', { name: 'Crear cuenta' }));
    await screen.findByRole('heading', { name: 'Bienvenido de nuevo' });
    expect(register).toHaveBeenCalledOnce();
  });
});

describe('App · REG US3 navegación entre vistas', () => {
  it.each([
    ['/', 'KynWallet · Iniciar sesión'],
    ['/login', 'KynWallet · Iniciar sesión'],
    ['/registro', 'KynWallet · Crear cuenta'],
    ['/nada', 'KynWallet · Página no encontrada'],
  ])('REG FR-012: el título del documento refleja la vista de %s', (route, title) => {
    renderApp(route);
    expect(document.title).toBe(title);
  });

  it('REG US3-1: /registro muestra el formulario y una ruta desconocida, la vista de no encontrada', () => {
    const { unmount } = renderApp('/registro');
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
    unmount();

    renderApp('/nada');
    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Crea tu cuenta' })).not.toBeInTheDocument();
  });

  it('REG US3-1 / FR-010: "Inicia sesión" lleva del registro al login sin recargar', async () => {
    const user = userEvent.setup();
    renderApp('/registro');
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
  });

  it('REG FR-016: "Regístrate" lleva del login al registro sin recargar', async () => {
    const user = userEvent.setup();
    renderApp('/login');
    await user.click(screen.getByRole('link', { name: 'Regístrate' }));
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
  });

  it('REG FR-012 / US3-4: al cambiar de vista el foco pasa al encabezado nuevo', async () => {
    const user = userEvent.setup();
    renderApp('/login');
    await user.click(screen.getByRole('link', { name: 'Regístrate' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Crea tu cuenta' })).toHaveFocus();
  });

  it('REG FR-009: el aviso de éxito no reaparece si se sale del login y se vuelve', async () => {
    const user = userEvent.setup();
    renderRealApp();
    await registerNewAccount(user);
    expect(await screen.findByRole('status')).toHaveTextContent(SUCCESS_NOTICE);
    await user.click(screen.getByRole('link', { name: 'Regístrate' }));
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    expect(screen.queryByText(SUCCESS_NOTICE)).not.toBeInTheDocument();
  });

  it('REG US3-4 / SC-004: el registro, con errores y el login con aviso no tienen violaciones', async () => {
    const user = userEvent.setup();
    const registro = renderApp('/registro');
    await expectNoA11yViolations(registro.container);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await expectNoA11yViolations(registro.container);
    registro.unmount();

    const flow = renderRealApp();
    await registerNewAccount(user);
    await screen.findByRole('status');
    await expectNoA11yViolations(flow.container);
  });
});
