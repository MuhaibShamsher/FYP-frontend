import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { toast } from 'sonner';

/**
 * Enterprise middleware to handle API errors and success messages globally.
 * Listens for rejected API actions and displays the message from the backend.
 */
export const apiErrorMiddleware: Middleware = () => (next) => (action) => {
  // Check if the action is a rejected API call
  if (isRejectedWithValue(action)) {
    const payload = action.payload as any;
    
    // Extract message from the structured API response
    const errorMessage = payload?.data?.message || payload?.message || 'An unexpected error occurred';

    // Show toast for the error
    toast.error(errorMessage);
  }

  return next(action);
};
