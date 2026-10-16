import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id' | 'onChange'> & {
  label: string;
  labelSuffix?: ReactNode;
  error?: string;
  ref?: Ref<HTMLInputElement>;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({
  label,
  labelSuffix,
  error,
  ref,
  checked,
  onChange,
  ...props
}: CheckboxProps) {
  const id = useId();
  return (
    <div className={styles.field}>
      <div className={styles.wrapper}>
        <input
          {...props}
          ref={ref}
          id={id}
          type="checkbox"
          className={styles.box}
          checked={checked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-labelledby={labelSuffix ? `${id}-label ${id}-suffix` : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className={styles.text}>
          <label id={`${id}-label`} htmlFor={id} className={styles.label}>
            {label}
          </label>
          {labelSuffix && <span id={`${id}-suffix`}>{labelSuffix}</span>}
        </span>
      </div>
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
