/**
 * File Upload Feature
 * Handles image upload and deletion for character profiles
 */

// API
export { fileUploadApi } from './api';

// Hooks
export { useImageUpload, useFileDelete } from './hooks';
export type { UseImageUploadOptions, UseFileDeleteOptions } from './hooks';

// Types
export type {
  ImageUploadResponse,
  FileDeleteResponse,
  FileUploadErrorResponse,
  ImageUploadRequest,
  FileValidationResult,
} from './types';

export {
  FILE_UPLOAD_CONFIG,
  isValidImageType,
  isValidImageExtension,
  isValidImageSize,
  validateImageFile,
} from './types';