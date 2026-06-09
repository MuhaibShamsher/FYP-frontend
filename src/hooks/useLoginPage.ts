import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/apis';
import { loginSuccess } from '@/store/slices/authSlice';

interface UseLoginPageReturn {
  // Form state
  email: string;
  password: string;
  showPassword: boolean;

  // Loading and error states
  isLoginLoading: boolean;
  loginError: any;

  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
}

export default function useLoginPage(): UseLoginPageReturn {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation();

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const result = await login({ email, password }).unwrap();
        dispatch(loginSuccess(result));
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Login failed:', err);
      }
    },
    [email, password, login, dispatch, navigate]
  );

  return {
    // Form state
    email,
    password,
    showPassword,

    // Loading and error states
    isLoginLoading,
    loginError,

    // Actions
    setEmail,
    setPassword,
    setShowPassword,
    handleLogin,
  };
}
