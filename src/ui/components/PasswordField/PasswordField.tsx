import { useState } from 'react';
import eyeIcon from '@/ui/assets/eye.svg';
import { TextField, type TextFieldProps } from '../TextField/TextField';
import styles from './PasswordField.module.css';

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'endAdornment'> & {
  /** Nombres accesibles del control; distinguen varios campos en un formulario (002). */
  showLabel?: string;
  hideLabel?: string;
};

/** Campo de contraseña con control accesible de visibilidad (FR-013). */
export function PasswordField({
  showLabel = 'Mostrar contraseña',
  hideLabel = 'Ocultar contraseña',
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          className={styles.toggle}
          aria-pressed={visible}
          aria-label={visible ? hideLabel : showLabel}
          onClick={() => setVisible((current) => !current)}
        >
          <img src={eyeIcon} alt="" width={20} height={12} />
        </button>
      }
    />
  );
}
