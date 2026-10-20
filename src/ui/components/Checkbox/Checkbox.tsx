import { useId } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

export function Checkbox({ label, checked, onChange, error }: CheckboxProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <input
          id={id}
          type="checkbox"
          className={styles.box}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      </div>
      {error && <p id={errorId} className={styles.error}>{error}</p>}
    </div>
  );
}
