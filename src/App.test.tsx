import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAuthenticate } from '@/application/authenticate';
import { createRegisterUser } from '@/application/registerUser';
import { InMemoryAuthGateway } from '@/infrastructure/InMemoryAuthGateway';
import {
  LocalStorageUserGateway,
  REGISTERED_USERS_STORAGE_KEY,
} from '@/infrastructure/LocalStorageUserGateway';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { TEST_ACCOUNT } from '@/test/fixtures';
import { App } from './App';

describe('App · accesibilidad y flujo completo Login ↔ Registro (FR-010, FR-011, FR-012, FR-014, SC-005, SC-006)', () => {
  beforeEach(() => {
    window.localStorage.clear();
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

  it('US1-3, US1-4, US1-5 y SC-006: navega a Registro, registra usuario en localStorage sin exponer contraseña en texto plano, redirige a Login y permite iniciar sesión', async () => {
    const user = userEvent.setup();
    const authenticate = createAuthenticate(
      new InMemoryAuthGateway([TEST_ACCOUNT], { delayMs: 0 }),
    );
    const registerUser = createRegisterUser(new LocalStorageUserGateway([TEST_ACCOUNT]));
    const secret = 'KynWallet2026!';

    const { container } = render(<App authenticate={authenticate} registerUser={registerUser} />);

    // US1-5: ir a Registro desde Login
    await user.click(screen.getByRole('button', { name: 'Regístrate' }));
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();
    await expectNoA11yViolations(container);

    // US1-5: volver a Login y regresar a Registro
    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Regístrate' }));

    // US1-1 / US1-2 / US1-3: completar formulario de registro
    await user.type(screen.getByLabelText('Nombres Completos'), 'Ana Gómez');
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana.gomez@example.test');
    await user.type(screen.getByLabelText('Contraseña'), secret);
    await user.type(screen.getByLabelText('Confirmar contraseña'), secret);

    const createBtn = screen.getByRole('button', { name: 'Crear Cuenta' });
    expect(createBtn).toBeDisabled();

    await user.click(screen.getByRole('checkbox', { name: /Acepto los términos y condiciones/i }));
    expect(createBtn).toBeEnabled();

    await user.click(createBtn);

    // Redirige a Login
    expect(await screen.findByRole('heading', { name: 'Bienvenido de nuevo' })).toBeVisible();

    // SC-006 / FR-011: verificar que se guardó en localStorage pero NUNCA con la contraseña en texto plano
    const storedRaw = window.localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
    expect(storedRaw).not.toBeNull();
    expect(storedRaw).toContain('ana.gomez@example.test');
    expect(storedRaw).toContain('Ana Gómez');
    expect(storedRaw).not.toContain(secret);
    expect(document.body.textContent ?? '').not.toContain(secret);
    expect(window.location.href).not.toContain(secret);

    // US1-4 / FR-012: iniciar sesión con la cuenta recién registrada
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana.gomez@example.test');
    await user.type(screen.getByLabelText('Contraseña'), secret);
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(
      await screen.findByRole('heading', { name: '¡Bienvenido, Ana Gómez!' }),
    ).toBeInTheDocument();
  });
});
