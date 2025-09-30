import { useRef, useState } from 'react';
import { useImageUpload, useFileDelete } from '../hooks';
import type { ImageUploadResponse } from '../types';

/**
 * Example component demonstrating image upload functionality
 * This is a reference implementation for testing the upload API
 * 
 * Usage: Import and use this component in your character form
 */
export function ImageUploadExample() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<ImageUploadResponse[]>([]);

  const {
    uploadImage,
    isUploading,
    error: uploadError,
    uploadedFile,
    clearError: clearUploadError,
    reset,
  } = useImageUpload({
    onSuccess: (response) => {
      console.log('✅ Upload successful:', response);
      setUploadedFiles((prev) => [...prev, response]);
      reset();
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      console.error('❌ Upload failed:', error);
    },
  });

  const {
    deleteFile,
    isDeleting,
    error: deleteError,
    clearError: clearDeleteError,
  } = useFileDelete({
    onSuccess: (response) => {
      console.log('✅ Delete successful:', response);
      setUploadedFiles((prev) => prev.filter((f) => f.id !== response.deletedId));
    },
    onError: (error) => {
      console.error('❌ Delete failed:', error);
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Upload with optional metadata
    await uploadImage({
      file,
      metadata: {
        description: 'Character profile image',
        tags: ['character', 'avatar'],
      },
    });
  };

  const handleDelete = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      await deleteFile(fileId);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Image Upload Test</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        This is a test component for the file upload API. Use this to verify that uploads are working correctly.
      </p>

      {/* Upload Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Upload Image</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={isUploading}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
          }}
        />

        {/* Upload Progress */}
        {isUploading && (
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>Uploading...</p>
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{uploadError}</span>
            <button
              onClick={clearUploadError}
              style={{
                background: 'none',
                border: 'none',
                color: '#c62828',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Just Uploaded File */}
        {uploadedFile && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              borderRadius: '4px',
            }}
          >
            <strong>✓ Upload successful!</strong>
            <p style={{ fontSize: '12px', marginTop: '5px' }}>File ID: {uploadedFile.id}</p>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      <div>
        <h3>Uploaded Files ({uploadedFiles.length})</h3>
        {uploadedFiles.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No files uploaded yet</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '15px',
                  display: 'flex',
                  gap: '15px',
                  alignItems: 'start',
                }}
              >
                {/* Image Preview */}
                <img
                  src={file.url}
                  alt={file.filename}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0',
                  }}
                />

                {/* File Info */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>{file.filename}</h4>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    <p>ID: {file.id}</p>
                    <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                    <p>Type: {file.mimeType}</p>
                    <p>Uploaded: {new Date(file.uploadedAt).toLocaleString()}</p>
                  </div>
                  {file.metadata && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      <strong>Metadata:</strong>
                      <pre style={{ margin: '5px 0', fontSize: '11px' }}>
                        {JSON.stringify(file.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#1976d2',
                      textDecoration: 'none',
                    }}
                  >
                    View Full Size →
                  </a>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(file.id)}
                  disabled={isDeleting}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    opacity: isDeleting ? 0.6 : 1,
                  }}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Delete Error */}
        {deleteError && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{deleteError}</span>
            <button
              onClick={clearDeleteError}
              style={{
                background: 'none',
                border: 'none',
                color: '#c62828',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}