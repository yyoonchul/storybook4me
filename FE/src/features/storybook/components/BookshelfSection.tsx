import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Switch } from '@/shared/components/ui/switch';
import { Globe, Lock, Trash2, Edit3, Save, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookshelf } from '../hooks/useBookshelf';
import { useBookshelfManagement } from '../hooks/useBookshelfManagement';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

export function BookshelfSection() {
  const navigate = useNavigate();
  const { items, isLoading, error, removeItem, updateVisibility } = useBookshelf();
  const { toggleVisibility, deleteStorybook, createStorybook } = useBookshelfManagement();
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">My Bookshelf</h2>
        <div className="flex gap-2">
          {isEditMode ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 hover:bg-purple-100"
              >
                Done
              </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2 hover:bg-purple-100"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-purple-100" onClick={async () => { await createStorybook(''); navigate('/studio?mode=settings'); }}>
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={`bookshelf-skel-${i}`}>
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-muted animate-pulse rounded-t-lg" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
      <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((book) => (
          <Card 
            key={book.id} 
            className={`hover-lift ${!isEditMode ? 'cursor-pointer' : ''} relative group`}
            onClick={!isEditMode ? () => navigate(`/book/${book.id}`) : undefined}
          >
            <CardContent className="p-0">
              <div className="aspect-[3/4] bg-gray-200 rounded-t-lg overflow-hidden relative">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                {/* Visibility indicator */}
                <div className="absolute top-2 right-2">
                  {book.isPublic ? (
                    <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg" title="Public">
                      <Globe className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="bg-gray-600 text-white p-1.5 rounded-full shadow-lg" title="Private">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                </div>
                {/* Edit controls overlay - only show when in edit mode */}
                {isEditMode && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/studio/${book.id}`);
                        }}
                        className="flex items-center gap-2 bg-transparent border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white shadow-lg px-4 py-2 transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Story
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDeleteId(book.id);
                          setConfirmOpen(true);
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg px-4 py-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Story
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium line-clamp-2">{book.title}</p>
                {isEditMode && (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {book.isPublic ? (
                        <>
                          <Globe className="w-3 h-3 text-green-600" />
                          <span>Public</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-gray-600" />
                          <span>Private</span>
                        </>
                      )}
                    </div>
                    <Switch
                      checked={book.isPublic}
                      onCheckedChange={async () => {
                        const next = !book.isPublic;
                        await toggleVisibility(book.id, next);
                        updateVisibility(book.id, next);
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this storybook?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setConfirmOpen(false); setPendingDeleteId(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-red-600 focus-visible:ring-red-300 transition-colors"
              onClick={async () => {
                if (pendingDeleteId) {
                  await deleteStorybook(pendingDeleteId);
                  removeItem(pendingDeleteId);
                }
                setConfirmOpen(false);
                setPendingDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
      )}
    </div>
  );
}


