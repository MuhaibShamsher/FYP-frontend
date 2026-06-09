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
  isTokenInvalid: boolean;
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
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);

  const { handleError } = useErrorHandler({
    showToast: true,
    logToConsole: true,
  });

  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const validatePasswordStrength = useCallback(
    (password: string): PasswordStrength => {
      const hasMinLength = password.length >= 7;

      return {
        hasMinLength,
        hasUpperCase: true,
        hasLowerCase: true,
        hasNumber: true,
        hasSpecial: true,
        isValid: hasMinLength,
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

      try {
        await resetPassword({
          user_id: userId,
          reset_token: resetToken,
          password: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }).unwrap();
        setIsSuccess(true);
        toast.success('Password reset successfully! You can now log in.');
      } catch (err: any) {
        console.error('Reset password failed:', err);
        const errMsg = err?.data?.message || err?.message || '';
        if (
          errMsg.toLowerCase().includes('invalid') ||
          errMsg.toLowerCase().includes('expire')
        ) {
          setIsTokenInvalid(true);
        } else {
          handleError(errMsg || 'Failed to reset password');
        }
      }
    },
    [passwordData, passwordStrength.isValid, resetPassword, handleError]
  );

  return {
    passwordData,
    passwordVisibility,
    passwordStrength,
    isResetting,
    isSuccess,
    isTokenInvalid,
    setNewPassword,
    setConfirmPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    handleResetPassword,
  };
}
