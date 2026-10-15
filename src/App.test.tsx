import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { MESSAGES } from '@/domain/messages';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { TEST_ACCOUNT, VALID_REGISTRATION } from '@/test/fixtures';
import { createRegisterStub } from '@/test/registerStub';
import { App } from './App';

function renderApp(path: string, registerStub = createRegisterStub()) {
  const user = userEvent.setup();
  const view = render(
    <MemoryRouter initialEntries={[path]}>
      <App authenticate={createAuthStub().authenticate} register={registerStub.register} />
    </MemoryRouter>,
  );
  return { user, ...view };
}

const loginHeading = () => screen.findByRole('heading', { level: 1, name: 'Bienvenido de nuevo' });
const registerHeading = () => screen.findByRole('heading', { level: 1, name: 'Crea tu cuenta' });

async function registerValidAccount(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nombre completo'), VALID_REGISTRATION.fullName);
  await user.type(screen.getByLabelText('Correo electrónico'), VALID_REGISTRATION.email);
  await user.type(screen.getByLabelText('Contraseña'), VALID_REGISTRATION.password);
  await user.type(screen.getByLabelText('Confirmar contraseña'), VALID_REGISTRATION.password);
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
}

describe('App · rutas (002 FR-023, 001 FR-021)', () => {
  it.each(['/', '/abc'])('FR-023: %s redirige a /login', async (path) => {
    renderApp(path);
    expect(await loginHeading()).toBeInTheDocument();
    expect(document.title).toBe('KynWallet · Iniciar sesión');
  });

  it('FR-023: /registro muestra el registro con su título', async () => {
    renderApp('/registro');
    expect(await registerHeading()).toBeInTheDocument();
    expect(document.title).toBe('KynWallet · Crear cuenta');
  });

  it('001 US6-1: "Regístrate" lleva a /registro', async () => {
    const { user } = renderApp('/login');
    await user.click(screen.getByRole('link', { name: 'Regístrate' }));
    expect(await registerHeading()).toBeInTheDocument();
  });

  it('US6-1: "Inicia sesión" lleva a /login sin mensaje de éxito', async () => {
    const { user } = renderApp('/registro');
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(await loginHeading()).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES.REGISTRATION_SUCCESS)).not.toBeInTheDocument();
  });
});

describe('App · registro exitoso (US1-1, US1-5, 001 US7)', () => {
  it('US1-1 / 001 US7-1: redirige a /login con el aviso emergente fuera del formulario', async () => {
    const { user } = renderApp('/registro');
    await registerValidAccount(user);
    expect(await loginHeading()).toBeInTheDocument();
    const toast = screen.getByRole('status');
    expect(toast).toHaveTextContent(MESSAGES.REGISTRATION_SUCCESS);
    expect(screen.getByRole('main')).not.toContainElement(toast);
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('');
  });

  it('001 US7-3: "Cerrar aviso" oculta el aviso de inmediato', async () => {
    const { user } = renderApp('/registro');
    await registerValidAccount(user);
    await loginHeading();
    await user.click(screen.getByRole('button', { name: 'Cerrar aviso' }));
    expect(screen.queryByText(MESSAGES.REGISTRATION_SUCCESS)).not.toBeInTheDocument();
  });

  it('US1-5: el mensaje no reaparece al volver a /login por otra vía', async () => {
    const { user } = renderApp('/registro');
    await registerValidAccount(user);
    await loginHeading();
    await user.click(screen.getByRole('link', { name: 'Regístrate' }));
    await user.click(await screen.findByRole('link', { name: 'Inicia sesión' }));
    expect(await loginHeading()).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES.REGISTRATION_SUCCESS)).not.toBeInTheDocument();
  });

  it('US2-1: un registro rechazado no redirige', async () => {
    const { user } = renderApp('/registro', createRegisterStub({ kind: 'rejected' }));
    await registerValidAccount(user);
    expect(await screen.findByRole('alert')).toHaveTextContent(MESSAGES.REGISTRATION_REJECTED);
    expect(screen.getByRole('heading', { level: 1, name: 'Crea tu cuenta' })).toBeInTheDocument();
  });
});

describe('App · accesibilidad de las pantallas completas (SC-005)', () => {
  it('login sin violaciones', async () => {
    const { container } = renderApp('/login');
    await loginHeading();
    await expectNoA11yViolations(container);
  });

  it('login con errores visibles sin violaciones', async () => {
    const { user, container } = renderApp('/login');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await user.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });

  it('login tras un registro exitoso sin violaciones', async () => {
    const { user, container } = renderApp('/registro');
    await registerValidAccount(user);
    await loginHeading();
    await expectNoA11yViolations(container);
  });

  it('bienvenida del login sin violaciones', async () => {
    const { user, container } = renderApp('/login');
    await user.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await user.type(screen.getByLabelText('Contraseña'), TEST_ACCOUNT.password);
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await screen.findByRole('heading', { name: /Bienvenido,/ });
    await expectNoA11yViolations(container);
  });

  it('registro con errores visibles sin violaciones', async () => {
    const { user, container } = renderApp('/registro');
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await expectNoA11yViolations(container);
  });
});
