import { render, screen } from '@testing-library/react';
import { TextField } from './TextField';
it('002/AC-304 conserva descripción externa y error asociado', () => {
  render(
    <>
      <p id="help">Instrucción</p>
      <TextField label="Dato" aria-describedby="help" error="Corrige el dato" />
    </>,
  );
  expect(screen.getByLabelText('Dato')).toHaveAccessibleDescription('Instrucción Corrige el dato');
});
