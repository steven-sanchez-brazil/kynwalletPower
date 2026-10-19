import { render, screen, within } from '@testing-library/react';
import { AuthScreen } from './AuthScreen';

describe('AuthScreen', () => {
  it('REG US3-3 / FR-011: muestra los hijos dentro de un main y el panel de marca indicado', () => {
    render(
      <AuthScreen brand="registration">
        <p>Contenido del formulario</p>
      </AuthScreen>,
    );
    const main = screen.getByRole('main');
    expect(within(main).getByText('Contenido del formulario')).toBeInTheDocument();
    expect(screen.getByText(/Comienza tu.*camino financiero\./)).toBeInTheDocument();
  });

  it('el login es la variante por defecto', () => {
    render(
      <AuthScreen>
        <p>Formulario</p>
      </AuthScreen>,
    );
    expect(screen.getByText(/Tu dinero.*sin fronteras\./)).toBeInTheDocument();
  });
});
