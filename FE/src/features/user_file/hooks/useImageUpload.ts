import { useState, useCallback } from 'react';
import { useSession } from '@clerk/clerk-react';
import { fileUploadApi } from '../api';
import type {
  ImageUploadRequest,
  ImageUploadResponse,
  FileValidationResult,
} from '../types';
import { validateImageFile } from '../types';

export interface UseImageUploadOptions {
  onSuccess?: (response: ImageUploadResponse) => void;
  onError?: (error: Error) => void;
  validateBeforeUpload?: boolean;
}

/**
 * Hook for uploading character profile images
 * 
 * @example
 * ```tsx
 * const { uploadImage, isUploading, error, uploadedFile } = useImageUpload({
 *   onSuccess: (response) => console.log('Uploaded:', response.url),
 *   onError: (error) => console.error('Error:', error),
 * });
 * 
 * const handleFileChange = async (file: File) => {
 *   const result = await uploadImage({
 *     file,
 *     metadata: { description: 'Character avatar' }
 *   });
 * };
 * ```
 */
export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    onSuccess,
    onError,
    validateBeforeUpload = true,
  } = options;

  const { session } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<ImageUploadResponse | null>(null);

  const uploadImage = useCallback(async (
    request: ImageUploadRequest
  ): Promise<ImageUploadResponse | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file before upload if enabled
      if (validateBeforeUpload) {
        const validation: FileValidationResult = validateImageFile(request.file);
        if (!validation.valid && validation.error) {
          throw new Error(validation.error.message);
        }
      }

      // Upload the file (token auto-injected by apiClient)
      const response = await fileUploadApi.uploadImage(request);

      setUploadedFile(response);

      // Call success callback
      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to upload image';
      setError(errorMessage);

      // Call error callback
      if (onError) {
        onError(e instanceof Error ? e : new Error(errorMessage));
      }

      return null;
    } finally {
      setIsUploading(false);
    }
  }, [validateBeforeUpload, onSuccess, onError]);

  const clearError = useCallback(() => setError(null), []);

  const reset = useCallback(() => {
    setError(null);
    setUploadedFile(null);
  }, []);

  return {
    uploadImage,
    isUploading,
    error,
    uploadedFile,
    clearError,
    reset,
  };
}