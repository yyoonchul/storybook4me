import React from 'react';
import { Button } from '../../../shared/components/ui/button';
import { Separator } from '../../../shared/components/ui/separator';
import { Textarea } from '../../../shared/components/ui/textarea';
import { Loader2, Trash2 } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type StorybookPreviewProps = {
  storybook: any;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  pageText: string | null | undefined;
  setPageText: (v: string) => void;
  isPageFetching: boolean;
  onDeleteClick: () => void;
  isDeleting: number | false;
  pageStatus: SaveStatus;
  pageManagementError: string | null;
  clearError: () => void;
};

export function StorybookPreview({
  storybook,
  currentPage,
  isLoading,
  error,
  pageText,
  setPageText,
  isPageFetching,
  onDeleteClick,
  isDeleting,
  pageStatus,
  pageManagementError,
  clearError,
}: StorybookPreviewProps) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
      {/* Image Side */}
      <div className="relative bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center p-6 min-h-0">
        {(() => {
          const pageData = storybook?.pages?.[currentPage];
          const actualImageUrl = pageData?.image_url || pageData?.imageUrl || null;
          const src = actualImageUrl || '/placeholder.svg';
          return (
            <>
              <div className="aspect-square w-full max-w-xs">
                <img
                  src={src}
                  alt={actualImageUrl ? `Page ${currentPage + 1} image` : `Preview`}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              {!actualImageUrl && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-xs px-3 py-1 rounded-full border shadow">
                  This is a preview image. Actual images will be custom-generated.
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Text Side */}
      <div className="relative p-6 flex flex-col justify-center bg-white/50 min-h-0">
        {/* Delete Page Button */}
        {(storybook?.pages?.length || 0) > 1 && (
          <Button
            variant="outline"
            size="icon"
            onClick={onDeleteClick}
            disabled={isDeleting === currentPage + 1}
            className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 border-gray-300 hover:border-red-300 text-gray-600 hover:text-red-600 w-8 h-8 transition-colors"
          >
            {isDeleting === currentPage + 1 ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        )}

        <div className="text-center lg:text-left">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading storybook...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">Error loading storybook: {error}</div>
          ) : (
            <>
              <Textarea
                value={pageText ?? ''}
                onChange={(e) => setPageText(e.target.value)}
                className="text-base leading-relaxed text-gray-700 mb-4 min-h-[120px] resize-none border-0 bg-transparent p-0 focus:ring-0 focus:border-0"
                placeholder="Enter your story text here..."
                disabled={isPageFetching}
              />

              <Separator className="my-4" />

              <div className="text-sm text-muted-foreground flex justify-between items-center">
                <span>Page {currentPage + 1} of {storybook?.pages?.length || 0}</span>
                <div className="flex items-center gap-2">
                  {pageStatus === 'saving' && (
                    <span className="text-purple-400 text-xs">Saving...</span>
                  )}
                  {pageStatus === 'saved' && (
                    <span className="text-purple-700 text-xs">Saved</span>
                  )}
                  {pageStatus === 'error' && (
                    <span className="text-red-500 text-xs">Save failed</span>
                  )}
                  {pageManagementError && (
                    <span className="text-red-500 text-xs cursor-pointer" onClick={clearError}>
                      Page error: {pageManagementError}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
