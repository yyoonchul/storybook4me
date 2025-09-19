import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export type Story = {
  id: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  coverUrl?: string;
  likes: number;
  views: number;
  createdAt: string; // ISO date
  isPremium?: boolean;
};

type StoryCardProps = {
  story: Story;
  onOpen?: (id: string) => void;
};

const StoryCard = ({ story, onOpen }: StoryCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {story.coverUrl ? (
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img src={story.coverUrl} alt={story.title} className="h-full w-full object-cover" />
        </div>
      ) : null}
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg">{story.title}</CardTitle>
        <CardDescription>by {story.author}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{story.category}</Badge>
          {story.tags.map((t) => (
            <Badge key={t} variant="outline">{t}</Badge>
          ))}
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-4">
          <span>❤ {story.likes}</span>
          <span>👁 {story.views}</span>
          <span title={new Date(story.createdAt).toLocaleString()}>📅 {new Date(story.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full" onClick={() => onOpen?.(story.id)}>Open</Button>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
