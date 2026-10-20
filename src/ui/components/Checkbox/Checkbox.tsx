import { useId, type InputHTMLAttributes, type Ref } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'checked'
> & {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};
export function Checkbox({ label, checked, onChange, error, ref, ...props }: CheckboxProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const errorId = `${id}-error`;
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
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      </div>
      {error && (
        <p id={errorId} className={styles.error} aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
