import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { createRegistrationStub } from '@/test/registrationStub';
import { RegisterForm } from './RegisterForm';

function setup(stub = createRegistrationStub(), onNavigateToLogin = vi.fn()) {
  const user = userEvent.setup();
  const { container } = render(
    <RegisterForm registerUser={stub.registerUser} onNavigateToLogin={onNavigateToLogin} />,
  );
  const fullName = screen.getByLabelText('Nombres Completos');
  const email = screen.getByLabelText('Correo electrónico');
  const password = screen.getByLabelText('Contraseña');
  const confirmPassword = screen.getByLabelText('Confirmar contraseña');
  const terms = screen.getByRole('checkbox', { name: /Acepto los términos y condiciones/i });
  const submitButton = () => screen.getByRole('button', { name: /Crear Cuenta|Creando cuenta/i });
  return {
    user,
    stub,
    onNavigateToLogin,
    container,
    fullName,
    email,
    password,
    confirmPassword,
    terms,
    submitButton,
  };
}

describe('RegisterForm · US1 Registrar una nueva cuenta con datos válidos', () => {
  it('US1-1 y US1-2: el botón "Crear Cuenta" está deshabilitado cuando el checkbox de términos es False y se activa cuando es True', async () => {
    const { user, terms, submitButton } = setup();
    expect(terms).not.toBeChecked();
    expect(submitButton()).toBeDisabled();

    await user.click(terms);
    expect(terms).toBeChecked();
    expect(submitButton()).toBeEnabled();

    await user.click(terms);
    expect(submitButton()).toBeDisabled();
  });

  it('US1-3: con todos los campos válidos y términos aceptados, envía los datos y redirige a Login', async () => {
    const {
      user,
      stub,
      onNavigateToLogin,
      fullName,
      email,
      password,
      confirmPassword,
      terms,
      submitButton,
    } = setup();

    await user.type(fullName, 'Ana Gómez');
    await user.type(email, 'ana.gomez@example.test');
    await user.type(password, 'KynWallet2026!');
    await user.type(confirmPassword, 'KynWallet2026!');
    await user.click(terms);
    await user.click(submitButton());

    expect(stub.registerUser).toHaveBeenCalledWith({
      fullName: 'Ana Gómez',
      email: 'ana.gomez@example.test',
      password: 'KynWallet2026!',
      acceptedTerms: true,
    });
    expect(onNavigateToLogin).toHaveBeenCalledOnce();
  });

  it('US1-5: el enlace "Inicia sesión" navega a la pantalla de Login', async () => {
    const { user, onNavigateToLogin } = setup();
    await user.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(onNavigateToLogin).toHaveBeenCalledOnce();
  });

  it('Caso límite: deshabilita el botón durante el guardado evitando doble envío', async () => {
    const {
      user,
      stub,
      onNavigateToLogin,
      fullName,
      email,
      password,
      confirmPassword,
      terms,
      submitButton,
    } = setup();
    stub.defer();

    await user.type(fullName, 'Ana Gómez');
    await user.type(email, 'ana.gomez@example.test');
    await user.type(password, 'KynWallet2026!');
    await user.type(confirmPassword, 'KynWallet2026!');
    await user.click(terms);
    await user.click(submitButton());

    const busy = screen.getByRole('button', { name: 'Creando cuenta…' });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute('aria-busy', 'true');
    await user.click(busy);
    expect(stub.registerUser).toHaveBeenCalledOnce();

    await act(async () => stub.release());
    expect(onNavigateToLogin).toHaveBeenCalledOnce();
  });
});

describe('RegisterForm · US2 Validar campos inline y antes del envío', () => {
  it('US2-1: muestra error inline en Nombres Completos al salir vacío', async () => {
    const { user, fullName } = setup();
    await user.click(fullName);
    await user.tab();
    expect(fullName).toHaveAccessibleDescription('Ingresa tus nombres completos');
    expect(fullName).toHaveAttribute('aria-invalid', 'true');
  });

  it('US2-2: valida inline el formato de correo electrónico mientras el usuario escribe', async () => {
    const { user, email } = setup();
    await user.type(email, 'usuario@');
    expect(email).toHaveAccessibleDescription('Ingresa un correo electrónico válido');
    expect(email).toHaveAttribute('aria-invalid', 'true');

    await user.type(email, 'dominio.com');
    expect(email).not.toHaveAttribute('aria-invalid');
  });

  it('US2-3: valida inline que la contraseña tenga seguridad alta y mínimo 8 caracteres', async () => {
    const { user, password } = setup();
    await user.type(password, 'debil12');
    expect(password).toHaveAccessibleDescription(
      'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial',
    );

    await user.clear(password);
    await user.type(password, 'KynWallet2026!');
    expect(password).not.toHaveAttribute('aria-invalid');
  });

  it('US2-4 y US2-5: valida inline que Confirmar contraseña sea idéntica a Contraseña y cumpla seguridad alta', async () => {
    const { user, password, confirmPassword } = setup();
    await user.type(password, 'KynWallet2026!');
    await user.type(confirmPassword, 'OtraClave2026!');
    expect(confirmPassword).toHaveAccessibleDescription('Las contraseñas no coinciden');

    await user.clear(confirmPassword);
    await user.type(confirmPassword, 'KynWallet2026!');
    expect(confirmPassword).not.toHaveAttribute('aria-invalid');

    // US2-5: cambiar Contraseña desincroniza Confirmar contraseña inline
    await user.type(password, 'X');
    expect(confirmPassword).toHaveAccessibleDescription('Las contraseñas no coinciden');
  });

  it('US2-6: al hacer clic en "Crear Cuenta" con campos inválidos, bloquea el envío, muestra todos los errores y mueve el foco al primer campo inválido', async () => {
    const {
      user,
      stub,
      onNavigateToLogin,
      fullName,
      email,
      password,
      confirmPassword,
      terms,
      submitButton,
    } = setup();

    await user.click(terms);
    await user.click(submitButton());

    expect(fullName).toHaveAccessibleDescription('Ingresa tus nombres completos');
    expect(email).toHaveAccessibleDescription('Ingresa tu correo electrónico');
    expect(password).toHaveAccessibleDescription('Ingresa tu contraseña');
    expect(confirmPassword).toHaveAccessibleDescription('Confirma tu contraseña');
    expect(fullName).toHaveFocus();
    expect(stub.registerUser).not.toHaveBeenCalled();
    expect(onNavigateToLogin).not.toHaveBeenCalled();
  });

  it('FR-008: al fallar solo Confirmar contraseña al enviar, el foco va a Confirmar contraseña', async () => {
    const { user, fullName, email, password, confirmPassword, terms, submitButton } = setup();
    await user.type(fullName, 'Ana Gómez');
    await user.type(email, 'ana@example.test');
    await user.type(password, 'KynWallet2026!');
    await user.type(confirmPassword, 'Otra2026!');
    await user.click(terms);
    await user.click(submitButton());
    expect(confirmPassword).toHaveFocus();
  });

  it('FR-007: incluso si se dispara submit en el form con términos en false, no envía', () => {
    const { stub, container } = setup();
    const form = container.querySelector('form');
    if (form) fireEvent.submit(form);
    expect(stub.registerUser).not.toHaveBeenCalled();
  });

  it('FR-009: si el correo ya existe, muestra error en el campo Correo electrónico y le da el foco', async () => {
    const stub = createRegistrationStub({ kind: 'email-already-exists' });
    const { user, fullName, email, password, confirmPassword, terms, submitButton } = setup(stub);

    await user.type(fullName, 'Ana Gómez');
    await user.type(email, 'ana@example.test');
    await user.type(password, 'KynWallet2026!');
    await user.type(confirmPassword, 'KynWallet2026!');
    await user.click(terms);
    await user.click(submitButton());

    expect(await screen.findByText('Este correo electrónico ya está registrado')).toBeVisible();
    expect(email).toHaveAccessibleDescription('Este correo electrónico ya está registrado');
    expect(email).toHaveFocus();
  });

  it('FR-017: ante error de localStorage muestra alerta comprensible sin detalles internos', async () => {
    const stub = createRegistrationStub({ kind: 'storage-error' });
    const { user, fullName, email, password, confirmPassword, terms, submitButton } = setup(stub);

    await user.type(fullName, 'Ana Gómez');
    await user.type(email, 'ana@example.test');
    await user.type(password, 'KynWallet2026!');
    await user.type(confirmPassword, 'KynWallet2026!');
    await user.click(terms);
    await user.click(submitButton());

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo completar el registro en este navegador. Verifica la configuración de almacenamiento.',
    );
  });
});

describe('RegisterForm · US3 Notificación Toast "Próximamente" en Google y Apple', () => {
  it.each(['Google', 'Apple'])(
    'US3-1 / US3-2: al pulsar "%s" muestra alerta Toast con el mensaje "Próximamente" y conserva los datos',
    async (provider) => {
      const { user, fullName, email } = setup();
      await user.type(fullName, 'Ana Gómez');
      await user.type(email, 'ana@example.test');

      await user.click(screen.getByRole('button', { name: provider }));

      const toast = screen.getByRole('status');
      expect(toast).toHaveTextContent('Próximamente');
      expect(toast).toHaveAttribute('data-position', 'top-center');
      expect(toast).toHaveAttribute('data-tone', 'brand');
      expect(fullName).toHaveValue('Ana Gómez');
      expect(email).toHaveValue('ana@example.test');
    },
  );
});

describe('RegisterForm · US4 Mostrar u ocultar contraseñas', () => {
  it('US4-1 y US4-2: alterna independientemente la visibilidad de Contraseña y Confirmar contraseña', async () => {
    const { user, password, confirmPassword } = setup();
    await user.type(password, 'KynWallet2026!');
    await user.type(confirmPassword, 'KynWallet2026!');

    const [firstToggle, secondToggle] = screen.getAllByRole('button', {
      name: 'Mostrar contraseña',
    });
    expect(firstToggle).toBeDefined();
    expect(secondToggle).toBeDefined();
    expect(password).toHaveAttribute('type', 'password');
    expect(confirmPassword).toHaveAttribute('type', 'password');

    if (firstToggle && secondToggle) {
      await user.click(firstToggle);
      expect(password).toHaveAttribute('type', 'text');
      expect(confirmPassword).toHaveAttribute('type', 'password');

      await user.click(secondToggle);
      expect(confirmPassword).toHaveAttribute('type', 'text');
    }
  });
});

describe('RegisterForm · Accesibilidad y Seguridad (FR-011, FR-016, SC-005, SC-006)', () => {
  it('SC-005: sin violaciones de accesibilidad en estado inicial, con errores y con Toast visible', async () => {
    const { user, container, terms, submitButton } = setup();
    await expectNoA11yViolations(container);

    await user.click(terms);
    await user.click(submitButton());
    await expectNoA11yViolations(container);

    await user.click(screen.getByRole('button', { name: 'Google' }));
    await expectNoA11yViolations(container);
  });
});
