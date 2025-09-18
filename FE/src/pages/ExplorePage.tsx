import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import StoryCard, { type Story } from "../shared/components/StoryCard";
import { Input } from "../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shared/components/ui/select";
import { Switch } from "../shared/components/ui/switch";
import { Label } from "../shared/components/ui/label";
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
    isPremium: false,
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
    isPremium: true,
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
    isPremium: false,
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
    isPremium: true,
  },
];

const categories = ["All", "Sci‑Fi", "Mystery", "Fantasy", "Romance"] as const;
const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most popular" },
  { value: "views", label: "Most viewed" },
] as const;

type SortKey = typeof sortOptions[number]["value"];

enum PremiumFilter {
  All = "all",
  Free = "free",
  Premium = "premium",
}

const ExplorePage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [premium, setPremium] = useState<PremiumFilter>(PremiumFilter.All);
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

    // premium filter
    if (premium === PremiumFilter.Free) list = list.filter((s) => !s.isPremium);
    if (premium === PremiumFilter.Premium) list = list.filter((s) => s.isPremium);

    // sorting
    list.sort((a, b) => {
      if (sortBy === "latest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sortBy === "popular") return b.likes - a.likes;
      if (sortBy === "views") return b.views - a.views;
      return 0;
    });

    return list;
  }, [query, category, premium, sortBy]);

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-8">
            <div className="md:col-span-2">
              <Input placeholder="Search by title, author, or tag" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div>
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
            <div>
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

          {/* Premium toggle row */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Switch id="pf-all" checked={premium === PremiumFilter.All} onCheckedChange={(v) => v && setPremium(PremiumFilter.All)} />
              <Label htmlFor="pf-all">All</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="pf-free" checked={premium === PremiumFilter.Free} onCheckedChange={(v) => v && setPremium(PremiumFilter.Free)} />
              <Label htmlFor="pf-free">Free</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="pf-premium" checked={premium === PremiumFilter.Premium} onCheckedChange={(v) => v && setPremium(PremiumFilter.Premium)} />
              <Label htmlFor="pf-premium">Premium</Label>
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