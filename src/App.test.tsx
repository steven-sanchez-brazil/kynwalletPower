import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { createAuthStub } from '@/test/authStub';
import { TEST_ACCOUNT } from '@/test/fixtures';
import type { RegisterAccount } from '@/application/registerAccount';
import { App } from './App';

const registerAccount: RegisterAccount = vi.fn().mockResolvedValue({ kind: 'success' });

beforeEach(() => {
  window.history.replaceState(null, '', '/login');
});

describe('App · accesibilidad de la pantalla completa (FR-015, SC-005)', () => {
  it('vista de login sin violaciones', async () => {
    const { container } = render(
      <App authenticate={createAuthStub().authenticate} registerAccount={registerAccount} />,
    );
    await expectNoA11yViolations(container);
  });

  it('vista de login con errores visibles sin violaciones', async () => {
    const { container } = render(
      <App authenticate={createAuthStub().authenticate} registerAccount={registerAccount} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await userEvent.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });

  it('vista de bienvenida sin violaciones', async () => {
    const { container } = render(
      <App authenticate={createAuthStub().authenticate} registerAccount={registerAccount} />,
    );
    await userEvent.type(screen.getByLabelText('Correo electrónico'), TEST_ACCOUNT.email);
    await userEvent.type(screen.getByLabelText('Contraseña'), TEST_ACCOUNT.password);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await screen.findByRole('heading', { name: /Bienvenido,/ });
    await expectNoA11yViolations(container);
  });
});

describe('App · registro y navegación (FR-011, FR-016)', () => {
  it('abre /registro, simula el alta y vuelve a /login con aviso temporal', async () => {
    window.history.replaceState(null, '', '/registro');
    const user = userEvent.setup();
    render(<App authenticate={createAuthStub().authenticate} registerAccount={registerAccount} />);
    await user.type(screen.getByRole('textbox', { name: 'Nombre completo' }), 'Ana Pérez');
    await user.type(screen.getByRole('textbox', { name: 'Correo electrónico' }), 'ana@example.com');
    await user.type(screen.getByLabelText('Contraseña', { exact: true }), 'clave1234');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'clave1234');
    await user.click(screen.getByRole('checkbox', { name: /Acepto los términos y condiciones/ }));
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(
      await screen.findByText('Registro de demostración completado. No se creó una cuenta real.'),
    ).toBeVisible();
    expect(window.location.pathname).toBe('/login');
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('');
  });

  it('navega en ambos sentidos con los vínculos visibles', async () => {
    const user = userEvent.setup();
    render(<App authenticate={createAuthStub().authenticate} registerAccount={registerAccount} />);
    await user.click(screen.getByRole('link', { name: 'Regístrate' }));
    expect(window.location.pathname).toBe('/registro');
    await user.click(screen.getByRole('link', { name: 'Inicia sesión' }));
    expect(window.location.pathname).toBe('/login');
  });

  it('sincroniza la vista cuando el navegador retrocede o avanza', () => {
    render(<App authenticate={createAuthStub().authenticate} registerAccount={registerAccount} />);
    window.history.replaceState(null, '', '/registro');
    act(() => window.dispatchEvent(new PopStateEvent('popstate')));
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();
    window.history.replaceState(null, '', '/login');
    act(() => window.dispatchEvent(new PopStateEvent('popstate')));
    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeVisible();
  });

  it('la vista de registro con errores y términos no tiene violaciones automáticas', async () => {
    window.history.replaceState(null, '', '/registro');
    const user = userEvent.setup();
    const { container } = render(
      <App authenticate={createAuthStub().authenticate} registerAccount={registerAccount} />,
    );
    await expectNoA11yViolations(container);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    await expectNoA11yViolations(container);
    await user.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    await expectNoA11yViolations(screen.getByRole('dialog', { name: /Términos y condiciones/ }));
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    await user.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });
});
