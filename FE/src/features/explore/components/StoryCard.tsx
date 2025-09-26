import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Heart, Eye, User, Calendar } from 'lucide-react';
import { PublicStorybookSummary } from '../types';
import { useStoryInteractions } from '../hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface StoryCardProps {
  story: PublicStorybookSummary;
  onLike?: (storybookId: string) => void;
  variant?: 'default' | 'compact';
}

export function StoryCard({ story, onLike, variant = 'default' }: StoryCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const { toggleLike, incrementView, isLiked } = useStoryInteractions();
  const navigate = useNavigate();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;

    setIsLiking(true);
    try {
      await toggleLike(story.id);
      onLike?.(story.id);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCardClick = async () => {
    try {
      await incrementView(story.id);
      navigate(`/book/${story.id}`);
    } catch (error) {
      console.error('Failed to increment view count:', error);
      // Still navigate even if view count fails
      navigate(`/book/${story.id}`);
    }
  };

  return (
    <Card 
      className="hover-lift cursor-pointer group"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className={`${variant === 'compact' ? 'aspect-[4/5]' : 'aspect-[3/4]'} bg-gray-200 rounded-t-lg overflow-hidden relative`}>
          <img 
            src={story.coverImageUrl || '/cover.png'} 
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {story.category || 'General'}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">
            {story.title}
          </h3>

          {variant === 'default' ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <User className="w-4 h-4" />
                <span>{story.author.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{story.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{story.likeCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {story.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {story.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{story.tags.length - 2}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`${
                    isLiked(story.id) 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked(story.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{story.viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{story.likeCount}</span>
                </div>
              </div>
              <span className="text-xs">{new Date(story.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
