import React from 'react';
import { Button } from '../../../shared/components/ui/button';
import { Separator } from '../../../shared/components/ui/separator';
import { Textarea } from '../../../shared/components/ui/textarea';
import { Loader2, Trash2 } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type StorybookPreviewProps = {
  storybook: any;
  currentPage: number;
  activeSide: 'left' | 'right';
  onSideChange: (side: 'left' | 'right') => void;
  isLoading: boolean;
  error: string | null;
  pageText: string | null | undefined;
  setPageText: (v: string) => void;
  isPageFetching: boolean;
  onDeleteClick: () => void;
  isDeleting: number | null;
  pageStatus: SaveStatus;
  pageManagementError: string | null;
  clearError: () => void;
  isGenerating?: boolean;
};

export function StorybookPreview({
  storybook,
  currentPage, // spread index
  activeSide,
  onSideChange,
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
  isGenerating = false,
}: StorybookPreviewProps) {
  const pages = storybook?.pages || [];
  const spreadCount = Math.max(1, Math.ceil(pages.length / 2));
  const leftPage = pages[currentPage * 2];
  const rightPage = pages[currentPage * 2 + 1];
  const leftImage = leftPage?.image_url || leftPage?.imageUrl || '/placeholder.svg';
  const rightImage = rightPage?.image_url || rightPage?.imageUrl || '/placeholder.svg';

  // Show skeleton loading during generation
  if (isGenerating) {
    return (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 animate-pulse gap-4">
        <div className="relative bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center p-6 min-h-0 rounded-lg">
          <div className="aspect-square w-full max-w-sm bg-gray-300 rounded-lg"></div>
        </div>
        <div className="relative bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center p-6 min-h-0 rounded-lg">
          <div className="aspect-square w-full max-w-sm bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
      {/* Left page (editable) */}
      <div className="relative bg-gradient-to-br from-purple-200 to-pink-200 flex flex-col p-4 rounded-lg min-h-0">
        {(storybook?.pages?.length || 0) > 1 && (
          <Button
            variant="outline"
            size="icon"
            onClick={onDeleteClick}
            disabled={isDeleting === (leftPage?.page_number || currentPage * 2 + 1)}
            className="absolute top-3 right-3 bg-gray-100 hover:bg-red-100 border-gray-300 hover:border-red-300 text-gray-600 hover:text-red-600 w-8 h-8 transition-colors"
          >
            {isDeleting === (leftPage?.page_number || currentPage * 2 + 1) ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        )}
        <div className="flex-1 flex flex-col items-center gap-3">
          <div className="relative aspect-square w-full max-w-sm">
            <img
              src={leftImage}
              alt={`Page ${leftPage?.page_number || currentPage * 2 + 1}`}
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="w-full max-w-xl bg-white/90 border border-gray-200 shadow-sm rounded-md p-3 h-[180px] overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>Loading storybook...</span>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">Error loading storybook: {error}</div>
            ) : (
              <Textarea
                value={activeSide === 'left' ? (pageText ?? '') : (leftPage?.script_text || leftPage?.scriptText || '')}
                onChange={(e) => {
                  if (activeSide !== 'left') onSideChange('left');
                  setPageText(e.target.value);
                }}
                onFocus={() => onSideChange('left')}
                className="w-full h-full text-base leading-relaxed text-gray-700 resize-none border-0 bg-transparent p-0 focus:ring-0 focus:border-0"
                placeholder="Enter your story text here..."
                disabled={isPageFetching}
              />
            )}
            <div className="text-[11px] text-muted-foreground flex justify-between items-center mt-2">
              <span>
                Page {leftPage?.page_number ?? currentPage * 2 + 1} of {storybook?.pages?.length || 0}
              </span>
              <div className="flex items-center gap-2">
                {pageStatus === 'saving' && <span className="text-purple-400">Saving...</span>}
                {pageStatus === 'saved' && <span className="text-purple-700">Saved</span>}
                {pageStatus === 'error' && <span className="text-red-500">Save failed</span>}
                {pageManagementError && (
                  <span className="text-red-500 cursor-pointer" onClick={clearError}>
                    Page error: {pageManagementError}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right page (read-only) */}
      <div className="relative bg-gradient-to-br from-purple-200 to-pink-200 flex flex-col p-4 rounded-lg min-h-0">
        <div className="flex-1 flex flex-col items-center gap-3">
          <div className="relative aspect-square w-full max-w-sm">
            <img
              src={rightImage}
              alt={`Page ${rightPage?.page_number || currentPage * 2 + 2}`}
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="w-full max-w-xl bg-white/90 border border-gray-200 shadow-sm rounded-md p-3 h-[150px] overflow-auto">
            {rightPage ? (
              <Textarea
                value={activeSide === 'right' ? (pageText ?? '') : (rightPage?.script_text || rightPage?.scriptText || '')}
                onChange={(e) => {
                  if (activeSide !== 'right') onSideChange('right');
                  setPageText(e.target.value);
                }}
                onFocus={() => onSideChange('right')}
                className="w-full h-full text-base leading-relaxed text-gray-700 resize-none border-0 bg-transparent p-0 focus:ring-0 focus:border-0"
                placeholder="Enter your story text here..."
                disabled={isPageFetching}
              />
            ) : (
              <p className="text-base text-muted-foreground text-center py-6">No content for this page yet.</p>
            )}
            <div className="text-[11px] text-muted-foreground mt-2">
              Page {rightPage?.page_number ?? currentPage * 2 + 2} of {storybook?.pages?.length || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
