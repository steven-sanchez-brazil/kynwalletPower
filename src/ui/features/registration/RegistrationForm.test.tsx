import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRegistrationStub, REGISTRATION_VALUES } from '@/test/registrationStub';
import { expectNoA11yViolations } from '@/test/a11y';
import { RegistrationForm } from './RegistrationForm';

function setup() {
  const stub = createRegistrationStub();
  const success = vi.fn();
  const navigate = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <RegistrationForm register={stub.register} onSuccess={success} onLogin={navigate} />,
  );
  return { ...view, ...stub, success, navigate, user };
}
function fill() {
  for (const [label, value] of [
    ['Nombre completo', REGISTRATION_VALUES.fullName],
    ['Correo electrónico', REGISTRATION_VALUES.email],
    ['Contraseña', REGISTRATION_VALUES.password],
    ['Confirmar contraseña', REGISTRATION_VALUES.confirmPassword],
  ] as const)
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole('checkbox'));
}
it('REG-US1-1/2 y REG-US5-4 formulario accesible, vacío y finalización', async () => {
  const { user, success, container } = setup();
  expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
  expect(screen.getByRole('checkbox')).not.toBeChecked();
  expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
  expect(screen.getByLabelText('Confirmar contraseña')).toHaveAttribute('type', 'password');
  await expectNoA11yViolations(container);
  fill();
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  expect(success).toHaveBeenCalledOnce();
});
it('REG-US1-3 envío único por Enter, bloqueo de campos y fallo recuperable', async () => {
  const { register, user, success } = setup();
  fill();
  let release: (value: { kind: 'unavailable' }) => void = () => {};
  register.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        release = resolve;
      }),
  );
  await user.click(screen.getByLabelText('Confirmar contraseña'));
  await user.keyboard('{Enter}');
  expect(screen.getByRole('button', { name: 'Creando cuenta…' })).toBeDisabled();
  expect(screen.getByLabelText('Nombre completo')).toBeDisabled();
  fireEvent.submit(screen.getByRole('form', { name: 'Registro de demostración' }));
  expect(register).toHaveBeenCalledOnce();
  await act(async () => release({ kind: 'unavailable' }));
  expect(screen.getByRole('alert')).toHaveTextContent(
    'No se pudo completar la demostración. Intenta de nuevo',
  );
  expect(screen.getByLabelText('Nombre completo')).toHaveValue(REGISTRATION_VALUES.fullName);
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  expect(success).toHaveBeenCalledOnce();
});
it('REG-US2-1–6 errores inline, prioridad, foco y corrección cruzada', async () => {
  const { user, register, container } = setup();
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  expect(register).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Nombre completo')).toHaveFocus();
  expect(screen.getByLabelText('Confirmar contraseña')).toHaveAccessibleDescription(
    'Confirma tu contraseña',
  );
  expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
    'Debes aceptar los términos y condiciones',
  );
  await expectNoA11yViolations(container);
  fill();
  expect(screen.getByLabelText('Nombre completo')).not.toHaveAttribute('aria-invalid');
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: 'different-password' },
  });
  expect(screen.getByLabelText('Confirmar contraseña')).toHaveAccessibleDescription(
    'Las contraseñas no coinciden',
  );
});

it('REG-US3 alertas exactas, foco y preservación de datos sin enviar', async () => {
  const { user, register } = setup();
  const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
  await user.type(screen.getByLabelText('Nombre completo'), 'Diego');
  for (const name of ['Google', 'Apple']) {
    const button = screen.getByRole('button', { name });
    await user.click(button);
    expect(alert).toHaveBeenLastCalledWith('Próximamente');
    expect(button).toHaveFocus();
  }
  const terms = screen.getByRole('button', { name: 'términos y condiciones' });
  await user.click(terms);
  expect(alert).toHaveBeenLastCalledWith(
    'Términos y condiciones no disponibles en esta demostración',
  );
  expect(screen.getByRole('checkbox')).not.toBeChecked();
  expect(register).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Nombre completo')).toHaveValue('Diego');
  alert.mockRestore();
});
it('REG-US4 dos controles independientes y teclado sin enviar', async () => {
  const { user, register } = setup();
  fill();
  const password = screen.getByLabelText('Contraseña');
  const confirmation = screen.getByLabelText('Confirmar contraseña');
  await user.click(screen.getByRole('button', { name: 'Mostrar confirmar contraseña' }));
  expect(confirmation).toHaveAttribute('type', 'text');
  expect(password).toHaveAttribute('type', 'password');
  await user.keyboard('{Enter}');
  expect(confirmation).toHaveAttribute('type', 'password');
  await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
  expect(password).toHaveAttribute('type', 'text');
  expect(confirmation).toHaveValue(REGISTRATION_VALUES.confirmPassword);
  expect(register).not.toHaveBeenCalled();
});

it('REG-US2-2/3/5/7/8 blur, pegado y límites sin truncar ni enviar', async () => {
  const { user, register } = setup();
  for (const [label, value, message] of [
    ['Nombre completo', ' '.repeat(4), 'Ingresa tu nombre completo'],
    ['Correo electrónico', 'usuario@', 'Ingresa un correo electrónico válido'],
    ['Contraseña', 'x'.repeat(7), 'La contraseña debe tener al menos 8 caracteres'],
    ['Confirmar contraseña', 'x'.repeat(129), 'La contraseña no puede superar 128 caracteres'],
  ] as const) {
    const input = screen.getByLabelText(label);
    await user.click(input);
    await user.paste(value);
    await user.tab();
    expect(input).toHaveAccessibleDescription(message);
  }
  const name = screen.getByLabelText('Nombre completo');
  await user.clear(name);
  await user.click(name);
  await user.paste('a'.repeat(101));
  await user.tab();
  expect(name).toHaveValue('a'.repeat(101));
  expect(name).toHaveAccessibleDescription('El nombre completo no puede superar 100 caracteres');
  const terms = screen.getByRole('checkbox');
  await user.click(terms);
  await user.click(terms);
  await user.tab();
  expect(terms).toHaveAccessibleDescription('Debes aceptar los términos y condiciones');
  expect(register).not.toHaveBeenCalled();
});
it('REG-US2 primer error restante recibe foco, incluyendo términos', async () => {
  const { user, register } = setup();
  fill();
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  expect(screen.getByRole('checkbox')).toHaveFocus();
  expect(register).not.toHaveBeenCalled();
});
it.each(['ctrlKey', 'metaKey', 'shiftKey', 'altKey'] as const)(
  'REG-US3 enlace con %s conserva navegación convencional',
  (key) => {
    const { navigate } = setup();
    const link = screen.getByRole('link', { name: 'Inicia sesión' });
    link.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(link, { [key]: true });
    expect(navigate).not.toHaveBeenCalled();
    expect(link).toHaveAttribute('href', '/login');
  },
);
it('REG-US3 enlace funciona sin callback de navegación', () => {
  render(<RegistrationForm register={createRegistrationStub().register} onSuccess={vi.fn()} />);
  const link = screen.getByRole('link', { name: 'Inicia sesión' });
  link.addEventListener('click', (event) => event.preventDefault());
  fireEvent.click(link);
  expect(link).toHaveAttribute('href', '/login');
});

it('REG-US5-4 nuevos errores se anuncian de manera no intrusiva', async () => {
  const { user } = setup();
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  expect(screen.getByText('Ingresa tu nombre completo')).toHaveAttribute('aria-live', 'polite');
  expect(screen.getByText('Debes aceptar los términos y condiciones')).toHaveAttribute(
    'aria-live',
    'polite',
  );
});

it('REG-FR-016 texto con apariencia ejecutable permanece como valor, nunca HTML', () => {
  const { register } = setup();
  const value = '<img src=x onerror=alert(1)>';
  fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value } });
  expect(screen.getByLabelText('Nombre completo')).toHaveValue(value);
  expect(document.querySelector('img[src="x"]')).toBeNull();
  fireEvent.submit(screen.getByRole('form', { name: 'Registro de demostración' }));
  expect(register).not.toHaveBeenCalled();
});
