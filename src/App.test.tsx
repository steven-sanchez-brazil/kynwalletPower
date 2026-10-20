import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { VALID_REGISTRATION } from '@/test/registrationFixtures';
import { createRegisterUserStub } from '@/test/registrationStubs';
import { App } from './App';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

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

describe('App · registro y navegación (FR-017, FR-020, FR-023)', () => {
  it('US1-2: registro exitoso navega a /login y anuncia el flash exacto', async () => {
    window.history.replaceState(null, '', '/register');
    const registration = createRegisterUserStub();
    render(
      <App authenticate={createAuthStub().authenticate} registerUser={registration.registerUser} />,
    );
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Nombre completo'), VALID_REGISTRATION.fullName);
    await user.type(screen.getByLabelText('Correo electrónico'), VALID_REGISTRATION.email);
    await user.type(screen.getByLabelText(/^Contraseña$/), VALID_REGISTRATION.password);
    await user.type(
      screen.getByLabelText('Confirmar contraseña'),
      VALID_REGISTRATION.passwordConfirmation,
    );
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Cuenta creada correctamente. Ya puedes iniciar sesión.',
    );
    expect(window.location.pathname).toBe('/login');
    expect(screen.queryByLabelText('Confirmar contraseña')).not.toBeInTheDocument();
  });

  it('US6-1: el enlace conduce a /login y descarta el formulario', async () => {
    window.history.replaceState(null, '', '/register');
    render(
      <App
        authenticate={createAuthStub().authenticate}
        registerUser={createRegisterUserStub().registerUser}
      />,
    );
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Nombre completo'), 'Dato temporal');
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent('Dato temporal');
  });

  it('US6: responde a popstate entre /register y /login', () => {
    window.history.replaceState(null, '', '/register');
    render(
      <App
        authenticate={createAuthStub().authenticate}
        registerUser={createRegisterUserStub().registerUser}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
    act(() => {
      window.history.pushState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
  });
});
