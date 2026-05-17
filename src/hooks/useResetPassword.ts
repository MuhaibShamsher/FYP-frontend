import { useState, useCallback } from 'react';
import { useResetPasswordMutation } from '@/apis';
import { useErrorHandler } from '@/hooks';
import { toast } from 'sonner';

interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

interface UseResetPasswordReturn {
  passwordData: {
    newPassword: string;
    confirmPassword: string;
  };
  passwordVisibility: {
    showNewPassword: boolean;
    showConfirmPassword: boolean;
  };
  passwordStrength: PasswordStrength;
  isResetting: boolean;
  isSuccess: boolean;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setShowNewPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  handleResetPassword: (userId: string, resetToken: string) => Promise<void>;
}

export default function useResetPassword(): UseResetPasswordReturn {
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const { handleError, handleAsyncError } = useErrorHandler({
    showToast: true,
    logToConsole: true,
  });

  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const validatePasswordStrength = useCallback(
    (password: string): PasswordStrength => {
      const hasMinLength = password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      return {
        hasMinLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecial,
        isValid:
          hasMinLength &&
          hasUpperCase &&
          hasLowerCase &&
          hasNumber &&
          hasSpecial,
      };
    },
    []
  );

  const passwordStrength = validatePasswordStrength(passwordData.newPassword);

  const setNewPassword = useCallback((value: string) => {
    setPasswordData((prev) => ({ ...prev, newPassword: value }));
  }, []);

  const setConfirmPassword = useCallback((value: string) => {
    setPasswordData((prev) => ({ ...prev, confirmPassword: value }));
  }, []);

  const setShowNewPassword = useCallback((show: boolean) => {
    setPasswordVisibility((prev) => ({ ...prev, showNewPassword: show }));
  }, []);

  const setShowConfirmPassword = useCallback((show: boolean) => {
    setPasswordVisibility((prev) => ({ ...prev, showConfirmPassword: show }));
  }, []);

  const handleResetPassword = useCallback(
    async (userId: string, resetToken: string) => {
      if (!passwordData.newPassword) {
        handleError('Password is required');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        handleError('Passwords do not match');
        return;
      }

      if (!passwordStrength.isValid) {
        handleError('Password does not meet safety requirements');
        return;
      }

      const result = await handleAsyncError(async () => {
        await resetPassword({
          user_id: userId,
          reset_token: resetToken,
          password: passwordData.newPassword,
        }).unwrap();
        return true;
      }, 'Failed to reset password');

      if (result) {
        setIsSuccess(true);
        toast.success('Password reset successfully! You can now log in.');
      }
    },
    [passwordData, passwordStrength.isValid, resetPassword, handleAsyncError, handleError]
  );

  return {
    passwordData,
    passwordVisibility,
    passwordStrength,
    isResetting,
    isSuccess,
    setNewPassword,
    setConfirmPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    handleResetPassword,
  };
}
