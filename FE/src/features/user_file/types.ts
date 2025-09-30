/**
 * File Upload types
 * Based on the file upload API schema from API.md
 */

// Response types - using camelCase to match frontend conventions
export interface ImageUploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  metadata?: {
    description?: string;
    tags?: string[];
    [key: string]: any;
  };
}

export interface FileDeleteResponse {
  message: string;
  deletedId: string;
  deletedAt: string;
}

export interface FileUploadErrorResponse {
  error: {
    code: string;
    message: string;
    details?: {
      maxSize?: number;
      allowedTypes?: string[];
      currentSize?: number;
    };
  };
}

// Request types
export interface ImageUploadRequest {
  file: File;
  metadata?: {
    description?: string;
    tags?: string[];
    [key: string]: any;
  };
}

// File upload configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ] as const,
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const,
} as const;

// Type guards
export function isValidImageType(type: string): boolean {
  return FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(type as any);
}

export function isValidImageExtension(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(extension as any) : false;
}

export function isValidImageSize(size: number): boolean {
  return size <= FILE_UPLOAD_CONFIG.MAX_FILE_SIZE;
}

// Validation result
export interface FileValidationResult {
  valid: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Validate image file before upload
export function validateImageFile(file: File): FileValidationResult {
  // Check file size
  if (!isValidImageSize(file.size)) {
    return {
      valid: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: `File size exceeds maximum allowed size of ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
        details: {
          maxSize: FILE_UPLOAD_CONFIG.MAX_FILE_SIZE,
          currentSize: file.size,
        },
      },
    };
  }

  // Check file type
  if (!isValidImageType(file.type)) {
    return {
      valid: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: 'Invalid file type. Only image files are allowed.',
        details: {
          allowedTypes: FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES,
          receivedType: file.type,
        },
      },
    };
  }

  // Check file extension
  if (!isValidImageExtension(file.name)) {
    return {
      valid: false,
      error: {
        code: 'INVALID_FILE_EXTENSION',
        message: 'Invalid file extension.',
        details: {
          allowedExtensions: FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS,
        },
      },
    };
  }

  return { valid: true };
}