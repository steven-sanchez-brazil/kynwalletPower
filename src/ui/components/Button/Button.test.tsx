import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '@/test/a11y';
import { Button } from './Button';

describe('Button', () => {
  it('Registro FR-010: muestra spinner solo durante la carga sin cambiar el nombre accesible', () => {
    const { rerender } = render(
      <Button loading loadingLabel="Creando cuenta…">
        Crear cuenta
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Creando cuenta…' });
    expect(screen.getByTitle('Cargando').closest('svg')).toBeVisible();
    expect(button).toContainElement(screen.getByTitle('Cargando'));
    expect(button).toBeDisabled();
    rerender(<Button>Crear cuenta</Button>);
    expect(screen.queryByTitle('Cargando')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled();
  });
  it('renderiza su texto como botón con type="button" por defecto', () => {
    render(<Button>Iniciar sesión</Button>);
    const button = screen.getByRole('button', { name: 'Iniciar sesión' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('aplica la variante indicada', () => {
    render(
      <>
        <Button variant="primary">Uno</Button>
        <Button variant="secondary">Dos</Button>
        <Button variant="link">Tres</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Tres' })).toHaveClass('link');
    expect(screen.getByRole('button', { name: 'Uno' })).toHaveClass('primary');
    expect(screen.getByRole('button', { name: 'Dos' })).toHaveClass('secondary');
  });

  it('FR-008: en carga está deshabilitado, aria-busy y muestra loadingLabel', () => {
    render(
      <Button loading loadingLabel="Iniciando sesión…">
        Iniciar sesión
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Iniciando sesión…' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('invoca onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ok</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Ok' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('FR-015: no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Button>Ok</Button>);
    await expectNoA11yViolations(container);
  });
});
