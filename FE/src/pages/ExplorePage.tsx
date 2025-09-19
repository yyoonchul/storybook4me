import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import StoryCard, { type Story } from "../shared/components/StoryCard";
import { Input } from "../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shared/components/ui/select";
import { useMemo, useState } from "react";

const sampleStories: Story[] = [
  {
    id: "1",
    title: "The Dawn of Nova",
    author: "Alice Kim",
    category: "Sci‑Fi",
    tags: ["space", "AI"],
    coverUrl: "/cover.png",
    likes: 124,
    views: 2301,
    createdAt: "2025-08-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Whispers in the Library",
    author: "J. Park",
    category: "Mystery",
    tags: ["library", "secret"],
    coverUrl: "/cover.png",
    likes: 89,
    views: 1400,
    createdAt: "2025-07-12T10:00:00Z",
  },
  {
    id: "3",
    title: "A Garden of Numbers",
    author: "Min Lee",
    category: "Fantasy",
    tags: ["math", "adventure"],
    coverUrl: "/cover.png",
    likes: 201,
    views: 4102,
    createdAt: "2025-05-22T10:00:00Z",
  },
  {
    id: "4",
    title: "Circuit Hearts",
    author: "Dana Cho",
    category: "Romance",
    tags: ["startup", "future"],
    coverUrl: "/cover.png",
    likes: 45,
    views: 780,
    createdAt: "2025-09-05T10:00:00Z",
  },
];

const categories = ["All", "Sci‑Fi", "Mystery", "Fantasy", "Romance"] as const;
const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most popular" },
  { value: "views", label: "Most viewed" },
] as const;

type SortKey = typeof sortOptions[number]["value"];

const ExplorePage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [sortBy, setSortBy] = useState<SortKey>("latest");

  const filtered = useMemo(() => {
    let list = [...sampleStories];

    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // category
    if (category !== "All") {
      list = list.filter((s) => s.category === category);
    }

    // sorting
    list.sort((a, b) => {
      if (sortBy === "latest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sortBy === "popular") return b.likes - a.likes;
      if (sortBy === "views") return b.views - a.views;
      return 0;
    });

    return list;
  }, [query, category, sortBy]);

  const onOpen = (id: string) => {
    // TODO: navigate to story viewer
    console.log("open story", id);
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
              <Input placeholder="Search by title, author, or tag" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="w-full sm:w-auto sm:min-w-[140px]">
              <Select value={category} onValueChange={(v) => setCategory(v as (typeof categories)[number])}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[140px]">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((story) => (
              <StoryCard key={story.id} story={story} onOpen={onOpen} />)
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePage;