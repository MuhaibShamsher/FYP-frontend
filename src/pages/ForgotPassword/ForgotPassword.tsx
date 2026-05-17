import { Link } from 'react-router-dom';
import { useForgotPassword } from '@/hooks';
import { Button } from '@/components/ui';
import { TypingText } from '@/components/custom';
import { Mail, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import AuthLayout from '@/layout/AuthLayout/AuthLayout';
import styles from './ForgotPassword.module.css';

export default function ForgotPasswordPage() {
  const { email, setEmail, isSending, isSuccess, handleSendEmail } = useForgotPassword();

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        {!isSuccess ? (
          <>
            {/* Form Header */}
            <div className={styles.formHeader}>
              <h2 className={styles.welcomeTitle}>
                <TypingText text="PASSWORD RESET" speed={80} />
              </h2>
              <p className={styles.formSubtitle}>
                Enter the email address registered to your account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSendEmail} className={styles.form}>
              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputLabel}>Email Address</label>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={styles.input}
                    required
                  />
                  <Mail className={styles.inputIcon} />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSending}
                className={styles.submitButton}
              >
                {isSending ? (
                  <>
                    <Zap className={`${styles.btnActionIcon} ${styles.spinningIcon}`} />
                    SENDING EMAIL...
                  </>
                ) : (
                  'SEND RECOVERY LINK'
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className={styles.successContainer}>
            <div className={styles.successIconBox}>
              <CheckCircle2 className={styles.successIcon} />
            </div>
            <h2 className={styles.successTitle}>RECOVERY LINK SENT</h2>
            <p className={styles.successDesc}>
              If a registered account exists for <strong>{email}</strong>, a recovery link will arrive containing further security directions.
            </p>
          </div>
        )}

        {/* Links */}
        <div className={styles.linksContainer}>
          <Link to="/login" className={styles.backToLoginLink}>
            <ArrowLeft className={styles.linkIcon} />
            BACK TO LOGIN PAGE
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
