import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RegisterAccount } from '@/application/registerAccount';
import { REGISTRATION_MESSAGES, type RegistrationResult } from '@/domain/registration';
import { MESSAGES } from '@/domain/messages';
import { expectNoA11yViolations } from '@/test/a11y';
import { RegisterForm } from './RegisterForm';
import { RegisterScreen } from './RegisterScreen';

function setup(result: RegistrationResult = { kind: 'success' }) {
  const user = userEvent.setup();
  const registerAccount = vi.fn<RegisterAccount>().mockResolvedValue(result);
  const onSuccess = vi.fn();
  const view = render(<RegisterForm registerAccount={registerAccount} onSuccess={onSuccess} />);
  const fullName = screen.getByLabelText('Nombre completo');
  const email = screen.getByLabelText('Correo electrónico');
  const password = screen.getByLabelText('Contraseña');
  const confirmPassword = screen.getByLabelText('Confirmar contraseña');
  const terms = screen.getByRole('checkbox', { name: 'Acepto los términos y condiciones' });
  const submit = () => user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  const fill = async () => {
    await user.type(fullName, 'Diego Martínez');
    await user.type(email, 'diego@example.test');
    await user.type(password, 'Clave-segura-123');
    await user.type(confirmPassword, 'Clave-segura-123');
    await user.click(terms);
  };
  return {
    ...view,
    user,
    registerAccount,
    onSuccess,
    fullName,
    email,
    password,
    confirmPassword,
    terms,
    submit,
    fill,
  };
}

describe('RegisterForm · REG-US1 creación', () => {
  it('REG-US1-1: muestra formulario, contraseñas ocultas, términos y ruta al login', () => {
    const { fullName, email, password, confirmPassword, terms } = setup();
    expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
    expect(screen.getByText('Completa tus datos para comenzar')).toBeInTheDocument();
    expect(fullName).toHaveAttribute('placeholder', 'Ej. Diego Martínez');
    expect(fullName).toHaveAttribute('autocomplete', 'name');
    expect(email).toHaveAttribute('placeholder', 'tucorreo@ejemplo.com');
    expect(email).toHaveAttribute('type', 'email');
    expect(password).toHaveAttribute('type', 'password');
    expect(confirmPassword).toHaveAttribute('type', 'password');
    expect(password).toHaveAttribute('autocomplete', 'new-password');
    expect(confirmPassword).toHaveAttribute('autocomplete', 'new-password');
    expect(terms).not.toBeChecked();
    expect(terms).toBeRequired();
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toHaveAttribute('href', '/login');
  });

  it('REG-US1-2/3: envía datos válidos y delega la navegación tras éxito', async () => {
    const { registerAccount, onSuccess, fill, submit } = setup();
    await fill();
    await submit();
    expect(registerAccount).toHaveBeenCalledExactlyOnceWith({
      fullName: 'Diego Martínez',
      email: 'diego@example.test',
      password: 'Clave-segura-123',
      confirmPassword: 'Clave-segura-123',
      acceptedTerms: true,
    });
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('REG-FR-017: bloquea doble clic, Enter y envíos directos mientras espera', async () => {
    const context = setup();
    let release!: (result: RegistrationResult) => void;
    context.registerAccount.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      }),
    );
    await context.fill();
    await context.submit();
    const busy = screen.getByRole('button', { name: 'Creando cuenta…' });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute('aria-busy', 'true');
    for (const field of [
      context.fullName,
      context.email,
      context.password,
      context.confirmPassword,
      context.terms,
    ])
      expect(field).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Mostrar confirmación de contraseña' }),
    ).toBeDisabled();
    await context.user.click(busy);
    await context.user.keyboard('{Enter}');
    const form = busy.closest('form');
    if (!form) throw new Error('El botón debe pertenecer al formulario de registro');
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(context.registerAccount).toHaveBeenCalledOnce();
    await act(async () => release({ kind: 'success' }));
    expect(context.onSuccess).toHaveBeenCalledOnce();
  });

  it('REG-US1-2: Enter desde confirmación envía la cuenta', async () => {
    const { fill, user, confirmPassword, registerAccount } = setup();
    await fill();
    await user.click(confirmPassword);
    await user.keyboard('{Enter}');
    expect(registerAccount).toHaveBeenCalledOnce();
  });

  it('REG-FR-019: una operación terminada tras desmontar no cambia la navegación', async () => {
    const { fill, submit, registerAccount, onSuccess, unmount } = setup();
    let release!: (result: RegistrationResult) => void;
    registerAccount.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      }),
    );
    await fill();
    await submit();
    unmount();
    await act(async () => release({ kind: 'success' }));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

describe('RegisterForm · REG-US2 validaciones y fallos', () => {
  it('REG-US2-1: envío vacío muestra cinco errores y enfoca nombre', async () => {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      terms,
      registerAccount,
      submit,
      container,
    } = setup();
    await submit();
    expect(fullName).toHaveAccessibleDescription(REGISTRATION_MESSAGES.FULL_NAME_REQUIRED);
    expect(email).toHaveAccessibleDescription(MESSAGES.EMAIL_REQUIRED);
    expect(password).toHaveAccessibleDescription(MESSAGES.PASSWORD_REQUIRED);
    expect(confirmPassword).toHaveAccessibleDescription(
      REGISTRATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED,
    );
    expect(terms).toHaveAccessibleDescription(REGISTRATION_MESSAGES.TERMS_REQUIRED);
    expect(fullName).toHaveFocus();
    expect(registerAccount).not.toHaveBeenCalled();
    await expectNoA11yViolations(container);
  });

  it.each(['Correo electrónico', 'Contraseña', 'Confirmar contraseña'])(
    'REG-US2-1: enfoca %s cuando es el primer campo inválido',
    async (label) => {
      const { fill, submit, user, registerAccount } = setup();
      await fill();
      const field = screen.getByLabelText(label);
      await user.clear(field);
      await submit();
      expect(field).toHaveFocus();
      expect(registerAccount).not.toHaveBeenCalled();
    },
  );

  it('REG-US2-3: exige términos y enfoca la casilla', async () => {
    const { fill, submit, user, terms, registerAccount } = setup();
    await fill();
    await user.click(terms);
    await submit();
    expect(terms).toHaveFocus();
    expect(terms).toHaveAccessibleDescription(REGISTRATION_MESSAGES.TERMS_REQUIRED);
    expect(registerAccount).not.toHaveBeenCalled();
    await user.click(terms);
    expect(terms).not.toHaveAttribute('aria-invalid');
    await submit();
    expect(registerAccount).toHaveBeenCalledOnce();
  });

  it('REG-US2-2/4: valida al salir y elimina error al corregir', async () => {
    const { user, email, password } = setup();
    await user.type(email, 'usuario@');
    expect(email).not.toHaveAttribute('aria-invalid');
    await user.tab();
    expect(email).toHaveAccessibleDescription(MESSAGES.EMAIL_INVALID);
    await user.type(email, 'example.test');
    expect(email).not.toHaveAttribute('aria-invalid');
    await user.type(password, '1234567');
    await user.tab();
    expect(password).toHaveAccessibleDescription(MESSAGES.PASSWORD_TOO_SHORT);
    await user.type(password, '8');
    expect(password).not.toHaveAttribute('aria-invalid');
  });

  it('REG-FR-009: cambiar la contraseña revalida una confirmación ya visitada', async () => {
    const { user, password, confirmPassword, fill } = setup();
    await fill();
    await user.type(password, 'x');
    expect(confirmPassword).toHaveAccessibleDescription(REGISTRATION_MESSAGES.PASSWORD_MISMATCH);
    await user.type(confirmPassword, 'x');
    expect(confirmPassword).not.toHaveAttribute('aria-invalid');
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(password).toHaveAttribute('type', 'text');
    expect(confirmPassword).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Mostrar confirmación de contraseña' }));
    expect(confirmPassword).toHaveAttribute('type', 'text');
  });

  it.each([
    [{ kind: 'duplicate-email' }, REGISTRATION_MESSAGES.DUPLICATE_EMAIL],
    [{ kind: 'unavailable' }, REGISTRATION_MESSAGES.UNAVAILABLE],
  ] as const)('REG-US2-5/6: muestra fallo %s y permite corregir', async (result, message) => {
    const { fill, submit, user, email, onSuccess } = setup(result);
    await fill();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(message);
    expect(onSuccess).not.toHaveBeenCalled();
    await user.type(email, 'x');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('REG-FR-021: captura rechazo inesperado sin filtrar detalles y permite reintentar', async () => {
    const { fill, submit, registerAccount, onSuccess } = setup();
    registerAccount.mockRejectedValueOnce(new Error('detalle interno secreto'));
    await fill();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(REGISTRATION_MESSAGES.UNAVAILABLE);
    expect(document.body).not.toHaveTextContent('detalle interno secreto');
    await submit();
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it('REG-FR-011: conserva errores devueltos por la frontera de aplicación', async () => {
    const { fill, submit, email, user, onSuccess } = setup({
      kind: 'invalid-input',
      errors: { email: MESSAGES.EMAIL_INVALID },
    });
    await fill();
    await submit();
    expect(email).toHaveAccessibleDescription(MESSAGES.EMAIL_INVALID);
    expect(onSuccess).not.toHaveBeenCalled();
    await user.type(email, 'x');
    expect(email).not.toHaveAttribute('aria-invalid');
  });

  it('REG-FR-021: no actualiza una vista desmontada tras rechazo', async () => {
    const { fill, submit, registerAccount, onSuccess, unmount } = setup();
    let reject!: (reason: Error) => void;
    registerAccount.mockReturnValue(
      new Promise((_resolve, fail) => {
        reject = fail;
      }),
    );
    await fill();
    await submit();
    unmount();
    await act(async () => reject(new Error('fallo')));
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

describe('RegisterForm · REG-US3 uso y accesibilidad', () => {
  it.each(['Google', 'Apple'])(
    'REG-US3-3: %s muestra alert exacto sin enviar',
    async (provider) => {
      const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const { user, registerAccount } = setup();
      await user.click(screen.getByRole('button', { name: provider }));
      expect(alert).toHaveBeenCalledExactlyOnceWith('Próximamente');
      expect(registerAccount).not.toHaveBeenCalled();
      alert.mockRestore();
    },
  );

  it('REG-US3-5: orden de teclado de campos, visibilidad, términos y acciones', async () => {
    const { user, fullName, email, password, confirmPassword, terms } = setup();
    for (const field of [
      fullName,
      email,
      password,
      screen.getByRole('button', { name: 'Mostrar contraseña' }),
      confirmPassword,
      screen.getByRole('button', { name: 'Mostrar confirmación de contraseña' }),
      terms,
      screen.getByRole('button', { name: 'Crear cuenta' }),
      screen.getByRole('button', { name: 'Google' }),
      screen.getByRole('button', { name: 'Apple' }),
      screen.getByRole('link', { name: 'Inicia sesión' }),
    ]) {
      await user.tab();
      expect(field).toHaveFocus();
    }
  });

  it('REG-FR-015/020: pantalla compuesta comparte marca y no tiene infracciones axe', async () => {
    const { container } = render(
      <RegisterScreen>
        <RegisterForm registerAccount={vi.fn<RegisterAccount>()} onSuccess={() => {}} />
      </RegisterScreen>,
    );
    expect(screen.getByText('Comienza tu camino financiero.')).toBeInTheDocument();
    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('heading', { name: 'Crea tu cuenta' }),
    );
    await expectNoA11yViolations(container);
  });
});
