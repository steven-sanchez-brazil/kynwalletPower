import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { REGISTRATION_DATA, TEST_ACCOUNT } from '@/test/fixtures';
import { createRegisterStub } from '@/test/registerStub';
import { App } from './App';

function renderApp(path = '/login') {
  window.history.replaceState(null, '', path);
  const user = userEvent.setup();
  const auth = createAuthStub();
  const registerStub = createRegisterStub();
  const view = render(<App authenticate={auth.authenticate} register={registerStub.register} />);
  return { user, auth, registerStub, ...view };
}

async function fillRegistration(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nombre completo'), REGISTRATION_DATA.name);
  await user.type(screen.getByLabelText('Correo electrónico'), REGISTRATION_DATA.email);
  await user.type(screen.getByLabelText('Contraseña'), REGISTRATION_DATA.password);
  await user.type(screen.getByLabelText('Confirmar contraseña'), REGISTRATION_DATA.password);
  await user.click(screen.getByRole('checkbox', { name: /Acepto los términos y condiciones/ }));
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
}

describe('App · navegación entre login y registro (FR-020)', () => {
  it('US5-2: la raíz "/" redirige a /login', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });

  it('FR-020: una dirección desconocida redirige a /login', () => {
    renderApp('/otra-cosa');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });

  it('FR-020: abrir /registro muestra el registro', () => {
    renderApp('/registro');
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
  });

  it('FR-020: "Regístrate" en el login lleva a /registro', async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole('button', { name: 'Regístrate' }));
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/registro');
  });

  it('US5-1/FR-020: "Inicia sesión" en el registro lleva a /login', async () => {
    const { user } = renderApp('/registro');
    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });

  it('FR-020: atrás y adelante del navegador alternan las pantallas', async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole('button', { name: 'Regístrate' }));
    window.history.back();
    expect(await screen.findByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    window.history.forward();
    expect(await screen.findByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
  });

  it('FR-001: cada pantalla muestra su propio titular en el panel de marca', async () => {
    const { user } = renderApp();
    expect(screen.getByText(/sin fronteras\./)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Regístrate' }));
    expect(screen.getByText(/camino financiero\./)).toBeInTheDocument();
    expect(screen.queryByText(/sin fronteras\./)).not.toBeInTheDocument();
  });
});

describe('App · registro exitoso redirige a /login con mensaje (FR-013, US1-1)', () => {
  const message = '¡Cuenta creada, Diego Martínez! Ahora puedes iniciar sesión.';

  it('US1-1: tras registrarse se muestra el login en /login con el mensaje de éxito', async () => {
    const { user } = renderApp('/registro');
    await fillRegistration(user);
    expect(await screen.findByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('status')).toHaveTextContent(message);
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('');
  });

  it('US1-5: el mensaje desaparece al escribir en el login', async () => {
    const { user } = renderApp('/registro');
    await fillRegistration(user);
    await screen.findByText(message);
    await user.type(screen.getByLabelText('Correo electrónico'), 'a');
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it('US1-5: el mensaje no vuelve al navegar a otra pantalla y regresar', async () => {
    const { user } = renderApp('/registro');
    await fillRegistration(user);
    await screen.findByText(message);
    await user.click(screen.getByRole('button', { name: 'Regístrate' }));
    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });
});

describe('App · accesibilidad de la pantalla completa (FR-015, SC-005)', () => {
  it('vista de login sin violaciones', async () => {
    const { container } = renderApp();
    await expectNoA11yViolations(container);
  });

  it('vista de login con errores visibles sin violaciones', async () => {
    const { container, user } = renderApp();
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await user.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });

  it('vista de bienvenida sin violaciones', async () => {
    const { container, user } = renderApp();
    await user.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await user.type(screen.getByLabelText('Contraseña'), TEST_ACCOUNT.password);
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await screen.findByRole('heading', { name: /Bienvenido,/ });
    await expectNoA11yViolations(container);
  });

  it('UI-12: pantalla de registro sin violaciones, también con errores visibles', async () => {
    const { container, user } = renderApp('/registro');
    await expectNoA11yViolations(container);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await expectNoA11yViolations(container);
  });

  it('UI-12: login con el mensaje de éxito sin violaciones', async () => {
    const { container, user } = renderApp('/registro');
    await fillRegistration(user);
    await screen.findByText(/Cuenta creada/);
    await expectNoA11yViolations(container);
  });
});
