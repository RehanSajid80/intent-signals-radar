
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseErrorHandlerReturn {
  error: string | null;
  isLoading: boolean;
  handleAsync: <T>(asyncFn: () => Promise<T>) => Promise<T | null>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAsync = useCallback(async <T,>(asyncFn: () => Promise<T>): Promise<T | null> => {
    try {
      setError(null);
      setIsLoading(true);
      const result = await asyncFn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('Error in async operation:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    error,
    isLoading,
    handleAsync,
    clearError,
    setLoading
  };
};
