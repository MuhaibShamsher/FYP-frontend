import type { ReactNode } from 'react';
import styles from './PasswordField.module.css';

export function PasswordField({
  label,
  value,
  onChange,
  type,
  placeholder,
  toggleIcon,
  onToggle,
  isVisible,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: 'text' | 'password';
  placeholder: string;
  toggleIcon: ReactNode;
  onToggle: () => void;
  isVisible: boolean;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.formLabel}>{label}</label>
      <div className={styles.inputGroup}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={styles.inputField}
        />
        <button
          type="button"
          onClick={onToggle}
          className={styles.togglePasswordButton}
          aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
        >
          {toggleIcon}
        </button>
      </div>
    </div>
  );
}
