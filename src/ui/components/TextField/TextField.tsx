import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import styles from './TextField.module.css';

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string;
  error?: string;
  endAdornment?: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export function TextField({
  label,
  error,
  endAdornment,
  ref,
  className,
  ...inputProps
}: TextFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={[styles.control, error && styles.invalid].filter(Boolean).join(' ')}>
        <input
          {...inputProps}
          id={inputId}
          ref={ref}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        {endAdornment}
      </div>
      {error && (
        <p id={errorId} className={styles.error} aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
