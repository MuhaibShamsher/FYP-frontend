import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/store/apis/authApis';
import { loginSuccess } from '@/store/slices/authSlice';

interface UseLoginPageReturn {
  // Form state
  email: string;
  password: string;
  showPassword: boolean;
  scanProgress: number;

  // Loading and error states
  isLoginLoading: boolean;
  loginError: any;

  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  setScanProgress: (progress: number) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
}

export default function useLoginPage(): UseLoginPageReturn {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setScanProgress(0);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 100);

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(loginSuccess(result));
      setScanProgress(100);
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err: any) {
      console.error('Login failed:', err);
      setScanProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  }, [email, password, login, dispatch, navigate]);

  return {
    // Form state
    email,
    password,
    showPassword,
    scanProgress,

    // Loading and error states
    isLoginLoading,
    loginError,

    // Actions
    setEmail,
    setPassword,
    setShowPassword,
    setScanProgress,
    handleLogin,
  };
}
