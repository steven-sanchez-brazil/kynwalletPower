import { useId, type ReactNode, type Ref } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = {
  label: ReactNode;
  ariaLabel?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Checkbox({ label, ariaLabel, checked, onChange, error, ref }: CheckboxProps) {
  const id = useId();
  const errorId = id + '-error';
  return (
    <div className={styles.field}>
      <div className={styles.wrapper}>
        <input
          id={id}
          ref={ref}
          type="checkbox"
          className={styles.box}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
