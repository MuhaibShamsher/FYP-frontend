import { CheckCircle } from 'lucide-react';
import styles from './PasswordRequirement.module.css';

export function PasswordRequirement({
  met,
  text,
}: {
  met: boolean;
  text: string;
}) {
  return (
    <div className={styles.requirement}>
      {met ? (
        <CheckCircle className={styles.requirementIcon} />
      ) : (
        <div className={styles.requirementIconUnmet} />
      )}
      <span
        className={`${styles.requirementText} ${met ? styles.requirementTextMet : styles.requirementTextUnmet}`}
      >
        {text}
      </span>
    </div>
  );
}
