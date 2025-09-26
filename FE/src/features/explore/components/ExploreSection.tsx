import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Search, Filter, ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExploreStories, useCategories } from '../hooks';
import { StoryCard } from './StoryCard';
import { SortType } from '../types';

interface ExploreSectionProps {
  title?: string;
  showFilters?: boolean;
  showMoreStories?: boolean;
  limit?: number;
  className?: string;
}

export function ExploreSection({ 
  title = "Explore Stories", 
  showFilters = true,
  showMoreStories = true,
  limit = 6,
  className = ""
}: ExploreSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortType>(SortType.LATEST);
  const navigate = useNavigate();
  
  const { stories, isLoading, error, fetchStories } = useExploreStories({
    limit
  });
  
  const { categories } = useCategories();

  const handleSearch = () => {
    fetchStories({
      q: searchQuery || undefined,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      sort: sortBy,
      limit
    });
  };

  const handleSortChange = (value: string) => {
    const newSort = value as SortType;
    setSortBy(newSort);
    fetchStories({
      q: searchQuery || undefined,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      sort: newSort,
      limit
    });
  };

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-500 mb-4">Failed to load stories: {error}</p>
        <Button onClick={() => fetchStories()}>Try Again</Button>
      </div>
    );
  }

  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showMoreStories && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-purple-100" 
            onClick={() => navigate('/explore')}
          >
            <ArrowRightCircle className="w-4 h-4 mr-2" />
            More Stories
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortType.LATEST}>Latest</SelectItem>
              <SelectItem value={SortType.POPULAR}>Most Popular</SelectItem>
              <SelectItem value={SortType.VIEWED}>Most Viewed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleSearch} className="w-full sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={`explore-skeleton-${i}`} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-gray-200 rounded-t-lg" />
                <div className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No stories found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} variant="compact" />
          ))}
        </div>
      )}
    </section>
  );
}
