import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../shared/components/ui/button";
import { Card, CardContent } from "../shared/components/ui/card";
import { Badge } from "../shared/components/ui/badge";
import { Separator } from "../shared/components/ui/separator";
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Share, 
  Download, 
  Edit3,
  ArrowLeft,
  BookOpen
} from "lucide-react";
import { storybookApi } from "@/features/storybook";
import { useSession, useUser } from "@clerk/clerk-react";

type ViewerPage = { id: string; text?: string; imageUrl?: string };
type ViewerStory = { id: string; title: string; pages: ViewerPage[]; ownerUserId?: string };

const BookViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [story, setStory] = useState<ViewerStory | null>(null);
  const { session, isLoaded } = useSession();
  const { user } = useUser();

  useEffect(() => {
    if (!id) return;
    if (!isLoaded) return;
    let mounted = true;
    setIsLoading(true);
    (async () => {
      const token = await session?.getToken({ template: 'storybook4me' });
      const res = await storybookApi.get(id, token || undefined);
      if (!mounted) return;
      const sb = res.storybook;
      const pages: ViewerPage[] = (sb.pages || []).map((p: any) => ({
        id: p.id,
        text: p.script_text,
        imageUrl: p.image_url || '/cover.png',
      }));
      // Some responses may use camelCase userId; fall back to snake_case if present
      const ownerId = (sb as any).userId ?? (sb as any).user_id;
      setStory({ id: sb.id, title: sb.title, pages, ownerUserId: ownerId });
      setCurrentPage(0);
      setIsLoading(false);
    })().catch(() => setIsLoading(false));
    return () => { mounted = false; };
  }, [id, isLoaded, session]);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (story && currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement audio playback
    console.log("Toggle audio playback");
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    navigator.clipboard.writeText(window.location.href);
    console.log("Story link copied to clipboard");
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export story as PDF");
  };

  const handleEdit = () => {
    navigate(`/studio/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading || !story) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
            <p className="text-muted-foreground">Loading story...</p>
          </div>
        </main>
      </div>
    );
  }

  const currentPageData = story.pages[currentPage];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-8 gap-3">
            <Button variant="outline" onClick={handleBack} className="flex items-center gap-2 shrink-0">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1 min-w-0 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 truncate" title={story.title}>{story.title}</h1>
            </div>

            {/* Action Buttons (owner only) */}
            {story.ownerUserId && user?.id === story.ownerUserId ? (
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share" className="hover:bg-transparent">
                  <Share className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleExport} aria-label="Export" className="hover:bg-transparent">
                  <Download className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleEdit} aria-label="Edit" className="hover:bg-transparent">
                  <Edit3 className="w-6 h-6" />
                </Button>
              </div>
            ) : (
              <div className="shrink-0" />
            )}
          </div>

          {/* Book Viewer */}
          <div className="relative max-w-4xl mx-auto">
            <Card className="glass-effect overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                  {/* Image Side */}
                  <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-8">
                    <div className="aspect-square w-full max-w-sm">
                      <img 
                        src={currentPageData.imageUrl} 
                        alt={`Page ${currentPage + 1}`}
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Text Side */}
                  <div className="p-8 flex flex-col justify-center relative">
                    <div className="text-center lg:text-left">
                      <div className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">
                        {currentPageData.text}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePlayAudio}
                        className={`absolute bottom-4 right-4 flex items-center gap-2 ${isPlaying ? 'bg-purple-100' : ''}`}
                        aria-label="Listen"
                        title="Listen"
                      >
                        <Volume2 className="w-4 h-4" />
                        {isPlaying ? 'Pause' : 'Listen'}
                      </Button>
                      
                      <Separator className="my-6" />
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Page {currentPage + 1} of {story.pages.length}</span>
                        <div className="flex gap-1">
                          {story.pages.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentPage ? 'bg-purple-500' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 lg:-left-16">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="w-12 h-12 rounded-full shadow-lg bg-white/90 backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:-right-16">
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === story.pages.length - 1}
                className="w-12 h-12 rounded-full shadow-lg bg-white/90 backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex justify-center gap-4 mt-6 lg:hidden">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === story.pages.length - 1}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookViewerPage;