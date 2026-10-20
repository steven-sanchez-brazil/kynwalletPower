import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { RegisterForm } from './RegisterForm';

function setup() {
  const onSuccess = vi.fn();
  const onLogin = vi.fn();
  const user = userEvent.setup();
  const view = render(<RegisterForm onSuccess={onSuccess} onLogin={onLogin} />);
  return { user, view, onSuccess, onLogin };
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez');
  await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com');
  await user.type(screen.getByLabelText('Contraseña', { exact: true }), 'secreto123');
  await user.type(screen.getByLabelText('Confirmar contraseña'), 'secreto123');
  await user.click(screen.getByRole('checkbox', { name: /Acepto los términos/ }));
}

describe('RegisterForm · registro simulado', () => {
  it('muestra errores inline de todos los campos vacíos', async () => {
    const { user, onSuccess } = setup();
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByText('Ingresa tu nombre completo')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu correo electrónico')).toBeInTheDocument();
    expect(screen.getByText('Ingresa una contraseña')).toBeInTheDocument();
    expect(screen.getByText('Confirma tu contraseña')).toBeInTheDocument();
    expect(screen.getByText('Debes aceptar los términos y condiciones')).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('formulario válido comunica éxito una vez', async () => {
    const { user, onSuccess } = setup();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('Google y Apple muestran el alert Próximamente', async () => {
    const spy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    try {
      const { user } = setup();
      await user.click(screen.getByRole('button', { name: 'Google' }));
      await user.click(screen.getByRole('button', { name: 'Apple' }));
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('Próximamente');
    } finally { spy.mockRestore(); }
  });

  it('el enlace al login funciona y es accesible', async () => {
    const { user, view, onLogin } = setup();
    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(onLogin).toHaveBeenCalledOnce();
    await expectNoA11yViolations(view.container);
  });
});
