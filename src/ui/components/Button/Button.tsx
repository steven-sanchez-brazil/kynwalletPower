import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'link';
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  loading = false,
  loadingLabel,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  return (
    <button
      {...rest}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && (
        <svg
          className={styles.spinner}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
          <title>Cargando</title>
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="38 13"
            strokeLinecap="round"
          />
        </svg>
      )}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
