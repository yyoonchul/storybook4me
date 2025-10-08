import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoryCard } from "../features/explore/components/StoryCard";
import { Input } from "../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shared/components/ui/select";
import { Search } from "lucide-react";
import { useExploreStories, useCategories } from "../features/explore/hooks";
import { SortType } from "../features/explore/types";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortType>(SortType.LATEST);
  
  const { stories, isLoading, error, fetchStories } = useExploreStories();
  
  const { categories } = useCategories();

  const handleSearch = () => {
    fetchStories({
      q: query || undefined,
      category: category === 'all' ? undefined : category,
      sort: sortBy,
      limit: 50
    });
  };

  const handleSortChange = (value: string) => {
    const newSort = value as SortType;
    setSortBy(newSort);
    fetchStories({
      q: query || undefined,
      category: category === 'all' ? undefined : category,
      sort: newSort,
      limit: 50
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-3">Explore Stories</h1>
          <p className="text-muted-foreground mb-8">Browse community stories. Use search, filters, and sorting to find what you like.</p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-8">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search by title, author, or tag" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[140px]">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name} ({cat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[140px]">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SortType.LATEST}>Latest</SelectItem>
                  <SelectItem value={SortType.POPULAR}>Most Popular</SelectItem>
                  <SelectItem value={SortType.VIEWED}>Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Filter button removed; search with Enter or change sort/category */}
          </div>

          {/* Stories Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={`explore-skeleton-${i}`} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-t-lg mb-4" />
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Failed to load stories: {error}</p>
              <div>
                <a
                  onClick={() => fetchStories()}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Try Again
                </a>
              </div>
            </div>
          ) : !stories || stories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No stories found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stories?.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePage;