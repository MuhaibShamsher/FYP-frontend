import { useState, useCallback } from 'react';
import { useResetPasswordEmailMutation } from '@/apis';
import { useErrorHandler } from '@/hooks';
import { toast } from 'sonner';

interface UseForgotPasswordReturn {
  email: string;
  setEmail: (email: string) => void;
  isSending: boolean;
  isSuccess: boolean;
  handleSendEmail: (e: React.FormEvent) => Promise<void>;
}

export default function useForgotPassword(): UseForgotPasswordReturn {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { handleError, handleAsyncError } = useErrorHandler({
    showToast: true,
    logToConsole: true,
  });

  const [resetPasswordEmail, { isLoading: isSending }] = useResetPasswordEmailMutation();

  const handleSendEmail = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) {
        handleError('Email is required');
        return;
      }

      const result = await handleAsyncError(async () => {
        await resetPasswordEmail(email).unwrap();
        return true;
      }, 'Failed to send password reset email');

      if (result) {
        setIsSuccess(true);
        toast.success('Password reset email sent successfully! Please check your inbox.');
      }
    },
    [email, resetPasswordEmail, handleAsyncError, handleError]
  );

  return {
    email,
    setEmail,
    isSending,
    isSuccess,
    handleSendEmail,
  };
}
