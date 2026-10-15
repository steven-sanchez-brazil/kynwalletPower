import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAuthenticate } from '@/application/authenticate';
import { createRegister } from '@/application/register';
import type { DemoAccount } from '@/domain/auth';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { InMemoryRegistrationGateway } from '@/infrastructure/InMemoryRegistrationGateway';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { createRegistrationStub } from '@/test/registrationStub';
import { App } from './App';

const SUCCESS = 'Cuenta creada correctamente. Ya puedes iniciar sesión.';
const NEW_USER = {
  fullName: 'Diego Martínez',
  email: 'diego.martinez@example.test',
  password: 'fixture-pass-02',
};

function renderApp(path = '/login') {
  window.history.replaceState(null, '', path);
  return render(
    <App
      authenticate={createAuthStub().authenticate}
      register={createRegistrationStub().register}
    />,
  );
}

/** App con los adaptadores reales en memoria y sin espera (integración de 001 y 002). */
function renderIntegrated(path = '/registro') {
  window.history.replaceState(null, '', path);
  const accounts: DemoAccount[] = [{ ...TEST_ACCOUNT }];
  const options = { delayMs: 0 };
  render(
    <App
      authenticate={createAuthenticate(new InMemoryAuthGateway(accounts, options))}
      register={createRegister(new InMemoryRegistrationGateway(accounts, options))}
    />,
  );
}

async function registerNewUser(user: ReturnType<typeof userEvent.setup>, email = NEW_USER.email) {
  await user.type(screen.getByLabelText('Nombre completo'), NEW_USER.fullName);
  await user.type(screen.getByLabelText('Correo electrónico'), email);
  await user.type(screen.getByLabelText('Contraseña'), NEW_USER.password);
  await user.type(screen.getByLabelText('Confirmar contraseña'), NEW_USER.password);
  await user.click(screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' }));
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
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

describe('App · 002 US1 Crear una cuenta (integración con los adaptadores en memoria)', () => {
  it('US1-1 / US1-3: registro exitoso → /login con mensaje y la cuenta nueva inicia sesión', async () => {
    const user = userEvent.setup();
    renderIntegrated();
    await registerNewUser(user);

    expect(await screen.findByRole('status')).toHaveTextContent(SUCCESS);
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { level: 1, name: 'Bienvenido de nuevo' })).toBeVisible();

    await user.type(screen.getByLabelText('Correo electrónico'), NEW_USER.email);
    await user.type(screen.getByLabelText('Contraseña'), NEW_USER.password);
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(
      await screen.findByRole('heading', { name: '¡Bienvenido, Diego Martínez!' }),
    ).toBeInTheDocument();
  });

  it('US1-5: el mensaje de éxito desaparece al enviar el login', async () => {
    const user = userEvent.setup();
    renderIntegrated();
    await registerNewUser(user);
    await screen.findByText(SUCCESS);
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.queryByText(SUCCESS)).not.toBeInTheDocument();
  });

  it('US3-1: el correo de una cuenta existente se rechaza y la URL no cambia', async () => {
    const user = userEvent.setup();
    renderIntegrated();
    await registerNewUser(user, TEST_ACCOUNT.email.toUpperCase());
    expect(await screen.findByText('Ya existe una cuenta con este correo')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/registro');
  });
});

describe('App · 002 US4 Navegar entre registro e inicio de sesión', () => {
  it('US4-1: "Inicia sesión" lleva a /login', async () => {
    renderApp('/registro');
    await userEvent.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
  });

  it('US4-2 / US4-5: "Regístrate" lleva a /registro, cambia el título y enfoca el nombre', async () => {
    renderApp('/login');
    await userEvent.click(screen.getByRole('button', { name: 'Regístrate' }));
    expect(window.location.pathname).toBe('/registro');
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(screen.getByText('camino financiero.', { exact: false })).toBeInTheDocument();
    expect(document.title).toBe('KynWallet · Crear cuenta');
    expect(screen.getByLabelText('Nombre completo')).toHaveFocus();
  });

  it('US4-3: abrir /registro directamente muestra el registro sin mover el foco', () => {
    renderApp('/registro');
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).not.toHaveFocus();
  });

  it('US4-3: una ruta desconocida lleva a /login', () => {
    renderApp('/otra-ruta');
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
  });

  it('US4-4: atrás del navegador vuelve a la pantalla anterior', async () => {
    renderApp('/login');
    await userEvent.click(screen.getByRole('button', { name: 'Regístrate' }));
    act(() => {
      window.history.replaceState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    expect(document.title).toBe('KynWallet · Iniciar sesión');
  });
});
