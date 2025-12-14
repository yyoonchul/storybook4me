import { useState, useCallback } from 'react';
import { useSession } from '@clerk/clerk-react';
import { fileUploadApi } from '../api';
import type { FileDeleteResponse } from '../types';

export interface UseFileDeleteOptions {
  onSuccess?: (response: FileDeleteResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for deleting uploaded files
 * 
 * @example
 * ```tsx
 * const { deleteFile, isDeleting, error } = useFileDelete({
 *   onSuccess: () => console.log('File deleted'),
 *   onError: (error) => console.error('Error:', error),
 * });
 * 
 * const handleDelete = async () => {
 *   await deleteFile('file_abc123');
 * };
 * ```
 */
export function useFileDelete(options: UseFileDeleteOptions = {}) {
  const { onSuccess, onError } = options;

  const { session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFile = useCallback(async (fileId: string): Promise<FileDeleteResponse | null> => {
    setIsDeleting(true);
    setError(null);

    try {
      // Delete the file (token auto-injected by apiClient)
      const response = await fileUploadApi.deleteFile(fileId);

      // Call success callback
      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to delete file';
      setError(errorMessage);

      // Call error callback
      if (onError) {
        onError(e instanceof Error ? e : new Error(errorMessage));
      }

      return null;
    } finally {
      setIsDeleting(false);
    }
  }, [onSuccess, onError]);

  const clearError = useCallback(() => setError(null), []);

  return {
    deleteFile,
    isDeleting,
    error,
    clearError,
  };
}