import { useState, useCallback } from 'react';
import { useChangePasswordMutation } from '@/apis';
import { useErrorHandler } from '@/hooks';

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordVisibility {
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

interface UseSettingsPageReturn {
  // Form data
  passwordData: PasswordFormData;
  passwordVisibility: PasswordVisibility;
  passwordStrength: PasswordStrength;

  // Loading states
  isChangingPassword: boolean;

  // Actions
  setOldPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setShowOldPassword: (show: boolean) => void;
  setShowNewPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  handleChangePassword: (e: React.FormEvent) => Promise<void>;

  // Validation
  validatePasswordStrength: (password: string) => PasswordStrength;
  validateForm: () => { isValid: boolean; errors: string[] };
}

export default function useSettingsPage(): UseSettingsPageReturn {
  const { handleError, handleAsyncError } = useErrorHandler({
    showToast: true,
    logToConsole: true,
  });

  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  // Form data state
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password visibility state
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    });

  // Password strength validation
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

  // Get current password strength
  const passwordStrength = validatePasswordStrength(passwordData.newPassword);

  // Form setters
  const setOldPassword = useCallback((value: string) => {
    setPasswordData((prev) => ({ ...prev, oldPassword: value }));
  }, []);

  const setNewPassword = useCallback((value: string) => {
    setPasswordData((prev) => ({ ...prev, newPassword: value }));
  }, []);

  const setConfirmPassword = useCallback((value: string) => {
    setPasswordData((prev) => ({ ...prev, confirmPassword: value }));
  }, []);

  const setShowOldPassword = useCallback((show: boolean) => {
    setPasswordVisibility((prev) => ({ ...prev, showOldPassword: show }));
  }, []);

  const setShowNewPassword = useCallback((show: boolean) => {
    setPasswordVisibility((prev) => ({ ...prev, showNewPassword: show }));
  }, []);

  const setShowConfirmPassword = useCallback((show: boolean) => {
    setPasswordVisibility((prev) => ({ ...prev, showConfirmPassword: show }));
  }, []);

  // Form validation
  const validateForm = useCallback((): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    if (!passwordData.oldPassword) {
      errors.push('Current password is required');
    }

    if (!passwordData.newPassword) {
      errors.push('New password is required');
    }

    if (!passwordData.confirmPassword) {
      errors.push('Password confirmation is required');
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.push('New passwords do not match');
    }

    if (!passwordStrength.isValid) {
      errors.push('Password does not meet security requirements');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [passwordData, passwordStrength.isValid]);

  // Handle password change
  const handleChangePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validation = validateForm();
      if (!validation.isValid) {
        validation.errors.forEach((error) => handleError(error));
        return;
      }

      try {
        await handleAsyncError(async () => {
          await changePassword({
            old_password: passwordData.oldPassword,
            new_password: passwordData.newPassword,
          }).unwrap();
        }, 'Failed to change password');

        // Reset form on success
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (error) {
        // Error is already handled by handleAsyncError
        console.error('Password change failed:', error);
      }
    },
    [passwordData, validateForm, handleError, handleAsyncError, changePassword]
  );

  return {
    // Form data
    passwordData,
    passwordVisibility,
    passwordStrength,

    // Loading states
    isChangingPassword,

    // Actions
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
    setShowOldPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    handleChangePassword,

    // Validation
    validatePasswordStrength,
    validateForm,
  };
}
