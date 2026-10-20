import { useId, type InputHTMLAttributes, type Ref } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur'];
};

export function Checkbox({
  label,
  checked,
  onChange,
  description,
  error,
  inputRef,
  onBlur,
}: CheckboxProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const describedBy = [description && descriptionId, error && errorId].filter(Boolean).join(' ');
  return (
    <div className={styles.wrapper}>
      <div className={styles.control}>
        <input
          id={id}
          ref={inputRef}
          type="checkbox"
          className={styles.box}
          checked={checked}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          onChange={(event) => onChange(event.target.checked)}
          onBlur={onBlur}
        />
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      </div>
      {description && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
