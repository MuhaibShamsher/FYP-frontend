import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  defaultMessage?: string;
}

type AsyncOperation<T> = () => Promise<T>;

const FALLBACK_MESSAGE = 'An unexpected error occurred';

function extractErrorMessage(error: unknown): string {
  if (!error) return FALLBACK_MESSAGE;

  if (typeof error === 'string') return error;

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const e = error as {
      message?: string;
      data?: {
        message?: string;
      };
      error?: string;
      status?: number | string;
    };

    if (e.data?.message) return e.data.message;
    if (e.message) return e.message;
    if (e.error) return e.error;
    if (e.status) return `Request failed with status ${e.status}`;
  }

  return FALLBACK_MESSAGE;
}

export default function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    showToast = false,
    logToConsole = false,
    defaultMessage = FALLBACK_MESSAGE,
  } = options;

  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback(
    (err: unknown, customMessage?: string): string => {
      const parsed = extractErrorMessage(err);
      const message = customMessage || parsed || defaultMessage;

      setError(message);

      if (showToast) {
        toast.error(message);
      }

      if (logToConsole) {
        console.error('[useErrorHandler]', err);
      }

      return message;
    },
    [defaultMessage, logToConsole, showToast]
  );

  const handleAsyncError = useCallback(
    async <T>(operation: AsyncOperation<T>, customMessage?: string) => {
      try {
        clearError();
        return await operation();
      } catch (err) {
        handleError(err, customMessage);
        return false as T | false;
      }
    },
    [clearError, handleError]
  );

  return {
    error,
    setError,
    clearError,
    handleError,
    handleAsyncError,
  };
}
