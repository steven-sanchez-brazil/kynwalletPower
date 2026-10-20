import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_REGISTRATION_DATA } from '@/test/fixtures';
import { createRegisterStub } from '@/test/registerStub';
import { RegisterForm } from './RegisterForm';

function setup(
  stub = createRegisterStub(),
  props: Partial<Parameters<typeof RegisterForm>[0]> = {},
) {
  const user = userEvent.setup();
  const onNavigateToLogin = vi.fn();
  const onSuccess = vi.fn();

  render(
    <RegisterForm
      register={stub.register}
      onNavigateToLogin={onNavigateToLogin}
      onSuccess={onSuccess}
      {...props}
    />,
  );

  const fullName = screen.getByLabelText('Nombre completo');
  const email = screen.getByLabelText('Correo electrónico');
  const password = screen.getByLabelText(/^Contraseña$/i);
  const confirmPassword = screen.getByLabelText('Confirmar contraseña');
  const terms = screen.getByLabelText('Acepto los términos y condiciones');
  const submitButton = () => screen.getByRole('button', { name: /Crear cuenta/i });

  const fillValidData = async () => {
    await user.type(fullName, TEST_REGISTRATION_DATA.fullName);
    await user.type(email, TEST_REGISTRATION_DATA.email);
    await user.type(password, TEST_REGISTRATION_DATA.password);
    await user.type(confirmPassword, TEST_REGISTRATION_DATA.confirmPassword);
    await user.click(terms);
  };

  return {
    user,
    stub,
    fullName,
    email,
    password,
    confirmPassword,
    terms,
    submitButton,
    fillValidData,
    onNavigateToLogin,
    onSuccess,
  };
}

// ─── US1: Creación exitosa ────────────────────────────────────────────────────

describe('RegisterForm · US1 Creación exitosa de cuenta', () => {
  it('US1-1: campos válidos → estado de carga y mensaje de éxito', async () => {
    const { user, fillValidData, submitButton, stub, onSuccess } = setup();

    await fillValidData();
    await user.click(submitButton());

    expect(stub.register).toHaveBeenCalledWith(TEST_REGISTRATION_DATA);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      '¡Registro exitoso! Redirigiendo a iniciar sesión...',
    );
    expect(onSuccess).toHaveBeenCalledWith({
      email: TEST_REGISTRATION_DATA.email,
      displayName: TEST_REGISTRATION_DATA.fullName,
    });
  });

  it('US1-2: durante el envío el botón está ocupado y deshabilitado (aria-busy)', async () => {
    const stub = createRegisterStub();
    stub.defer();
    const { user, fillValidData, submitButton } = setup(stub);

    await fillValidData();
    await user.click(submitButton());

    const busyButton = screen.getByRole('button', { name: /Creando cuenta/i });
    expect(busyButton).toBeDisabled();
    expect(busyButton).toHaveAttribute('aria-busy', 'true');

    await user.click(busyButton);
    expect(stub.register).toHaveBeenCalledOnce();

    await act(async () => stub.release());
    expect(await screen.findByRole('alert')).toBeVisible();
  });

  it('US1-4: presionar Enter en los campos de texto envía el formulario', async () => {
    const { user, fullName, email, password, confirmPassword, terms, stub } = setup();

    await user.type(fullName, TEST_REGISTRATION_DATA.fullName);
    await user.type(email, TEST_REGISTRATION_DATA.email);
    await user.type(password, TEST_REGISTRATION_DATA.password);
    await user.type(confirmPassword, TEST_REGISTRATION_DATA.confirmPassword);
    await user.click(terms);

    await user.type(confirmPassword, '{Enter}');

    expect(stub.register).toHaveBeenCalledWith(TEST_REGISTRATION_DATA);
  });
});

// ─── US2: Validación inline ───────────────────────────────────────────────────

describe('RegisterForm · US2 Validación inline de campos', () => {
  it('US2-1: envío sin datos → muestra todos los mensajes inline y foca el primer campo inválido', async () => {
    const stub = createRegisterStub();
    const { user, submitButton, fullName } = setup(stub);

    await user.click(submitButton());

    expect(stub.register).not.toHaveBeenCalled();
    expect(await screen.findByText('Ingresa tu nombre completo')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu correo electrónico')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu contraseña')).toBeInTheDocument();
    expect(screen.getByText('Confirma tu contraseña')).toBeInTheDocument();
    expect(screen.getByText('Debes aceptar los términos y condiciones')).toBeInTheDocument();
    expect(document.activeElement).toBe(fullName);
  });

  it('US2-2: correo inválido tras blur → mensaje inline de formato', async () => {
    const { user, email } = setup();

    await user.type(email, 'usuario@');
    await user.tab();

    expect(await screen.findByText('Ingresa un correo electrónico válido')).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAttribute('aria-describedby');
  });

  it('US2-3: correo corregido → el error inline desaparece', async () => {
    const { user, email } = setup();

    await user.type(email, 'usuario@');
    await user.tab();
    expect(await screen.findByText('Ingresa un correo electrónico válido')).toBeInTheDocument();

    await user.clear(email);
    await user.type(email, 'carlos@example.test');
    expect(screen.queryByText('Ingresa un correo electrónico válido')).not.toBeInTheDocument();
  });

  it('US2-4: contraseña < 8 caracteres tras blur → mensaje inline', async () => {
    const { user, password } = setup();

    await user.type(password, '1234567');
    await user.tab();

    expect(
      await screen.findByText('La contraseña debe tener al menos 8 caracteres'),
    ).toBeInTheDocument();
    expect(password).toHaveAttribute('aria-invalid', 'true');
  });

  it('US2-5: contraseñas no coincidentes → mensaje inline en confirmación', async () => {
    const { user, password, confirmPassword } = setup();

    await user.type(password, 'Password123!');
    await user.type(confirmPassword, 'OtraPassword!');
    await user.tab();

    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();
  });

  it('US2-6: términos no aceptados al enviar → muestra mensaje inline', async () => {
    const { user, fullName, email, password, confirmPassword, submitButton } = setup();

    await user.type(fullName, TEST_REGISTRATION_DATA.fullName);
    await user.type(email, TEST_REGISTRATION_DATA.email);
    await user.type(password, TEST_REGISTRATION_DATA.password);
    await user.type(confirmPassword, TEST_REGISTRATION_DATA.confirmPassword);
    // No click on terms
    await user.click(submitButton());

    expect(await screen.findByText('Debes aceptar los términos y condiciones')).toBeInTheDocument();
  });

  it('US2-7: campos con errores tienen aria-invalid y aria-describedby', async () => {
    const { user, fullName } = setup();

    await user.click(fullName);
    await user.tab(); // blur fullName

    await screen.findByText('Ingresa tu nombre completo');
    expect(fullName).toHaveAttribute('aria-invalid', 'true');
    expect(fullName).toHaveAttribute('aria-describedby');
  });
});

// ─── US3: Alternancia de visibilidad ─────────────────────────────────────────

describe('RegisterForm · US3 Alternancia de visibilidad de contraseñas', () => {
  it('US3-1: alternar visibilidad del campo Contraseña mediante clic en el botón', async () => {
    const { user, password } = setup();
    const [togglePassword] = screen.getAllByRole('button', { name: /contraseña$/i });
    if (!togglePassword) throw new Error('Botón no encontrado');

    expect(password).toHaveAttribute('type', 'password');

    await user.click(togglePassword);
    expect(password).toHaveAttribute('type', 'text');
    expect(togglePassword).toHaveAttribute('aria-pressed', 'true');

    await user.click(togglePassword);
    expect(password).toHaveAttribute('type', 'password');
  });

  it('US3-2: alternar visibilidad del campo Confirmar contraseña de forma independiente', async () => {
    const { user, password, confirmPassword } = setup();
    // Hay dos botones de visibilidad; segundo es para confirmar
    const buttons = screen.getAllByRole('button', { name: /contraseña$/i });
    const toggleConfirm = buttons[1];
    if (!toggleConfirm) throw new Error('Botón no encontrado');

    await user.click(toggleConfirm);
    expect(confirmPassword).toHaveAttribute('type', 'text');
    // el campo Contraseña no cambia
    expect(password).toHaveAttribute('type', 'password');
  });

  it('US3-3: el botón de visibilidad es operable con teclado', async () => {
    const user = userEvent.setup();
    render(<RegisterForm register={createRegisterStub().register} onNavigateToLogin={vi.fn()} />);
    const password = screen.getByLabelText(/^Contraseña$/i);
    const [toggle] = screen.getAllByRole('button', { name: /contraseña$/i });
    if (!toggle) throw new Error('Botón no encontrado');

    await user.click(password);
    await user.tab();
    expect(toggle).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(password).toHaveAttribute('type', 'text');
  });
});

// ─── US5: Opciones sociales ───────────────────────────────────────────────────

describe('RegisterForm · US5 Opciones sociales "Próximamente"', () => {
  it('US5-1: clic en "Continuar con Google" → muestra alert "Próximamente"', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: 'Google' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Próximamente');
  });

  it('US5-2: clic en "Continuar con Apple" → muestra alert "Próximamente"', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: 'Apple' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Próximamente');
  });

  it('US5-3: el aviso no altera los datos del formulario', async () => {
    const { user, email } = setup();

    await user.type(email, 'carlos@example.test');
    await user.click(screen.getByRole('button', { name: 'Google' }));

    expect(email).toHaveValue('carlos@example.test');
  });
});

// ─── US4: Navegación al login ─────────────────────────────────────────────────

describe('RegisterForm · US4 Navegación al login', () => {
  it('US4-1: clic en "Inicia sesión" invoca onNavigateToLogin', async () => {
    const { user, onNavigateToLogin } = setup();

    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));

    expect(onNavigateToLogin).toHaveBeenCalledOnce();
  });
});
