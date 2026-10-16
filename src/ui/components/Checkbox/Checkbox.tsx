import { useId, type ReactNode, type Ref } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Nombre accesible completo cuando la etiqueta visible se complementa con `addon`. */
  ariaLabel?: string;
  /** Contenido interactivo junto a la etiqueta, fuera del <label> para no alternar la casilla. */
  addon?: ReactNode;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Checkbox({
  label,
  checked,
  onChange,
  ariaLabel,
  addon,
  error,
  ref,
}: CheckboxProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={styles.field}>
      <div className={styles.wrapper}>
        <input
          id={id}
          ref={ref}
          type="checkbox"
          className={[styles.box, error && styles.invalid].filter(Boolean).join(' ')}
          checked={checked}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className={styles.text}>
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
          {addon}
        </span>
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
