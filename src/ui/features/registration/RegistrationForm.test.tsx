import { StrictMode } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { createRegistrationStub, REGISTRATION_FIXTURE as fixture } from '@/test/registrationStub';
import { RegistrationForm } from './RegistrationForm';

function fill(terms = true) {
  for (const [label, value] of [
    ['Nombre completo', fixture.fullName],
    ['Correo electrónico', fixture.email],
    ['Contraseña', fixture.password],
    ['Confirmar contraseña', fixture.confirmPassword],
  ] as const)
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  if (terms) fireEvent.click(screen.getByRole('checkbox'));
}
function setup(stub = createRegistrationStub(), strict = false) {
  const success = vi.fn();
  const view = <RegistrationForm register={stub.register} onSuccess={success} />;
  const rendered = render(strict ? <StrictMode>{view}</StrictMode> : view);
  const submit = () => {
    const form = rendered.container.querySelector('form');
    if (!form) throw new Error('Expected registration form');
    fireEvent.submit(form);
  };
  return { ...rendered, stub, success, submit, user: userEvent.setup() };
}

describe('Registro US1 completar demo', () => {
  it('FR-019: aclara que el registro no habilita usuarios para iniciar sesión', () => {
    setup();
    expect(
      screen.getByText(
        'Demostración: este registro no crea usuarios para iniciar sesión ni guarda contraseñas.',
      ),
    ).toBeVisible();
  });
  it('US1-1 FR-011: envía datos válidos una vez, vacía campos y notifica', async () => {
    const { stub, submit, success } = setup();
    fill();
    submit();
    await act(async () => {});
    expect(stub.register).toHaveBeenCalledExactlyOnceWith(fixture);
    expect(success).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
  });
  it('US1-2 FR-010: bloquea dos submits en la misma tanda y controles ocupados', async () => {
    const stub = createRegistrationStub();
    stub.defer();
    const { container } = setup(stub);
    fill();
    const form = container.querySelector('form');
    if (!form) throw new Error('Expected registration form');
    act(() => {
      fireEvent.submit(form);
      fireEvent.submit(form);
    });
    expect(stub.register).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Creando cuenta…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Creando cuenta…' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(screen.getByLabelText('Nombre completo')).toBeDisabled();
    expect(screen.getByRole('checkbox')).toBeDisabled();
    await expectNoA11yViolations(container);
    await act(async () => stub.release());
  });
  it('US1-4 FR-012: fallo genérico conserva datos no secretos y permite reintentar', async () => {
    const { submit, stub, success, user } = setup(createRegistrationStub({ kind: 'unavailable' }));
    fill();
    submit();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos completar el registro. Intenta nuevamente.',
    );
    expect(screen.getByLabelText('Nombre completo')).toHaveValue(fixture.fullName);
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue(fixture.email);
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
    expect(screen.getByLabelText('Confirmar contraseña')).toHaveValue('');
    await waitFor(() => expect(screen.getByLabelText('Contraseña')).toHaveFocus());
    expect(success).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText('Contraseña'), fixture.password);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), {
      target: { value: fixture.password },
    });
    submit();
    await act(async () => {});
    expect(stub.register).toHaveBeenCalledTimes(2);
  });
  it('US1-5 FR-022: descarta resultado tras desmontar', async () => {
    const stub = createRegistrationStub();
    stub.defer();
    const { submit, unmount, success } = setup(stub);
    fill();
    submit();
    unmount();
    await act(async () => stub.release());
    expect(success).not.toHaveBeenCalled();
  });
  it('FR-010/022: StrictMode permite un envío vigente', async () => {
    const { submit, success } = setup(createRegistrationStub(), true);
    fill();
    submit();
    await act(async () => {});
    expect(success).toHaveBeenCalledOnce();
  });
  it('FR-012: rechazo imprevisto del caso de uso también limpia secretos', async () => {
    const stub = createRegistrationStub();
    stub.register.mockRejectedValueOnce(new Error('internal'));
    const { submit } = setup(stub);
    fill();
    submit();
    expect(await screen.findByRole('alert')).not.toHaveTextContent('internal');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('');
  });
  it('FR-003: maneja invalidación devuelta por el caso de uso', async () => {
    const { submit } = setup(
      createRegistrationStub({ kind: 'invalid', errors: { fullName: 'Nombre inválido' } }),
    );
    fill();
    submit();
    await act(async () => {});
    expect(screen.getByLabelText('Nombre completo')).toHaveAccessibleDescription('Nombre inválido');
  });
});

describe('Registro US2 validación inline', () => {
  it('US2-1/2 FR-008/009: inicialmente sin errores; envío vacío muestra cinco y enfoca nombre', async () => {
    const { submit, stub, container } = setup();
    expect(container.querySelector('[aria-invalid=true]')).toBeNull();
    submit();
    expect(container.querySelectorAll('[aria-invalid=true]')).toHaveLength(5);
    expect(screen.getByLabelText('Nombre completo')).toHaveFocus();
    expect(stub.register).not.toHaveBeenCalled();
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
      'Acepta los términos y condiciones',
    );
    await expectNoA11yViolations(container);
  });
  it('US2-3/4 FR-005/008: blur y corrección inmediata de correo escrito o pegado', async () => {
    const { user } = setup();
    const email = screen.getByLabelText('Correo electrónico');
    await user.click(email);
    await user.paste('usuario@');
    await user.tab();
    expect(email).toHaveAccessibleDescription('Ingresa un correo electrónico válido');
    await user.type(email, 'example.test');
    expect(email).not.toHaveAttribute('aria-invalid');
  });
  it('US2-5 FR-007: cambiar contraseña revalida confirmación ya visitada', () => {
    setup();
    fill();
    const confirm = screen.getByLabelText('Confirmar contraseña');
    fireEvent.blur(confirm);
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'otra-clave-02' } });
    expect(confirm).toHaveAccessibleDescription('Las contraseñas deben coincidir');
    fireEvent.change(confirm, { target: { value: 'otra-clave-02' } });
    expect(confirm).not.toHaveAttribute('aria-invalid');
  });
  it('US2-6 FR-002/009: términos faltantes reciben foco y el cambio corrige error', () => {
    const { submit, stub } = setup();
    fill(false);
    submit();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveFocus();
    expect(stub.register).not.toHaveBeenCalled();
    fireEvent.click(checkbox);
    expect(checkbox).not.toHaveAttribute('aria-invalid');
  });
  it.each([
    ['Nombre completo', ' '.repeat(3)],
    ['Nombre completo', 'n'.repeat(81)],
    ['Correo electrónico', `${'e'.repeat(246)}@test.test`],
    ['Contraseña', '1234567'],
    ['Contraseña', 'p'.repeat(129)],
    ['Confirmar contraseña', 'p'.repeat(129)],
  ])('US2-7 FR-004/006: límite inválido %s', (label, value) => {
    const { submit, stub } = setup();
    fill();
    const input = screen.getByLabelText(label);
    fireEvent.change(input, { target: { value } });
    submit();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(stub.register).not.toHaveBeenCalled();
  });
  it('US2-7 FR-006: espacios de contraseña significativos', async () => {
    const { submit, success } = setup();
    fill();
    for (const label of ['Contraseña', 'Confirmar contraseña'])
      fireEvent.change(screen.getByLabelText(label), { target: { value: '        ' } });
    submit();
    await act(async () => {});
    expect(success).toHaveBeenCalledOnce();
  });
});

describe('Registro US4/US5 accesibilidad y avisos', () => {
  it('US5-3 FR-017: campos vacíos sin violaciones y orden de teclado', async () => {
    const { container, user } = setup();
    await expectNoA11yViolations(container);
    const order = [
      screen.getByLabelText('Nombre completo'),
      screen.getByLabelText('Correo electrónico'),
      screen.getByLabelText('Contraseña'),
      screen.getByRole('button', { name: 'Mostrar contraseña' }),
      screen.getByLabelText('Confirmar contraseña'),
      screen.getByRole('button', { name: 'Mostrar confirmación' }),
      screen.getByRole('checkbox'),
      screen.getByRole('button', { name: 'términos y condiciones' }),
      screen.getByRole('button', { name: 'Crear cuenta' }),
      screen.getByRole('button', { name: 'Google' }),
      screen.getByRole('button', { name: 'Apple' }),
      screen.getByRole('link', { name: 'Inicia sesión' }),
    ];
    for (const element of order) {
      await user.tab();
      expect(element).toHaveFocus();
    }
    expect(screen.getByRole('link')).toHaveAttribute('href', '/login');
  });
  it('US5-5 FR-020: visibilidad independiente por teclado', async () => {
    const { user } = setup();
    const password = screen.getByLabelText('Contraseña');
    const confirm = screen.getByLabelText('Confirmar contraseña');
    expect(password).toHaveAttribute('type', 'password');
    expect(confirm).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Mostrar confirmación' }));
    expect(confirm).toHaveAttribute('type', 'text');
    expect(password).toHaveAttribute('type', 'password');
    await user.keyboard(' ');
    expect(confirm).toHaveAttribute('type', 'password');
  });
  it.each(['Google', 'Apple'])(
    'US4 FR-014: %s muestra alert exacto sin envío',
    async (provider) => {
      const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const { user, stub } = setup();
      fill();
      await user.click(screen.getByRole('button', { name: provider }));
      expect(alert).toHaveBeenCalledExactlyOnceWith('Próximamente');
      expect(stub.register).not.toHaveBeenCalled();
      expect(screen.getByLabelText('Nombre completo')).toHaveValue(fixture.fullName);
      alert.mockRestore();
    },
  );
  it('US5-6 FR-021: términos informa sin activar aceptación', async () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const { user, stub } = setup();
    await user.click(screen.getByRole('button', { name: 'términos y condiciones' }));
    expect(alert).toHaveBeenCalledWith(
      'Los términos y condiciones no están disponibles en esta demostración.',
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(stub.register).not.toHaveBeenCalled();
    alert.mockRestore();
  });
  it('FR-018 SC-006: sin persistencia ni exposición en logs/URL/history', async () => {
    const storage = vi.spyOn(Storage.prototype, 'setItem');
    const logs = (['log', 'info', 'warn', 'error', 'debug'] as const).map((method) =>
      vi.spyOn(console, method),
    );
    const { submit } = setup();
    fill();
    submit();
    await act(async () => {});
    expect(storage).not.toHaveBeenCalled();
    logs.forEach((spy) => expect(spy).not.toHaveBeenCalled());
    const exposed = `${document.body.textContent} ${window.location.href} ${JSON.stringify(history.state)}`;
    for (const secret of [fixture.email, fixture.password, fixture.fullName])
      expect(exposed).not.toContain(secret);
    storage.mockRestore();
    logs.forEach((spy) => spy.mockRestore());
  });
});
