import { apiClient } from '@/shared/lib/api-client';
import type {
  ImageUploadRequest,
  ImageUploadResponse,
  FileDeleteResponse,
} from './types';

/**
 * File Upload API
 * Handles image upload and deletion for character profiles
 */
export const fileUploadApi = {
  /**
   * Upload a character profile image
   */
  async uploadImage(request: ImageUploadRequest): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', request.file);

    if (request.metadata) {
      formData.append('metadata', JSON.stringify(request.metadata));
    }

    return apiClient.postFormData<ImageUploadResponse>('upload/image', formData);
  },

  /**
   * Delete an uploaded file
   */
  async deleteFile(fileId: string): Promise<FileDeleteResponse> {
    return apiClient.delete<FileDeleteResponse>(`upload/delete/${fileId}`);
  },
};