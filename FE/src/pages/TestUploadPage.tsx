import { ImageUploadExample } from '@/features/user_file/components';

/**
 * Test page for file upload functionality
 * This is a temporary page for testing the upload API
 * 
 * Access via: /test-upload
 */
export default function TestUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            File Upload API Test
          </h1>
          <p className="text-gray-600">
            Test the image upload and deletion functionality
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a temporary test page. Make sure your backend is running on the correct port.
            </p>
          </div>
        </div>
        
        <ImageUploadExample />
        
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Test Instructions
          </h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Select an image file (JPG, PNG, WebP, GIF)</li>
            <li>File size should be under 10MB</li>
            <li>Click upload and watch the console for API responses</li>
            <li>Check Supabase Storage for uploaded files</li>
            <li>Test the delete functionality</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
