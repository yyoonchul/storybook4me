import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../shared/components/ui/button";
import { Card, CardContent } from "../shared/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Share, 
  Download, 
  Edit3,
  ArrowLeft,
  BookOpen
} from "lucide-react";
import { storybookApi } from "@/features/storybook";
import { useSession, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

type ViewerPage = { id: string; text?: string; imageUrl?: string };
type ViewerStory = { id: string; title: string; pages: ViewerPage[]; ownerUserId?: string };

const BookViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentSpread, setCurrentSpread] = useState(0); // spread index (2 pages per turn)
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
        id: p.id || `page-${Math.random()}`,
        text: p.script_text || "No content available",
        imageUrl: p.image_url || '/cover.png',
      }));
      // Some responses may use camelCase userId; fall back to snake_case if present
      const ownerId = (sb as any).userId ?? (sb as any).user_id;
      setStory({ id: sb.id, title: sb.title, pages, ownerUserId: ownerId });
      setCurrentSpread(0);
      setIsLoading(false);
    })().catch(() => setIsLoading(false));
    return () => { mounted = false; };
  }, [id, isLoaded, session]);

  const handlePrevPage = () => {
    if (currentSpread > 0) {
      setCurrentSpread(currentSpread - 1);
    }
  };

  const handleNextPage = () => {
    const spreadCount = story ? Math.max(1, Math.ceil((story.pages?.length || 0) / 2)) : 1;
    if (currentSpread < spreadCount - 1) {
      setCurrentSpread(currentSpread + 1);
    }
  };

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied to clipboard!", {
        description: "You can now share this story with others.",
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link", {
        description: "Please try again.",
      });
    }
  };

  const handleExport = () => {
    toast.info("Coming Soon!", {
      description: "Download feature is currently in development.",
    });
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

  // 현재 페이지 데이터를 안전하게 가져오기
  const leftPage = story.pages && story.pages.length > 0 && currentSpread * 2 < story.pages.length 
    ? story.pages[currentSpread * 2] 
    : null;
  const rightPage = story.pages && story.pages.length > 0 && currentSpread * 2 + 1 < story.pages.length 
    ? story.pages[currentSpread * 2 + 1] 
    : null;

  // 안전한 기본값 설정
  const safeLeftPage = leftPage || {
    id: `page-${currentSpread * 2}`,
    text: "No content available",
    imageUrl: "/cover.png"
  };
  const safeRightPage = rightPage || {
    id: `page-${currentSpread * 2 + 1}`,
    text: "No content available",
    imageUrl: "/cover.png"
  };

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

          {/* Book Viewer - two-page view */}
          <div className="relative max-w-5xl mx-auto">
            <Card className="glass-effect overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] gap-6 bg-gradient-to-br from-purple-100 to-pink-100 p-6">
                  {/* Left Page */}
                  <div className="bg-white/85 rounded-lg shadow p-4 flex flex-col items-center gap-4">
                    <div className="relative aspect-square w-full max-w-[240px]">
                      <img
                        src={safeLeftPage.imageUrl || "/cover.png"}
                        alt={`Page ${currentSpread * 2 + 1}`}
                        className="absolute inset-0 w-full h-full object-cover rounded-md shadow-lg"
                        onError={(e) => { e.currentTarget.src = "/cover.png"; }}
                      />
                    </div>
                    <div className="w-full bg-white/95 border border-gray-200 shadow-sm rounded-md p-3 h-[180px] overflow-auto">
                      <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {safeLeftPage.text}
                      </p>
                    </div>
                  </div>

                  {/* Right Page */}
                  <div className="bg-white/85 rounded-lg shadow p-4 flex flex-col items-center gap-4">
                    <div className="relative aspect-square w-full max-w-[240px]">
                      <img
                        src={safeRightPage.imageUrl || "/cover.png"}
                        alt={`Page ${currentSpread * 2 + 2}`}
                        className="absolute inset-0 w-full h-full object-cover rounded-md shadow-lg"
                        onError={(e) => { e.currentTarget.src = "/cover.png"; }}
                      />
                    </div>
                    <div className="w-full bg-white/95 border border-gray-200 shadow-sm rounded-md p-3 h-[180px] overflow-auto">
                      <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {safeRightPage.text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-4 border-t bg-white/80 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentSpread === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentSpread * 2 + 1} - {Math.min(story.pages.length, currentSpread * 2 + 2)} of {story.pages.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentSpread >= Math.max(1, Math.ceil((story.pages?.length || 0) / 2)) - 1}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookViewerPage;