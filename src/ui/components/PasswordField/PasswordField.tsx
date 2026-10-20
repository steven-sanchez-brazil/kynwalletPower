import { useState } from 'react';
import eyeIcon from '@/ui/assets/eye.svg';
import { TextField, type TextFieldProps } from '../TextField/TextField';
import styles from './PasswordField.module.css';

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'endAdornment'> & {
  visible?: boolean;
  onToggleVisibility?: () => void;
};

/** Campo de contraseña con control accesible de visibilidad (FR-013). */
export function PasswordField({
  visible: controlledVisible,
  onToggleVisibility,
  ...props
}: PasswordFieldProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const isControlled = controlledVisible !== undefined;
  const isVisible = isControlled ? controlledVisible : internalVisible;

  const handleToggle = () => {
    if (isControlled) {
      onToggleVisibility?.();
    } else {
      setInternalVisible((current) => !current);
    }
  };

  return (
    <TextField
      {...props}
      type={isVisible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          className={styles.toggle}
          aria-pressed={isVisible}
          aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          onClick={handleToggle}
        >
          <img src={eyeIcon} alt="" width={20} height={12} />
        </button>
      }
    />
  );
}
