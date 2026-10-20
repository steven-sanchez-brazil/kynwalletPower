import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '@/test/a11y';
import { TEST_ACCOUNT, TEST_REGISTRATION_DATA } from '@/test/fixtures';
import { InMemoryAccountStore } from '@/infrastructure/InMemoryAccountStore';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import { InMemoryRegistrationGateway } from '@/infrastructure/InMemoryRegistrationGateway';
import { createAuthenticate } from '@/application/authenticate';
import { createRegister } from '@/application/register';
import { App } from './App';

function buildApp(store = new InMemoryAccountStore([TEST_ACCOUNT])) {
  const authGateway = new InMemoryAuthGateway(store, { delayMs: 0 });
  const regGateway = new InMemoryRegistrationGateway(store, { delayMs: 0 });
  const authenticate = createAuthenticate(authGateway);
  const register = createRegister(regGateway);
  return { authenticate, register };
}

describe('App · accesibilidad de la pantalla completa (FR-015, SC-005)', () => {
  it('vista de login sin violaciones', async () => {
    const { authenticate, register } = buildApp();
    const { container } = render(<App authenticate={authenticate} register={register} />);
    await expectNoA11yViolations(container);
  });

  it('vista de login con errores visibles sin violaciones', async () => {
    const { authenticate, register } = buildApp();
    const { container } = render(<App authenticate={authenticate} register={register} />);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await userEvent.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });

  it('vista de bienvenida sin violaciones', async () => {
    const { authenticate, register } = buildApp();
    const { container } = render(<App authenticate={authenticate} register={register} />);
    await userEvent.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await userEvent.type(screen.getByLabelText('Contraseña'), TEST_ACCOUNT.password);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await screen.findByRole('heading', { name: /Bienvenido,/ });
    await expectNoA11yViolations(container);
  });
});

// ─── US4: Navegación bidireccional Login ↔ Registro ─────────────────────────

describe('App · US4 Navegación bidireccional Login ↔ Registro', () => {
  it('US4-1: clic en "Regístrate" en el login muestra el formulario de registro', async () => {
    const { authenticate, register } = buildApp();
    render(<App authenticate={authenticate} register={register} />);

    // Inicialmente se ve el formulario de login
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Regístrate' }));

    // Ahora se ve el formulario de registro
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Bienvenido de nuevo' })).not.toBeInTheDocument();
  });

  it('US4-2: clic en "Inicia sesión" en el registro regresa al formulario de login', async () => {
    const { authenticate, register } = buildApp();
    render(<App authenticate={authenticate} register={register} />);

    await userEvent.click(screen.getByRole('button', { name: 'Regístrate' }));
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeInTheDocument();
  });

  it('US4-3: tras registro exitoso se muestra el login con el correo pre-cargado', async () => {
    const { authenticate, register } = buildApp(new InMemoryAccountStore([]));
    render(<App authenticate={authenticate} register={register} />);

    await userEvent.click(screen.getByRole('button', { name: 'Regístrate' }));

    const fullName = screen.getByLabelText('Nombre completo');
    const email = screen.getByLabelText('Correo electrónico');
    const password = screen.getByLabelText(/^Contraseña$/i);
    const confirmPassword = screen.getByLabelText('Confirmar contraseña');
    const terms = screen.getByLabelText('Acepto los términos y condiciones');

    await userEvent.type(fullName, TEST_REGISTRATION_DATA.fullName);
    await userEvent.type(email, TEST_REGISTRATION_DATA.email);
    await userEvent.type(password, TEST_REGISTRATION_DATA.password);
    await userEvent.type(confirmPassword, TEST_REGISTRATION_DATA.confirmPassword);
    await userEvent.click(terms);
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    // Alerta de éxito y redirección al login
    await screen.findByRole('heading', { name: 'Bienvenido de nuevo' });
    expect(screen.getByRole('alert')).toHaveTextContent(
      '¡Registro exitoso! Redirigiendo a iniciar sesión...',
    );

    // El correo registrado aparece pre-cargado
    const loginEmail = screen.getByLabelText('Correo electrónico');
    expect(loginEmail).toHaveValue(TEST_REGISTRATION_DATA.email);
  });

  it('US4-4: el usuario recién registrado puede iniciar sesión inmediatamente', async () => {
    const store = new InMemoryAccountStore([]);
    const { authenticate, register } = buildApp(store);
    render(<App authenticate={authenticate} register={register} />);

    // Navegar al registro
    await userEvent.click(screen.getByRole('button', { name: 'Regístrate' }));

    // Completar el registro
    await userEvent.type(screen.getByLabelText('Nombre completo'), TEST_REGISTRATION_DATA.fullName);
    await userEvent.type(screen.getByLabelText('Correo electrónico'), TEST_REGISTRATION_DATA.email);
    await userEvent.type(screen.getByLabelText(/^Contraseña$/i), TEST_REGISTRATION_DATA.password);
    await userEvent.type(
      screen.getByLabelText('Confirmar contraseña'),
      TEST_REGISTRATION_DATA.confirmPassword,
    );
    await userEvent.click(screen.getByLabelText('Acepto los términos y condiciones'));
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    // Esperar redirección al login
    await screen.findByRole('heading', { name: 'Bienvenido de nuevo' });

    // Iniciar sesión con las credenciales recién registradas
    const loginPassword = screen.getByLabelText('Contraseña');
    await userEvent.type(loginPassword, TEST_REGISTRATION_DATA.password);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    // Bienvenida con el nombre registrado
    await screen.findByRole('heading', {
      name: `¡Bienvenido, ${TEST_REGISTRATION_DATA.fullName}!`,
    });
  });
});
