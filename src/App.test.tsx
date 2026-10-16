import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAuthenticate } from '@/application/authenticate';
import { createRegister } from '@/application/register';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { App } from './App';

/** App con el adaptador en memoria real, sin espera simulada. */
function renderApp(path = '/') {
  window.history.replaceState(null, '', path);
  const gateway = new InMemoryAuthGateway([TEST_ACCOUNT], { delayMs: 0 });
  return render(
    <App authenticate={createAuthenticate(gateway)} register={createRegister(gateway)} />,
  );
}

const loginHeading = () => screen.findByRole('heading', { name: 'Bienvenido de nuevo' });
const registerHeading = () => screen.findByRole('heading', { name: 'Crea tu cuenta' });

async function registerAccount(email = 'diego@example.test') {
  await userEvent.type(screen.getByLabelText('Nombre completo'), 'Diego Martínez');
  await userEvent.type(screen.getByLabelText('Correo electrónico'), email);
  await userEvent.type(screen.getByLabelText('Contraseña'), 'clave-segura');
  await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'clave-segura');
  await userEvent.click(screen.getByRole('checkbox', { name: /Acepto los términos/ }));
  await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
}

describe('App · rutas (002 FR-016)', () => {
  it.each(['/', '/desconocida'])(
    'US4-3: "%s" redirige a /login sin agregar historial',
    async (path) => {
      const before = window.history.length;
      renderApp(path);
      await loginHeading();
      expect(window.location.pathname).toBe('/login');
      expect(window.history.length).toBe(before);
    },
  );

  it('US4-5: /registro abre directamente la pantalla de registro', async () => {
    renderApp('/registro');
    await registerHeading();
    expect(
      screen.getByText((_, element) => element?.textContent === 'Comienza tucamino financiero.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Crea tu cuenta en minutos y empieza a enviar, recibir y administrar tu dinero desde cualquier lugar.',
      ),
    ).toBeInTheDocument();
  });

  it('US4-1 y US4-2: los enlaces llevan de una pantalla a la otra', async () => {
    renderApp('/login');
    await userEvent.click(screen.getByRole('link', { name: 'Regístrate' }));
    await registerHeading();
    expect(window.location.pathname).toBe('/registro');

    await userEvent.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    await loginHeading();
    expect(window.location.pathname).toBe('/login');
  });

  it('US4-4: atrás y adelante del navegador cambian de pantalla', async () => {
    renderApp('/login');
    await userEvent.click(screen.getByRole('link', { name: 'Regístrate' }));
    await registerHeading();

    act(() => {
      window.history.replaceState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await loginHeading();
  });

  it('el título del documento corresponde a la pantalla', async () => {
    renderApp('/registro');
    await registerHeading();
    expect(document.title).toBe('KynWallet · Crear cuenta');

    await userEvent.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    await loginHeading();
    expect(document.title).toBe('KynWallet · Iniciar sesión');
  });
});

describe('App · registro de punta a punta (002 US1, US3)', () => {
  it('US1-1 y US1-2: registrarse, ver el éxito en /login e iniciar sesión con la cuenta', async () => {
    renderApp('/registro');
    await registerAccount();

    await loginHeading();
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('status')).toHaveTextContent(
      '¡Cuenta creada con éxito! Ya puedes iniciar sesión.',
    );

    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'diego@example.test');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'clave-segura');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(
      await screen.findByRole('heading', { name: '¡Bienvenido, Diego Martínez!' }),
    ).toBeInTheDocument();
  });

  it('el mensaje de éxito desaparece al volver a /registro', async () => {
    renderApp('/registro');
    await registerAccount();
    await loginHeading();

    await userEvent.click(screen.getByRole('link', { name: 'Regístrate' }));
    await registerHeading();
    await userEvent.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    await loginHeading();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('US3-1: el correo de una cuenta demo no se puede registrar', async () => {
    renderApp('/registro');
    await registerAccount(TEST_ACCOUNT.email);
    expect(await screen.findByText('Ya existe una cuenta con este correo')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/registro');
  });
});

describe('App · accesibilidad de la pantalla completa (FR-015, SC-005)', () => {
  it('vista de login sin violaciones', async () => {
    const { container } = renderApp('/login');
    await expectNoA11yViolations(container);
  });

  it('vista de login con errores visibles sin violaciones', async () => {
    const { container } = renderApp('/login');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await userEvent.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });

  it('vista de bienvenida sin violaciones', async () => {
    window.history.replaceState(null, '', '/login');
    const stub = createAuthStub();
    const { container } = render(
      <App authenticate={stub.authenticate} register={async () => ({ kind: 'success' })} />,
    );
    await userEvent.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await userEvent.type(screen.getByLabelText('Contraseña'), TEST_ACCOUNT.password);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await screen.findByRole('heading', { name: /Bienvenido,/ });
    await expectNoA11yViolations(container);
  });

  it('002 FR-021: registro vacío y con errores sin violaciones', async () => {
    const { container } = renderApp('/registro');
    await expectNoA11yViolations(container);
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await expectNoA11yViolations(container);
  });

  it('002 FR-021: login con mensaje de éxito sin violaciones', async () => {
    const { container } = renderApp('/registro');
    await registerAccount();
    await loginHeading();
    await expectNoA11yViolations(container);
  });
});
