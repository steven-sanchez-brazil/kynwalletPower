import { useId, type Ref } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  actionLabel?: string;
  onAction?: () => void;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Checkbox({
  label,
  checked,
  onChange,
  actionLabel,
  onAction,
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
          className={styles.box}
          checked={checked}
          aria-label={actionLabel ? `${label} ${actionLabel}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {actionLabel && (
          <button className={styles.action} type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
