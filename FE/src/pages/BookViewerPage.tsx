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

// Mock story data - replace with API call
const mockStory = {
  id: "1",
  title: "The Dawn of Nova",
  author: "Alice Kim",
  category: "Sci‑Fi",
  tags: ["space", "AI"],
  pages: [
    {
      id: 1,
      text: "In the year 2157, young Nova gazed out at the stars from her space station home. The twinkling lights seemed to whisper secrets of distant worlds waiting to be discovered.",
      imageUrl: "/cover.png"
    },
    {
      id: 2,
      text: "Nova's robot companion, Zyx, whirred softly beside her. 'The exploration ship arrives tomorrow,' Zyx announced with excitement in his digital voice.",
      imageUrl: "/cover.png"
    },
    {
      id: 3,
      text: "As the massive exploration vessel docked, Nova felt her heart race with anticipation. This was her chance to explore the unknown regions of the galaxy.",
      imageUrl: "/cover.png"
    },
    {
      id: 4,
      text: "Captain Luna welcomed Nova aboard with a warm smile. 'Ready for the adventure of a lifetime?' she asked, her eyes twinkling like the stars themselves.",
      imageUrl: "/cover.png"
    },
    {
      id: 5,
      text: "And so began Nova's greatest adventure, traveling through cosmic storms and discovering new worlds filled with wonder and mystery.",
      imageUrl: "/cover.png"
    }
  ]
};

const BookViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [id]);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < mockStory.pages.length - 1) {
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

  if (isLoading) {
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

  const currentPageData = mockStory.pages[currentPage];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header Controls */}
          <div className="relative flex items-center justify-between mb-8">
            <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            {/* Absolutely centered title */}
            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">{mockStory.title}</h1>
              <p className="text-muted-foreground">by {mockStory.author}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayAudio}
                className={`flex items-center gap-2 ${isPlaying ? 'bg-purple-100' : ''}`}
              >
                <Volume2 className="w-4 h-4" />
                {isPlaying ? 'Pause' : 'Listen'}
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
                <Share className="w-4 h-4" />
                Share
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleEdit} className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
            </div>
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
                  <div className="p-8 flex flex-col justify-center">
                    <div className="text-center lg:text-left">
                      <div className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">
                        {currentPageData.text}
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Page {currentPage + 1} of {mockStory.pages.length}</span>
                        <div className="flex gap-1">
                          {mockStory.pages.map((_, index) => (
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
                disabled={currentPage === mockStory.pages.length - 1}
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
                disabled={currentPage === mockStory.pages.length - 1}
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