import { useId, type InputHTMLAttributes, type Ref } from 'react';
import styles from './Checkbox.module.css';
type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'id'> & {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};
export function Checkbox({
  label,
  checked,
  onChange,
  error,
  ref,
  'aria-describedby': description,
  ...props
}: CheckboxProps) {
  const id = useId();
  const errorId = id + '-error';
  return (
    <div>
      <div className={styles.wrapper}>
        <input
          {...props}
          id={id}
          ref={ref}
          type="checkbox"
          className={styles.box}
          checked={checked}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [description, error ? errorId : undefined].filter(Boolean).join(' ') || undefined
          }
          onChange={(event) => onChange(event.target.checked)}
        />
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      </div>
      {error && (
        <p className={styles.error} id={errorId} aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
